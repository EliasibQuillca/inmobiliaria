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
        'usuario_id',
        'comentario',
        'tipo',
        'leido',
    ];

    protected $casts = [
        'leido' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Relaciones
    public function cotizacion()
    {
        return $this->belongsTo(Cotizacion::class, 'cotizacion_id');
    }

    public function usuario()
    {
        return $this->belongsTo(User::class, 'usuario_id');
    }

    // Scopes
    public function scopeNoLeidos($query)
    {
        return $query->where('leido', false);
    }

    public function scopePorCotizacion($query, $cotizacionId)
    {
        return $query->where('cotizacion_id', $cotizacionId);
    }

    public function scopePorTipo($query, $tipo)
    {
        return $query->where('tipo', $tipo);
    }

    // Métodos de utilidad
    public function marcarComoLeido()
    {
        $this->update(['leido' => true]);
    }

    public function esDelCliente()
    {
        return $this->tipo === 'cliente';
    }

    public function esDelAsesor()
    {
        return $this->tipo === 'asesor';
    }
}
