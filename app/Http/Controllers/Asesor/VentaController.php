<?php

namespace App\Http\Controllers\Asesor;

use App\Http\Controllers\Controller;
use App\Models\Venta;
use App\Models\Reserva;
use App\Models\Departamento;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

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
            ->get();

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
                    'estado' => 'vendido',
                    'disponible' => false
                ]);
            }
        }

        // Marcar cotización como finalizada
        $cotizacion = $reserva->cotizacion;
        if ($cotizacion) {
            $cotizacion->marcarFinalizada();
        }

        return redirect()->route('asesor.ventas')
            ->with('success', 'Venta registrada exitosamente');
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

        // Si viene una reserva específica, pre-seleccionarla
        $reservaSeleccionada = null;
        if ($request->has('reserva_id')) {
            $reservaSeleccionada = $reservas->where('id', $request->reserva_id)->first();
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

        // 3. Verificar periodo de tiempo (7 días desde la venta)
        if ($venta->diasDesdeVenta() > 7) {
            return redirect()->back()
                ->withErrors(['error' => 'No puedes editar una venta después de 7 días de registrada.']);
        }

        // GUARDAR DATOS ANTERIORES PARA HISTORIAL
        $datosAnteriores = $venta->only([
            'fecha_venta',
            'monto_final',
            'observaciones'
        ]);

        // ACTUALIZAR LA VENTA
        $venta->update([
            'fecha_venta' => $validated['fecha_venta'],
            'monto_final' => $validated['monto_final'],
            'observaciones' => $validated['observaciones'],
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

        return redirect()->route('asesor.ventas')
            ->with('success', $mensaje);
    }

    /**
     * Marcar documentos como entregados
     */
    public function marcarDocumentosEntregados($id)
    {
        $asesor = Auth::user()->asesor;

        $venta = Venta::with(['reserva.cotizacion.departamento'])
            ->whereHas('reserva', function($query) use ($asesor) {
                $query->where('asesor_id', $asesor->id);
            })
            ->findOrFail($id);

        // Verificar que no estén ya entregados
        if ($venta->documentos_entregados) {
            return redirect()->back()
                ->with('warning', 'Los documentos ya fueron marcados como entregados anteriormente.');
        }

        // Marcar como entregados usando el método del modelo
        $venta->marcarDocumentosEntregados(Auth::id());

        // Crear registro en historial
        \App\Models\VentaHistorial::create([
            'venta_id' => $venta->id,
            'usuario_id' => Auth::id(),
            'accion' => 'entrega_documentos',
            'datos_anteriores' => [
                'documentos_entregados' => false,
                'fecha_entrega_documentos' => null
            ],
            'datos_nuevos' => [
                'documentos_entregados' => true,
                'fecha_entrega_documentos' => $venta->fresh()->fecha_entrega_documentos
            ],
            'motivo' => 'Entrega de documentos al cliente',
            'observaciones' => 'Documentos entregados y departamento marcado como vendido'
        ]);

        return redirect()->back()
            ->with('success', '✓ Documentos marcados como entregados exitosamente.');
    }
}
