<?php

namespace App\Http\Controllers\Asesor;

use App\Http\Controllers\Controller;
use App\Models\Venta;
use App\Models\Reserva;
use App\Models\Departamento;
use App\Models\AuditoriaUsuario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;

class VentaController extends Controller
{
    /**
     * Muestra las ventas del asesor
     */
    public function index()
    {
        $asesor = Auth::user()->asesor;

        $ventas = Venta::with(['reserva.cotizacion.cliente.usuario', 'reserva.cotizacion.departamento'])
            ->whereHas('reserva', function($query) use ($asesor) {
                $query->where('asesor_id', $asesor->id);
            })
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function($venta) {
                // Verificar si ya fue gestionado con "Gestionar Documentos"
                $venta->documentos_ya_gestionados = \App\Models\VentaHistorial::where('venta_id', $venta->id)
                    ->where('accion', 'entrega_documentos')
                    ->exists();
                return $venta;
            });

        return Inertia::render('Asesor/Ventas', [
            'ventas' => $ventas
        ]);
    }

    /**
     * Registrar nueva venta presencial
     */
    public function store(Request $request)
    {
        $asesor = Auth::user()->asesor;

        $validated = $request->validate([
            'reserva_id' => 'required|exists:reservas,id',
            'fecha_venta' => 'required|date|before_or_equal:today',
            'monto_final' => 'required|numeric|min:0',
            'documentos_entregados' => 'required|boolean',
            'observaciones' => 'nullable|string|max:1000',
        ]);

        // Verificar que la reserva pertenece al asesor y está confirmada
        $reserva = Reserva::where('asesor_id', $asesor->id)
            ->where('estado', 'confirmada')
            ->findOrFail($validated['reserva_id']);

        // Verificar que no existe ya una venta para esta reserva
        if (Venta::where('reserva_id', $reserva->id)->exists()) {
            return redirect()->back()
                ->withErrors(['reserva_id' => 'Ya existe una venta registrada para esta reserva']);
        }

        $venta = Venta::create([
            'reserva_id' => $reserva->id,
            'fecha_venta' => $validated['fecha_venta'],
            'monto_final' => $validated['monto_final'],
            'documentos_entregados' => $validated['documentos_entregados'],
            'observaciones' => $validated['observaciones'],
        ]);

        // Crear registro inicial en historial
        \App\Models\VentaHistorial::create([
            'venta_id' => $venta->id,
            'usuario_id' => Auth::id(),
            'accion' => 'creacion',
            'datos_anteriores' => null,
            'datos_nuevos' => $venta->only([
                'fecha_venta',
                'monto_final',
                'documentos_entregados',
                'observaciones'
            ]),
            'motivo' => 'Creación inicial de la venta',
            'observaciones' => 'Venta registrada por primera vez'
        ]);

        // Si los documentos fueron entregados, marcar departamento como vendido
        if ($validated['documentos_entregados']) {
            $departamento = Departamento::find($reserva->departamento_id);
            if ($departamento) {
                $departamento->update([
                    'estado' => 'vendido'
                ]);
            }
        }

        // Marcar cotización como finalizada
        $cotizacion = $reserva->cotizacion;
        if ($cotizacion) {
            $cotizacion->marcarFinalizada();
        }

        // 🔥 REGISTRAR ACCIÓN QUE REQUIERE APROBACIÓN DEL CLIENTE
        $departamento = Departamento::find($reserva->departamento_id);
        $comision = $validated['monto_final'] * 0.03; // 3% de comisión
        
        AuditoriaUsuario::registrarAccionConAprobacion([
            'usuario_id' => Auth::id(),
            'cliente_id' => $reserva->cliente_id,
            'accion' => 'venta_registrada_por_asesor',
            'modelo_tipo' => Venta::class,
            'modelo_id' => $venta->id,
            'titulo' => '🎉 ¡Venta registrada! Confirmación final',
            'descripcion' => "El asesor {$asesor->nombre} {$asesor->apellidos} ha registrado la venta del departamento \"{$departamento->titulo}\".\n\n💰 Monto final: S/ " . number_format($validated['monto_final'], 2) . "\n💼 Comisión: S/ " . number_format($comision, 2) . "\n📄 Documentos entregados: " . ($validated['documentos_entregados'] ? 'SÍ' : 'NO') . "\n📅 Fecha de venta: " . date('d/m/Y', strtotime($validated['fecha_venta'])) . "\n\n⚠️ Por favor confirma que todos los datos son correctos antes de finalizar.",
            'detalles' => [
                'venta_id' => $venta->id,
                'reserva_id' => $reserva->id,
                'departamento' => $departamento->titulo,
                'monto_final' => $validated['monto_final'],
                'comision' => $comision,
                'documentos_entregados' => $validated['documentos_entregados'],
                'fecha_venta' => $validated['fecha_venta'],
            ],
            'prioridad' => 'urgente',
        ]);

        return redirect()->route('asesor.ventas.index')
            ->with('success', 'Venta registrada exitosamente. El cliente recibirá una notificación para confirmar los datos.');
    }

    /**
     * Mostrar formulario para registrar venta
     */
    public function create(Request $request)
    {
        $asesor = Auth::user()->asesor;

        // Obtener reservas confirmadas que no tienen venta registrada
        $reservas = Reserva::with(['cotizacion.cliente.usuario', 'cotizacion.departamento'])
            ->where('asesor_id', $asesor->id)
            ->where('estado', 'confirmada')
            ->whereDoesntHave('venta')
            ->get();

        // Si viene una reserva específica, pre-seleccionarla (incluso si ya tiene venta para mostrar datos)
        $reservaSeleccionada = null;
        if ($request->has('reserva_id')) {
            // Buscar primero en reservas sin venta
            $reservaSeleccionada = $reservas->where('id', $request->reserva_id)->first();
            
            // Si no se encuentra, puede ser que ya tenga venta - cargarla para mostrar datos
            if (!$reservaSeleccionada) {
                $reservaSeleccionada = Reserva::with(['cotizacion.cliente.usuario', 'cotizacion.departamento', 'venta'])
                    ->where('asesor_id', $asesor->id)
                    ->where('id', $request->reserva_id)
                    ->first();
            }
        }

        return Inertia::render('Asesor/Ventas/Crear', [
            'reservas' => $reservas,
            'reservaSeleccionada' => $reservaSeleccionada,
            'auth' => [
                'user' => Auth::user()
            ]
        ]);
    }

    /**
     * Mostrar detalles de una venta
     */
    public function show($id)
    {
        $asesor = Auth::user()->asesor;

        $venta = Venta::with(['reserva.cotizacion.cliente.usuario', 'reserva.cotizacion.departamento'])
            ->whereHas('reserva', function($query) use ($asesor) {
                $query->where('asesor_id', $asesor->id);
            })
            ->findOrFail($id);

        return Inertia::render('Asesor/Ventas/Detalle', [
            'venta' => $venta,
            'auth' => [
                'user' => Auth::user()
            ]
        ]);
    }

    /**
     * Actualizar entrega de documentos
     */
    public function actualizarDocumentos(Request $request, $id)
    {
        $asesor = Auth::user()->asesor;

        $validated = $request->validate([
            'documentos_entregados' => 'required|boolean',
            'observaciones' => 'nullable|string|max:1000',
        ]);

        $venta = Venta::whereHas('reserva', function($query) use ($asesor) {
                $query->where('asesor_id', $asesor->id);
            })
            ->findOrFail($id);

        $venta->update($validated);

        // Si se confirma la entrega de documentos, marcar departamento como vendido
        if ($validated['documentos_entregados']) {
            $departamento = Departamento::find($venta->reserva->departamento_id);
            if ($departamento) {
                $departamento->update([
                    'estado' => 'vendido',
                    'disponible' => false
                ]);
            }
        }

        return redirect()->back()
            ->with('success', 'Estado de documentos actualizado exitosamente');
    }

    /**
     * Editar venta existente
     */
    public function edit($id)
    {
        $asesor = Auth::user()->asesor;

        $venta = Venta::with(['reserva.cotizacion.cliente.usuario', 'reserva.cotizacion.departamento'])
            ->whereHas('reserva', function($query) use ($asesor) {
                $query->where('asesor_id', $asesor->id);
            })
            ->findOrFail($id);

        // Agregar información de control de ediciones
        $venta->dias_desde_venta = $venta->diasDesdeVenta();
        $venta->puede_editarse = $venta->puedeEditarse();

        return Inertia::render('Asesor/Ventas/Editar', [
            'venta' => $venta,
            'auth' => [
                'user' => Auth::user()
            ]
        ]);
    }

    /**
     * Actualizar venta con control de ediciones
     */
    public function update(Request $request, $id)
    {
        $asesor = Auth::user()->asesor;

        $validated = $request->validate([
            'fecha_venta' => 'required|date|before_or_equal:today',
            'monto_final' => 'required|numeric|min:0',
            'documentos_entregados' => 'required|boolean',
            'observaciones' => 'nullable|string|max:1000',
            'motivo_edicion' => 'required|string|min:10|max:500', // Motivo obligatorio
        ]);

        $venta = Venta::with(['historial'])
            ->whereHas('reserva', function($query) use ($asesor) {
                $query->where('asesor_id', $asesor->id);
            })
            ->findOrFail($id);

        // VERIFICAR SI PUEDE EDITARSE

        // 1. Verificar si está bloqueada
        if ($venta->bloqueada_edicion) {
            return redirect()->back()
                ->withErrors(['error' => 'Esta venta está bloqueada para edición.']);
        }

        // 2. Verificar límite de ediciones
        if ($venta->cantidad_ediciones >= $venta->max_ediciones) {
            return redirect()->back()
                ->withErrors(['error' => "Has alcanzado el límite máximo de {$venta->max_ediciones} ediciones para esta venta."]);
        }

        // 3. Verificar periodo de tiempo (7 días desde el registro)
        if ($venta->diasDesdeVenta() > 7) {
            return redirect()->back()
                ->withErrors(['error' => 'No puedes editar una venta después de 7 días de haberla registrado en el sistema.']);
        }

        // GUARDAR DATOS ANTERIORES PARA HISTORIAL
        $datosAnteriores = $venta->only([
            'fecha_venta',
            'monto_final',
            'observaciones',
            'documentos_entregados'
        ]);

        // MANEJAR CAMBIO DE ESTADO DE DOCUMENTOS
        $cambioDocumentos = false;
        if (isset($validated['documentos_entregados']) && $validated['documentos_entregados'] != $venta->documentos_entregados) {
            $cambioDocumentos = true;
            
            $departamento = Departamento::find($venta->reserva->departamento_id);
            if ($departamento) {
                if ($validated['documentos_entregados']) {
                    // Marcar como vendido
                    $departamento->update(['estado' => 'vendido']);
                } else {
                    // Volver a reservado (NO disponible porque la venta existe)
                    $departamento->update(['estado' => 'reservado']);
                }
            }
        }

        // ACTUALIZAR LA VENTA
        $venta->update([
            'fecha_venta' => $validated['fecha_venta'],
            'monto_final' => $validated['monto_final'],
            'observaciones' => $validated['observaciones'],
            'documentos_entregados' => $validated['documentos_entregados'] ?? $venta->documentos_entregados,
            'cantidad_ediciones' => $venta->cantidad_ediciones + 1,
            'fecha_primera_edicion' => $venta->fecha_primera_edicion ?? now(),
            'fecha_ultima_edicion' => now(),
        ]);

        // CREAR REGISTRO EN HISTORIAL
        \App\Models\VentaHistorial::create([
            'venta_id' => $venta->id,
            'usuario_id' => Auth::id(),
            'accion' => 'edicion',
            'datos_anteriores' => $datosAnteriores,
            'datos_nuevos' => $venta->only([
                'fecha_venta',
                'monto_final',
                'observaciones'
            ]),
            'motivo' => $validated['motivo_edicion'],
            'observaciones' => "Edición #{$venta->cantidad_ediciones} de {$venta->max_ediciones} permitidas"
        ]);

        // VERIFICAR SI DEBE BLOQUEARSE
        if ($venta->cantidad_ediciones >= $venta->max_ediciones) {
            $venta->update(['bloqueada_edicion' => true]);
            $mensaje = 'Venta actualizada. ⚠️ Has alcanzado el límite máximo de ediciones. Esta venta ya no puede editarse.';
        } elseif ($venta->cantidad_ediciones == $venta->max_ediciones - 1) {
            $mensaje = "Venta actualizada. ⚠️ Solo tienes 1 edición más disponible.";
        } else {
            $edicionesRestantes = $venta->max_ediciones - $venta->cantidad_ediciones;
            $mensaje = "Venta actualizada. Te quedan {$edicionesRestantes} ediciones disponibles.";
        }

        return redirect()->route('asesor.ventas.index')
            ->with('success', $mensaje);
    }

    /**
     * Marcar documentos como entregados (SOLO SE PUEDE USAR UNA VEZ)
     */
    public function marcarDocumentosEntregados(Request $request, $id)
    {
        $asesor = Auth::user()->asesor;

        $validated = $request->validate([
            'documentos_entregados' => 'required|boolean',
            'observaciones' => 'nullable|string|max:1000'
        ]);

        $venta = Venta::with(['reserva.cotizacion.departamento'])
            ->whereHas('reserva', function($query) use ($asesor) {
                $query->where('asesor_id', $asesor->id);
            })
            ->findOrFail($id);

        // VERIFICAR SI YA SE GESTIONARON LOS DOCUMENTOS UNA VEZ
        // Si ya hay un registro de "entrega_documentos" en el historial, está bloqueado
        $yaGestionado = \App\Models\VentaHistorial::where('venta_id', $venta->id)
            ->where('accion', 'entrega_documentos')
            ->exists();

        if ($yaGestionado) {
            return redirect()->back()
                ->withErrors(['error' => 'Los documentos ya fueron gestionados. Para modificar, usa el botón "Editar" (sujeto a límites de edición).']);
        }

        // Guardar datos anteriores
        $datosAnteriores = [
            'documentos_entregados' => $venta->documentos_entregados,
            'fecha_entrega_documentos' => $venta->fecha_entrega_documentos,
            'observaciones' => $venta->observaciones
        ];

        // Actualizar venta
        $venta->update([
            'documentos_entregados' => $validated['documentos_entregados'],
            'fecha_entrega_documentos' => $validated['documentos_entregados'] ? now() : null,
            'observaciones' => $validated['observaciones'] ?? $venta->observaciones
        ]);

        // Actualizar estado del departamento
        $departamento = Departamento::find($venta->reserva->departamento_id);
        if ($departamento) {
            if ($validated['documentos_entregados']) {
                $departamento->update(['estado' => 'vendido']);
            } else {
                $departamento->update(['estado' => 'reservado']);
            }
        }

        // Crear registro en historial
        \App\Models\VentaHistorial::create([
            'venta_id' => $venta->id,
            'usuario_id' => Auth::id(),
            'accion' => 'entrega_documentos',
            'datos_anteriores' => $datosAnteriores,
            'datos_nuevos' => [
                'documentos_entregados' => $venta->documentos_entregados,
                'fecha_entrega_documentos' => $venta->fecha_entrega_documentos,
                'observaciones' => $venta->observaciones
            ],
            'motivo' => 'Gestión inicial de documentos',
            'observaciones' => $validated['observaciones'] ?? 'Sin observaciones adicionales'
        ]);

        $mensaje = $validated['documentos_entregados'] 
            ? '✓ Documentos marcados como entregados. Departamento actualizado a "vendido".'
            : '✓ Documentos gestionados. Para modificar nuevamente, usa "Editar".';

        return redirect()->back()
            ->with('success', $mensaje);
    }

    /**
     * REPORTE PDF: Mis Ventas
     */
    public function reporteMisVentasPDF(Request $request)
    {
        $asesor = Auth::user()->asesor;

        // Obtener ventas con filtros opcionales
        $query = Venta::with(['reserva.cotizacion.cliente.usuario', 'reserva.cotizacion.departamento'])
            ->whereHas('reserva', function($q) use ($asesor) {
                $q->where('asesor_id', $asesor->id);
            });

        // Filtros opcionales
        if ($request->mes) {
            $query->whereMonth('fecha_venta', $request->mes);
        }
        if ($request->anio) {
            $query->whereYear('fecha_venta', $request->anio);
        }

        $ventas = $query->orderBy('fecha_venta', 'desc')->get();

        // Calcular totales
        $totalVentas = $ventas->count();
        $totalMonto = $ventas->sum('monto_final');
        $totalComisiones = $ventas->sum('comision');

        $pdf = PDF::loadView('pdf.asesor.mis-ventas', [
            'asesor' => $asesor,
            'ventas' => $ventas,
            'totalVentas' => $totalVentas,
            'totalMonto' => $totalMonto,
            'totalComisiones' => $totalComisiones,
            'fechaGeneracion' => now(),
            'periodo' => $request->mes && $request->anio 
                ? \Carbon\Carbon::create($request->anio, $request->mes)->format('F Y')
                : 'Todas'
        ]);

        return $pdf->stream('reporte-mis-ventas-' . now()->format('Y-m-d') . '.pdf');
    }

    /**
     * REPORTE PDF: Historial Detallado de una Venta
     */
    public function historialVentaPDF($id)
    {
        $asesor = Auth::user()->asesor;

        $venta = Venta::with([
            'reserva.cotizacion.cliente.usuario',
            'reserva.cotizacion.departamento',
            'historial.usuario'
        ])
        ->whereHas('reserva', function($q) use ($asesor) {
            $q->where('asesor_id', $asesor->id);
        })
        ->findOrFail($id);

        // Ordenar historial cronológicamente
        $historial = $venta->historial()->with('usuario')->orderBy('created_at', 'asc')->get();

        $pdf = PDF::loadView('pdf.asesor.historial-venta', [
            'venta' => $venta,
            'historial' => $historial,
            'asesor' => $asesor,
            'fechaGeneracion' => now()
        ]);

        return $pdf->stream('historial-venta-' . $venta->id . '-' . now()->format('Y-m-d') . '.pdf');
    }
}
