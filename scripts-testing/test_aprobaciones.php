<?php

require __DIR__ . '/../vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\Usuario;
use App\Models\Cliente;

// Buscar el cliente
$cliente = Cliente::with('usuario')->first();
if (!$cliente) {
    echo "❌ No hay clientes en la base de datos\n";
    exit(1);
}

echo "✅ Cliente encontrado:\n";
echo "   - Nombre: {$cliente->usuario->name}\n";
echo "   - Email: {$cliente->usuario->email}\n";
echo "   - ID Cliente: {$cliente->id}\n";
echo "   - Usuario ID: {$cliente->usuario_id}\n";
echo "   - Role: {$cliente->usuario->role}\n";
echo "   - Estado: " . ($cliente->usuario->estado ? 'Activo' : 'Inactivo') . "\n\n";

// Verificar aprobaciones pendientes
$pendientes = \App\Models\AuditoriaUsuario::where('cliente_afectado_id', $cliente->id)
    ->where('requiere_aprobacion', 'si')
    ->where('estado_aprobacion', 'pendiente')
    ->count();

echo "📋 Aprobaciones pendientes: {$pendientes}\n\n";

if ($pendientes > 0) {
    echo "✅ Para ver las aprobaciones:\n";
    echo "   1. Inicia sesión con: {$cliente->usuario->email}\n";
    echo "   2. Accede a: http://localhost/cliente/aprobaciones\n";
} else {
    echo "ℹ️  No hay aprobaciones pendientes. Ejecuta: php crear_acciones_prueba.php\n";
}
