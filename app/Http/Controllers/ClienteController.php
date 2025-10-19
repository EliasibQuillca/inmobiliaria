<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Cotizacion;
use App\Models\Reserva;
use App\Models\Cliente;
use App\Models\Departamento;

class ClienteController extends Controller
{
    /**
     * Dashboard del cliente (privado - requiere autenticación).
     */
    public function dashboard()
    {
        $user = Auth::user();
        
        // Si no está autenticado, redirigir al login
        if (!$user) {
            return redirect()->route('login')
                           ->with('message', 'Por favor inicia sesión para acceder a tu dashboard.');
        }
        
        $cliente = Cliente::where('usuario_id', $user->id)->first();
        
        if (!$cliente) {
            return redirect()->route('cliente.perfil.index')
                           ->with('message', 'Por favor completa tu perfil de cliente primero.');
        }

        return inertia('Cliente/Dashboard', [
            // Estadísticas principales
            'estadisticas' => $this->obtenerEstadisticasCliente($cliente),
            
            // Preferencias del cliente
            'preferencias' => [
                'tipo_propiedad' => $cliente->tipo_propiedad,
                'zona_preferida' => $cliente->zona_preferida,
                'presupuesto_min' => $cliente->presupuesto_min,
                'presupuesto_max' => $cliente->presupuesto_max,
                'habitaciones_deseadas' => $cliente->habitaciones_deseadas,
                'resultados_en_rango' => Departamento::enRangoCliente($cliente)->count(),
            ],
            
            // Propiedades destacadas con match score
            'destacados' => $this->obtenerDestacadosConMatch($cliente),
            
            // Progreso de búsqueda
            'progreso' => $this->calcularProgresoBusqueda($cliente),
            
            // Actividades recientes
            'actividades' => $this->obtenerActividadesRecientes($cliente),
            
            // Notificaciones
            'notificaciones' => $this->obtenerNotificaciones($cliente),
            
            // Asesor asignado
            'asesor' => $cliente->asesor ? $cliente->asesor->load('usuario') : null,
            
            // Datos del cliente
            'cliente' => $cliente,
        ]);
    }

    /**
     * Obtener estadísticas del cliente.
     */
    private function obtenerEstadisticasCliente(Cliente $cliente): array
    {
        return [
            'favoritos_total' => $cliente->favoritos()->count(),
            'solicitudes_activas' => $cliente->cotizaciones()
                ->whereIn('estado', ['pendiente', 'en_proceso'])
                ->count(),
            'solicitudes_respondidas' => $cliente->cotizaciones()
                ->where('estado', 'respondida')
                ->count(),
            'reservas_activas' => $cliente->reservas()
                ->where('estado', 'activa')
                ->count(),
        ];
    }

    /**
     * Obtener propiedades destacadas con match score.
     */
    private function obtenerDestacadosConMatch(Cliente $cliente)
    {
        return Departamento::recomendadosPara($cliente, 6);
    }

    /**
     * Calcular progreso de búsqueda del cliente.
     */
    private function calcularProgresoBusqueda(Cliente $cliente)
    {
        $progreso = 0;
        $tareas = [];
        
        // Perfil completo (20%)
        if ($cliente->isDatosCompletos()) {
            $progreso += 20;
            $tareas[] = ['completada' => true, 'texto' => 'Perfil completo'];
        } else {
            $tareas[] = ['completada' => false, 'texto' => 'Completar perfil'];
        }
        
        // Preferencias definidas (20%)
        if ($cliente->tienePreferencias()) {
            $progreso += 20;
            $tareas[] = ['completada' => true, 'texto' => 'Preferencias definidas'];
        } else {
            $tareas[] = ['completada' => false, 'texto' => 'Definir preferencias de búsqueda'];
        }
        
        // Al menos 3 favoritos (15%)
        if ($cliente->favoritos()->count() >= 3) {
            $progreso += 15;
            $tareas[] = ['completada' => true, 'texto' => 'Has guardado favoritos'];
        } else {
            $tareas[] = ['completada' => false, 'texto' => 'Guardar al menos 3 favoritos'];
        }
        
        // Al menos 1 solicitud enviada (15%)
        if ($cliente->cotizaciones()->count() >= 1) {
            $progreso += 15;
            $tareas[] = ['completada' => true, 'texto' => 'Solicitud enviada'];
        } else {
            $tareas[] = ['completada' => false, 'texto' => 'Enviar primera solicitud'];
        }
        
        // Tiene asesor asignado (15%)
        if ($cliente->asesor_id) {
            $progreso += 15;
            $tareas[] = ['completada' => true, 'texto' => 'Asesor asignado'];
        } else {
            $tareas[] = ['completada' => false, 'texto' => 'Contactar con asesor'];
        }
        
        // Tiene cita agendada (15%)
        if ($cliente->tieneCitaProgramada()) {
            $progreso += 15;
            $tareas[] = ['completada' => true, 'texto' => 'Cita agendada'];
        } else {
            $tareas[] = ['completada' => false, 'texto' => 'Agendar visita presencial'];
        }
        
        return [
            'porcentaje' => $progreso,
            'tareas' => $tareas,
        ];
    }

    /**
     * Obtener notificaciones del cliente.
     *
     * @param Cliente $cliente
     * @return array
     */
    private function obtenerNotificaciones(Cliente $cliente): array
    {
        $notificaciones = [];
        
        // Agregar notificaciones de cotizaciones actualizadas
        $cotizacionesActualizadas = $cliente->cotizaciones()
            ->where('updated_at', '>', now()->subDays(7))
            ->whereColumn('created_at', '<', 'updated_at')
            ->get();
            
        if ($cotizacionesActualizadas->isNotEmpty()) {
            foreach ($cotizacionesActualizadas as $cotizacion) {
                $notificaciones[] = [
                    'titulo' => 'Cotización actualizada',
                    'descripcion' => 'Tu cotización #' . $cotizacion->id . ' ha sido actualizada',
                    'fecha' => $cotizacion->updated_at->format('d/m/Y H:i'),
                    'tipo' => 'cotizacion'
                ];
            }
        }
        
        // Agregar notificaciones de reservas próximas a vencer
        $reservasProximas = $cliente->reservas()
            ->where('fecha_vencimiento', '>', now())
            ->where('fecha_vencimiento', '<=', now()->addDays(3))
            ->get();
            
        if ($reservasProximas->isNotEmpty()) {
            foreach ($reservasProximas as $reserva) {
                $notificaciones[] = [
                    'titulo' => 'Reserva próxima a vencer',
                    'descripcion' => 'Tu reserva vence el ' . $reserva->fecha_vencimiento->format('d/m/Y'),
                    'fecha' => now()->format('d/m/Y H:i'),
                    'tipo' => 'reserva'
                ];
            }
        }
        
        return array_slice($notificaciones, 0, 5);
    }

    /**
     * Obtener actividades recientes del cliente.
     *
     * @param Cliente $cliente
     * @return array
     */
    private function obtenerActividadesRecientes(Cliente $cliente): array
    {
        $actividades = [];
        
        // Agregar solicitudes recientes
        $solicitudes = $cliente->cotizaciones()
            ->with(['departamento'])
            ->latest()
            ->take(3)
            ->get();
            
        foreach ($solicitudes as $solicitud) {
            $actividades[] = [
                'tipo' => 'solicitud',
                'descripcion' => "Enviaste una solicitud para " . ($solicitud->departamento ? $solicitud->departamento->codigo : 'Departamento'),
                'fecha' => $solicitud->created_at->format('d/m/Y H:i'),
                'enlace' => route('cliente.solicitudes.show', $solicitud->id)
            ];
        }
        
        // Agregar favoritos recientes
        $favoritos = $cliente->favoritos()
            ->with(['departamento'])
            ->latest()
            ->take(3)
            ->get();
            
        foreach ($favoritos as $favorito) {
            $actividades[] = [
                'tipo' => 'favorito',
                'descripcion' => "Agregaste a favoritos " . ($favorito->departamento ? $favorito->departamento->codigo : 'Departamento'),
                'fecha' => $favorito->created_at->format('d/m/Y H:i'),
                'enlace' => route('cliente.favoritos.index')
            ];
        }
        
        // Agregar reservas recientes
        $reservas = $cliente->reservas()
            ->with(['departamento'])
            ->latest()
            ->take(2)
            ->get();
            
        foreach ($reservas as $reserva) {
            $actividades[] = [
                'tipo' => 'reserva',
                'descripcion' => "Realizaste una reserva para " . ($reserva->departamento ? $reserva->departamento->codigo : 'Departamento'),
                'fecha' => $reserva->created_at->format('d/m/Y H:i'),
                'enlace' => route('cliente.reservas.show', $reserva->id)
            ];
        }
        
        // Ordenar por fecha y tomar los 8 más recientes
        usort($actividades, function($a, $b) {
            return strtotime($b['fecha']) - strtotime($a['fecha']);
        });
        
        return array_slice($actividades, 0, 8);
    }

    public function perfil()
    {
        $user = Auth::user();
        $cliente = Cliente::where('usuario_id', $user->id)->first();
        
        return inertia('Cliente/Perfil', [
            'cliente' => $cliente
        ]);
    }

    public function updatePerfil(Request $request)
    {
        $request->validate([
            'telefono' => 'required|string|max:20',
            'direccion' => 'required|string|max:255',
            'fecha_nacimiento' => 'nullable|date',
            'preferencias' => 'nullable|array',
            'preferencias.rango_precios' => 'nullable|array',
            'preferencias.zonas_interes' => 'nullable|array',
            'preferencias.caracteristicas' => 'nullable|array',
        ]);

        $user = Auth::user();
        
        // Buscar o crear cliente
        $cliente = Cliente::updateOrCreate(
            ['usuario_id' => $user->id],
            [
                'telefono' => $request->telefono,
                'direccion' => $request->direccion,
                'fecha_nacimiento' => $request->fecha_nacimiento,
                'preferencias' => $request->preferencias,
            ]
        );

        return back()->with('message', 'Perfil actualizado exitosamente.');
    }

    public function solicitudes()
    {
        $user = Auth::user();
        $cliente = Cliente::where('usuario_id', $user->id)->first();
        
        if (!$cliente) {
            return redirect()->route('cliente.perfil.index')
                           ->with('message', 'Por favor completa tu perfil primero.');
        }

        // Obtener solicitudes con departamento, asesor y comentarios
        $solicitudes = $cliente->cotizaciones()
            ->with([
                'departamento:id,codigo,direccion,precio', 
                'asesor.usuario:id,name',
                'comentarios' => function($query) {
                    $query->latest()->take(10);
                },
                'comentarios.usuario:id,name'
            ])
            ->latest()
            ->get();

        return inertia('Cliente/Solicitudes', [
            'solicitudes' => $solicitudes,
            'cliente' => $cliente
        ]);
    }

    public function cotizaciones()
    {
        $user = Auth::user();
        $cliente = Cliente::where('usuario_id', $user->id)->first();
        
        if (!$cliente) {
            return redirect()->route('cliente.perfil.index')
                           ->with('message', 'Por favor completa tu perfil primero.');
        }

        $cotizaciones = $cliente->cotizaciones()
            ->with(['departamento', 'asesor.usuario'])
            ->where('estado', '!=', 'cancelada')
            ->latest()
            ->get();

        return inertia('Cliente/Cotizaciones', [
            'cotizaciones' => $cotizaciones,
            'cliente' => $cliente
        ]);
    }

    public function reservas()
    {
        $user = Auth::user();
        $cliente = Cliente::where('usuario_id', $user->id)->first();
        
        if (!$cliente) {
            return redirect()->route('cliente.perfil.index')
                           ->with('message', 'Por favor completa tu perfil primero.');
        }

        $reservas = $cliente->reservas()
            ->with(['departamento', 'asesor.usuario'])
            ->latest()
            ->get();

        return inertia('Cliente/Reservas', [
            'reservas' => $reservas,
            'cliente' => $cliente
        ]);
    }
}
