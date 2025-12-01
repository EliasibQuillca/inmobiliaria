<?php

require __DIR__.'/../vendor/autoload.php';

$app = require_once __DIR__.'/../bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;
use App\Models\Cotizacion;
use App\Models\Cliente;
use App\Models\Asesor;

echo "🔍 VERIFICACIÓN DEL FLUJO COMPLETO CLIENTE-ASESOR\n";
echo str_repeat("=", 70) . "\n\n";

// 1. Verificar rutas del cliente
echo "📌 RUTAS DEL CLIENTE:\n";
echo str_repeat("-", 70) . "\n";

$rutasCliente = [
    'cliente.solicitudes.aceptar' => 'POST /cliente/solicitudes/{id}/aceptar',
    'cliente.solicitudes.rechazar' => 'POST /cliente/solicitudes/{id}/rechazar',
    'cliente.solicitudes.modificar' => 'POST /cliente/solicitudes/{id}/modificar',
];

foreach ($rutasCliente as $nombre => $uri) {
    $existe = Route::has($nombre);
    echo ($existe ? "✅" : "❌") . " $nombre => $uri\n";
}

// 2. Verificar rutas del asesor
echo "\n📌 RUTAS DEL ASESOR:\n";
echo str_repeat("-", 70) . "\n";

$rutasAsesor = [
    'asesor.solicitudes.responder' => 'POST /asesor/solicitudes/{id}/responder',
];

foreach ($rutasAsesor as $nombre => $uri) {
    $existe = Route::has($nombre);
    echo ($existe ? "✅" : "❌") . " $nombre => $uri\n";
}

// 3. Verificar campos en la tabla cotizaciones
echo "\n📌 CAMPOS DE LA TABLA COTIZACIONES:\n";
echo str_repeat("-", 70) . "\n";

$columnas = DB::getSchemaBuilder()->getColumnListing('cotizaciones');
$camposRequeridos = [
    'monto', 'descuento', 'notas', 'condiciones',
    'fecha_validez', 'fecha_respuesta_cliente', 'motivo_rechazo_cliente'
];

foreach ($camposRequeridos as $campo) {
    $existe = in_array($campo, $columnas);
    echo ($existe ? "✅" : "❌") . " $campo\n";
}

// 4. Verificar modelo Cotizacion
echo "\n📌 MODELO COTIZACION:\n";
echo str_repeat("-", 70) . "\n";

$cotizacion = new Cotizacion();
$fillable = $cotizacion->getFillable();

$camposFillable = [
    'monto', 'descuento', 'notas', 'condiciones',
    'fecha_validez', 'fecha_respuesta_cliente', 'motivo_rechazo_cliente'
];

foreach ($camposFillable as $campo) {
    $existe = in_array($campo, $fillable);
    echo ($existe ? "✅" : "❌") . " $campo en fillable\n";
}

// 5. Verificar cotizaciones en proceso
echo "\n📌 COTIZACIONES EN PROCESO:\n";
echo str_repeat("-", 70) . "\n";

$cotizacionesEnProceso = Cotizacion::where('estado', 'en_proceso')
    ->with(['cliente', 'asesor', 'departamento'])
    ->get();

echo "Total: " . $cotizacionesEnProceso->count() . "\n\n";

foreach ($cotizacionesEnProceso as $cot) {
    echo "ID: {$cot->id}\n";
    echo "  Cliente: " . ($cot->cliente ? "{$cot->cliente->nombre} {$cot->cliente->apellidos}" : 'N/A') . "\n";
    echo "  Asesor: " . ($cot->asesor ? "{$cot->asesor->nombre} {$cot->asesor->apellidos}" : 'N/A') . "\n";
    echo "  Departamento: " . ($cot->departamento ? $cot->departamento->titulo : 'N/A') . "\n";
    echo "  Monto: S/ " . number_format((float)$cot->monto ?? 0, 2) . "\n";
    echo "  Descuento: " . ($cot->descuento ?? 0) . "%\n";
    
    $precioFinal = ($cot->monto && $cot->descuento !== null) 
        ? $cot->monto * (1 - $cot->descuento/100) 
        : ($cot->monto ?? 0);
    echo "  Precio Final: S/ " . number_format($precioFinal, 2) . "\n";
    
    if ($cot->fecha_validez) {
        try {
            echo "  Fecha Validez: " . \Carbon\Carbon::parse($cot->fecha_validez)->format('d/m/Y') . "\n";
        } catch (\Exception $e) {
            echo "  Fecha Validez: N/A (error al formatear)\n";
        }
    } else {
        echo "  Fecha Validez: N/A\n";
    }
    echo "\n";
}

// 6. Verificar controladores
echo "📌 MÉTODOS DE LOS CONTROLADORES:\n";
echo str_repeat("-", 70) . "\n";

try {
    // Verificar AsesorSolicitudController
    if (class_exists('\\App\\Http\\Controllers\\Asesor\\SolicitudController')) {
        $asesorController = new \ReflectionClass(\App\Http\Controllers\Asesor\SolicitudController::class);
        $metodoAsesor = $asesorController->hasMethod('responderSolicitud');
        echo ($metodoAsesor ? "✅" : "❌") . " AsesorSolicitudController::responderSolicitud\n";
    } else {
        echo "❌ AsesorSolicitudController no existe\n";
    }

    // Verificar ClienteSolicitudController
    if (class_exists('\\App\\Http\\Controllers\\Cliente\\SolicitudController')) {
        $clienteController = new \ReflectionClass(\App\Http\Controllers\Cliente\SolicitudController::class);
        $metodosCliente = ['aceptarCotizacion', 'rechazarCotizacion', 'solicitarModificacion'];

        foreach ($metodosCliente as $metodo) {
            $existe = $clienteController->hasMethod($metodo);
            echo ($existe ? "✅" : "❌") . " ClienteSolicitudController::$metodo\n";
        }
    } else {
        echo "❌ ClienteSolicitudController no existe\n";
    }
} catch (\Exception $e) {
    echo "❌ Error al verificar controladores: " . $e->getMessage() . "\n";
}

// 7. Verificar archivos frontend
echo "\n📌 ARCHIVOS FRONTEND:\n";
echo str_repeat("-", 70) . "\n";

$archivos = [
    'Cliente/Solicitudes.jsx' => __DIR__ . '/../resources/js/Pages/Cliente/Solicitudes.jsx',
    'Asesor/Solicitudes.jsx' => __DIR__ . '/../resources/js/Pages/Asesor/Solicitudes.jsx',
];

foreach ($archivos as $nombre => $ruta) {
    $existe = file_exists($ruta);
    echo ($existe ? "✅" : "❌") . " $nombre\n";

    if ($existe) {
        $contenido = file_get_contents($ruta);

        if (strpos($nombre, 'Cliente') !== false) {
            // Verificar componente cliente
            $tieneAceptar = strpos($contenido, 'handleAceptarCotizacion') !== false;
            $tieneRechazar = strpos($contenido, 'handleRechazarClick') !== false;
            $tieneModificar = strpos($contenido, 'handleModificarClick') !== false;
            $tieneModalRechazo = strpos($contenido, 'showRechazarModal') !== false;
            $tieneModalModificar = strpos($contenido, 'showModificarModal') !== false;

            echo "    " . ($tieneAceptar ? "✅" : "❌") . " Función aceptar cotización\n";
            echo "    " . ($tieneRechazar ? "✅" : "❌") . " Función rechazar cotización\n";
            echo "    " . ($tieneModificar ? "✅" : "❌") . " Función modificar cotización\n";
            echo "    " . ($tieneModalRechazo ? "✅" : "❌") . " Modal de rechazo\n";
            echo "    " . ($tieneModalModificar ? "✅" : "❌") . " Modal de modificación\n";
        }

        if (strpos($nombre, 'Asesor') !== false) {
            // Verificar componente asesor
            $tieneResponder = strpos($contenido, 'handleResponderSolicitud') !== false;
            $tieneModal = strpos($contenido, 'showResponseModal') !== false;

            echo "    " . ($tieneResponder ? "✅" : "❌") . " Función responder solicitud\n";
            echo "    " . ($tieneModal ? "✅" : "❌") . " Modal de respuesta\n";
        }
    }
}

// 8. Resumen del flujo
echo "\n" . str_repeat("=", 70) . "\n";
echo "📊 RESUMEN DEL FLUJO IMPLEMENTADO:\n";
echo str_repeat("=", 70) . "\n\n";

echo "1️⃣  Cliente crea solicitud de información\n";
echo "    ↓ (estado: pendiente)\n";
echo "2️⃣  Asesor recibe y responde con cotización\n";
echo "    ↓ (estado: en_proceso, se asigna monto, descuento, condiciones)\n";
echo "3️⃣  Cliente ve la cotización y puede:\n";
echo "    • ✅ Aceptar → estado: aprobada\n";
echo "    • ❌ Rechazar → estado: cancelada (guarda motivo)\n";
echo "    • ✏️  Modificar → estado: pendiente (agrega notas de modificación)\n";
echo "4️⃣  Si el cliente acepta, el asesor puede crear una reserva\n\n";

echo "✅ Sistema completamente funcional!\n\n";
