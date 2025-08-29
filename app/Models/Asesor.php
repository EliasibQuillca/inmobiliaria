<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

/**
 * Class Asesor
 * 
 * @property int $id
 * @property int $usuario_id
 * @property \Illuminate\Support\Carbon|null $fecha_contrato
 * @property string $nombre
 * @property string|null $apellidos
 * @property string|null $telefono
 * @property string|null $documento
 * @property string|null $direccion
 * @property \Illuminate\Support\Carbon|null $fecha_nacimiento
 * @property string|null $especialidad
 * @property string|null $experiencia
 * @property string|null $biografia
 * @property string $estado
 * @property float|null $comision_porcentaje
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 */
class Asesor extends Model
{
    use HasFactory;

    protected $table = 'asesores';

    protected $fillable = [
        'usuario_id',
        'fecha_contrato',
        'nombre',
        'apellidos',
        'telefono',
        'documento',
        'direccion',
        'fecha_nacimiento',
        'especialidad',
        'experiencia',
        'biografia',
        'estado',
        'comision_porcentaje',
    ];

    protected $casts = [
        'fecha_contrato' => 'date',
        'fecha_nacimiento' => 'date',
        'experiencia' => 'integer',
        'comision_porcentaje' => 'float',
    ];

    // Relaciones
    public function usuario()
    {
        return $this->belongsTo(User::class, 'usuario_id');
    }

    public function cotizaciones()
    {
        return $this->hasMany(Cotizacion::class, 'asesor_id');
    }

    public function clientes()
    {
        return $this->hasMany(Cliente::class, 'asesor_id');
    }

    public function reservas()
    {
        return $this->hasMany(Reserva::class, 'asesor_id');
    }

    public function ventas()
    {
        return $this->hasMany(Venta::class, 'asesor_id');
    }

    // Métodos de utilidad
    public function getNombreCompleto()
    {
        return $this->nombre . ' ' . $this->apellidos;
    }

    public function getEmail()
    {
        return $this->usuario->email;
    }

    public function getTelefono()
    {
        return $this->telefono;
    }

    public function getAntiguedad()
    {
        // Calcular años de antigüedad usando Carbon
        return Carbon::parse($this->attributes['fecha_contrato'])->diffInYears(Carbon::now());
    }

    /**
     * Scope para filtrar por estado.
     */
    public function scopeEstado($query, $estado)
    {
        if ($estado) {
            return $query->where('estado', $estado);
        }
        return $query;
    }

    /**
     * Scope para buscar por nombre, apellidos o documento.
     */
    public function scopeBuscar($query, $search)
    {
        if ($search) {
            return $query->where('nombre', 'LIKE', "%{$search}%")
                ->orWhere('apellidos', 'LIKE', "%{$search}%")
                ->orWhere('documento', 'LIKE', "%{$search}%");
        }
        return $query;
    }
}
