<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Venta extends Model
{
    use HasFactory;

    protected $table = 'ventas';

    protected $fillable = [
        'reserva_id',
        'fecha_venta',
        'monto_final',
        'documentos_entregados',
    ];

    protected $casts = [
        'fecha_venta' => 'date',
        'monto_final' => 'decimal:2',
        'documentos_entregados' => 'boolean',
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
}
