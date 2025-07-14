<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'nombre',
        'email',
        'telefono',
        'clave_hash',
        'rol',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'clave_hash',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'creado_en' => 'datetime',
            'email_verified_at' => 'datetime',
        ];
    }

    /**
     * Get the password attribute name for authentication
     */
    public function getAuthPasswordName()
    {
        return 'clave_hash';
    }

    /**
     * Override para usar 'clave_hash' en lugar de 'password'
     */
    public function getAuthPassword()
    {
        return $this->clave_hash;
    }

    // Relaciones
    public function cliente()
    {
        return $this->hasOne(Cliente::class, 'usuario_id');
    }

    public function asesor()
    {
        return $this->hasOne(Asesor::class, 'usuario_id');
    }

    public function auditorias()
    {
        return $this->hasMany(AuditoriaUsuario::class, 'usuario_id');
    }

    // Métodos de utilidad
    public function esCliente()
    {
        return $this->rol === 'cliente';
    }

    public function esAsesor()
    {
        return $this->rol === 'asesor';
    }

    public function esAdministrador()
    {
        return $this->rol === 'administrador';
    }
}
