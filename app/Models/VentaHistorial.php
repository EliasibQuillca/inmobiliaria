<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\User;

class VentaHistorial extends Model
{
    use HasFactory;

    protected $table = 'venta_historiales';

    protected $fillable = [
        'venta_id',
        'usuario_id',
        'accion',
        'datos_anteriores',
        'datos_nuevos',
        'motivo',
        'observaciones'
    ];

    protected $casts = [
        'datos_anteriores' => 'array',
        'datos_nuevos' => 'array'
    ];

    /**
     * Relación con la venta
     */
    public function venta()
    {
        return $this->belongsTo(Venta::class);
    }

    /**
     * Relación con el usuario que realizó el cambio
     */
    public function usuario()
    {
        return $this->belongsTo(User::class);
    }
}
