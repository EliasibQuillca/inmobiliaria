<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Venta;
use App\Models\Reserva;
use App\Models\Departamento;
use App\Models\Cliente;
use App\Models\Asesor;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class VentaController extends Controller
{
    /**
     * Mostrar lista de ventas con filtros
     */
    public function index(Request $request)
    {
        $query = Venta::with([
            'reserva.cotizacion.cliente.usuario',
            'reserva.cotizacion.asesor.usuario',
            'reserva.cotizacion.departamento'
        ]);

        // Filtros
        if ($request->busqueda) {
            $query->whereHas('reserva.cotizacion.cliente', function ($q) use ($request) {
                $q->whereHas('usuario', function ($subQ) use ($request) {
                    $subQ->where('name', 'like', '%' . $request->busqueda . '%');
                });
            })->orWhereHas('reserva.cotizacion.departamento', function ($q) use ($request) {
                $q->where('titulo', 'like', '%' . $request->busqueda . '%')
                  ->orWhere('codigo', 'like', '%' . $request->busqueda . '%');
            });
        }

        if ($request->estado) {
            $query->whereHas('reserva', function ($q) use ($request) {
                $q->where('estado', $request->estado);
            });
        }

        if ($request->fecha_desde) {
            $query->where('fecha_venta', '>=', $request->fecha_desde);
        }

        if ($request->fecha_hasta) {
            $query->where('fecha_venta', '<=', $request->fecha_hasta);
        }

        if ($request->asesor_id) {
            $query->whereHas('reserva.cotizacion.asesor', function ($q) use ($request) {
                $q->where('id', $request->asesor_id);
            });
        }

        $ventas = $query->orderBy('created_at', 'desc')->paginate(15);

        // Estadísticas
        $estadisticas = [
            'total_ventas' => Venta::sum('monto_final') ?: 0,
            'numero_ventas' => Venta::count(),
            'venta_promedio' => Venta::avg('monto_final') ?: 0,
            'ventas_mes_actual' => Venta::whereMonth('created_at', now()->month)
                ->whereYear('created_at', now()->year)
                ->count(),
        ];

        return Inertia::render('Admin/Ventas/Index', [
            'ventas' => $ventas,
            'estadisticas' => $estadisticas,
            'filtros' => $request->all(),
            'asesores' => Asesor::with('usuario')->get(),
        ]);
    }

    /**
     * Mostrar formulario para crear nueva venta
     */
    public function create()
    {
        $reservasDisponibles = Reserva::with([
            'cotizacion.cliente.usuario',
            'cotizacion.departamento',
            'cotizacion.asesor.usuario'
        ])
        ->where('estado', 'confirmada')
        ->whereDoesntHave('venta')
        ->get();

        return Inertia::render('Admin/Ventas/Crear', [
            'reservasDisponibles' => $reservasDisponibles,
        ]);
    }

    /**
     * Guardar nueva venta
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'reserva_id' => 'required|exists:reservas,id',
            'fecha_venta' => 'required|date|before_or_equal:today',
            'monto_final' => 'required|numeric|min:0',
            'documentos_entregados' => 'required|boolean',
            'observaciones' => 'nullable|string|max:1000',
        ]);

        // Verificar que la reserva esté disponible
        $reserva = Reserva::where('estado', 'confirmada')
            ->whereDoesntHave('venta')
            ->findOrFail($validated['reserva_id']);

        DB::transaction(function () use ($validated, $reserva) {
            // Crear la venta
            $venta = Venta::create($validated);

            // Si documentos entregados, marcar departamento como vendido
            if ($validated['documentos_entregados']) {
                $departamento = Departamento::find($reserva->cotizacion->departamento_id);
                if ($departamento) {
                    $departamento->update([
                        'estado' => 'vendido',
                        'disponible' => false
                    ]);
                }
            }
        });

        return redirect()->route('admin.ventas')
            ->with('success', 'Venta registrada exitosamente');
    }

    /**
     * Mostrar detalles de una venta
     */
    public function show($id)
    {
        $venta = Venta::with([
            'reserva.cotizacion.cliente.usuario',
            'reserva.cotizacion.asesor.usuario',
            'reserva.cotizacion.departamento.imagenes'
        ])->findOrFail($id);

        return Inertia::render('Admin/Ventas/Ver', [
            'venta' => $venta,
        ]);
    }

    /**
     * Mostrar formulario de edición
     */
    public function edit($id)
    {
        $venta = Venta::with([
            'reserva.cotizacion.cliente.usuario',
            'reserva.cotizacion.asesor.usuario',
            'reserva.cotizacion.departamento'
        ])->findOrFail($id);

        // Obtener reservas disponibles (incluir la actual)
        $reservasDisponibles = Reserva::with([
            'cotizacion.cliente.usuario',
            'cotizacion.departamento',
            'cotizacion.asesor.usuario'
        ])
        ->where(function($query) use ($venta) {
            $query->where('estado', 'confirmada')
                  ->whereDoesntHave('venta')
                  ->orWhere('id', $venta->reserva_id);
        })
        ->get();

        return Inertia::render('Admin/Ventas/Editar', [
            'venta' => $venta,
            'reservasDisponibles' => $reservasDisponibles,
        ]);
    }

    /**
     * Actualizar venta
     */
    public function update(Request $request, $id)
    {
        $venta = Venta::findOrFail($id);

        $validated = $request->validate([
            'reserva_id' => 'required|exists:reservas,id',
            'fecha_venta' => 'required|date|before_or_equal:today',
            'monto_final' => 'required|numeric|min:0',
            'documentos_entregados' => 'boolean',
        ]);

        DB::transaction(function () use ($venta, $validated) {
            $documentosAnteriores = $venta->documentos_entregados;

            // Actualizar venta
            $venta->update($validated);

            // Si cambió estado de documentos
            if (!$documentosAnteriores && $validated['documentos_entregados']) {
                // Marcar departamento como vendido
                $departamento = Departamento::find($venta->reserva->cotizacion->departamento_id);
                if ($departamento) {
                    $departamento->update([
                        'estado' => 'vendido',
                        'disponible' => false
                    ]);
                }
            } elseif ($documentosAnteriores && !$validated['documentos_entregados']) {
                // Revertir estado del departamento
                $departamento = Departamento::find($venta->reserva->cotizacion->departamento_id);
                if ($departamento) {
                    $departamento->update([
                        'estado' => 'reservado',
                        'disponible' => false
                    ]);
                }
            }
        });

        return redirect()->route('admin.ventas')
            ->with('success', 'Venta actualizada exitosamente');
    }

    /**
     * Generar reporte PDF de ventas
     */
    public function generarReporte(Request $request)
    {
        $validated = $request->validate([
            'fecha_desde' => 'required|date',
            'fecha_hasta' => 'required|date|after_or_equal:fecha_desde',
            'asesor_id' => 'nullable|exists:asesores,id',
            'tipo_reporte' => 'required|in:detallado,resumen',
        ]);

        $query = Venta::with([
            'reserva.cotizacion.cliente.usuario',
            'reserva.cotizacion.asesor.usuario',
            'reserva.cotizacion.departamento'
        ])
        ->whereBetween('fecha_venta', [$validated['fecha_desde'], $validated['fecha_hasta']]);

        if ($validated['asesor_id']) {
            $query->whereHas('reserva.cotizacion.asesor', function ($q) use ($validated) {
                $q->where('id', $validated['asesor_id']);
            });
        }

        $ventas = $query->orderBy('fecha_venta', 'desc')->get();

        // Estadísticas para el reporte
        $estadisticas = [
            'total_ventas' => $ventas->sum('monto_final'),
            'numero_ventas' => $ventas->count(),
            'venta_promedio' => $ventas->avg('monto_final') ?: 0,
            'documentos_entregados' => $ventas->where('documentos_entregados', true)->count(),
            'pendientes_documentos' => $ventas->where('documentos_entregados', false)->count(),
        ];

        // Aquí integrarías una librería PDF como DomPDF
        // Por ahora devolvemos los datos para testing
        return response()->json([
            'ventas' => $ventas,
            'estadisticas' => $estadisticas,
            'parametros' => $validated,
            'mensaje' => 'Datos preparados para generar PDF'
        ]);
    }

    /**
     * Cancelar una venta (solo si no se entregaron documentos)
     */
    public function cancelar($id)
    {
        $venta = Venta::findOrFail($id);

        if ($venta->documentos_entregados) {
            return redirect()->back()
                ->withErrors(['error' => 'No se puede cancelar una venta con documentos ya entregados']);
        }

        DB::transaction(function () use ($venta) {
            // Restaurar disponibilidad del departamento
            $departamento = Departamento::find($venta->reserva->cotizacion->departamento_id);
            if ($departamento) {
                $departamento->update([
                    'estado' => 'disponible',
                    'disponible' => true
                ]);
            }

            // Cambiar estado de la reserva
            $venta->reserva->update(['estado' => 'cancelada']);

            // Eliminar la venta
            $venta->delete();
        });

        return redirect()->route('admin.ventas')
            ->with('success', 'Venta cancelada exitosamente');
    }
}
