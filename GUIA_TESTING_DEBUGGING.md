# Guía de Testing y Debugging en el Sistema Inmobiliario

## 1. Visión General del Sistema

### 1.1 Arquitectura del Sistema
- **Backend**: Laravel 12
- **Frontend**: React + Inertia.js (Breeze)
- **Base de Datos**: MySQL
- **Servidor**: Laragon

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

### 3.1 Configuración del Entorno
```php
// .env
APP_DEBUG=true
LOG_LEVEL=debug
LOG_CHANNEL=daily
DB_CONNECTION=mysql
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

### 3.3 Ejemplos Prácticos de Debugging

#### 3.3.1 Debugging de Imágenes en DepartamentoController
```php
// Problema detectado en logs
Log::error('Error al procesar imagen', [
    'tipo' => $imagen['tipo'],
    'orden' => $imagen['orden'] ?? null
]);

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

### 4.2 Prácticas de Debugging
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

### 4.3 Monitoreo y Mantenimiento
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

## 5. Herramientas y Comandos

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

### 5.2 Comandos de Base de Datos
```bash
# Refrescar migraciones
php artisan migrate:fresh --seed

# Crear nueva migración
php artisan make:migration add_campos_to_departamentos

# Crear nuevo seeder
php artisan make:seeder DepartamentosTableSeeder
```

### 5.3 Comandos de Debugging
```bash
# Ver logs en tiempo real
type storage\logs\laravel.log

# Filtrar errores recientes
type storage\logs\laravel.log | findstr "ERROR" | select -last 20

# Limpiar logs
del storage\logs\laravel.log
type nul > storage\logs\laravel.log

# Verificar rutas
php artisan route:list --path=departamentos

# Limpiar caché
php artisan cache:clear
php artisan view:clear
php artisan route:clear
```

### 5.4 Herramientas de Desarrollo
```bash
# NPM para frontend
npm run dev
npm run build

# Composer para backend
composer dump-autoload
composer install --optimize-autoloader

# Artisan para desarrollo
php artisan serve
php artisan storage:link
```

## 6. Proceso de Resolución de Problemas

### 6.1 Metodología de Debugging

#### 6.1.1 Identificación del Problema
```php
// 1. Logging inicial
Log::info('Iniciando diagnóstico', [
    'ruta' => request()->path(),
    'metodo' => request()->method(),
    'usuario' => Auth::user()->email ?? 'guest'
]);

// 2. Verificación de datos
Log::debug('Datos de entrada', [
    'request' => $request->all(),
    'headers' => $request->headers->all()
]);

// 3. Monitoreo de proceso
Log::info('Punto de control alcanzado', [
    'etapa' => 'validación',
    'estado' => 'completado'
]);
```

#### 6.1.2 Análisis de Causa Raíz
```php
// 1. Tracing detallado
try {
    // Operación problemática
} catch (\Exception $e) {
    Log::error('Error detectado', [
        'tipo' => get_class($e),
        'mensaje' => $e->getMessage(),
        'trace' => $e->getTraceAsString()
    ]);
}

// 2. Verificación de estado
Log::info('Estado del sistema', [
    'memoria' => memory_get_usage(true),
    'tiempo' => microtime(true) - LARAVEL_START
]);
```

#### 6.1.3 Implementación de Solución
```php
// 1. Cambios incrementales
DB::beginTransaction();
try {
    // Implementar cambio
    // Verificar resultado
    DB::commit();
    Log::info('Cambio aplicado exitosamente');
} catch (\Exception $e) {
    DB::rollBack();
    Log::error('Rollback ejecutado', ['error' => $e->getMessage()]);
}

// 2. Validación post-cambio
$resultado = $this->verificarCambio();
Log::info('Validación completada', ['exitoso' => $resultado]);
```

## 7. Optimización y Mantenimiento

### 7.1 Optimización de Rendimiento
```php
// 1. Eager Loading
$departamentos = Departamento::with(['propietario', 'imagenes'])
    ->paginate(15);

// 2. Caché estratégico
Cache::remember('departamentos.destacados', 3600, function () {
    return Departamento::destacados()->get();
});

// 3. Índices de base de datos
public function up()
{
    Schema::table('departamentos', function (Blueprint $table) {
        $table->index(['estado', 'destacado']);
        $table->index('ubicacion');
    });
}
```

### 7.2 Mantenimiento Preventivo
```php
// 1. Limpieza de logs antiguos
Storage::delete('logs/laravel-*.log');

// 2. Optimización de base de datos
DB::statement('OPTIMIZE TABLE departamentos');

// 3. Verificación de integridad
$this->verificarIntegridadDatos();
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

## 9. Referencias y Documentación

### 9.1 Oficiales
- [Laravel 12.x](https://laravel.com/docs)
- [React](https://react.dev/)
- [Inertia.js](https://inertiajs.com/)
- [Laravel Testing](https://laravel.com/docs/testing)
- [Laravel Logging](https://laravel.com/docs/logging)
- [PHPUnit](https://phpunit.de/documentation.html)

### 9.2 Herramientas
- [Laravel Debugbar](https://github.com/barryvdh/laravel-debugbar)
- [Laravel IDE Helper](https://github.com/barryvdh/laravel-ide-helper)
- [React Developer Tools](https://react.dev/learn/react-developer-tools)

### 9.3 Mejores Prácticas
- [Laravel Best Practices](https://github.com/alexeymezenin/laravel-best-practices)
- [React Best Practices](https://react.dev/learn/thinking-in-react)
- [Clean Code PHP](https://github.com/jupeter/clean-code-php)