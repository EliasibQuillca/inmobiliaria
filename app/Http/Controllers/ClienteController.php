<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Cotizacion;
use App\Models\Reserva;
use App\Models\Cliente;

class ClienteController extends Controller
{
    public function dashboard()
    {
        $user = Auth::user();
        $cliente = Cliente::where('usuario_id', $user->id)->first();
        
        if (!$cliente) {
            return redirect()->route('cliente.perfil.index')
                           ->with('message', 'Por favor completa tu perfil de cliente primero.');
        }

        $estadisticas = $this->obtenerEstadisticasCliente($cliente);
        $actividades_recientes = $this->obtenerActividadesRecientes($cliente);
        $notificaciones = $this->obtenerNotificaciones($cliente);

        return inertia('Cliente/Dashboard', [
            'estadisticas' => $estadisticas,
            'actividades_recientes' => $actividades_recientes,
            'notificaciones' => $notificaciones,
            'propiedades_recomendadas' => []
        ]);
    }

    /**
     * Obtener estadísticas del cliente.
     *
     * @param Cliente $cliente
     * @return array
     */
    private function obtenerEstadisticasCliente(Cliente $cliente): array
    {
        return [
            'solicitudes_activas' => $cliente->cotizaciones()->where('estado', 'pendiente')->count(),
            'cotizaciones_pendientes' => $cliente->cotizaciones()->where('estado', 'en_proceso')->count(),
            'reservas_vigentes' => $cliente->reservas()->where('estado', 'activa')->count(),
            'favoritos_total' => $cliente->favoritos()->count(),
        ];
    }

    /**
     * Obtener notificaciones del cliente.
     *
     * @param Cliente $cliente
     * @return array
     */
    private function obtenerNotificaciones(Cliente $cliente): array
    {
        $notificaciones = [];
        
        // Agregar notificaciones de cotizaciones actualizadas
        $cotizacionesActualizadas = $cliente->cotizaciones()
            ->where('updated_at', '>', now()->subDays(7))
            ->where('created_at', '<', 'updated_at')
            ->get();
            
        foreach ($cotizacionesActualizadas as $cotizacion) {
            $notificaciones[] = [
                'titulo' => 'Cotización actualizada',
                'descripcion' => 'Tu cotización #' . $cotizacion->id . ' ha sido actualizada',
                'fecha' => $cotizacion->updated_at->format('d/m/Y H:i'),
                'tipo' => 'cotizacion'
            ];
        }
        
        // Agregar notificaciones de reservas próximas a vencer
        $reservasProximas = $cliente->reservas()
            ->where('fecha_vencimiento', '>', now())
            ->where('fecha_vencimiento', '<=', now()->addDays(3))
            ->get();
            
        foreach ($reservasProximas as $reserva) {
            $notificaciones[] = [
                'titulo' => 'Reserva próxima a vencer',
                'descripcion' => 'Tu reserva vence el ' . $reserva->fecha_vencimiento->format('d/m/Y'),
                'fecha' => now()->format('d/m/Y H:i'),
                'tipo' => 'reserva'
            ];
        }
        
        return array_slice($notificaciones, 0, 5);
    }

    /**
     * Obtener actividades recientes del cliente.
     *
     * @param Cliente $cliente
     * @return array
     */
    private function obtenerActividadesRecientes(Cliente $cliente): array
    {
        $actividades = [];
        
        // Agregar solicitudes recientes
        $solicitudes = $cliente->cotizaciones()
            ->with(['departamento'])
            ->latest()
            ->take(3)
            ->get();
            
        foreach ($solicitudes as $solicitud) {
            $actividades[] = [
                'tipo' => 'solicitud',
                'descripcion' => "Enviaste una solicitud para " . ($solicitud->departamento ? $solicitud->departamento->codigo : 'Departamento'),
                'fecha' => $solicitud->created_at->format('d/m/Y H:i'),
                'enlace' => route('cliente.solicitudes.show', $solicitud->id)
            ];
        }
        
        // Agregar favoritos recientes
        $favoritos = $cliente->favoritos()
            ->with(['departamento'])
            ->latest()
            ->take(3)
            ->get();
            
        foreach ($favoritos as $favorito) {
            $actividades[] = [
                'tipo' => 'favorito',
                'descripcion' => "Agregaste a favoritos " . ($favorito->departamento ? $favorito->departamento->codigo : 'Departamento'),
                'fecha' => $favorito->created_at->format('d/m/Y H:i'),
                'enlace' => route('cliente.favoritos.index')
            ];
        }
        
        // Agregar reservas recientes
        $reservas = $cliente->reservas()
            ->with(['departamento'])
            ->latest()
            ->take(2)
            ->get();
            
        foreach ($reservas as $reserva) {
            $actividades[] = [
                'tipo' => 'reserva',
                'descripcion' => "Realizaste una reserva para " . ($reserva->departamento ? $reserva->departamento->codigo : 'Departamento'),
                'fecha' => $reserva->created_at->format('d/m/Y H:i'),
                'enlace' => route('cliente.reservas.show', $reserva->id)
            ];
        }
        
        // Ordenar por fecha y tomar los 8 más recientes
        usort($actividades, function($a, $b) {
            return strtotime($b['fecha']) - strtotime($a['fecha']);
        });
        
        return array_slice($actividades, 0, 8);
    }

    public function perfil()
    {
        $user = Auth::user();
        $cliente = Cliente::where('usuario_id', $user->id)->first();
        
        return inertia('Cliente/Perfil', [
            'cliente' => $cliente
        ]);
    }

    public function updatePerfil(Request $request)
    {
        $request->validate([
            'telefono' => 'required|string|max:20',
            'direccion' => 'required|string|max:255',
            'fecha_nacimiento' => 'nullable|date',
            'preferencias' => 'nullable|array',
            'preferencias.rango_precios' => 'nullable|array',
            'preferencias.zonas_interes' => 'nullable|array',
            'preferencias.caracteristicas' => 'nullable|array',
        ]);

        $user = Auth::user();
        
        // Buscar o crear cliente
        $cliente = Cliente::updateOrCreate(
            ['usuario_id' => $user->id],
            [
                'telefono' => $request->telefono,
                'direccion' => $request->direccion,
                'fecha_nacimiento' => $request->fecha_nacimiento,
                'preferencias' => $request->preferencias,
            ]
        );

        return back()->with('message', 'Perfil actualizado exitosamente.');
    }

    public function solicitudes()
    {
        $user = Auth::user();
        $cliente = Cliente::where('usuario_id', $user->id)->first();
        
        if (!$cliente) {
            return redirect()->route('cliente.perfil.index')
                           ->with('message', 'Por favor completa tu perfil primero.');
        }

        // Obtener solicitudes con departamento, asesor y comentarios
        $solicitudes = $cliente->cotizaciones()
            ->with([
                'departamento:id,codigo,direccion,precio', 
                'asesor.usuario:id,name',
                'comentarios' => function($query) {
                    $query->latest()->take(10);
                },
                'comentarios.usuario:id,name'
            ])
            ->latest()
            ->get();

        return inertia('Cliente/Solicitudes', [
            'solicitudes' => $solicitudes,
            'cliente' => $cliente
        ]);
    }

    public function cotizaciones()
    {
        $user = Auth::user();
        $cliente = Cliente::where('usuario_id', $user->id)->first();
        
        if (!$cliente) {
            return redirect()->route('cliente.perfil.index')
                           ->with('message', 'Por favor completa tu perfil primero.');
        }

        $cotizaciones = $cliente->cotizaciones()
            ->with(['departamento', 'asesor.usuario'])
            ->where('estado', '!=', 'cancelada')
            ->latest()
            ->get();

        return inertia('Cliente/Cotizaciones', [
            'cotizaciones' => $cotizaciones,
            'cliente' => $cliente
        ]);
    }

    public function reservas()
    {
        $user = Auth::user();
        $cliente = Cliente::where('usuario_id', $user->id)->first();
        
        if (!$cliente) {
            return redirect()->route('cliente.perfil.index')
                           ->with('message', 'Por favor completa tu perfil primero.');
        }

        $reservas = $cliente->reservas()
            ->with(['departamento', 'asesor.usuario'])
            ->latest()
            ->get();

        return inertia('Cliente/Reservas', [
            'reservas' => $reservas,
            'cliente' => $cliente
        ]);
    }
}
