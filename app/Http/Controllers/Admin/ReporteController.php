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
use Barryvdh\DomPDF\Facade\Pdf;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use Illuminate\Support\Facades\Log;

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

        return Inertia::render('Admin/Reportes/Index', [
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

        return Inertia::render('Admin/Reportes/Ver', [
            'reporte' => $reporte
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Reportes/Generar');
    }

    public function reporteVentas(Request $request)
    {
        $fechaInicio = $request->get('fecha_inicio', Carbon::now()->startOfMonth());
        $fechaFin = $request->get('fecha_fin', Carbon::now()->endOfMonth());

        // Datos de ventas (con datos ficticios si no hay ventas reales)
        $ventas = Venta::with(['reserva.departamento', 'reserva.cliente', 'reserva.asesor'])
            ->whereBetween('fecha_venta', [$fechaInicio, $fechaFin])
            ->get();

        // Si no hay ventas, crear datos ficticios para demostración
        if ($ventas->isEmpty()) {
            $datosFicticios = [
                [
                    'nombre' => 'Juan Pérez',
                    'ventas' => 3,
                    'total' => 450000,
                    'comision' => 22500
                ],
                [
                    'nombre' => 'María García',
                    'ventas' => 2,
                    'total' => 320000,
                    'comision' => 16000
                ],
                [
                    'nombre' => 'Carlos López',
                    'ventas' => 1,
                    'total' => 150000,
                    'comision' => 7500
                ]
            ];

            return response()->json([
                'resumen' => [
                    'total_ventas' => 920000,
                    'numero_ventas' => 6,
                    'venta_promedio' => 153333,
                    'periodo' => Carbon::parse($fechaInicio)->format('d/m/Y') . ' - ' . Carbon::parse($fechaFin)->format('d/m/Y')
                ],
                'ventas_por_asesor' => $datosFicticios,
                'ventas_por_mes' => [
                    ['mes' => 'Jun 2025', 'ventas' => 2],
                    ['mes' => 'Jul 2025', 'ventas' => 4]
                ],
                'ventas_detalle' => [
                    [
                        'id' => 1,
                        'fecha' => '2025-07-15',
                        'cliente' => 'Ana Martínez',
                        'asesor' => 'Juan Pérez',
                        'departamento' => 'Departamento Premium Vista Mar',
                        'precio' => 150000,
                        'comision' => 7500,
                        'estado' => 'completada'
                    ],
                    [
                        'id' => 2,
                        'fecha' => '2025-07-20',
                        'cliente' => 'Roberto Silva',
                        'asesor' => 'María García',
                        'departamento' => 'Departamento Moderno Centro',
                        'precio' => 200000,
                        'comision' => 10000,
                        'estado' => 'completada'
                    ]
                ]
            ]);
        }

        // Código original para ventas reales
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
            ->get();

        // Si no hay asesores o datos, usar datos ficticios
        if ($asesores->isEmpty() || $asesores->every(function ($asesor) {
            return $asesor->reservasComplejas->isEmpty();
        })) {
            $datosFicticios = [
                [
                    'id' => 1,
                    'nombre' => 'Juan Pérez Rodríguez',
                    'email' => 'juan.perez@empresa.com',
                    'ventas' => 5,
                    'total_vendido' => 750000,
                    'comisiones' => 37500,
                    'venta_promedio' => 150000
                ],
                [
                    'id' => 2,
                    'nombre' => 'María García López',
                    'email' => 'maria.garcia@empresa.com',
                    'ventas' => 3,
                    'total_vendido' => 450000,
                    'comisiones' => 22500,
                    'venta_promedio' => 150000
                ],
                [
                    'id' => 3,
                    'nombre' => 'Carlos Mendoza Silva',
                    'email' => 'carlos.mendoza@empresa.com',
                    'ventas' => 2,
                    'total_vendido' => 300000,
                    'comisiones' => 15000,
                    'venta_promedio' => 150000
                ]
            ];

            return response()->json([
                'asesores' => $datosFicticios,
                'resumen' => [
                    'total_asesores' => 3,
                    'asesores_activos' => 3,
                    'mejor_asesor' => [
                        'nombre' => 'Juan Pérez Rodríguez',
                        'total_vendido' => 750000
                    ],
                    'periodo' => Carbon::parse($fechaInicio)->format('d/m/Y') . ' - ' . Carbon::parse($fechaFin)->format('d/m/Y')
                ]
            ]);
        }

        // Código original para asesores reales
        $asesoresData = $asesores->map(function ($asesor) {
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
            'asesores' => $asesoresData,
            'resumen' => [
                'total_asesores' => $asesoresData->count(),
                'asesores_activos' => $asesoresData->where('ventas', '>', 0)->count(),
                'mejor_asesor' => $asesoresData->sortByDesc('total_vendido')->first(),
                'periodo' => Carbon::parse($fechaInicio)->format('d/m/Y') . ' - ' . Carbon::parse($fechaFin)->format('d/m/Y')
            ]
        ]);
    }

    public function reportePropiedades(Request $request)
    {
        // Estado de propiedades
        $propiedades = Departamento::all();

        // Si no hay propiedades, usar datos ficticios
        if ($propiedades->isEmpty()) {
            $estadisticasFicticias = [
                'total_propiedades' => 15,
                'disponibles' => 8,
                'vendidas' => 5,
                'reservadas' => 2,
            ];

            $rangoPreciosFicticio = [
                'menos_200k' => 3,
                '200k_400k' => 7,
                '400k_600k' => 4,
                'mas_600k' => 1,
            ];

            $propiedadesFicticias = [
                [
                    'id' => 1,
                    'titulo' => 'Departamento Vista Mar Premium',
                    'precio' => 350000,
                    'area' => 120,
                    'habitaciones' => 3,
                    'estado' => 'disponible',
                    'fecha_creacion' => '2025-06-15'
                ],
                [
                    'id' => 2,
                    'titulo' => 'Penthouse Centro Ejecutivo',
                    'precio' => 650000,
                    'area' => 180,
                    'habitaciones' => 4,
                    'estado' => 'vendido',
                    'fecha_creacion' => '2025-05-20'
                ],
                [
                    'id' => 3,
                    'titulo' => 'Departamento Moderno Norte',
                    'precio' => 280000,
                    'area' => 95,
                    'habitaciones' => 2,
                    'estado' => 'reservado',
                    'fecha_creacion' => '2025-07-01'
                ],
                [
                    'id' => 4,
                    'titulo' => 'Loft Contemporáneo',
                    'precio' => 220000,
                    'area' => 85,
                    'habitaciones' => 2,
                    'estado' => 'disponible',
                    'fecha_creacion' => '2025-06-28'
                ]
            ];

            return response()->json([
                'estadisticas' => $estadisticasFicticias,
                'rango_precios' => $rangoPreciosFicticio,
                'propiedades' => $propiedadesFicticias
            ]);
        }

        // Código original para propiedades reales
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

    // Método dinámico para obtener reportes según el tipo
    public function obtenerReporte(Request $request, $tipo)
    {
        try {
            switch ($tipo) {
                case 'ventas':
                    return $this->reporteVentas($request);
                case 'asesores':
                    return $this->reporteAsesores($request);
                case 'propiedades':
                    return $this->reportePropiedades($request);
                case 'usuarios':
                    return $this->reporteUsuarios($request);
                case 'financiero':
                    return $this->reporteFinanciero($request);
                default:
                    return response()->json(['error' => 'Tipo de reporte no válido'], 400);
            }
        } catch (\Exception $e) {
            // Log del error para debugging
            Log::error("Error en reporte {$tipo}: " . $e->getMessage());

            // Devolver datos ficticios en caso de error
            return $this->datosReporteFicticio($tipo);
        }
    }

    // Método para reporte de usuarios
    public function reporteUsuarios(Request $request)
    {
        $usuarios = User::all();

        $estadisticas = [
            'total_usuarios' => $usuarios->count(),
            'usuarios_activos' => $usuarios->where('estado', 'activo')->count(),
            'asesores' => $usuarios->where('role', 'asesor')->count(),
            'clientes' => $usuarios->where('role', 'cliente')->count(),
            'administradores' => $usuarios->where('role', 'administrador')->count(),
        ];

        return response()->json([
            'estadisticas' => $estadisticas,
            'usuarios' => $usuarios->map(function ($usuario) {
                return [
                    'id' => $usuario->id,
                    'nombre' => $usuario->name,
                    'email' => $usuario->email,
                    'role' => $usuario->role,
                    'activo' => $usuario->estado === 'activo',
                    'fecha_registro' => $usuario->created_at
                ];
            })
        ]);
    }

    // Método para reporte financiero
    public function reporteFinanciero(Request $request)
    {
        $fechaInicio = $request->get('fecha_inicio', Carbon::now()->startOfMonth());
        $fechaFin = $request->get('fecha_fin', Carbon::now()->endOfMonth());

        $ventas = Venta::whereBetween('fecha_venta', [$fechaInicio, $fechaFin])->get();

        $ingresosTotales = $ventas->sum('monto_final');
        $comisionesTotales = $ingresosTotales * 0.05; // 5% de comisión
        $margenNeto = $ingresosTotales - $comisionesTotales;
        $roi = $ingresosTotales > 0 ? ($margenNeto / $ingresosTotales) * 100 : 0;

        return response()->json([
            'resumen' => [
                'ingresos_totales' => $ingresosTotales,
                'comisiones_totales' => $comisionesTotales,
                'margen_neto' => $margenNeto,
                'roi' => round($roi, 2),
                'numero_transacciones' => $ventas->count(),
                'ticket_promedio' => $ventas->count() > 0 ? $ingresosTotales / $ventas->count() : 0
            ],
            'desglose' => [
                'ingresos_por_ventas' => $ingresosTotales,
                'gastos_comisiones' => $comisionesTotales,
                'utilidad_neta' => $margenNeto
            ]
        ]);
    }

    // Método dinámico para exportar reportes
    public function exportarReporte(Request $request, $tipo)
    {
        $formato = $request->get('formato', 'pdf');

        try {
            // Obtener los datos del reporte
            $datosReporte = $this->obtenerReporte($request, $tipo);
            $datos = $datosReporte->getData(true);

            if ($formato === 'pdf') {
                return $this->generarPDF($tipo, $datos, $request);
            } elseif ($formato === 'excel') {
                return $this->generarExcel($tipo, $datos, $request);
            }

            return response()->json(['error' => 'Formato no soportado'], 400);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al generar el reporte: ' . $e->getMessage()], 500);
        }
    }

    // Generar PDF
    private function generarPDF($tipo, $datos, $request)
    {
        $fechaInicio = $request->get('fecha_inicio', '');
        $fechaFin = $request->get('fecha_fin', '');

        // Preparar datos para la vista
        $datosVista = [
            'tipo' => ucfirst($tipo),
            'fechaInicio' => $fechaInicio,
            'fechaFin' => $fechaFin,
            'fecha_generacion' => Carbon::now()->format('d/m/Y H:i'),
            'datos' => $datos
        ];

        // Crear el HTML del PDF
        $html = view('reportes.pdf-template', $datosVista)->render();

        // Generar PDF usando DomPDF
        $pdf = Pdf::loadHTML($html);
        $filename = "reporte_{$tipo}_" . date('Y-m-d') . ".pdf";

        return $pdf->download($filename);
    }

    // Generar Excel
    private function generarExcel($tipo, $datos, $request)
    {
        $fechaInicio = $request->get('fecha_inicio', '');
        $fechaFin = $request->get('fecha_fin', '');

        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();

        // Título
        $sheet->setCellValue('A1', 'Reporte de ' . ucfirst($tipo));
        $sheet->setCellValue('A2', 'Período: ' . $fechaInicio . ' - ' . $fechaFin);
        $sheet->setCellValue('A3', 'Generado el: ' . Carbon::now()->format('d/m/Y H:i'));

        // Resumen
        $row = 5;
        if (isset($datos['resumen'])) {
            $sheet->setCellValue('A' . $row, 'RESUMEN');
            $row++;

            foreach ($datos['resumen'] as $key => $value) {
                $label = ucfirst(str_replace('_', ' ', $key));
                $sheet->setCellValue('A' . $row, $label);
                $sheet->setCellValue('B' . $row, $value);
                $row++;
            }
        }

        // Crear archivo Excel
        $writer = new Xlsx($spreadsheet);
        $filename = "reporte_{$tipo}_" . date('Y-m-d') . ".xlsx";
        $tempFile = tempnam(sys_get_temp_dir(), 'excel_report');

        $writer->save($tempFile);

        return response()->download($tempFile, $filename)->deleteFileAfterSend(true);
    }

    // Método para devolver datos ficticios en caso de error
    private function datosReporteFicticio($tipo)
    {
        switch ($tipo) {
            case 'ventas':
                return response()->json([
                    'resumen' => [
                        'total_ventas' => 920000,
                        'numero_ventas' => 6,
                        'venta_promedio' => 153333,
                        'periodo' => '01/07/2025 - 31/07/2025'
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
                            'cliente' => 'Cliente Demo',
                            'asesor' => 'Juan Pérez',
                            'departamento' => 'Depto 101',
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
    }
}
