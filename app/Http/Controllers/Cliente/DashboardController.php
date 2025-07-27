<?php

namespace App\Http\Controllers\Cliente;

use App\Http\Controllers\Controller;
use App\Models\Cliente;
use App\Models\Cotizacion;
use App\Models\Departamento;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Mostrar el dashboard del cliente.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        // En una implementación real, obtendríamos todos los datos del cliente
        // autenticado desde la base de datos

        // Ejemplo:
        // $cliente = Cliente::where('usuario_id', Auth::id())->firstOrFail();
        // $solicitudes = Cotizacion::where('cliente_id', $cliente->id)
        //                         ->orderBy('created_at', 'desc')
        //                         ->with(['departamento', 'asesor'])
        //                         ->take(5)
        //                         ->get();
        // $favoritos = $cliente->favoritos()->take(3)->get();

        return Inertia::render('Cliente/Dashboard');
    }

    /**
     * Mostrar el perfil del cliente.
     *
     * @return \Inertia\Response
     */
    public function perfil()
    {
        // En una implementación real, obtendríamos los datos del cliente
        // $cliente = Cliente::where('usuario_id', Auth::id())->firstOrFail();

        return Inertia::render('Cliente/Perfil', [
            'flash' => [
                'success' => session('success'),
                'error' => session('error')
            ]
        ]);
    }

    /**
     * Actualizar el perfil del cliente.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function actualizarPerfil(Request $request)
    {
        // Validación de datos
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'telefono' => 'required|string|max:20',
            'direccion' => 'nullable|string|max:255',
            'dni' => 'nullable|string|max:20',
        ]);

        // En una implementación real, actualizaríamos los datos del cliente
        // $user = User::findOrFail(Auth::id());
        // $user->name = $validated['nombre'];
        // $user->email = $validated['email'];
        // $user->save();
        //
        // $cliente = Cliente::where('usuario_id', Auth::id())->firstOrFail();
        // $cliente->telefono = $validated['telefono'];
        // $cliente->direccion = $validated['direccion'];
        // $cliente->dni = $validated['dni'];
        // $cliente->save();

        return redirect()->route('cliente.perfil')
            ->with('success', 'Perfil actualizado exitosamente.');
    }

    /**
     * Mostrar los departamentos favoritos del cliente.
     *
     * @return \Inertia\Response
     */
    public function favoritos()
    {
        // En una implementación real, obtendríamos los favoritos del cliente
        // $cliente = Cliente::where('usuario_id', Auth::id())->firstOrFail();
        // $favoritos = $cliente->favoritos()->with(['imagenes'])->paginate(10);

        return Inertia::render('Cliente/Favoritos');
    }

    /**
     * Mostrar los asesores asignados al cliente.
     *
     * @return \Inertia\Response
     */
    public function asesores()
    {
        // En una implementación real, obtendríamos los asesores asignados al cliente
        // $cliente = Cliente::where('usuario_id', Auth::id())->firstOrFail();
        // $asesores = Asesor::whereHas('cotizaciones', function($query) use ($cliente) {
        //     $query->where('cliente_id', $cliente->id);
        // })->distinct()->get();

        return Inertia::render('Cliente/Asesores');
    }

    /**
     * Cambiar la contraseña del cliente.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function cambiarPassword(Request $request)
    {
        $validated = $request->validate([
            'current_password' => 'required',
            'password' => 'required|string|min:8|confirmed',
        ]);

        // En una implementación real, verificaríamos y actualizaríamos la contraseña
        // $user = User::findOrFail(Auth::id());
        //
        // if (!Hash::check($validated['current_password'], $user->password)) {
        //     return back()->withErrors(['current_password' => 'La contraseña actual es incorrecta.']);
        // }
        //
        // $user->password = Hash::make($validated['password']);
        // $user->save();

        return redirect()->route('cliente.perfil')
            ->with('success', 'Contraseña actualizada exitosamente.');
    }

    /**
     * Actualizar las preferencias del cliente.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function actualizarPreferencias(Request $request)
    {
        $validated = $request->validate([
            'tipo_propiedad' => 'required|string|in:departamento,casa,oficina,local_comercial,terreno',
            'rango_precio_min' => 'nullable|numeric|min:0',
            'rango_precio_max' => 'nullable|numeric|min:0',
            'ubicaciones_preferidas' => 'nullable|array',
            'habitaciones_min' => 'required|integer|min:1|max:10',
            'banos_min' => 'required|integer|min:1|max:10',
            'area_min' => 'nullable|numeric|min:0',
            'caracteristicas_especiales' => 'nullable|array',
            'notificaciones_email' => 'boolean',
            'notificaciones_sms' => 'boolean',
            'frecuencia_notificaciones' => 'required|string|in:inmediata,diaria,semanal,mensual',
        ]);

        // En una implementación real, actualizaríamos las preferencias del cliente
        // $cliente = Cliente::where('usuario_id', Auth::id())->firstOrFail();
        // $cliente->preferencias = $validated;
        // $cliente->save();

        return redirect()->route('cliente.perfil')
            ->with('success', 'Preferencias actualizadas exitosamente.');
    }
}
