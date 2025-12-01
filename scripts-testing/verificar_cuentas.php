<?php

require_once __DIR__ . '/../vendor/autoload.php';

$app = require_once __DIR__ . '/../bootstrap/app.php';
$app->boot();

echo "\n=== VERIFICANDO CUENTAS CREADAS ===\n\n";

$users = \App\Models\User::with(['asesor', 'cliente'])->get();

foreach($users as $user) {
    echo "🔐 " . strtoupper($user->role) . ": " . $user->email . " - " . $user->name . "\n";
    
    if($user->role === 'asesor' && $user->asesor) {
        echo "   📊 Asesor ID: " . $user->asesor->id . " - Comisión: " . $user->asesor->comision_porcentaje . "%\n";
    }
    
    if($user->role === 'cliente' && $user->cliente) {
        echo "   👤 Cliente ID: " . $user->cliente->id . " - DNI: " . $user->cliente->dni . "\n";
    }
}

echo "\n=== DEPARTAMENTOS DISPONIBLES ===\n\n";

$departamentos = \App\Models\Departamento::all();

foreach($departamentos as $dep) {
    $estado_emoji = match($dep->estado) {
        'disponible' => '✅',
        'reservado' => '🟡',
        'vendido' => '🔴',
        default => '❓'
    };
    
    echo $estado_emoji . " " . $dep->codigo . ": " . $dep->titulo . "\n";
    echo "   💰 Precio: S/ " . number_format($dep->precio, 2) . " - Estado: " . $dep->estado . "\n";
    echo "   🏠 " . $dep->habitaciones . " hab, " . $dep->banos . " baños - " . $dep->ubicacion . "\n\n";
}

echo "=== RESUMEN ===\n";
echo "👥 Usuarios: " . $users->count() . "\n";
echo "🏢 Departamentos: " . $departamentos->count() . "\n";
echo "✅ Disponibles: " . $departamentos->where('estado', 'disponible')->count() . "\n";
echo "🟡 Reservados: " . $departamentos->where('estado', 'reservado')->count() . "\n";
echo "🔴 Vendidos: " . $departamentos->where('estado', 'vendido')->count() . "\n";

?>