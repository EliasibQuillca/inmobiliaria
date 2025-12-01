<?php

require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\Cotizacion;
use App\Models\Solicitud;

echo "=== MIGRACIÓN DE DATOS A TABLA SOLICITUDES ===" . PHP_EOL . PHP_EOL;

// Obtener cotizaciones que son realmente solicitudes
$cotizaciones = Cotizacion::whereIn('estado', ['pendiente', 'aprobada', 'rechazada'])
    ->with(['cliente', 'departamento'])
    ->get();

echo "Encontradas " . $cotizaciones->count() . " cotizaciones para migrar" . PHP_EOL . PHP_EOL;

$migradas = 0;
foreach($cotizaciones as $cot) {
    try {
        $solicitud = Solicitud::create([
            'cliente_id' => $cot->cliente_id,
            'asesor_id' => $cot->asesor_id,
            'departamento_id' => $cot->departamento_id,
            'tipo_consulta' => 'informacion',
            'mensaje_solicitud' => $cot->mensaje ?? 'Solicitud migrada automáticamente',
            'telefono' => $cot->telefono ?? '',
            'email_contacto' => $cot->cliente->email ?? '',
            'estado' => $cot->estado,
            'notas_asesor' => $cot->notas,
            'created_at' => $cot->created_at,
            'updated_at' => $cot->updated_at,
        ]);

        echo "✓ Migrada solicitud ID {$cot->id} → Nueva ID {$solicitud->id} | Estado: {$solicitud->estado}" . PHP_EOL;

        // Eliminar de cotizaciones
        $cot->delete();

        $migradas++;
    } catch (\Exception $e) {
        echo "✗ Error migrando solicitud ID {$cot->id}: " . $e->getMessage() . PHP_EOL;
    }
}

echo PHP_EOL . "=== MIGRACIÓN COMPLETA ===" . PHP_EOL;
echo "Total migradas: {$migradas}" . PHP_EOL;
