<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;

class VerificarErrores extends Command
{
    protected $signature = 'sistema:errores';
    protected $description = 'Verifica y analiza los logs de errores del sistema';

    public function handle()
    {
        $this->info('🔍 Analizando errores del sistema...');
        $this->newLine();

        $this->analizarLogsLaravel();
        $this->analizarErroresWeb();
        $this->verificarPermisos();
        $this->mostrarRecomendaciones();
    }

    private function analizarLogsLaravel()
    {
        $this->info('📋 Analizando logs de Laravel...');
        
        $logPath = storage_path('logs/laravel.log');
        
        if (!File::exists($logPath)) {
            $this->warn('⚠️ No se encontró archivo de log de Laravel');
            return;
        }

        $contenido = File::get($logPath);
        $lineas = explode("\n", $contenido);
        
        $errores = 0;
        $warnings = 0;
        $hoy = now()->format('Y-m-d');
        
        foreach ($lineas as $linea) {
            if (str_contains($linea, $hoy)) {
                if (str_contains($linea, '[ERROR]')) $errores++;
                if (str_contains($linea, '[WARNING]')) $warnings++;
            }
        }

        $this->line("📊 Errores de hoy: {$errores}");
        $this->line("⚠️ Warnings de hoy: {$warnings}");
    }

    private function analizarErroresWeb()
    {
        $this->info('🌐 Verificando errores web comunes...');
        
        // Verificar si hay rutas rotas
        $this->verificarRutas();
        
        // Verificar middleware
        $this->verificarMiddleware();
    }

    private function verificarRutas()
    {
        try {
            $routes = app('router')->getRoutes();
            $rutasCount = count($routes->getRoutes());
            $this->line("✅ Rutas registradas: " . $rutasCount);
        } catch (\Exception $e) {
            $this->error("❌ Error verificando rutas: " . $e->getMessage());
        }
    }

    private function verificarMiddleware()
    {
        $middlewares = [
            'auth' => \Illuminate\Auth\Middleware\Authenticate::class,
            'role' => \App\Http\Middleware\RoleMiddleware::class,
        ];

        foreach ($middlewares as $alias => $clase) {
            if (class_exists($clase)) {
                $this->line("✅ Middleware '{$alias}': OK");
            } else {
                $this->error("❌ Middleware '{$alias}': No encontrado");
            }
        }
    }

    private function verificarPermisos()
    {
        $this->info('🔐 Verificando permisos de archivos...');
        
        $directorios = [
            storage_path(),
            storage_path('logs'),
            storage_path('app'),
            public_path('storage'),
        ];

        foreach ($directorios as $dir) {
            if (is_writable($dir)) {
                $this->line("✅ Permisos {$dir}: OK");
            } else {
                $this->error("❌ Sin permisos de escritura: {$dir}");
            }
        }
    }

    private function mostrarRecomendaciones()
    {
        $this->newLine();
        $this->info('💡 Recomendaciones:');
        $this->line('1. Revisar logs regularmente: php artisan sistema:errores');
        $this->line('2. Limpiar logs antiguos: php artisan log:clear');
        $this->line('3. Optimizar aplicación: php artisan optimize');
        $this->line('4. Verificar cache: php artisan cache:clear');
        $this->line('5. Ejecutar diagnóstico: php artisan sistema:diagnostico');
    }
}
