<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

/**
 * Class Reserva
 * 
 * @property int $id
 * @property int $cotizacion_id
 * @property int $cliente_id
 * @property int $asesor_id
 * @property int $departamento_id
 * @property \Illuminate\Support\Carbon|null $fecha_reserva
 * @property \Illuminate\Support\Carbon|null $fecha_inicio
 * @property \Illuminate\Support\Carbon|null $fecha_fin
 * @property float $monto_reserva
 * @property float $monto_total
 * @property string $estado
 * @property string|null $notas
 * @property string|null $condiciones
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 */
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

    // Scopes
    public function scopeActivas($query)
    {
        return $query->whereIn('estado', ['pendiente', 'confirmada']);
    }

    public function scopeHistorial($query)
    {
        return $query->whereIn('estado', ['cancelada', 'vencida']);
    }

    public function scopePendientes($query)
    {
        return $query->where('estado', 'pendiente');
    }

    public function scopeConfirmadas($query)
    {
        return $query->where('estado', 'confirmada');
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
