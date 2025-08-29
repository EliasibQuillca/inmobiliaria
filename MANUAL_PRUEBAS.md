## 🧪 MANUAL DE PRUEBAS DEL SISTEMA INMOBILIARIO

### ✅ CHECKLIST DE VERIFICACIÓN PASO A PASO

#### 1️⃣ **VERIFICACIÓN DE SERVIDORES**
- [ ] ✅ Laravel corriendo en `http://127.0.0.1:8000`
- [ ] ✅ Vite corriendo para assets en desarrollo
- [ ] ✅ Base de datos conectada

#### 2️⃣ **PRUEBAS DE PÁGINAS PÚBLICAS**
- [ ] **Página de Inicio** → `http://127.0.0.1:8000/`
  - Debe redirigir al catálogo público
  
- [ ] **Catálogo Público** → `http://127.0.0.1:8000/catalogo`
  - Muestra lista de departamentos
  - Títulos correctos (no códigos)
  - Imágenes se cargan

- [ ] **Detalle de Departamento** → Hacer clic en cualquier departamento
  - Carousel de imágenes funciona
  - Navegación con flechas
  - Miniaturas clickeables
  - Información completa visible

#### 3️⃣ **PRUEBAS DE AUTENTICACIÓN**
- [ ] **Página de Login** → `http://127.0.0.1:8000/login`
  - Formulario se muestra correctamente
  - Sin errores 419 al cargar
  
- [ ] **Proceso de Login**
  - Intentar login con credenciales inválidas
  - Intentar login con credenciales válidas
  - No debe aparecer error 419
  - Si aparece mensaje "Reintentando conexión..." debe desaparecer automáticamente

- [ ] **Token CSRF** → `http://127.0.0.1:8000/csrf-token`
  - Debe devolver JSON con csrf_token

#### 4️⃣ **PRUEBAS DE ADMINISTRACIÓN**
- [ ] **Login como Admin**
  - Email: admin@test.com
  - Password: password123
  
- [ ] **Panel de Administración**
  - Dashboard se carga correctamente
  - Menú de navegación funciona
  
- [ ] **Gestión de Departamentos**
  - Crear nuevo departamento
  - Subir múltiples imágenes (hasta 5)
  - Editar departamento existente
  - Verificar que cambios se reflejan en catálogo público

#### 5️⃣ **PRUEBAS DE CAROUSEL DE IMÁGENES**
- [ ] **Departamento con múltiples imágenes**
  - Navegación con flechas ◄ ►
  - Indicadores de puntos en la parte inferior
  - Miniaturas debajo del carousel
  - Clic en miniaturas cambia imagen principal
  - URLs externas e imágenes locales funcionan

### 🔧 **CÓMO RESOLVER PROBLEMAS COMUNES**

#### Error 419 (CSRF Token Mismatch)
**✅ SOLUCIONADO:** Sistema restaurado a configuración original de Laravel Breeze
1. Laravel Breeze maneja automáticamente los tokens CSRF
2. No necesita configuración adicional
3. Si persiste: reiniciar servidor y limpiar caché

#### Imágenes no se muestran
1. Verificar que las URLs en base de datos son correctas
2. Comprobar que el storage está linkeado: `php artisan storage:link`
3. Verificar permisos de carpeta storage

#### Error 500 en Login
1. Limpiar caché: `php artisan cache:clear`
2. Recompilar assets: `npm run build` o `npm run dev`
3. Verificar que Vite está corriendo

### 📋 **COMANDOS DE RESTAURACIÓN APLICADOS**
```bash
# Archivos restaurados a configuración original Breeze:
- resources/js/bootstrap.js ✅
- resources/js/app.jsx ✅
- resources/js/Pages/Auth/Login.jsx ✅
- bootstrap/app.php ✅
- routes/web.php ✅

# Archivos eliminados (no necesarios en Breeze):
- resources/js/utils/csrf.js ❌
- app/Http/Middleware/HandleCsrfToken.php ❌

# Cachés limpiados y assets recompilados ✅

# CORRECIÓN ERROR 500 Dashboard:
- app/Http/Controllers/Admin/DashboardController.php ✅
  * Cambiado 'precio_final' por 'monto_final' en TODAS las referencias (4 lugares):
    - Línea 39: Ingresos del mes actual
    - Línea 73: Actividades recientes (ya corregido previamente)
    - Línea 150: Ingresos mes anterior
    - Línea 201: Ventas por día en estadísticas
  * Agregado ordenamiento por fechas reales en lugar de texto humanizado
  * Comentado temporalmente 'comision_asesor' y 'comision_pagada'
  * ✅ Dashboard completamente funcional sin errores Carbon ni BD

# DATOS DE PRUEBA CREADOS:
✅ Propietario: Juan Pérez (DNI: 12345678)
✅ Departamento: DEPT001 - "Departamento Test 1"
   - Ubicación: San Isidro, Av. Javier Prado 123
   - Precio: S/. 250,000
   - 3 dormitorios, 2 baños, 120m²
```

### 📝 **REGISTRO DE PRUEBAS**

**Fecha de prueba:** _________________
**Probado por:** ____________________

**Resultados:**
- Páginas públicas: ✅ / ❌
- Sistema de login: ✅ / ❌  
- Panel de admin: ✅ / ❌
- Carousel de imágenes: ✅ / ❌
- Token CSRF: ✅ / ❌

**Problemas encontrados:**
_________________________________
_________________________________
_________________________________

**Soluciones aplicadas:**
_________________________________
_________________________________
_________________________________
