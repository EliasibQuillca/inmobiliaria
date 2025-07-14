<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Asesor extends Model
{
    use HasFactory;

    protected $table = 'asesores';

    protected $fillable = [
        'usuario_id',
        'fecha_contrato',
    ];

    protected $casts = [
        'fecha_contrato' => 'date',
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

    // Métodos de utilidad
    public function getNombreCompleto()
    {
        return $this->usuario->nombre;
    }

    public function getEmail()
    {
        return $this->usuario->email;
    }

    public function getTelefono()
    {
        return $this->usuario->telefono;
    }

    public function getAntiguedad()
    {
        // Calcular años de antigüedad usando Carbon
        return Carbon::parse($this->attributes['fecha_contrato'])->diffInYears(Carbon::now());
    }
}
