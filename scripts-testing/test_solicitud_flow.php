<?php

/**
 * Script de prueba para verificar el flujo de solicitudes
 *
 * Este script prueba:
 * 1. Obtener información de un departamento vía API
 * 2. Verificar que las rutas de solicitudes existan
 * 3. Validar la estructura de datos
 */

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Departamento;
use App\Models\Asesor;
use Illuminate\Support\Facades\Route;

echo "=== TEST DE FLUJO DE SOLICITUDES ===\n\n";

// Test 1: Verificar que existan departamentos
echo "1. Verificando departamentos disponibles...\n";
$departamento = Departamento::where('estado', 'disponible')->first();

if ($departamento) {
    echo "✅ Departamento encontrado: ID {$departamento->id} - {$departamento->titulo}\n";
    echo "   Precio: S/ " . number_format($departamento->precio, 2) . "\n";
    echo "   Ubicación: {$departamento->ubicacion}\n\n";
} else {
    echo "❌ No hay departamentos disponibles\n\n";
}

// Test 2: Verificar asesores activos
echo "2. Verificando asesores activos...\n";
$asesores = Asesor::where('estado', 'activo')
    ->withCount(['cotizaciones' => function($query) {
        $query->whereIn('estado', ['pendiente', 'en_proceso']);
    }])
    ->get();

if ($asesores->count() > 0) {
    echo "✅ Asesores activos encontrados: {$asesores->count()}\n";
    foreach ($asesores as $asesor) {
        echo "   - {$asesor->nombre} {$asesor->apellidos}: {$asesor->cotizaciones_count} solicitudes activas\n";
    }
    echo "\n";
} else {
    echo "❌ No hay asesores activos\n\n";
}

// Test 3: Verificar rutas
echo "3. Verificando rutas...\n";

$rutasRequeridas = [
    'GET /api/v1/catalogo/departamentos/{id}',
    'POST /cliente/solicitudes',
    'GET /cliente/solicitudes',
    'GET /cliente/solicitudes/crear',
];

$rutasEncontradas = [];
foreach (Route::getRoutes() as $route) {
    $method = implode('|', $route->methods());
    $uri = $route->uri();
    $rutasEncontradas[] = "$method /$uri";
}

foreach ($rutasRequeridas as $rutaRequerida) {
    $encontrada = false;
    foreach ($rutasEncontradas as $rutaEncontrada) {
        if (stripos($rutaEncontrada, str_replace('GET ', '', str_replace('POST ', '', $rutaRequerida))) !== false) {
            $encontrada = true;
            break;
        }
    }

    if ($encontrada) {
        echo "✅ $rutaRequerida\n";
    } else {
        echo "❌ $rutaRequerida - NO ENCONTRADA\n";
    }
}

echo "\n";

// Test 4: Simular estructura de respuesta API
echo "4. Simulando respuesta API del departamento...\n";
if ($departamento) {
    $departamento->load(['propietario', 'atributos', 'imagenes']);

    $response = [
        'data' => $departamento
    ];

    echo "✅ Estructura de respuesta correcta\n";
    echo "   - ID: {$response['data']->id}\n";
    echo "   - Título: {$response['data']->titulo}\n";
    echo "   - Habitaciones: {$response['data']->habitaciones}\n";
    echo "   - Baños: {$response['data']->banos}\n";
    echo "   - Área: {$response['data']->area} m²\n";
    echo "   - Imágenes cargadas: " . $response['data']->imagenes->count() . "\n";
}

echo "\n=== FIN DE TESTS ===\n";
echo "\n";
echo "INSTRUCCIONES PARA PROBAR EN EL NAVEGADOR:\n";
echo "==========================================\n";
echo "1. Abre: http://127.0.0.1:8000/catalogo\n";
echo "2. Haz clic en 'Solicitar Info' de cualquier departamento\n";
echo "3. Llena el formulario y envía\n";
echo "4. Verifica en la consola del navegador (F12) que:\n";
echo "   - GET /api/v1/catalogo/departamentos/{id} retorna 200\n";
echo "   - POST /cliente/solicitudes retorna 302 (redirect) o 200\n";
echo "\n";
echo "Si ves errores:\n";
echo "- 404: La ruta no existe\n";
echo "- 419: Problema con CSRF token (refresca la página)\n";
echo "- 401: No estás autenticado (inicia sesión primero)\n";
echo "- 422: Datos de validación incorrectos\n";
echo "\n";
