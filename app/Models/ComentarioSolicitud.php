<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ComentarioSolicitud extends Model
{
    use HasFactory;

    protected $table = 'comentarios_solicitud';

    protected $fillable = [
        'cotizacion_id',
        'user_id',
        'mensaje',
        'rol',
    ];

    // Relaciones
    public function cotizacion()
    {
        return $this->belongsTo(Cotizacion::class, 'cotizacion_id');
    }

    public function usuario()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
