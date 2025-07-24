<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Cliente;
use App\Models\Asesor;

class CuentasPruebaSeeder extends Seeder
{
    /**
     * Crear cuentas de prueba básicas para administrador, asesor y cliente
     */
    public function run(): void
    {
        $this->command->info('Creando cuentas de prueba...');

        // 1. CUENTA ADMINISTRADOR
        $admin = User::firstOrCreate([
            'email' => 'admin@inmobiliaria.com'
        ], [
            'name' => 'Administrador Sistema',
            'password' => bcrypt('password'),
            'role' => 'administrador',
            'email_verified_at' => now(),
        ]);

        $this->command->info('✓ Administrador creado: admin@inmobiliaria.com / password');

        // 2. CUENTA ASESOR
        $userAsesor = User::firstOrCreate([
            'email' => 'asesor@inmobiliaria.com'
        ], [
            'name' => 'María González',
            'password' => bcrypt('password'),
            'role' => 'asesor',
            'email_verified_at' => now(),
        ]);

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

        $this->command->info('✓ Asesor creado: asesor@inmobiliaria.com / password');

        // 3. CUENTA CLIENTE
        $userCliente = User::firstOrCreate([
            'email' => 'cliente@inmobiliaria.com'
        ], [
            'name' => 'Juan Pérez López',
            'password' => bcrypt('password'),
            'role' => 'cliente',
            'email_verified_at' => now(),
        ]);

        $cliente = Cliente::firstOrCreate([
            'usuario_id' => $userCliente->id
        ], [
            'dni' => '12345678',
            'direccion' => 'Av. Sol 789, Cusco',
        ]);

        $this->command->info('✓ Cliente creado: cliente@inmobiliaria.com / password');

        // 4. CUENTAS ADICIONALES PARA PRUEBAS

        // Asesor adicional
        $userAsesor2 = User::firstOrCreate([
            'email' => 'asesor2@inmobiliaria.com'
        ], [
            'name' => 'Carlos Mendoza',
            'password' => bcrypt('password'),
            'role' => 'asesor',
            'email_verified_at' => now(),
        ]);

        $asesor2 = Asesor::firstOrCreate([
            'usuario_id' => $userAsesor2->id
        ], [
            'nombre' => 'Carlos',
            'apellidos' => 'Mendoza Silva',
            'telefono' => '999777666',
            'documento' => '87654321',
            'direccion' => 'Jr. Los Incas 456, Cusco',
            'fecha_nacimiento' => '1985-08-20',
            'especialidad' => 'Ventas Comerciales',
            'experiencia' => 8,
            'estado' => 'activo',
            'comision_porcentaje' => 6.0,
            'fecha_contrato' => now()->subYears(3),
        ]);

        $this->command->info('✓ Asesor adicional creado: asesor2@inmobiliaria.com / password');

        // Cliente adicional
        $userCliente2 = User::firstOrCreate([
            'email' => 'cliente2@inmobiliaria.com'
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

        $this->command->info('✓ Cliente adicional creado: cliente2@inmobiliaria.com / password');

        $this->command->info('');
        $this->command->info('=== CUENTAS DE PRUEBA CREADAS ===');
        $this->command->info('Administrador: admin@inmobiliaria.com / password');
        $this->command->info('Asesor 1: asesor@inmobiliaria.com / password');
        $this->command->info('Asesor 2: asesor2@inmobiliaria.com / password');
        $this->command->info('Cliente 1: cliente@inmobiliaria.com / password');
        $this->command->info('Cliente 2: cliente2@inmobiliaria.com / password');
        $this->command->info('');
        $this->command->info('Puedes iniciar sesión en: http://localhost:8000/login');
    }
}
