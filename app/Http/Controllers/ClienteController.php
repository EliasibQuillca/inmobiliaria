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

        $stats = $this->obtenerEstadisticasCliente($cliente);
        $actividades = $this->obtenerActividadesRecientes($cliente);

        return view('cliente.dashboard', compact('cliente', 'stats', 'actividades'));
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
            'total_solicitudes' => $cliente->cotizaciones()->count(),
            'total_favoritos' => $cliente->favoritos()->count(),
            'total_cotizaciones' => $cliente->cotizaciones()->where('estado', '!=', 'cancelada')->count(),
            'total_reservas' => $cliente->reservas()->count(),
        ];
    }

    /**
     * Obtener actividades recientes del cliente.
     *
     * @param Cliente $cliente
     * @return \Illuminate\Support\Collection
     */
    private function obtenerActividadesRecientes(Cliente $cliente)
    {
        $actividades = collect();
        
        // Agregar solicitudes recientes
        $actividades = $actividades->concat($this->obtenerSolicitudesRecientes($cliente));
        
        // Agregar favoritos recientes
        $actividades = $actividades->concat($this->obtenerFavoritosRecientes($cliente));
        
        // Agregar reservas recientes
        $actividades = $actividades->concat($this->obtenerReservasRecientes($cliente));
        
        return $actividades->sortByDesc('fecha')->take(10);
    }

    /**
     * Obtener solicitudes recientes del cliente.
     *
     * @param Cliente $cliente
     * @return \Illuminate\Support\Collection
     */
    private function obtenerSolicitudesRecientes(Cliente $cliente)
    {
        return $cliente->cotizaciones()
            ->with(['departamento'])
            ->latest()
            ->take(3)
            ->get()
            ->map(function ($cotizacion) {
                return [
                    'tipo' => 'solicitud',
                    'descripcion' => "Enviaste una solicitud para {$cotizacion->departamento->codigo}",
                    'fecha' => $cotizacion->created_at
                ];
            });
    }

    /**
     * Obtener favoritos recientes del cliente.
     *
     * @param Cliente $cliente
     * @return \Illuminate\Support\Collection
     */
    private function obtenerFavoritosRecientes(Cliente $cliente)
    {
        return $cliente->favoritos()
            ->with(['departamento'])
            ->latest()
            ->take(3)
            ->get()
            ->map(function ($favorito) {
                return [
                    'tipo' => 'favorito',
                    'descripcion' => "Agregaste {$favorito->departamento->codigo} a favoritos",
                    'fecha' => $favorito->created_at
                ];
            });
    }

    /**
     * Obtener reservas recientes del cliente.
     *
     * @param Cliente $cliente
     * @return \Illuminate\Support\Collection
     */
    private function obtenerReservasRecientes(Cliente $cliente)
    {
        return $cliente->reservas()
            ->with(['departamento'])
            ->latest()
            ->take(3)
            ->get()
            ->map(function ($reserva) {
                return [
                    'tipo' => 'reserva',
                    'descripcion' => "Reservaste {$reserva->departamento->codigo}",
                    'fecha' => $reserva->created_at
                ];
            });
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
