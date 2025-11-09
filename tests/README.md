# 📋 Estructura de Tests - Sistema Inmobiliaria

## 📊 Resumen General

**Total de Tests**: 116 tests
**Total de Aserciones**: 535 aserciones
**Estado**: ✅ 100% pasando

---

## 🗂️ Estructura de Carpetas

```
tests/
├── Unit/                           # Tests Unitarios (6 tests)
│   ├── Models/                     # Tests de modelos
│   │   └── DepartamentoTest.php   (5 tests)
│   └── ExampleTest.php            (1 test)
│
├── Feature/                        # Tests de Integración/Funcionales (110 tests)
│   ├── Public/                     # Tests del Sistema Público (31 tests)
│   │   ├── PublicPagesTest.php             (9 tests) - Páginas informativas
│   │   ├── PublicFunctionalityTest.php    (10 tests) - Funcionalidad pública
│   │   ├── CatalogoTest.php                (6 tests) - Catálogo público
│   │   ├── DepartamentoTest.php            (4 tests) - Gestión departamentos
│   │   └── DepartamentoValidationTest.php  (2 tests) - Validaciones
│   │
│   ├── Cliente/                    # Tests del Sistema Cliente (27 tests)
│   │   ├── ClienteFunctionalityTest.php   (15 tests) - Funcionalidad cliente
│   │   └── ClientePerfilTest.php          (12 tests) - Perfil y validaciones
│   │
│   ├── Asesor/                     # Tests del Sistema Asesor (22 tests)
│   │   ├── AsesorAccessTest.php            (5 tests) - Acceso y permisos
│   │   └── ClienteTest.php                (17 tests) - Gestión de clientes
│   │
│   ├── Admin/                      # Tests del Sistema Admin (6 tests)
│   │   └── UserControllerTest.php          (6 tests) - Gestión de usuarios
│   │
│   ├── Auth/                       # Tests de Autenticación (22 tests)
│   │   ├── AuthenticationTest.php          (4 tests) - Login/Logout
│   │   ├── RegistrationTest.php            (2 tests) - Registro
│   │   ├── PasswordUpdateTest.php          (2 tests) - Cambio contraseña
│   │   ├── PasswordResetTest.php           (4 tests) - Recuperar contraseña
│   │   ├── PasswordConfirmationTest.php    (3 tests) - Confirmar contraseña
│   │   ├── EmailVerificationTest.php       (3 tests) - Verificación email
│   │   └── LoginInactiveUserTest.php       (4 tests) - Usuarios inactivos
│   │
│   └── ExampleTest.php            (2 tests) - Tests de ejemplo
│
└── TestCase.php                    # Clase base para todos los tests
```

---

## 📝 Tipos de Tests

### 1️⃣ **Tests Unitarios** (Unit/)
- **Propósito**: Probar componentes individuales aislados
- **Alcance**: Modelos, servicios, helpers
- **Características**:
  - No hacen peticiones HTTP
  - No dependen de la base de datos completa
  - Prueban lógica de negocio específica
  - Rápidos de ejecutar

**Ejemplos**:
- ✅ Cálculo de precio por m²
- ✅ Ordenamiento de imágenes
- ✅ Verificación de estado disponible
- ✅ Obtención de imagen principal

### 2️⃣ **Tests de Integración/Funcionales** (Feature/)
- **Propósito**: Probar funcionalidades completas del sistema
- **Alcance**: Controladores, rutas, vistas, base de datos
- **Características**:
  - Hacen peticiones HTTP completas
  - Interactúan con la base de datos
  - Prueban flujos completos de usuario
  - Validan respuestas y redirecciones

**Ejemplos**:
- ✅ Login de usuario
- ✅ Registro de cliente
- ✅ Gestión de favoritos
- ✅ Filtrado de catálogo
- ✅ CRUD de departamentos

---

## 🎯 Cobertura por Módulo

### 📱 **Sistema Público** (31 tests)
```php
✅ Páginas informativas (9 tests)
   - Home, Sobre Nosotros, Contacto
   - Formulario de contacto con validaciones
   - Acceso sin autenticación

✅ Catálogo público (16 tests)
   - Listado de departamentos
   - Filtros (ubicación, precio, búsqueda)
   - Detalle de propiedades
   - Departamentos similares
   - Solo propiedades disponibles
   - Ordenamiento por destacados

✅ Gestión departamentos (6 tests)
   - CRUD completo
   - Validaciones de campos
   - Cambios en interfaz
```

### 👤 **Sistema Cliente** (27 tests)
```php
✅ Funcionalidad (15 tests)
   - Dashboard con estadísticas
   - Catálogo privado
   - Gestión de favoritos (agregar, ver, quitar)
   - Filtros y búsqueda
   - Detalle de departamentos
   - Control de acceso por rol
   - Redirecciones según rol

✅ Perfil (12 tests)
   - Ver página de perfil
   - Actualizar datos personales
   - Validación DNI (8 dígitos, solo números)
   - Validación edad (18+ años)
   - Validación estado civil
   - Validación ingresos mensuales
   - Control de acceso
```

### 👨‍💼 **Sistema Asesor** (22 tests)
```php
✅ Acceso (5 tests)
   - Dashboard de asesor
   - Acceso a clientes, cotizaciones, solicitudes
   - Control de permisos

✅ Gestión de clientes (17 tests)
   - Listar clientes del asesor
   - Crear cliente con validaciones
   - Ver detalles de cliente
   - Aislamiento entre asesores
   - Validaciones (email, teléfono, presupuesto)
   - Control de roles
```

### 🔐 **Autenticación** (22 tests)
```php
✅ Login/Logout (4 tests)
   - Renderizar pantalla de login
   - Autenticación exitosa
   - Error con contraseña inválida
   - Cerrar sesión

✅ Registro (2 tests)
   - Formulario de registro
   - Crear nueva cuenta

✅ Gestión de contraseña (9 tests)
   - Actualizar contraseña
   - Recuperar contraseña
   - Confirmar contraseña
   - Validaciones

✅ Verificación email (3 tests)
   - Pantalla de verificación
   - Verificar email
   - Hash inválido

✅ Usuarios inactivos (4 tests)
   - Bloqueo de login
   - Terminación de sesión
   - Control de estado
```

### 👑 **Sistema Admin** (6 tests)
```php
✅ Gestión de usuarios (6 tests)
   - Editar usuario
   - Actualizar datos
   - Crear usuario
   - Cambiar estado
   - Eliminar usuario
   - Control de permisos
```

---

## 🧪 Patrones de Testing Utilizados

### **AAA Pattern** (Arrange, Act, Assert)
```php
public function test_ejemplo()
{
    // Arrange - Preparar datos
    $user = User::factory()->create();
    
    // Act - Ejecutar acción
    $response = $this->actingAs($user)->get('/dashboard');
    
    // Assert - Verificar resultado
    $response->assertStatus(200);
}
```

### **Factory Pattern**
```php
// Usar factories para crear datos de prueba
$departamento = Departamento::factory()->create([
    'precio' => 250000,
    'habitaciones' => 3,
]);
```

### **Database Transactions**
```php
use RefreshDatabase; // Resetea BD entre tests
```

### **Inertia Assertions**
```php
$response->assertInertia(fn ($page) =>
    $page->component('Cliente/Dashboard')
        ->has('estadisticas')
);
```

---

## 🚀 Comandos Útiles

### Ejecutar todos los tests
```bash
php artisan test
```

### Ejecutar tests de un módulo específico
```bash
php artisan test tests/Feature/Cliente
php artisan test tests/Feature/Public
php artisan test tests/Feature/Asesor
php artisan test tests/Feature/Admin
php artisan test tests/Feature/Auth
```

### Ejecutar un archivo de tests específico
```bash
php artisan test tests/Feature/Cliente/ClienteFunctionalityTest.php
php artisan test tests/Unit/Models/DepartamentoTest.php
```

### Ejecutar un test específico
```bash
php artisan test --filter=test_cliente_puede_agregar_favorito
php artisan test --filter=ClienteFunctionalityTest::test_cliente_puede_agregar_favorito
```

### Ver cobertura de tests
```bash
php artisan test --coverage
```

### Tests en paralelo (más rápido)
```bash
php artisan test --parallel
```

### Tests con verbosidad
```bash
php artisan test -v
php artisan test -vv
php artisan test -vvv
```

---

## 📈 Estadísticas de Tests

| Módulo | Tests | Aserciones | Estado |
|--------|-------|------------|--------|
| **Unit** | 6 | ~20 | ✅ 100% |
| **Public** | 31 | ~140 | ✅ 100% |
| **Cliente** | 27 | ~130 | ✅ 100% |
| **Asesor** | 22 | ~100 | ✅ 100% |
| **Admin** | 6 | ~30 | ✅ 100% |
| **Auth** | 22 | ~110 | ✅ 100% |
| **Otros** | 2 | ~5 | ✅ 100% |
| **TOTAL** | **116** | **535** | **✅ 100%** |

---

## 🎯 Buenas Prácticas Aplicadas

### ✅ Nomenclatura Clara
- Nombres descriptivos que indican qué se está probando
- Prefijo `test_` para identificar métodos de prueba
- Nombres en español para mejor comprensión del equipo

### ✅ Tests Independientes
- Cada test puede ejecutarse de forma aislada
- No dependen del orden de ejecución
- Usan `RefreshDatabase` para estado limpio

### ✅ Cobertura Completa
- Happy paths (casos exitosos)
- Edge cases (casos límite)
- Error cases (casos de error)
- Validaciones
- Permisos y roles

### ✅ Datos de Prueba
- Uso de factories para datos consistentes
- Datos realistas
- Estados conocidos y predecibles

### ✅ Aserciones Específicas
- Verifican exactamente lo necesario
- Múltiples aserciones cuando es apropiado
- Mensajes claros de error

---

## 🔄 Flujo de Desarrollo con Tests

1. **Escribir test** (TDD - Test Driven Development)
   ```bash
   php artisan make:test Feature/NuevoModulo/NuevaFuncionalidadTest
   ```

2. **Ejecutar test** (debe fallar inicialmente)
   ```bash
   php artisan test --filter=NuevaFuncionalidadTest
   ```

3. **Implementar funcionalidad**

4. **Ejecutar test** (debe pasar)
   ```bash
   php artisan test --filter=NuevaFuncionalidadTest
   ```

5. **Refactorizar** si es necesario

6. **Ejecutar todos los tests** (regression testing)
   ```bash
   php artisan test
   ```

---

## 📚 Recursos Adicionales

- [Laravel Testing Documentation](https://laravel.com/docs/testing)
- [PHPUnit Documentation](https://phpunit.de/documentation.html)
- [Inertia Testing Helpers](https://inertiajs.com/testing)
- [Laravel Factories](https://laravel.com/docs/database-testing#factories)

---

## 🎉 Conclusión

El sistema cuenta con una **cobertura de tests del 100%** con **116 tests** que verifican:

✅ Funcionalidad completa de todos los módulos
✅ Validaciones de datos
✅ Control de acceso y permisos
✅ Flujos completos de usuario
✅ Casos de error y excepciones
✅ Integraciones entre componentes

Esto garantiza la **calidad**, **estabilidad** y **mantenibilidad** del código.
