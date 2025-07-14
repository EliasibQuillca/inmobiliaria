<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Departamento;
use App\Models\Publicacion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DepartamentoController extends Controller
{
    /**
     * Listar departamentos públicos (para clientes)
     */
    public function index(Request $request)
    {
        $query = Departamento::with(['propietario', 'atributos'])
            ->disponibles();

        // Filtros opcionales
        if ($request->has('precio_min')) {
            $query->where('precio', '>=', $request->precio_min);
        }

        if ($request->has('precio_max')) {
            $query->where('precio', '<=', $request->precio_max);
        }

        if ($request->has('direccion')) {
            $query->where('direccion', 'LIKE', '%' . $request->direccion . '%');
        }

        $departamentos = $query->paginate(12);

        return response()->json([
            'departamentos' => $departamentos->items(),
            'pagination' => [
                'current_page' => $departamentos->currentPage(),
                'last_page' => $departamentos->lastPage(),
                'per_page' => $departamentos->perPage(),
                'total' => $departamentos->total(),
            ],
        ]);
    }

    /**
     * Mostrar un departamento específico
     */
    public function show($id)
    {
        $departamento = Departamento::with([
            'propietario',
            'atributos',
            'publicaciones' => function($query) {
                $query->vigentes();
            }
        ])->find($id);

        if (!$departamento) {
            return response()->json([
                'message' => 'Departamento no encontrado',
            ], 404);
        }

        return response()->json($departamento);
    }

    /**
     * Crear departamento (solo administradores)
     */
    public function store(Request $request)
    {
        $user = Auth::user();
        
        if (!$user || $user->rol !== 'administrador') {
            return response()->json([
                'message' => 'Solo los administradores pueden crear departamentos',
            ], 403);
        }

        $request->validate([
            'codigo' => 'required|string|max:50|unique:departamentos,codigo',
            'direccion' => 'required|string|max:200',
            'precio' => 'required|numeric|min:0',
            'propietario_id' => 'required|exists:propietarios,id',
            'atributos' => 'nullable|array',
            'atributos.*.atributo_id' => 'required|exists:atributos,id',
            'atributos.*.valor' => 'required',
        ]);

        try {
            $departamento = Departamento::create([
                'codigo' => $request->codigo,
                'direccion' => $request->direccion,
                'precio' => $request->precio,
                'estado' => 'disponible',
                'propietario_id' => $request->propietario_id,
            ]);

            // Agregar atributos si se proporcionaron
            if ($request->has('atributos')) {
                foreach ($request->atributos as $atributo) {
                    $departamento->atributos()->attach(
                        $atributo['atributo_id'],
                        ['valor' => $atributo['valor']]
                    );
                }
            }

            return response()->json([
                'message' => 'Departamento creado exitosamente',
                'departamento' => $departamento->load(['propietario', 'atributos']),
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al crear departamento',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Actualizar departamento (solo administradores)
     */
    public function update(Request $request, $id)
    {
        $departamento = Departamento::find($id);

        if (!$departamento) {
            return response()->json([
                'message' => 'Departamento no encontrado',
            ], 404);
        }

        $user = Auth::user();
        
        if (!$user || $user->rol !== 'administrador') {
            return response()->json([
                'message' => 'Solo los administradores pueden actualizar departamentos',
            ], 403);
        }

        $request->validate([
            'codigo' => 'sometimes|string|max:50|unique:departamentos,codigo,' . $id,
            'direccion' => 'sometimes|string|max:200',
            'precio' => 'sometimes|numeric|min:0',
            'estado' => 'sometimes|in:disponible,reservado,vendido,inactivo',
            'propietario_id' => 'sometimes|exists:propietarios,id',
        ]);

        try {
            $departamento->update($request->only([
                'codigo', 'direccion', 'precio', 'estado', 'propietario_id'
            ]));

            return response()->json([
                'message' => 'Departamento actualizado exitosamente',
                'departamento' => $departamento->load(['propietario', 'atributos']),
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al actualizar departamento',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Cambiar estado del departamento
     */
    public function cambiarEstado(Request $request, $id)
    {
        $departamento = Departamento::find($id);

        if (!$departamento) {
            return response()->json([
                'message' => 'Departamento no encontrado',
            ], 404);
        }

        $request->validate([
            'estado' => 'required|in:disponible,reservado,vendido,inactivo',
        ]);

        $departamento->update(['estado' => $request->estado]);

        return response()->json([
            'message' => 'Estado actualizado exitosamente',
            'departamento' => $departamento,
        ]);
    }

    /**
     * Listar todos los departamentos (para administradores)
     */
    public function admin(Request $request)
    {
        $user = Auth::user();
        
        if (!$user || $user->rol !== 'administrador') {
            return response()->json([
                'message' => 'Solo los administradores pueden ver todos los departamentos',
            ], 403);
        }

        $query = Departamento::with(['propietario', 'atributos']);

        // Filtros
        if ($request->has('estado')) {
            $query->where('estado', $request->estado);
        }

        if ($request->has('propietario_id')) {
            $query->where('propietario_id', $request->propietario_id);
        }

        $departamentos = $query->paginate(15);

        return response()->json($departamentos);
    }
}
