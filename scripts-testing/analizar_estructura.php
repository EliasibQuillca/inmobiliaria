<?php

require __DIR__.'/../vendor/autoload.php';

$app = require_once __DIR__.'/../bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "═══════════════════════════════════════════════════════════════\n";
echo "ANÁLISIS DE ESTRUCTURA: CLIENTE Y ASESOR\n";
echo "═══════════════════════════════════════════════════════════════\n\n";

// ===== ANÁLISIS DE TABLA CLIENTES =====
echo "📊 TABLA: clientes\n";
echo "─────────────────────────────────────────────────────────────────\n";

try {
    $columns = DB::select("DESCRIBE clientes");

    echo "CAMPOS:\n";
    foreach ($columns as $column) {
        echo sprintf("  %-30s %-20s %s %s\n",
            $column->Field,
            $column->Type,
            $column->Null === 'YES' ? 'NULL' : 'NOT NULL',
            $column->Key === 'PRI' ? '🔑 PRIMARY' : ($column->Key === 'MUL' ? '🔗 FOREIGN' : '')
        );
    }

    echo "\n📊 ESTADÍSTICAS:\n";
    $totalClientes = DB::table('clientes')->count();
    $conUsuario = DB::table('clientes')->whereNotNull('usuario_id')->count();
    $sinUsuario = DB::table('clientes')->whereNull('usuario_id')->count();
    $conAsesor = DB::table('clientes')->whereNotNull('asesor_id')->count();
    $sinAsesor = DB::table('clientes')->whereNull('asesor_id')->count();

    echo "  Total Clientes: $totalClientes\n";
    echo "  Con usuario_id: $conUsuario\n";
    echo "  Sin usuario_id: $sinUsuario (clientes registrados por asesor)\n";
    echo "  Con asesor_id: $conAsesor\n";
    echo "  Sin asesor_id: $sinAsesor\n";

    echo "\n📋 ESTADOS:\n";
    $estados = DB::table('clientes')
        ->select('estado', DB::raw('COUNT(*) as total'))
        ->groupBy('estado')
        ->get();

    foreach ($estados as $estado) {
        echo "  $estado->estado: $estado->total\n";
    }

    echo "\n💼 DISTRIBUCIÓN POR ASESOR:\n";
    $porAsesor = DB::table('clientes')
        ->join('asesores', 'clientes.asesor_id', '=', 'asesores.id')
        ->select('asesores.nombre', 'asesores.apellidos', DB::raw('COUNT(clientes.id) as total'))
        ->groupBy('asesores.id', 'asesores.nombre', 'asesores.apellidos')
        ->get();

    foreach ($porAsesor as $asesor) {
        echo "  {$asesor->nombre} {$asesor->apellidos}: {$asesor->total} clientes\n";
    }

} catch (\Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
}

echo "\n═══════════════════════════════════════════════════════════════\n\n";

// ===== ANÁLISIS DE TABLA ASESORES =====
echo "📊 TABLA: asesores\n";
echo "─────────────────────────────────────────────────────────────────\n";

try {
    $columns = DB::select("DESCRIBE asesores");

    echo "CAMPOS:\n";
    foreach ($columns as $column) {
        echo sprintf("  %-30s %-20s %s %s\n",
            $column->Field,
            $column->Type,
            $column->Null === 'YES' ? 'NULL' : 'NOT NULL',
            $column->Key === 'PRI' ? '🔑 PRIMARY' : ($column->Key === 'MUL' ? '🔗 FOREIGN' : '')
        );
    }

    echo "\n📊 ESTADÍSTICAS:\n";
    $totalAsesores = DB::table('asesores')->count();
    $activos = DB::table('asesores')->where('estado', 'activo')->count();
    $inactivos = DB::table('asesores')->where('estado', 'inactivo')->count();

    echo "  Total Asesores: $totalAsesores\n";
    echo "  Activos: $activos\n";
    echo "  Inactivos: $inactivos\n";

    echo "\n👤 ASESORES REGISTRADOS:\n";
    $asesores = DB::table('asesores')
        ->join('users', 'asesores.usuario_id', '=', 'users.id')
        ->select('asesores.*', 'users.email')
        ->get();

    foreach ($asesores as $asesor) {
        echo "  ID: {$asesor->id} | {$asesor->nombre} {$asesor->apellidos}\n";
        echo "    Email: {$asesor->email}\n";
        echo "    Estado: {$asesor->estado}\n";
        echo "    Comisión: " . ($asesor->comision_porcentaje ?? 'No definida') . "%\n";

        // Contar recursos del asesor
        $numClientes = DB::table('clientes')->where('asesor_id', $asesor->id)->count();
        $numSolicitudes = DB::table('solicitudes')->where('asesor_id', $asesor->id)->count();
        $numCotizaciones = DB::table('cotizaciones')->where('asesor_id', $asesor->id)->count();
        $numReservas = DB::table('reservas')->where('asesor_id', $asesor->id)->count();

        echo "    📊 Recursos:\n";
        echo "       - Clientes: $numClientes\n";
        echo "       - Solicitudes: $numSolicitudes\n";
        echo "       - Cotizaciones: $numCotizaciones\n";
        echo "       - Reservas: $numReservas\n";
        echo "\n";
    }

} catch (\Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
}

echo "\n═══════════════════════════════════════════════════════════════\n\n";

// ===== ANÁLISIS DE TABLA SOLICITUDES =====
echo "📊 TABLA: solicitudes\n";
echo "─────────────────────────────────────────────────────────────────\n";

try {
    $columns = DB::select("DESCRIBE solicitudes");

    echo "CAMPOS:\n";
    foreach ($columns as $column) {
        echo sprintf("  %-30s %-20s %s %s\n",
            $column->Field,
            $column->Type,
            $column->Null === 'YES' ? 'NULL' : 'NOT NULL',
            $column->Key === 'PRI' ? '🔑 PRIMARY' : ($column->Key === 'MUL' ? '🔗 FOREIGN' : '')
        );
    }

    echo "\n📊 ESTADÍSTICAS DE SOLICITUDES:\n";
    $totalSolicitudes = DB::table('solicitudes')->count();
    echo "  Total Solicitudes: $totalSolicitudes\n";

    if ($totalSolicitudes > 0) {
        echo "\n📋 ESTADOS:\n";
        $estadosSolicitudes = DB::table('solicitudes')
            ->select('estado', DB::raw('COUNT(*) as total'))
            ->groupBy('estado')
            ->get();

        foreach ($estadosSolicitudes as $estado) {
            echo "  $estado->estado: $estado->total\n";
        }

        echo "\n📝 SOLICITUDES DETALLADAS:\n";
        $solicitudes = DB::table('solicitudes')
            ->join('clientes', 'solicitudes.cliente_id', '=', 'clientes.id')
            ->join('asesores', 'solicitudes.asesor_id', '=', 'asesores.id')
            ->join('departamentos', 'solicitudes.departamento_id', '=', 'departamentos.id')
            ->select(
                'solicitudes.id',
                'solicitudes.estado',
                'solicitudes.tipo_consulta',
                'clientes.nombre as cliente_nombre',
                'asesores.nombre as asesor_nombre',
                'departamentos.codigo as depto_codigo',
                'solicitudes.created_at'
            )
            ->get();

        foreach ($solicitudes as $sol) {
            echo "  ID: {$sol->id} | Estado: {$sol->estado}\n";
            echo "    Cliente: {$sol->cliente_nombre}\n";
            echo "    Asesor: {$sol->asesor_nombre}\n";
            echo "    Departamento: {$sol->depto_codigo}\n";
            echo "    Tipo: {$sol->tipo_consulta}\n";
            echo "    Fecha: {$sol->created_at}\n\n";
        }
    }

} catch (\Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
}

echo "═══════════════════════════════════════════════════════════════\n";
echo "✅ ANÁLISIS COMPLETADO\n";
echo "═══════════════════════════════════════════════════════════════\n";
