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

    // =====================================================
    // MÉTODOS PARA RECOMENDACIONES Y MATCH SCORE
    // =====================================================

    /**
     * Obtiene departamentos recomendados para un cliente basado en sus preferencias.
     *
     * @param \App\Models\Cliente $cliente
     * @param int $limit
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public static function recomendadosPara($cliente, $limit = 6)
    {
        $query = self::query()
            ->where('estado', 'disponible')
            ->with(['imagenes', 'propietario']);

        // Filtro por presupuesto
        if ($cliente->presupuesto_min && $cliente->presupuesto_max) {
            $query->whereBetween('precio', [$cliente->presupuesto_min, $cliente->presupuesto_max]);
        } elseif ($cliente->presupuesto_max) {
            $query->where('precio', '<=', $cliente->presupuesto_max);
        }

        // Filtro por zona preferida (búsqueda en ubicación)
        if ($cliente->zona_preferida) {
            $query->where('ubicacion', 'LIKE', '%' . $cliente->zona_preferida . '%');
        }

        // Filtro por habitaciones deseadas (±1 habitación de tolerancia)
        if ($cliente->habitaciones_deseadas) {
            $query->whereBetween('habitaciones', [
                max(1, $cliente->habitaciones_deseadas - 1),
                $cliente->habitaciones_deseadas + 1
            ]);
        }

        $departamentos = $query->get();

        // Calcular match score para cada departamento
        $recomendaciones = $departamentos->map(function ($depto) use ($cliente) {
            $depto->match_score = self::calcularMatchScore($depto, $cliente);
            $depto->es_favorito = $cliente->favoritos()
                ->where('departamento_id', $depto->id)
                ->exists();
            return $depto;
        });

        // Ordenar por match score descendente y limitar
        return $recomendaciones->sortByDesc('match_score')->take($limit)->values();
    }

    /**
     * Calcula el porcentaje de compatibilidad entre un departamento y un cliente.
     *
     * @param \App\Models\Departamento $departamento
     * @param \App\Models\Cliente $cliente
     * @return int Puntuación de 0 a 100
     */
    public static function calcularMatchScore($departamento, $cliente)
    {
        $score = 0;

        // Precio (30 puntos)
        if ($cliente->presupuesto_min && $cliente->presupuesto_max) {
            if ($departamento->precio >= $cliente->presupuesto_min && 
                $departamento->precio <= $cliente->presupuesto_max) {
                $score += 30;
            } elseif ($departamento->precio < $cliente->presupuesto_min) {
                // Bonus si es más barato que el mínimo
                $score += 20;
            }
        } elseif ($cliente->presupuesto_max) {
            if ($departamento->precio <= $cliente->presupuesto_max) {
                $score += 30;
            }
        } else {
            // Si no tiene presupuesto definido, dar puntos base
            $score += 10;
        }

        // Habitaciones (25 puntos)
        if ($cliente->habitaciones_deseadas) {
            if ($departamento->habitaciones == $cliente->habitaciones_deseadas) {
                $score += 25;
            } elseif (abs($departamento->habitaciones - $cliente->habitaciones_deseadas) == 1) {
                $score += 15;
            } elseif (abs($departamento->habitaciones - $cliente->habitaciones_deseadas) == 2) {
                $score += 5;
            }
        } else {
            $score += 10;
        }

        // Zona/Ubicación (20 puntos)
        if ($cliente->zona_preferida) {
            $zonaCliente = strtolower($cliente->zona_preferida);
            $ubicacionDepto = strtolower($departamento->ubicacion);
            
            if (stripos($ubicacionDepto, $zonaCliente) !== false) {
                $score += 20;
            } elseif (self::zonaSimilar($zonaCliente, $ubicacionDepto)) {
                $score += 10;
            }
        } else {
            $score += 10;
        }

        // Tipo de propiedad (15 puntos)
        // Por ahora todos son departamentos, dar puntos base
        if ($cliente->tipo_propiedad === 'departamento' || !$cliente->tipo_propiedad) {
            $score += 15;
        }

        // Estado disponible (10 puntos)
        if ($departamento->estado === 'disponible') {
            $score += 10;
        }

        return min(100, $score); // Máximo 100 puntos
    }

    /**
     * Verifica si dos zonas son similares (lógica básica).
     *
     * @param string $zona1
     * @param string $zona2
     * @return bool
     */
    private static function zonaSimilar($zona1, $zona2)
    {
        $zonasCercanas = [
            'miraflores' => ['san isidro', 'barranco', 'surco'],
            'san isidro' => ['miraflores', 'lince', 'jesus maria'],
            'surco' => ['miraflores', 'la molina', 'san borja'],
            'barranco' => ['miraflores', 'chorrillos'],
        ];

        foreach ($zonasCercanas as $zona => $cercanas) {
            if (stripos($zona1, $zona) !== false) {
                foreach ($cercanas as $cercana) {
                    if (stripos($zona2, $cercana) !== false) {
                        return true;
                    }
                }
            }
        }

        return false;
    }

    /**
     * Scope para filtrar departamentos en rango de presupuesto de un cliente.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param \App\Models\Cliente $cliente
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeEnRangoCliente($query, $cliente)
    {
        if ($cliente->presupuesto_min && $cliente->presupuesto_max) {
            return $query->whereBetween('precio', [$cliente->presupuesto_min, $cliente->presupuesto_max]);
        } elseif ($cliente->presupuesto_max) {
            return $query->where('precio', '<=', $cliente->presupuesto_max);
        }

        return $query;
    }

    /**
     * Scope para obtener propiedades destacadas.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeDestacados($query)
    {
        return $query->where('destacado', true)
                    ->where('estado', 'disponible')
                    ->orderBy('created_at', 'desc');
    }

    /**
     * Scope para obtener propiedades recientes.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param int $dias
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeRecientes($query, $dias = 7)
    {
        return $query->where('created_at', '>=', now()->subDays($dias))
                    ->where('estado', 'disponible')
                    ->orderBy('created_at', 'desc');
    }

    /**
     * Obtiene las zonas disponibles en el catálogo.
     *
     * @return array
     */
    public static function zonasDisponibles()
    {
        return self::where('estado', 'disponible')
            ->pluck('ubicacion')
            ->map(function ($ubicacion) {
                // Extraer la zona principal (primera parte de la dirección)
                $partes = explode(',', $ubicacion);
                return trim($partes[count($partes) - 1] ?? $ubicacion);
            })
            ->unique()
            ->sort()
            ->values()
            ->toArray();
    }
}
