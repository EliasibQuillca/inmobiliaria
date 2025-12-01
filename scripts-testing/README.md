# 📁 Scripts de Testing y Verificación

Esta carpeta contiene scripts PHP independientes para testing, verificación y mantenimiento del sistema.

## 📋 Contenido

### 🧪 Scripts de Testing
- `test_flujo_completo.php` - Test completo del flujo Cliente → Asesor → Venta
- `test_flujo_completo_optimizado.php` - Versión optimizada del test de flujo
- `test_solicitud_flow.php` - Test del flujo de solicitudes y cotizaciones
- `test_solicitudes.php` - Prueba específica del módulo de solicitudes
- `test_rutas.php` - Verificación de rutas del sistema
- `test_aprobaciones.php` - Test del sistema de aprobaciones
- `_test_rutas.php` - Verificación de rutas de carga de Laravel

### 🔍 Scripts de Verificación
- `verificar_sistema_completo.php` - Verificación integral del sistema
- `verificar_flujo_completo.php` - Verificación del flujo completo
- `verificar_cuentas.php` - Verificación de cuentas de usuarios
- `verificar_clientes_asesor.php` - Verificación de relación Cliente-Asesor
- `verificar_campos_cotizaciones.php` - Verificación de campos en cotizaciones

### 🔧 Scripts de Mantenimiento
- `fix_clientes.php` - Corrección de datos de clientes
- `reparar_clientes_asesor.php` - Reparar relación Cliente-Asesor
- `limpiar_datos_test.php` - Limpieza de datos de prueba
- `migrar_solicitudes.php` - Migración de datos de solicitudes
- `crear_acciones_prueba.php` - Crear acciones de prueba en auditoria

### 📊 Scripts de Análisis
- `analizar_estructura.php` - Análisis de estructura de tablas
- `update_tests.php` - Actualización de sintaxis de tests

## 🚀 Uso

Ejecutar cualquier script desde la raíz del proyecto:

```bash
php scripts-testing/nombre_del_script.php
```

### Ejemplos:

```bash
# Ejecutar test completo del flujo
php scripts-testing/test_flujo_completo.php

# Verificar sistema
php scripts-testing/verificar_sistema_completo.php

# Limpiar datos de prueba
php scripts-testing/limpiar_datos_test.php

# Analizar estructura
php scripts-testing/analizar_estructura.php
```

## ⚠️ Notas Importantes

1. **Ejecutar desde la raíz**: Todos los scripts deben ejecutarse desde `c:\laragon\www\inmobiliaria\`
2. **Base de datos activa**: Asegúrate de que la base de datos esté corriendo
3. **Ambiente de prueba**: Algunos scripts modifican datos, úsalos con precaución
4. **Laravel cargado**: Todos los scripts cargan el framework Laravel completo

## 🔐 Seguridad

- ⚠️ NO ejecutar scripts de limpieza en producción
- ⚠️ Los scripts de "fix" y "reparar" modifican datos
- ✅ Los scripts de "verificar" y "test" son de solo lectura

## 📝 Convenciones

- `test_*.php` - Scripts de testing funcional
- `verificar_*.php` - Scripts de verificación/diagnóstico
- `fix_*.php` / `reparar_*.php` - Scripts que modifican datos
- `_*.php` - Scripts internos/helpers

---

**Última actualización**: 30 de noviembre de 2025
**Proyecto**: Sistema Inmobiliaria Imperial
