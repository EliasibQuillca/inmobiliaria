<?php

namespace App\Http\Controllers\Cliente;

use App\Http\Controllers\Controller;
use App\Models\Departamento;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DepartamentoController extends Controller
{
    /**
     * Mostrar el catálogo de departamentos.
     *
     * @return \Illuminate\Http\RedirectResponse
     */
    public function index()
    {
        // Redirigir al catálogo público
        return redirect()->route('catalogo.index');
    }

    /**
     * Mostrar los detalles de un departamento específico.
     *
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function show($id)
    {
        // Redirigir al detalle público del departamento
        return redirect()->route('catalogo.show', $id);
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

    /**
     * Mostrar la página de favoritos del cliente.
     *
     * @return \Inertia\Response
     */
    public function favoritos()
    {
        $cliente = Auth::user()->cliente;
        
        if (!$cliente) {
            return Inertia::render('Cliente/Favoritos', [
                'favoritos' => []
            ]);
        }

        // Obtener favoritos con información completa del departamento
        $favoritos = $cliente->favoritos()
            ->with(['imagenes', 'asesor.usuario'])
            ->where('estado', 'disponible')
            ->get()
            ->map(function ($departamento) {
                return [
                    'id' => $departamento->id,
                    'codigo' => $departamento->codigo,
                    'titulo' => $departamento->codigo,
                    'ubicacion' => $departamento->direccion,
                    'precio' => $departamento->precio,
                    'habitaciones' => $departamento->habitaciones,
                    'banos' => $departamento->banos,
                    'area_total' => $departamento->area_construida,
                    'estado' => ucfirst($departamento->estado),
                    'imagen_principal' => $departamento->imagenes->isNotEmpty() 
                        ? '/storage/' . $departamento->imagenes->first()->ruta 
                        : null,
                    'fecha_guardado' => $departamento->pivot->created_at->format('Y-m-d'),
                    'asesor' => $departamento->asesor ? [
                        'nombre' => $departamento->asesor->nombre,
                        'telefono' => $departamento->asesor->telefono
                    ] : null
                ];
            });

        return Inertia::render('Cliente/Favoritos', [
            'favoritos' => $favoritos
        ]);
    }

    /**
     * Alternar un departamento en los favoritos del cliente.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function toggleFavorito(Request $request)
    {
        $request->validate([
            'departamento_id' => 'required|integer|exists:departamentos,id'
        ]);

        $cliente = Auth::user()->cliente;
        if (!$cliente) {
            return redirect()->back()->with('error', 'Cliente no encontrado');
        }

        $departamentoId = $request->departamento_id;
        
        // Verificar si ya está en favoritos
        $existeFavorito = $cliente->favoritos()->where('departamento_id', $departamentoId)->exists();
        
        if ($existeFavorito) {
            // Quitar de favoritos
            $cliente->favoritos()->detach($departamentoId);
            $mensaje = 'Propiedad removida de favoritos';
        } else {
            // Agregar a favoritos
            $cliente->favoritos()->attach($departamentoId, [
                'created_at' => now(),
                'updated_at' => now()
            ]);
            $mensaje = 'Propiedad agregada a favoritos';
        }

        return redirect()->back()->with('success', $mensaje);
    }
}
