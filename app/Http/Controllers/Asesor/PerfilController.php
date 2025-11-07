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

        // Verificar que el usuario tenga un perfil de asesor
        if (!$asesor) {
            return redirect()->route('asesor.dashboard')
                ->with('error', 'No se encontró el perfil de asesor asociado a tu cuenta.');
        }

        // Calcular estadísticas del asesor
        $tiempoLaboral = $asesor->getTiempoLaboral();

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
            'tiempo_laboral' => $tiempoLaboral['texto'],
            'dias_laborales' => $tiempoLaboral['dias'],
        ];

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
            'ci' => [
                'nullable',
                'string',
                'regex:/^[0-9]{8}$/'
            ],
            'fecha_nacimiento' => [
                'nullable',
                'date',
                'before:-18 years'
            ],
            'direccion' => 'nullable|string|max:500',
            'especialidad' => 'nullable|string|max:255',
            'experiencia' => 'nullable|integer|min:0|max:50',
            'descripcion' => 'nullable|string|max:1000',
            'current_password' => 'required_with:email',
        ], [
            'ci.regex' => 'El DNI debe contener exactamente 8 dígitos numéricos',
            'fecha_nacimiento.before' => 'Debes ser mayor de 18 años para ser asesor',
            'experiencia.max' => 'La experiencia no puede ser mayor a 50 años',
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
