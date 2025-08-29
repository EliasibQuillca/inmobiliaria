<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Departamento
 * 
 * @property int $id
 * @property string $codigo
 * @property string $titulo
 * @property string|null $descripcion
 * @property string|null $ubicacion
 * @property string|null $direccion
 * @property float $precio
 * @property float|null $precio_anterior
 * @property int|null $dormitorios
 * @property int|null $banos
 * @property float|null $area_total
 * @property int|null $estacionamientos
 * @property string $estado
 * @property bool $disponible
 * @property int $propietario_id
 * @property bool $destacado
 * @property string|null $imagen_principal
 * @property string|null $imagen_galeria_1
 * @property string|null $imagen_galeria_2
 * @property string|null $imagen_galeria_3
 * @property string|null $imagen_galeria_4
 * @property string|null $imagen_galeria_5
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property \Illuminate\Support\Carbon|null $creado_en
 */
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
        'imagen_principal',
        'imagen_galeria_1',
        'imagen_galeria_2',
        'imagen_galeria_3',
        'imagen_galeria_4',
        'imagen_galeria_5',
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

    public function reservas()
    {
        // Las reservas están relacionadas a través de cotizaciones
        return $this->hasManyThrough(
            Reserva::class,    // Modelo final
            Cotizacion::class, // Modelo intermedio
            'departamento_id', // Foreign key en cotizaciones
            'cotizacion_id',   // Foreign key en reservas
            'id',              // Local key en departamentos
            'id'               // Local key en cotizaciones
        );
    }

    public function ventas()
    {
        // Las ventas están relacionadas a través de: Departamento -> Cotizaciones -> Reservas -> Ventas
        return $this->hasManyThrough(
            Venta::class,      // Modelo final
            Reserva::class,    // Modelo intermedio
            'cotizacion_id',   // Foreign key en reservas (reservas.cotizacion_id)
            'reserva_id',      // Foreign key en ventas (ventas.reserva_id)
            'id',              // Local key en departamentos (departamentos.id)
            'id'               // Local key en reservas (reservas.id)
        )->whereHas('reserva.cotizacion', function($query) {
            $query->where('departamento_id', $this->id);
        });
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
