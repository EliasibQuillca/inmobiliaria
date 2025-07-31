<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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
    ];

    protected $casts = [
        'fecha' => 'datetime',
        'fecha_validez' => 'date',
        'monto' => 'decimal:2',
        'descuento' => 'decimal:2',
    ];

    // Relaciones
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
        return $this->hasMany(ComentarioSolicitud::class, 'cotizacion_id')->orderBy('created_at', 'asc');
    }

    public function reserva()
    {
        return $this->hasOne(Reserva::class, 'cotizacion_id');
    }

    // Scopes
    public function scopePendientes($query)
    {
        return $query->where('estado', 'pendiente');
    }

    public function scopeAceptadas($query)
    {
        return $query->where('estado', 'aceptada');
    }

    public function scopeRechazadas($query)
    {
        return $query->where('estado', 'rechazada');
    }

    // Métodos de utilidad
    public function estaPendiente()
    {
        return $this->attributes['estado'] === 'pendiente';
    }

    public function estaAceptada()
    {
        return $this->attributes['estado'] === 'aceptada';
    }

    public function estaRechazada()
    {
        return $this->attributes['estado'] === 'rechazada';
    }

    public function aceptar()
    {
        $this->update(['estado' => 'aceptada']);
    }

    public function rechazar()
    {
        $this->update(['estado' => 'rechazada']);
    }

    public function tieneReserva()
    {
        return $this->reserva !== null;
    }
}
