<?php
/**
 * Script de prueba para verificar que las rutas están correctas
 */

echo "🔍 Verificando rutas desde scripts-testing/\n\n";

// Verificar vendor/autoload.php
$vendorPath = __DIR__ . '/../vendor/autoload.php';
echo "1. vendor/autoload.php: ";
if (file_exists($vendorPath)) {
    echo "✅ EXISTE\n";
    echo "   Ruta: $vendorPath\n\n";
} else {
    echo "❌ NO EXISTE\n";
    echo "   Ruta buscada: $vendorPath\n\n";
}

// Verificar bootstrap/app.php
$bootstrapPath = __DIR__ . '/../bootstrap/app.php';
echo "2. bootstrap/app.php: ";
if (file_exists($bootstrapPath)) {
    echo "✅ EXISTE\n";
    echo "   Ruta: $bootstrapPath\n\n";
} else {
    echo "❌ NO EXISTE\n";
    echo "   Ruta buscada: $bootstrapPath\n\n";
}

// Intentar cargar Laravel
echo "3. Intentando cargar Laravel...\n";
try {
    require $vendorPath;
    echo "   ✅ vendor/autoload.php cargado\n";
    
    $app = require_once $bootstrapPath;
    echo "   ✅ bootstrap/app.php cargado\n";
    
    $app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();
    echo "   ✅ Laravel bootstrap ejecutado\n\n";
    
    echo "4. Probando modelo...\n";
    $count = \App\Models\User::count();
    echo "   ✅ Usuarios en DB: $count\n\n";
    
    echo "═══════════════════════════════════════\n";
    echo "✅ TODAS LAS RUTAS FUNCIONAN CORRECTAMENTE\n";
    echo "═══════════════════════════════════════\n";
    
} catch (\Exception $e) {
    echo "   ❌ ERROR: " . $e->getMessage() . "\n";
}
