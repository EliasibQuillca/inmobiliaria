<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Reserva;
use App\Models\Cotizacion;
use App\Models\AuditoriaUsuario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReservaController extends Controller
{
    /**
     * Crear reserva desde cotización aceptada
     */
    public function store(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        if (!$user->esAsesor()) {
            return response()->json([
                'message' => 'Solo los asesores pueden crear reservas',
            ], 403);
        }

        $request->validate([
            'cotizacion_id' => 'required|exists:cotizaciones,id',
        ]);

        try {
            $cotizacion = Cotizacion::find($request->cotizacion_id);

            // Validaciones
            if (!$cotizacion->estaAceptada()) {
                return response()->json([
                    'message' => 'Solo se pueden reservar cotizaciones aceptadas',
                ], 422);
            }

            if ($cotizacion->asesor_id !== $user->asesor->id) {
                return response()->json([
                    'message' => 'No puede reservar cotizaciones de otros asesores',
                ], 403);
            }

            if ($cotizacion->tieneReserva()) {
                return response()->json([
                    'message' => 'Esta cotización ya tiene una reserva',
                ], 422);
            }

            // Crear reserva
            $reserva = Reserva::create([
                'cotizacion_id' => $cotizacion->id,
                'fecha_reserva' => now(),
            ]);

            // Marcar departamento como reservado
            $cotizacion->departamento->marcarComoReservado();

            // Registrar auditoría
            AuditoriaUsuario::registrarCreacionReserva($user->id, $reserva->id);

            return response()->json([
                'message' => 'Reserva creada exitosamente',
                'reserva' => $reserva->load([
                    'cotizacion.asesor.usuario',
                    'cotizacion.departamento',
                    'cotizacion.cliente.usuario'
                ]),
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al crear reserva',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Listar reservas del asesor
     */
    public function index(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        if (!$user->esAsesor()) {
            return response()->json([
                'message' => 'Solo los asesores pueden ver sus reservas',
            ], 403);
        }

        $query = Reserva::whereHas('cotizacion', function($q) use ($user) {
            $q->where('asesor_id', $user->asesor->id);
        })->with([
            'cotizacion.departamento',
            'cotizacion.cliente.usuario',
            'venta'
        ]);

        $reservas = $query->orderBy('created_at', 'desc')->paginate(10);

        return response()->json($reservas);
    }

    /**
     * Mostrar reserva específica
     */
    public function show($id)
    {
        $reserva = Reserva::with([
            'cotizacion.asesor.usuario',
            'cotizacion.departamento.propietario',
            'cotizacion.cliente.usuario',
            'venta'
        ])->find($id);

        if (!$reserva) {
            return response()->json([
                'message' => 'Reserva no encontrada',
            ], 404);
        }

        /** @var \App\Models\User $user */
        $user = Auth::user();

        // Verificar permisos
        if ($user->esAsesor() && $reserva->cotizacion->asesor_id !== $user->asesor->id) {
            return response()->json([
                'message' => 'No tiene permisos para ver esta reserva',
            ], 403);
        }

        return response()->json($reserva);
    }

    /**
     * Listar todas las reservas (administrador)
     */
    public function admin(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        if (!$user->esAdministrador()) {
            return response()->json([
                'message' => 'Solo los administradores pueden ver todas las reservas',
            ], 403);
        }

        $query = Reserva::with([
            'cotizacion.asesor.usuario',
            'cotizacion.departamento',
            'cotizacion.cliente.usuario',
            'venta'
        ]);

        // Filtro por asesor
        if ($request->has('asesor_id')) {
            $query->whereHas('cotizacion', function($q) use ($request) {
                $q->where('asesor_id', $request->asesor_id);
            });
        }

        $reservas = $query->orderBy('created_at', 'desc')->paginate(15);

        return response()->json($reservas);
    }
}
