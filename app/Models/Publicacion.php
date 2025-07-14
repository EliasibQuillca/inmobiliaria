<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Publicacion extends Model
{
    use HasFactory;

    protected $table = 'publicaciones';

    protected $fillable = [
        'departamento_id',
        'fecha_inicio',
        'fecha_fin',
        'precio_oferta',
        'estado',
    ];

    protected $casts = [
        'fecha_inicio' => 'date',
        'fecha_fin' => 'date',
        'precio_oferta' => 'decimal:2',
    ];

    // Relaciones
    public function departamento()
    {
        return $this->belongsTo(Departamento::class, 'departamento_id');
    }

    // Scopes
    public function scopeActivas($query)
    {
        return $query->where('estado', 'activa');
    }

    public function scopePausadas($query)
    {
        return $query->where('estado', 'pausada');
    }

    public function scopeExpiradas($query)
    {
        return $query->where('estado', 'expirada');
    }

    public function scopeVigentes($query)
    {
        return $query->where('estado', 'activa')
                    ->where('fecha_inicio', '<=', now())
                    ->where(function($q) {
                        $q->whereNull('fecha_fin')
                          ->orWhere('fecha_fin', '>=', now());
                    });
    }

    // Métodos de utilidad
    public function estaActiva()
    {
        return $this->estado === 'activa';
    }

    public function estaPausada()
    {
        return $this->estado === 'pausada';
    }

    public function estaExpirada()
    {
        return $this->estado === 'expirada';
    }

    public function estaVigente()
    {
        return $this->estaActiva() && 
               $this->fecha_inicio <= now() && 
               ($this->fecha_fin === null || $this->fecha_fin >= now());
    }
}
