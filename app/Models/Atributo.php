<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Atributo extends Model
{
    use HasFactory;

    protected $table = 'atributos';

    protected $fillable = [
        'nombre',
        'tipo',
    ];

    // Relaciones
    public function departamentos()
    {
        return $this->belongsToMany(Departamento::class, 'departamento_atributo')
                    ->withPivot('valor')
                    ->withTimestamps();
    }

    // Métodos de utilidad
    public function esString()
    {
        return $this->tipo === 'string';
    }

    public function esNumero()
    {
        return $this->tipo === 'number';
    }

    public function esBoolean()
    {
        return $this->tipo === 'boolean';
    }

    public function esFecha()
    {
        return $this->tipo === 'date';
    }

    public function validarValor($valor)
    {
        switch ($this->tipo) {
            case 'string':
                return is_string($valor);
            case 'number':
                return is_numeric($valor);
            case 'boolean':
                return is_bool($valor) || in_array($valor, ['true', 'false', '1', '0']);
            case 'date':
                return strtotime($valor) !== false;
            default:
                return false;
        }
    }
}
