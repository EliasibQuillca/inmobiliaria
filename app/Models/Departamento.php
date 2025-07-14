<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Departamento extends Model
{
    use HasFactory;

    protected $table = 'departamentos';

    protected $fillable = [
        'codigo',
        'direccion',
        'precio',
        'estado',
        'propietario_id',
    ];

    protected $casts = [
        'precio' => 'decimal:2',
        'creado_en' => 'datetime',
    ];

    // Relaciones
    public function propietario()
    {
        return $this->belongsTo(Propietario::class, 'propietario_id');
    }

    public function publicaciones()
    {
        return $this->hasMany(Publicacion::class, 'departamento_id');
    }

    public function cotizaciones()
    {
        return $this->hasMany(Cotizacion::class, 'departamento_id');
    }

    public function atributos()
    {
        return $this->belongsToMany(Atributo::class, 'departamento_atributo')
                    ->withPivot('valor')
                    ->withTimestamps();
    }

    // Scopes
    public function scopeDisponibles($query)
    {
        return $query->where('estado', 'disponible');
    }

    public function scopeReservados($query)
    {
        return $query->where('estado', 'reservado');
    }

    public function scopeVendidos($query)
    {
        return $query->where('estado', 'vendido');
    }

    // Métodos de utilidad
    public function estaDisponible()
    {
        return $this->estado === 'disponible';
    }

    public function estaReservado()
    {
        return $this->estado === 'reservado';
    }

    public function estaVendido()
    {
        return $this->estado === 'vendido';
    }

    public function marcarComoReservado()
    {
        $this->update(['estado' => 'reservado']);
    }

    public function marcarComoVendido()
    {
        $this->update(['estado' => 'vendido']);
    }

    public function marcarComoDisponible()
    {
        $this->update(['estado' => 'disponible']);
    }
}
