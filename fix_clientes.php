<?php
require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

try {
    echo "=== CORRIGIENDO DATOS DE CLIENTES ===\n\n";

    // Obtener clientes con datos incompletos
    $clientesIncompletos = \App\Models\Cliente::where('nombre', '')
        ->orWhereNull('nombre')
        ->orWhere('email', '')
        ->orWhereNull('email')
        ->get();

    echo "Clientes con datos incompletos encontrados: " . $clientesIncompletos->count() . "\n\n";

    $nombresEjemplo = [
        'Juan Pérez Rodríguez',
        'María García López',
        'Carlos Mendoza Silva',
        'Ana Torres Vargas',
        'Luis Fernández Cruz'
    ];

    $counter = 0;
    foreach ($clientesIncompletos as $cliente) {
        $nombre = $nombresEjemplo[$counter % count($nombresEjemplo)];
        $email = strtolower(str_replace(' ', '.', $nombre)) . ($counter + 1) . '@example.com';

        // Si ya tiene algún email, intentar preservarlo
        if (!empty($cliente->email) && $cliente->email !== '') {
            $email = $cliente->email;
        } elseif (!empty($cliente->nombre) && $cliente->nombre !== '') {
            $nombre = $cliente->nombre;
        }

        $cliente->update([
            'nombre' => $nombre,
            'email' => $email,
            'dni' => $cliente->dni ?: ('12345678' . $counter),
            'telefono' => $cliente->telefono ?: ('999888777' . $counter),
            'direccion' => $cliente->direccion ?: 'Dirección pendiente',
            'fecha_registro' => $cliente->fecha_registro ?: now(),
            'estado' => $cliente->estado ?: 'contactado'
        ]);

        echo "✅ Cliente ID {$cliente->id} actualizado: {$nombre} - {$email}\n";
        $counter++;
    }

    echo "\n=== VERIFICACIÓN FINAL ===\n";
    $cotizacionesActualizadas = \App\Models\Cotizacion::with('cliente')->get();
    foreach ($cotizacionesActualizadas as $cot) {
        echo "Cotización {$cot->id}: {$cot->cliente->nombre} ({$cot->cliente->email}) - Estado: {$cot->estado}\n";
    }

    echo "\n✅ CORRECCIÓN COMPLETADA\n";

} catch (Exception $e) {
    echo "❌ ERROR: " . $e->getMessage() . "\n";
}
