<?php

namespace App\Http\Controllers\Asesor;

use App\Http\Controllers\Controller;
use App\Models\Cliente;
use App\Models\Cotizacion;
use App\Models\Reserva;
use App\Models\Venta;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Muestra el dashboard del asesor con estadísticas principales
     */
    public function index()
    {
        $asesor = Auth::user()->asesor;

        if (!$asesor) {
            return redirect()->route('asesor.perfil')
                ->with('error', 'Debes completar tu perfil de asesor primero');
        }

        // Estadísticas principales
        $totalClientes = Cliente::where('asesor_id', $asesor->id)->count();

        $totalCotizaciones = Cotizacion::where('asesor_id', $asesor->id)->count();

        $cotizacionesPendientes = Cotizacion::where('asesor_id', $asesor->id)
            ->where('estado', 'pendiente')
            ->count();

        $reservasActivas = Reserva::where('asesor_id', $asesor->id)
            ->whereIn('estado', ['pendiente', 'confirmada'])
            ->count();

        $ventasDelMes = Venta::whereHas('reserva', function($query) use ($asesor) {
                $query->where('asesor_id', $asesor->id);
            })
            ->whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->count();

        // Solicitudes pendientes (clientes sin cotizaciones)
        $solicitudesPendientes = Cliente::where('asesor_id', $asesor->id)
            ->whereDoesntHave('cotizaciones')
            ->count();

        // Actividades recientes
        $clientesRecientes = Cliente::where('asesor_id', $asesor->id)
            ->with('usuario')
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        $cotizacionesRecientes = Cotizacion::where('asesor_id', $asesor->id)
            ->with(['cliente.usuario', 'departamento'])
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        return Inertia::render('Asesor/Dashboard', [
            'estadisticas' => [
                'totalClientes' => $totalClientes,
                'totalCotizaciones' => $totalCotizaciones,
                'cotizacionesPendientes' => $cotizacionesPendientes,
                'reservasActivas' => $reservasActivas,
                'ventasDelMes' => $ventasDelMes,
                'solicitudes_pendientes' => $solicitudesPendientes,
                'cotizaciones_activas' => $cotizacionesPendientes,
                'reservas_pendientes' => $reservasActivas,
                'ventas_mes' => $ventasDelMes,
                'clientes_activos' => $totalClientes,
            ],
            'clientesRecientes' => $clientesRecientes,
            'cotizacionesRecientes' => $cotizacionesRecientes,
        ]);
    }
}
