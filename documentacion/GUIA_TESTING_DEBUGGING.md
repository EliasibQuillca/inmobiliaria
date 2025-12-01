# 🔍 Guía de Testing y Debugging en el Sistema Inmobiliario

## 1. Visión General del Sistema

### 1.1 Arquitectura del Sistema
- **Backend**: Laravel 12 (PHP 8.4+)
- **Frontend**: React 18 + Inertia.js + Breeze
- **Base de Datos**: MySQL 8.0+
- **Servidor Local**: Laragon (Apache + MySQL + PHP)
- **Estilo CSS**: Tailwind CSS 3.x

### 1.2 Componentes Principales
- **Gestión de Departamentos**: Core del sistema
  - Listado y búsqueda
  - Creación y edición
  - Gestión de imágenes
  - Estados (disponible, reservado, vendido)

- **Sistema de Imágenes**: 
  - Manejo de fotos principales y galerías
  - Ordenamiento y tipos de imágenes
  - Validación y procesamiento

- **Gestión de Usuarios**: 
  - Administradores: Control total del sistema
  - Asesores: Gestión de ventas y clientes
  - Clientes: Búsqueda y reservas
  - Propietarios: Dueños de departamentos

- **Reservas y Ventas**: 
  - Flujo de cotización
  - Proceso de reserva
  - Registro de ventas
  - Seguimiento de estados

## 2. Enfoque Top-Down para Testing

### 2.1 Pruebas de Integración (Nivel Superior)
Primero probamos cómo los componentes trabajan juntos:

#### 2.1.1 Flujo de Departamentos
```php
public function test_flujo_completo_departamento()
{
    // Crear propietario
    $propietario = Propietario::factory()->create();
    
    // Crear departamento
    $response = $this->actingAs($admin)
        ->post('/admin/departamentos', [
            'titulo' => 'Departamento Test',
            'propietario_id' => $propietario->id,
            // ... otros campos
        ]);
        
    // Verificar creación exitosa
    $response->assertStatus(302);
}
```

#### 2.1.2 Proceso de Venta
```php
public function test_proceso_venta_completo()
{
    // Configurar escenario
    $departamento = Departamento::factory()->create();
    $asesor = Asesor::factory()->create();
    $cliente = Cliente::factory()->create();
    
    // Ejecutar proceso
    $venta = Venta::create([
        'departamento_id' => $departamento->id,
        'asesor_id' => $asesor->id,
        'cliente_id' => $cliente->id,
        // ... otros campos
    ]);
}
```

### 2.2 Pruebas de Controladores (Nivel Medio)
Probamos la lógica de negocio específica:

#### 2.2.1 DepartamentoController
```php
class DepartamentoControllerTest extends TestCase
{
    public function test_actualizar_departamento()
    {
        $departamento = Departamento::factory()->create();
        $response = $this->patch("/admin/departamentos/{$departamento->id}", [
            'titulo' => 'Nuevo Título'
        ]);
        $response->assertStatus(302);
    }
}
```

#### 2.2.2 VentaController
```php
class VentaControllerTest extends TestCase
{
    public function test_registrar_venta()
    {
        $this->post('/admin/ventas', [
            'departamento_id' => $departamento->id,
            'monto' => 150000.00
        ])->assertStatus(201);
    }
}
```

### 2.3 Pruebas de Modelos (Nivel Base)
Probamos las entidades y sus relaciones:

#### 2.3.1 Modelo Departamento
```php
class DepartamentoTest extends TestCase
{
    public function test_relacion_con_propietario()
    {
        $departamento = Departamento::factory()->create();
        $this->assertInstanceOf(Propietario::class, $departamento->propietario);
    }

    public function test_scope_disponibles()
    {
        $this->assertCount(5, Departamento::disponibles()->get());
    }
}
```

#### 2.3.2 Modelo Imagen
```php
class ImagenTest extends TestCase
{
    public function test_ordenamiento_imagenes()
    {
        $departamento = Departamento::factory()->create();
        $imagenes = $departamento->imagenes()->orderBy('orden')->get();
        $this->assertEquals(0, $imagenes->first()->orden);
    }
}
```

## 3. Técnicas de Debugging Efectivas

### 3.1 Configuración del Entorno de Pruebas en Laragon
```php
// 1. Configurar .env para modo depuración
// .env
APP_DEBUG=true
LOG_LEVEL=debug
LOG_CHANNEL=daily
DB_CONNECTION=mysql

// 2. Crear entorno específico para pruebas
// .env.testing
APP_ENV=testing
APP_DEBUG=true
DB_CONNECTION=mysql
DB_DATABASE=inmobiliaria_testing
LOG_CHANNEL=single

// 3. Preparar la base de datos para pruebas
// Windows PowerShell (crear base de datos específica para pruebas)
mysql -u root -e "DROP DATABASE IF EXISTS inmobiliaria_testing; CREATE DATABASE inmobiliaria_testing;"

// 4. Ejecutar migraciones y seeders en la base de pruebas
// En CMD con Laragon
php artisan migrate:fresh --seed --env=testing

// 5. Ejecutar pruebas en el entorno aislado
// CMD con Laragon
php artisan test --env=testing
```

### 3.2 Uso de Logs Estratégicos

#### 3.2.1 Comandos Básicos
```bash
# Ver logs en tiempo real
type storage\logs\laravel.log

# Filtrar logs por tipo
type storage\logs\laravel.log | findstr "ERROR"
type storage\logs\laravel.log | findstr "INFO"

# Últimas 50 líneas
type storage\logs\laravel.log | select -last 50
```

#### 3.2.2 Logging en Controladores
```php
// DepartamentoController
Log::info('Iniciando actualización de departamento', [
    'id' => $departamento->id,
    'user' => Auth::user()->email,
    'data' => $request->validated()
]);

// VentaController
Log::info('Procesando venta', [
    'departamento_id' => $venta->departamento_id,
    'monto' => $venta->monto,
    'asesor' => $venta->asesor->nombre
]);
```

#### 3.2.3 Logging en Modelos
```php
// Departamento.php
protected static function booted()
{
    static::created(function ($departamento) {
        Log::info('Nuevo departamento creado', [
            'id' => $departamento->id,
            'titulo' => $departamento->titulo
        ]);
    });
}

// Imagen.php
public function save(array $options = [])
{
    Log::debug('Guardando imagen', [
        'tipo' => $this->tipo,
        'url' => $this->url,
        'departamento_id' => $this->departamento_id
    ]);
    return parent::save($options);
}
```

#### 3.2.4 Logging de Excepciones
```php
try {
    // Código que puede fallar
} catch (\Exception $e) {
    Log::error('Error en proceso de venta', [
        'error' => $e->getMessage(),
        'file' => $e->getFile(),
        'line' => $e->getLine(),
        'trace' => $e->getTraceAsString()
    ]);
}
```

### 3.3 Debugging Específico Laravel + React en Laragon

#### 3.3.1 Depuración del Backend (Laravel)
```php
// Depuración de solicitudes HTTP (ideal para API/Inertia)
Log::debug('Request recibido', [
    'method' => request()->method(),
    'path' => request()->path(),
    'params' => request()->all(),
    'user' => auth()->check() ? auth()->id() : 'guest'
]);

// Depuración de Eloquent y consultas SQL
DB::listen(function($query) {
    $sqlWithBindings = str_replace(['%', '?'], ['%%', '%s'], $query->sql);
    $sqlWithBindings = vsprintf($sqlWithBindings, $query->bindings);
    Log::debug('SQL: ' . $sqlWithBindings . " ({$query->time}ms)");
});

// Depuración de caché y su impacto
$cacheHit = Cache::has('departamentos');
$departamentos = Cache::remember('departamentos', 3600, function() {
    Log::debug('Cache miss: regenerando departamentos');
    return Departamento::with('imagenes')->get();
});
Log::debug($cacheHit ? 'Cache hit: usando datos en caché' : 'Cache miss: datos regenerados');

// Monitoreo de eventos del sistema
Event::listen('*', function ($eventName, array $data) {
    if (in_array($eventName, [
        'eloquent.created: App\Models\Departamento',
        'eloquent.updated: App\Models\Departamento'
    ])) {
        Log::debug('Evento capturado: ' . $eventName, [
            'data' => $data
        ]);
    }
});
```

#### 3.3.2 Depuración del Frontend (React + Inertia)
```javascript
// Debugger en componentes React
import { useDebugValue } from 'react';

function useDepartamentosDebug(departamentos) {
    // Este valor aparecerá en React DevTools
    useDebugValue(
        departamentos, 
        (deps) => `${deps.length} departamentos cargados`
    );
    
    // Resto de la lógica del hook...
    return departamentos;
}

// Analizar re-renderizados con componentes personalizados
function withRenderTracking(Component) {
    return function TrackedComponent(props) {
        console.log(`${Component.name || 'Component'} renderizado`, 
                    {props, timestamp: new Date().toISOString()});
        return <Component {...props} />;
    }
}

// Uso: const TrackedDepartamentoForm = withRenderTracking(DepartamentoForm);

// Depurando props de Inertia
const { data, setData, post, processing, errors } = useForm({
    titulo: departamento.titulo || '',
    descripcion: departamento.descripcion || '',
    // ...resto de campos
});

console.group('Estado del formulario');
console.log('Data:', data);
console.log('Errores:', errors);
console.log('Procesando:', processing);
console.groupEnd();

// Componente de depuración reutilizable (solo en desarrollo)
function DebugPanel({ data, title = 'Debug' }) {
    if (process.env.NODE_ENV !== 'development') return null;
    
    return (
        <div className="bg-yellow-50 border border-yellow-200 rounded p-4 my-4">
            <h4 className="font-semibold text-yellow-800">{title}</h4>
            <pre className="text-xs overflow-x-auto mt-2">
                {JSON.stringify(data, null, 2)}
            </pre>
        </div>
    );
}

// Uso: <DebugPanel data={departamento} title="Datos del departamento" />
```

#### 3.3.3 Debugging Inertia.js (Puente entre Laravel y React)
```javascript
// En el controlador Laravel
return Inertia::render('Admin/Departamentos/Show', [
    'departamento' => $departamento->load(['imagenes', 'propietario']),
    'historial' => $departamento->historial()->latest()->take(5)->get(),
    '_debug' => app()->environment('local') ? [
        'sql_queries' => DB::getQueryLog(),
        'cache_hits' => Cache::getStore()->getMetrics(),
        'auth' => [
            'user_id' => Auth::id(),
            'roles' => Auth::user()->roles->pluck('name')
        ],
        'timestamps' => [
            'rendered_at' => now()->toIso8601String(),
            'request_time' => round((microtime(true) - LARAVEL_START) * 1000)
        ],
        // Información de la base de datos para depuración
        'db_info' => [
            'departamentos_count' => \App\Models\Departamento::count(),
            'usuarios_count' => \App\Models\User::count(),
            'ultimos_ids' => [
                'departamentos' => DB::table('departamentos')->orderBy('id', 'desc')->limit(5)->pluck('id'),
                'usuarios' => DB::table('users')->orderBy('id', 'desc')->limit(5)->pluck('id'),
                'ventas' => DB::table('ventas')->orderBy('id', 'desc')->limit(5)->pluck('id'),
            ]
        ]
    ] : null
]);

// En el componente React
export default function Show({ departamento, historial, _debug }) {
    // Solo en entorno de desarrollo
    useEffect(() => {
        if (_debug && process.env.NODE_ENV === 'development') {
            console.groupCollapsed('Inertia Debug Data');
            console.log('Queries SQL:', _debug.sql_queries?.length || 0);
            console.table(_debug.sql_queries || []);
            console.log('Auth:', _debug.auth);
            console.log('Tiempo de procesamiento:', _debug.timestamps?.request_time + 'ms');
            console.log('Estado BD:', _debug.db_info);
            console.groupEnd();
            
            // Verificar si los datos están completos
            if (_debug.db_info.departamentos_count === 0) {
                console.warn('⚠️ ALERTA: La base de datos no tiene departamentos. Ejecuta los seeders para probar correctamente.');
                console.info('Comando recomendado: php artisan db:seed --class=DepartamentosSeeder');
            }
        }
    }, [_debug]);

    // Componente de depuración visible sólo en modo desarrollo
    const DebugBanner = () => {
        if (process.env.NODE_ENV !== 'development' || !_debug) return null;
        
        return (
            <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-4">
                <div className="flex items-center">
                    <div className="text-yellow-700">
                        <p className="font-bold">Modo depuración activo</p>
                        <p className="text-sm">
                            {_debug.db_info.departamentos_count > 0 ? (
                                `Departamentos: ${_debug.db_info.departamentos_count} | Usuarios: ${_debug.db_info.usuarios_count}`
                            ) : (
                                <span className="text-red-600 font-bold">
                                    ¡Base de datos vacía! Ejecuta: php artisan db:seed
                                </span>
                            )}
                        </p>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div>
            <DebugBanner />
            {/* Resto del contenido del componente */}
        </div>
    );
}
```

### 3.4 Ejemplos Prácticos de Debugging

#### 3.4.1 Debugging de Imágenes en DepartamentoController
```php
// Problema detectado en logs
Log::error('Error al procesar imagen', [
    'tipo' => $imagen['tipo'],
    'orden' => $imagen['orden'] ?? null
]);

// Verificar estado de la base de datos para diagnóstico
$totalImagenes = DB::table('imagenes')->count();
$departamentosConImagenes = DB::table('departamentos')
    ->join('imagenes', 'departamentos.id', '=', 'imagenes.departamento_id')
    ->select('departamentos.id', DB::raw('count(imagenes.id) as total_imagenes'))
    ->groupBy('departamentos.id')
    ->get();

Log::debug('Estado actual de imágenes en BD', [
    'total_imagenes' => $totalImagenes,
    'departamentos_con_imagenes' => $departamentosConImagenes->count(),
    'distribucion' => $departamentosConImagenes->pluck('total_imagenes', 'id')
]);

// Creación de datos de prueba para verificar funcionalidad
if (app()->environment('local')) {
    // Crear departamento e imágenes de prueba para comparar
    $departamentoPrueba = \App\Models\Departamento::factory()->create();
    $imagenPrueba = \App\Models\Imagen::factory()->create([
        'departamento_id' => $departamentoPrueba->id,
        'tipo' => 'principal',
        'orden' => 0
    ]);
    
    Log::info('Datos de prueba creados para comparación', [
        'departamento_id' => $departamentoPrueba->id,
        'imagen_id' => $imagenPrueba->id
    ]);
}

// Solución implementada
$imagenes[] = [
    'tipo' => 'principal',
    'url' => $url,
    'orden' => 0
];

// Verificación post-solución
Log::info('Imagen procesada correctamente', [
    'departamento_id' => $departamento->id,
    'imagen_id' => $imagen->id
]);

// Prueba de integridad después de la solución
$verificacion = \App\Models\Departamento::with('imagenes')
    ->find($departamento->id);

Log::debug('Verificación de integridad post-solución', [
    'total_imagenes' => $verificacion->imagenes->count(),
    'tipos_imagenes' => $verificacion->imagenes->pluck('tipo')->toArray(),
    'estado' => $verificacion->imagenes->count() > 0 ? 'OK' : 'ERROR'
]);
```

#### 3.3.2 Debugging de Transacciones
```php
DB::beginTransaction();
try {
    $venta = Venta::create($datos);
    $departamento->estado = 'vendido';
    $departamento->save();
    
    DB::commit();
    Log::info('Transacción completada');
} catch (\Exception $e) {
    DB::rollBack();
    Log::error('Error en transacción', [
        'error' => $e->getMessage()
    ]);
}
```

#### 3.3.3 Debugging de React/Inertia
```javascript
// En componente React
useEffect(() => {
    console.log('Estado del componente:', {
        departamento,
        imagenes,
        loading
    });
}, [departamento, imagenes]);

// En controlador Laravel
return Inertia::render('Admin/Departamentos', [
    'debug' => [
        'lastAction' => 'update',
        'timestamp' => now()
    ]
]);

## 4. Mejores Prácticas

### 4.1 Prácticas de Testing
- **Enfoque Top-Down**
  ```php
  // Primero: Prueba de integración
  public function test_flujo_venta_completo() { ... }
  
  // Después: Pruebas unitarias
  public function test_calculo_comision() { ... }
  ```

- **Datos de Prueba Realistas**
  ```php
  // Usar factories con estados
  Departamento::factory()->disponible()->create();
  Cliente::factory()->conPreferencias()->create();
  ```

- **Aislamiento de Pruebas**
  ```php
  // Usar transacciones de base de datos
  use RefreshDatabase;
  
  // Mockear servicios externos
  $this->mock(PaymentGateway::class);
  ```

### 4.2 Enfoque de Diagnóstico "De lo General a lo Particular"

Siempre sigue estos pasos al diagnosticar problemas:

1. **Análisis Completo del Contexto**
   ```
   // PASO 1: Entender el contexto completo
   - Revisar todos los archivos relacionados con el problema
   - Estudiar la estructura del proyecto y sus relaciones
   - Entender el flujo completo de datos y procesos
   ```

2. **Recopilación Exhaustiva de Información**
   ```php
   // PASO 2: Recopilar información detallada
   Log::info('Diagnóstico completo del contexto', [
       'request' => request()->all(),
       'session' => session()->all(),
       'usuario' => Auth::user() ? Auth::user()->toArray() : 'invitado',
       'url' => request()->fullUrl(),
       'método' => request()->method(),
       'headers' => request()->headers->all()
   ]);
   ```

3. **Trazabilidad Completa**
   ```php
   // PASO 3: Trazar el flujo desde el inicio hasta el error
   Log::debug('Iniciando trazabilidad completa', [
       'componente' => 'DepartamentoController',
       'método' => 'update',
       'id' => $id,
       'datos' => $request->validated()
   ]);
   
   // Puntos intermedios de la ejecución
   Log::debug('Punto de control 1: Validación completada');
   Log::debug('Punto de control 2: Acceso a la base de datos');
   Log::debug('Punto de control 3: Procesamiento de imágenes');
   
   // Resultado final
   Log::info('Finalización del proceso', [
       'resultado' => $success ? 'éxito' : 'error',
       'tiempo_total' => $tiempoTotal
   ]);
   ```

4. **Tiempo Adecuado para la Investigación**
   ```
   // PASO 4: Investigación profunda sin prisa
   - Dedicar tiempo suficiente para entender todos los componentes
   - No precipitarse con soluciones rápidas sin entender la causa raíz
   - Verificar hipótesis sistemáticamente antes de aplicar cambios
   ```

### 4.3 Prácticas de Debugging
- **Logging Estructurado**
  ```php
  Log::info('Acción completada', [
      'entidad' => 'Departamento',
      'accion' => 'actualizar',
      'datos' => $data
  ]);
  ```

- **Manejo de Errores Consistente**
  ```php
  try {
      // Operación riesgosa
  } catch (ModelNotFoundException $e) {
      // Error específico
  } catch (\Exception $e) {
      // Fallback general
  }
  ```

- **Documentación de Soluciones**
  ```php
  // TODO: Documentar fix para orden de imágenes
  // FIXME: Revisar validación de estados
  // NOTE: Importante mantener orden en transacciones
  ```

### 4.4 Monitoreo y Mantenimiento
- **Revisión Regular de Logs**
  ```bash
  # Script de monitoreo diario
  type storage\logs\laravel.log | findstr "ERROR" > errores_hoy.txt
  ```

- **Pruebas de Rendimiento**
  ```php
  public function test_carga_listado()
  {
      $start = microtime(true);
      // Operación
      $time = microtime(true) - $start;
      $this->assertLessThan(1.0, $time);
  }
  ```

## 5. Herramientas y Comandos para Laravel + React + Inertia

### 5.1 Comandos de Testing Laravel
```bash
# Ejecutar todas las pruebas
php artisan test

# Ejecutar pruebas específicas
php artisan test --filter=DepartamentoTest
php artisan test --group=integration

# Ejecutar con cobertura
php artisan test --coverage
php artisan test --coverage-html reports/

# Crear nueva prueba
php artisan make:test VentaTest
php artisan make:test VentaTest --unit
```

### 5.2 Gestión de Base de Datos MySQL para Testing y Depuración
```bash
# Refrescar migraciones para testing (resetea la base de datos)
php artisan migrate:fresh --seed

# Volver a ejecutar todos los seeders para repoblar la base (sin borrar datos)
php artisan db:seed

# Ejecutar un seeder específico para pruebas concretas
php artisan db:seed --class=DepartamentosSeeder
php artisan db:seed --class=PropietariosSeeder
php artisan db:seed --class=ClientesSeeder
php artisan db:seed --class=AsesoresSeeder

# Recargar datos específicos para un módulo en prueba
php artisan db:seed --class=DepartamentosImagenesSeeder

# Crear datos específicos para una prueba concreta
php artisan tinker
>>> App\Models\Departamento::factory()->count(5)->create();
>>> App\Models\Asesor::factory()->create(['email' => 'test_asesor@example.com']);

# Verificar datos para depuración
php artisan tinker
>>> DB::table('departamentos')->where('estado', 'disponible')->count();
>>> DB::table('ventas')->whereNull('fecha_confirmacion')->get();

# Crear nueva migración para ajustes durante desarrollo
php artisan make:migration add_campos_to_departamentos

# Ejecutar migraciones en producción (sin perder datos)
php artisan migrate
```

### 5.3 Comandos de Debugging en Laragon
```bash
# Ver logs en tiempo real (Windows - Laragon)
type storage\logs\laravel.log

# Filtrar errores recientes (PowerShell)
type storage\logs\laravel.log | findstr "ERROR" | select -last 20

# Filtrar por fecha (PowerShell)
Get-Content storage\logs\laravel.log | Where-Object { $_ -match "2025-10-17" }

# Limpiar logs
del storage\logs\laravel.log
type nul > storage\logs\laravel.log

# Verificar rutas específicas
php artisan route:list --name=asesor
php artisan route:list --path=departamentos

# Depuración de errores
php artisan route:clear  # Limpiar caché de rutas
php artisan view:clear   # Limpiar caché de vistas
php artisan cache:clear  # Limpiar caché de aplicación
php artisan config:clear # Limpiar caché de configuración
php artisan optimize:clear # Limpiar todas las cachés
```

### 5.4 Comando Personalizado para Testing y Debugging
```bash
# Restablecer completamente la base de datos para pruebas
php artisan debug:reset-db

# Modo rápido: solo volver a ejecutar seeders (sin migraciones)
php artisan debug:reset-db --quick

# Crear datos específicos para probar módulo de asesores
php artisan debug:reset-db --asesor --departamentos=50

# Modo completo de pruebas para todos los roles
php artisan debug:reset-db --asesor --clientes --departamentos=100

# Verificar resultados después de ejecutar el seeder
php artisan tinker
>>> App\Models\Departamento::count();
>>> App\Models\User::where('tipo_usuario', 'asesor')->get()->pluck('email');
```

### 5.5 Desarrollo con Laravel + React + Inertia
```

### 5.4 Desarrollo con Laravel + React + Inertia
```bash
# Desarrollo Frontend (React + Inertia + Vite)
npm run dev  # Iniciar servidor de desarrollo con HMR
npm run build # Construir para producción

# Gestión de paquetes backend (Composer)
composer dump-autoload  # Actualizar autoloader
composer install --optimize-autoloader  # Instalar optimizando

# Servidores de desarrollo
php artisan serve  # Iniciar servidor de desarrollo Laravel
php artisan storage:link  # Vincular almacenamiento

# Comandos Inertia.js + React
php artisan inertia:middleware  # Generar middleware de Inertia
npm install  # Instalar dependencias de React

# Comandos de Breeze
php artisan breeze:install react  # Instalar Breeze con React
```

## 6. Proceso de Resolución de Problemas en el Stack Laravel + React + Inertia

### 6.1 Preparación del Entorno para Debugging

#### 6.1.1 Restablecer Datos para Reproducir Problemas
```bash
# 1. Restablecer la base de datos completamente (ideal para reproducir problemas desde cero)
php artisan migrate:fresh --seed

# 2. Ejecutar seeders específicos para recrear escenarios de error
php artisan db:seed --class=DepartamentosSeeder
php artisan db:seed --class=VentasSeeder

# 3. Crear datos específicos para el problema reportado usando Tinker
php artisan tinker
>>> $propietario = \App\Models\Propietario::factory()->create();
>>> $depto = \App\Models\Departamento::factory()->create([
...     'propietario_id' => $propietario->id,
...     'estado' => 'disponible',
...     'precio' => 125000
... ]);
>>> $imagenes = \App\Models\Imagen::factory()->count(3)->create([
...     'departamento_id' => $depto->id
... ]);
>>> \App\Models\Cotizacion::factory()->create([
...     'departamento_id' => $depto->id,
...     'cliente_id' => \App\Models\Cliente::factory()->create()->id
... ]);

# 4. Verificar que el escenario de prueba está correctamente configurado
php artisan tinker
>>> \App\Models\Departamento::with(['propietario', 'imagenes', 'cotizaciones'])->find($depto->id);

# 5. Limpiar caché después de configurar el escenario de prueba
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan cache:clear
```

#### 6.1.2 Activar Herramientas de Debugging para la Sesión
```php
// En AppServiceProvider o en un middleware de prueba:
if (app()->environment('local')) {
    // 1. Activar Query Log para todas las consultas SQL
    DB::enableQueryLog();
    
    // 2. Registrar tiempo de inicio para medir performance
    app()->instance('debug_timer_start', microtime(true));
    
    // 3. Activar registro detallado en rutas específicas
    if (request()->is('asesor/*') || request()->is('admin/departamentos/*')) {
        config(['logging.channels.daily.level' => 'debug']);
    }
    
    // 4. Registrar todas las operaciones de base de datos
    Event::listen(['eloquent.created*', 'eloquent.updated*', 'eloquent.deleted*'], 
        function ($event, $models) {
            foreach ($models as $model) {
                $class = get_class($model);
                $id = $model->id ?? 'nuevo';
                Log::debug("Operación DB: $event en $class:$id", [
                    'datos' => $model->getDirty(),
                    'ruta' => request()->path()
                ]);
            }
        }
    );
}

// Al final de un Request para verificar rendimiento
if (app()->environment('local') && app()->has('debug_timer_start')) {
    $tiempoTotal = microtime(true) - app('debug_timer_start');
    $queries = DB::getQueryLog();
    Log::debug('Rendimiento de Request', [
        'tiempo_total' => round($tiempoTotal, 4) . ' segundos',
        'queries_count' => count($queries),
        'queries_tiempo_total' => array_sum(array_column($queries, 'time')) . ' ms',
        'memoria_usada' => round(memory_get_peak_usage(true) / 1024 / 1024, 2) . ' MB'
    ]);
}
```

### 6.2 Metodología de Debugging Integral

#### 6.2.1 Identificación del Problema (De lo General a lo Particular)
```php
// PASO 1: Análisis completo del contexto
// Tómese el tiempo necesario para entender todo el sistema

// PASO 2: Logging inicial detallado
Log::info('Iniciando diagnóstico completo', [
    'ruta' => request()->path(),
    'metodo' => request()->method(),
    'usuario' => Auth::user()->email ?? 'guest',
    'referer' => request()->header('referer'),
    'userAgent' => request()->userAgent(),
    'timestamp' => now()->format('Y-m-d H:i:s.u')
]);

// PASO 3: Verificación exhaustiva de datos
Log::debug('Datos completos de entrada', [
    'request' => $request->all(),
    'headers' => $request->headers->all(),
    'session' => session()->all(),
    'cookies' => $request->cookies->all()
]);

// PASO 4: Monitoreo detallado del proceso
Log::info('Punto de control alcanzado', [
    'etapa' => 'validación',
    'estado' => 'completado',
    'tiempo_parcial' => number_format(microtime(true) - $startTime, 4) . ' segundos'
]);
```

#### 6.1.2 Análisis Profundo de Causa Raíz
```php
// 1. Lectura completa del código relacionado
// Examinar todos los archivos relevantes:
// - Controladores involucrados
// - Modelos relacionados
// - Rutas y middleware
// - Componentes React/Inertia

// 2. Tracing detallado con contexto completo
try {
    // Operación problemática
} catch (\Exception $e) {
    Log::error('Error detectado - Análisis completo', [
        'tipo' => get_class($e),
        'mensaje' => $e->getMessage(),
        'codigo' => $e->getCode(),
        'archivo' => $e->getFile(),
        'linea' => $e->getLine(),
        'trace' => $e->getTraceAsString(),
        'request_uri' => request()->getRequestUri(),
        'full_url' => request()->fullUrl(),
        'método_http' => request()->method(),
    ]);
    
    // Registro adicional para excepciones específicas
    if ($e instanceof \Illuminate\Database\QueryException) {
        Log::error('Detalles de QueryException', [
            'sql' => $e->getSql(),
            'bindings' => $e->getBindings()
        ]);
    }
}

// 3. Verificación completa del estado del sistema
Log::info('Estado completo del sistema', [
    'memoria_uso' => formatBytes(memory_get_usage(true)),
    'memoria_pico' => formatBytes(memory_get_peak_usage(true)),
    'tiempo_ejecucion' => number_format(microtime(true) - LARAVEL_START, 4) . ' segundos',
    'mysql_conexiones' => DB::select('SHOW STATUS LIKE "Threads_connected"'),
    'mysql_max_conexiones' => DB::select('SHOW VARIABLES LIKE "max_connections"'),
    'mysql_consultas' => DB::getQueryLog(), // Requiere DB::enableQueryLog()
]);

// 4. Revisión de entorno y configuración
Log::debug('Revisión de entorno', [
    'php_version' => phpversion(),
    'laravel_version' => app()->version(),
    'entorno' => app()->environment(),
    'debug_mode' => config('app.debug') ? 'activado' : 'desactivado',
    'config_cache' => app()->configurationIsCached() ? 'activa' : 'inactiva',
    'route_cache' => app()->routesAreCached() ? 'activa' : 'inactiva',
]);
```

#### 6.1.3 Implementación Sistemática de Solución
```php
// 1. Documentar el problema completamente antes de iniciar
Log::info('Documentación del problema antes de solución', [
    'descripcion' => 'Error en rutas de asesor',
    'sintomas' => 'Route [asesor.dashboard] not defined en redirección del middleware',
    'contexto' => 'Sistema inmobiliario con Laravel + Inertia.js + React',
    'archivos_afectados' => ['routes/web.php', 'app/Http/Middleware/AdminRedirectMiddleware.php'],
    'componentes_js' => ['resources/js/Pages/Asesor/Dashboard.jsx'],
]);

// 2. Crear plan de acción detallado
$plan = [
    '1. Análisis completo de rutas existentes',
    '2. Verificación de middleware y controladores',
    '3. Comprobación de componentes React afectados', 
    '4. Diseñar solución sin romper funcionalidad existente',
    '5. Implementar solución con transacciones donde sea posible',
    '6. Validar todos los flujos afectados',
];

// 3. Cambios incrementales con transacciones
DB::beginTransaction();
try {
    // Implementar cambio en la base de datos
    $departamento->update([
        'estado' => 'reservado',
        'fecha_actualizacion' => now()
    ]);
    
    // Crear registro relacionado en transacción
    $reserva = new Reserva([
        'departamento_id' => $departamento->id,
        'cliente_id' => $cliente->id,
        'fecha_inicio' => now(),
        'fecha_fin' => now()->addDays(5)
    ]);
    $reserva->save();
    
    // Registrar cambios adicionales
    AuditoriaUsuario::create([
        'usuario_id' => Auth::id(),
        'accion' => 'reserva_departamento',
        'entidad' => 'Departamento',
        'entidad_id' => $departamento->id
    ]);
    
    // Completar transacción
    DB::commit();
    Log::info('Cambios aplicados exitosamente en transacción');
} catch (\Exception $e) {
    DB::rollBack();
    Log::error('Rollback ejecutado - Error en transacción', [
        'error' => $e->getMessage(),
        'trace' => $e->getTraceAsString()
    ]);
    throw $e; // Relanzar para manejo superior
}

// 4. Validación exhaustiva post-cambio
$resultado = $this->verificarCambiosCompletos([
    'departamento_id' => $departamento->id,
    'reserva_id' => $reserva->id,
    'cliente_id' => $cliente->id
]);

Log::info('Validación completa post-cambio', [
    'exitoso' => $resultado['success'],
    'detalles' => $resultado['details'],
    'tiempo_total' => $resultado['execution_time']
]);

// 5. Documentación de la solución implementada
Log::info('Documentación de solución implementada', [
    'problema_original' => 'Falta de definición de rutas para asesor',
    'solución_aplicada' => 'Añadidas rutas para Dashboard de Asesor y creado helper',
    'archivos_modificados' => [
        'routes/web.php', 
        'app/Http/Kernel.php',
        'resources/js/bootstrap.js'
    ],
    'tiempo_implementación' => '25 minutos',
    'validaciones_realizadas' => [
        'Navegación a Dashboard de Asesor',
        'Uso de la función helper route()',
        'Comportamiento del middleware de redirección'
    ]
]);
```

## 7. Optimización y Mantenimiento en Laravel + React + Inertia.js

### 7.1 Optimización de Rendimiento Full-Stack
```php
// BACKEND: Laravel

// 1. Eager Loading para evitar problema N+1
$departamentos = Departamento::with([
        'propietario', 
        'imagenes', 
        'atributos',
        'reservas' => function($query) {
            $query->where('estado', 'activa');
        }
    ])
    ->where('estado', 'disponible')
    ->paginate(15);

// 2. Caché estratégico en Laravel
Cache::remember('departamentos.destacados', 3600, function () {
    return Departamento::destacados()
        ->with('imagenes')
        ->get()
        ->map(function($departamento) {
            // Solo datos necesarios para reducir JSON
            return [
                'id' => $departamento->id,
                'titulo' => $departamento->titulo,
                'precio' => $departamento->precio,
                'imagen_principal' => $departamento->imagen_principal
            ];
        });
});

// 3. Índices de base de datos MySQL
public function up()
{
    Schema::table('departamentos', function (Blueprint $table) {
        $table->index(['estado', 'destacado']);
        $table->index('ubicacion');
        $table->fullText(['titulo', 'descripcion']); // Búsqueda full-text
    });
}

// FRONTEND: React + Inertia.js

// 4. Optimización de componentes React
import React, { memo, useMemo } from 'react';

// Componente memoizado para evitar renderizados innecesarios
const DepartamentoCard = memo(function DepartamentoCard({ departamento }) {
    // Solo rerenderiza si cambian props importantes
    return (
        <div className="card">
            {/* Contenido */}
        </div>
    );
});

// 5. Cálculos optimizados con useMemo
function ListadoDepartamentos({ departamentos }) {
    // Cálculo costoso cacheado hasta que cambien dependencias
    const estadisticas = useMemo(() => {
        return {
            precioPromedio: departamentos.reduce((sum, d) => sum + d.precio, 0) / departamentos.length,
            totalDisponibles: departamentos.filter(d => d.estado === 'disponible').length,
            // más cálculos...
        };
    }, [departamentos]);
    
    return (
        <div>
            {/* Renderizado */}
        </div>
    );
}

// 6. Code splitting con React.lazy e Inertia
// En app.jsx
import { lazy } from 'react';

const Dashboard = lazy(() => import('./Pages/Asesor/Dashboard'));
```

### 7.2 Mantenimiento Preventivo en Laragon
```php
// 1. Limpieza de logs antiguos en Laragon/Windows
// Script PowerShell para limpiar logs antiguos
// Guardar como: cleanup-logs.ps1
// Get-ChildItem -Path "storage/logs" -Filter "laravel-*.log" | 
//   Where-Object { $_.LastWriteTime -lt (Get-Date).AddDays(-7) } |
//   ForEach-Object { Remove-Item $_.FullName }

// En código PHP
$logsAntiguos = Storage::files('logs');
foreach ($logsAntiguos as $log) {
    if (preg_match('/laravel-\d{4}-\d{2}-\d{2}\.log/', $log)) {
        $fecha = substr($log, 8, 10); // Extraer YYYY-MM-DD
        if (strtotime($fecha) < strtotime('-7 days')) {
            Storage::delete($log);
            Log::info("Log antiguo eliminado: $log");
        }
    }
}

// 2. Optimización de base de datos MySQL
DB::statement('OPTIMIZE TABLE departamentos');
DB::statement('OPTIMIZE TABLE imagenes');
DB::statement('OPTIMIZE TABLE ventas');
DB::statement('ANALYZE TABLE departamentos');

// 3. Verificación de integridad de datos en relaciones
$this->verificarIntegridadDatos();

// 4. Verificación de consistencia en Laravel + React
// Verificar que todos los componentes React están sincronizados
$rutasBackend = Route::getRoutes()->getRoutesByName();
$componentesReact = File::files(resource_path('js/Pages'));
$problemas = [];

foreach ($rutasBackend as $nombre => $ruta) {
    if (strpos($nombre, 'admin.') === 0 || strpos($nombre, 'asesor.') === 0) {
        $componente = str_replace('.', '/', $nombre);
        $rutaComponente = resource_path("js/Pages/$componente.jsx");
        if (!File::exists($rutaComponente)) {
            $problemas[] = "Falta componente React para la ruta: $nombre";
        }
    }
}

Log::info('Verificación de consistencia Laravel-React', [
    'total_rutas' => count($rutasBackend),
    'total_componentes' => count($componentesReact),
    'problemas' => $problemas
]);

// 5. Limpieza de caché (Artisan y Vite)
Artisan::call('cache:clear');
Artisan::call('view:clear');
Artisan::call('route:clear');
Artisan::call('config:clear');
// Ejecutar en terminal: npm cache clean --force
```

## 8. Conclusiones y Mejores Prácticas

### 8.1 Desarrollo
- Usar enfoque top-down para mejor comprensión
- Implementar logging estratégico
- Mantener documentación actualizada
- Realizar pruebas continuas

### 8.2 Mantenimiento
- Monitorear logs regularmente
- Optimizar consultas y rendimiento
- Realizar backups frecuentes
- Actualizar dependencias

### 8.3 Equipo
- Compartir conocimiento y soluciones
- Mantener estándares de código
- Documentar decisiones técnicas
- Realizar revisiones de código

## 9. Optimización y Performance

### 9.1 Optimización de Frontend React

```jsx
// 1. Implementar React.memo para componentes estables
const CardDepartamento = React.memo(({ departamento }) => {
  return (
    <div className="card">
      <h3>{departamento.titulo}</h3>
      {/* Resto del componente */}
    </div>
  );
});

// 2. Utilizar useCallback para funciones en componentes
const handleSubmit = useCallback((e) => {
  e.preventDefault();
  // Lógica de manejo
}, [dependencias]);

// 3. Lazy loading de componentes grandes
const LazyGaleria = React.lazy(() => import('./Galeria'));

function App() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <LazyGaleria />
    </Suspense>
  );
}

// 4. Optimizar re-renderizados con useMemo
const datosCalculados = useMemo(() => {
  return calcularDatos(props.datos);
}, [props.datos]);
```

### 9.2 Optimización de Backend Laravel

```php
// 1. Uso eficiente de Eloquent con carga anticipada (eager loading)
$departamentos = Departamento::with(['imagenes', 'atributos', 'propietario'])
    ->where('estado', 'activo')
    ->get();

// 2. Paginación para grandes conjuntos de datos
return Inertia::render('Departamentos/Index', [
    'departamentos' => Departamento::with('imagenes')
        ->paginate(12),
]);

// 3. Caching estratégico
$precio = Cache::remember('precio_departamento_'.$id, 3600, function () use ($id) {
    return Departamento::find($id)->precio;
});

// 4. Usar colecciones eficientemente
$resultados = $departamentos
    ->filter(fn($dept) => $dept->precio > 100000)
    ->sortBy('precio')
    ->values()
    ->all();
```

### 9.3 Optimización de Inertia.js

```js
// 1. Uso de reusable-head para metadatos
import { Head } from '@inertiajs/react';

export default function Show({ departamento }) {
  return (
    <>
      <Head title={`${departamento.titulo} - Inmobiliaria`} />
      {/* Contenido */}
    </>
  );
}

// 2. Preservación de estado entre navegaciones
<Link 
  href={route('departamentos.show', departamento.id)}
  preserveState
>
  Ver detalles
</Link>

// 3. Optimización de formularios
const { data, setData, post, processing, errors } = useForm({
  nombre: '',
  email: '',
});

// 4. Partial reloads para actualizaciones
Inertia.visit(route('departamentos.index'), {
  only: ['departamentos'],
  preserveScroll: true,
});
```

### 9.4 Monitoreo y Análisis de Performance

```php
// 1. Uso de Query Logging para análisis
DB::enableQueryLog();
// Código que ejecuta queries
$queries = DB::getQueryLog();
Log::debug('Queries ejecutadas', ['count' => count($queries), 'queries' => $queries]);

// 2. Medición de tiempos de ejecución
$startTime = microtime(true);
// Código a medir
$endTime = microtime(true);
$executionTime = $endTime - $startTime;
Log::info('Tiempo de ejecución: ' . $executionTime . ' segundos');

// 3. Monitoreo de memoria
$memoryBefore = memory_get_usage();
// Código a analizar
$memoryAfter = memory_get_usage();
$memoryUsed = $memoryAfter - $memoryBefore;
Log::info('Memoria utilizada: ' . ($memoryUsed / 1024 / 1024) . ' MB');
```

## 10. Referencias y Documentación

### 10.1 Oficiales
- [Laravel 12.x](https://laravel.com/docs)
- [React](https://react.dev/)
- [Inertia.js](https://inertiajs.com/)
- [Laravel Testing](https://laravel.com/docs/testing)
- [Laravel Logging](https://laravel.com/docs/logging)
- [PHPUnit](https://phpunit.de/documentation.html)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [MySQL 8.0+](https://dev.mysql.com/doc/refman/8.0/en/)

### 10.2 Herramientas
- [Laravel Debugbar](https://github.com/barryvdh/laravel-debugbar)
- [Laravel IDE Helper](https://github.com/barryvdh/laravel-ide-helper)
- [React Developer Tools](https://react.dev/learn/react-developer-tools)
- [React Profiler](https://react.dev/reference/react/Profiler)
- [Chrome DevTools Performance](https://developer.chrome.com/docs/devtools/performance/)
- [Laragon](https://laragon.org/docs/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)

### 10.3 Mejores Prácticas
- [Laravel Best Practices](https://github.com/alexeymezenin/laravel-best-practices)
- [React Best Practices](https://react.dev/learn/thinking-in-react)
- [Clean Code PHP](https://github.com/jupeter/clean-code-php)
- [Optimizing Laravel Performance](https://laravel.com/docs/10.x/deployment#optimization)
- [React Performance Optimization](https://react.dev/learn/render-and-commit)