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
        $query = Departamento::with(['propietario', 'atributos', 'imagenes'])
            ->where('estado', 'disponible');

        // Filtro para destacados
        if ($request->has('destacados') && $request->input('destacados') === 'true') {
            $query->where('destacado', true);
        }

        // Filtros opcionales
        if ($request->has('precio_min')) {
            $query->where('precio', '>=', $request->input('precio_min'));
        }

        if ($request->has('precio_max')) {
            $query->where('precio', '<=', $request->input('precio_max'));
        }

        if ($request->has('area_min')) {
            $query->where('area_total', '>=', $request->input('area_min'));
        }

        if ($request->has('area_max')) {
            $query->where('area_total', '<=', $request->input('area_max'));
        }

        if ($request->has('habitaciones') && $request->input('habitaciones') !== '') {
            $habitaciones = $request->input('habitaciones');
            if ($habitaciones == '4') {
                $query->where('habitaciones', '>=', 4);
            } else {
                $query->where('habitaciones', $habitaciones);
            }
        }

        // Filtros adicionales para la búsqueda desde la página principal
        if ($request->has('ubicacion') && $request->input('ubicacion') !== '') {
            $ubicacion = $request->input('ubicacion');
            $query->where(function($q) use ($ubicacion) {
                $q->where('direccion', 'like', '%' . $ubicacion . '%')
                  ->orWhere('ubicacion', 'like', '%' . $ubicacion . '%');
            });
        }

        if ($request->has('location') && $request->input('location') !== '') {
            $location = $request->input('location');
            $query->where(function($q) use ($location) {
                $q->where('direccion', 'like', '%' . $location . '%')
                  ->orWhere('ubicacion', 'like', '%' . $location . '%');
            });
        }

        if ($request->has('precio_rango') && $request->input('precio_rango') !== 'any') {
            $precioRango = $request->input('precio_rango');
            $range = explode('-', $precioRango);
            if (count($range) === 2) {
                $query->whereBetween('precio', [$range[0], $range[1]]);
            } elseif (str_ends_with($precioRango, '+')) {
                $minPrice = str_replace('+', '', $precioRango);
                $query->where('precio', '>=', $minPrice);
            }
        }

        // Paginación de resultados
        $departamentos = $query->latest()->paginate(9);

        return response()->json([
            'data' => $departamentos->items(),
            'current_page' => $departamentos->currentPage(),
            'per_page' => $departamentos->perPage(),
            'last_page' => $departamentos->lastPage(),
            'total' => $departamentos->total(),
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
            'imagenes' => function($query) {
                $query->where('estado', 'activo')->orderBy('orden');
            }
        ])->find($id);

        if (!$departamento) {
            return response()->json([
                'message' => 'Departamento no encontrado',
            ], 404);
        }

        return response()->json([
            'data' => $departamento
        ]);
    }

    /**
     * Crear departamento (solo administradores)
     */
    public function store(Request $request)
    {
        $user = Auth::user();

        if (!$user || !$user->hasRole('administrador')) {
            return response()->json([
                'message' => 'Solo los administradores pueden crear departamentos',
            ], 403);
        }

        $request->validate([
            'codigo' => 'required|string|max:50|unique:departamentos,codigo',
            'titulo' => 'required|string|max:100',
            'descripcion' => 'required|string',
            'direccion' => 'required|string|max:200',
            'ubicacion' => 'required|string|max:200',
            'precio' => 'required|numeric|min:0',
            'habitaciones' => 'required|integer|min:0',
            'banos' => 'required|integer|min:0',
            'area_total' => 'required|numeric|min:0',
            'estacionamientos' => 'integer|min:0',
            'propietario_id' => 'required|exists:propietarios,id',
            'atributos' => 'nullable|array',
            'atributos.*.atributo_id' => 'required|exists:atributos,id',
            'atributos.*.valor' => 'required',
        ]);

        try {
            $departamento = Departamento::create([
                'codigo' => $request->input('codigo'),
                'titulo' => $request->input('titulo'),
                'descripcion' => $request->input('descripcion'),
                'direccion' => $request->input('direccion'),
                'ubicacion' => $request->input('ubicacion'),
                'precio' => $request->input('precio'),
                'habitaciones' => $request->input('habitaciones'),
                'banos' => $request->input('banos'),
                'area_total' => $request->input('area_total'),
                'estacionamientos' => $request->input('estacionamientos', 0),
                'estado' => 'disponible',
                'propietario_id' => $request->input('propietario_id'),
                'destacado' => $request->input('destacado', false),
            ]);

            // Agregar atributos si se proporcionaron
            if ($request->has('atributos')) {
                foreach ($request->input('atributos') as $atributo) {
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

        if (!$user || !$user->hasRole('administrador')) {
            return response()->json([
                'message' => 'Solo los administradores pueden actualizar departamentos',
            ], 403);
        }

        $request->validate([
            'codigo' => 'sometimes|string|max:50|unique:departamentos,codigo,' . $id,
            'titulo' => 'sometimes|string|max:100',
            'descripcion' => 'sometimes|string',
            'direccion' => 'sometimes|string|max:200',
            'ubicacion' => 'sometimes|string|max:200',
            'precio' => 'sometimes|numeric|min:0',
            'precio_anterior' => 'nullable|numeric|min:0',
            'habitaciones' => 'sometimes|integer|min:0',
            'banos' => 'sometimes|integer|min:0',
            'area_total' => 'sometimes|numeric|min:0',
            'estacionamientos' => 'sometimes|integer|min:0',
            'estado' => 'sometimes|in:disponible,reservado,vendido,inactivo',
            'propietario_id' => 'sometimes|exists:propietarios,id',
            'destacado' => 'sometimes|boolean',
        ]);

        try {
            $departamento->update($request->only([
                'codigo', 'titulo', 'descripcion', 'direccion', 'ubicacion',
                'precio', 'precio_anterior', 'habitaciones', 'banos',
                'area_total', 'estacionamientos', 'estado', 'propietario_id', 'destacado'
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
     * Estados posibles: disponible, reservado, vendido, inactivo
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
            'observacion' => 'nullable|string|max:500',
        ]);

        $estadoAnterior = $departamento->getAttribute('estado');
        $departamento->update([
            'estado' => $request->input('estado')
        ]);

        // Registrar el cambio de estado para trazabilidad
        $user = Auth::user();
        if ($user) {
            // Aquí podríamos registrar en una tabla de auditoría o historial
            // AuditoriaUsuario::create([
            //     'usuario_id' => $user->id,
            //     'accion' => 'cambio_estado_departamento',
            //     'entidad' => 'departamento',
            //     'entidad_id' => $departamento->id,
            //     'valor_anterior' => $estadoAnterior,
            //     'valor_nuevo' => $request->input('estado'),
            //     'observacion' => $request->input('observacion'),
            // ]);
        }

        return response()->json([
            'message' => 'Estado actualizado exitosamente',
            'data' => $departamento,
        ]);
    }

    /**
     * Listar todos los departamentos (para administradores)
     * Incluye filtros para administración y seguimiento
     */
    public function admin(Request $request)
    {
        $user = Auth::user();

        if (!$user || !$user->hasRole('administrador')) {
            return response()->json([
                'message' => 'Solo los administradores pueden ver todos los departamentos',
            ], 403);
        }

        $query = Departamento::with(['propietario', 'atributos', 'imagenes']);

        // Filtros administrativos
        if ($request->has('estado')) {
            $query->where('estado', $request->input('estado'));
        }

        if ($request->has('propietario_id')) {
            $query->where('propietario_id', $request->input('propietario_id'));
        }

        if ($request->has('codigo')) {
            $query->where('codigo', 'like', '%' . $request->input('codigo') . '%');
        }

        if ($request->has('ubicacion')) {
            $query->where('ubicacion', 'like', '%' . $request->input('ubicacion') . '%');
        }

        if ($request->has('precio_min')) {
            $query->where('precio', '>=', $request->input('precio_min'));
        }

        if ($request->has('precio_max')) {
            $query->where('precio', '<=', $request->input('precio_max'));
        }

        // Ordenamiento
        $ordenarPor = $request->input('ordenar_por', 'created_at');
        $direccion = $request->input('direccion', 'desc');
        $query->orderBy($ordenarPor, $direccion);

        $departamentos = $query->paginate($request->input('por_pagina', 15));

        return response()->json([
            'data' => $departamentos->items(),
            'pagination' => [
                'current_page' => $departamentos->currentPage(),
                'last_page' => $departamentos->lastPage(),
                'per_page' => $departamentos->perPage(),
                'total' => $departamentos->total(),
            ],
        ]);
    }

    /**
     * Marcar o desmarcar un departamento como destacado
     */
    public function toggleDestacado(Request $request, $id)
    {
        // Verificar si el usuario es administrador
        if (!Auth::user()->hasRole('administrador')) {
            return response()->json([
                'message' => 'No tiene permisos para realizar esta acción'
            ], 403);
        }

        $departamento = Departamento::findOrFail($id);

        $departamento->destacado = $request->input('destacado', !$departamento->destacado);
        $departamento->save();

        return response()->json([
            'message' => $departamento->destacado
                ? 'Departamento marcado como destacado'
                : 'Departamento desmarcado como destacado',
            'data' => $departamento
        ]);
    }

    /**
     * Obtener departamentos destacados para la página principal
     */
    public function destacados(Request $request)
    {
        $limit = $request->input('limit', 6);

        $departamentos = Departamento::with(['propietario', 'atributos', 'imagenes'])
            ->where('destacado', true)
            ->where('estado', 'disponible')
            ->latest()
            ->take($limit)
            ->get();

        return response()->json([
            'data' => $departamentos
        ]);
    }
}
