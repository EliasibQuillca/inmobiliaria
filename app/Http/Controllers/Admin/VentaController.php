<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Venta;
use App\Models\Reserva;
use App\Models\Asesor;
use App\Models\Cliente;
use Illuminate\Http\Request;
use Inertia\Inertia;

class VentaController extends Controller
{
    /**
     * Mostrar lista de ventas
     */
    public function index(Request $request)
    {
        $query = Venta::with([
            'reserva.cotizacion.departamento',
            'reserva.cotizacion.cliente',
            'reserva.cotizacion.asesor.usuario'
        ]);

        // Filtros
        if ($request->filled('busqueda')) {
            $busqueda = $request->busqueda;
            $query->whereHas('reserva.cotizacion', function ($q) use ($busqueda) {
                $q->whereHas('cliente', function ($q2) use ($busqueda) {
                    $q2->where('nombre', 'like', "%{$busqueda}%")
                       ->orWhere('email', 'like', "%{$busqueda}%");
                })
                ->orWhereHas('departamento', function ($q2) use ($busqueda) {
                    $q2->where('titulo', 'like', "%{$busqueda}%")
                       ->orWhere('ubicacion', 'like', "%{$busqueda}%");
                })
                ->orWhereHas('asesor.usuario', function ($q2) use ($busqueda) {
                    $q2->where('name', 'like', "%{$busqueda}%");
                });
            });
        }

        if ($request->filled('estado')) {
            $query->whereHas('reserva', function ($q) use ($request) {
                $q->where('estado', $request->estado);
            });
        }

        if ($request->filled('fecha_desde')) {
            $query->where('fecha_venta', '>=', $request->fecha_desde);
        }

        if ($request->filled('fecha_hasta')) {
            $query->where('fecha_venta', '<=', $request->fecha_hasta);
        }

        $ventas = $query->orderBy('fecha_venta', 'desc')
                       ->paginate($request->get('per_page', 15))
                       ->withQueryString();

        // Calcular estadísticas
        $estadisticas = [
            'total_ventas' => Venta::sum('monto_final'),
            'numero_ventas' => Venta::count(),
            'venta_promedio' => Venta::avg('monto_final'),
            'ventas_mes_actual' => Venta::whereMonth('fecha_venta', now()->month)
                                      ->whereYear('fecha_venta', now()->year)
                                      ->count()
        ];

        return Inertia::render('Admin/Ventas', [
            'ventas' => $ventas,
            'estadisticas' => $estadisticas,
            'filtros' => [
                'busqueda' => $request->busqueda,
                'estado' => $request->estado,
                'fecha_desde' => $request->fecha_desde,
                'fecha_hasta' => $request->fecha_hasta,
                'per_page' => $request->get('per_page', 15)
            ]
        ]);
    }

    /**
     * Mostrar detalles de una venta
     */
    public function show($id)
    {
        $venta = Venta::with([
            'reserva.cotizacion.departamento',
            'reserva.cotizacion.cliente',
            'reserva.cotizacion.asesor.usuario'
        ])->findOrFail($id);

        return Inertia::render('Admin/VentaDetalle', [
            'venta' => $venta
        ]);
    }

    /**
     * Mostrar formulario para crear nueva venta
     */
    public function create()
    {
        // Obtener reservas confirmadas que no tienen venta
        $reservas = Reserva::with([
            'cotizacion.departamento',
            'cotizacion.cliente',
            'cotizacion.asesor.usuario'
        ])
        ->where('estado', 'confirmada')
        ->whereDoesntHave('venta')
        ->get();

        return Inertia::render('Admin/CrearVenta', [
            'reservas' => $reservas
        ]);
    }

    /**
     * Almacenar nueva venta
     */
    public function store(Request $request)
    {
        $request->validate([
            'reserva_id' => 'required|exists:reservas,id',
            'fecha_venta' => 'required|date|before_or_equal:today',
            'monto_final' => 'required|numeric|min:0',
            'documentos_entregados' => 'boolean'
        ]);

        try {
            $venta = Venta::create([
                'reserva_id' => $request->reserva_id,
                'fecha_venta' => $request->fecha_venta,
                'monto_final' => $request->monto_final,
                'documentos_entregados' => $request->documentos_entregados ?? false
            ]);

            // Actualizar estado del departamento a vendido
            $departamento = $venta->reserva->cotizacion->departamento;
            $departamento->update(['estado' => 'vendido']);

            return redirect()->route('admin.ventas')->with('success', 'Venta registrada exitosamente');
        } catch (\Exception $e) {
            return redirect()->back()->withInput()->with('error', 'Error al registrar la venta: ' . $e->getMessage());
        }
    }

    /**
     * Mostrar formulario de edición
     */
    public function edit($id)
    {
        $venta = Venta::with([
            'reserva.cotizacion.departamento',
            'reserva.cotizacion.cliente',
            'reserva.cotizacion.asesor.usuario'
        ])->findOrFail($id);

        return Inertia::render('Admin/EditarVenta', [
            'venta' => $venta
        ]);
    }

    /**
     * Actualizar venta
     */
    public function update(Request $request, $id)
    {
        $venta = Venta::findOrFail($id);

        $request->validate([
            'fecha_venta' => 'required|date|before_or_equal:today',
            'monto_final' => 'required|numeric|min:0',
            'documentos_entregados' => 'boolean'
        ]);

        try {
            $venta->update([
                'fecha_venta' => $request->fecha_venta,
                'monto_final' => $request->monto_final,
                'documentos_entregados' => $request->documentos_entregados ?? false
            ]);

            return redirect()->route('admin.ventas')->with('success', 'Venta actualizada exitosamente');
        } catch (\Exception $e) {
            return redirect()->back()->withInput()->with('error', 'Error al actualizar la venta: ' . $e->getMessage());
        }
    }
}
