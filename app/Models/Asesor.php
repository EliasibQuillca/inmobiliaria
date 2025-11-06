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
        // Las ventas están relacionadas a través de reservas
        return $this->hasManyThrough(
            Venta::class,
            Reserva::class,
            'asesor_id',    // Foreign key en reservas
            'reserva_id',   // Foreign key en ventas
            'id',           // Local key en asesores
            'id'            // Local key en reservas
        );
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

    public function getTiempoLaboral()
    {
        if (!$this->attributes['fecha_contrato']) {
            return ['texto' => '0 horas', 'dias' => 0, 'horas' => 0];
        }

        $fechaContrato = Carbon::parse($this->attributes['fecha_contrato']);
        $ahora = Carbon::now();

        $totalDias = $fechaContrato->diffInDays($ahora);
        $totalHoras = $fechaContrato->diffInHours($ahora);

        // Si tiene 360 días o más (1 año comercial)
        if ($totalDias >= 360) {
            $anos = floor($totalDias / 360);
            $diasRestantes = $totalDias % 360;

            if ($diasRestantes >= 30) {
                $meses = floor($diasRestantes / 30);
                $texto = $anos . ($anos === 1 ? ' año' : ' años') . ' y ' . $meses . ($meses === 1 ? ' mes' : ' meses');
            } else {
                $texto = $anos . ($anos === 1 ? ' año' : ' años');
            }
        }
        // Si tiene 30 días o más (1 mes)
        elseif ($totalDias >= 30) {
            $meses = floor($totalDias / 30);
            $diasRestantes = $totalDias % 30;

            if ($diasRestantes > 0) {
                $texto = $meses . ($meses === 1 ? ' mes' : ' meses') . ' y ' . $diasRestantes . ($diasRestantes === 1 ? ' día' : ' días');
            } else {
                $texto = $meses . ($meses === 1 ? ' mes' : ' meses');
            }
        }
        // Entre 1 y 29 días
        elseif ($totalDias >= 1) {
            $texto = $totalDias . ($totalDias === 1 ? ' día' : ' días');
        }
        // Menos de 1 día (mostrar horas enteras sin decimales)
        else {
            // Redondear horas (sin decimales de minutos)
            $horasEnteras = floor($totalHoras);

            if ($horasEnteras === 0) {
                $texto = 'Menos de 1 hora';
            } else {
                $texto = $horasEnteras . ($horasEnteras === 1 ? ' hora' : ' horas');
            }
        }

        return [
            'texto' => $texto,
            'dias' => $totalDias,
            'horas' => floor($totalHoras) // Horas enteras sin decimales
        ];
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
