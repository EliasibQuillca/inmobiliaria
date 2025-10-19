<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class AdminRedirectMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Solo aplicar si el usuario está autenticado
        if (Auth::check()) {
            $user = Auth::user();

            // Si es administrador y NO está en rutas de admin, redirigir
            if ($user->role === 'administrador' && !$request->is('admin/*') && !$request->is('logout')) {
                return redirect()->route('admin.dashboard');
            }

            // Si es asesor y NO está en rutas de asesor, redirigir
            if ($user->role === 'asesor' && !$request->is('asesor/*') && !$request->is('logout')) {
                return redirect()->route('asesor.dashboard');
            }

            // Si es cliente y está en rutas de admin o asesor, devolver 403
            if ($user->role === 'cliente' && ($request->is('admin/*') || $request->is('asesor/*'))) {
                abort(403, 'No tienes permiso para acceder a esta sección.');
            }
        }

        return $next($request);
    }
}
