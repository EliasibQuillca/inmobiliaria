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
            // Redirigir al dashboard apropiado según el rol del usuario
            if ($user->esCliente()) {
                return redirect()->route('cliente.dashboard');
            } elseif ($user->esAsesor()) {
                return redirect()->route('asesor.dashboard');
            } else {
                return redirect()->route('dashboard');
            }
        }

        return $next($request);
    }
}
