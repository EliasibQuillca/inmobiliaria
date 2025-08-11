<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Venta extends Model
{
    use HasFactory;

    protected $table = 'ventas';

    protected $fillable = [
        'reserva_id',
        'fecha_venta',
        'monto_final',
        'documentos_entregados',
        'observaciones',
        'cantidad_ediciones',
        'max_ediciones',
        'bloqueada_edicion',
        'fecha_primera_edicion',
        'fecha_ultima_edicion'
    ];

    protected $casts = [
        'fecha_venta' => 'datetime',
        'monto_final' => 'decimal:2',
        'documentos_entregados' => 'boolean',
        'bloqueada_edicion' => 'boolean',
        'fecha_primera_edicion' => 'datetime',
        'fecha_ultima_edicion' => 'datetime'
    ];

    // Relaciones
    public function reserva()
    {
        return $this->belongsTo(Reserva::class, 'reserva_id');
    }

    // Métodos de utilidad
    public function getCotizacion()
    {
        return $this->reserva->cotizacion;
    }

    public function getAsesor()
    {
        return $this->reserva->cotizacion->asesor;
    }

    public function getDepartamento()
    {
        return $this->reserva->cotizacion->departamento;
    }

    public function getCliente()
    {
        return $this->reserva->cotizacion->cliente;
    }

    public function documentosEntregados()
    {
        return $this->documentos_entregados;
    }

    public function marcarDocumentosEntregados()
    {
        $this->update(['documentos_entregados' => true]);
        
        // Marcar el departamento como vendido
        $this->getDepartamento()->marcarComoVendido();
    }

    public function estaCompleta()
    {
        return $this->documentos_entregados;
    }

    /**
     * Relación con el historial de cambios
     */
    public function historial()
    {
        return $this->hasMany(VentaHistorial::class)->orderBy('created_at', 'desc');
    }

    /**
     * Verificar si se puede editar
     */
    public function puedeEditarse()
    {
        return !$this->bloqueada_edicion && $this->cantidad_ediciones < $this->max_ediciones;
    }

    /**
     * Obtener días desde la venta
     */
    public function diasDesdeVenta()
    {
        return $this->fecha_venta->diffInDays(now());
    }

    /**
     * Verificar si está en periodo de edición (ej: 7 días)
     */
    public function enPeriodoEdicion($dias = 7)
    {
        return $this->diasDesdeVenta() <= $dias;
    }
}
