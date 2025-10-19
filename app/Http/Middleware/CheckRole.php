<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string $role): Response
    {
        $user = $request->user();

        if (!$user) {
            return redirect()->route('login');
        }

        // Verificar si el usuario tiene el rol requerido
        if ($user->role !== $role) {
            // Devolver un error 403 para las pruebas
            abort(403, 'No tienes permiso para acceder a esta sección.');
        }

        return $next($request);
    }
}
