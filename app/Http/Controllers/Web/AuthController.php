<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Cliente;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;

class AuthController extends Controller
{
    /**
     * Mostrar formulario de inicio de sesión
     */
    public function showLogin()
    {
        return view('auth.login');
    }

    /**
     * Procesar inicio de sesión
     */
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (Auth::attempt($credentials, $request->boolean('remember'))) {
            $request->session()->regenerate();

            // Redirigir según el rol del usuario
            $user = Auth::user();

            if ($user->hasRole(['administrador', 'asesor'])) {
                return redirect()->intended('/dashboard');
            }

            return redirect()->intended('/');
        }

        return back()->withErrors([
            'email' => 'Las credenciales proporcionadas no coinciden con nuestros registros.',
        ])->onlyInput('email');
    }

    /**
     * Mostrar formulario de registro
     */
    public function showRegister()
    {
        return view('auth.register');
    }

    /**
     * Procesar registro de nuevo usuario (solo clientes)
     */
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'telefono' => 'required|string|max:20',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        try {
            // Crear el usuario
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => 'cliente', // Solo se permite registro como cliente
            ]);

            // Crear el perfil de cliente
            Cliente::create([
                'nombre' => $request->name,
                'telefono' => $request->telefono,
                'email' => $request->email,
                'user_id' => $user->id,
            ]);

            // Iniciar sesión automáticamente
            Auth::login($user);

            return redirect('/')->with('success', '¡Cuenta creada exitosamente!');

        } catch (\Exception $e) {
            return back()->with('error', 'Hubo un problema al crear tu cuenta. Por favor intenta de nuevo.');
        }
    }

    /**
     * Cerrar sesión
     */
    public function logout(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
