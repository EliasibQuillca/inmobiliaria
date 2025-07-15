<?php

namespace App\Http\Controllers\Api;

use App\Models\Imagen;
use App\Models\Departamento;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\Controller;

class ImagenController extends Controller
{
    /**
     * Mostrar todas las imágenes de un departamento.
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $departamentoId = $request->query('departamento_id');

            if (!$departamentoId) {
                return response()->json([
                    'success' => false,
                    'message' => 'ID del departamento es requerido'
                ], 400);
            }

            $imagenes = Imagen::where('departamento_id', $departamentoId)
                ->activas()
                ->ordenadas()
                ->get();

            return response()->json([
                'success' => true,
                'data' => $imagenes
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener las imágenes',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Agregar una nueva imagen mediante URL.
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'departamento_id' => 'required|exists:departamentos,id',
                'url' => 'required|url|max:500',
                'titulo' => 'nullable|string|max:100',
                'descripcion' => 'nullable|string|max:255',
                'tipo' => 'required|in:principal,galeria,plano',
                'orden' => 'nullable|integer|min:1'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Datos de validación incorrectos',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Verificar que el departamento existe
            $departamento = Departamento::find($request->departamento_id);
            if (!$departamento) {
                return response()->json([
                    'success' => false,
                    'message' => 'Departamento no encontrado'
                ], 404);
            }

            // Si es imagen principal, desactivar otras principales
            if ($request->tipo === 'principal') {
                Imagen::where('departamento_id', $request->departamento_id)
                    ->where('tipo', 'principal')
                    ->update(['tipo' => 'galeria']);
            }

            // Determinar el orden si no se proporciona
            $orden = $request->orden ?? (Imagen::where('departamento_id', $request->departamento_id)->max('orden') + 1);

            $imagen = Imagen::create([
                'departamento_id' => $request->departamento_id,
                'url' => $request->url,
                'titulo' => $request->titulo,
                'descripcion' => $request->descripcion,
                'tipo' => $request->tipo,
                'orden' => $orden,
                'activa' => true
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Imagen agregada exitosamente',
                'data' => $imagen
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al agregar la imagen',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Mostrar una imagen específica.
     */
    public function show(string $id): JsonResponse
    {
        try {
            $imagen = Imagen::with('departamento')->find($id);

            if (!$imagen) {
                return response()->json([
                    'success' => false,
                    'message' => 'Imagen no encontrada'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => $imagen
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener la imagen',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Actualizar una imagen.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        try {
            $imagen = Imagen::find($id);

            if (!$imagen) {
                return response()->json([
                    'success' => false,
                    'message' => 'Imagen no encontrada'
                ], 404);
            }

            $validator = Validator::make($request->all(), [
                'url' => 'sometimes|url|max:500',
                'titulo' => 'nullable|string|max:100',
                'descripcion' => 'nullable|string|max:255',
                'tipo' => 'sometimes|in:principal,galeria,plano',
                'orden' => 'nullable|integer|min:1',
                'activa' => 'sometimes|boolean'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Datos de validación incorrectos',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Si se cambia a imagen principal, desactivar otras principales
            if ($request->has('tipo') && $request->tipo === 'principal') {
                Imagen::where('departamento_id', $imagen->departamento_id)
                    ->where('tipo', 'principal')
                    ->where('id', '!=', $id)
                    ->update(['tipo' => 'galeria']);
            }

            $imagen->update($request->only([
                'url', 'titulo', 'descripcion', 'tipo', 'orden', 'activa'
            ]));

            return response()->json([
                'success' => true,
                'message' => 'Imagen actualizada exitosamente',
                'data' => $imagen->fresh()
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar la imagen',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Eliminar una imagen.
     */
    public function destroy(string $id): JsonResponse
    {
        try {
            $imagen = Imagen::find($id);

            if (!$imagen) {
                return response()->json([
                    'success' => false,
                    'message' => 'Imagen no encontrada'
                ], 404);
            }

            $imagen->delete();

            return response()->json([
                'success' => true,
                'message' => 'Imagen eliminada exitosamente'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar la imagen',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Reordenar imágenes de un departamento.
     */
    public function reordenar(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'departamento_id' => 'required|exists:departamentos,id',
                'imagenes' => 'required|array',
                'imagenes.*.id' => 'required|exists:imagenes,id',
                'imagenes.*.orden' => 'required|integer|min:1'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Datos de validación incorrectos',
                    'errors' => $validator->errors()
                ], 422);
            }

            foreach ($request->imagenes as $imagenData) {
                Imagen::where('id', $imagenData['id'])
                    ->where('departamento_id', $request->departamento_id)
                    ->update(['orden' => $imagenData['orden']]);
            }

            return response()->json([
                'success' => true,
                'message' => 'Imágenes reordenadas exitosamente'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al reordenar las imágenes',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Verificar si una URL de imagen es válida.
     */
    public function verificarUrl(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'url' => 'required|url'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'URL no válida',
                    'errors' => $validator->errors()
                ], 422);
            }

            $url = $request->url;

            // Verificar si la URL responde
            $headers = @get_headers($url, 1);
            $isValid = $headers && strpos($headers[0], '200') !== false;

            // Verificar si es una imagen
            $contentType = '';
            if (isset($headers['Content-Type'])) {
                $contentType = is_array($headers['Content-Type'])
                    ? $headers['Content-Type'][0]
                    : $headers['Content-Type'];
            }

            $isImage = strpos($contentType, 'image/') === 0;

            return response()->json([
                'success' => true,
                'data' => [
                    'url_valida' => $isValid,
                    'es_imagen' => $isImage,
                    'content_type' => $contentType
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al verificar la URL',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
