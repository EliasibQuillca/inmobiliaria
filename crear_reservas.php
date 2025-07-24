<?php
require_once __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\Cotizacion;
use App\Models\Reserva;

echo "🔄 Creando reservas completadas...\n";

$cotizaciones = Cotizacion::with(['cliente', 'asesor', 'departamento'])->get();
echo "Cotizaciones disponibles: " . $cotizaciones->count() . "\n";

$reservasCreadas = 0;

foreach ($cotizaciones as $cotizacion) {
    // Verificar que no exista ya una reserva
    if (Reserva::where('cotizacion_id', $cotizacion->id)->exists()) {
        echo "⚠️ Ya existe reserva para cotización #{$cotizacion->id}\n";
        continue;
    }

    try {
        $reserva = Reserva::create([
            'cotizacion_id' => $cotizacion->id,
            'cliente_id' => $cotizacion->cliente_id,
            'asesor_id' => $cotizacion->asesor_id,
            'departamento_id' => $cotizacion->departamento_id,
            'fecha_reserva' => now()->subDays(rand(5, 20)),
            'fecha_inicio' => now(),
            'fecha_fin' => now()->addDays(30),
            'monto_reserva' => $cotizacion->precio_final * 0.1,
            'monto_total' => $cotizacion->precio_final,
            'estado' => 'completada',
            'notas' => 'Reserva lista para venta - Generada automáticamente',
            'condiciones' => 'Válida por 30 días - Lista para crear venta'
        ]);

        echo "✓ Reserva #{$reserva->id} creada para cotización #{$cotizacion->id}\n";
        $reservasCreadas++;

    } catch (Exception $e) {
        echo "❌ Error: " . $e->getMessage() . "\n";
    }
}

echo "\n🎉 PROCESO COMPLETADO\n";
echo "📋 Reservas completadas creadas: {$reservasCreadas}\n";
echo "📊 Total reservas completadas: " . Reserva::where('estado', 'completada')->count() . "\n";

if ($reservasCreadas > 0) {
    echo "\n🚀 AHORA PUEDES:\n";
    echo "1. Ir a: http://localhost:8000/admin/ventas/crear\n";
    echo "2. Seleccionar una reserva completada\n";
    echo "3. Crear tu primera venta!\n";
}
