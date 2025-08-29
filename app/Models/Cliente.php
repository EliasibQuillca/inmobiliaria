<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Cliente
 * 
 * @property int $id
 * @property int|null $usuario_id
 * @property int|null $asesor_id
 * @property string|null $dni
 * @property string|null $direccion
 * @property \Illuminate\Support\Carbon|null $fecha_registro
 * @property string $nombre
 * @property string|null $telefono
 * @property string $email
 * @property string|null $departamento_interes
 * @property string|null $notas_contacto
 * @property string|null $medio_contacto
 * @property string $estado
 * @property string|null $notas_seguimiento
 * @property \Illuminate\Support\Carbon|null $fecha_cita
 * @property string|null $tipo_cita
 * @property string|null $ubicacion_cita
 * @property string|null $notas_cita
 * @property string|null $tipo_propiedad
 * @property int|null $habitaciones_deseadas
 * @property float|null $presupuesto_min
 * @property float|null $presupuesto_max
 * @property string|null $zona_preferida
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 */
class Cliente extends Model
{
    use HasFactory;

    protected $table = 'clientes';

    protected $fillable = [
        'usuario_id',
        'asesor_id',
        'dni',
        'direccion',
        'fecha_registro',
        'nombre',
        'telefono',
        'email',
        'departamento_interes',
        'notas_contacto',
        'medio_contacto',
        'estado',
        'notas_seguimiento',
        'fecha_cita',
        'tipo_cita',
        'ubicacion_cita',
        'notas_cita',
        'tipo_propiedad',
        'habitaciones_deseadas',
        'presupuesto_min',
        'presupuesto_max',
        'zona_preferida',
    ];

    protected $casts = [
        'fecha_registro' => 'date',
        'fecha_cita' => 'datetime',
    ];

    // Relaciones
    public function usuario()
    {
        return $this->belongsTo(User::class, 'usuario_id');
    }

    public function asesor()
    {
        return $this->belongsTo(Asesor::class, 'asesor_id');
    }

    public function departamentoInteres()
    {
        return $this->belongsTo(Departamento::class, 'departamento_interes');
    }

    public function favoritos()
    {
        return $this->belongsToMany(Departamento::class, 'favoritos', 'cliente_id', 'departamento_id')
                    ->withTimestamps();
    }

    public function cotizaciones()
    {
        return $this->hasMany(Cotizacion::class, 'cliente_id');
    }

    public function reservas()
    {
        return $this->hasMany(Reserva::class, 'cliente_id');
    }

    // Métodos de utilidad
    public function getNombreCompleto()
    {
        return $this->usuario->name;
    }

    public function getEmail()
    {
        return $this->usuario->email;
    }

    public function getTelefono()
    {
        return $this->usuario->telefono ?? null;
    }
}
