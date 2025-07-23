<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Venta;
use App\Models\Departamento;
use App\Models\User;
use App\Models\Reserva;
use Carbon\Carbon;

class ReporteController extends Controller
{
    public function index()
    {
        // Obtener reportes recientes (esto será una tabla en el futuro)
        $reportesRecientes = collect([
            [
                'id' => 1,
                'tipo' => 'Ventas',
                'titulo' => 'Informe de Ventas - ' . Carbon::now()->format('F Y'),
                'generado' => Carbon::now()->subDays(2),
                'usuario' => 'admin@example.com'
            ]
        ]);

        return Inertia::render('Admin/Reportes', [
            'reportes' => $reportesRecientes
        ]);
    }

    public function show($id)
    {
        // Simular datos del reporte específico
        $reporte = [
            'id' => $id,
            'tipo' => 'Ventas',
            'titulo' => 'Informe de Ventas - ' . Carbon::now()->format('F Y'),
            'generado' => Carbon::now()->subDays(2),
            'datos' => $this->obtenerDatosVentas()
        ];

        return Inertia::render('Admin/VerReporte', [
            'reporte' => $reporte
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/GenerarReporte');
    }

    public function reporteVentas(Request $request)
    {
        $fechaInicio = $request->get('fecha_inicio', Carbon::now()->startOfMonth());
        $fechaFin = $request->get('fecha_fin', Carbon::now()->endOfMonth());

        // Datos de ventas
        $ventas = Venta::with(['reserva.departamento', 'reserva.cliente', 'reserva.asesor'])
            ->whereBetween('fecha_venta', [$fechaInicio, $fechaFin])
            ->get();

        // Resumen de ventas
        $totalVentas = $ventas->sum('monto_final');
        $numeroVentas = $ventas->count();
        $ventaPromedio = $numeroVentas > 0 ? $totalVentas / $numeroVentas : 0;

        // Ventas por asesor
        $ventasPorAsesor = $ventas->groupBy('reserva.asesor.name')
            ->map(function ($ventasAsesor) {
                return [
                    'nombre' => $ventasAsesor->first()->reserva->asesor->name ?? 'Sin asesor',
                    'ventas' => $ventasAsesor->count(),
                    'total' => $ventasAsesor->sum('monto_final'),
                    'comision' => $ventasAsesor->sum('monto_final') * 0.05 // 5% comisión
                ];
            })->values();

        // Ventas por mes (últimos 6 meses)
        $ventasPorMes = collect();
        for ($i = 5; $i >= 0; $i--) {
            $mes = Carbon::now()->subMonths($i);
            $ventasMes = Venta::whereYear('fecha_venta', $mes->year)
                ->whereMonth('fecha_venta', $mes->month)
                ->count();

            $ventasPorMes->push([
                'mes' => $mes->format('M Y'),
                'ventas' => $ventasMes
            ]);
        }

        return response()->json([
            'resumen' => [
                'total_ventas' => $totalVentas,
                'numero_ventas' => $numeroVentas,
                'venta_promedio' => $ventaPromedio,
                'periodo' => Carbon::parse($fechaInicio)->format('d/m/Y') . ' - ' . Carbon::parse($fechaFin)->format('d/m/Y')
            ],
            'ventas_por_asesor' => $ventasPorAsesor,
            'ventas_por_mes' => $ventasPorMes,
            'ventas_detalle' => $ventas->map(function ($venta) {
                return [
                    'id' => $venta->id,
                    'fecha' => $venta->fecha_venta,
                    'cliente' => $venta->reserva->cliente->name ?? 'Cliente no asignado',
                    'asesor' => $venta->reserva->asesor->name ?? 'Asesor no asignado',
                    'departamento' => $venta->reserva->departamento->titulo ?? 'Departamento no asignado',
                    'precio' => $venta->monto_final,
                    'comision' => $venta->monto_final * 0.05,
                    'estado' => 'completada'
                ];
            })
        ]);
    }

    public function reporteAsesores(Request $request)
    {
        $fechaInicio = $request->get('fecha_inicio', Carbon::now()->startOfMonth());
        $fechaFin = $request->get('fecha_fin', Carbon::now()->endOfMonth());

        // Obtener asesores con sus estadísticas
        $asesores = User::where('role', 'asesor')
            ->with(['reservasComplejas' => function ($query) use ($fechaInicio, $fechaFin) {
                $query->whereHas('venta', function ($ventaQuery) use ($fechaInicio, $fechaFin) {
                    $ventaQuery->whereBetween('fecha_venta', [$fechaInicio, $fechaFin]);
                });
            }])
            ->get()
            ->map(function ($asesor) {
                $reservasConVenta = $asesor->reservasComplejas->filter(function ($reserva) {
                    return $reserva->venta !== null;
                });

                return [
                    'id' => $asesor->id,
                    'nombre' => $asesor->name,
                    'email' => $asesor->email,
                    'ventas' => $reservasConVenta->count(),
                    'total_vendido' => $reservasConVenta->sum(function ($reserva) {
                        return $reserva->venta->monto_final ?? 0;
                    }),
                    'comisiones' => $reservasConVenta->sum(function ($reserva) {
                        return ($reserva->venta->monto_final ?? 0) * 0.05;
                    }),
                    'venta_promedio' => $reservasConVenta->count() > 0 ?
                        $reservasConVenta->avg(function ($reserva) {
                            return $reserva->venta->monto_final ?? 0;
                        }) : 0
                ];
            });

        return response()->json([
            'asesores' => $asesores,
            'resumen' => [
                'total_asesores' => $asesores->count(),
                'asesores_activos' => $asesores->where('ventas', '>', 0)->count(),
                'mejor_asesor' => $asesores->sortByDesc('total_vendido')->first(),
                'periodo' => Carbon::parse($fechaInicio)->format('d/m/Y') . ' - ' . Carbon::parse($fechaFin)->format('d/m/Y')
            ]
        ]);
    }

    public function reportePropiedades(Request $request)
    {
        // Estado de propiedades
        $propiedades = Departamento::all();

        $estadisticas = [
            'total_propiedades' => $propiedades->count(),
            'disponibles' => $propiedades->where('estado', 'disponible')->count(),
            'vendidas' => $propiedades->where('estado', 'vendido')->count(),
            'reservadas' => $propiedades->where('estado', 'reservado')->count(),
        ];

        // Propiedades por rango de precios
        $rangoPrecios = [
            'menos_200k' => $propiedades->where('precio', '<', 200000)->count(),
            '200k_400k' => $propiedades->whereBetween('precio', [200000, 400000])->count(),
            '400k_600k' => $propiedades->whereBetween('precio', [400000, 600000])->count(),
            'mas_600k' => $propiedades->where('precio', '>', 600000)->count(),
        ];

        return response()->json([
            'estadisticas' => $estadisticas,
            'rango_precios' => $rangoPrecios,
            'propiedades' => $propiedades->map(function ($propiedad) {
                return [
                    'id' => $propiedad->id,
                    'titulo' => $propiedad->titulo,
                    'precio' => $propiedad->precio,
                    'area' => $propiedad->area_total,
                    'habitaciones' => $propiedad->dormitorios,
                    'estado' => $propiedad->estado,
                    'fecha_creacion' => $propiedad->created_at
                ];
            })
        ]);
    }

    private function obtenerDatosVentas()
    {
        $ventas = Venta::with(['reserva.departamento', 'reserva.cliente', 'reserva.asesor'])->get();

        return [
            'total_ventas' => $ventas->sum('monto_final'),
            'numero_ventas' => $ventas->count(),
            'venta_promedio' => $ventas->count() > 0 ? $ventas->avg('monto_final') : 0,
            'comisiones_totales' => $ventas->sum('monto_final') * 0.05
        ];
    }
}
