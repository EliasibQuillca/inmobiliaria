<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;

class LogService
{
    /**
     * Log de actividades del usuario
     */
    public static function logActividad($accion, $detalle = null, $modelo = null)
    {
        $usuario = Auth::user();
        
        Log::info('Actividad de Usuario', [
            'usuario_id' => $usuario?->id,
            'usuario_email' => $usuario?->email,
            'rol' => $usuario?->role,
            'accion' => $accion,
            'detalle' => $detalle,
            'modelo' => $modelo,
            'ip' => request()->ip(),
            'user_agent' => request()->userAgent(),
            'timestamp' => now()
        ]);
    }

    /**
     * Log de errores del sistema
     */
    public static function logError($error, $contexto = [])
    {
        Log::error('Error del Sistema', [
            'mensaje' => $error->getMessage(),
            'archivo' => $error->getFile(),
            'linea' => $error->getLine(),
            'trace' => $error->getTraceAsString(),
            'contexto' => $contexto,
            'usuario' => Auth::user()?->email,
            'url' => request()->fullUrl(),
            'timestamp' => now()
        ]);
    }

    /**
     * Log de queries lentas
     */
    public static function logQueryLenta($query, $tiempo)
    {
        if ($tiempo > 1000) { // más de 1 segundo
            Log::warning('Query Lenta Detectada', [
                'query' => $query,
                'tiempo_ms' => $tiempo,
                'usuario' => Auth::user()?->email,
                'timestamp' => now()
            ]);
        }
    }
}
