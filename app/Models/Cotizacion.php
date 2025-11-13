<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

class Cotizacion extends Model
{
    use HasFactory;

    protected $table = 'cotizaciones';

    protected $fillable = [
        'asesor_id',
        'departamento_id',
        'cliente_id',
        'fecha',
        'monto',
        'descuento',
        'fecha_validez',
        'estado',
        'notas',
        'condiciones',
        'tipo_solicitud',
        'mensaje_solicitud',
        'telefono_contacto',
        'fecha_respuesta_cliente',
        'motivo_rechazo_cliente',
    ];

    protected $casts = [
        'fecha' => 'datetime',
        'fecha_validez' => 'date',
        'fecha_respuesta_cliente' => 'datetime',
        'monto' => 'float', // ⚙️ más compatible que decimal:2
        'descuento' => 'float',
    ];

    /* ==========================
       🔗 RELACIONES
       ========================== */

    public function asesor()
    {
        return $this->belongsTo(Asesor::class, 'asesor_id');
    }

    public function departamento()
    {
        return $this->belongsTo(Departamento::class, 'departamento_id');
    }

    public function cliente()
    {
        return $this->belongsTo(Cliente::class, 'cliente_id');
    }

    public function comentarios()
    {
        return $this->hasMany(ComentarioSolicitud::class, 'cotizacion_id')
                    ->orderBy('created_at', 'asc');
    }

    public function reserva()
    {
        return $this->hasOne(Reserva::class, 'cotizacion_id');
    }

    /* ==========================
       🔍 SCOPES (consultas rápidas)
       ========================== */

    public function scopePendientes(Builder $query): Builder
    {
        return $query->where('estado', 'pendiente');
    }

    public function scopeAceptadas(Builder $query): Builder
    {
        return $query->where('estado', 'aprobada'); // ⚙️ coincide con tu controlador
    }

    public function scopeRechazadas(Builder $query): Builder
    {
        return $query->where('estado', 'rechazada');
    }

    public function scopeReservadas(Builder $query): Builder
    {
        return $query->where('estado', 'en_proceso');
    }

    public function scopeFinalizadas(Builder $query): Builder
    {
        return $query->where('estado', 'completada');
    }

    public function scopeActivas(Builder $query): Builder
    {
        return $query->whereIn('estado', ['pendiente', 'en_proceso', 'aprobada']);
    }

    public function scopeHistorial(Builder $query): Builder
    {
        return $query->whereIn('estado', ['completada', 'cancelada', 'expirada']);
    }

    /* ==========================
       ⚙️ MÉTODOS DE UTILIDAD
       ========================== */

    public function estaPendiente(): bool
    {
        return $this->estado === 'pendiente';
    }

    public function estaAprobada(): bool
    {
        return $this->estado === 'aprobada';
    }

    public function estaRechazada(): bool
    {
        return $this->estado === 'rechazada';
    }

    public function estaEnProceso(): bool
    {
        return $this->estado === 'en_proceso';
    }

    public function estaFinalizada(): bool
    {
        return $this->estado === 'completada';
    }

    public function estaActiva(): bool
    {
        return in_array($this->estado, ['pendiente', 'en_proceso', 'aprobada']);
    }

    public function estaEnHistorial(): bool
    {
        return in_array($this->estado, ['completada', 'cancelada', 'expirada']);
    }

    /* ==========================
       🚀 CAMBIOS DE ESTADO
       ========================== */

    public function marcarPendiente()
    {
        return $this->update(['estado' => 'pendiente']);
    }

    public function aprobar()
    {
        return $this->update(['estado' => 'aprobada']);
    }

    public function rechazar()
    {
        return $this->update(['estado' => 'rechazada']);
    }

    public function marcarEnProceso()
    {
        return $this->update(['estado' => 'en_proceso']);
    }

    public function marcarFinalizada()
    {
        return $this->update(['estado' => 'completada']);
    }

    public function tieneReserva(): bool
    {
        return !is_null($this->reserva);
    }
}
