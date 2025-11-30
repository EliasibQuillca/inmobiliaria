<?php

namespace App\Http\Controllers\Asesor;

use App\Http\Controllers\Controller;
use App\Models\Reserva;
use App\Models\Cotizacion;
use App\Models\Departamento;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ReservaController extends Controller
{
    /**
     * Muestra las reservas del asesor
     */
    public function index()
    {
        $asesor = Auth::user()->asesor;

        $reservas = Reserva::with(['cotizacion.cliente.usuario', 'cotizacion.departamento', 'venta'])
            ->where('asesor_id', $asesor->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Asesor/Reservas', [
            'reservas' => $reservas,
            'auth' => [
                'user' => Auth::user()
            ]
        ]);
    }

    /**
     * Muestra el formulario para crear una nueva reserva
     */
    public function create(Request $request)
    {
        $asesor = Auth::user()->asesor;

        // Obtener cotizaciones aceptadas que aún no tienen reserva
        $cotizacionesDisponibles = Cotizacion::with(['cliente.usuario', 'departamento'])
            ->where('asesor_id', $asesor->id)
            ->where('estado', 'aceptada')
            ->whereDoesntHave('reserva')
            ->orderBy('created_at', 'desc')
            ->get();

        // Verificar si hay cotizaciones disponibles
        if ($cotizacionesDisponibles->isEmpty()) {
            return redirect('/asesor/reservas')
                ->with('warning', 'No hay cotizaciones aceptadas disponibles para crear una reserva. Primero debes tener cotizaciones aceptadas por los clientes.');
        }

        // Si viene una cotización específica, pre-seleccionarla
        $cotizacionSeleccionada = null;
        if ($request->has('cotizacion_id')) {
            $cotizacionSeleccionada = $cotizacionesDisponibles
                ->where('id', $request->cotizacion_id)
                ->first();
        }

        return Inertia::render('Asesor/Reservas/Crear', [
            'cotizaciones' => $cotizacionesDisponibles,
            'cotizacionSeleccionada' => $cotizacionSeleccionada,
            'auth' => [
                'user' => Auth::user()
            ]
        ]);
    }

    /**
     * Crear reserva desde cotización aceptada
     */
    public function store(Request $request)
    {
        $asesor = Auth::user()->asesor;

        $validated = $request->validate([
            'cotizacion_id' => 'required|exists:cotizaciones,id',
            'fecha_inicio' => 'required|date|after_or_equal:today',
            'fecha_fin' => 'required|date|after:fecha_inicio',
            'monto_reserva' => 'required|numeric|min:0',
            'notas' => 'nullable|string|max:1000',
        ]);

        // Verificar que la cotización pertenece al asesor y está aceptada
        $cotizacion = Cotizacion::where('asesor_id', $asesor->id)
            ->where('estado', 'aceptada')
            ->findOrFail($validated['cotizacion_id']);

        // Verificar que el departamento sigue disponible
        $departamento = Departamento::where('id', $cotizacion->departamento_id)
            ->where('estado', 'disponible')
            ->firstOrFail();

        $reserva = Reserva::create([
            'cotizacion_id' => $cotizacion->id,
            'cliente_id' => $cotizacion->cliente_id,
            'asesor_id' => $asesor->id,
            'departamento_id' => $cotizacion->departamento_id,
            'fecha_reserva' => now(),
            'fecha_inicio' => $validated['fecha_inicio'],
            'fecha_fin' => $validated['fecha_fin'],
            'monto_reserva' => $validated['monto_reserva'],
            'monto_total' => $cotizacion->monto - $cotizacion->descuento,
            'estado' => 'pendiente',
            'notas' => $validated['notas'],
        ]);

        // La cotización mantiene su estado 'aceptada' con una reserva asociada
        // El scopeHistorial() automáticamente la moverá al historial

        // Cambiar estado del departamento a reservado
        $departamento->update(['estado' => 'reservado']);

        return redirect()->route('asesor.reservas')
            ->with('success', 'Reserva creada exitosamente');
    }

    /**
     * Mostrar detalles de una reserva
     */
    public function show($id)
    {
        $asesor = Auth::user()->asesor;

        $reserva = Reserva::with(['cotizacion.cliente.usuario', 'cotizacion.departamento'])
            ->where('asesor_id', $asesor->id)
            ->findOrFail($id);

        return Inertia::render('Asesor/Reservas/Detalle', [
            'reserva' => $reserva,
            'auth' => [
                'user' => Auth::user()
            ]
        ]);
    }

    /**
     * Confirmar reserva (cuando cliente paga)
     */
    public function confirmar(Request $request, $id)
    {
        $asesor = Auth::user()->asesor;

        $validated = $request->validate([
            'notas' => 'nullable|string|max:1000',
        ]);

        $reserva = Reserva::where('asesor_id', $asesor->id)
            ->findOrFail($id);

        $reserva->update([
            'estado' => 'confirmada',
            'notas' => $validated['notas'] ?? $reserva->notas,
        ]);

        return redirect()->back()->with('success', 'Reserva confirmada exitosamente');
    }

    /**
     * Cancelar reserva
     */
    public function cancelar(Request $request, $id)
    {
        $asesor = Auth::user()->asesor;

        $validated = $request->validate([
            'motivo' => 'required|string|max:500',
        ]);

        $reserva = Reserva::where('asesor_id', $asesor->id)
            ->findOrFail($id);

        $reserva->update([
            'estado' => 'cancelada',
            'notas' => $validated['motivo'],
        ]);

        // Liberar el departamento
        $departamento = Departamento::find($reserva->departamento_id);
        if ($departamento) {
            $departamento->update(['estado' => 'disponible']);
        }

        return redirect()->back()->with('success', 'Reserva cancelada');
    }

    /**
     * Actualizar reserva
     */
    public function update(Request $request, $id)
    {
        $asesor = Auth::user()->asesor;

        $validated = $request->validate([
            'fecha_inicio' => 'required|date|after_or_equal:today',
            'fecha_fin' => 'required|date|after:fecha_inicio',
            'monto_reserva' => 'required|numeric|min:0',
            'notas' => 'nullable|string|max:1000',
        ]);

        $reserva = Reserva::where('asesor_id', $asesor->id)
            ->where('estado', 'pendiente')
            ->findOrFail($id);

        $reserva->update($validated);

        return redirect()->back()->with('success', 'Reserva actualizada exitosamente');
    }

    /**
     * Revertir confirmación (solo si no tiene venta asociada)
     */
    public function revertir(Request $request, $id)
    {
        $asesor = Auth::user()->asesor;

        $validated = $request->validate([
            'motivo' => 'required|string|max:500',
        ]);

        $reserva = Reserva::where('asesor_id', $asesor->id)
            ->where('estado', 'confirmada')
            ->findOrFail($id);

        // Verificar que no tenga venta asociada
        if ($reserva->venta) {
            return redirect()->back()->with('error', 'No se puede revertir una reserva que ya tiene venta asociada');
        }

        $reserva->update([
            'estado' => 'pendiente',
            'notas' => $validated['motivo'],
        ]);

        return redirect()->back()->with('success', 'Confirmación revertida. La reserva vuelve a estado pendiente.');
    }
}
