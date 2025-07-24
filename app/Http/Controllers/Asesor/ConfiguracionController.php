<?php

namespace App\Http\Controllers\Asesor;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ConfiguracionController extends Controller
{
    /**
     * Muestra la página de configuración del asesor
     */
    public function index()
    {
        $user = Auth::user();
        $asesor = $user->asesor;

        return Inertia::render('Asesor/Configuracion', [
            'user' => $user,
            'asesor' => $asesor
        ]);
    }

    /**
     * Actualiza las preferencias de notificaciones
     */
    public function updateNotificaciones(Request $request)
    {
        $asesor = Auth::user()->asesor;

        $validated = $request->validate([
            'notif_nuevos_clientes' => 'boolean',
            'notif_cotizaciones' => 'boolean',
            'notif_reservas' => 'boolean',
            'notif_ventas' => 'boolean',
            'notif_email' => 'boolean',
            'notif_whatsapp' => 'boolean',
        ]);

        if ($asesor) {
            $asesor->update($validated);
        }

        return redirect()->back()
            ->with('success', 'Preferencias de notificaciones actualizadas');
    }

    /**
     * Actualiza configuración de horarios de trabajo
     */
    public function updateHorarios(Request $request)
    {
        $asesor = Auth::user()->asesor;

        $validated = $request->validate([
            'horario_inicio' => 'required|date_format:H:i',
            'horario_fin' => 'required|date_format:H:i|after:horario_inicio',
            'dias_trabajo' => 'required|array|min:1',
            'dias_trabajo.*' => 'in:lunes,martes,miercoles,jueves,viernes,sabado,domingo',
        ]);

        if ($asesor) {
            $asesor->update([
                'horario_inicio' => $validated['horario_inicio'],
                'horario_fin' => $validated['horario_fin'],
                'dias_trabajo' => json_encode($validated['dias_trabajo']),
            ]);
        }

        return redirect()->back()
            ->with('success', 'Horarios de trabajo actualizados');
    }

    /**
     * Actualiza configuración de comisiones
     */
    public function updateComisiones(Request $request)
    {
        $asesor = Auth::user()->asesor;

        $validated = $request->validate([
            'porcentaje_comision' => 'required|numeric|min:0|max:100',
            'meta_mensual' => 'nullable|numeric|min:0',
        ]);

        if ($asesor) {
            $asesor->update($validated);
        }

        return redirect()->back()
            ->with('success', 'Configuración de comisiones actualizada');
    }
}
