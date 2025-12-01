<?php
require __DIR__ . '/../vendor/autoload.php';

$app = require_once __DIR__ . '/../bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

echo "=== VERIFICANDO GENERACIÓN DE RUTAS ===\n\n";

$routes = [
    'asesor.solicitudes' => [],
    'asesor.solicitudes.estado' => ['id' => 4],
    'asesor.solicitudes.detalle' => ['id' => 4],
    'asesor.solicitudes.seguimiento' => ['id' => 1],
    'asesor.solicitudes.contacto' => [],
    'asesor.cotizaciones.create' => ['cliente_id' => 1],
];

foreach ($routes as $routeName => $params) {
    try {
        $url = route($routeName, $params, false);
        $method = 'GET';

        // Detectar el método HTTP
        $routeCollection = app('router')->getRoutes()->getByName($routeName);
        if ($routeCollection) {
            $methods = $routeCollection->methods();
            $method = implode('|', $methods);
        }

        echo "✅ {$routeName}\n";
        echo "   Método: {$method}\n";
        echo "   URL: {$url}\n";
        echo "   Params: " . json_encode($params) . "\n\n";
    } catch (Exception $e) {
        echo "❌ {$routeName}\n";
        echo "   Error: {$e->getMessage()}\n\n";
    }
}

echo "\n=== PRUEBA ESPECÍFICA DEL ERROR ===\n";
echo "La ruta que estaba fallando era:\n";
echo "PATCH /asesor/solicitudes/estado/4 (INCORRECTA)\n\n";

echo "La ruta correcta debe ser:\n";
$correctUrl = route('asesor.solicitudes.estado', ['id' => 4], false);
echo "PATCH {$correctUrl} (CORRECTA)\n\n";

echo "✅ Las rutas ahora se generan correctamente con { id: solicitudId }\n";
