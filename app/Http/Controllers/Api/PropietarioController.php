<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Propietario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PropietarioController extends Controller
{
    /**
     * Listar todos los propietarios (solo administradores)
     */
    public function index(Request $request)
    {
        $user = Auth::user();

        if (!$user || !$user->hasRole('administrador')) {
            return response()->json([
                'message' => 'No autorizado',
            ], 403);
        }

        $query = Propietario::query();

        // Filtros
        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where(function($q) use ($search) {
                $q->where('nombre', 'like', "%{$search}%")
                  ->orWhere('dni', 'like', "%{$search}%")
                  ->orWhere('contacto', 'like', "%{$search}%");
            });
        }

        if ($request->has('tipo')) {
            $query->where('tipo', $request->input('tipo'));
        }

        // Ordenamiento
        $sort = $request->input('sort', 'created_at');
        $direction = $request->input('direction', 'desc');
        $query->orderBy($sort, $direction);

        $propietarios = $query->paginate($request->input('per_page', 15));

        return response()->json([
            'data' => $propietarios->items(),
            'pagination' => [
                'current_page' => $propietarios->currentPage(),
                'last_page' => $propietarios->lastPage(),
                'per_page' => $propietarios->perPage(),
                'total' => $propietarios->total(),
            ],
        ]);
    }

    /**
     * Mostrar un propietario específico
     */
    public function show($id)
    {
        $user = Auth::user();

        if (!$user || !$user->hasRole('administrador')) {
            return response()->json([
                'message' => 'No autorizado',
            ], 403);
        }

        $propietario = Propietario::with(['departamentos'])->findOrFail($id);

        return response()->json([
            'data' => $propietario
        ]);
    }

    /**
     * Crear un nuevo propietario (solo administradores)
     */
    public function store(Request $request)
    {
        $user = Auth::user();

        if (!$user || !$user->hasRole('administrador')) {
            return response()->json([
                'message' => 'No autorizado',
            ], 403);
        }

        $request->validate([
            'nombre' => 'required|string|max:100',
            'dni' => 'required|string|max:20|unique:propietarios,dni',
            'tipo' => 'required|in:natural,juridica',
            'contacto' => 'required|string|max:50',
            'direccion' => 'required|string|max:200',
            'registrado_sunarp' => 'boolean',
        ]);

        try {
            $propietario = Propietario::create([
                'nombre' => $request->input('nombre'),
                'dni' => $request->input('dni'),
                'tipo' => $request->input('tipo'),
                'contacto' => $request->input('contacto'),
                'direccion' => $request->input('direccion'),
                'registrado_sunarp' => $request->boolean('registrado_sunarp', false),
            ]);

            return response()->json([
                'message' => 'Propietario creado exitosamente',
                'data' => $propietario
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al crear el propietario',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Actualizar un propietario existente (solo administradores)
     */
    public function update(Request $request, $id)
    {
        $user = Auth::user();

        if (!$user || !$user->hasRole('administrador')) {
            return response()->json([
                'message' => 'No autorizado',
            ], 403);
        }

        $propietario = Propietario::findOrFail($id);

        $request->validate([
            'nombre' => 'sometimes|string|max:100',
            'dni' => 'sometimes|string|max:20|unique:propietarios,dni,' . $id,
            'tipo' => 'sometimes|in:natural,juridica',
            'contacto' => 'sometimes|string|max:50',
            'direccion' => 'sometimes|string|max:200',
            'registrado_sunarp' => 'sometimes|boolean',
        ]);

        try {
            $propietario->update($request->only([
                'nombre', 'dni', 'tipo', 'contacto', 'direccion', 'registrado_sunarp'
            ]));

            return response()->json([
                'message' => 'Propietario actualizado exitosamente',
                'data' => $propietario->fresh()
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al actualizar el propietario',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Eliminar un propietario (solo administradores)
     */
    public function destroy($id)
    {
        $user = Auth::user();

        if (!$user || !$user->hasRole('administrador')) {
            return response()->json([
                'message' => 'No autorizado',
            ], 403);
        }

        try {
            $propietario = Propietario::findOrFail($id);

            // Verificar si tiene departamentos asociados
            if ($propietario->departamentos()->count() > 0) {
                return response()->json([
                    'message' => 'No se puede eliminar el propietario porque tiene departamentos asociados',
                ], 409);
            }

            $propietario->delete();

            return response()->json([
                'message' => 'Propietario eliminado exitosamente',
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al eliminar el propietario',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
