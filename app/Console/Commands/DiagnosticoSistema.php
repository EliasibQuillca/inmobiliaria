<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use App\Models\User;
use App\Models\Departamento;
use App\Models\Venta;

class DiagnosticoSistema extends Command
{
    protected $signature = 'sistema:diagnostico';
    protected $description = 'Ejecuta un diagnóstico completo del sistema inmobiliario';

    public function handle()
    {
        $this->info('🔍 Iniciando diagnóstico del sistema...');
        $this->newLine();

        // 1. Verificar conexión a base de datos
        $this->verificarBaseDatos();
        
        // 2. Verificar modelos y relaciones
        $this->verificarModelos();
        
        // 3. Verificar archivos y storage
        $this->verificarStorage();
        
        // 4. Verificar usuarios y roles
        $this->verificarUsuarios();
        
        // 5. Verificar datos inconsistentes
        $this->verificarConsistenciaDatos();
        
        $this->info('✅ Diagnóstico completado');
    }

    private function verificarBaseDatos()
    {
        $this->info('📊 Verificando base de datos...');
        
        try {
            DB::connection()->getPdo();
            $this->line('✅ Conexión a base de datos: OK');
            
            $tablas = DB::select('SHOW TABLES');
            $this->line("✅ Tablas encontradas: " . count($tablas));
            
        } catch (\Exception $e) {
            $this->error('❌ Error de base de datos: ' . $e->getMessage());
        }
    }

    private function verificarModelos()
    {
        $this->info('🏗️ Verificando modelos...');
        
        $modelos = [
            'Users' => User::class,
            'Departamentos' => Departamento::class,
            'Ventas' => Venta::class,
        ];

        foreach ($modelos as $nombre => $clase) {
            try {
                $count = $clase::count();
                $this->line("✅ {$nombre}: {$count} registros");
            } catch (\Exception $e) {
                $this->error("❌ Error en {$nombre}: " . $e->getMessage());
            }
        }
    }

    private function verificarStorage()
    {
        $this->info('💾 Verificando storage...');
        
        if (Storage::exists('public')) {
            $this->line('✅ Directorio storage/public: OK');
        } else {
            $this->error('❌ Directorio storage/public no existe');
        }

        if (file_exists(public_path('storage'))) {
            $this->line('✅ Symlink storage: OK');
        } else {
            $this->warn('⚠️ Symlink storage no existe - ejecutar: php artisan storage:link');
        }
    }

    private function verificarUsuarios()
    {
        $this->info('👥 Verificando usuarios y roles...');
        
        $roles = ['administrador', 'asesor', 'cliente'];
        
        foreach ($roles as $rol) {
            $count = User::where('role', $rol)->count();
            $this->line("✅ Usuarios {$rol}: {$count}");
        }
    }

    private function verificarConsistenciaDatos()
    {
        $this->info('🔍 Verificando consistencia de datos...');
        
        // Verificar ventas sin reserva
        $ventasSinReserva = Venta::whereDoesntHave('reserva')->count();
        if ($ventasSinReserva > 0) {
            $this->warn("⚠️ Ventas sin reserva: {$ventasSinReserva}");
        }

        // Verificar usuarios sin email
        $usuariosSinEmail = User::whereNull('email')->orWhere('email', '')->count();
        if ($usuariosSinEmail > 0) {
            $this->error("❌ Usuarios sin email: {$usuariosSinEmail}");
        }

        // Verificar duplicados de email
        $emailsDuplicados = User::select('email')
            ->groupBy('email')
            ->havingRaw('COUNT(*) > 1')
            ->count();
        if ($emailsDuplicados > 0) {
            $this->error("❌ Emails duplicados: {$emailsDuplicados}");
        }

        if ($ventasSinReserva == 0 && $usuariosSinEmail == 0 && $emailsDuplicados == 0) {
            $this->line("✅ Consistencia de datos: OK");
        }
    }
}
