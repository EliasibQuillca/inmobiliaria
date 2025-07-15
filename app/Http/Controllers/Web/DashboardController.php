<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Departamento;
use App\Models\Cliente;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class DashboardController extends Controller
{
    use AuthorizesRequests;

    /**
     * Dashboard principal - muestra estadísticas según el rol
     */
    public function index()
    {
        $user = Auth::user();

        // Datos básicos para todos los roles
        $stats = [
            'propiedades_activas' => Departamento::where('disponible', true)->count(),
            'imagenes_total' => \App\Models\Imagen::count(),
        ];

        // Datos específicos según el rol
        if ($user->hasRole('administrador')) {
            $stats['usuarios_total'] = User::count();
            $stats['cotizaciones_pendientes'] = 0; // Se implementará después
        } elseif ($user->hasRole('asesor')) {
            $stats['cotizaciones_pendientes'] = 0; // Se implementará después
        }

        // Propiedades recientes
        $propiedades_recientes = Departamento::where('disponible', true)
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        // Contactos recientes (solo para asesores y administradores)
        $contactos_recientes = collect();
        if ($user->hasRole(['asesor', 'administrador'])) {
            // Se implementará cuando tengamos la tabla de contactos
        }

        return view('dashboard.index', compact('stats', 'propiedades_recientes', 'contactos_recientes'));
    }

    /**
     * Perfil de usuario
     */
    public function profile()
    {
        return view('dashboard.profile');
    }

    /**
     * Actualizar perfil
     */
    public function updateProfile(Request $request)
    {
        $user = Auth::user();

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
        ]);

        $user->update($request->only(['name', 'email']));

        return back()->with('success', 'Perfil actualizado exitosamente.');
    }

    /**
     * Vista de clientes (para asesores)
     */
    public function clientes()
    {
        $clientes = Cliente::with(['user'])
            ->latest()
            ->paginate(15);

        return view('dashboard.clientes', compact('clientes'));
    }

    /**
     * Gestión de usuarios (solo administradores)
     */
    public function usuarios()
    {
        $usuarios = User::latest()->paginate(15);
        return view('dashboard.usuarios', compact('usuarios'));
    }

    /**
     * Gestión de propiedades
     */
    public function propiedades()
    {
        $departamentos = Departamento::with(['imagenPrincipal'])
            ->latest()
            ->paginate(15);

        return view('dashboard.propiedades', compact('departamentos'));
    }

    /**
     * Gestión de imágenes
     */
    public function imagenes()
    {
        $imagenes = \App\Models\Imagen::with(['departamento'])
            ->latest()
            ->paginate(15);

        return view('dashboard.imagenes', compact('imagenes'));
    }

    /**
     * Gestión de cotizaciones
     */
    public function cotizaciones()
    {
        // Se implementará después
        return view('dashboard.cotizaciones');
    }
}
