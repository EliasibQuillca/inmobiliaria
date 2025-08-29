<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

/**
 * Class User
 * 
 * @property int $id
 * @property string $name
 * @property string $email
 * @property string $role
 * @property string|null $telefono
 * @property string $estado
 * @property \Illuminate\Support\Carbon|null $email_verified_at
 * @property string $password
 * @property string|null $remember_token
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 */
class User extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'telefono',
        'estado',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
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
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
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

    // Relación a través del modelo Asesor para las reservas
    public function reservasComplejas()
    {
        return $this->hasManyThrough(
            Reserva::class,
            Asesor::class,
            'usuario_id', // Foreign key en asesores
            'asesor_id',  // Foreign key en reservas
            'id',         // Local key en users
            'id'          // Local key en asesores
        );
    }

    // Métodos de utilidad
    public function esCliente()
    {
        return $this->attributes['role'] === 'cliente';
    }

    public function esAsesor()
    {
        return $this->attributes['role'] === 'asesor';
    }

    public function esAdministrador()
    {
        return $this->attributes['role'] === 'administrador';
    }

    /**
     * Check if user has one of the specified roles
     */
    public function hasRole($roles)
    {
        if (is_string($roles)) {
            return $this->attributes['role'] === $roles;
        }

        if (is_array($roles)) {
            return in_array($this->attributes['role'], $roles);
        }

        return false;
    }

    /**
     * Get the user's role in a human-readable format
     */
    public function getRoleDisplayAttribute()
    {
        return match($this->attributes['role'] ?? 'usuario') {
            'administrador' => 'Administrador',
            'asesor' => 'Asesor',
            'cliente' => 'Cliente',
            default => 'Usuario',
        };
    }
}
