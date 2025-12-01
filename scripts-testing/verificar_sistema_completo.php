<?php
require __DIR__ . '/../vendor/autoload.php';

$app = require_once __DIR__ . '/../bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

try {
    echo "=== VERIFICACIÓN COMPLETA DEL SISTEMA DE SOLICITUDES ===\n\n";

    // 1. Verificar usuario asesor
    echo "1️⃣ VERIFICANDO ASESORES EN EL SISTEMA\n";
    $asesores = \App\Models\Asesor::with('usuario')->get();
    foreach ($asesores as $asesor) {
        $user = $asesor->usuario;
        echo "  ✅ Asesor ID {$asesor->id}: {$asesor->nombre}";
        if ($user) {
            echo " - Usuario: {$user->email} (Role: {$user->role})";
        }
        echo "\n";
    }

    // 2. Verificar clientes
    echo "\n2️⃣ VERIFICANDO CLIENTES EN EL SISTEMA\n";
    $clientes = \App\Models\Cliente::all();
    foreach ($clientes as $cliente) {
        echo "  ✅ Cliente ID {$cliente->id}: {$cliente->nombre} ({$cliente->email}) - Estado: {$cliente->estado}\n";
    }

    // 3. Verificar cotizaciones (solicitudes)
    echo "\n3️⃣ VERIFICANDO COTIZACIONES (SOLICITUDES)\n";
    $cotizaciones = \App\Models\Cotizacion::with(['cliente', 'asesor', 'departamento'])->get();
    foreach ($cotizaciones as $cot) {
        echo "  📋 Cotización ID {$cot->id}\n";
        echo "     Cliente: " . ($cot->cliente ? $cot->cliente->nombre : 'N/A') . "\n";
        echo "     Asesor: " . ($cot->asesor ? $cot->asesor->nombre : 'N/A') . "\n";
        echo "     Departamento: " . ($cot->departamento ? "ID {$cot->departamento->id}" : 'N/A') . "\n";
        echo "     Estado: {$cot->estado}\n";
        echo "     Fecha: {$cot->created_at}\n\n";
    }

    // 4. Verificar departamentos disponibles
    echo "4️⃣ VERIFICANDO DEPARTAMENTOS DISPONIBLES\n";
    $departamentos = \App\Models\Departamento::where('estado', 'disponible')->count();
    echo "  🏢 Departamentos disponibles: {$departamentos}\n";

    // 5. Simular datos del controlador
    echo "\n5️⃣ SIMULANDO DATOS DEL CONTROLADOR\n";
    if ($asesores->count() > 0) {
        $asesorTest = $asesores->first();

        $solicitudes = \App\Models\Cotizacion::with([
            'cliente.usuario',
            'departamento.imagenes' => function ($q) {
                $q->where('activa', true)->orderBy('orden')->limit(1);
            }
        ])
            ->where('asesor_id', $asesorTest->id)
            ->whereHas('cliente', function ($query) {
                $query->whereNotNull('nombre')->where('nombre', '!=', '');
            })
            ->get();

        echo "  📊 Solicitudes del asesor {$asesorTest->nombre}: {$solicitudes->count()}\n";

        $pendientes = $solicitudes->where('estado', 'pendiente')->values();
        $enProceso = $solicitudes->where('estado', 'en_proceso')->values();
        $aprobadas = $solicitudes->whereIn('estado', ['aprobada', 'aceptada'])->values();
        $rechazadas = $solicitudes->whereIn('estado', ['rechazada', 'cancelada'])->values();

        echo "     ⏳ Pendientes: {$pendientes->count()}\n";
        echo "     🔄 En Proceso: {$enProceso->count()}\n";
        echo "     ✅ Aprobadas: {$aprobadas->count()}\n";
        echo "     ❌ Rechazadas: {$rechazadas->count()}\n";
    }

    // 6. Verificar rutas disponibles
    echo "\n6️⃣ VERIFICANDO RUTAS PRINCIPALES\n";
    $routesToTest = [
        'asesor.solicitudes' => [],
        'asesor.solicitudes.estado' => ['id' => 1],
        'asesor.solicitudes.contacto' => [],
        'asesor.dashboard' => [],
    ];

    foreach ($routesToTest as $routeName => $params) {
        try {
            $url = route($routeName, $params, false);
            echo "  ✅ {$routeName}: {$url}\n";
        } catch (Exception $e) {
            echo "  ❌ {$routeName}: Error - {$e->getMessage()}\n";
        }
    }

    // 7. Resumen final
    echo "\n" . str_repeat('=', 60) . "\n";
    echo "📊 RESUMEN FINAL\n";
    echo str_repeat('=', 60) . "\n";

    $status = 'FUNCIONANDO';
    $statusIcon = '✅';

    if ($asesores->count() == 0) {
        $status = 'SIN ASESORES';
        $statusIcon = '❌';
    } elseif ($clientes->count() == 0) {
        $status = 'SIN CLIENTES';
        $statusIcon = '⚠️';
    } elseif ($cotizaciones->count() == 0) {
        $status = 'SIN SOLICITUDES';
        $statusIcon = '⚠️';
    }

    echo "{$statusIcon} Estado del sistema: {$status}\n";
    echo "👨‍💼 Asesores: {$asesores->count()}\n";
    echo "👤 Clientes: {$clientes->count()}\n";
    echo "📋 Solicitudes: {$cotizaciones->count()}\n";
    echo "🏢 Departamentos disponibles: {$departamentos}\n";
    echo str_repeat('=', 60) . "\n";

    if ($status === 'FUNCIONANDO') {
        echo "\n🎉 El sistema está listo para usar!\n";
        echo "Puedes acceder a:\n";
        echo "  - Panel de Asesor: " . route('asesor.dashboard', [], false) . "\n";
        echo "  - Solicitudes: " . route('asesor.solicitudes', [], false) . "\n";
    } else {
        echo "\n⚠️ El sistema necesita configuración adicional.\n";
    }

} catch (Exception $e) {
    echo "\n❌ ERROR CRÍTICO: " . $e->getMessage() . "\n";
    echo "Archivo: " . $e->getFile() . "\n";
    echo "Línea: " . $e->getLine() . "\n";
}
