<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Api\DepartamentoController as ApiDepartamentoController;
use App\Models\Departamento;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class DepartamentoController extends Controller
{
    protected $apiController;

    public function __construct()
    {
        $this->apiController = new ApiDepartamentoController();
    }

    /**
     * Mostrar la página de gestión de departamentos
     */
    public function index(Request $request)
    {
        try {
            // Obtener los datos desde el API controller
            $response = $this->apiController->admin($request);
            $data = json_decode($response->getContent(), true);

            // Obtener lista de propietarios para los modales de edición
            $propietarios = \App\Models\Propietario::all();

            if ($response->getStatusCode() === 200) {
                return Inertia::render('Admin/Departamentos/Index', [
                    'departamentos' => $data,
                    'pagination' => $data['pagination'] ?? null,
                    'propietarios' => $propietarios,
                    'filters' => [
                        'busqueda' => $request->get('busqueda', ''),
                        'estado' => $request->get('estado', ''),
                        'ubicacion' => $request->get('ubicacion', ''),
                        'destacado' => $request->get('destacado', ''),
                        'page' => $request->get('page', 1),
                        'per_page' => $request->get('per_page', 10),
                        'sort_by' => $request->get('sort_by', 'created_at'),
                        'sort_direction' => $request->get('sort_direction', 'desc'),
                    ]
                ]);
            } else {
                return Inertia::render('Admin/Departamentos/Index', [
                    'departamentos' => ['data' => []],
                    'pagination' => ['total' => 0],
                    'propietarios' => $propietarios,
                    'filters' => [],
                    'error' => 'Error al cargar departamentos'
                ]);
            }
        } catch (\Exception $e) {
            return Inertia::render('Admin/Departamentos/Index', [
                'departamentos' => ['data' => []],
                'pagination' => ['total' => 0],
                'propietarios' => [],
                'filters' => [],
                'error' => 'Error al cargar departamentos: ' . $e->getMessage()
            ]);
        }
    }

    /**
     * Mostrar un departamento específico
     */
    public function show($id)
    {
        try {
            // La vista VerDepartamento no existe todavía, redireccionar al índice
            Log::info('Redirigiendo desde show a index porque la vista de detalle no existe', ['id' => $id]);
            return redirect()->route('admin.departamentos.index')
                ->with('info', 'La vista de detalle está en desarrollo. Por favor, use la lista para gestionar departamentos.');

            /* Código original comentado - descomentar cuando se cree la vista
            $response = $this->apiController->show($id);
            $data = json_decode($response->getContent(), true);

            if ($response->getStatusCode() === 200) {
                return Inertia::render('Admin/VerDepartamento', [
                    'departamento' => $data['data']
                ]);
            } else {
                return redirect()->route('admin.departamentos.index')->with('error', 'Departamento no encontrado');
            }
            */
        } catch (\Exception $e) {
            Log::error('Error en show departamento', [
                'id' => $id,
                'error' => $e->getMessage()
            ]);
            return redirect()->route('admin.departamentos.index')->with('error', 'Error al cargar departamento');
        }
    }

    /**
     * Mostrar el formulario para crear un nuevo departamento
     */
    public function create()
    {
        try {
            // Obtener lista de propietarios para el formulario con información relevante
            $propietarios = \App\Models\Propietario::select('id', 'nombre', 'dni', 'tipo', 'contacto')
                ->orderBy('nombre')
                ->get()
                ->map(function($propietario) {
                    return [
                        'id' => $propietario->id,
                        'nombre' => $propietario->nombre,
                        'dni' => $propietario->dni,
                        'tipo' => $propietario->tipo,
                        'identificacion' => "{$propietario->nombre} - {$propietario->dni} ({$propietario->tipo})"
                    ];
                });

            return Inertia::render('Admin/Departamentos/Crear', [
                'propietarios' => $propietarios
            ]);
        } catch (\Exception $e) {
            return redirect()->route('admin.departamentos')->with('error', 'Error al cargar el formulario');
        }
    }

    /**
     * Almacenar un nuevo departamento
     */
    public function store(Request $request)
    {
        try {
            $response = $this->apiController->store($request);
            $data = json_decode($response->getContent(), true);

            if ($response->getStatusCode() === 201) {
                $departamentoId = $data['data']['id'] ?? null;

                // Siempre redirigimos a la lista de departamentos
                return redirect()->route('admin.departamentos.index')
                    ->with('success', 'Departamento creado correctamente. Ahora puede agregar imágenes y más detalles.');
            } else {
                return redirect()->back()->withInput()->with('error', $data['message'] ?? 'Error al crear el departamento');
            }
        } catch (\Exception $e) {
            return redirect()->back()->withInput()->with('error', 'Error al crear departamento: ' . $e->getMessage());
        }
    }

    /**
     * Mostrar el formulario de edición de un departamento
     */
    public function edit($id)
    {
        try {
            $response = $this->apiController->show($id);
            $data = json_decode($response->getContent(), true);

            if ($response->getStatusCode() === 200) {
                // Obtener lista de propietarios para el formulario
                $propietarios = \App\Models\Propietario::all();

                return Inertia::render('Admin/EditarDepartamento', [
                    'departamento' => $data['data'],
                    'propietarios' => $propietarios
                ]);
            } else {
                return redirect()->route('admin.departamentos')->with('error', 'Departamento no encontrado');
            }
        } catch (\Exception $e) {
            return redirect()->route('admin.departamentos')->with('error', 'Error al cargar departamento');
        }
    }

    /**
     * Actualizar un departamento existente
     */
    public function update(Request $request, $departamento)
    {
        try {
            // Log información básica de la actualización
            Log::info('Actualización de departamento iniciada', [
                'id' => $departamento,
                'user' => Auth::user() ? Auth::user()->email : 'no user'
            ]);

            $response = $this->apiController->update($request, $departamento);
            $data = json_decode($response->getContent(), true);

            // Log detallado de la respuesta
            Log::debug('Respuesta completa del API', [
                'status_code' => $response->getStatusCode(),
                'content' => $response->getContent(),
                'data' => $data,
                'headers' => $response->headers->all()
            ]);
            Log::info('Respuesta del API', [
                'status' => $response->getStatusCode(),
                'data' => $data,
                'content' => $response->getContent()
            ]);

            if ($response->getStatusCode() === 200) {
                Log::info('Departamento actualizado correctamente', ['id' => $departamento]);

                // Si hay imágenes nuevas, procesarlas
                if ($request->hasFile('imagenes')) {
                    $this->subirImagenes($request, $departamento);
                }

                // Para solicitudes AJAX/API
                if ($request->expectsJson()) {
                    return response()->json([
                        'message' => 'Departamento actualizado correctamente',
                        'data' => $data['data'] ?? null
                    ]);
                }

                // Para solicitudes web normales
                session()->flash('success', 'Departamento actualizado correctamente');
                return redirect()->route('admin.departamentos.edit', $departamento);
            }

            if ($response->getStatusCode() === 422) {
                Log::warning('Error de validación al actualizar departamento', [
                    'id' => $departamento,
                    'errors' => $data['errors'] ?? []
                ]);
                return redirect()->back()
                    ->withErrors($data['errors'] ?? [])
                    ->withInput();
            }

            Log::error('Error inesperado al actualizar departamento', [
                'id' => $departamento,
                'status' => $response->getStatusCode(),
                'message' => $data['message'] ?? 'Error desconocido'
            ]);
            return redirect()->back()
                ->with('error', $data['message'] ?? 'Error al actualizar departamento')
                ->withInput();
        } catch (\Exception $e) {
            Log::error('Error en actualización de departamento', [
                'id' => $departamento,
                'error' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString()
            ]);

            return redirect()
                ->back()
                ->withInput()
                ->with('error', 'Error al actualizar departamento: ' . $e->getMessage());
        }
    }

    /**
     * Cambiar el estado de un departamento
     */
    public function cambiarEstado(Request $request, $id)
    {
        try {
            $response = $this->apiController->cambiarEstado($request, $id);
            $data = json_decode($response->getContent(), true);

            if ($response->getStatusCode() === 200) {
                return redirect()->back()->with('success', 'Estado del departamento actualizado correctamente');
            } else {
                return redirect()->back()->with('error', $data['message'] ?? 'Error al cambiar estado del departamento');
            }
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Error al cambiar estado: ' . $e->getMessage());
        }
    }

    /**
     * Alternar destacado de un departamento
     */
    public function toggleDestacado(Request $request, $id)
    {
        try {
            $response = $this->apiController->toggleDestacado($request, $id);
            $data = json_decode($response->getContent(), true);

            if ($response->getStatusCode() === 200) {
                return redirect()->back()->with('success', 'Destacado del departamento actualizado correctamente');
            } else {
                return redirect()->back()->with('error', $data['message'] ?? 'Error al cambiar destacado del departamento');
            }
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Error al cambiar destacado: ' . $e->getMessage());
        }
    }

    /**
     * Eliminar un departamento
     */
    public function destroy($id)
    {
        try {
            Log::info('Método destroy llamado', ['id' => $id]);

            // Obtener departamento para incluir información en logs
            $departamento = Departamento::find($id);
            if (!$departamento) {
                Log::warning('Intento de eliminar un departamento inexistente', ['id' => $id]);
                return response()->json([
                    'message' => 'Departamento no encontrado'
                ], 404);
            }

            Log::info('Eliminando departamento', [
                'id' => $id,
                'codigo' => $departamento->codigo,
                'titulo' => $departamento->titulo
            ]);

            // Llamar al API Controller para procesar la eliminación
            $response = $this->apiController->destroy($id);
            $data = json_decode($response->getContent(), true);
            $statusCode = $response->getStatusCode();

            Log::info('Respuesta del API controller', ['status' => $statusCode, 'data' => $data]);

            // Para solicitudes Ajax/Inertia, devolver respuesta JSON
            if (request()->wantsJson() || request()->header('X-Inertia')) {
                if ($statusCode === 200) {
                    // Para solicitudes Inertia es mejor redireccionar a la página de listado
                    // en lugar de renderizar directamente
                    return redirect()->route('admin.departamentos.index')
                        ->with('success', 'Departamento eliminado correctamente');
                } else {
                    return response()->json([
                        'message' => $data['message'] ?? 'Error al eliminar el departamento'
                    ], $statusCode);
                }
            }

            // Para solicitudes normales, redireccionar
            if ($statusCode === 200) {
                Log::info('Departamento eliminado exitosamente', ['id' => $id]);
                return redirect()->route('admin.departamentos.index')->with('success', 'Departamento eliminado correctamente');
            } else {
                Log::warning('Error al eliminar departamento', ['id' => $id, 'data' => $data]);
                return redirect()->back()->with('error', $data['message'] ?? 'Error al eliminar el departamento');
            }
        } catch (\Exception $e) {
            Log::error('Error en destroy departamento', [
                'id' => $id,
                'error' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ]);

            if (request()->wantsJson() || request()->header('X-Inertia')) {
                return response()->json([
                    'message' => 'Error al eliminar departamento: ' . $e->getMessage()
                ], 500);
            }

            return redirect()->back()->with('error', 'Error al eliminar departamento: ' . $e->getMessage());
        }
    }

    /**
     * Subir imágenes para un departamento
     */
    public function subirImagenes(Request $request, $id)
    {
        try {
            $request->validate([
                'imagenes' => 'required|array',
                'imagenes.*' => 'image|mimes:jpeg,png,jpg,gif|max:5120', // 5MB máximo
                'imagen_principal_index' => 'sometimes|integer|min:0'
            ]);

            $departamento = \App\Models\Departamento::findOrFail($id);
            $imagenesSubidas = [];

            foreach ($request->file('imagenes') as $index => $archivo) {
                // Generar nombre único
                $nombreArchivo = time() . '_' . $index . '.' . $archivo->getClientOriginalExtension();

                // Guardar en storage/app/public/departamentos
                $ruta = $archivo->storeAs('public/departamentos', $nombreArchivo);

                // Determinar si es imagen principal
                $esPrincipal = $request->has('imagen_principal_index') &&
                              $request->input('imagen_principal_index') == $index;

                // Si es principal, desmarcar otras como principales
                if ($esPrincipal) {
                    \App\Models\Imagen::where('departamento_id', $id)
                        ->where('tipo', 'principal')
                        ->update(['tipo' => 'galeria']);
                }

                // Crear registro en base de datos
                $imagen = \App\Models\Imagen::create([
                    'departamento_id' => $id,
                    'url' => str_replace('public/', 'storage/', $ruta),
                    'titulo' => $archivo->getClientOriginalName(),
                    'tipo' => $esPrincipal ? 'principal' : 'galeria',
                    'activa' => true,
                    'orden' => $index + 1
                ]);

                $imagenesSubidas[] = $imagen;
            }

            return redirect()->back()->with('success', 'Imágenes subidas correctamente');

        } catch (\Exception $e) {
            Log::error('Error al subir imágenes', [
                'departamento_id' => $id,
                'error' => $e->getMessage()
            ]);
            return redirect()->back()->with('error', 'Error al subir imágenes: ' . $e->getMessage());
        }
    }

    /**
     * Eliminar una imagen
     */
    public function eliminarImagen($departamentoId, $imagenId)
    {
        try {
            $imagen = \App\Models\Imagen::where('departamento_id', $departamentoId)
                ->where('id', $imagenId)
                ->firstOrFail();

            // Eliminar archivo físico
            $rutaArchivo = $imagen->getAttribute('url');
            if ($rutaArchivo && Storage::exists(str_replace('storage/', 'public/', $rutaArchivo))) {
                Storage::delete(str_replace('storage/', 'public/', $rutaArchivo));
            }

            // Eliminar registro
            $imagen->delete();

            return response()->json(['success' => true]);

        } catch (\Exception $e) {
            Log::error('Error al eliminar imagen', [
                'departamento_id' => $departamentoId,
                'imagen_id' => $imagenId,
                'error' => $e->getMessage()
            ]);
            return response()->json(['error' => 'Error al eliminar imagen'], 500);
        }
    }

    /**
     * Cambiar el orden de una imagen
     */
    public function cambiarOrdenImagen(Request $request, $departamentoId, $imagenId)
    {
        try {
            $request->validate([
                'orden' => 'required|integer|min:0'
            ]);

            $imagen = \App\Models\Imagen::where('departamento_id', $departamentoId)
                ->where('id', $imagenId)
                ->firstOrFail();

            $nuevoOrden = $request->input('orden');

            // Si el orden es 0, hacer esta imagen la principal
            if ($nuevoOrden == 0) {
                // Primero marcar todas como galería
                \App\Models\Imagen::where('departamento_id', $departamentoId)
                    ->update(['tipo' => 'galeria']);

                // Luego marcar esta como principal
                $imagen->update([
                    'tipo' => 'principal',
                    'orden' => $nuevoOrden
                ]);
            } else {
                $imagen->update(['orden' => $nuevoOrden]);
            }

            return response()->json(['success' => true]);
        } catch (\Exception $e) {
            Log::error('Error al cambiar orden de imagen', [
                'departamento_id' => $departamentoId,
                'imagen_id' => $imagenId,
                'error' => $e->getMessage()
            ]);
            return response()->json(['error' => 'Error al cambiar orden de imagen'], 500);
        }
    }

    /**
     * Exportar departamentos a Excel
     */
    public function exportar(Request $request)
    {
        try {
            $response = $this->apiController->admin($request);
            $data = json_decode($response->getContent(), true);

            if ($response->getStatusCode() === 200) {
                $departamentos = $data['data'] ?? [];

                // Crear CSV
                $filename = 'departamentos_' . date('Y-m-d_H-i-s') . '.csv';
                $headers = [
                    'Content-Type' => 'text/csv; charset=UTF-8',
                    'Content-Disposition' => 'attachment; filename="' . $filename . '"',
                ];

                $callback = function() use ($departamentos) {
                    $file = fopen('php://output', 'w');

                    // BOM para UTF-8
                    fwrite($file, "\xEF\xBB\xBF");

                    // Cabeceras
                    fputcsv($file, [
                        'Código',
                        'Título',
                        'Ubicación',
                        'Precio',
                        'Habitaciones',
                        'Baños',
                        'Área Total',
                        'Estado',
                        'Destacado',
                        'Propietario',
                        'Fecha Creación'
                    ]);

                    // Datos
                    foreach ($departamentos as $depto) {
                        fputcsv($file, [
                            $depto['codigo'] ?? '',
                            $depto['titulo'] ?? '',
                            $depto['ubicacion'] ?? '',
                            $depto['precio'] ?? '',
                            $depto['habitaciones'] ?? '',
                            $depto['banos'] ?? '',
                            $depto['area_total'] ?? '',
                            $depto['estado'] ?? '',
                            $depto['destacado'] ? 'Sí' : 'No',
                            $depto['propietario']['nombre'] ?? '',
                            $depto['created_at'] ?? ''
                        ]);
                    }

                    fclose($file);
                };

                return response()->stream($callback, 200, $headers);
            } else {
                return redirect()->back()->with('error', 'Error al exportar datos');
            }
        } catch (\Exception $e) {
            Log::error('Error en exportar departamentos', [
                'error' => $e->getMessage()
            ]);
            return redirect()->back()->with('error', 'Error al exportar departamentos: ' . $e->getMessage());
        }
    }
}
