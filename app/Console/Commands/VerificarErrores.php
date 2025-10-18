<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

class VerificarErrores extends Command
{
    protected $signature = 'sistema:errores 
                           {--full : Realiza un análisis exhaustivo incluyendo todos los componentes}
                           {--react : Analiza únicamente los componentes React}
                           {--rutas : Analiza únicamente las rutas del sistema}
                           {--datos : Analiza únicamente la integridad de los datos}';
                           
    protected $description = 'Verifica y analiza los logs, componentes, rutas y datos del sistema';

    /**
     * Contador para rastrear problemas encontrados
     */
    private $problemasEncontrados = 0;
    
    /**
     * Entorno actual de la aplicación
     */
    private $entorno;

    public function handle()
    {
        $this->entorno = app()->environment();
        $this->info('🔍 Analizando sistema Laravel+React+Inertia en entorno: ' . strtoupper($this->entorno));
        $this->newLine();
        
        // Verificar qué opciones se han seleccionado
        $full = $this->option('full');
        $soloReact = $this->option('react');
        $soloRutas = $this->option('rutas');
        $soloDatos = $this->option('datos');
        
        // Si no hay opciones específicas, se ejecuta un análisis estándar
        if (!$full && !$soloReact && !$soloRutas && !$soloDatos) {
            $this->analizarLogsLaravel();
            $this->analizarErroresWeb();
            $this->verificarPermisos();
        }
        
        // Análisis específicos según opciones
        if ($full || $soloReact) {
            $this->analizarComponentesReact();
        }
        
        if ($full || $soloRutas) {
            $this->analizarRutasDetallado();
        }
        
        if ($full || $soloDatos) {
            $this->analizarIntegridadDatos();
        }
        
        // Siempre mostrar recomendaciones al final
        $this->mostrarResumenYRecomendaciones();
    }

    private function analizarLogsLaravel()
    {
        $this->info('📋 Analizando logs de Laravel...');
        
        // Verificar múltiples archivos de logs
        $logFiles = glob(storage_path('logs/*.log'));
        
        if (empty($logFiles)) {
            $this->warn('⚠️ No se encontraron archivos de log');
            $this->problemasEncontrados++;
            return;
        }
        
        $this->line("📁 Archivos de log encontrados: " . count($logFiles));
        
        $totalErrores = 0;
        $totalWarnings = 0;
        $hoy = now()->format('Y-m-d');
        $erroresPorModulo = [];
        $patronesProblematicos = [
            'Route \[(.*?)\] not defined' => 'Ruta no definida',
            'No query results for model' => 'Modelo no encontrado',
            'Trying to get property of non-object' => 'Acceso a propiedad nula',
            'Undefined property' => 'Propiedad no definida',
            'Call to undefined method' => 'Método no definido',
            'Class (.*?) not found' => 'Clase no encontrada',
            'SQLSTATE\[.*?\]' => 'Error de SQL'
        ];
        
        $this->line("📅 Analizando logs de hoy: {$hoy}");
        
        foreach ($logFiles as $logPath) {
            try {
                // Obtener solo las últimas 5000 líneas para evitar problemas con archivos muy grandes
                $contenido = $this->obtenerUltimasLineas($logPath, 5000);
                $lineas = explode("\n", $contenido);
                $logName = basename($logPath);
                
                $erroresHoy = 0;
                $warningsHoy = 0;
                $erroresRecientes = [];
                
                foreach ($lineas as $linea) {
                    if (str_contains($linea, $hoy)) {
                        if (str_contains($linea, '[ERROR]')) {
                            $erroresHoy++;
                            $totalErrores++;
                            
                            // Extraer el módulo afectado si se puede identificar
                            if (preg_match('/\[(.*?)\].*?\[(.*?)\]/', $linea, $matches)) {
                                $modulo = $matches[2];
                                if (!isset($erroresPorModulo[$modulo])) {
                                    $erroresPorModulo[$modulo] = 0;
                                }
                                $erroresPorModulo[$modulo]++;
                            }
                            
                            // Guardar los 3 errores más recientes para mostrarlos
                            if (count($erroresRecientes) < 3) {
                                // Detectar patrones de error comunes
                                $tipoError = 'Error general';
                                foreach ($patronesProblematicos as $patron => $tipo) {
                                    if (preg_match('/' . $patron . '/i', $linea)) {
                                        $tipoError = $tipo;
                                        break;
                                    }
                                }
                                
                                $erroresRecientes[] = [
                                    'tipo' => $tipoError,
                                    'mensaje' => Str::limit(trim(preg_replace('/\[\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\].*?\[.*?\]/', '', $linea)), 100)
                                ];
                            }
                        }
                        
                        if (str_contains($linea, '[WARNING]')) {
                            $warningsHoy++;
                            $totalWarnings++;
                        }
                    }
                }
                
                $this->line("  - {$logName}: {$erroresHoy} errores, {$warningsHoy} advertencias");
                
                // Mostrar los errores más recientes
                if (!empty($erroresRecientes)) {
                    $this->newLine();
                    $this->line("  🚨 Errores recientes en {$logName}:");
                    foreach ($erroresRecientes as $idx => $error) {
                        $this->line("    " . ($idx + 1) . ". [{$error['tipo']}] {$error['mensaje']}");
                    }
                }
            } catch (\Exception $e) {
                $this->warn("  ⚠️ No se pudo leer {$logPath}: " . $e->getMessage());
                $this->problemasEncontrados++;
            }
        }
        
        $this->newLine();
        $this->line("📊 Total errores de hoy: {$totalErrores}");
        $this->line("⚠️ Total advertencias de hoy: {$totalWarnings}");
        
        // Mostrar distribución de errores por módulo si hay datos
        if (!empty($erroresPorModulo)) {
            $this->newLine();
            $this->line("📊 Distribución de errores por módulo:");
            arsort($erroresPorModulo);
            
            $headers = ['Módulo', 'Errores', '%'];
            $rows = [];
            
            foreach ($erroresPorModulo as $modulo => $count) {
                $porcentaje = round(($count / $totalErrores) * 100, 1);
                $rows[] = [$modulo, $count, $porcentaje . '%'];
            }
            
            $this->table($headers, $rows);
        }
        
        if ($totalErrores > 10) {
            $this->problemasEncontrados += 2;
        } elseif ($totalErrores > 0) {
            $this->problemasEncontrados++;
        }
    }
    
    /**
     * Obtiene las últimas N líneas de un archivo
     *
     * @param string $filePath Ruta del archivo
     * @param int $lines Número de líneas a obtener
     * @return string
     */
    private function obtenerUltimasLineas($filePath, $lines)
    {
        if (!File::exists($filePath)) {
            return '';
        }
        
        // Para archivos pequeños, leer todo el contenido
        $filesize = File::size($filePath);
        if ($filesize < 5 * 1024 * 1024) { // 5 MB
            return File::get($filePath);
        }
        
        // Para archivos grandes, usar un enfoque optimizado
        try {
            if (PHP_OS_FAMILY === 'Windows') {
                // En Windows podemos usar PowerShell
                $output = [];
                exec("powershell -command \"Get-Content '{$filePath}' -Tail {$lines}\"", $output);
                return implode("\n", $output);
            } else {
                // En Linux/Unix, usamos tail
                $output = [];
                exec("tail -n {$lines} '{$filePath}'", $output);
                return implode("\n", $output);
            }
        } catch (\Exception $e) {
            // Si falla el comando, intentar leer el archivo de manera manual
            $file = new \SplFileObject($filePath, 'r');
            $file->seek(PHP_INT_MAX); // Ir al final
            $totalLines = $file->key(); // Obtener número total de líneas
            
            $startLine = max(0, $totalLines - $lines);
            $file->seek($startLine);
            
            $content = '';
            while (!$file->eof()) {
                $content .= $file->fgets();
            }
            
            return $content;
        }
    }

    private function analizarErroresWeb()
    {
        $this->info('🌐 Verificando errores web comunes...');
        
        // Verificar si hay rutas rotas
        $this->verificarRutas();
        
        // Verificar middleware
        $this->verificarMiddleware();
        
        // Verificar archivos principales de frontend
        $this->verificarArchivosFrontend();
    }

    private function verificarRutas()
    {
        try {
            $routes = app('router')->getRoutes();
            $allRoutes = $routes->getRoutes();
            $rutasCount = count($allRoutes);
            $this->line("✅ Rutas registradas: " . $rutasCount);
            
            // Añadir una verificación adicional de rutas por método HTTP
            $rutasPorMetodo = [];
            foreach ($allRoutes as $route) {
                foreach ($route->methods() as $method) {
                    if ($method === 'HEAD') continue;
                    if (!isset($rutasPorMetodo[$method])) {
                        $rutasPorMetodo[$method] = 0;
                    }
                    $rutasPorMetodo[$method]++;
                }
            }
            
            if (!empty($rutasPorMetodo)) {
                foreach ($rutasPorMetodo as $metodo => $cantidad) {
                    $this->line("  - {$metodo}: {$cantidad}");
                }
            }
        } catch (\Exception $e) {
            $this->line("❌ <fg=red>Error verificando rutas: " . $e->getMessage() . "</>");
            $this->problemasEncontrados++;
        }
    }

    private function verificarMiddleware()
    {
        $middlewares = [
            'auth' => \Illuminate\Auth\Middleware\Authenticate::class,
            'role' => \App\Http\Middleware\RoleMiddleware::class,
            'web' => \App\Http\Middleware\EncryptCookies::class,
            'api' => \Illuminate\Routing\Middleware\SubstituteBindings::class,
            'verified' => \Illuminate\Auth\Middleware\EnsureEmailIsVerified::class,
        ];

        $this->line("🔍 Verificando middlewares esenciales...");
        
        $problemasMiddleware = 0;
        foreach ($middlewares as $alias => $clase) {
            if (class_exists($clase)) {
                $this->line("  ✅ Middleware '{$alias}': <fg=green>OK</>");
            } else {
                $this->line("  ❌ Middleware '{$alias}': <fg=red>No encontrado</>");
                $problemasMiddleware++;
                $this->problemasEncontrados++;
            }
        }
        
        // Verificar registro de middleware en Kernel
        try {
            $kernel = app()->make(\App\Http\Kernel::class);
            $registrados = array_merge(
                $kernel->getMiddlewareGroups(),
                $kernel->getMiddlewareAliases()
            );
            
            $faltantes = array_diff(array_keys($middlewares), array_keys($registrados));
            
            if (!empty($faltantes)) {
                $this->line("  ⚠️ <fg=yellow>Middlewares no registrados en Kernel:</>");
                foreach ($faltantes as $faltante) {
                    $this->line("    - {$faltante}");
                    $problemasMiddleware++;
                    $this->problemasEncontrados++;
                }
            }
            
            if ($problemasMiddleware == 0) {
                $this->line("  🟢 <fg=green>Todos los middlewares están correctamente configurados</>");
            }
        } catch (\Exception $e) {
            $this->line("  ⚠️ <fg=yellow>Error al verificar registro de middlewares: {$e->getMessage()}</>");
            $this->problemasEncontrados++;
        }
    }
    
    private function verificarArchivosFrontend()
    {
        $this->line("🔍 Verificando archivos esenciales de frontend...");
        
        $archivosEsenciales = [
            'resources/js/app.jsx' => 'Entrada principal de React',
            'resources/js/bootstrap.js' => 'Bootstrap de JavaScript',
            'resources/css/app.css' => 'Estilos principales',
            'resources/views/app.blade.php' => 'Plantilla principal de Blade',
        ];
        
        $problemasFrontend = 0;
        
        foreach ($archivosEsenciales as $archivo => $descripcion) {
            if (File::exists(base_path($archivo))) {
                $this->line("  ✅ {$descripcion}: <fg=green>OK</>");
            } else {
                $this->line("  ❌ {$descripcion}: <fg=red>No encontrado ({$archivo})</>");
                $problemasFrontend++;
                $this->problemasEncontrados++;
            }
        }
        
        // Verificar configuración de Vite
        if (File::exists(base_path('vite.config.js'))) {
            $this->line("  ✅ Configuración Vite: <fg=green>OK</>");
        } else {
            $this->line("  ❌ Configuración Vite: <fg=red>No encontrada (vite.config.js)</>");
            $problemasFrontend++;
            $this->problemasEncontrados++;
        }
        
        if ($problemasFrontend == 0) {
            $this->line("  🟢 <fg=green>Todos los archivos frontend esenciales están presentes</>");
        }
    }

    private function verificarPermisos()
    {
        $this->info('🔐 Verificando permisos de archivos...');
        
        $directorios = [
            storage_path(),
            storage_path('logs'),
            storage_path('app'),
            storage_path('app/public'),
            public_path('storage'),
            base_path('bootstrap/cache'),
        ];
        
        $problemasPermisos = 0;

        foreach ($directorios as $dir) {
            if (!file_exists($dir)) {
                $this->line("  ⚠️ Directorio no existe: <fg=yellow>{$dir}</>");
                $problemasPermisos++;
                $this->problemasEncontrados++;
                continue;
            }
            
            if (is_writable($dir)) {
                $this->line("  ✅ Permisos <fg=green>{$dir}</fg=green>: <fg=green>OK</>");
            } else {
                $this->line("  ❌ <fg=red>Sin permisos de escritura: {$dir}</>");
                $problemasPermisos++;
                $this->problemasEncontrados++;
                
                // Sugerir corrección para Laragon/Windows
                if (PHP_OS_FAMILY === 'Windows') {
                    $this->line("     📌 <fg=yellow>Solución: Ejecutar Laragon como administrador</>");
                } else {
                    $this->line("     📌 <fg=yellow>Solución: chmod -R 775 " . basename($dir) . "</>");
                }
            }
        }
        
        // Verificar el enlace simbólico del storage
        $targetPath = public_path('storage');
        $linkExists = file_exists($targetPath);
        $isSymlink = $linkExists && is_link($targetPath);
        
        if ($isSymlink) {
            $this->line("  ✅ Enlace simbólico de storage: <fg=green>OK</>");
        } else {
            $this->line("  ⚠️ <fg=yellow>El enlace simbólico de storage no está configurado correctamente</>");
            $this->line("     📌 <fg=yellow>Solución: php artisan storage:link</>");
            $problemasPermisos++;
            $this->problemasEncontrados++;
        }
        
        if ($problemasPermisos == 0) {
            $this->line("  🟢 <fg=green>Todos los permisos de directorios están correctos</>");
        }
    }

    /**
     * Analiza los componentes React del sistema
     */
    private function analizarComponentesReact()
    {
        $this->info('⚛️ Analizando componentes React...');
        
        $directorios = [
            'resources/js/Pages' => 'Páginas principales',
            'resources/js/Components' => 'Componentes reutilizables',
            'resources/js/Layouts' => 'Layouts de aplicación',
        ];
        
        $componentesTotal = 0;
        $problemasComponentes = 0;
        
        foreach ($directorios as $directorio => $descripcion) {
            $path = base_path($directorio);
            
            if (!file_exists($path)) {
                $this->line("  ⚠️ <fg=yellow>Directorio {$descripcion} no encontrado: {$directorio}</>");
                $problemasComponentes++;
                $this->problemasEncontrados++;
                continue;
            }
            
            $archivos = $this->obtenerArchivosReact($path);
            $componentesTotal += count($archivos);
            
            $this->line("  📂 {$descripcion}: " . count($archivos) . " componentes");
            
            // Verificar problemas en componentes más importantes
            if ($directorio === 'resources/js/Pages') {
                $rutas = collect(Route::getRoutes()->getRoutesByName());
                
                $rutasSinComponente = [];
                $componentesSinRuta = [];
                
                // Verificar rutas que deberían tener componentes React
                foreach ($rutas as $nombre => $ruta) {
                    if (str_starts_with($nombre, 'admin.') || 
                        str_starts_with($nombre, 'asesor.') || 
                        str_starts_with($nombre, 'cliente.')) {
                            
                        $componentePath = str_replace('.', '/', $nombre) . '.jsx';
                        $rutaReal = "{$path}/{$componentePath}";
                        
                        if (!file_exists($rutaReal)) {
                            $rutasSinComponente[] = $nombre;
                        }
                    }
                }
                
                // Verificar componentes que no tienen ruta asociada
                foreach ($archivos as $archivo) {
                    $relativePath = str_replace($path . '/', '', $archivo);
                    $relativePath = str_replace(['.jsx', '.js', '/'], ['.', '.', '.'], $relativePath);
                    
                    if (!$rutas->has($relativePath) && 
                        !str_contains($relativePath, 'index') && 
                        !str_contains($relativePath, 'Layout') && 
                        !str_contains($relativePath, 'Component')) {
                        $componentesSinRuta[] = $relativePath;
                    }
                }
                
                // Mostrar resultados de componentes sin ruta o viceversa
                if (count($rutasSinComponente) > 0) {
                    $this->line("  ⚠️ <fg=yellow>Rutas sin componente React asociado:</>");
                    foreach (array_slice($rutasSinComponente, 0, 5) as $ruta) {
                        $this->line("    - {$ruta}");
                    }
                    if (count($rutasSinComponente) > 5) {
                        $this->line("      ...y " . (count($rutasSinComponente) - 5) . " más");
                    }
                    $problemasComponentes += count($rutasSinComponente);
                    $this->problemasEncontrados += min(count($rutasSinComponente), 3);
                }
                
                if (count($componentesSinRuta) > 0) {
                    $this->line("  ℹ️ <fg=blue>Componentes sin ruta asociada:</>");
                    foreach (array_slice($componentesSinRuta, 0, 5) as $componente) {
                        $this->line("    - {$componente}");
                    }
                    if (count($componentesSinRuta) > 5) {
                        $this->line("      ...y " . (count($componentesSinRuta) - 5) . " más");
                    }
                }
                
                // Verificar imports en componentes principales
                $this->verificarImportsReact($archivos);
            }
        }
        
        // Verificar archivo de bootstrap
        $bootstrapPath = base_path('resources/js/bootstrap.js');
        if (file_exists($bootstrapPath)) {
            $bootstrap = file_get_contents($bootstrapPath);
            
            if (!str_contains($bootstrap, 'axios')) {
                $this->line("  ⚠️ <fg=yellow>bootstrap.js no tiene configuración de axios</>");
                $problemasComponentes++;
                $this->problemasEncontrados++;
            }
            
            if (!str_contains($bootstrap, 'route') && file_exists(base_path('resources/js/ziggy.js'))) {
                $this->line("  ⚠️ <fg=yellow>bootstrap.js no tiene función helper para rutas</>");
                $problemasComponentes++;
                $this->problemasEncontrados++;
            }
        }
        
        if ($componentesTotal === 0) {
            $this->line("  ❌ <fg=red>No se encontraron componentes React</>");
            $this->problemasEncontrados += 3;
        } else if ($problemasComponentes === 0) {
            $this->line("  🟢 <fg=green>Todos los componentes React parecen estar correctos</>");
        }
    }
    
    /**
     * Verifica los imports en archivos React para detectar posibles problemas
     */
    private function verificarImportsReact($archivos)
    {
        $problemasImport = 0;
        $patrones = [
            'import { Link } from' => 'Link de Inertia',
            'import { Head } from' => 'Head de Inertia',
            'import { useForm } from' => 'useForm de Inertia',
            'import React' => 'React',
            'import Layout' => 'Layout'
        ];
        
        // Seleccionar algunos archivos al azar para examinar
        $muestra = array_slice($archivos, 0, min(5, count($archivos)));
        
        foreach ($muestra as $archivo) {
            $contenido = file_get_contents($archivo);
            $nombreArchivo = basename($archivo);
            $problemasArchivo = 0;
            
            foreach ($patrones as $patron => $descripcion) {
                if (!str_contains($contenido, $patron)) {
                    $problemasArchivo++;
                }
            }
            
            if ($problemasArchivo >= 3) {
                $this->line("  ⚠️ <fg=yellow>Posible problema en {$nombreArchivo}: faltan imports esenciales</>");
                $problemasImport++;
                $this->problemasEncontrados++;
            }
        }
        
        if ($problemasImport > 0) {
            $this->line("  ⚠️ <fg=yellow>Se detectaron posibles problemas en imports de componentes React</>");
        }
    }
    
    /**
     * Obtiene todos los archivos React de un directorio
     */
    private function obtenerArchivosReact($directory)
    {
        $archivos = [];
        
        if (!file_exists($directory)) {
            return $archivos;
        }
        
        $items = new \RecursiveIteratorIterator(
            new \RecursiveDirectoryIterator($directory, \FilesystemIterator::SKIP_DOTS),
            \RecursiveIteratorIterator::SELF_FIRST
        );
        
        foreach ($items as $item) {
            if ($item->isFile() && in_array($item->getExtension(), ['js', 'jsx'])) {
                $archivos[] = $item->getPathname();
            }
        }
        
        return $archivos;
    }
    
    /**
     * Analiza las rutas del sistema en detalle
     */
    private function analizarRutasDetallado()
    {
        $this->info('🛣️ Analizando rutas del sistema...');
        
        try {
            $routes = Route::getRoutes();
            $totalRutas = count($routes->getRoutes());
            
            // Contar rutas por tipo
            $rutasWeb = 0;
            $rutasApi = 0;
            $rutasAuth = 0;
            $rutasAsesor = 0;
            $rutasCliente = 0;
            $rutasAdmin = 0;
            $rutasPropietario = 0;
            
            $rutasSinMiddleware = [];
            $rutasSinController = [];
            $controladores = [];
            
            foreach ($routes->getRoutes() as $route) {
                $uri = $route->uri();
                $name = $route->getName() ?: '(sin nombre)';
                $middleware = $route->middleware();
                $action = $route->getActionName();
                
                // Contar por prefijo/tipo
                if (str_starts_with($uri, 'api')) $rutasApi++;
                elseif (str_starts_with($name, 'login') || str_starts_with($name, 'password.') || str_starts_with($name, 'register')) $rutasAuth++;
                elseif (str_starts_with($name, 'asesor.')) $rutasAsesor++;
                elseif (str_starts_with($name, 'cliente.')) $rutasCliente++;
                elseif (str_starts_with($name, 'admin.')) $rutasAdmin++;
                elseif (str_starts_with($name, 'propietario.')) $rutasPropietario++;
                else $rutasWeb++;
                
                // Verificar middleware
                if (empty($middleware)) {
                    $rutasSinMiddleware[] = "{$name} ({$uri})";
                }
                
                // Verificar controladores
                if (!str_contains($action, '@') && !str_contains($action, 'Closure')) {
                    $rutasSinController[] = "{$name} ({$uri})";
                } else if (str_contains($action, '@')) {
                    $controller = explode('@', $action)[0];
                    if (!isset($controladores[$controller])) {
                        $controladores[$controller] = 0;
                    }
                    $controladores[$controller]++;
                }
            }
            
            // Mostrar resumen de rutas
            $this->line("📊 <fg=green>Rutas totales: {$totalRutas}</>");
            $this->line("  - Web general: {$rutasWeb}");
            $this->line("  - API: {$rutasApi}");
            $this->line("  - Autenticación: {$rutasAuth}");
            $this->line("  - Admin: {$rutasAdmin}");
            $this->line("  - Asesor: {$rutasAsesor}");
            $this->line("  - Cliente: {$rutasCliente}");
            $this->line("  - Propietario: {$rutasPropietario}");
            
            // Alertas sobre problemas en rutas
            if (!empty($rutasSinMiddleware)) {
                $this->newLine();
                $this->line("⚠️ <fg=yellow>Rutas sin middleware (posible problema de seguridad):</>");
                foreach (array_slice($rutasSinMiddleware, 0, 5) as $ruta) {
                    $this->line("  - {$ruta}");
                }
                if (count($rutasSinMiddleware) > 5) {
                    $this->line("    ...y " . (count($rutasSinMiddleware) - 5) . " más");
                }
                $this->problemasEncontrados += min(count($rutasSinMiddleware), 2);
            }
            
            if (!empty($rutasSinController)) {
                $this->newLine();
                $this->line("⚠️ <fg=yellow>Rutas sin controlador definido:</>");
                foreach (array_slice($rutasSinController, 0, 5) as $ruta) {
                    $this->line("  - {$ruta}");
                }
                if (count($rutasSinController) > 5) {
                    $this->line("    ...y " . (count($rutasSinController) - 5) . " más");
                }
                $this->problemasEncontrados += min(count($rutasSinController), 2);
            }
            
            // Controladores más utilizados
            arsort($controladores);
            $this->newLine();
            $this->line("🔍 Controladores principales:");
            $top5 = array_slice($controladores, 0, 5, true);
            foreach ($top5 as $controller => $count) {
                $shortName = str_replace('App\\Http\\Controllers\\', '', $controller);
                $this->line("  - {$shortName}: {$count} rutas");
            }
            
            // Verificar rutas críticas
            $this->verificarRutasCriticas();
            
        } catch (\Exception $e) {
            $this->error("❌ Error analizando rutas: " . $e->getMessage());
            $this->problemasEncontrados += 2;
        }
    }
    
    /**
     * Verifica la existencia de rutas críticas para el sistema
     */
    private function verificarRutasCriticas()
    {
        $rutasCriticas = [
            'login' => 'Inicio de sesión',
            'register' => 'Registro',
            'logout' => 'Cierre de sesión',
            'password.request' => 'Recuperación de contraseña',
            'dashboard' => 'Dashboard principal',
            'admin.dashboard' => 'Dashboard de administrador',
            'asesor.dashboard' => 'Dashboard de asesor',
            'cliente.dashboard' => 'Dashboard de cliente',
            'departamentos.index' => 'Listado de departamentos'
        ];
        
        $this->newLine();
        $this->line("🛡️ Verificando rutas críticas del sistema:");
        
        try {
            $rutasFaltantes = 0;
            $todasLasRutas = Route::getRoutes()->getRoutesByName();
            
            foreach ($rutasCriticas as $ruta => $descripcion) {
                if (isset($todasLasRutas[$ruta]) || Route::has($ruta)) {
                    $this->line("  ✅ {$descripcion}: <fg=green>OK</>");
                } else {
                    $this->line("  ❌ {$descripcion}: <fg=red>Falta la ruta '{$ruta}'</>");
                    
                    // Buscar rutas similares para sugerir alternativas
                    $alternativas = [];
                    foreach ($todasLasRutas as $nombreRuta => $detalleRuta) {
                        if (Str::contains($nombreRuta, explode('.', $ruta))) {
                            $alternativas[] = $nombreRuta;
                            if (count($alternativas) >= 3) break;
                        }
                    }
                    
                    if (!empty($alternativas)) {
                        $this->line("     📌 <fg=yellow>Rutas similares disponibles: " . implode(', ', $alternativas) . "</>");
                    }
                    
                    $rutasFaltantes++;
                    $this->problemasEncontrados++;
                }
            }
            
            if ($rutasFaltantes === 0) {
                $this->line("  🟢 <fg=green>Todas las rutas críticas están definidas</>");
            }
        } catch (\Exception $e) {
            $this->line("  ⚠️ <fg=yellow>Error verificando rutas críticas: {$e->getMessage()}</>");
            $this->problemasEncontrados++;
        }
    }
    
    /**
     * Analiza la integridad de los datos en la base de datos
     */
    private function analizarIntegridadDatos()
    {
        $this->info('🗃️ Analizando integridad de datos...');
        
        try {
            // Verificar conexión a la base de datos
            DB::connection()->getPdo();
            $this->line("  ✅ <fg=green>Conexión a la base de datos: OK</>");
            
            // Verificar tablas principales
            $tablasEsenciales = [
                'users' => 'Usuarios',
                'departamentos' => 'Departamentos',
                'imagenes' => 'Imágenes',
                'ventas' => 'Ventas',
                'propietarios' => 'Propietarios',
                'clientes' => 'Clientes',
                'cotizaciones' => 'Cotizaciones',
            ];
            
            $this->line("🔍 Verificando tablas principales:");
            
            $tablasFaltantes = 0;
            foreach ($tablasEsenciales as $tabla => $descripcion) {
                if (Schema::hasTable($tabla)) {
                    $count = DB::table($tabla)->count();
                    if ($count > 0) {
                        $this->line("  ✅ {$descripcion}: <fg=green>{$count} registros</>");
                    } else {
                        $this->line("  ⚠️ {$descripcion}: <fg=yellow>Tabla vacía ({$tabla})</>");
                        $this->problemasEncontrados++;
                    }
                } else {
                    $this->line("  ❌ {$descripcion}: <fg=red>Tabla no existe ({$tabla})</>");
                    $tablasFaltantes++;
                    $this->problemasEncontrados += 2;
                }
            }
            
            if ($tablasFaltantes > 0) {
                $this->line("  ⚠️ <fg=yellow>Faltan tablas esenciales en la base de datos</>");
                $this->line("     📌 <fg=yellow>Solución: php artisan migrate</>");
                return; // No seguir si faltan tablas esenciales
            }
            
            // Verificar integridad referencial
            $this->verificarIntegridadReferencial();
            
            // Verificar datos de usuarios
            $this->verificarUsuariosSistema();
            
        } catch (\Exception $e) {
            $this->error("❌ Error conectando a la base de datos: " . $e->getMessage());
            $this->problemasEncontrados += 3;
        }
    }
    
    /**
     * Verifica la integridad referencial entre tablas
     */
    private function verificarIntegridadReferencial()
    {
        $this->newLine();
        $this->line("🔄 Verificando integridad referencial:");
        
        $relaciones = [
            'departamentos.propietario_id' => ['propietarios', 'id'],
            'imagenes.departamento_id' => ['departamentos', 'id'],
            'ventas.departamento_id' => ['departamentos', 'id'],
            'ventas.cliente_id' => ['clientes', 'id'],
            'cotizaciones.departamento_id' => ['departamentos', 'id'],
            'cotizaciones.cliente_id' => ['clientes', 'id'],
        ];
        
        $problemasIntegridad = 0;
        foreach ($relaciones as $origen => $destino) {
            list($tablaOrigen, $campoOrigen) = explode('.', $origen);
            list($tablaDestino, $campoDestino) = $destino;
            
            if (!Schema::hasTable($tablaOrigen) || !Schema::hasTable($tablaDestino)) {
                continue; // Saltamos si alguna tabla no existe
            }
            
            try {
                // Verificar si hay referencias huérfanas
                $huerfanos = DB::table($tablaOrigen)
                    ->leftJoin($tablaDestino, "{$tablaOrigen}.{$campoOrigen}", '=', "{$tablaDestino}.{$campoDestino}")
                    ->whereNotNull("{$tablaOrigen}.{$campoOrigen}")
                    ->whereNull("{$tablaDestino}.{$campoDestino}")
                    ->count();
                
                if ($huerfanos > 0) {
                    $this->line("  ⚠️ <fg=yellow>{$huerfanos} registros en '{$tablaOrigen}' con '{$campoOrigen}' huérfanos</>");
                    $problemasIntegridad++;
                    $this->problemasEncontrados++;
                } else {
                    $this->line("  ✅ <fg=green>Integridad {$tablaOrigen}.{$campoOrigen} -> {$tablaDestino}.{$campoDestino}: OK</>");
                }
            } catch (\Exception $e) {
                $this->line("  ⚠️ <fg=yellow>Error verificando relación {$origen}: {$e->getMessage()}</>");
                $problemasIntegridad++;
            }
        }
        
        if ($problemasIntegridad === 0) {
            $this->line("  🟢 <fg=green>Todas las relaciones tienen integridad referencial</>");
        } else {
            $this->line("     📌 <fg=yellow>Solución: Ejecutar seed específico o corregir manualmente los registros</>");
        }
    }
    
    /**
     * Verifica datos de usuarios del sistema
     */
    private function verificarUsuariosSistema()
    {
        $this->newLine();
        $this->line("👥 Verificando usuarios del sistema:");
        
        if (!Schema::hasTable('users')) {
            return;
        }
        
            // Verificar si existe la columna tipo_usuario
            if (Schema::hasColumn('users', 'tipo_usuario')) {
                $tiposUsuario = DB::table('users')
                    ->select('tipo_usuario', DB::raw('count(*) as total'))
                    ->groupBy('tipo_usuario')
                    ->get();
            } else {
                // Alternativa si no existe la columna tipo_usuario
                $this->line("  ⚠️ <fg=yellow>La columna 'tipo_usuario' no existe en la tabla 'users'</>");
                $this->line("     📌 <fg=yellow>Usando roles como alternativa si están disponibles</>");
                
                // Intentar usar tabla de roles si existe
                if (Schema::hasTable('roles') && Schema::hasTable('role_user')) {
                    $tiposUsuario = DB::table('roles')
                        ->join('role_user', 'roles.id', '=', 'role_user.role_id')
                        ->select('roles.name as tipo_usuario', DB::raw('count(*) as total'))
                        ->groupBy('roles.name')
                        ->get();
                } else {
                    $tiposUsuario = collect([]);
                }
            }        if ($tiposUsuario->isEmpty()) {
            $this->line("  ⚠️ <fg=yellow>No se encontró información sobre tipos de usuarios</>");
            $this->problemasEncontrados++;
            return;
        }
        
        $tiposEsperados = ['admin', 'asesor', 'cliente', 'propietario'];
        $tiposEncontrados = $tiposUsuario->pluck('tipo_usuario')->toArray();
        $tiposFaltantes = array_diff($tiposEsperados, $tiposEncontrados);
        
        foreach ($tiposUsuario as $tipo) {
            $this->line("  - {$tipo->tipo_usuario}: {$tipo->total} usuarios");
        }
        
        if (!empty($tiposFaltantes)) {
            $this->line("  ⚠️ <fg=yellow>Faltan usuarios de tipo: " . implode(', ', $tiposFaltantes) . "</>");
            $this->line("     📌 <fg=yellow>Solución: php artisan db:seed --class=UsersSeeder</>");
            $this->problemasEncontrados += count($tiposFaltantes);
        } else {
            $this->line("  🟢 <fg=green>Todos los tipos de usuario están presentes</>");
        }
        
        // Verificar si hay usuario admin
        try {
            if (Schema::hasColumn('users', 'tipo_usuario')) {
                $adminCount = DB::table('users')->where('tipo_usuario', 'admin')->count();
                if ($adminCount === 0) {
                    $this->line("  ⚠️ <fg=yellow>No hay usuarios administradores</>");
                    $this->line("     📌 <fg=yellow>Solución: php artisan db:seed --class=AdminSeeder</>");
                    $this->problemasEncontrados++;
                }
            } else if (Schema::hasTable('roles') && Schema::hasTable('role_user')) {
                // Intentar verificar por roles
                $adminRole = DB::table('roles')->where('name', 'admin')->first();
                if ($adminRole) {
                    $adminCount = DB::table('role_user')->where('role_id', $adminRole->id)->count();
                    if ($adminCount === 0) {
                        $this->line("  ⚠️ <fg=yellow>No hay usuarios con rol de administrador</>");
                        $this->line("     📌 <fg=yellow>Solución: php artisan db:seed --class=AdminSeeder</>");
                        $this->problemasEncontrados++;
                    }
                }
            }
        } catch (\Exception $e) {
            $this->line("  ⚠️ <fg=yellow>Error al verificar usuarios administradores: {$e->getMessage()}</>");
        }
    }
    
    /**
     * Muestra un resumen de los problemas encontrados y recomendaciones
     */
    private function mostrarResumenYRecomendaciones()
    {
        $this->newLine();
        $nivelGravedad = $this->determinarNivelGravedad();
        
        $this->line(str_repeat('=', 70));
        $this->info("📊 RESUMEN DEL ANÁLISIS");
        $this->line(str_repeat('=', 70));
        $this->line("🔍 <fg=white>Entorno:</> " . strtoupper($this->entorno));
        $this->line("📅 <fg=white>Fecha:</> " . now()->format('Y-m-d H:i:s'));
        $this->line("❗ <fg=white>Problemas encontrados:</> {$this->problemasEncontrados}");
        $this->line("🔥 <fg=white>Nivel de gravedad:</> {$nivelGravedad}");
        $this->line(str_repeat('-', 70));
        
        $this->info('💡 RECOMENDACIONES PRINCIPALES:');
        
        if ($this->problemasEncontrados === 0) {
            $this->line("✅ <fg=green>¡No se encontraron problemas significativos!</>");
        } else {
            // Recomendaciones basadas en problemas específicos
            $this->generarRecomendacionesEspecificas();
        }
        
        // Recomendaciones generales
        $this->line("\n📋 COMANDOS ÚTILES PARA MANTENIMIENTO:");
        $this->line("1. <fg=yellow>php artisan sistema:errores --full</> - Análisis exhaustivo del sistema");
        $this->line("2. <fg=yellow>php artisan debug:reset-db</> - Restablecer base de datos para pruebas");
        $this->line("3. <fg=yellow>php artisan log:clear</> - Limpiar logs antiguos");
        $this->line("4. <fg=yellow>php artisan optimize:clear</> - Limpiar caché del sistema");
        $this->line("5. <fg=yellow>php artisan cache:clear</> - Limpiar caché de la aplicación");
        $this->line("6. <fg=yellow>php artisan route:clear</> - Limpiar caché de rutas");
        
        $this->line(str_repeat('=', 70));
    }
    
    /**
     * Determina el nivel de gravedad en base a los problemas encontrados
     */
    private function determinarNivelGravedad()
    {
        if ($this->problemasEncontrados === 0) {
            return "<fg=green>✓ Óptimo</>";
        } elseif ($this->problemasEncontrados <= 2) {
            return "<fg=green>✓ Bajo</> - Problemas menores";
        } elseif ($this->problemasEncontrados <= 5) {
            return "<fg=yellow>⚠ Medio</> - Requiere atención";
        } elseif ($this->problemasEncontrados <= 10) {
            return "<fg=red>⚠ Alto</> - Problemas importantes";
        } else {
            return "<fg=red;bg=white>⚠ CRÍTICO</> - Múltiples problemas críticos";
        }
    }
    
    /**
     * Genera recomendaciones específicas basadas en los problemas encontrados
     */
    private function generarRecomendacionesEspecificas()
    {
        // Obtener estado de comandos para evitar repetir recomendaciones
        $recomendaciones = [];
        
        // Verificar si hay problemas de integridad de datos
        if (Schema::hasTable('departamentos') && DB::table('departamentos')->count() === 0) {
            $recomendaciones[] = "<fg=yellow>php artisan db:seed</> - Poblar la base de datos";
        }
        
        // Verificar si hay problemas de cache
        if (File::exists(base_path('bootstrap/cache/config.php'))) {
            $recomendaciones[] = "<fg=yellow>php artisan optimize:clear</> - Limpiar caché del sistema";
        }
        
        // Verificar storage link
        if (!file_exists(public_path('storage'))) {
            $recomendaciones[] = "<fg=yellow>php artisan storage:link</> - Crear enlace simbólico para storage";
        }
        
        // Verificar si hay problemas en rutas
        if (Route::getRoutes()->getRoutesByName() && !Route::has('asesor.dashboard')) {
            $recomendaciones[] = "<fg=yellow>Revisar routes/web.php</> - Faltan rutas críticas";
        }
        
        // Mostrar recomendaciones específicas
        if (!empty($recomendaciones)) {
            foreach ($recomendaciones as $index => $recomendacion) {
                $this->line(($index + 1) . ". {$recomendacion}");
            }
        } else {
            $this->line("1. <fg=yellow>php artisan debug:reset-db</> - Restablecer base de datos para pruebas");
            $this->line("2. <fg=yellow>php artisan cache:clear</> - Limpiar caché de la aplicación");
        }
    }
}
