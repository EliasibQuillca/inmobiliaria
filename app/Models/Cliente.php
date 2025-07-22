<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cliente extends Model
{
    use HasFactory;

    protected $table = 'clientes';

    protected $fillable = [
        'usuario_id',
        'dni',
        'direccion',
        'fecha_registro',
    ];

    protected $casts = [
        'fecha_registro' => 'date',
    ];

    // Relaciones
    public function usuario()
    {
        return $this->belongsTo(User::class, 'usuario_id');
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
