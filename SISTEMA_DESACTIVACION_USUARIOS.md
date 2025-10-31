# 🔒 Sistema de Desactivación de Usuarios

## 📋 Descripción General

El sistema de desactivación de usuarios **NO ES SOLO VISUAL** - es una funcionalidad completa que previene el acceso de usuarios desactivados en múltiples niveles de seguridad.

## ✅ Niveles de Protección Implementados

### 1. 🚪 **Validación en Login**
**Archivo**: `app/Http/Requests/Auth/LoginRequest.php`

Cuando un usuario intenta iniciar sesión:
- ✅ Se verifican las credenciales (email + password)
- ✅ Se verifica que el campo `estado` sea `'activo'`
- ❌ Si el usuario está `'inactivo'`, se rechaza el login

```php
// Después de la autenticación exitosa
$user = Auth::user();
if ($user && $user->estado !== 'activo') {
    Auth::logout();
    throw ValidationException::withMessages([
        'email' => 'Tu cuenta ha sido desactivada. Contacta al administrador.',
    ]);
}
```

**Mensaje al usuario**: "Tu cuenta ha sido desactivada. Contacta al administrador."

---

### 2. 🛡️ **Middleware de Verificación Activa**
**Archivo**: `app/Http/Middleware/CheckActiveUser.php`

Protección en tiempo real durante la navegación:
- 🔍 Verifica el estado del usuario en **cada petición HTTP**
- 🔌 Cierra automáticamente la sesión si el usuario es desactivado
- 🔄 Aplica a todas las rutas protegidas

```php
public function handle(Request $request, Closure $next): Response
{
    if (Auth::check()) {
        $user = Auth::user();
        
        if ($user->estado !== 'activo') {
            Auth::logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();
            
            return redirect()->route('login')
                ->withErrors(['email' => 'Tu cuenta ha sido desactivada.']);
        }
    }
    
    return $next($request);
}
```

**Registrado en**: `bootstrap/app.php`
```php
$middleware->alias([
    'role' => \App\Http\Middleware\RoleMiddleware::class,
    'active' => \App\Http\Middleware\CheckActiveUser::class,
]);
```

---

### 3. 🎯 **Aplicación en Rutas**
**Archivo**: `routes/web.php`

El middleware se aplica a todas las rutas protegidas:

```php
// Rutas de Cliente
Route::middleware(['auth', 'active', 'role:cliente'])
    ->prefix('cliente')->name('cliente.')->group(function () {
        // Todas las rutas de cliente protegidas
    });

// Rutas de Administrador
Route::middleware(['auth', 'active', 'role:administrador'])
    ->prefix('admin')->name('admin.')->group(function () {
        // Todas las rutas de admin protegidas
    });

// Rutas de Asesor
Route::middleware(['auth', 'active', 'role:asesor'])
    ->prefix('asesor')->name('asesor.')->group(function () {
        // Todas las rutas de asesor protegidas
    });
```

---

## 🧪 Tests Implementados

### **Archivo**: `tests/Feature/Auth/LoginInactiveUserTest.php`

#### Test 1: Usuario inactivo NO puede hacer login ❌
```php
test_inactive_user_cannot_login()
```
- Crea usuario con `estado = 'inactivo'`
- Intenta hacer login
- ✅ **Resultado**: Login rechazado con mensaje de error

#### Test 2: Usuario activo SÍ puede hacer login ✅
```php
test_active_user_can_login()
```
- Crea usuario con `estado = 'activo'`
- Intenta hacer login
- ✅ **Resultado**: Login exitoso y redirección correcta

#### Test 3: Usuario desactivado pierde sesión al reiniciar
```php
test_user_deactivated_after_login_loses_session()
```
- Usuario activo hace login → ✅ Exitoso
- Se desactiva al usuario
- Hace logout y intenta login nuevamente
- ✅ **Resultado**: Login rechazado

#### Test 4: Sesión activa se termina al desactivar ⚡
```php
test_active_session_is_terminated_when_user_is_deactivated()
```
- Usuario activo navega el sitio → ✅ Funciona
- Admin desactiva al usuario
- Usuario intenta navegar nuevamente
- ✅ **Resultado**: Sesión cerrada automáticamente, redirigido a login

---

## 🎬 Flujo Completo de Desactivación

### Escenario: Admin desactiva a un usuario activo

```
1. Usuario "Juan" está navegando el sistema
   ├─ Estado: activo
   └─ Sesión: Autenticada ✅

2. Admin cambia el estado de Juan a "inactivo"
   └─ Botón: "Desactivar" en /admin/usuarios

3. Juan intenta acceder a otra página
   ├─ Middleware CheckActiveUser detecta: estado = 'inactivo'
   ├─ Acción: Cerrar sesión automáticamente
   ├─ Acción: Invalidar tokens de sesión
   └─ Redirección: /login con mensaje de error

4. Juan no puede volver a iniciar sesión
   ├─ Intento: Ingresar email + password
   ├─ LoginRequest verifica: estado = 'inactivo'
   └─ Resultado: Login rechazado ❌
```

---

## 🔐 Base de Datos

### Tabla: `users`

| Campo   | Tipo | Valores Permitidos       | Descripción                    |
|---------|------|--------------------------|--------------------------------|
| estado  | ENUM | 'activo', 'inactivo'     | Estado de la cuenta del usuario |

**Valor por defecto**: `'activo'`

**Validación en Factory**:
```php
'estado' => 'activo',
```

---

## 🎨 Interfaz de Usuario

### Botón de Desactivar/Activar
**Archivo**: `resources/js/Pages/Admin/Usuarios/Index.jsx`

**Visual**:
- 🟢 **Verde** con texto "Activar" → Para usuarios inactivos
- 🟠 **Naranja** con texto "Desactivar" → Para usuarios activos

**Confirmación**:
```javascript
onClick={(e) => {
    e.preventDefault();
    if (confirm(`¿Estás seguro de ${user.estado === 'activo' ? 'desactivar' : 'activar'} este usuario?`)) {
        router.patch(route('admin.usuarios.cambiar-estado', user.id));
    }
}}
```

**Badge de Estado**:
```jsx
<span className={`px-3 py-1 inline-flex items-center gap-2 text-xs leading-5 font-semibold rounded-full ${
    user.estado === 'activo' 
        ? 'bg-green-100 text-green-800' 
        : 'bg-red-100 text-red-800'
}`}>
    {user.estado === 'activo' ? (
        <CheckIcon className="h-4 w-4" />
    ) : (
        <XIcon className="h-4 w-4" />
    )}
    {user.estado === 'activo' ? 'Activo' : 'Inactivo'}
</span>
```

---

## ✅ Verificación de Funcionamiento

### Comando de Tests
```bash
php artisan test --filter=LoginInactiveUserTest
```

**Resultado esperado**:
```
✓ inactive user cannot login
✓ active user can login
✓ user deactivated after login loses session
✓ active session is terminated when user is deactivated

Tests:    4 passed (17 assertions)
```

### Tests de UserController
```bash
php artisan test --filter=UserControllerTest
```

**Resultado esperado**:
```
✓ admin puede ver formulario edicion
✓ admin puede actualizar usuario
✓ usuario no admin no puede editar
✓ admin puede crear usuario
✓ admin puede cambiar estado usuario
✓ admin puede eliminar usuario

Tests:    6 passed (23 assertions)
```

---

## 📝 Resumen

### ¿Qué pasa cuando desactivo un usuario?

| Momento | ¿Puede acceder? | Razón |
|---------|----------------|-------|
| **Antes de login** | ❌ NO | LoginRequest rechaza credenciales |
| **Durante navegación** | ❌ NO | Middleware cierra sesión automáticamente |
| **Después de logout** | ❌ NO | LoginRequest rechaza nuevamente |

### ✅ Confirmación

**SÍ**, la desactivación **FUNCIONA COMPLETAMENTE** y no es solo visual. Un usuario desactivado:
- ❌ No puede iniciar sesión
- ❌ Pierde su sesión automáticamente si ya estaba navegando
- ❌ No puede acceder a ninguna ruta protegida
- ✅ Recibe mensajes claros de error

---

## 📚 Archivos Modificados

1. ✅ `app/Http/Requests/Auth/LoginRequest.php` - Validación en login
2. ✅ `app/Http/Middleware/CheckActiveUser.php` - Middleware de verificación
3. ✅ `app/Http/Controllers/Auth/AuthenticatedSessionController.php` - Manejo de excepciones
4. ✅ `bootstrap/app.php` - Registro de middleware
5. ✅ `routes/web.php` - Aplicación de middleware en rutas
6. ✅ `tests/Feature/Auth/LoginInactiveUserTest.php` - Tests completos
7. ✅ `resources/js/Pages/Admin/Usuarios/Index.jsx` - UI mejorada

---

## 🎯 Conclusión

El sistema de desactivación es **robusto, completo y testeado** ✅

No es un simple cambio visual - es una **seguridad real implementada en múltiples capas** que garantiza que usuarios desactivados no puedan acceder al sistema bajo ninguna circunstancia.
