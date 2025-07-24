<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Cliente;
use App\Models\Asesor;
use App\Models\Departamento;
use App\Models\Cotizacion;
use App\Models\Reserva;
use App\Models\Propietario;

class FlujoDatosCompletosSeeder extends Seeder
{
    /**
     * Crear flujo completo de datos: Usuarios → Departamentos → Cotizaciones → Reservas
     */
    public function run(): void
    {
        $this->command->info('🚀 Creando flujo completo de datos...');

        // 1. CREAR USUARIOS BASE
        $admin = User::firstOrCreate([
            'email' => 'admin@inmobiliaria.com'
        ], [
            'name' => 'Administrador Sistema',
            'password' => bcrypt('password'),
            'role' => 'administrador',
            'email_verified_at' => now(),
        ]);

        $userAsesor = User::firstOrCreate([
            'email' => 'asesor@inmobiliaria.com'
        ], [
            'name' => 'María González',
            'password' => bcrypt('password'),
            'role' => 'asesor',
            'email_verified_at' => now(),
        ]);

        $userCliente = User::firstOrCreate([
            'email' => 'cliente@inmobiliaria.com'
        ], [
            'name' => 'Juan Pérez López',
            'password' => bcrypt('password'),
            'role' => 'cliente',
            'email_verified_at' => now(),
        ]);

        $this->command->info('✓ Usuarios base creados');

        // 2. CREAR ASESOR
        $asesor = Asesor::firstOrCreate([
            'usuario_id' => $userAsesor->id
        ], [
            'nombre' => 'María',
            'apellidos' => 'González Vargas',
            'telefono' => '999888777',
            'documento' => '12345678',
            'direccion' => 'Av. Principal 123, Cusco',
            'fecha_nacimiento' => '1990-05-15',
            'especialidad' => 'Ventas Residenciales',
            'experiencia' => 5,
            'estado' => 'activo',
            'comision_porcentaje' => 5.0,
            'fecha_contrato' => now()->subYears(2),
        ]);

        $this->command->info('✓ Asesor creado');

        // 3. CREAR CLIENTE
        $cliente = Cliente::firstOrCreate([
            'usuario_id' => $userCliente->id
        ], [
            'dni' => '12345678',
            'direccion' => 'Av. Sol 789, Cusco',
        ]);

        $this->command->info('✓ Cliente creado');

        // 4. CREAR PROPIETARIO
        $propietario = Propietario::firstOrCreate([
            'nombre' => 'Carlos Mendoza Silva'
        ], [
            'dni' => '87654321',
            'tipo' => 'natural',
            'contacto' => '987654321',
            'direccion' => 'Jr. Comercio 456, Cusco',
            'registrado_sunarp' => true,
        ]);

        $this->command->info('✓ Propietario creado');

        // 5. CREAR DEPARTAMENTOS DISPONIBLES
        $departamentos = [
            [
                'codigo' => 'DEPT-001',
                'titulo' => 'Departamento Moderno Centro',
                'descripcion' => 'Hermoso departamento en el centro de la ciudad con vista panorámica',
                'ubicacion' => 'Centro Histórico, Cusco',
                'direccion' => 'Av. El Sol 123, Centro Histórico',
                'precio' => 180000.00,
                'dormitorios' => 3,
                'banos' => 2,
                'area_total' => 120.00,
                'estacionamientos' => 1,
                'estado' => 'disponible',
                'disponible' => true,
            ],
            [
                'codigo' => 'DEPT-002',
                'titulo' => 'Penthouse de Lujo',
                'descripcion' => 'Exclusivo penthouse con terraza privada y acabados de primera',
                'ubicacion' => 'San Blas, Cusco',
                'direccion' => 'Cuesta San Blas 456, San Blas',
                'precio' => 350000.00,
                'dormitorios' => 4,
                'banos' => 3,
                'area_total' => 200.00,
                'estacionamientos' => 2,
                'estado' => 'disponible',
                'disponible' => true,
            ],
            [
                'codigo' => 'DEPT-003',
                'titulo' => 'Departamento Familiar',
                'descripcion' => 'Ideal para familias, ubicado en zona residencial tranquila',
                'ubicacion' => 'Wanchaq, Cusco',
                'direccion' => 'Av. La Cultura 789, Wanchaq',
                'precio' => 120000.00,
                'dormitorios' => 2,
                'banos' => 2,
                'area_total' => 80.00,
                'estacionamientos' => 1,
                'estado' => 'disponible',
                'disponible' => true,
            ]
        ];

        $departamentosCreados = [];
        foreach ($departamentos as $deptoData) {
            $depto = Departamento::firstOrCreate([
                'codigo' => $deptoData['codigo']
            ], array_merge($deptoData, [
                'propietario_id' => $propietario->id,
            ]));
            $departamentosCreados[] = $depto;
        }

        $this->command->info('✓ ' . count($departamentosCreados) . ' departamentos creados');

        // 6. CREAR COTIZACIONES
        $cotizaciones = [];
        foreach ($departamentosCreados as $index => $departamento) {
            $cotizacion = Cotizacion::firstOrCreate([
                'cliente_id' => $cliente->id,
                'asesor_id' => $asesor->id,
                'departamento_id' => $departamento->id,
            ], [
                'fecha' => now()->subDays(rand(10, 30)),
                'fecha_validez' => now()->addDays(30), // Válida por 30 días
                'monto' => $departamento->precio * (1 - rand(0, 10) / 100), // Descuento hasta 10%
                'descuento' => rand(0, 10), // Descuento en porcentaje
                'estado' => 'aprobada', // Estado aprobado para poder hacer reserva
                'notas' => 'Cotización generada para pruebas del sistema',
                'condiciones' => 'Precio válido por 30 días calendario',
            ]);
            $cotizaciones[] = $cotizacion;
        }

        $this->command->info('✓ ' . count($cotizaciones) . ' cotizaciones creadas');

        // 7. CREAR RESERVAS CONFIRMADAS (listas para venta)
        $reservasCreadas = [];
        foreach ($cotizaciones as $index => $cotizacion) {
            $reserva = Reserva::firstOrCreate([
                'cotizacion_id' => $cotizacion->id,
            ], [
                'cliente_id' => $cliente->id,
                'asesor_id' => $asesor->id,
                'departamento_id' => $cotizacion->departamento_id,
                'fecha_reserva' => now()->subDays(rand(5, 15)),
                'fecha_inicio' => now()->subDays(rand(1, 5)),
                'fecha_fin' => now()->addDays(rand(30, 60)),
                'monto_reserva' => $cotizacion->monto * 0.1, // 10% de reserva
                'monto_total' => $cotizacion->monto,
                'estado' => 'confirmada', // Estado listo para venta
                'notas' => 'Reserva confirmada - Lista para procesar venta',
                'condiciones' => 'Pago del 90% restante al momento de la venta',
            ]);
            $reservasCreadas[] = $reserva;
        }

        $this->command->info('✓ ' . count($reservasCreadas) . ' reservas confirmadas creadas');

        // 8. CREAR CLIENTES Y ASESORES ADICIONALES
        $userCliente2 = User::firstOrCreate([
            'email' => 'ana.rodriguez@email.com'
        ], [
            'name' => 'Ana Rodriguez',
            'password' => bcrypt('password'),
            'role' => 'cliente',
            'email_verified_at' => now(),
        ]);

        $cliente2 = Cliente::firstOrCreate([
            'usuario_id' => $userCliente2->id
        ], [
            'dni' => '87654321',
            'direccion' => 'Jr. Comercio 321, Cusco',
        ]);

        // Crear cotización y reserva adicional
        if (count($departamentosCreados) > 1) {
            $cotizacion2 = Cotizacion::firstOrCreate([
                'cliente_id' => $cliente2->id,
                'asesor_id' => $asesor->id,
                'departamento_id' => $departamentosCreados[1]->id,
            ], [
                'fecha' => now()->subDays(7),
                'fecha_validez' => now()->addDays(23),
                'monto' => $departamentosCreados[1]->precio * 0.95,
                'descuento' => 5.0,
                'estado' => 'aprobada',
                'notas' => 'Segunda cotización para cliente Ana',
                'condiciones' => 'Cliente preferencial - Precio especial',
            ]);

            $reserva2 = Reserva::firstOrCreate([
                'cotizacion_id' => $cotizacion2->id,
            ], [
                'cliente_id' => $cliente2->id,
                'asesor_id' => $asesor->id,
                'departamento_id' => $cotizacion2->departamento_id,
                'fecha_reserva' => now()->subDays(3),
                'fecha_inicio' => now()->subDay(),
                'fecha_fin' => now()->addDays(45),
                'monto_reserva' => $cotizacion2->monto * 0.1,
                'monto_total' => $cotizacion2->monto,
                'estado' => 'confirmada',
                'notas' => 'Segunda reserva confirmada',
                'condiciones' => 'Cliente preferencial - Condiciones especiales',
            ]);
        }

        $this->command->info('✓ Datos adicionales creados');

        // RESUMEN FINAL
        $this->command->info('');
        $this->command->info('🎉 FLUJO COMPLETO CREADO EXITOSAMENTE');
        $this->command->info('');

        // ✅ CREAR RESERVAS COMPLETADAS PARA VENTAS
        $this->crearReservasCompletadas();

        $this->command->info('=== DATOS DISPONIBLES ===');
        $this->command->info('📊 Usuarios: ' . User::count());
        $this->command->info('🏢 Departamentos: ' . Departamento::count());
        $this->command->info('💰 Cotizaciones: ' . Cotizacion::count());
        $this->command->info('📋 Reservas Completadas: ' . Reserva::where('estado', 'completada')->count());
        $this->command->info('');
        $this->command->info('=== ACCESO AL SISTEMA ===');
        $this->command->info('🔑 Admin: admin@inmobiliaria.com / password');
        $this->command->info('👨‍💼 Asesor: asesor@inmobiliaria.com / password');
        $this->command->info('👤 Cliente: cliente@inmobiliaria.com / password');
        $this->command->info('');
        $this->command->info('🌐 URL: http://localhost:8000/login');
        $this->command->info('📈 Ventas: http://localhost:8000/admin/ventas');
        $this->command->info('➕ Nueva Venta: http://localhost:8000/admin/ventas/crear');
    }

    /**
     * Crear reservas completadas para poder generar ventas
     */
    private function crearReservasCompletadas(): void
    {
        $this->command->info('🔄 Creando reservas completadas...');

        $cotizaciones = Cotizacion::with(['cliente', 'asesor', 'departamento'])->get();
        $reservasCreadas = 0;

        foreach ($cotizaciones as $cotizacion) {
            try {
                // Verificar que no exista ya una reserva
                if (Reserva::where('cotizacion_id', $cotizacion->id)->exists()) {
                    continue;
                }

                $reserva = Reserva::create([
                    'cotizacion_id' => $cotizacion->id,
                    'cliente_id' => $cotizacion->cliente_id,
                    'asesor_id' => $cotizacion->asesor_id,
                    'departamento_id' => $cotizacion->departamento_id,
                    'fecha_reserva' => now()->subDays(rand(5, 20)),
                    'fecha_inicio' => now(),
                    'fecha_fin' => now()->addDays(30),
                    'monto_reserva' => $cotizacion->precio_final * 0.1,
                    'monto_total' => $cotizacion->precio_final,
                    'estado' => 'completada',
                    'notas' => 'Reserva lista para venta - Generada automáticamente',
                    'condiciones' => 'Válida por 30 días - Lista para crear venta'
                ]);

                $reservasCreadas++;

            } catch (\Exception $e) {
                $this->command->error("❌ Error creando reserva: " . $e->getMessage());
            }
        }

        $this->command->info("✅ Reservas completadas creadas: {$reservasCreadas}");
    }
}
