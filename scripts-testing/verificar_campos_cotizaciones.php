<?php
require __DIR__ . '/../vendor/autoload.php';

$app = require_once __DIR__ . '/../bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use Illuminate\Support\Facades\Schema;

echo "=== ESTRUCTURA DE LA TABLA COTIZACIONES ===\n\n";

$columns = Schema::getColumnListing('cotizaciones');

echo "Columnas actuales:\n";
foreach ($columns as $column) {
    echo "  - {$column}\n";
}

echo "\n=== VERIFICANDO CAMPOS NECESARIOS ===\n\n";

$camposNecesarios = [
    'fecha_respuesta_cliente',
    'motivo_rechazo_cliente',
];

foreach ($camposNecesarios as $campo) {
    $existe = in_array($campo, $columns);
    $icon = $existe ? '✅' : '❌';
    $status = $existe ? 'EXISTE' : 'NO EXISTE (necesita crearse)';
    echo "{$icon} {$campo}: {$status}\n";
}

echo "\n=== CAMPOS RELACIONADOS CON RESPUESTA DEL CLIENTE ===\n";
$camposRelacionados = array_filter($columns, function($col) {
    return strpos($col, 'cliente') !== false ||
           strpos($col, 'respuesta') !== false ||
           strpos($col, 'rechazo') !== false ||
           strpos($col, 'motivo') !== false;
});

if (count($camposRelacionados) > 0) {
    echo "Campos encontrados:\n";
    foreach ($camposRelacionados as $campo) {
        echo "  ✓ {$campo}\n";
    }
} else {
    echo "No se encontraron campos relacionados.\n";
}
