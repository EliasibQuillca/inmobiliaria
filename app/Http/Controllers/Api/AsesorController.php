<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cliente;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AsesorController extends Controller
{
    /**
     * Obtener clientes asignados al asesor autenticado
     */
    public function clientes(Request $request)
    {
        try {
            $user = Auth::user();

            // Verificar que el usuario sea un asesor
            if ($user->getAttribute('role') !== 'asesor') {
                return response()->json([
                    'error' => 'No autorizado'
                ], 403);
            }

            // Obtener el asesor
            $asesor = \App\Models\Asesor::where('usuario_id', $user->getKey())->first();
            if (!$asesor) {
                return response()->json([
                    'error' => 'Asesor no encontrado'
                ], 404);
            }

            // Construir la consulta base
            $query = Cliente::where('asesor_id', $asesor->getKey())
                ->with(['user', 'asesor']);

            // Aplicar filtros
            if ($request->filled('busqueda')) {
                $busqueda = $request->input('busqueda');
                $query->where(function($q) use ($busqueda) {
                    $q->where('nombre', 'like', "%{$busqueda}%")
                      ->orWhere('apellido', 'like', "%{$busqueda}%")
                      ->orWhere('email', 'like', "%{$busqueda}%")
                      ->orWhere('nro_documento', 'like', "%{$busqueda}%");
                });
            }

            if ($request->filled('estado')) {
                $query->where('estado', $request->input('estado'));
            }

            if ($request->filled('interes')) {
                $query->where('intereses', 'like', '%' . $request->input('interes') . '%');
            }

            // Aplicar ordenamiento
            $sortBy = $request->input('sort_by', 'created_at');
            $sortDirection = $request->input('sort_direction', 'desc');

            // Mapear campos de ordenamiento
            $validSortFields = [
                'nombre' => 'nombre',
                'fecha_asignacion' => 'created_at',
                'estado' => 'estado',
                'intereses' => 'intereses'
            ];

            if (isset($validSortFields[$sortBy])) {
                $query->orderBy($validSortFields[$sortBy], $sortDirection);
            }

            // Paginación
            $perPage = $request->input('per_page', 10);
            $clientes = $query->paginate($perPage);

            // Formatear los datos para el frontend
            $clientes->getCollection()->transform(function ($cliente) {
                return [
                    'id' => $cliente->id,
                    'nombre' => $cliente->nombre,
                    'apellido' => $cliente->apellido,
                    'email' => $cliente->email,
                    'telefono' => $cliente->telefono,
                    'tipo_documento' => $cliente->tipo_documento,
                    'documento' => $cliente->nro_documento,
                    'intereses' => $cliente->intereses,
                    'estado' => $cliente->estado ?? 'activo',
                    'fecha_asignacion' => $cliente->created_at,
                    'asesor' => $cliente->asesor ? [
                        'id' => $cliente->asesor->getKey(),
                        'nombre' => $cliente->asesor->nombre,
                        'apellido' => $cliente->asesor->apellidos,
                    ] : null,
                ];
            });

            return response()->json($clientes);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error interno del servidor',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtener resumen del panel del asesor
     */
    public function panelResumen(Request $request)
    {
        try {
            $user = Auth::user();
            $asesor = \App\Models\Asesor::where('usuario_id', $user->getKey())->first();

            if (!$asesor) {
                return response()->json([
                    'error' => 'Asesor no encontrado'
                ], 404);
            }

            $resumen = [
                'total_clientes' => Cliente::where('asesor_id', $asesor->getKey())->count(),
                'clientes_nuevos' => Cliente::where('asesor_id', $asesor->getKey())
                    ->whereDate('created_at', '>=', now()->subDays(30))
                    ->count(),
                'propiedades_activas' => 0, // Implementar según tu lógica
                'visitas_programadas' => 0, // Implementar según tu lógica
                'cotizaciones_pendientes' => 0, // Implementar según tu lógica
                'ventas_mes' => 0, // Implementar según tu lógica
                'alquileres_mes' => 0, // Implementar según tu lógica
                'comisiones_mes' => 0, // Implementar según tu lógica
            ];

            return response()->json($resumen);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error interno del servidor'
            ], 500);
        }
    }

    /**
     * Obtener clientes recientes
     */
    public function clientesRecientes(Request $request)
    {
        try {
            $user = Auth::user();
            $asesor = \App\Models\Asesor::where('usuario_id', $user->getKey())->first();

            if (!$asesor) {
                return response()->json([]);
            }

            $clientes = Cliente::where('asesor_id', $asesor->getKey())
                ->with(['asesor'])
                ->orderBy('created_at', 'desc')
                ->limit(5)
                ->get()
                ->map(function ($cliente) {
                    return [
                        'id' => $cliente->id,
                        'nombre' => $cliente->nombre . ' ' . $cliente->apellido,
                        'email' => $cliente->email,
                        'telefono' => $cliente->telefono,
                        'fecha_asignacion' => $cliente->created_at,
                    ];
                });

            return response()->json($clientes);

        } catch (\Exception $e) {
            return response()->json([]);
        }
    }

    /**
     * Obtener próximas visitas del asesor
     */
    public function visitasProximas(Request $request)
    {
        try {
            $user = Auth::user();
            $asesor = \App\Models\Asesor::where('usuario_id', $user->getKey())->first();

            if (!$asesor) {
                return response()->json([]);
            }

            // Por ahora retornamos un array vacío
            // Implementar cuando tengas el modelo de Visitas
            return response()->json([]);

        } catch (\Exception $e) {
            return response()->json([]);
        }
    }

    /**
     * Obtener cotizaciones pendientes del asesor
     */
    public function cotizacionesPendientes(Request $request)
    {
        try {
            $user = Auth::user();
            $asesor = \App\Models\Asesor::where('usuario_id', $user->getKey())->first();

            if (!$asesor) {
                return response()->json([]);
            }

            // Obtener cotizaciones pendientes
            $cotizaciones = \App\Models\Cotizacion::where('asesor_id', $asesor->getKey())
                ->where('estado', 'pendiente')
                ->with(['cliente', 'departamento'])
                ->orderBy('created_at', 'desc')
                ->limit(5)
                ->get()
                ->map(function ($cotizacion) {
                    return [
                        'id' => $cotizacion->id,
                        'cliente' => $cotizacion->cliente ? [
                            'nombre' => $cotizacion->cliente->nombre . ' ' . $cotizacion->cliente->apellido,
                            'email' => $cotizacion->cliente->email,
                        ] : null,
                        'departamento' => $cotizacion->departamento ? [
                            'nombre' => $cotizacion->departamento->nombre,
                            'direccion' => $cotizacion->departamento->direccion,
                        ] : null,
                        'monto' => $cotizacion->monto_total,
                        'estado' => $cotizacion->estado,
                        'fecha_creacion' => $cotizacion->created_at,
                    ];
                });

            return response()->json($cotizaciones);

        } catch (\Exception $e) {
            return response()->json([]);
        }
    }
}
