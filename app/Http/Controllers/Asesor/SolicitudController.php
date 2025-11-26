<?php

namespace App\Http\Controllers\Asesor;

use App\Http\Controllers\Controller;
use App\Models\Cliente;
use App\Models\Departamento;
use App\Models\User;
use App\Models\Solicitud;
use App\Models\Cotizacion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Inertia\Inertia;

class SolicitudController extends Controller
{
    /**
     * Muestra las solicitudes e inquietudes de clientes
     */
    public function index()
    {
        $asesor = Auth::user()->asesor;

        // Validar que exista un asesor logueado
        if (!$asesor) {
            abort(403, 'No tiene un asesor asociado.');
        }

        // Obtener SOLICITUDES (tabla separada) asignadas al asesor
        $solicitudes = Solicitud::with([
            'cliente.usuario',
            'departamento.imagenes' => function ($q) {
                $q->where('activa', true)->orderBy('orden')->limit(1);
            },
            'departamento.atributos'
        ])
            ->where('asesor_id', $asesor->id)
            ->orderBy('created_at', 'desc')
            ->get();

        // 🔥 NUEVO: Obtener COTIZACIONES que actúan como solicitudes de clientes
        $cotizacionesSolicitudes = Cotizacion::with([
            'cliente.usuario',
            'departamento.imagenes' => function ($q) {
                $q->where('activa', true)->orderBy('orden')->limit(1);
            },
            'departamento.atributos',
            'asesor.usuario'
        ])
            ->where('asesor_id', $asesor->id)
            ->whereIn('estado', ['pendiente', 'en_proceso', 'aceptada', 'rechazada'])
            ->whereNotNull('tipo_solicitud') // Solo las que son solicitudes de clientes
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function($cot) {
                // Mapear cotizaciones al formato de solicitudes para compatibilidad con el frontend
                return [
                    'id' => $cot->id,
                    'cliente' => $cot->cliente,
                    'departamento' => $cot->departamento,
                    'asesor' => $cot->asesor,
                    'tipo_consulta' => $cot->tipo_solicitud,
                    'mensaje_solicitud' => $cot->mensaje_solicitud,
                    'telefono' => $cot->telefono_contacto,
                    'estado' => $cot->estado,
                    'notas_asesor' => $cot->notas,
                    'created_at' => $cot->created_at,
                    'updated_at' => $cot->updated_at,
                    'es_cotizacion' => true, // Flag para identificar
                    'monto' => $cot->monto,
                    'descuento' => $cot->descuento,
                    'fecha_validez' => $cot->fecha_validez,
                ];
            });

        // Combinar solicitudes y cotizaciones
        $todasLasSolicitudes = $solicitudes->concat($cotizacionesSolicitudes)->sortByDesc('created_at')->values();

        // Agrupar por estado
        $solicitudesPendientes = $todasLasSolicitudes->where('estado', 'pendiente')->values();
        $solicitudesAprobadas = $todasLasSolicitudes->where('estado', 'aprobada')->values();
        $solicitudesRechazadas = $todasLasSolicitudes->where('estado', 'rechazada')->values();
        $solicitudesEnProceso = $todasLasSolicitudes->where('estado', 'en_proceso')->values();

        // Clientes sin solicitudes (nuevos)
        $clientesNuevos = Cliente::with(['usuario', 'departamentoInteres'])
            ->where('asesor_id', $asesor->id)
            ->whereNotNull('nombre')
            ->where('nombre', '!=', '')
            ->whereDoesntHave('solicitudes')
            ->orderBy('created_at', 'desc')
            ->get();

        // Departamentos disponibles
        $departamentosInteres = Departamento::where('estado', 'disponible')
            ->with(['imagenes' => function ($q) {
                $q->where('activa', true)->orderBy('orden')->limit(1);
            }])
            ->orderBy('precio')
            ->get();

        // Estadísticas adicionales
        $estadisticas = [
            'total_solicitudes' => $todasLasSolicitudes->count(),
            'pendientes' => $solicitudesPendientes->count(),
            'en_proceso' => $solicitudesEnProceso->count(),
            'aprobadas' => $solicitudesAprobadas->count(),
            'rechazadas' => $solicitudesRechazadas->count(),
            'clientes_nuevos' => $clientesNuevos->count(),
        ];

        return Inertia::render('Asesor/Solicitudes', [
            'solicitudes' => $todasLasSolicitudes,
            'solicitudesPendientes' => $solicitudesPendientes,
            'solicitudesEnProceso' => $solicitudesEnProceso,
            'solicitudesAprobadas' => $solicitudesAprobadas,
            'solicitudesRechazadas' => $solicitudesRechazadas,
            'clientesNuevos' => $clientesNuevos,
            'departamentosInteres' => $departamentosInteres,
            'estadisticas' => $estadisticas,
            'asesor' => [
                'id' => $asesor->id,
                'nombre' => $asesor->nombre,
                'email' => $asesor->email ?? Auth::user()->email,
            ]
        ]);
    }

    /**
     * Registrar contacto de cliente por WhatsApp/teléfono
     */
    public function registrarContacto(Request $request)
    {
        $asesor = Auth::user()->asesor;
        if (!$asesor) {
            abort(403, 'No tiene un asesor asociado.');
        }

        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'telefono' => 'required|string|max:20|unique:clientes,telefono',
            'email' => 'nullable|email|unique:users,email',
            'departamento_interes' => 'nullable|exists:departamentos,id',
            'notas_contacto' => 'nullable|string|max:1000',
            'medio_contacto' => 'required|in:whatsapp,telefono,presencial',
            'dni' => 'nullable|string|max:20|unique:clientes,dni',
        ]);

        // Crear usuario temporal (si hay email)
        $usuario = null;
        if (!empty($validated['email'])) {
            $usuario = User::create([
                'name' => $validated['nombre'],
                'email' => $validated['email'],
                'password' => bcrypt(Str::random(10)),
                'role' => 'cliente',
            ]);
        }

        // Registrar cliente
        $cliente = Cliente::create([
            'usuario_id' => $usuario?->id,
            'asesor_id' => $asesor->id,
            'nombre' => $validated['nombre'],
            'telefono' => $validated['telefono'],
            'email' => $validated['email'] ?? null,
            'departamento_interes' => $validated['departamento_interes'] ?? null,
            'notas_contacto' => $validated['notas_contacto'] ?? null,
            'medio_contacto' => $validated['medio_contacto'],
            'estado' => 'contactado',
            'dni' => $validated['dni'] ?? 'TEMP-' . time(),
            'direccion' => 'Por definir',
            'fecha_registro' => now(),
        ]);

        return redirect()->route('asesor.solicitudes')
            ->with('success', 'Contacto de cliente registrado exitosamente.');
    }

    /**
     * Actualizar estado de una solicitud (busca en ambas tablas: solicitudes y cotizaciones)
     */
    public function actualizarEstado(Request $request, $solicitudId)
    {
        $asesor = Auth::user()->asesor;
        if (!$asesor) {
            abort(403, 'No tiene un asesor asociado.');
        }

        $validated = $request->validate([
            'estado' => 'required|in:pendiente,en_proceso,aprobada,aceptada,rechazada,finalizada',
            'notas' => 'nullable|string|max:1000',
            'motivo_rechazo' => 'nullable|string|max:1000',
        ]);

        // 🔥 Buscar primero en cotizaciones (solicitudes de clientes)
        $solicitud = Cotizacion::where('asesor_id', $asesor->id)
            ->with(['cliente', 'departamento'])
            ->find($solicitudId);

        // Si no existe en cotizaciones, buscar en solicitudes
        if (!$solicitud) {
            $solicitud = Solicitud::where('asesor_id', $asesor->id)
                ->with(['cliente', 'departamento'])
                ->findOrFail($solicitudId);
            
            $esSolicitudTabla = true;
        } else {
            $esSolicitudTabla = false;
        }

        // Actualizar campos según el estado y el tipo (solicitud o cotización)
        if ($esSolicitudTabla) {
            // Tabla solicitudes
            $updateData = [
                'estado' => $validated['estado'],
                'notas_asesor' => $validated['notas'] ?? $solicitud->notas_asesor,
            ];

            if ($validated['estado'] === 'aprobada') {
                $updateData['fecha_aprobacion'] = now();
            } elseif ($validated['estado'] === 'rechazada') {
                $updateData['fecha_rechazo'] = now();
                $updateData['motivo_rechazo'] = $validated['motivo_rechazo'] ?? null;
            }
        } else {
            // Tabla cotizaciones
            $updateData = [
                'estado' => $validated['estado'],
                'notas' => $validated['notas'] ?? $solicitud->notas,
            ];

            if ($validated['estado'] === 'rechazada') {
                $updateData['motivo_rechazo_cliente'] = $validated['motivo_rechazo'] ?? null;
            }
        }

        // IMPORTANTE: Asignar el cliente al asesor automáticamente si acepta
        if (in_array($validated['estado'], ['aprobada', 'aceptada', 'en_proceso'])) {
            if ($solicitud->cliente && !$solicitud->cliente->asesor_id) {
                $solicitud->cliente->update([
                    'asesor_id' => $asesor->id,
                    'estado' => 'interesado'
                ]);

                Log::info('Cliente asignado automáticamente al asesor', [
                    'cliente_id' => $solicitud->cliente->id,
                    'asesor_id' => $asesor->id
                ]);
            }
        }

        $solicitud->update($updateData);

        // Log de la acción
        Log::info('Estado de solicitud actualizado', [
            'solicitud_id' => $solicitud->id,
            'nuevo_estado' => $validated['estado'],
            'asesor_id' => $asesor->id,
            'cliente' => $solicitud->cliente->nombre ?? 'N/A'
        ]);

        // Retornar con Inertia
        return back()->with('success', "Solicitud actualizada a: " . ucfirst($validated['estado']));
    }

    /**
     * Responder a la solicitud del cliente con información y cotización
     */
    public function responderSolicitud(Request $request, $solicitudId)
    {
        $asesor = Auth::user()->asesor;
        if (!$asesor) {
            abort(403, 'No tiene un asesor asociado.');
        }

        $validated = $request->validate([
            'monto' => 'required|numeric|min:0',
            'descuento' => 'nullable|numeric|min:0|max:100',
            'fecha_validez' => 'nullable|date|after:today',
            'notas' => 'nullable|string|max:2000',
            'condiciones' => 'nullable|string|max:2000',
        ]);

        // Buscar la solicitud (puede estar en cotizaciones o solicitudes)
        $solicitud = Cotizacion::where('asesor_id', $asesor->id)
            ->with(['cliente', 'departamento'])
            ->find($solicitudId);

        // Si no existe en cotizaciones, buscar en solicitudes
        if (!$solicitud) {
            $solicitudOriginal = Solicitud::where('asesor_id', $asesor->id)
                ->with(['cliente', 'departamento'])
                ->findOrFail($solicitudId);
            
            // Crear una cotización basada en la solicitud
            $solicitud = Cotizacion::create([
                'asesor_id' => $asesor->id,
                'cliente_id' => $solicitudOriginal->cliente_id,
                'departamento_id' => $solicitudOriginal->departamento_id,
                'tipo_solicitud' => $solicitudOriginal->tipo_consulta,
                'mensaje_solicitud' => $solicitudOriginal->mensaje_solicitud,
                'telefono_contacto' => $solicitudOriginal->telefono,
                'estado' => 'en_proceso',
                'monto' => $validated['monto'],
                'descuento' => $validated['descuento'] ?? 0,
                'fecha' => now(),
                'fecha_validez' => $validated['fecha_validez'] ?? now()->addDays(15),
                'notas' => $validated['notas'] ?? null,
                'condiciones' => $validated['condiciones'] ?? 'Sujeto a disponibilidad y aprobación crediticia.',
            ]);

            // Actualizar estado de la solicitud original
            $solicitudOriginal->update(['estado' => 'aprobada']);
        } else {
            // Actualizar la cotización existente con la respuesta del asesor
            $solicitud->update([
                'estado' => 'en_proceso',
                'monto' => $validated['monto'],
                'descuento' => $validated['descuento'] ?? 0,
                'fecha' => now(),
                'fecha_validez' => $validated['fecha_validez'] ?? now()->addDays(15),
                'notas' => $validated['notas'] ?? null,
                'condiciones' => $validated['condiciones'] ?? 'Sujeto a disponibilidad y aprobación crediticia.',
            ]);
        }

        // Calcular monto final con descuento para el mensaje
        $montoFinal = $solicitud->monto;
        if (!empty($solicitud->descuento)) {
            $descuentoMonto = ($solicitud->monto * $solicitud->descuento) / 100;
            $montoFinal = $solicitud->monto - $descuentoMonto;
        }

        // TODO: Enviar notificación al cliente (email/SMS)

        Log::info('Solicitud respondida por asesor', [
            'solicitud_id' => $solicitud->id,
            'asesor_id' => $asesor->id,
            'monto' => $validated['monto'],
            'descuento' => $validated['descuento'] ?? 0,
        ]);

        return redirect()->route('asesor.solicitudes')
            ->with('success', "Respuesta enviada a {$solicitud->cliente->nombre}. Monto: S/ " . number_format($montoFinal, 2));
    }

    /**
     * Ver detalles de una solicitud específica
     */
    public function verDetalle($solicitudId)
    {
        $asesor = Auth::user()->asesor;
        if (!$asesor) {
            abort(403, 'No tiene un asesor asociado.');
        }

        $solicitud = Cotizacion::with([
            'cliente.usuario',
            'departamento.imagenes' => function ($q) {
                $q->where('activa', true)->orderBy('orden');
            },
            'departamento.atributos',
        ])
            ->where('asesor_id', $asesor->id)
            ->findOrFail($solicitudId);

        // Extraer el teléfono del mensaje si está presente
        $telefono = null;
        if (preg_match('/Teléfono de contacto:\s*(.+?)(\n|$)/i', $solicitud->mensaje_solicitud, $matches)) {
            $telefono = trim($matches[1]);
        }

        // Extraer el tipo de consulta
        $tipoConsulta = null;
        if (preg_match('/Tipo de consulta:\s*(.+?)(\n|$)/i', $solicitud->mensaje_solicitud, $matches)) {
            $tipoConsulta = trim($matches[1]);
        }

        // Extraer el mensaje adicional si existe
        $mensajeAdicional = null;
        if (preg_match('/Mensaje adicional del cliente:\s*(.+)/is', $solicitud->mensaje_solicitud, $matches)) {
            $mensajeAdicional = trim($matches[1]);
        }

        return response()->json([
            'success' => true,
            'solicitud' => [
                'id' => $solicitud->id,
                'estado' => $solicitud->estado,
                'tipo_solicitud' => $solicitud->tipo_solicitud,
                'tipo_consulta_texto' => $tipoConsulta,
                'telefono' => $telefono,
                'mensaje_solicitud' => $solicitud->mensaje_solicitud,
                'mensaje_adicional' => $mensajeAdicional,
                'monto' => $solicitud->monto,
                'fecha_validez' => $solicitud->fecha_validez,
                'created_at' => $solicitud->created_at,
                'cliente' => [
                    'id' => $solicitud->cliente->id,
                    'nombre' => $solicitud->cliente->usuario->name ?? 'Cliente',
                    'email' => $solicitud->cliente->usuario->email ?? '',
                    'dni' => $solicitud->cliente->dni ?? '',
                ],
                'departamento' => [
                    'id' => $solicitud->departamento->id,
                    'codigo' => $solicitud->departamento->codigo,
                    'titulo' => $solicitud->departamento->titulo,
                    'precio' => $solicitud->departamento->precio,
                    'ubicacion' => $solicitud->departamento->ubicacion,
                    'area' => $solicitud->departamento->area,
                    'dormitorios' => $solicitud->departamento->dormitorios,
                    'banos' => $solicitud->departamento->banos,
                    'imagen_principal' => $solicitud->departamento->imagenes->first()?->url ?? null,
                    'atributos' => $solicitud->departamento->atributos->pluck('nombre'),
                ],
            ]
        ]);
    }

    /**
     * Ver detalle de solicitud con query params (para compatibilidad con Inertia route())
     */
    public function verDetalleQuery(Request $request)
    {
        $solicitudId = $request->query('id');
        if (!$solicitudId) {
            abort(400, 'ID de solicitud no proporcionado');
        }

        return $this->verDetalle($solicitudId);
    }

    /**
     * Actualizar estado de seguimiento del cliente
     */
    public function actualizarSeguimiento(Request $request, $clienteId)
    {
        $asesor = Auth::user()->asesor;
        if (!$asesor) {
            abort(403, 'No tiene un asesor asociado.');
        }

        $validated = $request->validate([
            'estado' => 'required|in:contactado,interesado,sin_interes,perdido',
            'notas_seguimiento' => 'nullable|string|max:1000',
        ]);

        $cliente = Cliente::where('asesor_id', $asesor->id)->findOrFail($clienteId);

        $cliente->update([
            'estado' => $validated['estado'],
            'notas_seguimiento' => $validated['notas_seguimiento'] ?? null,
        ]);

        return redirect()->back()->with('success', 'Estado de seguimiento actualizado.');
    }

    /**
     * Mostrar historial de contactos del cliente
     */
    public function historialCliente($clienteId)
    {
        $asesor = Auth::user()->asesor;
        if (!$asesor) {
            abort(403, 'No tiene un asesor asociado.');
        }

        $cliente = Cliente::with(['usuario', 'cotizaciones.departamento', 'reservas.venta'])
            ->where('asesor_id', $asesor->id)
            ->findOrFail($clienteId);

        // TODO: Crear vista Asesor/Solicitudes/Historial.jsx
        return redirect()->route('asesor.solicitudes')
            ->with('cliente_detalle', $cliente);
    }

    /**
     * Agendar cita o reunión con cliente
     */
    public function agendarCita(Request $request, $clienteId)
    {
        $asesor = Auth::user()->asesor;
        if (!$asesor) {
            abort(403, 'No tiene un asesor asociado.');
        }

        $validated = $request->validate([
            'fecha_cita' => 'required|date|after:now',
            'tipo_cita' => 'required|in:presencial,virtual,telefonica',
            'ubicacion' => 'nullable|string|max:255',
            'notas_cita' => 'nullable|string|max:500',
        ]);

        $cliente = Cliente::where('asesor_id', $asesor->id)->findOrFail($clienteId);

        $cliente->update([
            'fecha_cita' => $validated['fecha_cita'],
            'tipo_cita' => $validated['tipo_cita'],
            'ubicacion_cita' => $validated['ubicacion'] ?? null,
            'notas_cita' => $validated['notas_cita'] ?? null,
            'estado' => 'cita_agendada',
        ]);

        return redirect()->back()->with('success', 'Cita agendada exitosamente.');
    }

    /**
     * Buscar departamentos según criterios del cliente
     */
    public function buscarDepartamentos(Request $request)
    {
        $validated = $request->validate([
            'precio_min' => 'nullable|numeric|min:0',
            'precio_max' => 'nullable|numeric|min:0|gte:precio_min',
            'habitaciones' => 'nullable|integer|min:1',
            'banos' => 'nullable|numeric|min:0.5',
            'ubicacion' => 'nullable|string|max:255',
        ]);

        $query = Departamento::where('estado', 'disponible');

        if (!empty($validated['precio_min'])) {
            $query->where('precio', '>=', $validated['precio_min']);
        }

        if (!empty($validated['precio_max'])) {
            $query->where('precio', '<=', $validated['precio_max']);
        }

        if (!empty($validated['habitaciones'])) {
            $query->where('habitaciones', $validated['habitaciones']);
        }

        // 🔧 Corrige campo: Laravel no acepta variables con "ñ" en DB
        if (!empty($validated['banos'])) {
            $query->where('banos', $validated['banos']);
        }

        if (!empty($validated['ubicacion'])) {
            $query->where('ubicacion', 'like', '%' . $validated['ubicacion'] . '%');
        }

        $departamentos = $query->orderBy('precio')->get();

        return response()->json([
            'departamentos' => $departamentos
        ]);
    }
}
