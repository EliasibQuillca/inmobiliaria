<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class ResetearYSembrarBaseDatos extends Command
{
    /**
     * El nombre y la firma del comando.
     *
     * @var string
     */
    protected $signature = 'debug:reset-db 
                            {--quick : Solo ejecutar seeders principales sin migraciones}
                            {--asesor : Crear usuarios asesores de prueba adicionales}
                            {--clientes : Crear datos de cliente para pruebas}
                            {--departamentos= : Número de departamentos a crear (default: 20)}';

    /**
     * La descripción del comando.
     *
     * @var string
     */
    protected $description = 'Reestablece la base de datos para entorno de pruebas y debugging';

    /**
     * Crear una nueva instancia del comando.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Ejecutar el comando.
     *
     * @return mixed
     */
    public function handle()
    {
        $startTime = microtime(true);

        if ($this->option('quick')) {
            $this->info('Modo rápido: ejecutando solo seeders principales...');
            $this->call('db:seed', [
                '--class' => 'DatabaseSeeder',
                '--force' => true
            ]);
        } else {
            $this->info('Reestableciendo base de datos completa...');
            
            // Verificar tablas antes de migrar
            $this->info('Verificando estado de la base de datos...');
            $hasTables = Schema::hasTable('users') && 
                         Schema::hasTable('departamentos') && 
                         Schema::hasTable('ventas');
            
            if ($hasTables) {
                $userCount = DB::table('users')->count();
                $deptoCount = DB::table('departamentos')->count();
                $ventasCount = DB::table('ventas')->count();
                
                $this->info("Estado actual: {$userCount} usuarios, {$deptoCount} departamentos, {$ventasCount} ventas");
            } else {
                $this->warn('Base de datos vacía o incompleta');
            }

            // Confirmar antes de eliminar datos
            if (!$this->confirm('¿Estás seguro de que quieres reestablecer TODA la base de datos?', true)) {
                $this->info('Operación cancelada');
                return;
            }

            $this->call('migrate:fresh', [
                '--force' => true,
                '--seed' => true
            ]);
        }

        // Crear datos adicionales según las opciones
        $departamentos = $this->option('departamentos') ?? 20;
        
        if ((int)$departamentos > 20) {
            $this->info("Creando {$departamentos} departamentos adicionales para pruebas...");
            $this->call('db:seed', [
                '--class' => 'DepartamentosExtendidoSeeder',
                '--force' => true
            ]);
        }

        if ($this->option('asesor')) {
            $this->info('Creando usuarios asesores para pruebas...');
            $this->call('db:seed', [
                '--class' => 'PruebasAsesorSeeder',
                '--force' => true
            ]);
        }
        
        if ($this->option('clientes')) {
            $this->info('Creando datos de cliente para pruebas...');
            $this->call('db:seed', [
                '--class' => 'PruebasClienteSeeder',
                '--force' => true
            ]);
        }

        // Mostrar resumen de resultados
        $endTime = microtime(true);
        $executionTime = round($endTime - $startTime, 2);

        $this->newLine();
        $this->info("✅ Base de datos reestablecida correctamente en {$executionTime} segundos");
        $this->info('Resumen:');
        $this->table(
            ['Tabla', 'Registros'],
            [
                ['users', DB::table('users')->count()],
                ['departamentos', DB::table('departamentos')->count()],
                ['imagenes', DB::table('imagenes')->count()],
                ['ventas', DB::table('ventas')->count()],
                ['cotizaciones', DB::table('cotizaciones')->count()],
            ]
        );

        $this->info('Usuarios para pruebas:');
        $this->table(
            ['Rol', 'Email', 'Contraseña'],
            [
                ['admin', 'admin@example.com', 'password'],
                ['asesor', 'asesor@example.com', 'password'],
                ['cliente', 'cliente@example.com', 'password'],
                ['propietario', 'propietario@example.com', 'password'],
            ]
        );

        $this->newLine();
        $this->info('🔍 Comando para realizar pruebas específicas:');
        $this->line('  php artisan test --filter=VentaTest');
        $this->line('  php artisan test --group=cliente');
    }
}