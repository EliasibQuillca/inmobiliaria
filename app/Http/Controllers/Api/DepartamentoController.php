<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Departamento;
use App\Models\Publicacion;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class DepartamentoController extends Controller
{
    /**
     * Listar departamentos públicos (para clientes)
     */
    public function index(Request $request)
    {
        $query = Departamento::with(['propietario', 'atributos', 'imagenes'])
            ->orderBy('updated_at', 'desc')
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

        if (!$user || $user->role !== 'administrador') {
            return response()->json([
                'message' => 'Solo los administradores pueden crear departamentos',
            ], 403);
        }

        $request->validate([
            'titulo' => 'required|string|max:100',
            'descripcion' => 'nullable|string',
            'direccion' => 'nullable|string|max:200',
            'ubicacion' => 'required|string|max:200',
            'precio' => 'required|numeric|min:0',
            'habitaciones' => 'required|integer|min:1',
            'banos' => 'required|integer|min:1',
            'area' => 'required|numeric|min:0',
            'piso' => 'required|integer|min:0',
            'estacionamientos' => 'integer|min:0',
            'propietario_id' => 'required|exists:propietarios,id',
            'estado' => 'nullable|string|in:disponible,reservado,vendido,inactivo',
            'destacado' => 'nullable|boolean',
            'año_construccion' => 'required|integer|min:1900',
            'garage' => 'nullable|boolean',
            'balcon' => 'nullable|boolean',
            'amueblado' => 'nullable|boolean',
            'mascotas_permitidas' => 'nullable|boolean',
        ]);

        try {
            // Generar código automáticamente
            $codigo = Departamento::generarCodigo();

            $departamento = Departamento::create([
                'codigo' => $codigo,
                'titulo' => $request->input('titulo'),
                'descripcion' => $request->input('descripcion'),
                'direccion' => $request->input('direccion'),
                'ubicacion' => $request->input('ubicacion'),
                'precio' => $request->input('precio'),
                'habitaciones' => $request->input('habitaciones'),
                'banos' => $request->input('banos'),
                'area' => $request->input('area'),
                'piso' => $request->input('piso'),
                'año_construccion' => $request->input('año_construccion'),
                'estacionamientos' => $request->input('estacionamientos', 0),
                'estado' => $request->input('estado', 'disponible'),
                'propietario_id' => $request->input('propietario_id'),
                'garage' => $request->input('garage', false),
                'balcon' => $request->input('balcon', false),
                'amueblado' => $request->input('amueblado', false),
                'mascotas_permitidas' => $request->input('mascotas_permitidas', false),
                'destacado' => $request->input('destacado', false),
            ]);
        
            $departamento->load('propietario');
            
            return response()->json([
                'message' => 'Departamento creado correctamente. Ahora puede agregar imágenes y más detalles.',
                'data' => $departamento
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
        $user = Auth::user();
        if (!$user || $user->role !== 'administrador') {
            return response()->json([
                'message' => 'Solo los administradores pueden actualizar departamentos',
            ], 403);
        }

        try {
            // Log detallado al inicio de la actualización
            Log::info('API DepartamentoController update called', [
                'id' => $id,
                'request_data' => $request->all(),
                'user' => $user->email,
                'user_role' => $user->role,
                'method' => $request->method()
            ]);

            $departamento = Departamento::findOrFail($id);

            // Log antes de la validación
            Log::info('Iniciando validación de datos', [
                'id' => $id,
                'request_all' => $request->all(),
                'rules' => [
                    'titulo' => 'required|string|max:150',
                    'descripcion' => 'required|string',
                    'ubicacion' => 'required|string|max:200',
                    'precio' => 'required|numeric|min:0',
                    'habitaciones' => 'required|integer|min:0',
                    'banos' => 'required|integer|min:0',
                    'area' => 'required|numeric|min:0',
                    'piso' => 'required|integer|min:0',
                    'año_construccion' => 'required|integer|min:1900',
                    'estado' => 'required|in:disponible,reservado,vendido,inactivo',
                    'propietario_id' => 'required|exists:propietarios,id'
                ]
            ]);

            Log::info('Antes de la validación', [
                'request_data' => $request->all()
            ]);
            
            $validated = $request->validate([
                'titulo' => 'required|string|max:150',
                'descripcion' => 'required|string',
                'ubicacion' => 'required|string|max:200',
                'precio' => 'required|numeric|min:0',
                'habitaciones' => 'required|integer|min:0',
                'banos' => 'required|integer|min:0',
                'area' => 'required|numeric|min:0',
                'piso' => 'required|integer|min:0',
                'año_construccion' => 'required|integer|min:1900',
                'estado' => 'required|in:disponible,reservado,vendido,inactivo',
                'propietario_id' => 'required|exists:propietarios,id',
                'destacado' => 'boolean',
                'garage' => 'boolean',
                'balcon' => 'boolean',
                'amueblado' => 'boolean',
                'mascotas_permitidas' => 'boolean',
                'gastos_comunes' => 'nullable|numeric|min:0',
                'estacionamientos' => 'nullable|integer|min:0',
                'direccion' => 'nullable|string|max:200',
            ]);

            // Actualizar departamento
            // Actualizar el departamento con los datos validados
            $departamento->fill([
                'titulo' => $validated['titulo'],
                'descripcion' => $validated['descripcion'],
                'ubicacion' => $validated['ubicacion'],
                'direccion' => $validated['direccion'] ?? $departamento->direccion,
                'precio' => $validated['precio'],
                'habitaciones' => $validated['habitaciones'],
                'banos' => $validated['banos'],
                'area' => $validated['area'],
                'piso' => $validated['piso'],
                'año_construccion' => $validated['año_construccion'],
                'estado' => $validated['estado'],
                'propietario_id' => $validated['propietario_id'],
                'estacionamientos' => $validated['estacionamientos'] ?? $departamento->estacionamientos,
                'destacado' => $validated['destacado'] ?? false,
                'garage' => $validated['garage'] ?? false,
                'balcon' => $validated['balcon'] ?? false,
                'amueblado' => $validated['amueblado'] ?? false,
                'mascotas_permitidas' => $validated['mascotas_permitidas'] ?? false,
                'gastos_comunes' => $validated['gastos_comunes'] ?? null
            ]);

            if (!$departamento->save()) {
                throw new \Exception('Error al guardar los cambios del departamento');
            }

            // Procesar imágenes si existen
            $imagenes = [];
            
            // Imagen principal
            if ($request->has('imagen_principal')) {
                $imagenes[] = [
                    'tipo' => 'principal',
                    'url' => $request->input('imagen_principal'),
                    'orden' => 0
                ];
            }
            
            // Imágenes de galería
            for ($i = 1; $i <= 5; $i++) {
                if ($request->has("imagen_galeria_{$i}")) {
                    $imagenes[] = [
                        'tipo' => 'galeria',
                        'url' => $request->input("imagen_galeria_{$i}"),
                        'orden' => $i
                    ];
                }
            }

            // Crear o actualizar imágenes
            foreach ($imagenes as $imagen) {
                $departamento->imagenes()->updateOrCreate(
                    ['tipo' => $imagen['tipo'], 'orden' => $imagen['orden']],
                    [
                    'url' => $imagen['url'],
                    'estado' => 'activo',
                    'orden' => $imagen['orden']
                ]);
            }

            return response()->json([
                'message' => 'Departamento actualizado correctamente',
                'data' => $departamento->load(['propietario', 'atributos', 'imagenes'])
            ], 200);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Error de validación',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Error al actualizar departamento', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'message' => 'Error al actualizar departamento',
                'error' => $e->getMessage()
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

        if (!$user || $user->role !== 'administrador') {
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

        if ($request->has('busqueda')) {
            $busqueda = $request->input('busqueda');
            $query->where(function($q) use ($busqueda) {
                $q->where('titulo', 'like', '%' . $busqueda . '%')
                  ->orWhere('codigo', 'like', '%' . $busqueda . '%')
                  ->orWhere('ubicacion', 'like', '%' . $busqueda . '%')
                  ->orWhere('descripcion', 'like', '%' . $busqueda . '%');
            });
        }

        if ($request->has('destacado') && $request->input('destacado') !== '') {
            $query->where('destacado', $request->input('destacado') == '1');
        }

        if ($request->has('precio_min')) {
            $query->where('precio', '>=', $request->input('precio_min'));
        }

        if ($request->has('precio_max')) {
            $query->where('precio', '<=', $request->input('precio_max'));
        }

        // Ordenamiento - usar los nombres que envía el frontend
        $ordenarPor = $request->input('sort_by', 'created_at');
        $direccion = $request->input('sort_direction', 'desc');
        $query->orderBy($ordenarPor, $direccion);

        $departamentos = $query->paginate($request->input('per_page', 15));

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
        $user = Auth::user();
        if (!$user || $user->role !== 'administrador') {
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
     * Eliminar un departamento
     */
    public function destroy($id)
    {
        $user = Auth::user();

        // Solo administradores pueden eliminar departamentos
        if (!$user || $user->role !== 'administrador') {
            return response()->json([
                'message' => 'No tiene permisos para realizar esta acción'
            ], 403);
        }

        $departamento = Departamento::find($id);

        if (!$departamento) {
            return response()->json([
                'message' => 'Departamento no encontrado',
            ], 404);
        }

        try {
            Log::info('Intentando eliminar departamento', ['id' => $id, 'codigo' => $departamento->codigo]);

            // COMENTADO TEMPORALMENTE PARA DEBUGGING
            // Log::info('Verificando reservas');
            // $tieneReservas = false;
            // try {
            //     $tieneReservas = $departamento->reservas()->where('estado', '!=', 'cancelada')->exists();
            //     Log::info('Reservas verificadas', ['tiene_reservas' => $tieneReservas]);
            // } catch (\Exception $e) {
            //     Log::error('Error verificando reservas', ['error' => $e->getMessage()]);
            // }

            // Log::info('Verificando ventas');
            // $tieneVentas = false;
            // try {
            //     $tieneVentas = $departamento->ventas()->exists();
            //     Log::info('Ventas verificadas', ['tiene_ventas' => $tieneVentas]);
            // } catch (\Exception $e) {
            //     Log::error('Error verificando ventas', ['error' => $e->getMessage()]);
            // }

            // if ($tieneReservas || $tieneVentas) {
            //     Log::warning('No se puede eliminar departamento por tener relaciones activas', [
            //         'id' => $id,
            //         'tiene_reservas' => $tieneReservas,
            //         'tiene_ventas' => $tieneVentas
            //     ]);
            //     return response()->json([
            //         'message' => 'No se puede eliminar el departamento porque tiene reservas o ventas asociadas',
            //     ], 422);
            // }

            Log::info('Saltando verificaciones - eliminando directamente');

            // Eliminar imágenes asociadas si existen
            if ($departamento->imagenes()->count() > 0) {
                Log::info('Eliminando imágenes asociadas', ['departamento_id' => $id, 'cantidad_imagenes' => $departamento->imagenes()->count()]);
                foreach ($departamento->imagenes as $imagen) {
                    // Eliminar archivo físico del storage si existe
                    if ($imagen->ruta && Storage::exists($imagen->ruta)) {
                        Storage::delete($imagen->ruta);
                    }
                    $imagen->delete();
                }
            }

            // Eliminar atributos asociados
            if ($departamento->atributos()->count() > 0) {
                Log::info('Eliminando atributos asociados', ['departamento_id' => $id, 'cantidad_atributos' => $departamento->atributos()->count()]);
                $departamento->atributos()->detach();
            }

            // Eliminar cotizaciones asociadas (si las hay)
            if ($departamento->cotizaciones()->count() > 0) {
                Log::info('Eliminando cotizaciones asociadas', ['departamento_id' => $id, 'cantidad_cotizaciones' => $departamento->cotizaciones()->count()]);
                $departamento->cotizaciones()->delete();
            }

            // Eliminar publicaciones asociadas (si las hay)
            if ($departamento->publicaciones()->count() > 0) {
                Log::info('Eliminando publicaciones asociadas', ['departamento_id' => $id, 'cantidad_publicaciones' => $departamento->publicaciones()->count()]);
                $departamento->publicaciones()->delete();
            }

            // Eliminar de favoritos
            $departamento->clientesFavoritos()->detach();            // Eliminar el departamento
            $departamento->delete();

            Log::info('Departamento eliminado exitosamente', ['id' => $id]);

            return response()->json([
                'message' => 'Departamento eliminado correctamente'
            ], 200);

        } catch (\Exception $e) {
            Log::error('Error al eliminar departamento', [
                'id' => $id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'message' => 'Error al eliminar el departamento: ' . $e->getMessage()
            ], 500);
        }
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

    /**
     * Procesar imágenes enviadas por URL
     */
    private function procesarImagenesURL($departamento, $request)
    {
        // Procesar imagen principal
        if ($request->filled('imagen_principal')) {
            $imagenUrl = $request->input('imagen_principal');
            // Validar que no sea una URL base64 (muy larga y problemática)
            if (!str_starts_with($imagenUrl, 'data:image/') && strlen($imagenUrl) < 500) {
                // Desactivar imagen principal anterior
                \App\Models\Imagen::where('departamento_id', $departamento->id)
                    ->where('tipo', 'principal')
                    ->update(['activa' => false]);
                
                // Crear nueva imagen principal
                \App\Models\Imagen::create([
                    'departamento_id' => $departamento->id,
                    'url' => $imagenUrl,
                    'titulo' => $departamento->titulo,
                    'descripcion' => 'Imagen principal',
                    'tipo' => 'principal',
                    'orden' => 1,
                    'activa' => true,
                ]);
            }
        }

        // Procesar imágenes de galería
        $imagenesGaleria = [
            'imagen_galeria_1' => 2,
            'imagen_galeria_2' => 3,
            'imagen_galeria_3' => 4,
            'imagen_galeria_4' => 5,
            'imagen_galeria_5' => 6,
        ];

        foreach ($imagenesGaleria as $campo => $orden) {
            if ($request->filled($campo)) {
                $imagenUrl = $request->input($campo);
                // Validar que no sea una URL base64 y tenga longitud razonable
                if (!str_starts_with($imagenUrl, 'data:image/') && strlen($imagenUrl) < 500) {
                    // Desactivar imagen de galería anterior en esta posición
                    \App\Models\Imagen::where('departamento_id', $departamento->id)
                        ->where('tipo', 'galeria')
                        ->where('orden', $orden)
                        ->update(['activa' => false]);
                    
                    // Crear nueva imagen de galería
                    \App\Models\Imagen::create([
                        'departamento_id' => $departamento->id,
                        'url' => $imagenUrl,
                        'titulo' => $departamento->titulo . ' - Galería ' . ($orden - 1),
                        'descripcion' => 'Imagen de galería',
                        'tipo' => 'galeria',
                        'orden' => $orden,
                        'activa' => true,
                    ]);
                }
            }
        }
    }
}
