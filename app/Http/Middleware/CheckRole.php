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
            return response()->json([
                'message' => 'No autenticado',
            ], 401);
        }

        // Verificar si el usuario tiene el rol requerido
        if ($user->rol !== $role) {
            return response()->json([
                'message' => 'No tiene permisos para acceder a este recurso',
                'required_role' => $role,
                'user_role' => $user->rol,
            ], 403);
        }

        return $next($request);
    }
}
