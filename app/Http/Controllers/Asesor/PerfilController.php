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

        // Calcular estadísticas del asesor
        $estadisticas = [];
        if ($asesor) {
            $estadisticas = [
                'ventas_totales' => $asesor->ventas()->count(),
                'ventas_este_mes' => $asesor->ventas()
                    ->whereMonth('fecha_venta', now()->month)
                    ->whereYear('fecha_venta', now()->year)
                    ->count(),
                'reservas_activas' => $asesor->reservas()
                    ->where('estado', 'confirmada')
                    ->count(),
                'clientes_activos' => $asesor->clientes()
                    ->where('estado', 'activo')
                    ->count(),
                'cotizaciones_mes' => $asesor->cotizaciones()
                    ->whereMonth('created_at', now()->month)
                    ->whereYear('created_at', now()->year)
                    ->count(),
                'antiguedad_anos' => $asesor->getAntiguedad(),
            ];
        }

        return Inertia::render('Asesor/Perfil', [
            'user' => $user,
            'asesor' => $asesor,
            'estadisticas' => $estadisticas
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
            'nombre' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'telefono' => 'nullable|string|max:20',
            'ci' => 'nullable|string|max:20',
            'fecha_nacimiento' => 'nullable|date',
            'direccion' => 'nullable|string|max:500',
            'especialidad' => 'nullable|string|max:255',
            'experiencia' => 'nullable|integer|min:0',
            'descripcion' => 'nullable|string|max:1000',
        ]);

        // Actualizar usuario
        $user->update([
            'name' => $validated['nombre'],
            'email' => $validated['email'],
            'telefono' => $validated['telefono'],
        ]);

        // Actualizar o crear asesor si no existe
        if ($asesor) {
            $asesor->update([
                'nombre' => $validated['nombre'],
                'telefono' => $validated['telefono'] ?? $asesor->telefono,
                'documento' => $validated['ci'] ?? $asesor->documento,
                'fecha_nacimiento' => $validated['fecha_nacimiento'] ?? $asesor->fecha_nacimiento,
                'direccion' => $validated['direccion'] ?? $asesor->direccion,
                'especialidad' => $validated['especialidad'] ?? $asesor->especialidad,
                'experiencia' => $validated['experiencia'] ?? $asesor->experiencia,
                'biografia' => $validated['descripcion'] ?? $asesor->biografia,
            ]);
        } else {
            // Crear registro de asesor si no existe
            \App\Models\Asesor::create([
                'usuario_id' => $user->id,
                'nombre' => $validated['nombre'],
                'telefono' => $validated['telefono'],
                'documento' => $validated['ci'],
                'fecha_nacimiento' => $validated['fecha_nacimiento'],
                'direccion' => $validated['direccion'],
                'especialidad' => $validated['especialidad'],
                'experiencia' => $validated['experiencia'] ?? 0,
                'biografia' => $validated['descripcion'],
                'fecha_contrato' => now(),
                'estado' => 'activo',
                'comision_porcentaje' => 5.0, // Comisión por defecto del 5%
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
