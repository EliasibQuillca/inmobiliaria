<?php

namespace App\Http\Controllers\Asesor;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class PerfilController extends Controller
{
    /**
     * Muestra el perfil del asesor
     */
    public function index()
    {
        $user = Auth::user();
        $asesor = $user->asesor;

        return Inertia::render('Asesor/Perfil', [
            'user' => $user,
            'asesor' => $asesor
        ]);
    }

    /**
     * Actualiza la información del perfil
     */
    public function update(Request $request)
    {
        $user = Auth::user();
        $asesor = $user->asesor;

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'telefono' => 'nullable|string|max:20',
            'especialidad' => 'nullable|string|max:255',
            'experiencia_anos' => 'nullable|integer|min:0',
            'descripcion' => 'nullable|string|max:1000',
        ]);

        // Actualizar usuario
        $user->update([
            'name' => $validated['name'],
            'email' => $validated['email'],
        ]);

        // Actualizar asesor si existe
        if ($asesor) {
            $asesor->update([
                'telefono' => $validated['telefono'] ?? $asesor->telefono,
                'especialidad' => $validated['especialidad'] ?? $asesor->especialidad,
                'experiencia_anos' => $validated['experiencia_anos'] ?? $asesor->experiencia_anos,
                'descripcion' => $validated['descripcion'] ?? $asesor->descripcion,
            ]);
        }

        return redirect()->back()
            ->with('success', 'Perfil actualizado exitosamente');
    }

    /**
     * Actualiza la contraseña del asesor
     */
    public function updatePassword(Request $request)
    {
        $validated = $request->validate([
            'current_password' => 'required',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = Auth::user();

        // Verificar contraseña actual
        if (!Hash::check($validated['current_password'], $user->password)) {
            return redirect()->back()
                ->withErrors(['current_password' => 'La contraseña actual no es correcta']);
        }

        // Actualizar contraseña
        $user->update([
            'password' => Hash::make($validated['password'])
        ]);

        return redirect()->back()
            ->with('success', 'Contraseña actualizada exitosamente');
    }
}
