<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Propietario extends Model
{
    use HasFactory;

    protected $table = 'propietarios';

    protected $fillable = [
        'nombre',
        'dni',
        'tipo',
        'contacto',
        'direccion',
        'registrado_sunarp',
    ];

    protected $casts = [
        'registrado_sunarp' => 'boolean',
    ];

    // Relaciones
    public function departamentos()
    {
        return $this->hasMany(Departamento::class, 'propietario_id');
    }

    // Métodos de utilidad
    public function esPersonaNatural()
    {
        return $this->tipo === 'natural';
    }

    public function esPersonaJuridica()
    {
        return $this->tipo === 'juridico';
    }
}
