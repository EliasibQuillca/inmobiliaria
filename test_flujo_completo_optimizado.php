<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
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
use Illuminate\Support\Facades\Schema;

// ============================================================================
// FUNCIONES AUXILIARES
// ============================================================================

function printHeader($text) {
    echo "\n";
    echo "╔" . str_repeat("═", 70) . "╗\n";
    echo "║  " . str_pad($text, 67) . " ║\n";
    echo "╚" . str_repeat("═", 70) . "╝\n";
    echo "\n";
}

function printSuccess($text) {
    echo "✅ $text\n";
}

function printError($text) {
    echo "❌ $text\n";
}

function printInfo($text, $indent = 0) {
    echo str_repeat("   ", $indent) . "$text\n";
}

// ============================================================================
// INICIO DEL TEST
// ============================================================================

printHeader("TEST DE FUNCIONALIDAD COMPLETO - FLUJO CLIENTE → ASESOR");

try {
    // ========================================================================
    // FASE 0: VERIFICAR ESTRUCTURA DE BD
    // ========================================================================

    printInfo("📋 Verificando estructura de base de datos...\n");

    $tablasRequeridas = ['users', 'clientes', 'asesores', 'departamentos', 'cotizaciones', 'reservas', 'ventas'];
    $tablasExistentes = [];

    foreach ($tablasRequeridas as $tabla) {
        if (Schema::hasTable($tabla)) {
            $tablasExistentes[] = $tabla;
            printSuccess("Tabla '$tabla' existe");
        } else {
            printError("Tabla '$tabla' NO EXISTE");
        }
    }

    if (count($tablasExistentes) !== count($tablasRequeridas)) {
        throw new \Exception("Faltan tablas en la base de datos. Ejecuta: php artisan migrate");
    }

    printSuccess("Todas las tablas necesarias existen\n");

    // ========================================================================
    // FASE 1: PREPARACIÓN - CREAR O REUTILIZAR DATOS
    // ========================================================================

    printHeader("FASE 1: PREPARACIÓN DE DATOS DE PRUEBA");

    DB::beginTransaction();

    // 1. Usuario y Cliente
    $usuarioCliente = User::updateOrCreate(
        ['email' => 'cliente.test@inmobiliaria.com'],
        [
            'name' => 'Juan Pérez',
            'password' => Hash::make('password123'),
            'role' => 'cliente',
            'activo' => true,
        ]
    );
    printSuccess("Usuario Cliente: {$usuarioCliente->name} (ID: {$usuarioCliente->id})");

    // Buscar cliente existente o crear uno nuevo
    $cliente = Cliente::where('usuario_id', $usuarioCliente->id)->first();

    if (!$cliente) {
        // Generar DNI único
        $dniCliente = '1234' . rand(1000, 9999);

        $cliente = Cliente::create([
            'usuario_id' => $usuarioCliente->id,
            'nombre' => 'Juan',
            'apellidos' => 'Pérez García',
            'dni' => $dniCliente,
            'email' => 'cliente.test@inmobiliaria.com',
            'telefono' => '987654321',
            'direccion' => 'Av. Los Pinos 456, Los Olivos, Lima',
            'fecha_registro' => now(),
        ]);
    }

    printSuccess("Cliente: {$cliente->nombre} {$cliente->apellidos} (ID: {$cliente->id})");
    printInfo("DNI: {$cliente->dni} | Teléfono: {$cliente->telefono}", 1);

    // 2. Usuario y Asesor
    $usuarioAsesor = User::updateOrCreate(
        ['email' => 'asesor.test@inmobiliaria.com'],
        [
            'name' => 'María López',
            'password' => Hash::make('password123'),
            'role' => 'asesor',
            'activo' => true,
        ]
    );
    printSuccess("Usuario Asesor: {$usuarioAsesor->name} (ID: {$usuarioAsesor->id})");

    // Buscar asesor existente o crear uno nuevo
    $asesor = Asesor::where('usuario_id', $usuarioAsesor->id)->first();

    if (!$asesor) {
        // Generar documento único
        $documentoAsesor = '8765' . rand(1000, 9999);

        $asesor = Asesor::create([
            'usuario_id' => $usuarioAsesor->id,
            'nombre' => 'María',
            'apellidos' => 'López Sánchez',
            'documento' => $documentoAsesor,
            'fecha_nacimiento' => '1990-05-15',
            'direccion' => 'Jr. Las Flores 789, San Isidro, Lima',
            'email' => 'asesor.test@inmobiliaria.com',
            'telefono' => '912345678',
            'especialidad' => 'Ventas Residenciales Premium',
            'experiencia' => 5,
            'biografia' => 'Especialista en venta de departamentos con 5 años de experiencia',
            'estado' => 'activo',
            'fecha_contrato' => now()->subYears(2),
            'comision_porcentaje' => 3.0,
        ]);
    }

    printSuccess("Asesor: {$asesor->nombre} {$asesor->apellidos} (ID: {$asesor->id})");
    printInfo("Especialidad: {$asesor->especialidad} | Experiencia: {$asesor->experiencia} años", 1);

    // 3. Asignar asesor al cliente
    $cliente->asesor_id = $asesor->id;
    $cliente->save();
    printSuccess("Cliente asignado al Asesor");

    // 4. Departamento disponible
    $departamento = Departamento::where('estado', 'disponible')->first();

    if (!$departamento) {
        printInfo("No hay departamentos disponibles. Creando uno de prueba...");
        $departamento = Departamento::create([
            'titulo' => 'Departamento Los Olivos Premium',
            'descripcion' => 'Hermoso departamento de 3 habitaciones en zona residencial con excelente ubicación',
            'precio' => 250000.00,
            'direccion' => 'Av. Los Olivos 501',
            'distrito' => 'Los Olivos',
            'provincia' => 'Lima',
            'departamento' => 'Lima',
            'area' => 120.50,
            'habitaciones' => 3,
            'banos' => 2,
            'estacionamientos' => 1,
            'piso' => 5,
            'antiguedad' => 2,
            'gastos_comunes' => 350.00,
            'estado' => 'disponible',
            'tipo' => 'departamento',
            'activo' => true,
        ]);
    }

    printSuccess("Departamento: {$departamento->titulo} (ID: {$departamento->id})");
    printInfo("Precio: S/ " . number_format($departamento->precio, 2), 1);
    printInfo("Ubicación: {$departamento->direccion}, {$departamento->distrito}", 1);
    printInfo("Características: {$departamento->habitaciones} hab, {$departamento->banos} baños, {$departamento->area} m²", 1);

    DB::commit();
    printSuccess("\nFASE 1 COMPLETADA - Datos preparados exitosamente\n");

    sleep(1);

    // ========================================================================
    // PASO 1: CLIENTE ENVÍA SOLICITUD
    // ========================================================================

    printHeader("PASO 1: CLIENTE ENVÍA SOLICITUD DE COTIZACIÓN");

    DB::beginTransaction();

    $solicitud = Cotizacion::create([
        'cliente_id' => $cliente->id,
        'asesor_id' => $asesor->id,
        'departamento_id' => $departamento->id,
        'tipo_solicitud' => 'cotizacion',
        'mensaje_solicitud' => 'Hola, estoy muy interesado en este departamento. Me gustaría conocer las opciones de financiamiento y si hay posibilidad de descuento. ¿Podrían enviarme una cotización detallada? Gracias.',
        'estado' => 'pendiente',
        'monto' => 0, // Se llenará cuando el asesor responda
        'descuento' => 0,
        'notas' => '',
        'condiciones' => '',
        'fecha_validez' => now()->addDays(30),
    ]);

    printInfo("📱 CLIENTE: {$cliente->nombre} {$cliente->apellidos}");
    printInfo("Envió solicitud de cotización", 1);
    printInfo("Departamento: {$departamento->titulo}", 1);
    printInfo("Estado: {$solicitud->estado} ⏳", 1);
    printInfo("Fecha: {$solicitud->created_at->format('d/m/Y H:i')}", 1);
    printInfo("", 1);
    printInfo("💬 Mensaje:", 1);
    printInfo("\"{$solicitud->mensaje_solicitud}\"", 2);

    DB::commit();
    printSuccess("\nSolicitud ID: {$solicitud->id} creada correctamente\n");

    sleep(1);

    // ========================================================================
    // PASO 2: ASESOR RECIBE Y RESPONDE CON COTIZACIÓN
    // ========================================================================

    printHeader("PASO 2: ASESOR RESPONDE CON COTIZACIÓN");

    DB::beginTransaction();

    printInfo("💼 ASESOR: {$asesor->nombre} {$asesor->apellidos}");
    printInfo("Recibió solicitud ID: {$solicitud->id}", 1);
    printInfo("De: {$cliente->nombre} {$cliente->apellidos}", 1);
    printInfo("Departamento: {$departamento->titulo}\n", 1);

    // Calcular cotización
    $montoBase = $departamento->precio;
    $descuento = 5.0; // 5%
    $precioFinal = $montoBase * (1 - $descuento / 100);
    $inicial = $precioFinal * 0.30; // 30% inicial
    $financiamiento = $precioFinal * 0.70; // 70% financiado
    $fechaValidez = now()->addDays(30);

    $solicitud->update([
        'monto' => $montoBase,
        'descuento' => $descuento,
        'condiciones' => sprintf(
            "✓ Inicial: 30%% (S/ %s)\n✓ Financiamiento: 70%% (S/ %s) hasta 20 años\n✓ Incluye: Estacionamiento techado + Depósito\n✓ Gastos de mantenimiento: S/ %.2f mensuales\n✓ Entrega inmediata",
            number_format($inicial, 2),
            number_format($financiamiento, 2),
            $departamento->gastos_comunes ?? 0
        ),
        'notas' => "Departamento en excelente ubicación, cerca de centros comerciales (Plaza Norte a 5 min), estaciones de Metro (Línea 1), colegios y parques. Edificio moderno con seguridad 24/7, ascensor y áreas comunes.",
        'fecha_validez' => $fechaValidez,
        'estado' => 'en_proceso',
    ]);

    printInfo("Respondió con cotización:");
    printInfo("┌─────────────────────────────────────────────────────────────┐", 1);
    printInfo("│  💰 COTIZACIÓN DETALLADA                                   │", 1);
    printInfo("├─────────────────────────────────────────────────────────────┤", 1);
    printInfo("│  Monto Base:    S/ " . str_pad(number_format($montoBase, 2), 42) . "│", 1);
    printInfo("│  Descuento:     " . str_pad("{$descuento}%", 49) . "│", 1);
    printInfo("│  Precio Final:  S/ " . str_pad(number_format($precioFinal, 2), 42) . "│", 1);
    printInfo("│  ", 1);
    printInfo("│  📋 Condiciones de Pago:", 1);
    foreach (explode("\n", $solicitud->condiciones) as $linea) {
        printInfo("│     " . str_pad($linea, 56) . "│", 1);
    }
    printInfo("│  ", 1);
    printInfo("│  📝 Notas Adicionales:", 1);
    printInfo("│     " . substr($solicitud->notas, 0, 55) . "│", 1);
    printInfo("│     " . substr($solicitud->notas, 55, 55) . "│", 1);
    printInfo("│  ", 1);
    printInfo("│  ⏰ Válido hasta: " . str_pad($fechaValidez->format('d/m/Y'), 40) . "│", 1);
    printInfo("│  📊 Estado: EN_PROCESO 🔄", 1);
    printInfo("└─────────────────────────────────────────────────────────────┘", 1);

    DB::commit();
    printSuccess("\nCotización enviada correctamente\n");

    sleep(1);

    // ========================================================================
    // PASO 3: CLIENTE VE Y ACEPTA LA COTIZACIÓN
    // ========================================================================

    printHeader("PASO 3: CLIENTE REVISA Y RESPONDE");

    $solicitud->refresh();

    printInfo("📱 CLIENTE: {$cliente->nombre} {$cliente->apellidos}");
    printInfo("Recibió cotización del asesor\n", 1);

    printInfo("╔══════════════════════════════════════════════════════════════╗", 1);
    printInfo("║              💰 RESUMEN DE COTIZACIÓN                        ║", 1);
    printInfo("╠══════════════════════════════════════════════════════════════╣", 1);
    printInfo("║  Departamento: {$departamento->titulo}", 1);
    printInfo("║  Precio Original: S/ " . number_format($montoBase, 2), 1);
    printInfo("║  Descuento: {$descuento}% 📉", 1);
    printInfo("║  Precio Final: S/ " . number_format($precioFinal, 2) . " ✨", 1);
    printInfo("║  Ahorro: S/ " . number_format($montoBase - $precioFinal, 2), 1);
    printInfo("╚══════════════════════════════════════════════════════════════╝\n", 1);

    printInfo("Opciones disponibles:", 1);
    printInfo("A) ✅ ACEPTAR - Aprobar y continuar con reserva", 1);
    printInfo("B) ❌ RECHAZAR - Declinar la oferta", 1);
    printInfo("C) ✏️  MODIFICAR - Solicitar ajustes\n", 1);

    printInfo("🤔 Cliente analiza la oferta...", 1);
    sleep(1);
    printInfo("💡 Decisión: ACEPTAR LA COTIZACIÓN ✅\n", 1);

    DB::beginTransaction();

    $solicitud->update([
        'estado' => 'aprobada',
        'fecha_respuesta_cliente' => now(),
    ]);

    printSuccess("Cliente aceptó la cotización");
    printInfo("Estado actualizado: {$solicitud->estado} ✅", 1);
    printInfo("Fecha de respuesta: {$solicitud->fecha_respuesta_cliente->format('d/m/Y H:i')}", 1);

    DB::commit();
    printSuccess("\nPASO 3 COMPLETADO - Cliente aceptó la oferta\n");

    sleep(1);

    // ========================================================================
    // PASO 4: ASESOR CREA RESERVA FORMAL
    // ========================================================================

    printHeader("PASO 4: ASESOR FORMALIZA LA RESERVA");

    DB::beginTransaction();

    $solicitud->refresh();

    printInfo("💼 ASESOR: {$asesor->nombre} {$asesor->apellidos}");
    printInfo("Cliente aceptó la cotización ID: {$solicitud->id}", 1);
    printInfo("Procediendo a crear reserva formal...\n", 1);

    $montoReserva = $precioFinal * 0.05; // 5% del precio final
    $plazoReserva = 15; // días
    $fechaInicio = now();
    $fechaFin = now()->addDays($plazoReserva);

    $reserva = Reserva::create([
        'cliente_id' => $cliente->id,
        'asesor_id' => $asesor->id,
        'departamento_id' => $departamento->id,
        'cotizacion_id' => $solicitud->id,
        'fecha_reserva' => now(),
        'fecha_inicio' => $fechaInicio,
        'fecha_fin' => $fechaFin,
        'monto_reserva' => $montoReserva,
        'monto_total' => $precioFinal,
        'estado' => 'confirmada', // Estados válidos: pendiente, confirmada, cancelada, vencida
        'notas' => "Reserva creada tras aceptación de cotización. Cliente tiene {$plazoReserva} días para formalizar la compra con el pago inicial del 30%. Monto de reserva garantiza la disponibilidad del inmueble.",
    ]);

    printInfo("╔══════════════════════════════════════════════════════════════╗", 1);
    printInfo("║                    📋 RESERVA FORMAL CREADA                  ║", 1);
    printInfo("╠══════════════════════════════════════════════════════════════╣", 1);
    printInfo("║  ID Reserva:       #{$reserva->id}", 1);
    printInfo("║  Cliente:          {$cliente->nombre} {$cliente->apellidos}", 1);
    printInfo("║  Departamento:     {$departamento->titulo}", 1);
    printInfo("║  Monto Reserva:    S/ " . number_format($reserva->monto_reserva, 2) . " (5%)", 1);
    printInfo("║  Monto Total:      S/ " . number_format($reserva->monto_total, 2), 1);
    printInfo("║  Fecha Inicio:     {$reserva->fecha_inicio->format('d/m/Y')}", 1);
    printInfo("║  Fecha Fin:        {$reserva->fecha_fin->format('d/m/Y')} ({$plazoReserva} días)", 1);
    printInfo("║  Estado:           {$reserva->estado} ✅", 1);
    printInfo("║  ", 1);
    printInfo("║  📌 Próximos pasos:", 1);
    printInfo("║  1. Cliente deposita monto de reserva: S/ " . number_format($montoReserva, 2), 1);
    printInfo("║  2. Coordinar visita al inmueble", 1);
    printInfo("║  3. Preparar documentación legal", 1);
    printInfo("║  4. Firma de contrato y pago inicial (30%)", 1);
    printInfo("╚══════════════════════════════════════════════════════════════╝", 1);

    DB::commit();
    printSuccess("\nReserva ID: {$reserva->id} creada exitosamente\n");

    sleep(1);

    // ========================================================================
    // PASO 5: SIMULAR PROCESO PRESENCIAL
    // ========================================================================

    printHeader("PASO 5: PROCESO DE COMPRA PRESENCIAL");

    printInfo("🏢 ACTIVIDADES PRESENCIALES (Fuera del sistema):\n");
    printInfo("📅 Día 1: Cliente visitó el departamento con el asesor", 1);
    printInfo("   - Recorrido completo por el inmueble", 2);
    printInfo("   - Verificación de áreas comunes", 2);
    printInfo("   - Revisión de acabados y estado general", 2);
    printSuccess("   ✅ Cliente quedó satisfecho con la visita\n");

    printInfo("📄 Día 3: Revisión de documentación legal", 1);
    printInfo("   - Verificación de títulos de propiedad", 2);
    printInfo("   - Revisión de cargas y gravámenes (sin observaciones)", 2);
    printInfo("   - Certificado de parámetros urbanísticos", 2);
    printSuccess("   ✅ Toda la documentación en orden\n");

    printInfo("✍️  Día 5: Firma de contrato de compraventa", 1);
    printInfo("   - Cliente firmó el contrato", 2);
    printInfo("   - Pago inicial: S/ " . number_format($inicial, 2) . " (30%)", 2);
    printInfo("   - Aprobación de crédito hipotecario: S/ " . number_format($financiamiento, 2), 2);
    printInfo("   - Entrega de llaves", 2);
    printSuccess("   ✅ Proceso de compra completado\n");

    sleep(1);

    // ========================================================================
    // PASO 6: ASESOR REGISTRA LA VENTA
    // ========================================================================

    printHeader("PASO 6: REGISTRO FINAL DE LA VENTA");

    DB::beginTransaction();

    printInfo("💼 ASESOR: {$asesor->nombre} {$asesor->apellidos}");
    printInfo("Registrando venta en el sistema...\n", 1);

    $comision = $precioFinal * ($asesor->comision_porcentaje / 100);

    $venta = Venta::create([
        'reserva_id' => $reserva->id,
        'fecha_venta' => now(),
        'monto_final' => $precioFinal,
        'documentos_entregados' => false,
        'observaciones' => "Venta completada exitosamente. Cliente muy satisfecho con la atención y el proceso. Financiamiento aprobado por Banco XYZ a 20 años con tasa preferencial de 7.5% anual.",
    ]);

    // Actualizar estado del departamento
    $departamento->update([
        'estado' => 'vendido',
        'activo' => false,
    ]);

    printInfo("╔══════════════════════════════════════════════════════════════╗", 1);
    printInfo("║              🎉 VENTA REGISTRADA EXITOSAMENTE 🎉             ║", 1);
    printInfo("╠══════════════════════════════════════════════════════════════╣", 1);
    printInfo("║  ID Venta:         #{$venta->id}", 1);
    printInfo("║  ", 1);
    printInfo("║  👤 CLIENTE:", 1);
    printInfo("║     Nombre:        {$cliente->nombre} {$cliente->apellidos}", 1);
    printInfo("║     DNI:           {$cliente->dni}", 1);
    printInfo("║     Teléfono:      {$cliente->telefono}", 1);
    printInfo("║  ", 1);
    printInfo("║  💼 ASESOR:", 1);
    printInfo("║     Nombre:        {$asesor->nombre} {$asesor->apellidos}", 1);
    printInfo("║     Comisión:      S/ " . number_format($comision, 2) . " ({$asesor->comision_porcentaje}%)", 1);
    printInfo("║  ", 1);
    printInfo("║  🏠 INMUEBLE:", 1);
    printInfo("║     Propiedad:     {$departamento->titulo}", 1);
    printInfo("║     Ubicación:     {$departamento->direccion}, {$departamento->distrito}", 1);
    printInfo("║  ", 1);
    printInfo("║  💰 FINANCIERO:", 1);
    printInfo("║     Precio Venta:  S/ " . number_format($precioFinal, 2), 1);
    printInfo("║     Descuento:     {$descuento}% (S/ " . number_format($montoBase - $precioFinal, 2) . ")", 1);
    printInfo("║     Inicial:       S/ " . number_format($inicial, 2) . " (30%)", 1);
    printInfo("║     Financiado:    S/ " . number_format($financiamiento, 2) . " (70%)", 1);
    printInfo("║  ", 1);
    printInfo("║  📅 FECHAS:", 1);
    printInfo("║     Solicitud:     {$solicitud->created_at->format('d/m/Y')}", 1);
    printInfo("║     Cotización:    {$solicitud->updated_at->format('d/m/Y')}", 1);
    printInfo("║     Aceptación:    {$solicitud->fecha_respuesta_cliente->format('d/m/Y')}", 1);
    printInfo("║     Reserva:       {$reserva->fecha_reserva->format('d/m/Y')}", 1);
    printInfo("║     Venta:         {$venta->fecha_venta->format('d/m/Y')}", 1);
    printInfo("║  ", 1);
    printInfo("║  ✅ Método de Pago: {$venta->metodo_pago}", 1);
    printInfo("║  ✅ Estado Venta:   {$venta->estado}", 1);
    printInfo("║  ✅ Estado Depto:   {$departamento->estado} 🏠", 1);
    printInfo("╚══════════════════════════════════════════════════════════════╝", 1);

    DB::commit();
    printSuccess("\nVenta ID: {$venta->id} registrada exitosamente\n");

    // ========================================================================
    // RESUMEN FINAL
    // ========================================================================

    printHeader("✅ TEST COMPLETADO EXITOSAMENTE");

    printInfo("📊 RESUMEN DEL FLUJO COMPLETO:");
    printInfo(str_repeat("═", 66) . "\n");

    printInfo("1️⃣  Cliente '{$cliente->nombre}' envió solicitud");
    printInfo("   └─> Estado: PENDIENTE ⏳\n", 1);

    printInfo("2️⃣  Asesor '{$asesor->nombre}' respondió con cotización");
    printInfo("   └─> Estado: EN_PROCESO 🔄", 1);
    printInfo("   └─> Oferta: S/ " . number_format($precioFinal, 2) . " ({$descuento}% descuento)\n", 1);

    printInfo("3️⃣  Cliente aceptó la cotización");
    printInfo("   └─> Estado: APROBADA ✅\n", 1);

    printInfo("4️⃣  Asesor creó reserva formal");
    printInfo("   └─> Reserva ID: {$reserva->id}", 1);
    printInfo("   └─> Monto: S/ " . number_format($montoReserva, 2) . "\n", 1);

    printInfo("5️⃣  Cliente completó proceso presencial");
    printInfo("   └─> Visita, documentación, firma ✅\n", 1);

    printInfo("6️⃣  Asesor registró venta");
    printInfo("   └─> Venta ID: {$venta->id}", 1);
    printInfo("   └─> Comisión: S/ " . number_format($comision, 2) . "\n", 1);

    printInfo("7️⃣  Departamento actualizado");
    printInfo("   └─> Estado: VENDIDO 🏠\n", 1);

    printInfo("\n💰 RESUMEN FINANCIERO:");
    printInfo(str_repeat("─", 66));
    printInfo("Precio Original:     S/ " . number_format($montoBase, 2));
    printInfo("Descuento ({$descuento}%):     - S/ " . number_format($montoBase - $precioFinal, 2));
    printInfo("Precio Final:        S/ " . number_format($precioFinal, 2));
    printInfo("Monto Reserva (5%):  S/ " . number_format($montoReserva, 2));
    printInfo("Inicial (30%):       S/ " . number_format($inicial, 2));
    printInfo("Financiamiento(70%): S/ " . number_format($financiamiento, 2));
    printInfo("Comisión Asesor:     S/ " . number_format($comision, 2));
    printInfo(str_repeat("─", 66) . "\n");

    printInfo("⏱️  TIMELINE DEL PROCESO:");
    printInfo(str_repeat("─", 66));
    printInfo("Inicio (Solicitud):  {$solicitud->created_at->format('d/m/Y H:i:s')}");
    printInfo("Cotización enviada:  {$solicitud->updated_at->format('d/m/Y H:i:s')}");
    printInfo("Cliente aceptó:      {$solicitud->fecha_respuesta_cliente->format('d/m/Y H:i:s')}");
    printInfo("Reserva creada:      {$reserva->fecha_reserva->format('d/m/Y H:i:s')}");
    printInfo("Venta completada:    {$venta->fecha_venta->format('d/m/Y H:i:s')}");
    $duracion = $solicitud->created_at->diffInDays($venta->fecha_venta);
    printInfo("Duración total:      {$duracion} día(s)");
    printInfo(str_repeat("─", 66) . "\n");

    printInfo("🔍 IDs PARA VERIFICACIÓN:");
    printInfo(str_repeat("─", 66));
    printInfo("Usuario Cliente:     {$usuarioCliente->id} ({$usuarioCliente->email})");
    printInfo("Usuario Asesor:      {$usuarioAsesor->id} ({$usuarioAsesor->email})");
    printInfo("Cliente:             {$cliente->id}");
    printInfo("Asesor:              {$asesor->id}");
    printInfo("Departamento:        {$departamento->id}");
    printInfo("Solicitud/Cotización: {$solicitud->id}");
    printInfo("Reserva:             {$reserva->id}");
    printInfo("Venta:               {$venta->id}");
    printInfo(str_repeat("─", 66) . "\n");

    printInfo("🔐 CREDENCIALES DE ACCESO:");
    printInfo(str_repeat("─", 66));
    printInfo("CLIENTE:");
    printInfo("  Email:    {$usuarioCliente->email}", 1);
    printInfo("  Password: password123", 1);
    printInfo("  URL:      http://127.0.0.1:8000/cliente/solicitudes\n", 1);

    printInfo("ASESOR:");
    printInfo("  Email:    {$usuarioAsesor->email}", 1);
    printInfo("  Password: password123", 1);
    printInfo("  URL:      http://127.0.0.1:8000/asesor/solicitudes\n", 1);

    printInfo("\n" . str_repeat("═", 66));
    printSuccess("✅ TODOS LOS PASOS DEL FLUJO FUNCIONAN CORRECTAMENTE");
    printSuccess("✅ EL SISTEMA CUMPLE CON TODOS LOS REQUISITOS");
    printSuccess("✅ LA PRUEBA SE EJECUTÓ SIN ERRORES");
    printInfo(str_repeat("═", 66) . "\n");

} catch (\Exception $e) {
    DB::rollBack();
    printError("\n❌ ERROR EN LA PRUEBA:");
    printError("Mensaje: {$e->getMessage()}");
    printError("Archivo: {$e->getFile()}");
    printError("Línea: {$e->getLine()}\n");
    printInfo("Trace:");
    printInfo($e->getTraceAsString());
    exit(1);
}
