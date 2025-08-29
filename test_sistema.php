<?php

/**
 * Script de Pruebas del Sistema Inmobiliario
 * Verifica que todas las funcionalidades principales están funcionando
 */

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\DB;

echo "🚀 SISTEMA DE PRUEBAS INMOBILIARIO\n";
echo "==================================\n\n";

$passed = 0;
$failed = 0;

// Función helper para pruebas
function test($description, $condition, &$passed, &$failed) {
    echo "🧪 {$description}... ";
    if ($condition) {
        echo "✅ PASÓ\n";
        $passed++;
    } else {
        echo "❌ FALLÓ\n";
        $failed++;
    }
}

// Verificar rutas registradas
echo "📋 VERIFICANDO RUTAS\n";
echo "-------------------\n";

$routes = collect(Route::getRoutes())->map(function ($route) {
    return $route->getName();
})->filter()->toArray();

test("Ruta 'login' registrada", in_array('login', $routes), $passed, $failed);
test("Ruta 'catalogo.index' registrada", in_array('catalogo.index', $routes), $passed, $failed);
test("Ruta 'catalogo.show' registrada", in_array('catalogo.show', $routes), $passed, $failed);

echo "\n";

// Verificar archivos críticos
echo "📁 VERIFICANDO ARCHIVOS CRÍTICOS\n";
echo "--------------------------------\n";

$files = [
    'resources/js/Pages/Auth/Login.jsx' => 'Componente Login de Inertia',
    'resources/js/utils/csrf.js' => 'Utilidad CSRF',
    'app/Http/Middleware/HandleCsrfToken.php' => 'Middleware CSRF personalizado',
    'resources/js/Pages/Public/Catalogo.jsx' => 'Página de catálogo público',
    'resources/js/Pages/Public/DetalleDepartamento.jsx' => 'Página de detalle de departamento',
    'app/Models/Departamento.php' => 'Modelo Departamento',
    'app/Models/Imagen.php' => 'Modelo Imagen',
];

foreach ($files as $file => $description) {
    test($description, File::exists(base_path($file)), $passed, $failed);
}

echo "\n";

// Verificar base de datos
echo "🗄️ VERIFICANDO BASE DE DATOS\n";
echo "-----------------------------\n";

try {
    DB::connection()->getPdo();
    test("Conexión a base de datos", true, $passed, $failed);
    
    // Verificar tablas importantes
    $tables = DB::select("SHOW TABLES LIKE 'departamentos'");
    test("Tabla 'departamentos' existe", count($tables) > 0, $passed, $failed);
    
    $tables = DB::select("SHOW TABLES LIKE 'imagenes'");
    test("Tabla 'imagenes' existe", count($tables) > 0, $passed, $failed);
    
    $tables = DB::select("SHOW TABLES LIKE 'users'");
    test("Tabla 'users' existe", count($tables) > 0, $passed, $failed);
    
} catch (Exception $e) {
    test("Conexión a base de datos", false, $passed, $failed);
    echo "   Error: " . $e->getMessage() . "\n";
}

echo "\n";

// Verificar configuración
echo "⚙️ VERIFICANDO CONFIGURACIÓN\n";
echo "-----------------------------\n";

test("Driver de sesión configurado", config('session.driver') === 'database', $passed, $failed);
test("Tiempo de sesión configurado", config('session.lifetime') == 120, $passed, $failed);
test("Aplicación en modo debug", config('app.debug') === true, $passed, $failed);

echo "\n";

// Resumen
echo "📊 RESUMEN DE PRUEBAS\n";
echo "====================\n";
echo "✅ Pruebas que pasaron: {$passed}\n";
echo "❌ Pruebas que fallaron: {$failed}\n";
echo "📈 Total de pruebas: " . ($passed + $failed) . "\n\n";

if ($failed === 0) {
    echo "🎉 ¡TODAS LAS PRUEBAS PASARON!\n";
    echo "✨ El sistema está funcionando correctamente.\n";
    exit(0);
} else {
    echo "⚠️ ALGUNAS PRUEBAS FALLARON\n";
    echo "🔧 Revisa los errores arriba para solucionarlos.\n";
    exit(1);
}
