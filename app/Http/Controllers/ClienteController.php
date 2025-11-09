<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\Cotizacion;
use App\Models\Reserva;
use App\Models\Cliente;
use App\Models\Departamento;

class ClienteController extends Controller
{
    /**
     * Dashboard del cliente (privado - requiere autenticación).
     *
     * NOTA: El cliente ahora usa el catálogo público directamente.
     * Este método ya no se utiliza, se mantiene para referencia.
     */
    /* DESHABILITADO - Cliente usa catálogo público
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
            // ========================================
            // ESTADÍSTICAS REALISTAS DEL CLIENTE
            // ========================================
            'estadisticas' => [
                'propiedades_favoritas' => $cliente->favoritos()->count(),
                'solicitudes_activas' => $cliente->cotizaciones()
                    ->whereIn('estado', ['pendiente', 'en_proceso'])
                    ->count(),
                'mensajes_nuevos' => $this->contarMensajesNuevos($cliente),
                'citas_programadas' => $this->contarCitasProgramadas($cliente),
            ],

            // ========================================
            // BÚSQUEDA INTELIGENTE
            // ========================================
            'busqueda' => [
                'preferencias' => [
                    'tipo_propiedad' => $cliente->tipo_propiedad ?? 'No definido',
                    'zona_preferida' => $cliente->zona_preferida ?? 'Cualquier zona',
                    'presupuesto_min' => $cliente->presupuesto_min,
                    'presupuesto_max' => $cliente->presupuesto_max,
                    'habitaciones' => $cliente->habitaciones_deseadas,
                ],
                'propiedades_en_rango' => $this->contarPropiedadesEnRango($cliente),
                'nuevas_propiedades' => $this->contarNuevasPropiedades($cliente),
            ],

            // ========================================
            // PROPIEDADES RECOMENDADAS
            // ========================================
            'recomendadas' => $this->obtenerPropiedadesRecomendadas($cliente, 4),

            // ========================================
            // FAVORITOS RECIENTES
            // ========================================
            'favoritos_recientes' => $this->obtenerFavoritosRecientes($cliente, 3),

            // ========================================
            // SOLICITUDES ACTIVAS
            // ========================================
            'solicitudes' => $this->obtenerSolicitudesActivas($cliente, 5),

            // ========================================
            // ACTIVIDAD RECIENTE (Timeline)
            // ========================================
            'actividad_reciente' => $this->obtenerActividadReciente($cliente, 10),

            // ========================================
            // ALERTAS Y NOTIFICACIONES
            // ========================================
            'alertas' => $this->obtenerAlertas($cliente),

            // ========================================
            // ASESOR ASIGNADO
            // ========================================
            'asesor' => $cliente->asesor ? $cliente->asesor->load('usuario') : null,

            // ========================================
            // DATOS DEL CLIENTE
            // ========================================
            'cliente' => $cliente->load('usuario'),
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

        // Agregar notificaciones de reservas próximas a finalizar
        $reservasProximas = $cliente->reservas()
            ->where('fecha_fin', '>', now())
            ->where('fecha_fin', '<=', now()->addDays(3))
            ->where('estado', 'activa')
            ->get();

        if ($reservasProximas->isNotEmpty()) {
            foreach ($reservasProximas as $reserva) {
                $notificaciones[] = [
                    'titulo' => 'Reserva próxima a finalizar',
                    'descripcion' => 'Tu reserva finaliza el ' . $reserva->fecha_fin->format('d/m/Y'),
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
            'nombre' => 'required|string|max:255',
            'email' => 'required|email',
            'telefono' => 'required|string|max:20',
            'cedula' => [
                'required',
                'string',
                'regex:/^[0-9]{8}$/'
            ],
            'direccion' => 'required|string|max:255',
            'fecha_nacimiento' => [
                'required',
                'date',
                'before:-18 years'
            ],
            'ciudad' => 'nullable|string|max:100',
            'ocupacion' => 'nullable|string|max:100',
            'estado_civil' => 'nullable|in:soltero,casado,divorciado,viudo',
            'ingresos_mensuales' => 'nullable|numeric|min:0',
            'preferencias' => 'nullable|array',
            'current_password' => 'required_with:email',
        ], [
            'cedula.required' => 'El DNI es obligatorio',
            'cedula.regex' => 'El DNI debe contener exactamente 8 dígitos numéricos',
            'fecha_nacimiento.required' => 'La fecha de nacimiento es obligatoria',
            'fecha_nacimiento.before' => 'Debes ser mayor de 18 años',
            'current_password.required_with' => 'Debes ingresar tu contraseña para cambiar el correo electrónico',
        ]);

        $user = Auth::user();

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
            'name' => $request->nombre,
            'email' => $request->email,
            'telefono' => $request->telefono,
        ]);

        // Buscar o crear cliente
        $cliente = Cliente::updateOrCreate(
            ['usuario_id' => $user->id],
            [
                'dni' => $request->cedula, // Mapear cedula a dni
                'nombre' => $request->nombre,
                'telefono' => $request->telefono,
                'direccion' => $request->direccion,
                'fecha_nacimiento' => $request->fecha_nacimiento,
                'ciudad' => $request->ciudad,
                'ocupacion' => $request->ocupacion,
                'estado_civil' => $request->estado_civil,
                'ingresos_mensuales' => $request->ingresos_mensuales,
                'preferencias' => $request->preferencias,
            ]
        );

        return back()->with('message', 'Perfil actualizado exitosamente.');
    }

    public function updatePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required',
            'password' => 'required|min:8|confirmed',
        ], [
            'current_password.required' => 'La contraseña actual es obligatoria',
            'password.required' => 'La nueva contraseña es obligatoria',
            'password.min' => 'La contraseña debe tener al menos 8 caracteres',
            'password.confirmed' => 'Las contraseñas no coinciden',
        ]);

        $user = Auth::user();

        // Verificar contraseña actual
        if (!Hash::check($request->current_password, $user->password)) {
            return back()->withErrors([
                'current_password' => 'La contraseña actual es incorrecta'
            ]);
        }

        // Actualizar contraseña
        $user->update([
            'password' => Hash::make($request->password)
        ]);

        return back()->with('success', 'Contraseña actualizada correctamente');
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

    // ========================================================
    // MÉTODOS PRIVADOS PARA DASHBOARD REALISTA
    // ========================================================

    /**
     * Contar mensajes nuevos del cliente.
     */
    private function contarMensajesNuevos(Cliente $cliente): int
    {
        // Por ahora retornar 0 - implementar cuando exista tabla de mensajes
        return 0;
    }

    /**
     * Contar citas programadas activas.
     */
    private function contarCitasProgramadas(Cliente $cliente): int
    {
        return $cliente->reservas()
            ->where('estado', 'activa')
            ->where('fecha_inicio', '>=', now())
            ->count();
    }

    /**
     * Contar propiedades en el rango de preferencias del cliente.
     */
    private function contarPropiedadesEnRango(Cliente $cliente): int
    {
        $query = Departamento::where('estado', 'disponible');

        if ($cliente->presupuesto_min) {
            $query->where('precio', '>=', $cliente->presupuesto_min);
        }

        if ($cliente->presupuesto_max) {
            $query->where('precio', '<=', $cliente->presupuesto_max);
        }

        // Nota: La tabla departamentos NO tiene columna 'tipo'
        // Si el cliente tiene tipo_propiedad, es solo informativo

        if ($cliente->habitaciones_deseadas) {
            $query->where('habitaciones', '>=', $cliente->habitaciones_deseadas);
        }

        return $query->count();
    }

    /**
     * Contar propiedades nuevas (últimos 7 días).
     */
    private function contarNuevasPropiedades(Cliente $cliente): int
    {
        $query = Departamento::where('estado', 'disponible')
            ->where('created_at', '>=', now()->subDays(7));

        if ($cliente->presupuesto_min) {
            $query->where('precio', '>=', $cliente->presupuesto_min);
        }

        if ($cliente->presupuesto_max) {
            $query->where('precio', '<=', $cliente->presupuesto_max);
        }

        return $query->count();
    }

    /**
     * Obtener propiedades recomendadas según preferencias.
     */
    /**
     * Obtener propiedades recomendadas según preferencias.
     */
    private function obtenerPropiedadesRecomendadas(Cliente $cliente, int $limit = 4)
    {
        $query = Departamento::with(['imagenes' => function($query) {
                $query->where('tipo', 'principal')->orWhere(function($q) {
                    $q->orderBy('orden')->limit(1);
                });
            }, 'propietario'])
            ->where('estado', 'disponible');

        // Filtrar por preferencias del cliente
        if ($cliente->presupuesto_min) {
            $query->where('precio', '>=', $cliente->presupuesto_min);
        }

        if ($cliente->presupuesto_max) {
            $query->where('precio', '<=', $cliente->presupuesto_max);
        }

        // Nota: La tabla departamentos NO tiene columna 'tipo'
        // Si el cliente tiene tipo_propiedad, es solo informativo

        if ($cliente->habitaciones_deseadas) {
            $query->where('habitaciones', '>=', $cliente->habitaciones_deseadas);
        }

        // Obtener propiedades
        $propiedades = $query->latest()->limit($limit)->get();

        // Marcar si es favorito
        foreach ($propiedades as $propiedad) {
            $propiedad->es_favorito = $cliente->favoritos()
                ->where('departamento_id', $propiedad->id)
                ->exists();
        }

        return $propiedades;
    }

    /**
     * Obtener favoritos recientes del cliente.
     */
    private function obtenerFavoritosRecientes(Cliente $cliente, int $limit = 3)
    {
        return $cliente->favoritos()
            ->with(['imagenes' => function($query) {
                $query->where('tipo', 'principal')->orWhere(function($q) {
                    $q->orderBy('orden')->limit(1);
                });
            }, 'propietario'])
            ->latest('favoritos.created_at')
            ->limit($limit)
            ->get()
            ->map(function($propiedad) {
                $propiedad->es_favorito = true;
                return $propiedad;
            });
    }

    /**
     * Obtener solicitudes activas del cliente.
     */
    private function obtenerSolicitudesActivas(Cliente $cliente, int $limit = 5)
    {
        return $cliente->cotizaciones()
            ->with(['departamento.imagenes' => function($query) {
                $query->where('tipo', 'principal')->orWhere(function($q) {
                    $q->orderBy('orden')->limit(1);
                });
            }, 'asesor.usuario'])
            ->whereIn('estado', ['pendiente', 'en_proceso', 'respondida'])
            ->latest()
            ->limit($limit)
            ->get();
    }

    /**
     * Obtener actividad reciente del cliente (timeline).
     */
    private function obtenerActividadReciente(Cliente $cliente, int $limit = 10)
    {
        $actividades = [];

        // Favoritos agregados recientemente
        $favoritos = $cliente->favoritos()
            ->latest('favoritos.created_at')
            ->limit(5)
            ->get();

        foreach ($favoritos as $favorito) {
            $actividades[] = [
                'tipo' => 'favorito',
                'icono' => 'heart',
                'color' => 'red',
                'titulo' => 'Agregaste a favoritos',
                'descripcion' => $favorito->direccion,
                'fecha' => $favorito->pivot->created_at->format('d/m/Y H:i'),
                'timestamp' => $favorito->pivot->created_at->timestamp,
            ];
        }

        // Solicitudes recientes
        $solicitudes = $cliente->cotizaciones()
            ->with('departamento')
            ->latest()
            ->limit(5)
            ->get();

        foreach ($solicitudes as $solicitud) {
            $actividades[] = [
                'tipo' => 'solicitud',
                'icono' => 'mail',
                'color' => 'blue',
                'titulo' => 'Nueva solicitud - ' . ucfirst($solicitud->estado),
                'descripcion' => $solicitud->departamento->direccion ?? 'Propiedad',
                'fecha' => $solicitud->created_at->format('d/m/Y H:i'),
                'timestamp' => $solicitud->created_at->timestamp,
            ];
        }

        // Reservas recientes
        $reservas = $cliente->reservas()
            ->with('departamento')
            ->latest()
            ->limit(5)
            ->get();

        foreach ($reservas as $reserva) {
            $actividades[] = [
                'tipo' => 'reserva',
                'icono' => 'calendar',
                'color' => 'green',
                'titulo' => 'Reserva ' . ucfirst($reserva->estado),
                'descripcion' => $reserva->departamento->direccion ?? 'Propiedad',
                'fecha' => $reserva->created_at->format('d/m/Y H:i'),
                'timestamp' => $reserva->created_at->timestamp,
            ];
        }

        // Ordenar por timestamp descendente
        usort($actividades, function($a, $b) {
            return $b['timestamp'] <=> $a['timestamp'];
        });

        // Quitar timestamp y devolver solo el límite
        return array_slice(array_map(function($act) {
            unset($act['timestamp']);
            return $act;
        }, $actividades), 0, $limit);
    }

    /**
     * Obtener alertas importantes para el cliente.
     */
    private function obtenerAlertas(Cliente $cliente): array
    {
        $alertas = [];

        // Alerta: Perfil incompleto
        if (!$cliente->telefono || !$cliente->direccion) {
            $alertas[] = [
                'tipo' => 'warning',
                'icono' => 'user',
                'titulo' => 'Completa tu perfil',
                'descripcion' => 'Agrega tu información de contacto para recibir mejor atención',
                'accion' => 'Completar ahora',
                'link' => '/cliente/perfil',
            ];
        }

        // Alerta: Sin preferencias definidas
        if (!$cliente->presupuesto_max || !$cliente->habitaciones_deseadas) {
            $alertas[] = [
                'tipo' => 'info',
                'icono' => 'search',
                'titulo' => 'Define tus preferencias',
                'descripcion' => 'Te ayudaremos a encontrar propiedades perfectas para ti',
                'accion' => 'Configurar',
                'link' => '/cliente/configuracion',
            ];
        }

        // Alerta: Solicitudes pendientes de respuesta
        $solicitudesPendientes = $cliente->cotizaciones()
            ->where('estado', 'respondida')
            ->where('updated_at', '>', now()->subDays(3))
            ->count();

        if ($solicitudesPendientes > 0) {
            $alertas[] = [
                'tipo' => 'success',
                'icono' => 'check-circle',
                'titulo' => "Tienes {$solicitudesPendientes} " . ($solicitudesPendientes == 1 ? 'respuesta nueva' : 'respuestas nuevas'),
                'descripcion' => 'Un asesor ha respondido tu solicitud',
                'accion' => 'Ver respuestas',
                'link' => '/cliente/solicitudes',
            ];
        }

        // Alerta: Reservas próximas a finalizar
        $reservasProximas = $cliente->reservas()
            ->where('fecha_fin', '>', now())
            ->where('fecha_fin', '<=', now()->addDays(3))
            ->where('estado', 'activa')
            ->count();

        if ($reservasProximas > 0) {
            $alertas[] = [
                'tipo' => 'warning',
                'icono' => 'clock',
                'titulo' => 'Reserva próxima a finalizar',
                'descripcion' => 'Tu reserva finaliza en los próximos 3 días',
                'accion' => 'Ver detalles',
                'link' => '/cliente/reservas',
            ];
        }

        // Alerta: Nuevas propiedades disponibles
        $nuevasPropiedades = $this->contarNuevasPropiedades($cliente);
        if ($nuevasPropiedades > 0) {
            $alertas[] = [
                'tipo' => 'info',
                'icono' => 'home',
                'titulo' => "{$nuevasPropiedades} " . ($nuevasPropiedades == 1 ? 'propiedad nueva' : 'propiedades nuevas'),
                'descripcion' => 'Propiedades agregadas esta semana que coinciden con tu búsqueda',
                'accion' => 'Explorar',
                'link' => '/catalogo',
            ];
        }

        return $alertas;
    }
}
