<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Venta;
use App\Models\Cotizacion;
use App\Models\Reserva;
use App\Models\Departamento;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ReporteController extends Controller
{
    /**
     * Estadísticas generales para el dashboard de administrador
     */
    public function dashboard()
    {
        $user = Auth::user();

        if (!$user || !$user->hasRole('administrador')) {
            return response()->json([
                'message' => 'No autorizado',
            ], 403);
        }

        // Obtener estadísticas de ventas
        $ventasTotal = Venta::count();
        $ventasMes = Venta::whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->count();

        $montoVentasTotal = Venta::sum('monto_total');
        $montoVentasMes = Venta::whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->sum('monto_total');

        // Obtener estadísticas de departamentos
        $departamentosTotal = Departamento::count();
        $departamentosDisponibles = Departamento::disponibles()->count();
        $departamentosReservados = Departamento::reservados()->count();
        $departamentosVendidos = Departamento::vendidos()->count();

        // Obtener estadísticas de clientes y usuarios
        $clientesTotal = User::where('role', 'cliente')->count();
        $clientesNuevosMes = User::where('role', 'cliente')
            ->whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->count();

        // Estadísticas de cotizaciones y reservas
        $cotizacionesTotal = Cotizacion::count();
        $cotizacionesPendientes = Cotizacion::where('estado', 'pendiente')->count();
        $reservasTotal = Reserva::count();
        $reservasActivas = Reserva::where('estado', 'activa')->count();

        return response()->json([
            'data' => [
                'ventas' => [
                    'total' => $ventasTotal,
                    'mes_actual' => $ventasMes,
                    'monto_total' => $montoVentasTotal,
                    'monto_mes' => $montoVentasMes,
                ],
                'departamentos' => [
                    'total' => $departamentosTotal,
                    'disponibles' => $departamentosDisponibles,
                    'reservados' => $departamentosReservados,
                    'vendidos' => $departamentosVendidos,
                ],
                'clientes' => [
                    'total' => $clientesTotal,
                    'nuevos_mes' => $clientesNuevosMes,
                ],
                'operaciones' => [
                    'cotizaciones_total' => $cotizacionesTotal,
                    'cotizaciones_pendientes' => $cotizacionesPendientes,
                    'reservas_total' => $reservasTotal,
                    'reservas_activas' => $reservasActivas,
                ],
            ]
        ]);
    }

    /**
     * Reporte de ventas para administrador
     */
    public function ventasPorPeriodo(Request $request)
    {
        $user = Auth::user();

        if (!$user || !$user->hasRole('administrador')) {
            return response()->json([
                'message' => 'No autorizado',
            ], 403);
        }

        $request->validate([
            'fecha_inicio' => 'required|date',
            'fecha_fin' => 'required|date|after_or_equal:fecha_inicio',
        ]);

        $fechaInicio = Carbon::parse($request->input('fecha_inicio'))->startOfDay();
        $fechaFin = Carbon::parse($request->input('fecha_fin'))->endOfDay();

        $ventas = Venta::with(['cliente', 'asesor', 'departamento'])
            ->whereBetween('created_at', [$fechaInicio, $fechaFin])
            ->orderBy('created_at', 'desc')
            ->get();

        $totalMonto = $ventas->sum('monto_total');
        $totalComisiones = $ventas->sum('monto_comision');

        // Agrupar por asesor
        $ventasPorAsesor = $ventas->groupBy('asesor_id')
            ->map(function ($grupo) {
                $asesor = $grupo->first()->asesor;
                return [
                    'asesor' => $asesor ? $asesor->usuario->name : 'No asignado',
                    'cantidad' => $grupo->count(),
                    'monto_total' => $grupo->sum('monto_total'),
                    'comision_total' => $grupo->sum('monto_comision'),
                ];
            })->values();

        return response()->json([
            'data' => [
                'periodo' => [
                    'fecha_inicio' => $fechaInicio->toDateString(),
                    'fecha_fin' => $fechaFin->toDateString(),
                ],
                'ventas' => $ventas,
                'resumen' => [
                    'total_ventas' => $ventas->count(),
                    'monto_total' => $totalMonto,
                    'comisiones_total' => $totalComisiones,
                ],
                'por_asesor' => $ventasPorAsesor,
            ]
        ]);
    }

    /**
     * Generar PDF de reporte de ventas (para administrador)
     */
    public function generarPdfVentas(Request $request)
    {
        $user = Auth::user();

        if (!$user || !$user->hasRole('administrador')) {
            return response()->json([
                'message' => 'No autorizado',
            ], 403);
        }

        $request->validate([
            'fecha_inicio' => 'required|date',
            'fecha_fin' => 'required|date|after_or_equal:fecha_inicio',
        ]);

        $fechaInicio = Carbon::parse($request->input('fecha_inicio'))->startOfDay();
        $fechaFin = Carbon::parse($request->input('fecha_fin'))->endOfDay();

        $ventas = Venta::with(['cliente', 'asesor', 'departamento'])
            ->whereBetween('created_at', [$fechaInicio, $fechaFin])
            ->orderBy('created_at', 'desc')
            ->get();

        // Aquí iría la lógica para generar el PDF con una librería como DomPDF
        // Por ahora, solo devolvemos un mensaje de éxito

        return response()->json([
            'message' => 'La funcionalidad de generación de PDF será implementada con una librería como DomPDF',
            'success' => true,
            'data' => [
                'ventas_count' => $ventas->count(),
                'periodo' => [
                    'fecha_inicio' => $fechaInicio->toDateString(),
                    'fecha_fin' => $fechaFin->toDateString(),
                ],
            ]
        ]);
    }

    /**
     * Reporte de rendimiento de asesores
     */
    public function rendimientoAsesores(Request $request)
    {
        $user = Auth::user();

        if (!$user || !$user->hasRole('administrador')) {
            return response()->json([
                'message' => 'No autorizado',
            ], 403);
        }

        $request->validate([
            'periodo' => 'required|in:mes,trimestre,semestre,anual',
        ]);

        $periodo = $request->input('periodo');
        $fechaFin = now();

        // Definir la fecha de inicio según el período seleccionado
        switch ($periodo) {
            case 'mes':
                $fechaInicio = now()->subMonth();
                break;
            case 'trimestre':
                $fechaInicio = now()->subMonths(3);
                break;
            case 'semestre':
                $fechaInicio = now()->subMonths(6);
                break;
            case 'anual':
                $fechaInicio = now()->subYear();
                break;
            default:
                $fechaInicio = now()->subMonth();
        }

        // Obtener los asesores con sus estadísticas de ventas
        $asesores = User::with(['asesor', 'asesor.cotizaciones', 'asesor.ventas'])
            ->where('role', 'asesor')
            ->get()
            ->map(function ($user) use ($fechaInicio, $fechaFin) {
                // Estas consultas deberían ajustarse a tu estructura real de base de datos
                $ventasCount = 0; // Placeholder
                $ventasMonto = 0;
                $comisiones = 0;
                $cotizaciones = 0;
                $cotizacionesAceptadas = 0;

                // En una implementación real, usaríamos las relaciones correctas
                // $ventasCount = $user->asesor->ventas()->whereBetween('created_at', [$fechaInicio, $fechaFin])->count();

                $tasaConversion = $cotizaciones > 0
                    ? round(($ventasCount / $cotizaciones) * 100, 2)
                    : 0;

                return [
                    'id' => $user->getAttribute('id'),
                    'nombre' => $user->name,
                    'email' => $user->email,
                    'telefono' => $user->getAttribute('telefono'),
                    'fecha_contrato' => $user->asesor ? $user->asesor->getAttribute('fecha_contrato') : null,
                    'estadisticas' => [
                        'ventas_count' => $ventasCount,
                        'ventas_monto' => $ventasMonto,
                        'comisiones' => $comisiones,
                        'cotizaciones' => $cotizaciones,
                        'cotizaciones_aceptadas' => $cotizacionesAceptadas,
                        'tasa_conversion' => $tasaConversion,
                    ]
                ];
            })
            // Ordenar por número de ventas (descendente)
            ->sortByDesc(function ($asesor) {
                return $asesor['estadisticas']['ventas_count'];
            })
            ->values();

        return response()->json([
            'data' => [
                'periodo' => [
                    'tipo' => $periodo,
                    'fecha_inicio' => $fechaInicio->toDateString(),
                    'fecha_fin' => $fechaFin->toDateString(),
                ],
                'asesores' => $asesores,
            ]
        ]);
    }
}
