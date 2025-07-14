# 🏠 Sistema Inmobiliario - Laravel 12

## 📋 Descripción

Sistema de gestión inmobiliaria desarrollado con Laravel 12, React 19, Alpine.js y Tailwind CSS. Plataforma moderna para la gestión de propiedades, clientes y transacciones inmobiliarias.

## 🚀 Tecnologías

### Backend
- **Laravel 12.20.0** - Framework PHP moderno
- **SQLite** - Base de datos ligera (puede cambiarse a MySQL/PostgreSQL)
- **PHP 8.2+** - Versión mínima requerida

### Frontend
- **React 19** - Biblioteca para interfaces de usuario
- **Alpine.js 3.14** - Framework JavaScript ligero
- **Tailwind CSS 4** - Framework de utilidades CSS
- **Vite 6** - Bundler y servidor de desarrollo
- **SweetAlert2** - Librería para alertas elegantes

## 📂 Estructura del Proyecto

```
inmobiliaria/
├── app/                     # Lógica de aplicación Laravel
├── database/               # Migraciones y seeders
├── public/                 # Archivos públicos
├── resources/
│   ├── css/
│   │   └── app.css         # Estilos principales
│   ├── js/
│   │   ├── app.js          # Configuración Alpine.js
│   │   ├── app.jsx         # Aplicación React
│   │   └── bootstrap.js    # Configuración Axios
│   └── views/
│       └── welcome.blade.php
├── routes/
│   └── web.php            # Rutas web
└── vendor/                # Dependencias PHP
```

## ⚙️ Instalación

### 1. Clonar el repositorio
```bash
git clone [url-del-repo]
cd inmobiliaria
```

### 2. Instalar dependencias PHP
```bash
composer install
```

### 3. Instalar dependencias JavaScript
```bash
npm install
```

### 4. Configurar entorno
```bash
cp .env.example .env
php artisan key:generate
```

### 5. Ejecutar migraciones
```bash
php artisan migrate
```

### 6. Compilar assets
```bash
npm run build
```

## 🏃‍♂️ Desarrollo

### Servidor de desarrollo
```bash
php artisan serve
```

### Compilación en tiempo real
```bash
npm run dev
```

### Construir para producción
```bash
npm run build
```

## 🎯 Características Planeadas

- [ ] **Gestión de Propiedades**
  - [ ] CRUD de propiedades
  - [ ] Galería de imágenes
  - [ ] Filtros de búsqueda
  - [ ] Geolocalización

- [ ] **Gestión de Clientes**
  - [ ] Registro de clientes
  - [ ] Historial de consultas
  - [ ] Seguimiento de leads

- [ ] **Sistema de Cotizaciones**
  - [ ] Generación de presupuestos
  - [ ] Comparador de propiedades
  - [ ] Calculadora de financiamiento

- [ ] **Panel Administrativo**
  - [ ] Dashboard con métricas
  - [ ] Gestión de usuarios
  - [ ] Reportes y estadísticas

- [ ] **API REST**
  - [ ] Endpoints para aplicación móvil
  - [ ] Integración con servicios externos
  - [ ] Documentación con Swagger

## 🛠️ Comandos Útiles

```bash
# Limpiar caché
php artisan cache:clear
php artisan config:clear
php artisan view:clear

# Generar componentes
php artisan make:model NombreModelo -mcr
php artisan make:controller NombreController
php artisan make:migration create_tabla_table

# Testing
php artisan test
```

## 📚 Documentación

- [Laravel 12](https://laravel.com/docs/12.x)
- [React 19](https://react.dev)
- [Alpine.js](https://alpinejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Vite](https://vitejs.dev)

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

---

**Estado:** ✅ Proyecto limpio y listo para el desarrollo
