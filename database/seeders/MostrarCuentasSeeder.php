<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;

class MostrarCuentasSeeder extends Seeder
{
    /**
     * Mostrar las cuentas de prueba disponibles
     */
    public function run(): void
    {
        $this->command->info('=== CUENTAS DE PRUEBA DISPONIBLES ===');
        $this->command->info('');

        $usuarios = User::whereIn('role', ['administrador', 'asesor', 'cliente'])
                       ->orderBy('role')
                       ->get(['name', 'email', 'role']);

        foreach ($usuarios as $usuario) {
            $role = ucfirst($usuario->role);
            $this->command->info("{$role}: {$usuario->email} / password");
            $this->command->info("  Nombre: {$usuario->name}");
            $this->command->info('');
        }

        $this->command->info('URL de acceso: http://localhost:8000/login');
        $this->command->info('');
        $this->command->info('=== RUTAS ADMINISTRATIVAS ===');
        $this->command->info('Dashboard Admin: http://localhost:8000/admin/dashboard');
        $this->command->info('Gestión de Ventas: http://localhost:8000/admin/ventas');
        $this->command->info('Test de Ventas: http://localhost:8000/admin/ventas-test');
        $this->command->info('');
    }
}
