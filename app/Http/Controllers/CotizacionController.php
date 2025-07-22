<?php

namespace App\Http\Controllers;

use App\Models\Cotizacion;
use App\Models\Departamento;
use App\Models\Asesor;
use App\Models\Cliente;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CotizacionController extends Controller
{
    /**
     * Muestra la lista de cotizaciones
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        $cotizaciones = Cotizacion::with(['cliente', 'asesor', 'departamento'])
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('Admin/Cotizaciones', [
            'cotizaciones' => $cotizaciones,
            'filters' => request()->all('search', 'estado'),
        ]);
    }

    /**
     * Muestra el formulario para crear una nueva cotización
     *
     * @return \Inertia\Response
     */
    public function create()
    {
        $asesores = Asesor::where('estado', 'activo')->get();
        $clientes = Cliente::all();
        $departamentos = Departamento::where('estado', 'disponible')->get();

        return Inertia::render('Admin/CrearCotizacion', [
            'asesores' => $asesores,
            'clientes' => $clientes,
            'departamentos' => $departamentos,
        ]);
    }

    /**
     * Almacena una nueva cotización en la base de datos
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'cliente_id' => 'required|exists:clientes,id',
            'asesor_id' => 'required|exists:asesores,id',
            'departamento_id' => 'required|exists:departamentos,id',
            'monto' => 'required|numeric|min:0',
            'descuento' => 'nullable|numeric|min:0|max:100',
            'fecha_validez' => 'required|date|after_or_equal:today',
            'notas' => 'nullable|string',
            'condiciones' => 'nullable|string',
            'estado' => 'required|in:pendiente,aprobada,rechazada,vencida',
        ]);

        // Crear la cotización
        $cotizacion = Cotizacion::create($validated);

        return redirect()->route('admin.cotizaciones.index')
            ->with('success', 'Cotización creada correctamente.');
    }

    /**
     * Muestra los detalles de una cotización específica
     *
     * @param  int  $id
     * @return \Inertia\Response
     */
    public function show($id)
    {
        $cotizacion = Cotizacion::with(['cliente', 'asesor', 'departamento'])->findOrFail($id);

        return Inertia::render('Admin/DetalleCotizacion', [
            'cotizacion' => $cotizacion,
        ]);
    }

    /**
     * Muestra el formulario para editar una cotización
     *
     * @param  int  $id
     * @return \Inertia\Response
     */
    public function edit($id)
    {
        $cotizacion = Cotizacion::findOrFail($id);
        $asesores = Asesor::where('estado', 'activo')->get();
        $clientes = Cliente::all();
        $departamentos = Departamento::where('estado', 'disponible')
            ->orWhere('id', $cotizacion->getAttribute('departamento_id'))
            ->get();

        return Inertia::render('Admin/EditarCotizacion', [
            'cotizacion' => $cotizacion,
            'asesores' => $asesores,
            'clientes' => $clientes,
            'departamentos' => $departamentos,
        ]);
    }

    /**
     * Actualiza una cotización específica en la base de datos
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request, $id)
    {
        $cotizacion = Cotizacion::findOrFail($id);

        $validated = $request->validate([
            'cliente_id' => 'required|exists:clientes,id',
            'asesor_id' => 'required|exists:asesores,id',
            'departamento_id' => 'required|exists:departamentos,id',
            'monto' => 'required|numeric|min:0',
            'descuento' => 'nullable|numeric|min:0|max:100',
            'fecha_validez' => 'required|date',
            'notas' => 'nullable|string',
            'condiciones' => 'nullable|string',
            'estado' => 'required|in:pendiente,aprobada,rechazada,vencida',
        ]);

        $cotizacion->update($validated);

        return redirect()->route('admin.cotizaciones.index')
            ->with('success', 'Cotización actualizada correctamente.');
    }

    /**
     * Elimina una cotización específica de la base de datos
     *
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy($id)
    {
        $cotizacion = Cotizacion::findOrFail($id);

        // Verificar si la cotización ya ha sido convertida en reserva o venta
        if ($cotizacion->reservas()->exists() || $cotizacion->ventas()->exists()) {
            return back()->with('error', 'No se puede eliminar la cotización porque tiene reservas o ventas asociadas.');
        }

        $cotizacion->delete();

        return redirect()->route('admin.cotizaciones.index')
            ->with('success', 'Cotización eliminada correctamente.');
    }

    /**
     * Cambia el estado de una cotización
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function cambiarEstado(Request $request, $id)
    {
        $cotizacion = Cotizacion::findOrFail($id);

        $request->validate([
            'estado' => 'required|in:pendiente,aprobada,rechazada,vencida',
        ]);

        $cotizacion->update([
            'estado' => $request->input('estado')
        ]);

        return back()->with('success', 'Estado de la cotización actualizado correctamente.');
    }
}
