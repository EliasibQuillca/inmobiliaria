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
        'titulo',
        'descripcion',
        'ubicacion',
        'direccion',
        'precio',
        'precio_anterior',
        'dormitorios',
        'banos',
        'area_total',
        'estacionamientos',
        'estado',
        'disponible',
        'propietario_id',
        'destacado',
    ];

    protected $casts = [
        'precio' => 'decimal:2',
        'creado_en' => 'datetime',
        'destacado' => 'boolean',
    ];

    // Relaciones
    public function propietario()
    {
        return $this->belongsTo(Propietario::class, 'propietario_id');
    }

    public function clientesFavoritos()
    {
        return $this->belongsToMany(Cliente::class, 'favoritos', 'departamento_id', 'cliente_id')
                    ->withTimestamps();
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

    public function imagenes()
    {
        return $this->hasMany(Imagen::class, 'departamento_id');
    }

    public function imagenesActivas()
    {
        return $this->hasMany(Imagen::class, 'departamento_id')->activas()->ordenadas();
    }

    public function imagenPrincipal()
    {
        return $this->hasOne(Imagen::class, 'departamento_id')->where('tipo', 'principal')->where('activa', true);
    }

    public function galeriaImagenes()
    {
        return $this->hasMany(Imagen::class, 'departamento_id')->where('tipo', 'galeria')->activas()->ordenadas();
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
        return $this->attributes['estado'] === 'disponible';
    }

    public function estaReservado()
    {
        return $this->attributes['estado'] === 'reservado';
    }

    public function estaVendido()
    {
        return $this->attributes['estado'] === 'vendido';
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
