# Guía de Configuración PHP para Desarrolladores 🚀

> **Nota**: Esta guía está optimizada para estudiantes y desarrolladores de Laravel/PHP que buscan un entorno de desarrollo óptimo.

## 📋 Tabla de Contenidos
1. [Prerrequisitos](#prerrequisitos)
2. [Configuración del Sistema](#configuración-del-sistema)
3. [Configuración de PHP](#configuración-de-php)
4. [Configuración de Laravel](#configuración-de-laragon)
5. [Verificación y Pruebas](#verificación-y-pruebas)
6. [Solución de Problemas](#solución-de-problemas)

## 🎯 Prerrequisitos
- Laragon instalado (última versión)
- PHP 8.4+ instalado
- Composer 2.8+
- Node.js 20+
- Git

## 🔧 Configuración del Sistema

### 1. Configurar PowerShell (Ejecutar como Administrador)
```powershell
# Habilitar ejecución de scripts
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser -Force
```

### 2. Crear Estructura de Directorios
```powershell
# Crear directorio para configuraciones personalizadas
mkdir "C:\laragon\custom-config"

# Crear directorio para logs
mkdir "C:\laragon\logs"
```

## ⚙️ Configuración de PHP

### 1. Localizar php.ini
El archivo se encuentra típicamente en:
```
C:\laragon\bin\php\php-8.4.6-nts-Win32-vs17-x64\php.ini
```

### 2. Configuración Principal de PHP
Copiar y pegar estas configuraciones en php.ini:

```ini
[PHP]
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
; Configuración Optimizada para Estudiantes;
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

;;;;;;;;;;;;;;;;;;;;;;;;;;
; GESTIÓN DE MEMORIA     ;
;;;;;;;;;;;;;;;;;;;;;;;;;;
memory_limit = 1024M
max_execution_time = 600
max_input_time = 600

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
; REPORTE DE ERRORES        ;
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
error_reporting = E_ALL | E_STRICT
display_errors = On
display_startup_errors = On
log_errors = On
error_log = "C:\laragon\logs\php_error.log"
html_errors = On
docref_root = "https://www.php.net/manual/es/"
docref_ext = .php

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
; ZONA HORARIA Y LENGUAJE   ;
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
date.timezone = "America/Lima"
default_charset = "UTF-8"
default_lang = "es"

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
; LÍMITES DE SUBIDA         ;
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
upload_max_filesize = 128M
post_max_size = 128M
max_input_vars = 5000

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
; OPTIMIZACIÓN Y CACHÉ      ;
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
opcache.enable = 1
opcache.enable_cli = 1
opcache.memory_consumption = 256
opcache.interned_strings_buffer = 16
opcache.max_accelerated_files = 20000
opcache.validate_timestamps = 1
opcache.revalidate_freq = 0
realpath_cache_size = 4096K
realpath_cache_ttl = 600
```

### 3. Extensiones PHP Necesarias
Asegúrate de que estas extensiones estén habilitadas:
```ini
extension=bz2
extension=curl
extension=ffi
extension=ftp
extension=fileinfo
extension=gd
extension=gettext
extension=gmp
extension=intl
extension=mbstring
extension=exif
extension=mysqli
extension=openssl
extension=pdo_mysql
extension=pdo_sqlite
extension=sodium
extension=sqlite3
extension=xsl
extension=zip
zend_extension=opcache
```

## 🚀 Configuración de Laragon

### 1. Configuración de Node.js
Crear archivo `C:\laragon\etc\nodejs.ini`:
```ini
[nodejs]
version=22.14.0
path=C:\Program Files\nodejs
```

### 2. Configuración del Proyecto
Crear archivo `.env-custom` en la raíz del proyecto:
```env
# Configuración de Desarrollo
APP_ENV=local
APP_DEBUG=true
DEBUGBAR_ENABLED=true

# PHP
PHP_VERSION=8.4.6
XDEBUG_ENABLED=true

# Base de datos
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=inmobiliaria
DB_USERNAME=root
DB_PASSWORD=

# Mail
MAIL_MAILER=log
```

## ✅ Verificación y Pruebas

### 1. Verificar PHP
```powershell
# Verificar versión
php -v

# Verificar configuración
php --ini

# Verificar extensiones
php -m
```

### 2. Verificar Composer
```powershell
composer --version
```

### 3. Verificar Node.js
```powershell
node -v
npm -v
```

## 🔍 Solución de Problemas

### Problemas Comunes y Soluciones

#### 1. Error de Memoria
Si ves "Allowed memory size exhausted":
```ini
memory_limit = 2048M
```

#### 2. Error de Tiempo de Ejecución
Si los scripts tardan mucho:
```ini
max_execution_time = 1200
```

#### 3. Problemas con Subida de Archivos
Aumentar límites:
```ini
upload_max_filesize = 256M
post_max_size = 256M
```

## 📚 Recursos Adicionales

### Enlaces Útiles
- [PHP Manual en Español](https://www.php.net/manual/es/)
- [Laravel Documentación](https://laravel.com/docs)
- [Xdebug Documentación](https://xdebug.org/docs)

### Herramientas Recomendadas
- Visual Studio Code
- PHP Debug Extension
- Laravel Extension Pack
- Git Graph

## 🔄 Mantenimiento

### Actualizaciones Regulares
```powershell
# Actualizar Composer
composer self-update

# Actualizar dependencias
composer update

# Actualizar npm
npm update -g

# Limpiar caché
php artisan cache:clear
php artisan config:clear
php artisan route:clear
```

### Verificación de Seguridad
```powershell
# Verificar vulnerabilidades
composer audit
npm audit
```

## ⚠️ Notas Importantes
1. Hacer backup de configuraciones antes de actualizaciones mayores
2. Mantener logs limpios regularmente
3. Revisar el error_log periódicamente
4. Actualizar extensiones PHP cuando se actualice PHP

## 🎯 Próximos Pasos Recomendados
1. Configurar Xdebug para depuración
2. Establecer Git Hooks para control de calidad
3. Configurar PHPUnit para testing
4. Implementar herramientas de análisis de código