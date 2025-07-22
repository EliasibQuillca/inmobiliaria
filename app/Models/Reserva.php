<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Reserva extends Model
{
    use HasFactory;

    protected $table = 'reservas';

    protected $fillable = [
        'cotizacion_id',
        'cliente_id',
        'asesor_id',
        'departamento_id',
        'fecha_reserva',
        'fecha_inicio',
        'fecha_fin',
        'monto_reserva',
        'monto_total',
        'estado',
        'notas',
        'condiciones',
    ];

    protected $casts = [
        'fecha_reserva' => 'datetime',
        'fecha_inicio' => 'date',
        'fecha_fin' => 'date',
        'monto_reserva' => 'decimal:2',
        'monto_total' => 'decimal:2',
    ];

    // Relaciones
    public function cotizacion()
    {
        return $this->belongsTo(Cotizacion::class, 'cotizacion_id');
    }

    public function cliente()
    {
        return $this->belongsTo(Cliente::class, 'cliente_id');
    }

    public function asesor()
    {
        return $this->belongsTo(Asesor::class, 'asesor_id');
    }

    public function departamento()
    {
        return $this->belongsTo(Departamento::class, 'departamento_id');
    }

    public function venta()
    {
        return $this->hasOne(Venta::class, 'reserva_id');
    }

    // Métodos de utilidad
    public function getAsesor()
    {
        return $this->cotizacion->asesor;
    }

    public function getDepartamento()
    {
        return $this->cotizacion->departamento;
    }

    public function getCliente()
    {
        return $this->cotizacion->cliente;
    }

    public function tieneVenta()
    {
        return $this->venta !== null;
    }

    public function getDiasReservados()
    {
        return Carbon::parse($this->fecha_reserva)->diffInDays(Carbon::now());
    }
}
