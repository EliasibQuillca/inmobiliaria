<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Cliente;
use App\Models\Asesor;
use App\Models\Departamento;
use App\Models\Cotizacion;
use App\Models\Reserva;
use App\Models\Venta;

class VentasTestSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Crear usuario administrador si no existe
        $admin = User::firstOrCreate([
            'email' => 'admin@inmobiliaria.com'
        ], [
            'name' => 'Administrador Sistema',
            'password' => bcrypt('password'),
            'role' => 'administrador',
            'email_verified_at' => now(),
        ]);

        // Crear usuario asesor
        $userAsesor = User::firstOrCreate([
            'email' => 'asesor@inmobiliaria.com'
        ], [
            'name' => 'María González',
            'password' => bcrypt('password'),
            'role' => 'asesor',
            'email_verified_at' => now(),
        ]);

        // Crear asesor
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

        // Crear usuario cliente
        $userCliente = User::firstOrCreate([
            'email' => 'juan.perez@email.com'
        ], [
            'name' => 'Juan Pérez López',
            'password' => bcrypt('password'),
            'role' => 'cliente',
            'email_verified_at' => now(),
        ]);

        // Crear cliente
        $cliente = Cliente::firstOrCreate([
            'usuario_id' => $userCliente->id
        ], [
            'asesor_id' => $asesor->id,
            'nombre' => 'Juan Pérez López',
            'telefono' => '987654321',
            'email' => 'juan.perez@email.com',
        ]);

        // Crear departamentos de prueba
        $departamento1 = Departamento::firstOrCreate([
            'titulo' => 'Departamento Moderno Centro'
        ], [
            'descripcion' => 'Hermoso departamento en el centro de la ciudad',
            'ubicacion' => 'Centro Histórico, Cusco',
            'precio' => 180000.00,
            'habitaciones' => 3,
            'banos' => 2,
            'area' => 85.5,
            'disponible' => false,
            'estado' => 'reservado',
        ]);

        $departamento2 = Departamento::firstOrCreate([
            'titulo' => 'Apartamento San Blas'
        ], [
            'descripcion' => 'Acogedor apartamento en San Blas',
            'ubicacion' => 'San Blas, Cusco',
            'precio' => 150000.00,
            'habitaciones' => 2,
            'banos' => 1,
            'area' => 65.0,
            'disponible' => false,
            'estado' => 'vendido',
        ]);

        // Crear cotizaciones
        $cotizacion1 = Cotizacion::firstOrCreate([
            'cliente_id' => $cliente->id,
            'departamento_id' => $departamento1->id,
        ], [
            'asesor_id' => $asesor->id,
            'precio_ofertado' => 175000.00,
            'estado' => 'aceptada',
            'fecha_expiracion' => now()->addDays(30),
            'observaciones' => 'Cliente interesado, precio negociado',
        ]);

        $cotizacion2 = Cotizacion::firstOrCreate([
            'cliente_id' => $cliente->id,
            'departamento_id' => $departamento2->id,
        ], [
            'asesor_id' => $asesor->id,
            'precio_ofertado' => 150000.00,
            'estado' => 'aceptada',
            'fecha_expiracion' => now()->subDays(5),
            'observaciones' => 'Venta completada exitosamente',
        ]);

        // Crear reservas
        $reserva1 = Reserva::firstOrCreate([
            'cotizacion_id' => $cotizacion1->id,
        ], [
            'asesor_id' => $asesor->id,
            'departamento_id' => $departamento1->id,
            'monto_reserva' => 17500.00,
            'fecha_vencimiento' => now()->addDays(15),
            'estado' => 'confirmada',
            'observaciones' => 'Reserva confirmada, pendiente documentos',
        ]);

        $reserva2 = Reserva::firstOrCreate([
            'cotizacion_id' => $cotizacion2->id,
        ], [
            'asesor_id' => $asesor->id,
            'departamento_id' => $departamento2->id,
            'monto_reserva' => 15000.00,
            'fecha_vencimiento' => now()->subDays(10),
            'estado' => 'confirmada',
            'observaciones' => 'Reserva confirmada y documentos entregados',
        ]);

        // Crear ventas
        $venta1 = Venta::firstOrCreate([
            'reserva_id' => $reserva1->id,
        ], [
            'fecha_venta' => now()->subDays(2),
            'monto_final' => 175000.00,
            'documentos_entregados' => false,
            'observaciones' => 'Venta registrada, pendiente entrega de documentos',
        ]);

        $venta2 = Venta::firstOrCreate([
            'reserva_id' => $reserva2->id,
        ], [
            'fecha_venta' => now()->subDays(7),
            'monto_final' => 150000.00,
            'documentos_entregados' => true,
            'observaciones' => 'Venta completada, documentos entregados al cliente',
        ]);

        $this->command->info('✅ Datos de prueba para ventas creados exitosamente:');
        $this->command->info("- Administrador: admin@inmobiliaria.com / password");
        $this->command->info("- Asesor: asesor@inmobiliaria.com / password");
        $this->command->info("- Cliente: juan.perez@email.com / password");
        $this->command->info("- 2 Departamentos creados");
        $this->command->info("- 2 Cotizaciones aceptadas");
        $this->command->info("- 2 Reservas confirmadas");
        $this->command->info("- 2 Ventas registradas (1 con documentos pendientes, 1 completada)");
    }
}
