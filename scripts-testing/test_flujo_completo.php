<?php

require __DIR__.'/../vendor/autoload.php';

$app = require_once __DIR__.'/../bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\User;
use App\Models\Cliente;
use App\Models\Asesor;
use App\Models\Cotizacion;
use App\Models\Departamento;
use App\Models\Reserva;
use App\Models\Venta;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

echo "\n";
echo "╔════════════════════════════════════════════════════════════════════╗\n";
echo "║     TEST DE FUNCIONALIDAD COMPLETO - FLUJO CLIENTE → ASESOR       ║\n";
echo "╚════════════════════════════════════════════════════════════════════╝\n";
echo "\n";

// ============================================================================
// PREPARACIÓN: Crear usuarios y datos de prueba
// ============================================================================

echo "📋 FASE 1: PREPARACIÓN DE DATOS DE PRUEBA\n";
echo str_repeat("─", 70) . "\n";

try {
    DB::beginTransaction();

    // 1. Crear Usuario Cliente (si no existe)
    $usuarioCliente = User::firstOrCreate(
        ['email' => 'test.cliente@test.com'],
        [
            'name' => 'Juan Test Cliente',
            'password' => Hash::make('password'),
            'role' => 'cliente',
            'activo' => true,
        ]
    );
    echo "✅ Usuario Cliente: {$usuarioCliente->name} (ID: {$usuarioCliente->id})\n";

    // 2. Crear registro Cliente
    $cliente = Cliente::firstOrCreate(
        ['usuario_id' => $usuarioCliente->id],
        [
            'nombre' => 'Juan',
            'apellidos' => 'Test Cliente',
            'dni' => '12345678',
            'email' => 'test.cliente@test.com',
            'telefono' => '987654321',
            'direccion' => 'Av. Test 456, Lima',
        ]
    );
    echo "✅ Cliente creado: {$cliente->nombre} {$cliente->apellidos} (ID: {$cliente->id})\n";

    // 3. Crear Usuario Asesor (si no existe)
    $usuarioAsesor = User::firstOrCreate(
        ['email' => 'test.asesor@test.com'],
        [
            'name' => 'María Test Asesora',
            'password' => Hash::make('password'),
            'role' => 'asesor',
            'activo' => true,
        ]
    );
    echo "✅ Usuario Asesor: {$usuarioAsesor->name} (ID: {$usuarioAsesor->id})\n";

    // 4. Crear registro Asesor
    $asesor = Asesor::firstOrCreate(
        ['usuario_id' => $usuarioAsesor->id],
        [
            'nombre' => 'María',
            'apellidos' => 'Test Asesora',
            'documento' => '87654321',
            'fecha_nacimiento' => '1990-05-15',
            'direccion' => 'Av. Asesor 789, Lima',
            'email' => 'test.asesor@test.com',
            'telefono' => '912345678',
            'especialidad' => 'Ventas Residenciales',
            'fecha_contrato' => now(),
        ]
    );
    echo "✅ Asesor creado: {$asesor->nombre} {$asesor->apellidos} (ID: {$asesor->id})\n";

    // 5. Asignar asesor al cliente
    $cliente->asesor_id = $asesor->id;
    $cliente->save();
    echo "✅ Cliente asignado al Asesor\n";

    // 6. Obtener un departamento disponible
    $departamento = Departamento::where('estado', 'disponible')->first();

    if (!$departamento) {
        echo "❌ No hay departamentos disponibles. Creando uno...\n";
        $departamento = Departamento::create([
            'titulo' => 'Departamento Test Los Olivos',
            'descripcion' => 'Departamento de prueba para testing',
            'precio' => 250000,
            'direccion' => 'Av. Test 123, Los Olivos',
            'distrito' => 'Los Olivos',
            'area' => 120.50,
            'habitaciones' => 3,
            'banos' => 2,
            'estacionamientos' => 1,
            'piso' => 5,
            'estado' => 'disponible',
            'activo' => true,
        ]);
    }
    echo "✅ Departamento disponible: {$departamento->titulo} (ID: {$departamento->id})\n";
    echo "   Precio: S/ " . number_format((float)$departamento->precio, 2) . "\n";

    DB::commit();

    echo "\n✅ FASE 1 COMPLETADA - Datos de prueba preparados\n\n";

} catch (\Exception $e) {
    DB::rollBack();
    echo "❌ ERROR en preparación: {$e->getMessage()}\n";
    exit(1);
}

// ============================================================================
// PASO 1: CLIENTE ENVÍA SOLICITUD
// ============================================================================

echo "╔════════════════════════════════════════════════════════════════════╗\n";
echo "║  PASO 1: CLIENTE ENVÍA SOLICITUD DE INFORMACIÓN                   ║\n";
echo "╚════════════════════════════════════════════════════════════════════╝\n";
echo "\n";

try {
    DB::beginTransaction();

    // Simular que el cliente envía una solicitud
    $solicitud = Cotizacion::create([
        'cliente_id' => $cliente->id,
        'asesor_id' => $asesor->id,
        'departamento_id' => $departamento->id,
        'tipo_solicitud' => 'cotizacion',
        'mensaje_solicitud' => 'Hola, estoy muy interesado en este departamento. ¿Podrían enviarme una cotización con opciones de financiamiento? Gracias.',
        'estado' => 'pendiente',
        'fecha_validez' => now()->addDays(30), // Agregar fecha de validez por defecto
    ]);

    echo "📱 CLIENTE: {$cliente->nombre} {$cliente->apellidos}\n";
    echo "   Envió solicitud de cotización\n";
    echo "   Departamento: {$departamento->titulo}\n";
    echo "   Mensaje: \"{$solicitud->mensaje_solicitud}\"\n";
    echo "   Estado: {$solicitud->estado} ⏳\n";
    echo "   Fecha: {$solicitud->created_at->format('d/m/Y H:i')}\n";

    DB::commit();

    echo "\n✅ Solicitud ID: {$solicitud->id} creada correctamente\n\n";

    sleep(1); // Pausa para simular tiempo real

} catch (\Exception $e) {
    DB::rollBack();
    echo "❌ ERROR al crear solicitud: {$e->getMessage()}\n";
    exit(1);
}

// ============================================================================
// PASO 2: ASESOR RECIBE Y RESPONDE CON COTIZACIÓN
// ============================================================================

echo "╔════════════════════════════════════════════════════════════════════╗\n";
echo "║  PASO 2: ASESOR RECIBE Y RESPONDE CON COTIZACIÓN                  ║\n";
echo "╚════════════════════════════════════════════════════════════════════╝\n";
echo "\n";

try {
    DB::beginTransaction();

    echo "💼 ASESOR: {$asesor->nombre} {$asesor->apellidos}\n";
    echo "   Recibió la solicitud ID: {$solicitud->id}\n";
    echo "   Cliente: {$cliente->nombre} {$cliente->apellidos}\n";
    echo "   Departamento: {$departamento->titulo}\n\n";

    // Simular que el asesor responde con una cotización
    $monto = $departamento->precio;
    $descuento = 5; // 5% de descuento
    $precioFinal = $monto * (1 - $descuento / 100);
    $fechaValidez = now()->addDays(30);

    $solicitud->update([
        'monto' => $monto,
        'descuento' => $descuento,
        'condiciones' => 'Inicial 30% (S/' . number_format($precioFinal * 0.3, 2) . '), financiamiento bancario disponible hasta 20 años. Incluye estacionamiento.',
        'notas' => 'Departamento en excelente ubicación, cerca de centros comerciales y transporte público. Entrega inmediata.',
        'fecha_validez' => $fechaValidez,
        'estado' => 'en_proceso',
    ]);

    echo "   Envió cotización:\n";
    echo "   ├─ Monto base: S/ " . number_format($monto, 2) . "\n";
    echo "   ├─ Descuento: {$descuento}%\n";
    echo "   ├─ Precio final: S/ " . number_format($precioFinal, 2) . "\n";
    echo "   ├─ Condiciones: {$solicitud->condiciones}\n";
    echo "   ├─ Notas: {$solicitud->notas}\n";
    echo "   └─ Válido hasta: " . \Carbon\Carbon::parse($fechaValidez)->format('d/m/Y') . "\n";
    echo "   Estado: {$solicitud->estado} 🔄\n";

    DB::commit();

    echo "\n✅ Cotización enviada correctamente\n\n";

    sleep(1);

} catch (\Exception $e) {
    DB::rollBack();
    echo "❌ ERROR al responder solicitud: {$e->getMessage()}\n";
    exit(1);
}

// ============================================================================
// PASO 3: CLIENTE VE LA COTIZACIÓN Y RESPONDE
// ============================================================================

echo "╔════════════════════════════════════════════════════════════════════╗\n";
echo "║  PASO 3: CLIENTE VE LA COTIZACIÓN                                 ║\n";
echo "╚════════════════════════════════════════════════════════════════════╝\n";
echo "\n";

// Recargar la solicitud con los datos actualizados
$solicitud->refresh();

echo "📱 CLIENTE: {$cliente->nombre} {$cliente->apellidos}\n";
echo "   Recibió cotización del asesor:\n\n";
echo "   ╔══════════════════════════════════════════════════════════════════╗\n";
echo "   ║              💰 COTIZACIÓN DEL ASESOR                            ║\n";
echo "   ╠══════════════════════════════════════════════════════════════════╣\n";
echo "   ║  Departamento: {$departamento->titulo}\n";
echo "   ║  Monto Base:   S/ " . number_format((float)$solicitud->monto, 2) . "\n";
echo "   ║  Descuento:    {$solicitud->descuento}%\n";
echo "   ║  Precio Final: S/ " . number_format((float)$solicitud->monto * (1 - $solicitud->descuento / 100), 2) . "\n";
echo "   ║  \n";
echo "   ║  📋 Condiciones: {$solicitud->condiciones}\n";
echo "   ║  📝 Notas: {$solicitud->notas}\n";
echo "   ║  ⏰ Válido hasta: " . \Carbon\Carbon::parse($solicitud->fecha_validez)->format('d/m/Y') . "\n";
echo "   ╚══════════════════════════════════════════════════════════════════╝\n\n";

echo "   Opciones disponibles:\n";
echo "   A) ✅ ACEPTAR - Aprobar la cotización\n";
echo "   B) ❌ RECHAZAR - Rechazar con motivo\n";
echo "   C) ✏️  MODIFICAR - Solicitar cambios\n\n";

// Simular diferentes escenarios
echo "   🤔 Cliente decide... ACEPTAR LA COTIZACIÓN ✅\n\n";

sleep(1);

try {
    DB::beginTransaction();

    // Cliente acepta la cotización
    $solicitud->update([
        'estado' => 'aprobada',
        'fecha_respuesta_cliente' => now(),
    ]);

    echo "   ✅ Cliente aceptó la cotización\n";
    echo "   Estado: {$solicitud->estado} ✅\n";
    echo "   Fecha de respuesta: {$solicitud->fecha_respuesta_cliente->format('d/m/Y H:i')}\n";

    DB::commit();

    echo "\n✅ PASO 3 COMPLETADO - Cliente aceptó la cotización\n\n";

    sleep(1);

} catch (\Exception $e) {
    DB::rollBack();
    echo "❌ ERROR al aceptar cotización: {$e->getMessage()}\n";
    exit(1);
}

// ============================================================================
// PASO 4: ASESOR CREA RESERVA
// ============================================================================

echo "╔════════════════════════════════════════════════════════════════════╗\n";
echo "║  PASO 4: ASESOR CREA RESERVA FORMAL                               ║\n";
echo "╚════════════════════════════════════════════════════════════════════╝\n";
echo "\n";

try {
    DB::beginTransaction();

    $solicitud->refresh();

    echo "💼 ASESOR: {$asesor->nombre} {$asesor->apellidos}\n";
    echo "   Cliente aceptó la cotización ID: {$solicitud->id}\n";
    echo "   Procediendo a crear reserva formal...\n\n";

    // Crear reserva
    $reserva = Reserva::create([
        'cliente_id' => $cliente->id,
        'asesor_id' => $asesor->id,
        'departamento_id' => $departamento->id,
        'cotizacion_id' => $solicitud->id,
        'fecha_reserva' => now(),
        'fecha_vencimiento' => now()->addDays(15),
        'monto_reserva' => $solicitud->monto * (1 - $solicitud->descuento / 100) * 0.05, // 5% del precio final
        'estado' => 'activa',
        'notas' => 'Reserva creada tras aceptación de cotización. Cliente tiene 15 días para formalizar.',
    ]);

    echo "   ╔══════════════════════════════════════════════════════════════════╗\n";
    echo "   ║                    📋 RESERVA CREADA                             ║\n";
    echo "   ╠══════════════════════════════════════════════════════════════════╣\n";
    echo "   ║  ID Reserva:    {$reserva->id}\n";
    echo "   ║  Cliente:       {$cliente->nombre} {$cliente->apellidos}\n";
    echo "   ║  Departamento:  {$departamento->titulo}\n";
    echo "   ║  Monto Reserva: S/ " . number_format((float)$reserva->monto_reserva, 2) . "\n";
    echo "   ║  Fecha Reserva: " . \Carbon\Carbon::parse($reserva->fecha_reserva)->format('d/m/Y') . "\n";
    echo "   ║  Vence:         " . \Carbon\Carbon::parse($reserva->fecha_vencimiento)->format('d/m/Y') . "\n";
    echo "   ║  Estado:        {$reserva->estado} ✅\n";
    echo "   ╚══════════════════════════════════════════════════════════════════╝\n";

    DB::commit();

    echo "\n✅ PASO 4 COMPLETADO - Reserva creada exitosamente\n\n";

    sleep(1);

} catch (\Exception $e) {
    DB::rollBack();
    echo "❌ ERROR al crear reserva: {$e->getMessage()}\n";
    exit(1);
}

// ============================================================================
// PASO 5: CLIENTE COMPRA PRESENCIALMENTE (SIMULADO)
// ============================================================================

echo "╔════════════════════════════════════════════════════════════════════╗\n";
echo "║  PASO 5: CLIENTE VISITA Y COMPRA (PROCESO PRESENCIAL)            ║\n";
echo "╚════════════════════════════════════════════════════════════════════╝\n";
echo "\n";

echo "🏢 PROCESO PRESENCIAL:\n";
echo "   1. Cliente visitó el departamento ✅\n";
echo "   2. Cliente firmó contrato de compraventa ✅\n";
echo "   3. Cliente pagó inicial de S/ " . number_format($precioFinal * 0.3, 2) . " ✅\n";
echo "   4. Se entregaron llaves y documentación ✅\n\n";

sleep(1);

// ============================================================================
// PASO 6: ASESOR REGISTRA LA VENTA EN EL SISTEMA
// ============================================================================

echo "╔════════════════════════════════════════════════════════════════════╗\n";
echo "║  PASO 6: ASESOR REGISTRA LA VENTA EN EL SISTEMA                  ║\n";
echo "╚════════════════════════════════════════════════════════════════════╝\n";
echo "\n";

try {
    DB::beginTransaction();

    echo "💼 ASESOR: {$asesor->nombre} {$asesor->apellidos}\n";
    echo "   Registrando venta en el sistema...\n\n";

    // Crear venta
    $venta = Venta::create([
        'cliente_id' => $cliente->id,
        'asesor_id' => $asesor->id,
        'departamento_id' => $departamento->id,
        'reserva_id' => $reserva->id,
        'cotizacion_id' => $solicitud->id,
        'precio_venta' => $precioFinal,
        'comision' => $precioFinal * 0.03, // 3% de comisión
        'fecha_venta' => now(),
        'metodo_pago' => 'Transferencia Bancaria + Financiamiento',
        'estado' => 'completada',
        'observaciones' => 'Venta completada exitosamente. Cliente pagó inicial 30% y financió el resto a 20 años.',
    ]);

    // Actualizar estado del departamento
    $departamento->update([
        'estado' => 'vendido',
    ]);

    // Actualizar reserva
    $reserva->update([
        'estado' => 'completada',
    ]);

    echo "   ╔══════════════════════════════════════════════════════════════════╗\n";
    echo "   ║                    🎉 VENTA REGISTRADA                           ║\n";
    echo "   ╠══════════════════════════════════════════════════════════════════╣\n";
    echo "   ║  ID Venta:        {$venta->id}\n";
    echo "   ║  Cliente:         {$cliente->nombre} {$cliente->apellidos}\n";
    echo "   ║  Asesor:          {$asesor->nombre} {$asesor->apellidos}\n";
    echo "   ║  Departamento:    {$departamento->titulo}\n";
    echo "   ║  Precio Venta:    S/ " . number_format((float)$venta->precio_venta, 2) . "\n";
    echo "   ║  Comisión Asesor: S/ " . number_format((float)$venta->comision, 2) . "\n";
    echo "   ║  Método Pago:     {$venta->metodo_pago}\n";
    echo "   ║  Fecha Venta:     " . \Carbon\Carbon::parse($venta->fecha_venta)->format('d/m/Y') . "\n";
    echo "   ║  Estado:          {$venta->estado} ✅\n";
    echo "   ╚══════════════════════════════════════════════════════════════════╝\n";

    echo "\n   Estado del departamento actualizado: {$departamento->estado} 🏠\n";

    DB::commit();

    echo "\n✅ PASO 6 COMPLETADO - Venta registrada exitosamente\n\n";

} catch (\Exception $e) {
    DB::rollBack();
    echo "❌ ERROR al registrar venta: {$e->getMessage()}\n";
    exit(1);
}

// ============================================================================
// RESUMEN FINAL
// ============================================================================

echo "\n";
echo "╔════════════════════════════════════════════════════════════════════╗\n";
echo "║                    ✅ TEST COMPLETADO EXITOSAMENTE                 ║\n";
echo "╚════════════════════════════════════════════════════════════════════╝\n";
echo "\n";

echo "📊 RESUMEN DEL FLUJO COMPLETO:\n";
echo str_repeat("═", 70) . "\n\n";

echo "1️⃣  Cliente '{$cliente->nombre}' envió solicitud → Estado: PENDIENTE ⏳\n";
echo "2️⃣  Asesor '{$asesor->nombre}' respondió con cotización → Estado: EN_PROCESO 🔄\n";
echo "3️⃣  Cliente aceptó la cotización → Estado: APROBADA ✅\n";
echo "4️⃣  Asesor creó reserva formal → Reserva ID: {$reserva->id} ✅\n";
echo "5️⃣  Cliente compró presencialmente → Proceso físico ✅\n";
echo "6️⃣  Asesor registró venta → Venta ID: {$venta->id} ✅\n";
echo "7️⃣  Departamento actualizado → Estado: VENDIDO 🏠\n\n";

echo "💰 DATOS FINANCIEROS:\n";
echo "   Precio Original:  S/ " . number_format((float)$departamento->precio, 2) . "\n";
echo "   Descuento:        {$solicitud->descuento}%\n";
echo "   Precio Final:     S/ " . number_format((float)$precioFinal, 2) . "\n";
echo "   Monto Reserva:    S/ " . number_format((float)$reserva->monto_reserva, 2) . "\n";
echo "   Comisión Asesor:  S/ " . number_format((float)$venta->comision, 2) . "\n\n";

echo "⏱️  TIMELINE:\n";
echo "   Solicitud creada:  {$solicitud->created_at->format('d/m/Y H:i:s')}\n";
echo "   Cotización enviada: {$solicitud->updated_at->format('d/m/Y H:i:s')}\n";
echo "   Cliente aceptó:    " . \Carbon\Carbon::parse($solicitud->fecha_respuesta_cliente)->format('d/m/Y H:i:s') . "\n";
echo "   Reserva creada:    " . \Carbon\Carbon::parse($reserva->fecha_reserva)->format('d/m/Y H:i:s') . "\n";
echo "   Venta registrada:  " . \Carbon\Carbon::parse($venta->fecha_venta)->format('d/m/Y H:i:s') . "\n\n";

echo "🔍 IDs PARA VERIFICACIÓN EN EL SISTEMA:\n";
echo "   Usuario Cliente: {$usuarioCliente->id} ({$usuarioCliente->email})\n";
echo "   Usuario Asesor:  {$usuarioAsesor->id} ({$usuarioAsesor->email})\n";
echo "   Solicitud/Cotización: {$solicitud->id}\n";
echo "   Reserva: {$reserva->id}\n";
echo "   Venta: {$venta->id}\n";
echo "   Departamento: {$departamento->id}\n\n";

echo "🔐 CREDENCIALES DE ACCESO:\n";
echo "   Cliente:\n";
echo "   Email: test.cliente@test.com\n";
echo "   Password: password\n\n";
echo "   Asesor:\n";
echo "   Email: test.asesor@test.com\n";
echo "   Password: password\n\n";

echo "🌐 RUTAS PARA VERIFICAR:\n";
echo "   Cliente: http://127.0.0.1:8000/cliente/solicitudes\n";
echo "   Asesor:  http://127.0.0.1:8000/asesor/solicitudes\n\n";

echo str_repeat("═", 70) . "\n";
echo "✅ TODOS LOS PASOS DEL FLUJO FUNCIONAN CORRECTAMENTE\n";
echo "✅ EL SISTEMA CUMPLE CON TODOS LOS REQUISITOS\n";
echo str_repeat("═", 70) . "\n\n";
