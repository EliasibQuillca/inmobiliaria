<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Departamento
 * 
 * @property int $id
 * @property string $titulo
 * @property string $descripcion
 * @property string $ubicacion
 * @property float $precio
 * @property int $habitaciones
 * @property int $banos
 * @property float $area
 * @property bool $disponible
 * @property string $estado
 * @property int $piso
 * @property bool $garage
 * @property bool $balcon
 * @property bool $amueblado
 * @property bool $mascotas_permitidas
 * @property float|null $gastos_comunes
 * @property int $año_construccion
 * @property bool $destacado
 * @property int $propietario_id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 */
class Departamento extends Model
{
    use HasFactory;

    protected $table = 'departamentos';
    
    /**
     * Los eventos del modelo.
     */
    protected static function booted()
    {
        // Asignar código automáticamente al crear un nuevo departamento
        static::creating(function ($departamento) {
            if (empty($departamento->codigo)) {
                $departamento->codigo = static::generarCodigo();
            }
        });
    }

    protected $fillable = [
        'codigo',
        'titulo',
        'descripcion',
        'ubicacion',
        'precio',
        'habitaciones',
        'banos',
        'area',
        'disponible',
        'estado',
        'piso',
        'garage',
        'balcon',
        'amueblado',
        'mascotas_permitidas',
        'gastos_comunes',
        'año_construccion',
        'destacado',
        'propietario_id',
    ];

    protected $casts = [
        'precio' => 'decimal:2',
        'area' => 'decimal:2',
        'gastos_comunes' => 'decimal:2',
        'disponible' => 'boolean',
        'garage' => 'boolean',
        'balcon' => 'boolean',
        'amueblado' => 'boolean',
        'mascotas_permitidas' => 'boolean',
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
        return $this->hasMany(Imagen::class, 'departamento_id')
                    ->orderByRaw("CASE WHEN tipo = 'principal' THEN 0 ELSE 1 END")
                    ->orderBy('orden')
                    ->orderBy('id');
    }

    public function imagenesActivas()
    {
        return $this->hasMany(Imagen::class, 'departamento_id')->activas()->ordenadas();
    }

    public function imagenPrincipal()
    {
        return $this->hasOne(Imagen::class, 'departamento_id')
            ->where('tipo', 'principal')
            ->where('activa', true)
            ->orWhereNotExists(function ($query) {
                $query->from('imagenes')
                    ->where('departamento_id', $this->id)
                    ->where('tipo', 'principal')
                    ->where('activa', true);
            })
            ->orderBy('orden')
            ->orderBy('tipo', 'desc'); // 'principal' viene después de 'galeria' en orden alfabético
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

    // Getter para calcular el precio por metro cuadrado
    public function getPrecioPorMetroAttribute()
    {
        if ($this->area > 0) {
            return round($this->precio / $this->area, 2);
        }
        return 0;
    }
    
    /**
     * Genera un código único para un nuevo departamento
     * 
     * @return string
     */
    public static function generarCodigo()
    {
        $ultimoDepartamento = self::orderBy('id', 'desc')->first();
        $numero = $ultimoDepartamento ? (intval(substr($ultimoDepartamento->codigo ?? 'DEPT-0000', 5)) + 1) : 1;
        return 'DEPT-' . str_pad($numero, 4, '0', STR_PAD_LEFT);
    }
}
