<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

class PerfilController extends Controller
{
    /**
     * Mostrar el perfil del administrador
     */
    public function index()
    {
        $user = Auth::user();

        return Inertia::render('Admin/Perfil/Index', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'telefono' => $user->telefono,
                'role' => $user->role,
                'estado' => $user->estado,
                'created_at' => $user->created_at,
            ]
        ]);
    }

    /**
     * Actualizar información del perfil
     */
    public function update(Request $request)
    {
        $user = Auth::user();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email,' . $user->id,
            'telefono' => 'nullable|string|max:20',
            'current_password' => 'required_with:email',
        ], [
            'name.required' => 'El nombre es obligatorio',
            'email.required' => 'El correo electrónico es obligatorio',
            'email.email' => 'El correo electrónico debe ser válido',
            'email.unique' => 'Este correo electrónico ya está registrado',
            'current_password.required_with' => 'Debes ingresar tu contraseña para cambiar el correo electrónico',
        ]);

        // Si está cambiando el email, verificar la contraseña
        if ($request->email !== $user->email) {
            if (!$request->current_password) {
                return back()->withErrors([
                    'current_password' => 'Debes ingresar tu contraseña para cambiar el correo electrónico'
                ]);
            }

            if (!Hash::check($request->current_password, $user->password)) {
                return back()->withErrors([
                    'current_password' => 'La contraseña es incorrecta'
                ]);
            }
        }

        $user->update([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'telefono' => $validated['telefono'],
        ]);

        return redirect()->route('admin.perfil.index')->with('message', '✅ Perfil actualizado exitosamente');
    }

    /**
     * Actualizar contraseña
     */
    public function updatePassword(Request $request)
    {
        $user = Auth::user();

        $validated = $request->validate([
            'current_password' => 'required',
            'password' => ['required', 'confirmed', Password::min(8)],
        ], [
            'current_password.required' => 'La contraseña actual es obligatoria',
            'password.required' => 'La nueva contraseña es obligatoria',
            'password.confirmed' => 'Las contraseñas no coinciden',
            'password.min' => 'La contraseña debe tener al menos 8 caracteres',
        ]);

        // Verificar que la contraseña actual sea correcta
        if (!Hash::check($validated['current_password'], $user->password)) {
            return back()->withErrors([
                'current_password' => 'La contraseña actual es incorrecta'
            ]);
        }

        // Actualizar la contraseña
        $user->update([
            'password' => Hash::make($validated['password'])
        ]);

        return redirect()->route('admin.perfil.index')->with('message', '🔒 Contraseña actualizada exitosamente');
    }
}
