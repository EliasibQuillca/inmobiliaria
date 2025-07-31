<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => request()->session()->get('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        try {
            $request->authenticate();

            request()->session()->regenerate();

            // Obtener el usuario autenticado
            $user = Auth::user();
            
            if (!$user) {
                Log::error('Usuario no encontrado después de la autenticación');
                return redirect()->back()->withErrors([
                    'email' => 'Error en la autenticación. Intente nuevamente.',
                ]);
            }

            Log::info('Usuario autenticado', ['user_id' => $user->id, 'role' => $user->role]);

            // Redirigir según el rol del usuario
            switch ($user->role) {
                case 'administrador':
                    if (!Route::has('admin.dashboard')) {
                        Log::error('Ruta admin.dashboard no existe');
                        return redirect('/')->with('error', 'Dashboard de administrador no configurado');
                    }
                    Log::info('Redirigiendo administrador al dashboard');
                    return redirect()->intended(route('admin.dashboard', absolute: false));
                    
                case 'asesor':
                    if (!Route::has('asesor.dashboard')) {
                        Log::error('Ruta asesor.dashboard no existe');
                        return redirect('/')->with('error', 'Dashboard de asesor no configurado');
                    }
                    Log::info('Redirigiendo asesor al dashboard');
                    return redirect()->intended(route('asesor.dashboard', absolute: false));
                    
                case 'cliente':
                    if (!Route::has('catalogo.index')) {
                        Log::error('Ruta catalogo.index no existe');
                        return redirect('/')->with('error', 'Catálogo no configurado');
                    }
                    Log::info('Redirigiendo cliente al catálogo');
                    return redirect()->intended(route('catalogo.index', absolute: false));
                    
                default:
                    Log::warning('Rol no reconocido', ['role' => $user->role, 'user_id' => $user->id]);
                    // Si el rol no es reconocido, ir al catálogo por defecto
                    return redirect()->intended(route('catalogo.index', absolute: false));
            }
        } catch (\Exception $e) {
            Log::error('Error durante el proceso de login', [
                'error' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ]);
            
            return redirect()->back()->withErrors([
                'email' => 'Error durante el login. Verifique sus credenciales.',
            ]);
        }
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}
