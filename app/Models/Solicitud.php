<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Solicitud extends Model
{
    use HasFactory;

    protected $table = 'solicitudes';

    protected $fillable = [
        'cliente_id',
        'asesor_id',
        'departamento_id',
        'tipo_consulta',
        'mensaje_solicitud',
        'telefono',
        'email_contacto',
        'estado',
        'notas_asesor',
        'motivo_rechazo',
        'fecha_aprobacion',
        'fecha_rechazo',
    ];

    protected $casts = [
        'fecha_aprobacion' => 'datetime',
        'fecha_rechazo' => 'datetime',
    ];

    // Relaciones
    public function cliente()
    {
        return $this->belongsTo(Cliente::class);
    }

    public function asesor()
    {
        return $this->belongsTo(Asesor::class);
    }

    public function departamento()
    {
        return $this->belongsTo(Departamento::class);
    }

    // Scopes
    public function scopePendientes($query)
    {
        return $query->where('estado', 'pendiente');
    }

    public function scopeAprobadas($query)
    {
        return $query->where('estado', 'aprobada');
    }

    public function scopeRechazadas($query)
    {
        return $query->where('estado', 'rechazada');
    }
}
