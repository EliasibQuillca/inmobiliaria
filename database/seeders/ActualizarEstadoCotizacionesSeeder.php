<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Cotizacion;

class ActualizarEstadoCotizacionesSeeder extends Seeder
{
    /**
     * Actualizar estados de cotizaciones según su progreso
     */
    public function run()
    {
        echo "Actualizando estados de cotizaciones...\n";

        // 1. Cotizaciones que ya tienen venta → completada
        $cotizacionesConVenta = Cotizacion::whereHas('reserva.venta')->get();
        echo "Cotizaciones con venta: {$cotizacionesConVenta->count()}\n";
        
        foreach ($cotizacionesConVenta as $cotizacion) {
            $cotizacion->update(['estado' => 'completada']);
            echo "- Cotización {$cotizacion->id} marcada como completada\n";
        }

        // 2. Cotizaciones que tienen reserva pero no venta → en_proceso 
        $cotizacionesConReserva = Cotizacion::whereHas('reserva')
            ->whereDoesntHave('reserva.venta')
            ->get();
        echo "Cotizaciones con reserva sin venta: {$cotizacionesConReserva->count()}\n";
        
        foreach ($cotizacionesConReserva as $cotizacion) {
            $cotizacion->update(['estado' => 'en_proceso']);
            echo "- Cotización {$cotizacion->id} marcada como en_proceso\n";
        }

        echo "Actualización completada!\n";
    }
}
