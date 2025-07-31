<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Cliente;
use App\Models\Asesor;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class CuentasLimpiasSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        echo "\n=== LIMPIANDO Y CREANDO 4 CUENTAS ESPECÍFICAS ===\n\n";

        // Limpiar todas las tablas relacionadas
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        
        // Eliminar registros existentes
        Cliente::truncate();
        Asesor::truncate();
        User::truncate();
        
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        echo "🗑️  Cuentas anteriores eliminadas\n\n";

        // 1. Usuario Administrador
        $admin = User::create([
            'name' => 'Admin Sistema',
            'email' => 'admin@test.com',
            'password' => Hash::make('admin123'),
            'role' => 'administrador',
            'email_verified_at' => now(),
        ]);

        echo "✅ Admin creado: admin@test.com / admin123\n";

        // 2. Usuario Asesor
        $asesorUser = User::create([
            'name' => 'Asesor Prueba',
            'email' => 'asesor@test.com',
            'password' => Hash::make('asesor123'),
            'role' => 'asesor',
            'email_verified_at' => now(),
        ]);

        $asesor = Asesor::create([
            'usuario_id' => $asesorUser->id,
            'fecha_contrato' => now(),
            'nombre' => 'Asesor',
            'apellidos' => 'De Prueba',
            'telefono' => '123456789',
            'documento' => '33333333',
            'direccion' => 'Dirección Asesor',
            'fecha_nacimiento' => '1990-01-01',
            'especialidad' => 'Ventas',
            'experiencia' => 5,
            'comision_porcentaje' => 5.0,
        ]);

        echo "✅ Asesor creado: asesor@test.com / asesor123\n";

        // 3. Cliente 1
        $cliente1User = User::create([
            'name' => 'Cliente Uno',
            'email' => 'cliente1@test.com',
            'password' => Hash::make('cliente123'),
            'role' => 'cliente',
            'email_verified_at' => now(),
        ]);

        $cliente1 = Cliente::create([
            'usuario_id' => $cliente1User->id,
            'dni' => '11111111',
            'telefono' => '987654321',
            'direccion' => 'Dirección Cliente 1',
        ]);

        echo "✅ Cliente 1 creado: cliente1@test.com / cliente123\n";

        // 4. Cliente 2
        $cliente2User = User::create([
            'name' => 'Cliente Dos',
            'email' => 'cliente2@test.com',
            'password' => Hash::make('cliente123'),
            'role' => 'cliente',
            'email_verified_at' => now(),
        ]);

        $cliente2 = Cliente::create([
            'usuario_id' => $cliente2User->id,
            'dni' => '22222222',
            'telefono' => '567890123',
            'direccion' => 'Dirección Cliente 2',
        ]);

        echo "✅ Cliente 2 creado: cliente2@test.com / cliente123\n";

        echo "\n=== RESUMEN DE CUENTAS CREADAS ===\n";
        echo "👤 Admin: admin@test.com / admin123 → Dashboard Admin\n";
        echo "🏢 Asesor: asesor@test.com / asesor123 → Dashboard Asesor\n";
        echo "👨 Cliente 1: cliente1@test.com / cliente123 → Catálogo\n";
        echo "👩 Cliente 2: cliente2@test.com / cliente123 → Catálogo\n";
        echo "\n✅ Sistema de autenticación con redirección por roles configurado!\n\n";
    }
}
