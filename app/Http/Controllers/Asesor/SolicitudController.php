<?php

namespace App\Http\Controllers\Asesor;

use App\Http\Controllers\Controller;
use App\Models\Cliente;
use App\Models\Departamento;
use App\Models\User;
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

        // Obtener cotizaciones asignadas al asesor con relaciones completas
        $solicitudes = Cotizacion::with([
            'cliente.usuario',
            'departamento.imagenes' => function ($q) {
                $q->where('activa', true)->orderBy('orden')->limit(1);
            },
            'departamento.atributos'
        ])
            ->where('asesor_id', $asesor->id)
            ->whereHas('cliente', function ($query) {
                // Solo mostrar cotizaciones que tengan clientes válidos
                $query->whereNotNull('nombre')
                      ->where('nombre', '!=', '');
            })
            ->orderBy('created_at', 'desc')
            ->get();

        // Agrupar por estado con nombres más descriptivos
        $solicitudesPendientes = $solicitudes->where('estado', 'pendiente')->values();
        $solicitudesEnProceso = $solicitudes->where('estado', 'en_proceso')->values();
        $solicitudesAprobadas = $solicitudes->whereIn('estado', ['aprobada', 'aceptada'])->values();
        $solicitudesRechazadas = $solicitudes->whereIn('estado', ['rechazada', 'cancelada'])->values();

        // Clientes sin cotizaciones (nuevos) con datos válidos
        $clientesNuevos = Cliente::with(['usuario', 'cotizaciones', 'departamentoInteres'])
            ->where('asesor_id', $asesor->id)
            ->whereNotNull('nombre')
            ->where('nombre', '!=', '')
            ->whereDoesntHave('cotizaciones')
            ->orderBy('created_at', 'desc')
            ->get();

        // Departamentos disponibles para cotización
        $departamentosInteres = Departamento::where('estado', 'disponible')
            ->with(['imagenes' => function ($q) {
                $q->where('activa', true)->orderBy('orden')->limit(1);
            }])
            ->orderBy('precio')
            ->get();

        // Estadísticas adicionales
        $estadisticas = [
            'total_solicitudes' => $solicitudes->count(),
            'pendientes' => $solicitudesPendientes->count(),
            'en_proceso' => $solicitudesEnProceso->count(),
            'aprobadas' => $solicitudesAprobadas->count(),
            'rechazadas' => $solicitudesRechazadas->count(),
            'clientes_nuevos' => $clientesNuevos->count(),
        ];

        return Inertia::render('Asesor/Solicitudes', [
            'solicitudes' => $solicitudes,
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
     * Actualizar estado de una solicitud (cotización)
     */
    public function actualizarEstado(Request $request, $solicitudId)
    {
        $asesor = Auth::user()->asesor;
        if (!$asesor) {
            abort(403, 'No tiene un asesor asociado.');
        }

        $validated = $request->validate([
            'estado' => 'required|in:pendiente,en_proceso,aprobada,aceptada,rechazada,cancelada',
            'notas' => 'nullable|string|max:1000',
            'observaciones' => 'nullable|string|max:1000', // Alias para compatibilidad
        ]);

        $solicitud = Cotizacion::where('asesor_id', $asesor->id)
            ->with(['cliente', 'departamento'])
            ->findOrFail($solicitudId);

        // Validar que existe el cliente asociado
        if (!$solicitud->cliente || empty($solicitud->cliente->nombre)) {
            return redirect()->back()
                ->with('error', 'La solicitud no tiene un cliente válido asociado.');
        }

        $solicitud->update([
            'estado' => $validated['estado'],
            'notas' => $validated['notas'] ?? $validated['observaciones'] ?? $solicitud->notas,
        ]);

        // Log de la acción (opcional)
        Log::info('Estado de solicitud actualizado', [
            'solicitud_id' => $solicitud->id,
            'nuevo_estado' => $validated['estado'],
            'asesor_id' => $asesor->id,
            'cliente' => $solicitud->cliente->nombre
        ]);

        return redirect()->back()
            ->with('success', "Solicitud de {$solicitud->cliente->nombre} actualizada a: " . ucfirst($validated['estado']));
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

        $solicitud = Cotizacion::where('asesor_id', $asesor->id)
            ->with(['cliente', 'departamento'])
            ->findOrFail($solicitudId);

        // Calcular monto final con descuento
        $montoFinal = $validated['monto'];
        if (!empty($validated['descuento'])) {
            $descuentoMonto = ($validated['monto'] * $validated['descuento']) / 100;
            $montoFinal = $validated['monto'] - $descuentoMonto;
        }

        // Actualizar la cotización con la respuesta del asesor
        $solicitud->update([
            'estado' => 'en_proceso',
            'monto' => $validated['monto'],
            'descuento' => $validated['descuento'] ?? 0,
            'fecha' => now(),
            'fecha_validez' => $validated['fecha_validez'] ?? now()->addDays(15),
            'notas' => $validated['notas'] ?? null,
            'condiciones' => $validated['condiciones'] ?? 'Sujeto a disponibilidad y aprobación crediticia.',
        ]);

        // TODO: Enviar notificación al cliente (email/SMS)

        Log::info('Solicitud respondida por asesor', [
            'solicitud_id' => $solicitud->id,
            'asesor_id' => $asesor->id,
            'monto' => $validated['monto'],
            'descuento' => $validated['descuento'] ?? 0,
        ]);

        return redirect()->back()
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

        // TODO: crear vista Asesor/Solicitudes/Detalle.jsx
        return redirect()->route('asesor.solicitudes')
            ->with('solicitud_detalle', $solicitud);
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
