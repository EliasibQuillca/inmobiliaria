<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string $role): Response
    {
        // Verificar autenticación
        if (!Auth::check()) {
            return redirect()->route('login');
        }

        $user = Auth::user();

        // Verificar que el usuario tenga el rol requerido
        if (!$user || $user->role !== $role) {
            // Log del intento de acceso no autorizado
            Log::warning('Acceso denegado', [
                'usuario_id' => $user?->id,
                'role_usuario' => $user?->role,
                'role_requerido' => $role,
                'ruta' => $request->path()
            ]);

            abort(403, 'No tienes permisos para acceder a esta sección.');
        }

        return $next($request);
    }
}
