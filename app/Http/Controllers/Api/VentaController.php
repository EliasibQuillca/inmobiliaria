<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Venta;
use App\Models\Reserva;
use App\Models\AuditoriaUsuario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class VentaController extends Controller
{
    /**
     * Registrar venta presencial
     */
    public function store(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        if (!$user->esAsesor()) {
            return response()->json([
                'message' => 'Solo los asesores pueden registrar ventas',
            ], 403);
        }

        $request->validate([
            'reserva_id' => 'required|exists:reservas,id',
            'fecha_venta' => 'required|date|before_or_equal:today',
            'monto_final' => 'required|numeric|min:0',
            'documentos_entregados' => 'required|boolean',
        ]);

        try {
            $reserva = Reserva::find($request->reserva_id);

            // Validaciones
            if ($reserva->cotizacion->asesor_id !== $user->asesor->id) {
                return response()->json([
                    'message' => 'No puede registrar ventas de otros asesores',
                ], 403);
            }

            if ($reserva->tieneVenta()) {
                return response()->json([
                    'message' => 'Esta reserva ya tiene una venta registrada',
                ], 422);
            }

            // Crear venta
            $venta = Venta::create([
                'reserva_id' => $reserva->id,
                'fecha_venta' => $request->fecha_venta,
                'monto_final' => $request->monto_final,
                'documentos_entregados' => $request->documentos_entregados,
            ]);

            // Si los documentos están entregados, marcar departamento como vendido
            if ($request->documentos_entregados) {
                $venta->marcarDocumentosEntregados();
            }

            // Registrar auditoría
            AuditoriaUsuario::registrarVenta($user->id, $venta->id);

            return response()->json([
                'message' => 'Venta registrada exitosamente',
                'venta' => $venta->load([
                    'reserva.cotizacion.asesor.usuario',
                    'reserva.cotizacion.departamento',
                    'reserva.cotizacion.cliente.usuario'
                ]),
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al registrar venta',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Marcar documentos como entregados
     */
    public function entregarDocumentos($id)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        if (!$user->esAsesor()) {
            return response()->json([
                'message' => 'Solo los asesores pueden entregar documentos',
            ], 403);
        }

        $venta = Venta::find($id);

        if (!$venta) {
            return response()->json([
                'message' => 'Venta no encontrada',
            ], 404);
        }

        if ($venta->getAsesor()->id !== $user->asesor->id) {
            return response()->json([
                'message' => 'No puede modificar ventas de otros asesores',
            ], 403);
        }

        if ($venta->documentos_entregados) {
            return response()->json([
                'message' => 'Los documentos ya fueron entregados',
            ], 422);
        }

        $venta->marcarDocumentosEntregados();

        return response()->json([
            'message' => 'Documentos marcados como entregados y departamento vendido',
            'venta' => $venta->fresh(),
        ]);
    }

    /**
     * Listar ventas del asesor
     */
    public function index(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        if (!$user->esAsesor()) {
            return response()->json([
                'message' => 'Solo los asesores pueden ver sus ventas',
            ], 403);
        }

        $query = Venta::whereHas('reserva.cotizacion', function($q) use ($user) {
            $q->where('asesor_id', $user->asesor->id);
        })->with([
            'reserva.cotizacion.departamento',
            'reserva.cotizacion.cliente.usuario'
        ]);

        // Filtros
        if ($request->has('documentos_entregados')) {
            $query->where('documentos_entregados', $request->boolean('documentos_entregados'));
        }

        if ($request->has('fecha_desde')) {
            $query->where('fecha_venta', '>=', $request->fecha_desde);
        }

        if ($request->has('fecha_hasta')) {
            $query->where('fecha_venta', '<=', $request->fecha_hasta);
        }

        $ventas = $query->orderBy('fecha_venta', 'desc')->paginate(10);

        return response()->json($ventas);
    }

    /**
     * Mostrar venta específica
     */
    public function show($id)
    {
        $venta = Venta::with([
            'reserva.cotizacion.asesor.usuario',
            'reserva.cotizacion.departamento.propietario',
            'reserva.cotizacion.cliente.usuario'
        ])->find($id);

        if (!$venta) {
            return response()->json([
                'message' => 'Venta no encontrada',
            ], 404);
        }

        /** @var \App\Models\User $user */
        $user = Auth::user();

        // Verificar permisos
        if ($user->esAsesor() && $venta->getAsesor()->id !== $user->asesor->id) {
            return response()->json([
                'message' => 'No tiene permisos para ver esta venta',
            ], 403);
        }

        return response()->json($venta);
    }

    /**
     * Listar todas las ventas (administrador)
     */
    public function admin(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        if (!$user->esAdministrador()) {
            return response()->json([
                'message' => 'Solo los administradores pueden ver todas las ventas',
            ], 403);
        }

        $query = Venta::with([
            'reserva.cotizacion.asesor.usuario',
            'reserva.cotizacion.departamento',
            'reserva.cotizacion.cliente.usuario'
        ]);

        // Filtros
        if ($request->has('asesor_id')) {
            $query->whereHas('reserva.cotizacion', function($q) use ($request) {
                $q->where('asesor_id', $request->asesor_id);
            });
        }

        if ($request->has('documentos_entregados')) {
            $query->where('documentos_entregados', $request->boolean('documentos_entregados'));
        }

        $ventas = $query->orderBy('fecha_venta', 'desc')->paginate(15);

        return response()->json($ventas);
    }
}
