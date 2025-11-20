<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "═══════════════════════════════════════════════════════════════\n";
echo "REPARAR CLIENTES SIN ASESOR ASIGNADO\n";
echo "═══════════════════════════════════════════════════════════════\n\n";

// Buscar solicitudes con clientes sin asesor
$solicitudes = DB::table('solicitudes')
    ->join('clientes', 'solicitudes.cliente_id', '=', 'clientes.id')
    ->whereNull('clientes.asesor_id')
    ->whereNotNull('solicitudes.asesor_id')
    ->select('solicitudes.*', 'clientes.nombre as cliente_nombre', 'clientes.asesor_id as cliente_asesor_id')
    ->get();

echo "📋 Solicitudes encontradas con clientes sin asesor: " . $solicitudes->count() . "\n\n";

if ($solicitudes->count() === 0) {
    echo "✅ No hay clientes sin asesor asignado.\n";
    exit(0);
}

foreach ($solicitudes as $solicitud) {
    echo "🔧 Procesando Solicitud ID: {$solicitud->id}\n";
    echo "   Cliente: {$solicitud->cliente_nombre} (ID: {$solicitud->cliente_id})\n";
    echo "   Asesor de la solicitud: ID {$solicitud->asesor_id}\n";
    echo "   Cliente asesor_id actual: " . ($solicitud->cliente_asesor_id ?? 'NULL') . "\n";

    // Asignar el asesor al cliente
    $updated = DB::table('clientes')
        ->where('id', $solicitud->cliente_id)
        ->update([
            'asesor_id' => $solicitud->asesor_id,
            'estado' => 'interesado',
            'updated_at' => now()
        ]);

    if ($updated) {
        echo "   ✅ Cliente asignado al asesor ID: {$solicitud->asesor_id}\n";
    } else {
        echo "   ❌ Error al asignar asesor\n";
    }

    echo "\n";
}

echo "═══════════════════════════════════════════════════════════════\n";
echo "VERIFICACIÓN FINAL\n";
echo "═══════════════════════════════════════════════════════════════\n\n";

$clientesSinAsesor = DB::table('clientes')->whereNull('asesor_id')->count();
$clientesConAsesor = DB::table('clientes')->whereNotNull('asesor_id')->count();

echo "Clientes SIN asesor: $clientesSinAsesor\n";
echo "Clientes CON asesor: $clientesConAsesor\n\n";

if ($clientesSinAsesor === 0) {
    echo "✅ TODOS los clientes tienen asesor asignado.\n";
} else {
    echo "⚠️  Aún hay $clientesSinAsesor clientes sin asesor.\n";
}

echo "\n═══════════════════════════════════════════════════════════════\n";
echo "✅ REPARACIÓN COMPLETADA\n";
echo "═══════════════════════════════════════════════════════════════\n";
