<?php

namespace App\Http\Controllers;

use App\Models\Departamento;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

class CatalogoController extends Controller
{
    public function index(Request $request)
    {
        // Construir la consulta para obtener departamentos
        $query = Departamento::with(['propietario', 'atributos'])
            ->where('estado', 'disponible');

        // Aplicar filtros desde la URL
        if ($request->filled('location')) {
            $location = $request->input('location');
            $query->where(function($q) use ($location) {
                $q->where('direccion', 'like', '%' . $location . '%')
                  ->orWhere('zona', 'like', '%' . $location . '%')
                  ->orWhere('distrito', 'like', '%' . $location . '%');
            });
        }

        if ($request->filled('type') && $request->input('type') !== 'all') {
            $query->where('tipo', $request->input('type'));
        }

        if ($request->filled('bedrooms') && $request->input('bedrooms') !== 'any') {
            $bedrooms = $request->input('bedrooms');
            if ($bedrooms === '4+') {
                $query->where('dormitorios', '>=', 4);
            } else {
                $query->where('dormitorios', '=', $bedrooms);
            }
        }

        if ($request->filled('priceRange') && $request->input('priceRange') !== 'any') {
            $priceRange = $request->input('priceRange');
            $range = explode('-', $priceRange);
            if (count($range) === 2) {
                $query->whereBetween('precio', [$range[0], $range[1]]);
            } elseif (str_ends_with($priceRange, '+')) {
                $minPrice = str_replace('+', '', $priceRange);
                $query->where('precio', '>=', $minPrice);
            }
        }

        // Obtener los departamentos con paginación
        $departamentos = $query->paginate(12);

        // Devolver la vista con los datos
        return Inertia::render('Catalogo/Index', [
            'departamentos' => $departamentos,
            'filters' => [
                'location' => $request->input('location', ''),
                'type' => $request->input('type', 'all'),
                'bedrooms' => $request->input('bedrooms', 'any'),
                'priceRange' => $request->input('priceRange', 'any'),
            ],
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
        ]);
    }

    public function show($id)
    {
        $departamento = Departamento::with(['propietario', 'atributos', 'imagenes'])
            ->findOrFail($id);

        return Inertia::render('Catalogo/Show', [
            'departamento' => $departamento,
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
        ]);
    }
}
