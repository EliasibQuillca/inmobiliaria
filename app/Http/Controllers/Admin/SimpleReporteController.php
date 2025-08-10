<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Venta;
use App\Models\Asesor;
use App\Models\Departamento;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class SimpleReporteController extends Controller
{
    public function obtenerReporte(Request $request, $tipo)
    {
        try {
            $fechaInicio = $request->get('fecha_inicio', Carbon::now()->startOfMonth());
            $fechaFin = $request->get('fecha_fin', Carbon::now()->endOfMonth());

            switch ($tipo) {
                case 'ventas':
                    // Consultar datos reales de ventas
                    $totalVentas = Venta::whereBetween('created_at', [$fechaInicio, $fechaFin])->sum('monto_final') ?? 0;
                    $numeroVentas = Venta::whereBetween('created_at', [$fechaInicio, $fechaFin])->count();
                    $ventaPromedio = $numeroVentas > 0 ? $totalVentas / $numeroVentas : 0;

                    // Ventas por asesor (datos reales)
                    $ventasPorAsesor = DB::table('ventas')
                        ->join('reservas', 'ventas.reserva_id', '=', 'reservas.id')
                        ->join('cotizaciones', 'reservas.cotizacion_id', '=', 'cotizaciones.id')
                        ->join('asesores', 'cotizaciones.asesor_id', '=', 'asesores.id')
                        ->join('users', 'asesores.usuario_id', '=', 'users.id')
                        ->whereBetween('ventas.created_at', [$fechaInicio, $fechaFin])
                        ->select(
                            'users.name as nombre',
                            DB::raw('COUNT(ventas.id) as ventas'),
                            DB::raw('SUM(ventas.monto_final) as total'),
                            DB::raw('SUM(ventas.monto_final * 0.05) as comision')
                        )
                        ->groupBy('asesores.id', 'users.name')
                        ->get()
                        ->map(function ($item) {
                            return [
                                'nombre' => $item->nombre,
                                'ventas' => (int) $item->ventas,
                                'total' => (float) $item->total,
                                'comision' => (float) $item->comision
                            ];
                        })->toArray();

                    return response()->json([
                        'resumen' => [
                            'total_ventas' => (float) $totalVentas,
                            'numero_ventas' => $numeroVentas,
                            'venta_promedio' => round($ventaPromedio, 2),
                            'periodo' => Carbon::parse($fechaInicio)->format('d/m/Y') . ' - ' . Carbon::parse($fechaFin)->format('d/m/Y')
                        ],
                        'ventas_por_asesor' => $ventasPorAsesor,
                        'ventas_por_mes' => [],
                        'ventas_detalle' => []
                    ]);

                case 'asesores':
                    // Datos reales de asesores
                    $totalAsesores = Asesor::count();
                    $asesoresActivos = Asesor::whereHas('usuario', function($q) {
                        $q->where('estado', 'activo');
                    })->count();

                    $mejorAsesor = DB::table('ventas')
                        ->join('reservas', 'ventas.reserva_id', '=', 'reservas.id')
                        ->join('cotizaciones', 'reservas.cotizacion_id', '=', 'cotizaciones.id')
                        ->join('asesores', 'cotizaciones.asesor_id', '=', 'asesores.id')
                        ->join('users', 'asesores.usuario_id', '=', 'users.id')
                        ->select('users.name as nombre', DB::raw('SUM(ventas.monto_final) as total_vendido'))
                        ->groupBy('asesores.id', 'users.name')
                        ->orderBy('total_vendido', 'desc')
                        ->first();

                    $asesores = DB::table('asesores')
                        ->join('users', 'asesores.usuario_id', '=', 'users.id')
                        ->leftJoin('cotizaciones', 'asesores.id', '=', 'cotizaciones.asesor_id')
                        ->leftJoin('reservas', 'cotizaciones.id', '=', 'reservas.cotizacion_id')
                        ->leftJoin('ventas', 'reservas.id', '=', 'ventas.reserva_id')
                        ->select(
                            'users.name as nombre',
                            'users.email',
                            DB::raw('COUNT(DISTINCT ventas.id) as ventas'),
                            DB::raw('COALESCE(SUM(ventas.monto_final), 0) as total_vendido'),
                            DB::raw('COALESCE(SUM(ventas.monto_final * 0.05), 0) as comisiones')
                        )
                        ->groupBy('asesores.id', 'users.name', 'users.email')
                        ->get()
                        ->map(function ($item) {
                            return [
                                'nombre' => $item->nombre,
                                'email' => $item->email,
                                'ventas' => (int) $item->ventas,
                                'total_vendido' => (float) $item->total_vendido,
                                'comisiones' => (float) $item->comisiones
                            ];
                        })->toArray();

                    return response()->json([
                        'resumen' => [
                            'total_asesores' => $totalAsesores,
                            'asesores_activos' => $asesoresActivos,
                            'mejor_asesor' => $mejorAsesor ? ['nombre' => $mejorAsesor->nombre] : ['nombre' => 'N/A']
                        ],
                        'asesores' => $asesores
                    ]);

                case 'propiedades':
                    // Estadísticas reales de propiedades
                    $totalPropiedades = Departamento::count();
                    $disponibles = Departamento::where('estado', 'disponible')->count();
                    $vendidas = Departamento::where('estado', 'vendido')->count();
                    $reservadas = Departamento::where('estado', 'reservado')->count();

                    // Rangos de precios reales
                    $rangos = [
                        'menos_200k' => Departamento::where('precio', '<', 200000)->count(),
                        '200k_400k' => Departamento::whereBetween('precio', [200000, 400000])->count(),
                        '400k_600k' => Departamento::whereBetween('precio', [400000, 600000])->count(),
                        'mas_600k' => Departamento::where('precio', '>', 600000)->count()
                    ];

                    return response()->json([
                        'estadisticas' => [
                            'total_propiedades' => $totalPropiedades,
                            'disponibles' => $disponibles,
                            'vendidas' => $vendidas,
                            'reservadas' => $reservadas
                        ],
                        'rango_precios' => $rangos
                    ]);

                case 'usuarios':
                    // Estadísticas reales de usuarios
                    $totalUsuarios = User::count();
                    $usuariosActivos = User::where('estado', 'activo')->count();
                    $asesores = User::where('role', 'asesor')->count();
                    $clientes = User::where('role', 'cliente')->count();
                    $administradores = User::where('role', 'administrador')->count();

                    return response()->json([
                        'estadisticas' => [
                            'total_usuarios' => $totalUsuarios,
                            'usuarios_activos' => $usuariosActivos,
                            'asesores' => $asesores,
                            'clientes' => $clientes,
                            'administradores' => $administradores
                        ],
                        'usuarios' => []
                    ]);

                case 'financiero':
                    // Datos financieros reales
                    $ingresosTotales = Venta::sum('monto_final') ?? 0;
                    $comisionesTotales = $ingresosTotales * 0.05; // 5% de comisión promedio
                    $margenNeto = $ingresosTotales - $comisionesTotales;
                    $numeroTransacciones = Venta::count();
                    $ticketPromedio = $numeroTransacciones > 0 ? $ingresosTotales / $numeroTransacciones : 0;
                    $roi = $ingresosTotales > 0 ? ($margenNeto / $ingresosTotales) * 100 : 0;

                    return response()->json([
                        'resumen' => [
                            'ingresos_totales' => (float) $ingresosTotales,
                            'comisiones_totales' => (float) $comisionesTotales,
                            'margen_neto' => (float) $margenNeto,
                            'roi' => round($roi, 1),
                            'numero_transacciones' => $numeroTransacciones,
                            'ticket_promedio' => round($ticketPromedio, 2)
                        ],
                        'desglose' => [
                            'ingresos_por_ventas' => (float) $ingresosTotales,
                            'gastos_comisiones' => (float) $comisionesTotales,
                            'utilidad_neta' => (float) $margenNeto
                        ]
                    ]);

                default:
                    return response()->json(['error' => 'Tipo de reporte no válido'], 400);
            }
        } catch (\Exception $e) {
            Log::error("Error en reporte simple {$tipo}: " . $e->getMessage());
            return response()->json(['error' => 'Error interno del servidor'], 500);
        }
    }

    public function exportarReporte(Request $request, $tipo)
    {
        return response()->json(['message' => 'Exportación en desarrollo'], 501);
    }
}
