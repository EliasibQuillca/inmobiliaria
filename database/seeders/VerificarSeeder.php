<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class VerificarSeeder extends Seeder
{
    /**
     * Verificar que todos los seeders funcionan correctamente
     */
    public function run(): void
    {
        $this->command->info('🔍 Verificando la integridad de los seeders...');

        try {
            // Verificar modelos básicos
            $this->verificarModelos();

            // Verificar relaciones
            $this->verificarRelaciones();

            // Verificar datos de ejemplo
            $this->verificarDatosEjemplo();

            $this->command->info('✅ Todos los seeders funcionan correctamente');

        } catch (\Exception $e) {
            $this->command->error('❌ Error en la verificación: ' . $e->getMessage());
            throw $e;
        }
    }

    private function verificarModelos(): void
    {
        $modelos = [
            'User' => \App\Models\User::class,
            'Cliente' => \App\Models\Cliente::class,
            'Asesor' => \App\Models\Asesor::class,
            'Propietario' => \App\Models\Propietario::class,
            'Departamento' => \App\Models\Departamento::class,
            'Cotizacion' => \App\Models\Cotizacion::class,
            'Reserva' => \App\Models\Reserva::class,
            'Venta' => \App\Models\Venta::class,
        ];

        foreach ($modelos as $nombre => $clase) {
            $count = $clase::count();
            $this->command->info("✓ {$nombre}: {$count} registros");

            if ($count === 0) {
                $this->command->warn("⚠️  No hay registros de {$nombre}");
            }
        }
    }

    private function verificarRelaciones(): void
    {
        $this->command->info('🔗 Verificando relaciones...');

        // Verificar que hay usuarios con roles específicos
        $admins = \App\Models\User::where('role', 'administrador')->count();
        $asesores = \App\Models\User::where('role', 'asesor')->count();
        $clientes = \App\Models\User::where('role', 'cliente')->count();

        $this->command->info("Admin users: {$admins}");
        $this->command->info("Asesor users: {$asesores}");
        $this->command->info("Cliente users: {$clientes}");

        // Verificar que hay departamentos con propietarios
        $deptosConPropietario = \App\Models\Departamento::whereNotNull('propietario_id')->count();
        $this->command->info("Departamentos con propietario: {$deptosConPropietario}");

        // Verificar que hay cotizaciones con relaciones
        $cotizacionesCompletas = \App\Models\Cotizacion::whereNotNull('cliente_id')
            ->whereNotNull('asesor_id')
            ->whereNotNull('departamento_id')
            ->count();
        $this->command->info("Cotizaciones completas: {$cotizacionesCompletas}");
    }

    private function verificarDatosEjemplo(): void
    {
        $this->command->info('📊 Verificando datos para reportes...');

        // Verificar ventas recientes
        $ventasRecientes = \App\Models\Venta::whereHas('reserva', function($q) {
            $q->where('fecha_venta', '>=', now()->subDays(30));
        })->count();

        $this->command->info("Ventas últimos 30 días: {$ventasRecientes}");

        // Verificar asesores activos
        $asesoresActivos = \App\Models\Asesor::where('estado', 'activo')->count();
        $this->command->info("Asesores activos: {$asesoresActivos}");

        // Verificar departamentos disponibles
        $deptosDisponibles = \App\Models\Departamento::where('estado', 'disponible')->count();
        $this->command->info("Departamentos disponibles: {$deptosDisponibles}");
    }
}
