<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        echo "\n=== INICIANDO SEEDING DE DATOS DE PRUEBA ===\n\n";
        
        // Crear las 4 cuentas de usuario esenciales para testing
        $this->call([
            CuentasLimpiasSeeder::class,
            DepartamentosBasicosSeeder::class,
        ]);
        
        echo "\n=== SEEDING COMPLETADO ===\n";
        echo "🎯 Sistema listo para testing con datos mínimos\n";
        echo "📋 Cuentas y departamentos básicos creados\n";
        echo "🧪 Listo para probar funcionalidades básicas\n\n";
    }
}
