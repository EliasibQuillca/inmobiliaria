<?php

namespace App\Http\Controllers\Asesor;

use App\Http\Controllers\Controller;
use App\Models\Cotizacion;
use App\Models\Solicitud;
use App\Models\Cliente;
use App\Models\Departamento;
use App\Models\AuditoriaUsuario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CotizacionController extends Controller
{
    /**
     * Muestra las cotizaciones del asesor
     */
    public function index(Request $request)
    {
        $asesor = Auth::user()->asesor;

        // Determinar si mostrar historial o cotizaciones activas
        $mostrarHistorial = $request->boolean('historial', false);

        if ($mostrarHistorial) {
            // Mostrar cotizaciones en historial
            $cotizaciones = Cotizacion::with(['cliente.usuario', 'departamento', 'reserva.venta'])
                ->where('asesor_id', $asesor->id)
                ->historial()
                ->orderBy('updated_at', 'desc')
                ->get();
        } else {
            // Mostrar todas las cotizaciones activas que tienen monto asignado
            // Esto incluye las cotizaciones formales Y las solicitudes que ya fueron aprobadas
            $cotizaciones = Cotizacion::with(['cliente.usuario', 'departamento', 'reserva'])
                ->where('asesor_id', $asesor->id)
                ->where(function($query) {
                    // Mostrar cotizaciones con monto asignado
                    $query->where(function($q) {
                        $q->whereNotNull('monto')
                          ->where('monto', '>', 0);
                    })
                    // O solicitudes aprobadas pendientes de completar
                    ->orWhere(function($q) {
                        $q->where('estado', 'aprobada')
                          ->whereNull('monto');
                    });
                })
                ->where(function($query) {
                    // Estados activos: pendiente, en_proceso, aprobada
                    $query->whereIn('estado', ['pendiente', 'en_proceso', 'aprobada'])
                          // O aceptada PERO SIN reserva creada
                          ->orWhere(function($q) {
                              $q->where('estado', 'aceptada')
                                ->doesntHave('reserva');
                          });
                })
                ->orderBy('created_at', 'desc')
                ->get();
        }

        return Inertia::render('Asesor/Cotizaciones', [
            'cotizaciones' => $cotizaciones,
            'mostrandoHistorial' => $mostrarHistorial
        ]);
    }

    /**
     * Mostrar formulario para crear cotización
     */
    public function create(Request $request)
    {
        $asesor = Auth::user()->asesor;

        // Si viene una solicitud_id, obtener la solicitud aprobada
        $solicitudSeleccionada = null;
        if ($request->has('solicitud_id')) {
            $solicitudSeleccionada = Solicitud::with(['cliente', 'departamento'])
                ->where('asesor_id', $asesor->id)
                ->where('id', $request->solicitud_id)
                ->where('estado', 'aprobada')
                ->first();
        }

        // Si viene un cliente_id específico, obtenerlo con sus preferencias
        $clienteSeleccionado = null;
        if ($request->has('cliente_id')) {
            $clienteSeleccionado = Cliente::where('asesor_id', $asesor->id)
                ->where('id', $request->cliente_id)
                ->first();
        }

        // Si hay solicitud, usar su cliente
        if ($solicitudSeleccionada) {
            $clienteSeleccionado = $solicitudSeleccionada->cliente;
        }

        // Obtener solo clientes del asesor actual con sus datos completos
        $clientes = Cliente::with('usuario')
            ->where('asesor_id', $asesor->id)
            ->get()
            ->map(function($cliente) {
                return [
                    'id' => $cliente->id,
                    'nombre' => $cliente->nombre_completo, // Usa el accessor
                    'dni' => $cliente->dni,
                    'telefono' => $cliente->telefono,
                    'email' => $cliente->email_completo, // Usa el accessor
                ];
            });

        // Obtener departamentos disponibles
        $departamentosQuery = Departamento::where('estado', 'disponible');

        // Si hay solicitud, pre-seleccionar el departamento
        $departamentoSeleccionado = null;
        if ($solicitudSeleccionada) {
            $departamentoSeleccionado = $solicitudSeleccionada->departamento;
        }

        // Si hay cliente seleccionado con preferencias específicas, aplicar filtros
        $departamentosFiltrados = [];
        $clienteTienePreferencias = false;
        if ($clienteSeleccionado) {
            $queryFiltrada = clone $departamentosQuery;
            $hayFiltros = false;

            // Verificar si el cliente tiene preferencias configuradas
            $clienteTienePreferencias = $clienteSeleccionado->habitaciones_deseadas 
                || ($clienteSeleccionado->presupuesto_min && $clienteSeleccionado->presupuesto_max);

            // Filtrar por preferencias del cliente si existen
            if ($clienteSeleccionado->habitaciones_deseadas) {
                $queryFiltrada->where('habitaciones', $clienteSeleccionado->habitaciones_deseadas);
                $hayFiltros = true;
            }
            if ($clienteSeleccionado->presupuesto_min && $clienteSeleccionado->presupuesto_max) {
                $queryFiltrada->whereBetween('precio', [
                    $clienteSeleccionado->presupuesto_min,
                    $clienteSeleccionado->presupuesto_max
                ]);
                $hayFiltros = true;
            }

            // Si se aplicaron filtros, obtener los departamentos filtrados
            if ($hayFiltros) {
                $departamentosFiltrados = $queryFiltrada->get();
            }
        }

        // Obtener todos los departamentos disponibles
        $departamentos = $departamentosQuery->get();

        return Inertia::render('Asesor/Cotizaciones/Crear', [
            'clientes' => $clientes,
            'departamentos' => $departamentos,
            'departamentosFiltrados' => $departamentosFiltrados,
            'clienteTienePreferencias' => $clienteTienePreferencias,
            'clienteSeleccionado' => $clienteSeleccionado,
            'departamentoSeleccionado' => $departamentoSeleccionado,
            'solicitud' => $solicitudSeleccionada,
        ]);
    }

    /**
     * Crear nueva cotización
     */
    public function store(Request $request)
    {
        $asesor = Auth::user()->asesor;

        // Validación inicial para obtener el monto
        $request->validate([
            'monto' => 'required|numeric|min:0',
        ]);

        $monto = $request->input('monto');
        $descuentoMaximo = $monto * 0.5;

        $validated = $request->validate([
            'cliente_id' => 'required|exists:clientes,id',
            'departamento_id' => 'required|exists:departamentos,id',
            'monto' => 'required|numeric|min:0',
            'descuento' => [
                'nullable',
                'numeric',
                'min:0',
                'max:' . $descuentoMaximo
            ],
            'fecha_validez' => 'required|date|after:today',
            'notas' => 'nullable|string|max:1000',
            'condiciones' => 'nullable|string|max:2000',
            'solicitud_id' => 'nullable|exists:solicitudes,id',
        ], [
            'descuento.max' => 'El descuento no puede ser mayor al 50% del precio base (máximo S/ ' . number_format($descuentoMaximo, 2) . ')'
        ]);

        $cotizacion = Cotizacion::create([
            'asesor_id' => $asesor->id,
            'cliente_id' => $validated['cliente_id'],
            'departamento_id' => $validated['departamento_id'],
            'fecha' => now(),
            'monto' => $validated['monto'],
            'descuento' => $validated['descuento'] ?? 0,
            'fecha_validez' => $validated['fecha_validez'],
            'estado' => 'en_proceso',
            'notas' => $validated['notas'],
            'condiciones' => $validated['condiciones'],
        ]);

        // Si viene de una solicitud, marcarla como finalizada
        if ($request->has('solicitud_id')) {
            $solicitud = Solicitud::where('id', $validated['solicitud_id'])
                ->where('asesor_id', $asesor->id)
                ->first();

            if ($solicitud) {
                $solicitud->update([
                    'estado' => 'finalizada',
                    'notas_asesor' => 'Cotización formal creada (ID: ' . $cotizacion->id . ')'
                ]);
            }
        }

        // 🔥 REGISTRAR ACCIÓN QUE REQUIERE APROBACIÓN DEL CLIENTE
        $cliente = Cliente::find($validated['cliente_id']);
        $departamento = Departamento::find($validated['departamento_id']);
        $precioFinal = $validated['monto'] - ($validated['descuento'] ?? 0);
        
        AuditoriaUsuario::registrarAccionConAprobacion([
            'usuario_id' => Auth::id(),
            'cliente_id' => $cliente->id,
            'accion' => 'cotizacion_creada_por_asesor',
            'modelo_tipo' => Cotizacion::class,
            'modelo_id' => $cotizacion->id,
            'titulo' => '📋 Tu asesor creó una cotización para ti',
            'descripcion' => "El asesor {$asesor->nombre} {$asesor->apellidos} ha creado una cotización para el departamento \"{$departamento->titulo}\".\n\n💰 Precio base: S/ " . number_format($validated['monto'], 2) . "\n🏷️ Descuento: S/ " . number_format($validated['descuento'] ?? 0, 2) . "\n✅ Precio final: S/ " . number_format($precioFinal, 2) . "\n📅 Válido hasta: " . date('d/m/Y', strtotime($validated['fecha_validez'])) . "\n\n⚠️ Por favor revisa y aprueba esta cotización para continuar con el proceso.",
            'detalles' => [
                'cotizacion_id' => $cotizacion->id,
                'departamento' => $departamento->titulo,
                'monto_base' => $validated['monto'],
                'descuento' => $validated['descuento'] ?? 0,
                'precio_final' => $precioFinal,
                'fecha_validez' => $validated['fecha_validez'],
            ],
            'prioridad' => 'alta',
        ]);

        return redirect()->route('asesor.cotizaciones')
            ->with('success', 'Cotización creada exitosamente. El cliente recibirá una notificación para aprobarla.');
    }

    /**
     * Mostrar detalles de una cotización
     */
    public function show($id)
    {
        $asesor = Auth::user()->asesor;

        $cotizacion = Cotizacion::with(['cliente.usuario', 'departamento', 'comentarios'])
            ->where('asesor_id', $asesor->id)
            ->findOrFail($id);

        return Inertia::render('Asesor/Cotizaciones/Detalle', [
            'cotizacion' => $cotizacion
        ]);
    }

    /**
     * Actualizar estado de cotización
     */
    public function updateEstado(Request $request, $id)
    {
        $asesor = Auth::user()->asesor;

        $validated = $request->validate([
            'estado' => 'required|in:pendiente,aceptada,rechazada,expirada',
            'notas' => 'nullable|string|max:1000',
        ]);

        $cotizacion = Cotizacion::where('asesor_id', $asesor->id)
            ->findOrFail($id);

        $cotizacion->update([
            'estado' => $validated['estado'],
            'notas' => $validated['notas'] ?? $cotizacion->notas,
        ]);

        return redirect()->back()->with('success', 'Estado de cotización actualizado');
    }

    /**
     * Editar cotización existente
     */
    public function edit($id)
    {
        $asesor = Auth::user()->asesor;

        $cotizacion = Cotizacion::with(['cliente.usuario', 'departamento'])
            ->where('asesor_id', $asesor->id)
            ->findOrFail($id);

        $clientes = Cliente::with('usuario')->get();
        $departamentos = Departamento::where('estado', 'disponible')->get();

        return Inertia::render('Asesor/Cotizaciones/Editar', [
            'cotizacion' => $cotizacion,
            'clientes' => $clientes,
            'departamentos' => $departamentos
        ]);
    }

    /**
     * Actualizar estado de cotización
     */
    public function actualizarEstado(Request $request, $id)
    {
        $asesor = Auth::user()->asesor;

        $validated = $request->validate([
            'estado' => 'required|in:pendiente,aceptada,rechazada,en_proceso,completada,cancelada,expirada',
            'notas' => 'nullable|string|max:1000',
        ]);

        $cotizacion = Cotizacion::where('asesor_id', $asesor->id)
            ->findOrFail($id);

        $cotizacion->update($validated);

        return redirect()->back()
            ->with('success', 'Estado de cotización actualizado');
    }

    /**
     * Actualizar cotización
     */
    public function update(Request $request, $id)
    {
        $asesor = Auth::user()->asesor;

        $cotizacion = Cotizacion::where('asesor_id', $asesor->id)
            ->findOrFail($id);

        $validated = $request->validate([
            'monto' => 'required|numeric|min:0',
            'descuento' => [
                'nullable',
                'numeric',
                'min:0',
                'max:' . ($cotizacion->monto * 0.5)
            ],
            'fecha_validez' => 'required|date|after:today',
            'notas' => 'nullable|string|max:1000',
            'condiciones' => 'nullable|string|max:2000',
        ], [
            'descuento.max' => 'El descuento no puede ser mayor al 50% del precio base (máximo S/ ' . number_format($cotizacion->monto * 0.5, 2) . ')'
        ]);

        $cotizacion->update($validated);

        return redirect()->route('asesor.cotizaciones')
            ->with('success', 'Cotización actualizada exitosamente');
    }
}
