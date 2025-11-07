<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();
        $userData = null;

        if ($user) {
            $userData = [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'telefono' => $user->telefono,
            ];

            // Agregar datos adicionales según el rol
            if ($user->role === 'cliente' && $user->cliente) {
                $userData = array_merge($userData, [
                    'cedula' => $user->cliente->dni,
                    'fecha_nacimiento' => $user->cliente->fecha_nacimiento,
                    'direccion' => $user->cliente->direccion,
                    'ciudad' => $user->cliente->ciudad,
                    'ocupacion' => $user->cliente->ocupacion,
                    'estado_civil' => $user->cliente->estado_civil,
                    'ingresos_mensuales' => $user->cliente->ingresos_mensuales,
                    'preferencias' => $user->cliente->preferencias,
                ]);
            }
        }

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $userData,
            ],
            'flash' => [
                'message' => fn () => $request->session()->get('message'),
                'error' => fn () => $request->session()->get('error'),
            ],
            // Siempre enviar el token CSRF actualizado
            'csrf_token' => fn () => csrf_token(),
        ];
    }
}
