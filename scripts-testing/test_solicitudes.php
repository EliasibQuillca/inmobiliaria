<?php
require __DIR__ . '/../vendor/autoload.php';

$app = require_once __DIR__ . '/../bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

try {
    echo "=== VERIFICANDO ESTADO DEL SISTEMA DE SOLICITUDES ===\n\n";

    // Verificar conexión a la base de datos
    $pdo = \Illuminate\Support\Facades\DB::connection()->getPdo();
    echo "✅ Conexión a la base de datos: OK\n";

    // Verificar modelos principales
    $cotizacionesCount = \App\Models\Cotizacion::count();
    echo "📊 Total de cotizaciones: {$cotizacionesCount}\n";

    $asesoresCount = \App\Models\Asesor::count();
    echo "👨‍💼 Total de asesores: {$asesoresCount}\n";

    $clientesCount = \App\Models\Cliente::count();
    echo "👤 Total de clientes: {$clientesCount}\n";

    // Verificar cotizaciones con relaciones
    $cotizacionesConRelaciones = \App\Models\Cotizacion::with(['cliente', 'asesor', 'departamento'])
        ->take(5)
        ->get();

    echo "\n=== PRIMERAS 5 COTIZACIONES ===\n";
    foreach ($cotizacionesConRelaciones as $cotizacion) {
        echo "ID: {$cotizacion->id} | ";
        echo "Cliente: " . ($cotizacion->cliente ? $cotizacion->cliente->nombre : 'N/A') . " | ";
        echo "Asesor: " . ($cotizacion->asesor ? $cotizacion->asesor->nombre : 'N/A') . " | ";
        echo "Estado: {$cotizacion->estado} | ";
        echo "Fecha: {$cotizacion->created_at}\n";
    }

    // Verificar rutas importantes
    echo "\n=== VERIFICANDO RUTAS ===\n";
    $routes = [
        'asesor.solicitudes',
        'asesor.solicitudes.estado',
        'asesor.solicitudes.contacto'
    ];

    foreach ($routes as $routeName) {
        try {
            $url = route($routeName, ['id' => 1], false);
            echo "✅ Ruta '{$routeName}': {$url}\n";
        } catch (Exception $e) {
            echo "❌ Error en ruta '{$routeName}': {$e->getMessage()}\n";
        }
    }

    echo "\n=== RESUMEN ===\n";
    echo "Estado del sistema: ";
    if ($cotizacionesCount > 0 && $asesoresCount > 0 && $clientesCount > 0) {
        echo "✅ FUNCIONANDO - Datos disponibles\n";
    } elseif ($asesoresCount > 0) {
        echo "⚠️ PARCIAL - Faltan cotizaciones/clientes\n";
    } else {
        echo "❌ PROBLEMA - Faltan datos básicos\n";
    }

} catch (Exception $e) {
    echo "❌ ERROR: " . $e->getMessage() . "\n";
    echo "Archivo: " . $e->getFile() . " Línea: " . $e->getLine() . "\n";
}
