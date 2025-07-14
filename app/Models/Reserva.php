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
        'fecha_reserva',
    ];

    protected $casts = [
        'fecha_reserva' => 'datetime',
    ];

    // Relaciones
    public function cotizacion()
    {
        return $this->belongsTo(Cotizacion::class, 'cotizacion_id');
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
