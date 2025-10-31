# 📋 CONTEXTO DEL PROYECTO - SISTEMA INMOBILIARIA

> **Fecha de creación:** 31 de octubre de 2025  
> **Última actualización:** 31 de octubre de 2025

---

## 🎯 FILOSOFÍA DEL PROYECTO

**IMPORTANTE:** Este proyecto debe mantenerse **LIMPIO y MINIMALISTA**.
- ❌ **NO agregar dependencias innecesarias**
- ❌ **NO implementar código redundante**
- ❌ **NO sobre-complicar soluciones simples**
- ✅ **SÍ usar funcionalidades nativas de Laravel/React**
- ✅ **SÍ mantener el stack simple y eficiente**

---

## 🛠️ STACK TECNOLÓGICO

### Backend
- **Laravel 12** (última versión)
- **PHP 8.x**
- **MySQL** (Base de datos)
- **Laravel Breeze** (Autenticación)
- **Inertia.js v2.0.4** (Bridge Laravel-React)

### Frontend
- **React 18**
- **Vite 6.4.1** (Build tool)
- **Tailwind CSS** (Estilos)
- **Inertia.js** (SPA sin API REST)

### Testing
- **PHPUnit** (Tests backend)
- **Inertia Testing** (Tests integración)

---

## 📁 ESTRUCTURA DE ARCHIVOS IMPORTANTE

### Backend
```
app/
├── Http/
│   ├── Controllers/
│   │   ├── Admin/          # Controladores administrador
│   │   │   ├── UserController.php
│   │   │   ├── DashboardController.php
│   │   │   ├── AsesorController.php
│   │   │   ├── DepartamentoController.php
│   │   │   ├── VentaController.php
│   │   │   └── ReporteController.php
│   │   ├── Asesor/         # Controladores asesor
│   │   ├── Cliente/        # Controladores cliente
│   │   ├── Auth/           # Autenticación (Breeze)
│   │   └── Public/         # Catálogo público
│   ├── Middleware/
│   │   ├── CheckActiveUser.php    # ✅ Verifica usuario activo
│   │   ├── RoleMiddleware.php     # Control de roles
│   │   └── HandleInertiaRequests.php
│   └── Requests/
│       └── Auth/
│           └── LoginRequest.php   # ✅ Validación login + estado activo
├── Models/
│   ├── User.php           # Modelo usuario (estado: activo/inactivo)
│   ├── Cliente.php
│   ├── Asesor.php
│   ├── Departamento.php
│   ├── Venta.php
│   ├── Reserva.php
│   └── Cotizacion.php
└── Policies/
    ├── AsesorPolicy.php
    ├── CotizacionPolicy.php
    └── ReservaPolicy.php
```

### Frontend
```
resources/
├── js/
│   ├── Pages/
│   │   ├── Admin/
│   │   │   ├── Dashboard/
│   │   │   ├── Usuarios/
│   │   │   │   ├── Index.jsx      # ✅ Lista usuarios con desactivar
│   │   │   │   ├── Crear.jsx
│   │   │   │   └── Editar.jsx
│   │   │   ├── Asesores/
│   │   │   ├── Departamentos/
│   │   │   ├── Ventas/
│   │   │   └── Reportes/
│   │   ├── Asesor/
│   │   ├── Cliente/
│   │   ├── Auth/              # Login/Register (Breeze)
│   │   └── Public/            # Catálogo público
│   ├── Layouts/
│   │   ├── AdminLayout.jsx
│   │   ├── AsesorLayout.jsx
│   │   ├── ClienteLayout.jsx
│   │   └── PublicLayout.jsx
│   └── app.jsx
└── css/
    └── app.css
```

---

## 🗄️ BASE DE DATOS - CAMPOS IMPORTANTES

### Tabla `users`
```sql
- id
- name
- email
- password
- role (ENUM: 'cliente', 'asesor', 'administrador')
- estado (ENUM: 'activo', 'inactivo')  # ✅ Campo crítico
- telefono
- created_at
- updated_at
```

### Tabla `departamentos`
```sql
- id
- titulo
- descripcion
- precio
- ubicacion
- estado (ENUM: 'disponible', 'reservado', 'vendido')
- destacado (boolean)
- propietario_id
- created_at
- updated_at
```

---

## 🔐 SISTEMA DE AUTENTICACIÓN Y ROLES

### Roles del Sistema
1. **Administrador** (`administrador`)
   - Acceso: `/admin/*`
   - Gestión completa del sistema
   - CRUD usuarios, asesores, departamentos, ventas
   - ✅ Puede desactivar/activar usuarios

2. **Asesor** (`asesor`)
   - Acceso: `/asesor/*`
   - Gestión de clientes, cotizaciones, reservas
   - Crear solicitudes de venta

3. **Cliente** (`cliente`)
   - Acceso: `/cliente/*`
   - Ver catálogo, crear solicitudes
   - Favoritos, cotizaciones, reservas

### Sistema de Desactivación (IMPLEMENTADO ✅)
**Archivos involucrados:**
1. `LoginRequest.php` - Valida estado en login
2. `CheckActiveUser.php` - Middleware verifica en cada request
3. `AuthenticatedSessionController.php` - Manejo de errores
4. `routes/web.php` - Middleware aplicado a rutas
5. `bootstrap/app.php` - Registro del middleware 'active'

**Funcionamiento:**
- Usuario con `estado = 'inactivo'` NO puede iniciar sesión
- Usuario activo que es desactivado pierde sesión automáticamente
- Mensaje al usuario: "Tu cuenta ha sido desactivada. Contacta al administrador."

---

## 🧪 TESTING

### Tests Críticos (TODOS DEBEN PASAR ✅)
```bash
# Tests de usuarios
php artisan test tests/Feature/Admin/UserControllerTest.php

# Tests de desactivación
php artisan test tests/Feature/Auth/LoginInactiveUserTest.php

# Todos los tests de autenticación
php artisan test tests/Feature/Auth/
```

### Estado Actual de Tests
- ✅ 28 tests pasando (78 assertions)
- ✅ UserControllerTest: 6 tests
- ✅ LoginInactiveUserTest: 4 tests
- ✅ Auth general: 18 tests

---

## 🚀 CONVENCIONES Y BUENAS PRÁCTICAS

### Nombres en Español
- Rutas: `/admin/usuarios/crear` (NO `/users/create`)
- Métodos: `cambiarEstado()` (NO `changeStatus()`)
- ENUM values: `'activo'`, `'inactivo'` (NO `'active'`, `'inactive'`)

### Estructura de Controladores
```php
// ✅ CORRECTO - Sin dependencias innecesarias
public function cambiarEstado($id)
{
    $user = User::findOrFail($id);
    $user->estado = $user->estado === 'activo' ? 'inactivo' : 'activo';
    $user->save();
    
    return redirect()->back();
}
```

### Componentes React/Inertia
```jsx
// ✅ CORRECTO - Usar Inertia router
import { router } from '@inertiajs/react';

const handleDelete = (id) => {
    if (confirm('¿Estás seguro?')) {
        router.delete(`/admin/usuarios/${id}`);
    }
};
```

---

## 📝 RUTAS PRINCIPALES

### Admin
- `GET /admin/dashboard` - Dashboard administrador
- `GET /admin/usuarios` - Lista usuarios
- `POST /admin/usuarios` - Crear usuario
- `PATCH /admin/usuarios/{id}` - Actualizar usuario
- `PATCH /admin/usuarios/{id}/estado` - ✅ Cambiar estado (activar/desactivar)
- `DELETE /admin/usuarios/{id}` - Eliminar usuario

### Asesor
- `GET /asesor/dashboard` - Dashboard asesor
- `GET /asesor/clientes` - Lista clientes
- `GET /asesor/cotizaciones` - Cotizaciones

### Cliente
- `GET /cliente/dashboard` - Dashboard cliente
- `GET /cliente/favoritos` - Favoritos
- `GET /cliente/solicitudes` - Solicitudes

### Público
- `GET /catalogo` - Catálogo de departamentos
- `GET /catalogo/{id}` - Detalle departamento

---

## ⚙️ COMANDOS ÚTILES

```bash
# Limpiar cache
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Recompilar assets
npm run build

# Tests
php artisan test
php artisan test --filter=NombreTest

# Migraciones
php artisan migrate
php artisan migrate:fresh --seed

# Ver rutas
php artisan route:list
```

---

## 🔧 CONFIGURACIÓN IMPORTANTE

### `.env` - Variables críticas
```env
APP_NAME=Inmobiliaria
APP_ENV=local
APP_DEBUG=true

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=inmobiliaria
DB_USERNAME=root
DB_PASSWORD=

SESSION_DRIVER=database
```

### `bootstrap/app.php` - Middleware registrados
```php
$middleware->alias([
    'role' => \App\Http\Middleware\RoleMiddleware::class,
    'active' => \App\Http\Middleware\CheckActiveUser::class,  // ✅ Crucial
]);
```

---

## 🐛 PROBLEMAS CONOCIDOS Y SOLUCIONES

### Error: "Undefined method 'string'" en LoginRequest
**Solución:** Usar `$this['email']` en lugar de `$this->string('email')`
```php
// ✅ Laravel 12
return Str::transliterate(Str::lower($this['email'] ?? '') . '|' . request()->ip());
```

### Error: "Column 'disponible' not found"
**Causa:** Tests usando campo antiguo de departamentos
**Solución:** Verificar migración y actualizar tests

---

## 📚 DOCUMENTACIÓN ADICIONAL

- `INFORME_TECNICO_COMPLETO.md` - Análisis técnico detallado
- `REQUISITOS_FUNCIONALES_PENDIENTES.md` - Funcionalidades por implementar
- `CONFIGURACION_DESARROLLO_PHP.md` - Setup entorno desarrollo
- `GUIA_TESTING_DEBUGGING.md` - Guía de testing

---

## 🎯 PRÓXIMOS PASOS / PENDIENTES

- [ ] Implementar reportes de ventas
- [ ] Sistema de notificaciones
- [ ] Gestión de imágenes de departamentos
- [ ] Dashboard con estadísticas
- [ ] Exportación de reportes (PDF/Excel)

---

## ⚠️ RECORDATORIOS IMPORTANTES

1. **SIEMPRE** ejecutar tests antes de hacer commit
2. **NUNCA** agregar dependencias sin consultar primero
3. **MANTENER** el código limpio y simple
4. **USAR** funcionalidades nativas de Laravel/React cuando sea posible
5. **DOCUMENTAR** cambios importantes en este archivo
6. **RESPETAR** las convenciones de nombres en español
7. **EVITAR** código redundante o innecesario

---

**Última actualización:** 31 de octubre de 2025  
**Mantenido por:** EliasibQuillca  
**Versión del proyecto:** Laravel 12 + React 18 + Inertia.js 2.0
