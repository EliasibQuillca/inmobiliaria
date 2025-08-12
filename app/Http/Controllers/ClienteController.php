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
            return redirect()->route('cliente.perfil.create')
                           ->with('message', 'Por favor completa tu perfil de cliente primero.');
        }

        // Obtener estadísticas del cliente
        $stats = [
            'total_solicitudes' => $cliente->cotizaciones()->count(),
            'total_favoritos' => $cliente->favoritos()->count(),
            'total_cotizaciones' => $cliente->cotizaciones()->where('estado', '!=', 'cancelada')->count(),
            'total_reservas' => $cliente->reservas()->count(),
        ];

        // Obtener actividades recientes
        $actividades = [];
        
        // Últimas solicitudes
        $ultimasSolicitudes = $cliente->cotizaciones()
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

        // Últimos favoritos
        $ultimosFavoritos = $cliente->favoritos()
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

        // Últimas reservas
        $ultimasReservas = $cliente->reservas()
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

        // Combinar y ordenar actividades
        $actividades = collect()
            ->merge($ultimasSolicitudes)
            ->merge($ultimosFavoritos)
            ->merge($ultimasReservas)
            ->sortByDesc('fecha')
            ->take(10)
            ->values()
            ->all();

        return inertia('Cliente/Dashboard', [
            'stats' => $stats,
            'actividades' => $actividades,
            'cliente' => $cliente
        ]);
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
            'preferencias' => 'nullable|json'
        ]);

        $user = Auth::user();
        $cliente = Cliente::where('usuario_id', $user->id)->first();

        if (!$cliente) {
            $cliente = Cliente::create([
                'usuario_id' => $user->id,
                'telefono' => $request->telefono,
                'direccion' => $request->direccion,
                'fecha_nacimiento' => $request->fecha_nacimiento,
                'preferencias' => $request->preferencias,
            ]);
        } else {
            $cliente->update([
                'telefono' => $request->telefono,
                'direccion' => $request->direccion,
                'fecha_nacimiento' => $request->fecha_nacimiento,
                'preferencias' => $request->preferencias,
            ]);
        }

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
