<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class ConfiguracionController extends Controller
{
    /**
     * Mostrar página de configuración del sistema
     */
    public function index()
    {
        try {
            $configuracion = [
                'sistema' => [
                    'nombre' => config('app.name', 'Inmobiliaria'),
                    'timezone' => config('app.timezone', 'UTC'),
                    'locale' => config('app.locale', 'es'),
                ],
                'sesion' => [
                    'timeout' => 15, // minutos
                    'warning_time' => 1, // minutos antes de expirar
                ],
                'notificaciones' => [
                    'email_enabled' => true,
                    'sms_enabled' => false,
                ],
                'reportes' => [
                    'auto_generate' => false,
                    'frequency' => 'weekly',
                ],
            ];

            return Inertia::render('Admin/Configuracion/Index', [
                'configuracion' => $configuracion
            ]);

        } catch (\Exception $e) {
            Log::error('Error al cargar configuración', [
                'error' => $e->getMessage(),
                'user' => Auth::user()->email ?? 'guest'
            ]);

            return redirect()->back()->with('error', 'Error al cargar la configuración');
        }
    }

    /**
     * Actualizar configuración del sistema
     */
    public function update(Request $request)
    {
        try {
            $validated = $request->validate([
                'sistema.nombre' => 'sometimes|string|max:255',
                'sistema.timezone' => 'sometimes|string',
                'sesion.timeout' => 'sometimes|integer|min:5|max:60',
                'notificaciones.email_enabled' => 'sometimes|boolean',
                'notificaciones.sms_enabled' => 'sometimes|boolean',
                'reportes.auto_generate' => 'sometimes|boolean',
                'reportes.frequency' => 'sometimes|in:daily,weekly,monthly',
            ]);

            // Aquí puedes guardar la configuración en la base de datos
            // o en archivos de configuración según tu implementación

            Log::info('Configuración actualizada', [
                'user' => Auth::user()->email,
                'changes' => $validated
            ]);

            return redirect()->back()->with('success', 'Configuración actualizada correctamente');

        } catch (\Exception $e) {
            Log::error('Error al actualizar configuración', [
                'error' => $e->getMessage(),
                'user' => Auth::user()->email ?? 'guest'
            ]);

            return redirect()->back()->with('error', 'Error al actualizar la configuración');
        }
    }
}
