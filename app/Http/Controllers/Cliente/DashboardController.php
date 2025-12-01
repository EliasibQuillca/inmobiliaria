<?php

namespace App\Http\Controllers\Cliente;

use App\Http\Controllers\Controller;
use App\Models\Cliente;
use App\Models\Cotizacion;
use App\Models\Departamento;
use App\Models\User;
use App\Models\Asesor;
use App\Models\AuditoriaUsuario;
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
            'reservas' => [],
            'estadisticas' => [
                'total_solicitudes' => 0,
                'solicitudes_pendientes' => 0,
                'cotizaciones_recibidas' => 0,
                'favoritos_count' => 0,
                'reservas_activas' => 0
            ],
            'actividades_recientes' => [],
            'asesores_contacto' => []
        ];
        
        if ($cliente) {
            // Obtener las últimas solicitudes (cotizaciones) creadas por el cliente
            $solicitudes = Cotizacion::where('cliente_id', $cliente->id)
                                   ->whereNotNull('mensaje_solicitud') // Solo solicitudes del cliente
                                   ->orderBy('created_at', 'desc')
                                   ->with(['departamento', 'asesor.usuario'])
                                   ->take(5)
                                   ->get();
            
            // Obtener favoritos con más información
            $favoritos = $cliente->favoritos()
                               ->with(['imagenes'])
                               ->take(3)
                               ->get();
            
            // Obtener reservas activas
            $reservas = $cliente->reservas()
                              ->with(['departamento', 'asesor.usuario'])
                              ->where('estado', '!=', 'cancelada')
                              ->take(3)
                              ->get();
            
            // Calcular estadísticas completas (solo solicitudes creadas por el cliente)
            $totalSolicitudes = Cotizacion::where('cliente_id', $cliente->id)
                                         ->whereNotNull('mensaje_solicitud')
                                         ->count();
            $solicitudesPendientes = Cotizacion::where('cliente_id', $cliente->id)
                                              ->whereNotNull('mensaje_solicitud')
                                              ->where('estado', 'pendiente')
                                              ->count();
            $cotizacionesRecibidas = Cotizacion::where('cliente_id', $cliente->id)
                                              ->whereNotNull('mensaje_solicitud')
                                              ->where('estado', '!=', 'pendiente')
                                              ->count();
            $favoritosCount = $cliente->favoritos()->count();
            $reservasActivas = $cliente->reservas()
                                     ->where('estado', '!=', 'cancelada')
                                     ->count();
            
            // Crear actividades recientes combinando solicitudes y reservas
            $actividadesRecientes = collect();
            
            // Agregar solicitudes como actividades
            foreach ($solicitudes->take(3) as $solicitud) {
                $actividadesRecientes->push([
                    'id' => 'sol_' . $solicitud->id,
                    'tipo' => 'solicitud',
                    'descripcion' => 'Solicitud enviada: ' . ($solicitud->departamento->codigo ?? 'Depto. N/A'),
                    'fecha' => $solicitud->created_at->format('Y-m-d'),
                    'estado' => $solicitud->estado,
                    'asesor' => $solicitud->asesor->usuario->name ?? null,
                    'monto' => $solicitud->monto_ofertado
                ]);
            }
            
            // Agregar reservas como actividades
            foreach ($reservas->take(2) as $reserva) {
                $actividadesRecientes->push([
                    'id' => 'res_' . $reserva->id,
                    'tipo' => 'reserva',
                    'descripcion' => 'Reserva: ' . ($reserva->departamento->codigo ?? 'Depto. N/A'),
                    'fecha' => $reserva->fecha_reserva,
                    'estado' => $reserva->estado,
                    'asesor' => $reserva->asesor->usuario->name ?? null,
                    'monto' => $reserva->monto_reserva
                ]);
            }
            
            // Ordenar actividades por fecha
            $actividadesRecientes = $actividadesRecientes->sortByDesc('fecha')->take(5)->values();
            
            // Obtener asesores que han tenido contacto
            $asesoresContacto = Asesor::whereHas('cotizaciones', function($query) use ($cliente) {
                                    $query->where('cliente_id', $cliente->id);
                                })
                                ->with('usuario')
                                ->take(3)
                                ->get();
            
            $data = [
                'cliente' => $cliente->load('usuario'),
                'solicitudes' => $solicitudes,
                'favoritos' => $favoritos,
                'reservas' => $reservas,
                'estadisticas' => [
                    'total_solicitudes' => $totalSolicitudes,
                    'solicitudes_pendientes' => $solicitudesPendientes,
                    'cotizaciones_recibidas' => $cotizacionesRecibidas,
                    'favoritos_count' => $favoritosCount,
                    'reservas_activas' => $reservasActivas
                ],
                'actividades_recientes' => $actividadesRecientes,
                'asesores_contacto' => $asesoresContacto
            ];

            // 🔥 AGREGAR NOTIFICACIONES PENDIENTES DE APROBACIÓN
            $data['aprobaciones_pendientes'] = AuditoriaUsuario::where('cliente_afectado_id', $cliente->id)
                ->where('requiere_aprobacion', 'si')
                ->where('estado_aprobacion', 'pendiente')
                ->with(['usuario'])
                ->orderBy('prioridad', 'desc')
                ->orderBy('created_at', 'desc')
                ->limit(5)
                ->get();

            $data['estadisticas']['aprobaciones_pendientes'] = AuditoriaUsuario::where('cliente_afectado_id', $cliente->id)
                ->where('requiere_aprobacion', 'si')
                ->where('estado_aprobacion', 'pendiente')
                ->count();
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

        try {
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

            return redirect()->route('cliente.perfil.index')
                ->with('success', 'Perfil actualizado exitosamente.');
                
        } catch (\Exception $e) {
            return redirect()->route('cliente.perfil.index')
                ->with('error', 'Error al actualizar el perfil: ' . $e->getMessage());
        }
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

        try {
            $cliente = Cliente::where('usuario_id', Auth::id())->firstOrFail();
            
            $cliente->tipo_propiedad = $validated['tipo_propiedad'];
            $cliente->habitaciones_deseadas = $validated['habitaciones_deseadas'];
            $cliente->presupuesto_min = $validated['presupuesto_min'];
            $cliente->presupuesto_max = $validated['presupuesto_max'];
            $cliente->zona_preferida = $validated['zona_preferida'];
            
            $cliente->save();

            return redirect()->route('cliente.perfil.index')
                ->with('success', 'Preferencias actualizadas exitosamente.');
                
        } catch (\Exception $e) {
            return redirect()->route('cliente.perfil.index')
                ->with('error', 'Error al actualizar las preferencias: ' . $e->getMessage());
        }
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

        try {
            $user = User::findOrFail(Auth::id());
            $user->password = bcrypt($validated['password']);
            $user->save();

            return redirect()->route('cliente.perfil.index')
                ->with('success', 'Contraseña actualizada exitosamente.');
                
        } catch (\Exception $e) {
            return redirect()->route('cliente.perfil.index')
                ->with('error', 'Error al actualizar la contraseña: ' . $e->getMessage());
        }
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
