<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AuditoriaUsuario extends Model
{
    use HasFactory;

    protected $table = 'auditoria_usuarios';

    protected $fillable = [
        'usuario_id',
        'cliente_afectado_id',
        'accion',
        'modelo_tipo',
        'modelo_id',
        'titulo',
        'detalles',
        'descripcion',
        'requiere_aprobacion',
        'estado_aprobacion',
        'fecha_respuesta',
        'motivo_respuesta',
        'notificado',
        'prioridad',
        'fecha_hora',
    ];

    protected $casts = [
        'detalles' => 'array',
        'fecha_hora' => 'datetime',
        'fecha_respuesta' => 'datetime',
        'notificado' => 'boolean',
    ];

    // Relaciones
    public function usuario()
    {
        return $this->belongsTo(User::class, 'usuario_id');
    }

    public function clienteAfectado()
    {
        return $this->belongsTo(Cliente::class, 'cliente_afectado_id');
    }

    public function modelo()
    {
        return $this->morphTo();
    }

    // Scopes para consultas
    public function scopePendientesAprobacion($query)
    {
        return $query->where('requiere_aprobacion', 'si')
                     ->where('estado_aprobacion', 'pendiente');
    }

    public function scopeDelCliente($query, $clienteId)
    {
        return $query->where('cliente_afectado_id', $clienteId);
    }

    public function scopeNoNotificados($query)
    {
        return $query->where('notificado', false)
                     ->where('requiere_aprobacion', 'si');
    }

    // Métodos de utilidad
    public function aprobar($motivo = null)
    {
        return $this->update([
            'estado_aprobacion' => 'aprobada',
            'fecha_respuesta' => now(),
            'motivo_respuesta' => $motivo,
        ]);
    }

    public function rechazar($motivo)
    {
        return $this->update([
            'estado_aprobacion' => 'rechazada',
            'fecha_respuesta' => now(),
            'motivo_respuesta' => $motivo,
        ]);
    }

    public function marcarComoNotificado()
    {
        return $this->update(['notificado' => true]);
    }

    public function requiereAprobacion()
    {
        return $this->requiere_aprobacion === 'si';
    }

    public function estaPendiente()
    {
        return $this->estado_aprobacion === 'pendiente';
    }

    public function estaAprobada()
    {
        return $this->estado_aprobacion === 'aprobada';
    }

    public function estaRechazada()
    {
        return $this->estado_aprobacion === 'rechazada';
    }

    // Métodos estáticos para registro de auditoría
    public static function registrar($usuarioId, $accion, $detalles = null)
    {
        return self::create([
            'usuario_id' => $usuarioId,
            'accion' => $accion,
            'detalles' => $detalles,
            'fecha_hora' => now(),
        ]);
    }

    public static function registrarLogin($usuarioId)
    {
        return self::registrar($usuarioId, 'login', [
            'ip' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);
    }

    public static function registrarLogout($usuarioId)
    {
        return self::registrar($usuarioId, 'logout');
    }

    public static function registrarCreacionCotizacion($usuarioId, $cotizacionId)
    {
        return self::registrar($usuarioId, 'creacion_cotizacion', [
            'cotizacion_id' => $cotizacionId,
        ]);
    }

    public static function registrarCreacionReserva($usuarioId, $reservaId)
    {
        return self::registrar($usuarioId, 'creacion_reserva', [
            'reserva_id' => $reservaId,
        ]);
    }

    public static function registrarVenta($usuarioId, $ventaId)
    {
        return self::registrar($usuarioId, 'registro_venta', [
            'venta_id' => $ventaId,
        ]);
    }

    /**
     * Registrar acción que requiere aprobación del cliente
     */
    public static function registrarAccionConAprobacion($data)
    {
        return self::create([
            'usuario_id' => $data['usuario_id'],
            'cliente_afectado_id' => $data['cliente_id'],
            'accion' => $data['accion'],
            'modelo_tipo' => $data['modelo_tipo'] ?? null,
            'modelo_id' => $data['modelo_id'] ?? null,
            'titulo' => $data['titulo'],
            'descripcion' => $data['descripcion'] ?? null,
            'detalles' => $data['detalles'] ?? null,
            'requiere_aprobacion' => 'si',
            'estado_aprobacion' => 'pendiente',
            'prioridad' => $data['prioridad'] ?? 'media',
            'notificado' => false,
            'fecha_hora' => now(),
        ]);
    }

    /**
     * Registrar acción informativa (sin aprobación)
     */
    public static function registrarAccionInformativa($data)
    {
        return self::create([
            'usuario_id' => $data['usuario_id'],
            'cliente_afectado_id' => $data['cliente_id'] ?? null,
            'accion' => $data['accion'],
            'modelo_tipo' => $data['modelo_tipo'] ?? null,
            'modelo_id' => $data['modelo_id'] ?? null,
            'titulo' => $data['titulo'],
            'descripcion' => $data['descripcion'] ?? null,
            'detalles' => $data['detalles'] ?? null,
            'requiere_aprobacion' => 'no',
            'estado_aprobacion' => 'n/a',
            'prioridad' => $data['prioridad'] ?? 'baja',
            'fecha_hora' => now(),
        ]);
    }
}
