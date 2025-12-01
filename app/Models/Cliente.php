<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;

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
        'fecha_nacimiento',
        'ciudad',
        'ocupacion',
        'estado_civil',
        'ingresos_mensuales',
    ];

    protected $casts = [
        'fecha_registro' => 'date',
        'fecha_cita' => 'datetime',
        'fecha_nacimiento' => 'date',
        'presupuesto_min' => 'decimal:2',
        'presupuesto_max' => 'decimal:2',
        'ingresos_mensuales' => 'decimal:2',
        'habitaciones_deseadas' => 'integer',
    ];

    protected $appends = [
        'nombre_completo',
        'email_completo',
        'telefono_completo',
        'edad',
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

    public function solicitudes()
    {
        return $this->hasMany(Solicitud::class, 'cliente_id');
    }

    public function cotizaciones()
    {
        return $this->hasMany(Cotizacion::class, 'cliente_id');
    }

    public function reservas()
    {
        return $this->hasMany(Reserva::class, 'cliente_id');
    }

    // =====================================================
    // ACCESSORS (Atributos Computados)
    // =====================================================

    /**
     * Obtiene el nombre completo del cliente.
     * Si tiene usuario, usa el nombre del usuario.
     * Si no, usa el campo nombre directo.
     */
    protected function nombreCompleto(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->usuario?->name ?? $this->attributes['nombre'] ?? 'Sin nombre'
        );
    }

    /**
     * Obtiene el email del cliente.
     * Si tiene usuario, usa el email del usuario.
     * Si no, usa el campo email directo.
     */
    protected function emailCompleto(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->usuario?->email ?? $this->attributes['email'] ?? null
        );
    }

    /**
     * Obtiene el teléfono del cliente.
     * Si tiene usuario, usa el teléfono del usuario.
     * Si no, usa el campo teléfono directo.
     */
    protected function telefonoCompleto(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->usuario?->telefono ?? $this->attributes['telefono'] ?? null
        );
    }

    /**
     * Calcula la edad del cliente basándose en su fecha de nacimiento.
     */
    protected function edad(): Attribute
    {
        return Attribute::make(
            get: function () {
                if (!$this->fecha_nacimiento) {
                    return null;
                }
                return \Carbon\Carbon::parse($this->fecha_nacimiento)->age;
            }
        );
    }

    // =====================================================
    // MÉTODOS DE UTILIDAD (Compatibilidad hacia atrás)
    // =====================================================

    /**
     * @deprecated Usar $cliente->nombre_completo en su lugar
     */
    public function getNombreCompleto()
    {
        return $this->nombre_completo;
    }

    /**
     * @deprecated Usar $cliente->email_completo en su lugar
     */
    public function getEmail()
    {
        return $this->email_completo;
    }

    /**
     * @deprecated Usar $cliente->telefono_completo en su lugar
     */
    public function getTelefono()
    {
        return $this->telefono_completo;
    }

    // =====================================================
    // SCOPES (Consultas Reutilizables)
    // =====================================================

    /**
     * Scope para clientes con usuario registrado
     */
    public function scopeConUsuario($query)
    {
        return $query->whereNotNull('usuario_id');
    }

    /**
     * Scope para clientes sin usuario (solo prospectos)
     */
    public function scopeSinUsuario($query)
    {
        return $query->whereNull('usuario_id');
    }

    /**
     * Scope para clientes de un asesor específico
     */
    public function scopeDeAsesor($query, $asesorId)
    {
        return $query->where('asesor_id', $asesorId);
    }

    /**
     * Scope para clientes por estado
     */
    public function scopePorEstado($query, $estado)
    {
        return $query->where('estado', $estado);
    }

    /**
     * Scope para clientes contactados recientemente
     */
    public function scopeContactadosRecientes($query, $dias = 7)
    {
        return $query->where('fecha_registro', '>=', now()->subDays($dias))
                     ->where('estado', 'contactado');
    }

    /**
     * Scope para clientes con citas pendientes
     */
    public function scopeConCitasPendientes($query)
    {
        return $query->where('estado', 'cita_agendada')
                     ->whereNotNull('fecha_cita')
                     ->where('fecha_cita', '>=', now());
    }

    // =====================================================
    // MÉTODOS DE NEGOCIO
    // =====================================================

    /**
     * Verifica si el cliente tiene usuario registrado
     */
    public function tieneUsuario(): bool
    {
        return !is_null($this->usuario_id) && !is_null($this->usuario);
    }

    /**
     * Verifica si el cliente está activo
     */
    public function estaActivo(): bool
    {
        return in_array($this->estado, ['contactado', 'interesado', 'cita_agendada']);
    }

    /**
     * Verifica si el cliente tiene una cita programada
     */
    public function tieneCitaProgramada(): bool
    {
        return $this->estado === 'cita_agendada'
               && !is_null($this->fecha_cita)
               && $this->fecha_cita >= now();
    }

    /**
     * Obtiene el rango de presupuesto como string formateado
     */
    public function getRangoPresupuesto(): string
    {
        if (!$this->presupuesto_min && !$this->presupuesto_max) {
            return 'No especificado';
        }

        $min = $this->presupuesto_min ? 'S/ ' . number_format($this->presupuesto_min, 0) : 'Sin mínimo';
        $max = $this->presupuesto_max ? 'S/ ' . number_format($this->presupuesto_max, 0) : 'Sin máximo';

        return "$min - $max";
    }

    /**
     * Verifica si un departamento está en el rango de presupuesto del cliente
     */
    public function estaEnPresupuesto(float $precio): bool
    {
        if ($this->presupuesto_min && $precio < $this->presupuesto_min) {
            return false;
        }

        if ($this->presupuesto_max && $precio > $this->presupuesto_max) {
            return false;
        }

        return true;
    }

    /**
     * Verifica si el cliente tiene datos completos
     */
    public function isDatosCompletos(): bool
    {
        return !is_null($this->nombre) &&
               !is_null($this->telefono) &&
               !is_null($this->email) &&
               !is_null($this->dni) &&
               !is_null($this->direccion);
    }

    /**
     * Verifica si el cliente tiene preferencias definidas
     */
    public function tienePreferencias(): bool
    {
        return (!is_null($this->presupuesto_min) || !is_null($this->presupuesto_max)) &&
               !is_null($this->zona_preferida) &&
               !is_null($this->habitaciones_deseadas);
    }
}
