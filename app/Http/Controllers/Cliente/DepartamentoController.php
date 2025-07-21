<?php

namespace App\Http\Controllers\Cliente;

use App\Http\Controllers\Controller;
use App\Models\Departamento;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DepartamentoController extends Controller
{
    /**
     * Mostrar el catálogo de departamentos.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        // En una implementación real, obtendríamos todos los departamentos
        // disponibles con paginación

        return Inertia::render('Cliente/Catalogo');
    }

    /**
     * Mostrar los detalles de un departamento específico.
     *
     * @param  int  $id
     * @return \Inertia\Response
     */
    public function show($id)
    {
        // En una implementación real, buscaríamos el departamento por ID
        // $departamento = Departamento::with(['atributos', 'imagenes'])->findOrFail($id);

        return Inertia::render('Cliente/DetalleDepartamento', [
            'departamentoId' => $id,
        ]);
    }

    /**
     * Buscar departamentos según filtros.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Inertia\Response
     */
    public function search(Request $request)
    {
        // Validación de parámetros de búsqueda
        $validated = $request->validate([
            'precio_min' => 'nullable|numeric|min:0',
            'precio_max' => 'nullable|numeric|min:0',
            'habitaciones' => 'nullable|integer|min:1',
            'banos' => 'nullable|integer|min:1',
            'metros_min' => 'nullable|numeric|min:0',
            'ubicacion' => 'nullable|string',
            'atributos' => 'nullable|array',
        ]);

        // En una implementación real, realizaríamos una búsqueda con los filtros
        // $query = Departamento::query();
        //
        // if (isset($validated['precio_min'])) {
        //     $query->where('precio', '>=', $validated['precio_min']);
        // }
        //
        // if (isset($validated['precio_max'])) {
        //     $query->where('precio', '<=', $validated['precio_max']);
        // }
        //
        // // ... aplicar el resto de filtros
        //
        // $departamentos = $query->paginate(12);

        return Inertia::render('Cliente/Catalogo', [
            'filtros' => $validated,
        ]);
    }

    /**
     * Guardar un departamento en la lista de favoritos del cliente.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function agregarFavorito($id)
    {
        // En una implementación real, guardaríamos el departamento en favoritos
        // $cliente = auth()->user()->cliente;
        // $departamento = Departamento::findOrFail($id);
        //
        // // Verificar si ya está en favoritos
        // if (!$cliente->favoritos()->where('departamento_id', $id)->exists()) {
        //     $cliente->favoritos()->attach($id);
        // }

        return redirect()->back()->with('success', 'Departamento guardado en favoritos.');
    }

    /**
     * Eliminar un departamento de la lista de favoritos del cliente.
     *
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function eliminarFavorito($id)
    {
        // En una implementación real, eliminaríamos el departamento de favoritos
        // $cliente = auth()->user()->cliente;
        // $cliente->favoritos()->detach($id);

        return redirect()->back()->with('success', 'Departamento eliminado de favoritos.');
    }
}
