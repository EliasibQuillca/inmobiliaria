<?php

namespace App\Http\Controllers\Cliente;

use App\Http\Controllers\Controller;
use App\Models\AuditoriaUsuario;
use App\Models\Cliente;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class AprobacionController extends Controller
{
    /**
     * Mostrar lista de acciones pendientes de aprobación del cliente
     */
    public function index()
    {
        $cliente = Cliente::where('usuario_id', Auth::id())->firstOrFail();

        // Obtener acciones que requieren aprobación
        $accionesPendientes = AuditoriaUsuario::where('cliente_afectado_id', $cliente->id)
            ->where('requiere_aprobacion', 'si')
            ->where('estado_aprobacion', 'pendiente')
            ->with(['usuario'])
            ->orderBy('prioridad', 'desc')
            ->orderBy('created_at', 'desc')
            ->get();

        // Historial de acciones (aprobadas/rechazadas)
        $historial = AuditoriaUsuario::where('cliente_afectado_id', $cliente->id)
            ->where('requiere_aprobacion', 'si')
            ->whereIn('estado_aprobacion', ['aprobada', 'rechazada'])
            ->with(['usuario'])
            ->orderBy('fecha_respuesta', 'desc')
            ->limit(20)
            ->get();

        // Estadísticas
        $estadisticas = [
            'pendientes' => $accionesPendientes->count(),
            'aprobadas_hoy' => AuditoriaUsuario::where('cliente_afectado_id', $cliente->id)
                ->where('estado_aprobacion', 'aprobada')
                ->whereDate('fecha_respuesta', today())
                ->count(),
            'total_aprobadas' => AuditoriaUsuario::where('cliente_afectado_id', $cliente->id)
                ->where('estado_aprobacion', 'aprobada')
                ->count(),
            'total_rechazadas' => AuditoriaUsuario::where('cliente_afectado_id', $cliente->id)
                ->where('estado_aprobacion', 'rechazada')
                ->count(),
        ];

        return Inertia::render('Cliente/Aprobaciones', [
            'accionesPendientes' => $accionesPendientes,
            'historial' => $historial,
            'estadisticas' => $estadisticas,
        ]);
    }

    /**
     * Aprobar una acción del asesor
     */
    public function aprobar(Request $request, $accionId)
    {
        $cliente = Cliente::where('usuario_id', Auth::id())->firstOrFail();

        $accion = AuditoriaUsuario::where('id', $accionId)
            ->where('cliente_afectado_id', $cliente->id)
            ->where('requiere_aprobacion', 'si')
            ->where('estado_aprobacion', 'pendiente')
            ->firstOrFail();

        $validated = $request->validate([
            'comentario' => 'nullable|string|max:500',
        ]);

        $accion->aprobar($validated['comentario'] ?? 'Aprobado por el cliente');

        Log::info('Cliente aprobó acción', [
            'cliente_id' => $cliente->id,
            'accion_id' => $accion->id,
            'tipo_accion' => $accion->accion,
        ]);

        return redirect()->back()->with('success', '✅ Acción aprobada exitosamente');
    }

    /**
     * Rechazar una acción del asesor
     */
    public function rechazar(Request $request, $accionId)
    {
        $cliente = Cliente::where('usuario_id', Auth::id())->firstOrFail();

        $accion = AuditoriaUsuario::where('id', $accionId)
            ->where('cliente_afectado_id', $cliente->id)
            ->where('requiere_aprobacion', 'si')
            ->where('estado_aprobacion', 'pendiente')
            ->firstOrFail();

        $validated = $request->validate([
            'motivo' => 'required|string|min:10|max:500',
        ], [
            'motivo.required' => 'Debes indicar el motivo del rechazo',
            'motivo.min' => 'El motivo debe tener al menos 10 caracteres',
        ]);

        $accion->rechazar($validated['motivo']);

        Log::info('Cliente rechazó acción', [
            'cliente_id' => $cliente->id,
            'accion_id' => $accion->id,
            'tipo_accion' => $accion->accion,
            'motivo' => $validated['motivo'],
        ]);

        return redirect()->back()->with('success', '✅ Acción rechazada. El asesor será notificado.');
    }

    /**
     * Ver detalle de una acción
     */
    public function show($accionId)
    {
        $cliente = Cliente::where('usuario_id', Auth::id())->firstOrFail();

        $accion = AuditoriaUsuario::where('id', $accionId)
            ->where('cliente_afectado_id', $cliente->id)
            ->with(['usuario'])
            ->firstOrFail();

        return Inertia::render('Cliente/DetalleAprobacion', [
            'accion' => $accion,
        ]);
    }

    /**
     * Marcar notificaciones como leídas
     */
    public function marcarLeidas(Request $request)
    {
        $cliente = Cliente::where('usuario_id', Auth::id())->firstOrFail();

        $ids = $request->input('ids', []);

        AuditoriaUsuario::where('cliente_afectado_id', $cliente->id)
            ->whereIn('id', $ids)
            ->update(['notificado' => true]);

        return response()->json(['success' => true]);
    }
}
