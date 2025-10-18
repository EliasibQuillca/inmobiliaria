<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;

class DiagnosticoInmobiliaria extends Command
{
    protected $signature = 'inmobiliaria:diagnostico
                           {--fix : Intenta corregir problemas automáticamente}
                           {--deep : Realiza un análisis más profundo del sistema}';

    protected $description = 'Realiza un diagnóstico específico del sistema inmobiliario';

    public function handle()
    {
        $this->info('🏢 Ejecutando diagnóstico especializado del sistema inmobiliario');
        $this->newLine();

        $this->verificarEstructuraInmobiliaria();
        $this->analizarDepartamentos();
        $this->analizarImagenes();
        $this->analizarRelacionesUsuarios();

        // Si se especificó la opción fix, intentar corregir problemas
        if ($this->option('fix')) {
            $this->corregirProblemasComunes();
        }

        $this->newLine();
        $this->info('✅ Diagnóstico finalizado');
    }

    private function verificarEstructuraInmobiliaria()
    {
        $this->info('📊 Verificando estructura básica del sistema inmobiliario');
        
        $tablasNecesarias = [
            'departamentos' => 'Tabla principal de departamentos',
            'propietarios' => 'Tabla de propietarios',
            'imagenes' => 'Tabla de imágenes de departamentos',
            'ventas' => 'Tabla de registro de ventas',
            'cotizaciones' => 'Tabla de cotizaciones',
        ];
        
        $problemas = 0;
        foreach ($tablasNecesarias as $tabla => $descripcion) {
            if (Schema::hasTable($tabla)) {
                $registros = DB::table($tabla)->count();
                if ($registros > 0) {
                    $this->line("  ✅ {$descripcion}: <fg=green>{$registros} registros</>");
                } else {
                    $this->line("  ⚠️ {$descripcion}: <fg=yellow>Tabla vacía ({$tabla})</>");
                    $problemas++;
                }
            } else {
                $this->line("  ❌ {$descripcion}: <fg=red>No existe la tabla</>");
                $problemas++;
            }
        }
        
        if ($problemas === 0) {
            $this->line('  🟢 <fg=green>La estructura básica del sistema está completa</fg=green>');
        }
    }

    private function analizarDepartamentos()
    {
        $this->info('🏢 Analizando departamentos');
        
        if (!Schema::hasTable('departamentos')) {
            $this->line('  ❌ <fg=red>No existe la tabla de departamentos</fg=red>');
            return;
        }
        
        // Verificar distribución por estados
        $estados = DB::table('departamentos')
            ->select('estado', DB::raw('count(*) as total'))
            ->groupBy('estado')
            ->get();
            
        if ($estados->count() > 0) {
            $this->line('  📊 Distribución por estados:');
            foreach ($estados as $estado) {
                $this->line("    - {$estado->estado}: {$estado->total}");
            }
        } else {
            $this->line('  ⚠️ <fg=yellow>No hay datos de estados de departamentos</fg=yellow>');
        }
        
        // Verificar departamentos sin imágenes
        $sinImagenes = 0;
        if (Schema::hasTable('imagenes')) {
            $sinImagenes = DB::table('departamentos as d')
                ->leftJoin('imagenes as i', 'd.id', '=', 'i.departamento_id')
                ->whereNull('i.id')
                ->count();
                
            if ($sinImagenes > 0) {
                $this->line("  ⚠️ <fg=yellow>{$sinImagenes} departamentos sin imágenes</fg=yellow>");
            } else {
                $this->line('  ✅ <fg=green>Todos los departamentos tienen imágenes</fg=green>');
            }
        }
        
        // Verificar departamentos sin propietario
        $sinPropietario = 0;
        if (Schema::hasTable('propietarios') && Schema::hasColumn('departamentos', 'propietario_id')) {
            $sinPropietario = DB::table('departamentos')
                ->whereNull('propietario_id')
                ->orWhere(function($query) {
                    $query->whereNotNull('propietario_id')
                          ->whereNotIn('propietario_id', function($subquery) {
                              $subquery->select('id')->from('propietarios');
                          });
                })
                ->count();
                
            if ($sinPropietario > 0) {
                $this->line("  ⚠️ <fg=yellow>{$sinPropietario} departamentos sin propietario válido</fg=yellow>");
            } else {
                $this->line('  ✅ <fg=green>Todos los departamentos tienen propietario válido</fg=green>');
            }
        }
    }

    private function analizarImagenes()
    {
        $this->info('🖼️ Analizando imágenes');
        
        if (!Schema::hasTable('imagenes')) {
            $this->line('  ❌ <fg=red>No existe la tabla de imágenes</fg=red>');
            return;
        }
        
        // Total de imágenes
        $totalImagenes = DB::table('imagenes')->count();
        $this->line("  📊 Total de imágenes: {$totalImagenes}");
        
        // Verificar imágenes por tipo
        $tiposImagen = DB::table('imagenes')
            ->select('tipo', DB::raw('count(*) as total'))
            ->groupBy('tipo')
            ->get();
            
        if ($tiposImagen->count() > 0) {
            $this->line('  📊 Distribución por tipos:');
            foreach ($tiposImagen as $tipo) {
                $this->line("    - {$tipo->tipo}: {$tipo->total}");
            }
        }
        
        // Verificar imágenes huérfanas (sin departamento)
        if (Schema::hasTable('departamentos')) {
            $huerfanas = DB::table('imagenes as i')
                ->leftJoin('departamentos as d', 'i.departamento_id', '=', 'd.id')
                ->whereNull('d.id')
                ->count();
                
            if ($huerfanas > 0) {
                $this->line("  ⚠️ <fg=yellow>{$huerfanas} imágenes huérfanas (sin departamento asociado)</fg=yellow>");
            } else {
                $this->line('  ✅ <fg=green>Todas las imágenes tienen departamento asociado</fg=green>');
            }
        }
        
        // Verificar archivos físicos
        $this->verificarArchivosImagenes();
    }
    
    private function verificarArchivosImagenes()
    {
        if (!Schema::hasTable('imagenes')) {
            return;
        }
        
        $imagenes = DB::table('imagenes')
            ->select('url')
            ->limit(10)
            ->get();
            
        if ($imagenes->isEmpty()) {
            return;
        }
        
        $archivosNoEncontrados = 0;
        
        foreach ($imagenes as $imagen) {
            $rutaImagen = $imagen->url;
            
            // Verificar si el archivo existe
            $rutaCompleta = public_path($rutaImagen);
            if (strpos($rutaImagen, 'storage/') === 0) {
                $rutaRelativa = str_replace('storage/', '', $rutaImagen);
                $existeArchivo = Storage::disk('public')->exists($rutaRelativa);
            } else {
                $existeArchivo = file_exists($rutaCompleta);
            }
            
            if (!$existeArchivo) {
                $archivosNoEncontrados++;
            }
        }
        
        $porcentajeError = ($archivosNoEncontrados / count($imagenes)) * 100;
        
        if ($archivosNoEncontrados > 0) {
            $this->line("  ⚠️ <fg=yellow>Aproximadamente el " . round($porcentajeError) . "% de las imágenes no existen físicamente</fg=yellow>");
            if ($porcentajeError > 50) {
                $this->line("     📌 <fg=yellow>Posible problema con el enlace simbólico de storage</fg=yellow>");
                $this->line("        Solución: php artisan storage:link");
            }
        } else {
            $this->line('  ✅ <fg=green>Las imágenes verificadas existen físicamente</fg=green>');
        }
    }

    private function analizarRelacionesUsuarios()
    {
        $this->info('👥 Analizando relaciones de usuarios');
        
        if (!Schema::hasTable('users')) {
            $this->line('  ❌ <fg=red>No existe la tabla de usuarios</fg=red>');
            return;
        }
        
        // Verificar tabla de asesores
        if (Schema::hasTable('asesores')) {
            $asesores = DB::table('asesores')->count();
            $this->line("  📊 Total de asesores: {$asesores}");
            
            // Verificar asesores sin usuario
            if (Schema::hasColumn('asesores', 'user_id')) {
                $asesoresSinUsuario = DB::table('asesores as a')
                    ->leftJoin('users as u', 'a.user_id', '=', 'u.id')
                    ->whereNull('u.id')
                    ->count();
                    
                if ($asesoresSinUsuario > 0) {
                    $this->line("  ⚠️ <fg=yellow>{$asesoresSinUsuario} asesores sin usuario asociado</fg=yellow>");
                }
            }
        }
        
        // Verificar tabla de clientes
        if (Schema::hasTable('clientes')) {
            $clientes = DB::table('clientes')->count();
            $this->line("  📊 Total de clientes: {$clientes}");
            
            // Verificar clientes sin usuario
            if (Schema::hasColumn('clientes', 'user_id')) {
                $clientesSinUsuario = DB::table('clientes as c')
                    ->leftJoin('users as u', 'c.user_id', '=', 'u.id')
                    ->whereNull('u.id')
                    ->count();
                    
                if ($clientesSinUsuario > 0) {
                    $this->line("  ⚠️ <fg=yellow>{$clientesSinUsuario} clientes sin usuario asociado</fg=yellow>");
                }
            }
        }
        
        // Verificar tabla de propietarios
        if (Schema::hasTable('propietarios')) {
            $propietarios = DB::table('propietarios')->count();
            $this->line("  📊 Total de propietarios: {$propietarios}");
            
            // Verificar propietarios sin usuario
            if (Schema::hasColumn('propietarios', 'user_id')) {
                $propietariosSinUsuario = DB::table('propietarios as p')
                    ->leftJoin('users as u', 'p.user_id', '=', 'u.id')
                    ->whereNull('u.id')
                    ->count();
                    
                if ($propietariosSinUsuario > 0) {
                    $this->line("  ⚠️ <fg=yellow>{$propietariosSinUsuario} propietarios sin usuario asociado</fg=yellow>");
                }
            }
        }
    }
    
    private function corregirProblemasComunes()
    {
        $this->info('🔧 Intentando corregir problemas comunes');
        
        // Corregir enlaces simbólicos si es necesario
        if (!file_exists(public_path('storage'))) {
            $this->line('  🔄 Creando enlace simbólico para storage...');
            try {
                $this->callSilent('storage:link');
                $this->line('  ✅ <fg=green>Enlace simbólico creado correctamente</fg=green>');
            } catch (\Exception $e) {
                $this->line("  ❌ <fg=red>Error al crear enlace simbólico: {$e->getMessage()}</fg=red>");
            }
        }
        
        // Eliminar imágenes huérfanas
        if (Schema::hasTable('imagenes') && Schema::hasTable('departamentos')) {
            $huerfanas = DB::table('imagenes as i')
                ->leftJoin('departamentos as d', 'i.departamento_id', '=', 'd.id')
                ->whereNull('d.id')
                ->select('i.id')
                ->pluck('i.id')
                ->toArray();
                
            if (!empty($huerfanas)) {
                $this->line("  🔄 Eliminando {$huerfanas} imágenes huérfanas...");
                try {
                    DB::table('imagenes')->whereIn('id', $huerfanas)->delete();
                    $this->line('  ✅ <fg=green>Imágenes huérfanas eliminadas correctamente</fg=green>');
                } catch (\Exception $e) {
                    $this->line("  ❌ <fg=red>Error al eliminar imágenes huérfanas: {$e->getMessage()}</fg=red>");
                }
            }
        }
        
        // Optimizar tablas
        $this->line('  🔄 Optimizando tablas de base de datos...');
        try {
            $tablasParaOptimizar = ['departamentos', 'imagenes', 'ventas', 'users'];
            foreach ($tablasParaOptimizar as $tabla) {
                if (Schema::hasTable($tabla)) {
                    DB::statement("OPTIMIZE TABLE {$tabla}");
                }
            }
            $this->line('  ✅ <fg=green>Tablas optimizadas correctamente</fg=green>');
        } catch (\Exception $e) {
            $this->line("  ⚠️ <fg=yellow>No se pudieron optimizar todas las tablas: {$e->getMessage()}</fg=yellow>");
        }
    }
}