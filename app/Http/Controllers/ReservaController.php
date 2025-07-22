<?php

namespace App\Http\Controllers;

use App\Models\Reserva;
use App\Models\Cotizacion;
use App\Models\Departamento;
use App\Models\Cliente;
use App\Models\Asesor;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReservaController extends Controller
{
    /**
     * Muestra la lista de reservas
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        $reservas = Reserva::with(['cliente', 'asesor', 'departamento', 'cotizacion'])
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('Asesor/Reservas', [
            'reservas' => $reservas,
            'filters' => request()->all('search', 'estado'),
        ]);
    }

    /**
     * Muestra el formulario para crear una nueva reserva
     *
     * @return \Inertia\Response
     */
    public function create()
    {
        $cotizaciones = Cotizacion::with(['cliente', 'departamento'])
            ->where('estado', 'aprobada')
            ->whereDoesntHave('reserva')
            ->get();

        $asesores = Asesor::where('estado', 'activo')->get();
        $clientes = Cliente::all();
        $departamentos = Departamento::where('estado', 'disponible')->get();

        return Inertia::render('Asesor/CrearReserva', [
            'cotizaciones' => $cotizaciones,
            'asesores' => $asesores,
            'clientes' => $clientes,
            'departamentos' => $departamentos,
        ]);
    }

    /**
     * Almacena una nueva reserva en la base de datos
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'cotizacion_id' => 'nullable|exists:cotizaciones,id',
            'cliente_id' => 'required|exists:clientes,id',
            'asesor_id' => 'required|exists:asesores,id',
            'departamento_id' => 'required|exists:departamentos,id',
            'fecha_inicio' => 'required|date|after_or_equal:today',
            'fecha_fin' => 'required|date|after:fecha_inicio',
            'monto_reserva' => 'required|numeric|min:0',
            'monto_total' => 'required|numeric|min:0',
            'notas' => 'nullable|string',
            'condiciones' => 'nullable|string',
            'estado' => 'required|in:activa,cancelada,completada',
        ]);

        // Crear la reserva
        $reserva = Reserva::create($validated);

        // Actualizar estado del departamento
        $departamento = Departamento::findOrFail($validated['departamento_id']);
        $departamento->update(['estado' => 'reservado']);

        // Si viene de una cotización, actualizar estado
        if ($request->filled('cotizacion_id')) {
            $cotizacion = Cotizacion::findOrFail($validated['cotizacion_id']);
            $cotizacion->update(['estado' => 'aprobada']);
        }

        return redirect()->route('admin.reservas.index')
            ->with('success', 'Reserva creada correctamente.');
    }

    /**
     * Muestra los detalles de una reserva específica
     *
     * @param  int  $id
     * @return \Inertia\Response
     */
    public function show($id)
    {
        $reserva = Reserva::with(['cliente', 'asesor', 'departamento', 'cotizacion'])->findOrFail($id);

        return Inertia::render('Asesor/DetalleReserva', [
            'reserva' => $reserva,
        ]);
    }

    /**
     * Muestra el formulario para editar una reserva
     *
     * @param  int  $id
     * @return \Inertia\Response
     */
    public function edit($id)
    {
        $reserva = Reserva::with(['cliente', 'asesor', 'departamento', 'cotizacion'])->findOrFail($id);
        $asesores = Asesor::where('estado', 'activo')->get();
        $clientes = Cliente::all();

        // Obtener departamentos disponibles o el actualmente asignado
        $departamentoId = $reserva->departamento ? $reserva->departamento->getKey() : null;
        $departamentos = Departamento::where('estado', 'disponible')
            ->when($departamentoId, function($query) use ($departamentoId) {
                return $query->orWhere('id', $departamentoId);
            })
            ->get();

        return Inertia::render('Asesor/EditarReserva', [
            'reserva' => $reserva,
            'asesores' => $asesores,
            'clientes' => $clientes,
            'departamentos' => $departamentos,
        ]);
    }

    /**
     * Actualiza una reserva específica en la base de datos
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request, $id)
    {
        $reserva = Reserva::with('departamento')->findOrFail($id);

        $validated = $request->validate([
            'cliente_id' => 'required|exists:clientes,id',
            'asesor_id' => 'required|exists:asesores,id',
            'departamento_id' => 'required|exists:departamentos,id',
            'fecha_inicio' => 'required|date',
            'fecha_fin' => 'required|date|after:fecha_inicio',
            'monto_reserva' => 'required|numeric|min:0',
            'monto_total' => 'required|numeric|min:0',
            'notas' => 'nullable|string',
            'condiciones' => 'nullable|string',
            'estado' => 'required|in:activa,cancelada,completada',
        ]);

        // Si se cambia el departamento
        $departamentoIdActual = $reserva->departamento ? $reserva->departamento->getKey() : null;
        $departamentoIdNuevo = $request->input('departamento_id');

        if ($departamentoIdNuevo && $departamentoIdActual && $departamentoIdActual != $departamentoIdNuevo) {
            // Liberar el departamento anterior
            $reserva->departamento->update(['estado' => 'disponible']);

            // Reservar el nuevo departamento
            $departamentoNuevo = Departamento::findOrFail($departamentoIdNuevo);
            $departamentoNuevo->update(['estado' => 'reservado']);
        }

        // Si se cancela la reserva, liberar el departamento
        $estadoActual = $reserva->getAttribute('estado') ?? '';
        if ($validated['estado'] === 'cancelada' && $estadoActual !== 'cancelada' && $reserva->departamento) {
            $reserva->departamento->update(['estado' => 'disponible']);
        }

        $reserva->update($validated);

        return redirect()->route('admin.reservas.index')
            ->with('success', 'Reserva actualizada correctamente.');
    }

    /**
     * Elimina una reserva específica de la base de datos
     *
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy($id)
    {
        $reserva = Reserva::with('departamento')->findOrFail($id);

        // Verificar si la reserva ya ha sido convertida en venta
        if ($reserva->venta()->exists()) {
            return back()->with('error', 'No se puede eliminar la reserva porque tiene una venta asociada.');
        }

        // Liberar el departamento
        if ($reserva->departamento) {
            $reserva->departamento->update(['estado' => 'disponible']);
        }

        $reserva->delete();

        return redirect()->route('admin.reservas.index')
            ->with('success', 'Reserva eliminada correctamente.');
    }

    /**
     * Cambia el estado de una reserva
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function cambiarEstado(Request $request, $id)
    {
        $reserva = Reserva::with('departamento')->findOrFail($id);

        $request->validate([
            'estado' => 'required|in:activa,cancelada,completada',
        ]);

        $nuevoEstado = $request->input('estado');
        $estadoActual = $reserva->getAttribute('estado');

        // Si se cancela la reserva, liberar el departamento
        if ($nuevoEstado === 'cancelada' && $estadoActual !== 'cancelada' && $reserva->departamento) {
            $reserva->departamento->update(['estado' => 'disponible']);
        }

        $reserva->update(['estado' => $nuevoEstado]);

        return back()->with('success', 'Estado de la reserva actualizado correctamente.');
    }
}
