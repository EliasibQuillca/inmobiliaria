<?php

require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\Cliente;
use App\Models\Asesor;
use App\Models\AuditoriaUsuario;

// Buscar un cliente
$cliente = Cliente::with('usuario')->first();
if (!$cliente) {
    echo "❌ No hay clientes registrados\n";
    exit(1);
}

// Buscar un asesor
$asesor = Asesor::with('usuario')->first();
if (!$asesor) {
    echo "❌ No hay asesores registrados\n";
    exit(1);
}

echo "✅ Cliente encontrado: {$cliente->usuario->name} (ID: {$cliente->id})\n";
echo "✅ Asesor encontrado: {$asesor->usuario->name} (ID: {$asesor->id})\n\n";

// Crear algunas acciones de prueba
$acciones = [
    [
        'titulo' => 'Cotización creada para Departamento en Miraflores',
        'descripcion' => 'Se ha creado una cotización con precio especial de S/. 450,000.00 (descuento del 5% aplicado). Válida hasta el 15/12/2025.',
        'prioridad' => 'alta',
        'detalles' => [
            'precio_original' => 475000,
            'precio_con_descuento' => 450000,
            'descuento_porcentaje' => 5,
            'validez_hasta' => '2025-12-15',
            'departamento' => 'Miraflores - 3 dormitorios'
        ]
    ],
    [
        'titulo' => 'Reserva registrada con pago inicial',
        'descripcion' => 'Se ha registrado una reserva con pago inicial de S/. 10,000.00. Periodo de reserva: 30 días. Monto total del departamento: S/. 420,000.00',
        'prioridad' => 'urgente',
        'detalles' => [
            'monto_reserva' => 10000,
            'periodo_dias' => 30,
            'monto_total' => 420000,
            'fecha_vencimiento' => '2025-12-30'
        ]
    ],
    [
        'titulo' => 'Venta registrada y documentación iniciada',
        'descripcion' => 'Se ha registrado la venta del departamento por S/. 450,000.00. Comisión: S/. 13,500.00 (3%). Documentos en proceso de preparación.',
        'prioridad' => 'urgente',
        'detalles' => [
            'monto_final' => 450000,
            'comision' => 13500,
            'documentos_entregados' => false,
            'estado_documentacion' => 'En preparación'
        ]
    ]
];

foreach ($acciones as $index => $accionData) {
    $accion = AuditoriaUsuario::create([
        'usuario_id' => $asesor->usuario_id,
        'cliente_afectado_id' => $cliente->id,
        'accion' => 'accion_asesor_' . ($index + 1),
        'modelo_tipo' => 'App\\Models\\Cotizacion',
        'modelo_id' => null,
        'titulo' => $accionData['titulo'],
        'descripcion' => $accionData['descripcion'],
        'requiere_aprobacion' => 'si',
        'estado_aprobacion' => 'pendiente',
        'prioridad' => $accionData['prioridad'],
        'detalles' => json_encode($accionData['detalles']),
        'notificado' => false,
    ]);
    
    echo "✅ Acción creada: {$accion->titulo} (Prioridad: {$accion->prioridad})\n";
}

echo "\n🎉 Se crearon 3 acciones pendientes de aprobación\n";
echo "👉 Accede como cliente a: http://localhost/cliente/aprobaciones\n";
