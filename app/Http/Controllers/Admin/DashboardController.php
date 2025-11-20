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
        $estadisticas = $this->obtenerEstadisticasPrincipales();
        $crecimiento = $this->calcularCrecimiento();
        $actividadesRecientes = $this->obtenerActividadesRecientes();
        $infoDebug = $this->obtenerInfoDepuracion();

        return Inertia::render('Admin/Dashboard/Index', [
            'estadisticas' => $estadisticas,
            'crecimiento' => $crecimiento,
            'actividadesRecientes' => $actividadesRecientes,
            'rendimiento' => 'Excelente',
            'debug' => $infoDebug,
        ]);
    }

    /**
     * Obtener estadísticas principales del dashboard.
     *
     * @return array
     */
    private function obtenerEstadisticasPrincipales(): array
    {
        $mesActual = Carbon::now();

        return [
            'totalUsuarios' => User::count(),
            'propiedadesActivas' => Departamento::where('estado', 'disponible')->count(),
            'ventasDelMes' => Venta::whereMonth('fecha_venta', $mesActual->month)
                                  ->whereYear('fecha_venta', $mesActual->year)
                                  ->count(),
            'ingresosDelMes' => Venta::whereMonth('fecha_venta', $mesActual->month)
                                   ->whereYear('fecha_venta', $mesActual->year)
                                   ->sum('monto_final'),
            'asesoresActivos' => Asesor::where('estado', 'activo')->count(),
            'clientesNuevos' => Cliente::whereMonth('created_at', $mesActual->month)
                                     ->whereYear('created_at', $mesActual->year)
                                     ->count(),
            'reservasActivas' => Reserva::where('estado', 'confirmada')->count(),
            'comisionesPendientes' => Venta::whereMonth('fecha_venta', $mesActual->month)
                                   ->whereYear('fecha_venta', $mesActual->year)
                                   ->sum('comision'),
            'comisionesDelMes' => Venta::whereMonth('fecha_venta', $mesActual->month)
                                   ->whereYear('fecha_venta', $mesActual->year)
                                   ->sum('comision'),
        ];
    }

    /**
     * Calcular porcentajes de crecimiento comparado con el mes anterior.
     *
     * @return array
     */
    private function calcularCrecimiento(): array
    {
        $mesAnterior = Carbon::now()->subMonth();
        $mesActual = Carbon::now();

        // Datos del mes anterior
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
                                 ->sum('monto_final');

        // Datos del mes actual
        $totalUsuarios = User::count();
        $propiedadesActivas = Departamento::where('estado', 'disponible')->count();
        $ventasDelMes = Venta::whereMonth('fecha_venta', $mesActual->month)
                           ->whereYear('fecha_venta', $mesActual->year)
                           ->count();
        $ingresosDelMes = Venta::whereMonth('fecha_venta', $mesActual->month)
                            ->whereYear('fecha_venta', $mesActual->year)
                            ->sum('monto_final');

        return [
            'usuarios' => $this->calcularPorcentajeCrecimiento($totalUsuarios, $usuariosMesAnterior),
            'propiedades' => $this->calcularPorcentajeCrecimiento($propiedadesActivas, $propiedadesMesAnterior),
            'ventas' => $this->calcularPorcentajeCrecimiento($ventasDelMes, $ventasMesAnterior),
            'ingresos' => $this->calcularPorcentajeCrecimiento($ingresosDelMes, $ingresosMesAnterior),
        ];
    }

    /**
     * Calcular porcentaje de crecimiento entre dos valores.
     *
     * @param float $valorActual
     * @param float $valorAnterior
     * @return float
     */
    private function calcularPorcentajeCrecimiento(float $valorActual, float $valorAnterior): float
    {
        if ($valorAnterior <= 0) {
            return 0;
        }

        return round((($valorActual - $valorAnterior) / $valorAnterior) * 100, 1);
    }

    /**
     * Obtener actividades recientes del sistema.
     *
     * @return \Illuminate\Support\Collection
     */
    private function obtenerActividadesRecientes()
    {
        // Obtener de la tabla de auditoría
        $auditorias = \App\Models\AuditoriaAdmin::with('usuario')
            ->orderBy('created_at', 'desc')
            ->take(10)
            ->get();

        return $auditorias->map(function($auditoria) {
            $iconos = [
                'crear' => '✅',
                'editar' => '✏️',
                'eliminar' => '🗑️',
                'activar' => '✅',
                'desactivar' => '❌',
                'venta' => '💰',
            ];

            return [
                'tipo' => $auditoria->accion,
                'titulo' => ucfirst($auditoria->accion) . ' ' . $auditoria->modelo,
                'descripcion' => $auditoria->descripcion,
                'usuario' => $auditoria->usuario->name ?? 'Sistema',
                'tiempo' => $auditoria->created_at->diffForHumans(),
                'fecha_orden' => $auditoria->created_at,
                'tag' => $auditoria->accion,
                'icono' => $iconos[$auditoria->accion] ?? '📝',
            ];
        });
    }

    /**
     * Obtener ventas recientes para el dashboard.
     *
     * @return \Illuminate\Support\Collection
     */
    private function obtenerVentasRecientes()
    {
        $ventas = Venta::with(['reserva.departamento', 'reserva.asesor.usuario'])
                      ->orderBy('created_at', 'desc')
                      ->take(3)
                      ->get();

        return $ventas->map(function($venta) {
            return [
                'tipo' => 'venta',
                'titulo' => 'Nueva venta completada',
                'descripcion' => $venta->reserva->departamento->codigo ?? 'Departamento',
                'usuario' => $venta->reserva->asesor->usuario->name ?? 'N/A',
                'tiempo' => $venta->created_at->diffForHumans(),
                'fecha_orden' => $venta->created_at,
                'tag' => 'venta',
                'monto' => $venta->monto_final ?? 0
            ];
        });
    }

    /**
     * Obtener asesores recientes para el dashboard.
     *
     * @return \Illuminate\Support\Collection
     */
    private function obtenerAsesoresRecientes()
    {
        $asesores = Asesor::with('usuario')
                         ->orderBy('created_at', 'desc')
                         ->take(2)
                         ->get();

        return $asesores->map(function($asesor) {
            return [
                'tipo' => 'usuario',
                'titulo' => 'Nuevo asesor registrado',
                'descripcion' => $asesor->usuario->name . ' se unió al equipo',
                'usuario' => $asesor->usuario->name,
                'tiempo' => $asesor->created_at->diffForHumans(),
                'fecha_orden' => $asesor->created_at,
                'tag' => 'usuario'
            ];
        });
    }

    /**
     * Obtener propiedades recientes para el dashboard.
     *
     * @return \Illuminate\Support\Collection
     */
    private function obtenerPropiedadesRecientes()
    {
        $propiedades = Departamento::orderBy('created_at', 'desc')
                                 ->take(2)
                                 ->get();

        return $propiedades->map(function($propiedad) {
            return [
                'tipo' => 'propiedad',
                'titulo' => 'Propiedad agregada',
                'descripcion' => $propiedad->codigo ?? 'Nueva propiedad',
                'usuario' => 'Sistema',
                'tiempo' => $propiedad->created_at->diffForHumans(),
                'fecha_orden' => $propiedad->created_at,
                'tag' => 'propiedad'
            ];
        });
    }

    /**
     * Obtener información de depuración del sistema.
     *
     * @return array
     */
    private function obtenerInfoDepuracion(): array
    {
        return [
            'queries_ejecutadas' => DB::getQueryLog() ? count(DB::getQueryLog()) : 0,
            'memoria_usada_mb' => round(memory_get_usage(true) / 1024 / 1024, 2),
            'tiempo_respuesta' => round((microtime(true) - LARAVEL_START) * 1000, 2),
            'cache_activo' => config('cache.default') !== 'array',
            'debug_mode' => config('app.debug'),
            'ambiente' => config('app.env'),
            'version_php' => PHP_VERSION,
            'version_laravel' => app()->version(),
        ];
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
        $ventasPorDia = Venta::selectRaw('DATE(fecha_venta) as fecha, COUNT(*) as total, SUM(monto_final) as ingresos')
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
