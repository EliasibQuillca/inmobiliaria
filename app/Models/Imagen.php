<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Imagen extends Model
{
    use HasFactory;
    /**
     * Nombre de la tabla en la base de datos.
     */
    protected $table = 'imagenes';

    /**
     * Los atributos que son asignables en masa.
     */
    protected $fillable = [
        'departamento_id',
        'url',
        'titulo',
        'descripcion',
        'tipo',
        'orden',
        'activa',
    ];

    /**
     * Los atributos que deben ser convertidos a tipos nativos.
     */
    protected $casts = [
        'activa' => 'boolean',
        'orden' => 'integer',
        'departamento_id' => 'integer',
    ];

    /**
     * Relación con el departamento.
     */
    public function departamento(): BelongsTo
    {
        return $this->belongsTo(Departamento::class);
    }

    /**
     * Scope para obtener solo imágenes activas.
     */
    public function scopeActivas($query)
    {
        return $query->where('activa', true);
    }

    /**
     * Scope para obtener imágenes por tipo.
     */
    public function scopePorTipo($query, $tipo)
    {
        return $query->where('tipo', $tipo);
    }

    /**
     * Scope para ordenar imágenes.
     */
    public function scopeOrdenadas($query)
    {
        return $query->orderBy('orden', 'asc')->orderBy('created_at', 'asc');
    }

    /**
     * Validar si la URL es válida.
     */
    public function esUrlValida(): bool
    {
        return filter_var($this->url, FILTER_VALIDATE_URL) !== false;
    }

    /**
     * Obtener la imagen principal del departamento.
     */
    public static function principal($departamentoId)
    {
        return static::where('departamento_id', $departamentoId)
            ->where('tipo', 'principal')
            ->where('activa', true)
            ->first();
    }
}
