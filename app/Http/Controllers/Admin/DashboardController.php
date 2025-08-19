<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Asesor;
use App\Models\Cliente;
use App\Models\Departamento;
use App\Models\Cotizacion;
use App\Models\Reserva;
use App\Models\Venta;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Carbon\Carbon;

class DashboardController extends Controller
{
    /**
     * Mostrar el dashboard del administrador.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        // Obtener estadísticas principales
        $totalUsuarios = User::count();
        $propiedadesActivas = Departamento::where('estado', 'disponible')->count();
        
        // Ventas del mes actual
        $ventasDelMes = Venta::whereMonth('fecha_venta', Carbon::now()->month)
                           ->whereYear('fecha_venta', Carbon::now()->year)
                           ->count();
        
        // Ingresos del mes actual
        $ingresosDelMes = Venta::whereMonth('fecha_venta', Carbon::now()->month)
                            ->whereYear('fecha_venta', Carbon::now()->year)
                            ->sum('precio_final');
        
        // Estadísticas secundarias
        $asesoresActivos = Asesor::where('estado', 'activo')->count();
        $clientesNuevos = Cliente::whereMonth('created_at', Carbon::now()->month)
                               ->whereYear('created_at', Carbon::now()->year)
                               ->count();
        $reservasActivas = Reserva::where('estado', 'confirmada')->count();
        
        // Comisiones pendientes
        $comisionesPendientes = Venta::whereNull('comision_pagada')
                                  ->orWhere('comision_pagada', false)
                                  ->sum('comision_asesor');
        
        // Actividades recientes
        $actividadesRecientes = collect();
        
        // Agregar ventas recientes
        $ventasRecientes = Venta::with(['cliente.usuario', 'asesor.usuario', 'departamento'])
                                ->orderBy('created_at', 'desc')
                                ->take(3)
                                ->get();
        
        foreach ($ventasRecientes as $venta) {
            $actividadesRecientes->push([
                'tipo' => 'venta',
                'titulo' => 'Nueva venta completada',
                'descripcion' => $venta->departamento->codigo ?? 'Departamento',
                'usuario' => $venta->asesor->usuario->name ?? 'N/A',
                'tiempo' => $venta->created_at->diffForHumans(),
                'tag' => 'venta',
                'monto' => $venta->precio_final ?? 0
            ]);
        }
        
        // Agregar nuevos asesores
        $asesoresRecientes = Asesor::with('usuario')
                                  ->orderBy('created_at', 'desc')
                                  ->take(2)
                                  ->get();
        
        foreach ($asesoresRecientes as $asesor) {
            $actividadesRecientes->push([
                'tipo' => 'usuario',
                'titulo' => 'Nuevo asesor registrado',
                'descripcion' => $asesor->usuario->name . ' se unió al equipo',
                'usuario' => $asesor->usuario->name,
                'tiempo' => $asesor->created_at->diffForHumans(),
                'tag' => 'usuario'
            ]);
        }
        
        // Agregar nuevas propiedades
        $propiedadesRecientes = Departamento::orderBy('created_at', 'desc')
                                          ->take(2)
                                          ->get();
        
        foreach ($propiedadesRecientes as $propiedad) {
            $actividadesRecientes->push([
                'tipo' => 'propiedad',
                'titulo' => 'Propiedad agregada',
                'descripcion' => $propiedad->codigo ?? 'Nueva propiedad',
                'usuario' => 'Sistema',
                'tiempo' => $propiedad->created_at->diffForHumans(),
                'tag' => 'propiedad'
            ]);
        }
        
        // Ordenar actividades por fecha
        $actividadesRecientes = $actividadesRecientes->sortByDesc(function($item) {
            return Carbon::parse($item['tiempo']);
        })->take(6)->values();
        
        // Calcular porcentajes de crecimiento (comparado con el mes anterior)
        $mesAnterior = Carbon::now()->subMonth();
        
        $usuariosMesAnterior = User::whereMonth('created_at', $mesAnterior->month)
                                 ->whereYear('created_at', $mesAnterior->year)
                                 ->count();
        
        $propiedadesMesAnterior = Departamento::whereMonth('created_at', $mesAnterior->month)
                                            ->whereYear('created_at', $mesAnterior->year)
                                            ->count();
        
        $ventasMesAnterior = Venta::whereMonth('fecha_venta', $mesAnterior->month)
                                ->whereYear('fecha_venta', $mesAnterior->year)
                                ->count();
        
        $ingresosMesAnterior = Venta::whereMonth('fecha_venta', $mesAnterior->month)
                                 ->whereYear('fecha_venta', $mesAnterior->year)
                                 ->sum('precio_final');
        
        // Calcular porcentajes
        $crecimientoUsuarios = $usuariosMesAnterior > 0 ? 
            round((($totalUsuarios - $usuariosMesAnterior) / $usuariosMesAnterior) * 100, 1) : 0;
        
        $crecimientoPropiedades = $propiedadesMesAnterior > 0 ? 
            round((($propiedadesActivas - $propiedadesMesAnterior) / $propiedadesMesAnterior) * 100, 1) : 0;
        
        $crecimientoVentas = $ventasMesAnterior > 0 ? 
            round((($ventasDelMes - $ventasMesAnterior) / $ventasMesAnterior) * 100, 1) : 0;
        
        $crecimientoIngresos = $ingresosMesAnterior > 0 ? 
            round((($ingresosDelMes - $ingresosMesAnterior) / $ingresosMesAnterior) * 100, 1) : 0;
        
        return Inertia::render('Admin/Dashboard', [
            'estadisticas' => [
                'totalUsuarios' => $totalUsuarios,
                'propiedadesActivas' => $propiedadesActivas,
                'ventasDelMes' => $ventasDelMes,
                'ingresosDelMes' => $ingresosDelMes,
                'asesoresActivos' => $asesoresActivos,
                'clientesNuevos' => $clientesNuevos,
                'reservasActivas' => $reservasActivas,
                'comisionesPendientes' => $comisionesPendientes,
            ],
            'crecimiento' => [
                'usuarios' => $crecimientoUsuarios,
                'propiedades' => $crecimientoPropiedades,
                'ventas' => $crecimientoVentas,
                'ingresos' => $crecimientoIngresos,
            ],
            'actividadesRecientes' => $actividadesRecientes,
            'rendimiento' => 'Excelente', // Podrías calcular esto basado en métricas
        ]);
    }
    
    /**
     * Obtener estadísticas para gráficos.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function estadisticas(Request $request)
    {
        $periodo = $request->get('periodo', '30'); // días
        
        $fechaInicio = Carbon::now()->subDays($periodo);
        
        // Ventas por día
        $ventasPorDia = Venta::selectRaw('DATE(fecha_venta) as fecha, COUNT(*) as total, SUM(precio_final) as ingresos')
                           ->where('fecha_venta', '>=', $fechaInicio)
                           ->groupBy('fecha')
                           ->orderBy('fecha')
                           ->get();
        
        // Nuevos usuarios por día
        $usuariosPorDia = User::selectRaw('DATE(created_at) as fecha, COUNT(*) as total')
                            ->where('created_at', '>=', $fechaInicio)
                            ->groupBy('fecha')
                            ->orderBy('fecha')
                            ->get();
        
        return response()->json([
            'ventas' => $ventasPorDia,
            'usuarios' => $usuariosPorDia,
        ]);
    }
}
