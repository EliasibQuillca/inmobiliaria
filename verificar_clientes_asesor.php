<?php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\Cliente;
use App\Models\Cotizacion;
use App\Models\Asesor;

echo "=== DIAGNÓSTICO: Clientes y Asesores ===\n\n";

// 1. Ver todos los clientes
echo "📋 CLIENTES EXISTENTES:\n";
$clientes = Cliente::with('usuario')->get();
foreach ($clientes as $cliente) {
    echo "  ID: {$cliente->id}\n";
    echo "  Usuario: " . ($cliente->usuario ? $cliente->usuario->name : 'Sin usuario') . "\n";
    echo "  Nombre: " . ($cliente->nombre ?? 'NULL') . "\n";
    echo "  Asesor ID: " . ($cliente->asesor_id ?? 'NULL') . "\n";
    echo "  Estado: " . ($cliente->estado ?? 'NULL') . "\n";
    echo "  ---\n";
}

// 2. Ver cotizaciones (solicitudes)
echo "\n📝 COTIZACIONES/SOLICITUDES:\n";
$cotizaciones = Cotizacion::with(['cliente', 'asesor', 'departamento'])
    ->whereNotNull('tipo_solicitud')
    ->get();

foreach ($cotizaciones as $cot) {
    echo "  ID: {$cot->id}\n";
    echo "  Cliente: " . ($cot->cliente ? $cot->cliente->nombre ?? $cot->cliente->usuario->name : 'NULL') . "\n";
    echo "  Asesor: " . ($cot->asesor ? $cot->asesor->nombre : 'NULL') . "\n";
    echo "  Departamento: " . ($cot->departamento ? $cot->departamento->codigo : 'NULL') . "\n";
    echo "  Estado: {$cot->estado}\n";
    echo "  Tipo: {$cot->tipo_solicitud}\n";
    echo "  ---\n";
}

// 3. Ver asesores
echo "\n👤 ASESORES:\n";
$asesores = Asesor::with('usuario')->get();
foreach ($asesores as $asesor) {
    echo "  ID: {$asesor->id}\n";
    echo "  Nombre: {$asesor->nombre} {$asesor->apellidos}\n";
    echo "  Estado: {$asesor->estado}\n";
    echo "  Clientes asignados: " . Cliente::where('asesor_id', $asesor->id)->count() . "\n";
    echo "  ---\n";
}

// 4. SOLUCIÓN: Asignar asesor a clientes que tienen cotizaciones pero no tienen asesor
echo "\n🔧 REPARACIÓN AUTOMÁTICA:\n";
$clientesSinAsesor = Cliente::whereNull('asesor_id')->get();
foreach ($clientesSinAsesor as $cliente) {
    // Buscar si tiene cotizaciones
    $cotizacion = Cotizacion::where('cliente_id', $cliente->id)
        ->whereNotNull('asesor_id')
        ->first();
    
    if ($cotizacion) {
        $cliente->update([
            'asesor_id' => $cotizacion->asesor_id,
            'estado' => 'interesado'
        ]);
        echo "  ✅ Cliente #{$cliente->id} asignado a Asesor #{$cotizacion->asesor_id}\n";
    }
}

echo "\n✅ Diagnóstico completado.\n";
