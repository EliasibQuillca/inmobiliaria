<?php

namespace App\Http\Controllers\Cliente;

use App\Http\Controllers\Controller;
use App\Models\Asesor;
use App\Models\Cliente;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AsesorController extends Controller
{
    /**
     * Mostrar lista de asesores disponibles para el cliente
     */
    public function index()
    {
        // Obtener el cliente actual
        $cliente = Cliente::where('usuario_id', Auth::id())->first();
        $asesorAsignadoId = $cliente ? $cliente->asesor_id : null;

        $asesores = Asesor::with(['usuario'])
            ->whereHas('usuario', function($query) {
                $query->where('estado', true);
            })
            ->get()
            ->map(function ($asesor) use ($asesorAsignadoId) {
                return [
                    'id' => $asesor->id,
                    'nombre' => $asesor->usuario->name,
                    'email' => $asesor->usuario->email,
                    'telefono' => $asesor->usuario->telefono,
                    'especialidad' => $asesor->especialidad ?? 'Asesor Inmobiliario',
                    'foto' => $asesor->foto ?? null,
                    'anos_experiencia' => $asesor->anos_experiencia ?? 0,
                    'licencia' => $asesor->licencia ?? 'N/A',
                    // Estadísticas
                    'total_clientes' => $asesor->clientes()->count(),
                    'total_ventas' => $asesor->ventas()->where('estado', 'completada')->count(),
                    'cotizaciones_activas' => $asesor->cotizaciones()
                        ->whereIn('estado', ['pendiente', 'en_proceso'])
                        ->count(),
                    'disponible' => $asesor->disponible ?? true,
                    'calificacion' => $asesor->calificacion ?? 5.0,
                    'es_mi_asesor' => $asesor->id === $asesorAsignadoId,
                ];
            });

        return Inertia::render('Cliente/Asesores', [
            'asesores' => $asesores,
        ]);
    }

    /**
     * Asignar asesor al cliente actual
     */
    public function asignar($asesorId)
    {
        $cliente = Cliente::where('usuario_id', Auth::id())->firstOrFail();
        $asesor = Asesor::findOrFail($asesorId);

        // Verificar que el asesor esté activo
        if (!$asesor->usuario->estado) {
            return redirect()->back()->with('error', 'El asesor seleccionado no está disponible');
        }

        // Asignar asesor al cliente
        $cliente->asesor_id = $asesor->id;
        $cliente->save();

        return redirect()->back()->with('success', "✅ {$asesor->usuario->name} es ahora tu asesor asignado");
    }
}
