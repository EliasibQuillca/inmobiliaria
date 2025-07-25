<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
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
                    return response()->json([
                        'resumen' => [
                            'total_ventas' => 920000,
                            'numero_ventas' => 6,
                            'venta_promedio' => 153333,
                            'periodo' => Carbon::parse($fechaInicio)->format('d/m/Y') . ' - ' . Carbon::parse($fechaFin)->format('d/m/Y')
                        ],
                        'ventas_por_asesor' => [
                            ['nombre' => 'Juan Pérez', 'ventas' => 3, 'total' => 450000, 'comision' => 22500],
                            ['nombre' => 'María García', 'ventas' => 2, 'total' => 320000, 'comision' => 16000],
                            ['nombre' => 'Carlos López', 'ventas' => 1, 'total' => 150000, 'comision' => 7500]
                        ],
                        'ventas_por_mes' => [
                            ['mes' => 'Jun 2025', 'ventas' => 2],
                            ['mes' => 'Jul 2025', 'ventas' => 4]
                        ],
                        'ventas_detalle' => [
                            [
                                'id' => 1,
                                'fecha' => '2025-07-24',
                                'cliente' => 'Ana Martínez',
                                'asesor' => 'Juan Pérez',
                                'departamento' => 'Departamento Premium Vista Mar',
                                'precio' => 150000,
                                'comision' => 7500,
                                'estado' => 'completada'
                            ]
                        ]
                    ]);

                case 'asesores':
                    return response()->json([
                        'resumen' => [
                            'total_asesores' => 3,
                            'asesores_activos' => 3,
                            'mejor_asesor' => ['nombre' => 'Juan Pérez']
                        ],
                        'asesores' => [
                            [
                                'nombre' => 'Juan Pérez',
                                'email' => 'juan@inmobiliaria.com',
                                'ventas' => 3,
                                'total_vendido' => 450000,
                                'comisiones' => 22500
                            ],
                            [
                                'nombre' => 'María García',
                                'email' => 'maria@inmobiliaria.com',
                                'ventas' => 2,
                                'total_vendido' => 320000,
                                'comisiones' => 16000
                            ]
                        ]
                    ]);

                case 'propiedades':
                    return response()->json([
                        'estadisticas' => [
                            'total_propiedades' => 15,
                            'disponibles' => 8,
                            'vendidas' => 5,
                            'reservadas' => 2
                        ],
                        'rango_precios' => [
                            'menos_200k' => 5,
                            '200k_400k' => 6,
                            '400k_600k' => 3,
                            'mas_600k' => 1
                        ]
                    ]);

                case 'usuarios':
                    return response()->json([
                        'estadisticas' => [
                            'total_usuarios' => 6,
                            'usuarios_activos' => 6,
                            'asesores' => 2,
                            'clientes' => 3,
                            'administradores' => 1
                        ],
                        'usuarios' => [
                            [
                                'id' => 1,
                                'nombre' => 'Administrador',
                                'email' => 'admin@inmobiliaria.com',
                                'role' => 'administrador',
                                'activo' => true,
                                'fecha_registro' => '2025-01-01'
                            ]
                        ]
                    ]);

                case 'financiero':
                    return response()->json([
                        'resumen' => [
                            'ingresos_totales' => 920000,
                            'comisiones_totales' => 46000,
                            'margen_neto' => 874000,
                            'roi' => 95.0,
                            'numero_transacciones' => 6,
                            'ticket_promedio' => 153333
                        ],
                        'desglose' => [
                            'ingresos_por_ventas' => 920000,
                            'gastos_comisiones' => 46000,
                            'utilidad_neta' => 874000
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
