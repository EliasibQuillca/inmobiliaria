<?php

namespace App\Http\Controllers\Cliente;

use App\Http\Controllers\Controller;
use App\Models\Cliente;
use App\Models\Cotizacion;
use App\Models\Departamento;
use App\Models\User;
use App\Models\Asesor;
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
        // Obtener el cliente actual
        $cliente = Cliente::where('usuario_id', Auth::id())->first();
        
        $data = [
            'cliente' => $cliente,
            'solicitudes' => [],
            'favoritos' => [],
            'estadisticas' => [
                'total_solicitudes' => 0,
                'solicitudes_pendientes' => 0,
                'favoritos_count' => 0
            ]
        ];
        
        if ($cliente) {
            // Obtener las últimas solicitudes (cotizaciones)
            $solicitudes = Cotizacion::where('cliente_id', $cliente->id)
                                   ->orderBy('created_at', 'desc')
                                   ->with(['departamento', 'asesor.usuario'])
                                   ->take(5)
                                   ->get();
            
            // Obtener favoritos
            $favoritos = $cliente->favoritos()->take(3)->get();
            
            // Calcular estadísticas
            $totalSolicitudes = Cotizacion::where('cliente_id', $cliente->id)->count();
            $solicitudesPendientes = Cotizacion::where('cliente_id', $cliente->id)
                                              ->where('estado', 'pendiente')
                                              ->count();
            $favoritosCount = $cliente->favoritos()->count();
            
            $data = [
                'cliente' => $cliente,
                'solicitudes' => $solicitudes,
                'favoritos' => $favoritos,
                'estadisticas' => [
                    'total_solicitudes' => $totalSolicitudes,
                    'solicitudes_pendientes' => $solicitudesPendientes,
                    'favoritos_count' => $favoritosCount
                ]
            ];
        }

        return Inertia::render('Cliente/Dashboard', $data);
    }

    /**
     * Mostrar el perfil del cliente.
     *
     * @return \Inertia\Response
     */
    public function perfil()
    {
        // Obtener los datos del cliente autenticado
        $usuario = Auth::user();
        $cliente = Cliente::where('usuario_id', Auth::id())->first();

        return Inertia::render('Cliente/Perfil', [
            'usuario' => $usuario,
            'cliente' => $cliente,
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
            'email' => 'required|email|max:255|unique:users,email,' . Auth::id(),
            'telefono' => 'required|string|max:20',
            'direccion' => 'nullable|string|max:255',
            'dni' => 'nullable|string|max:20',
            'tipo_propiedad' => 'nullable|string|max:100',
            'habitaciones_deseadas' => 'nullable|integer|min:1',
            'presupuesto_min' => 'nullable|numeric|min:0',
            'presupuesto_max' => 'nullable|numeric|min:0',
            'zona_preferida' => 'nullable|string|max:255',
        ]);

        // Actualizar datos del usuario
        $user = User::findOrFail(Auth::id());
        $user->name = $validated['nombre'];
        $user->email = $validated['email'];
        $user->telefono = $validated['telefono'] ?? $user->telefono;
        $user->save();

        // Actualizar o crear datos del cliente
        $cliente = Cliente::where('usuario_id', Auth::id())->first();
        if ($cliente) {
            $cliente->telefono = $validated['telefono'];
            $cliente->direccion = $validated['direccion'];
            $cliente->dni = $validated['dni'] ?? $cliente->dni;
            $cliente->tipo_propiedad = $validated['tipo_propiedad'] ?? $cliente->tipo_propiedad;
            $cliente->habitaciones_deseadas = $validated['habitaciones_deseadas'];
            $cliente->presupuesto_min = $validated['presupuesto_min'];
            $cliente->presupuesto_max = $validated['presupuesto_max'];
            $cliente->zona_preferida = $validated['zona_preferida'];
            $cliente->save();
        }

        return redirect()->route('cliente.perfil')
            ->with('success', 'Perfil actualizado exitosamente.');
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
            'tipo_propiedad' => 'required|string|in:apartamento,casa,oficina,local,terreno',
            'habitaciones_deseadas' => 'nullable|integer|min:1|max:10',
            'presupuesto_min' => 'nullable|numeric|min:0',
            'presupuesto_max' => 'nullable|numeric|min:0|gte:presupuesto_min',
            'zona_preferida' => 'nullable|string|max:255',
        ]);

        $cliente = Cliente::where('usuario_id', Auth::id())->firstOrFail();
        
        $cliente->tipo_propiedad = $validated['tipo_propiedad'];
        $cliente->habitaciones_deseadas = $validated['habitaciones_deseadas'];
        $cliente->presupuesto_min = $validated['presupuesto_min'];
        $cliente->presupuesto_max = $validated['presupuesto_max'];
        $cliente->zona_preferida = $validated['zona_preferida'];
        
        $cliente->save();

        return redirect()->route('cliente.perfil')
            ->with('success', 'Preferencias actualizadas exitosamente.');
    }

    /**
     * Cambiar la contraseña del usuario.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function cambiarPassword(Request $request)
    {
        $validated = $request->validate([
            'current_password' => 'required|current_password',
            'password' => 'required|min:8|confirmed',
        ]);

        $user = Auth::user();
        $user->password = bcrypt($validated['password']);
        $user->save();

        return redirect()->route('cliente.perfil')
            ->with('success', 'Contraseña actualizada exitosamente.');
    }

    /**
     * Mostrar la lista de asesores disponibles.
     *
     * @return \Inertia\Response
     */
    public function asesores()
    {
        $asesores = Asesor::with('usuario')
                         ->where('estado', 'activo')
                         ->orderBy('nombre')
                         ->get();

        return Inertia::render('Cliente/Asesores', [
            'asesores' => $asesores
        ]);
    }
}
