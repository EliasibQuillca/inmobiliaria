<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Services\LogService;
use Illuminate\Support\Facades\DB;

class DebugMiddleware
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next)
    {
        $startTime = microtime(true);
        
        // Contar queries antes
        $queryCount = 0;
        DB::listen(function ($query) use (&$queryCount) {
            $queryCount++;
            LogService::logQueryLenta($query->sql, $query->time);
        });

        $response = $next($request);

        $endTime = microtime(true);
        $responseTime = ($endTime - $startTime) * 1000; // en milisegundos

        // Log de performance
        if ($responseTime > 500) { // más de 500ms
            LogService::logError(new \Exception("Request lento detectado"), [
                'url' => $request->fullUrl(),
                'metodo' => $request->method(),
                'tiempo_respuesta_ms' => $responseTime,
                'queries_ejecutadas' => $queryCount,
                'memoria_usada_mb' => memory_get_usage(true) / 1024 / 1024
            ]);
        }

        return $response;
    }
}
