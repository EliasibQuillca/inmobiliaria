# Documentación de Migraciones - Tabla Ventas

## Historial de Migraciones

### 1. Migración Base - `2025_07_14_000009_create_ventas_table.php`
**Batch:** 1  
**Estado:** Ejecutada  
**Descripción:** Creación inicial de la tabla ventas

**Estructura creada:**
```php
- id (bigint, autoincrement)
- reserva_id (bigint, foreign key -> reservas)
- fecha_venta (date)
- monto_final (decimal 12,2)
- documentos_entregados (boolean, default false)
- timestamps (created_at, updated_at)
```

**Nota:** La columna `observaciones` existe en la base de datos actual pero NO está en esta migración. Se asume que fue agregada manualmente o mediante una migración no rastreada.

---

### 2. Migración de Control de Ediciones - `2025_08_11_031044_add_edicion_fields_to_ventas_table.php`
**Batch:** 1  
**Estado:** Ejecutada  
**Descripción:** Agrega campos para controlar ediciones de ventas

**Campos agregados:**
```php
- cantidad_ediciones (int, default 0)
- max_ediciones (int, default 3)
- bloqueada_edicion (boolean, default false)
- fecha_primera_edicion (timestamp, nullable)
- fecha_ultima_edicion (timestamp, nullable)
```

**Posición:** Después de la columna `observaciones` (que debe existir)

**⚠️ ADVERTENCIA:** Esta migración hace referencia a la columna `observaciones` con `after('observaciones')`, pero esa columna no está en la migración base.

---

### 3. Migración de Seguimiento de Documentos - `2025_11_05_000000_add_documento_tracking_to_ventas_table.php`
**Batch:** 2  
**Estado:** Ejecutada  
**Descripción:** Agrega campos para rastrear la entrega de documentos al cliente

**Campos agregados:**
```php
- observaciones (text, nullable) // Solo si no existe
- fecha_entrega_documentos (timestamp, nullable)
- usuario_entrega_id (foreign key -> users, nullable, on delete set null)
```

**Características especiales:**
- Verifica si la columna existe antes de agregarla usando `Schema::hasColumn()`
- Previene errores de duplicación
- Implementa foreign key con `onDelete('set null')` para preservar el historial

---

## Estructura Final de la Tabla `ventas`

| Columna | Tipo | Nullable | Default | Descripción |
|---------|------|----------|---------|-------------|
| id | bigint unsigned | NO | AUTO_INCREMENT | ID único de la venta |
| reserva_id | bigint unsigned | NO | - | ID de la reserva asociada (UNIQUE) |
| fecha_venta | date | NO | - | Fecha en que se realizó la venta |
| monto_final | decimal(12,2) | NO | - | Monto total de la venta |
| documentos_entregados | tinyint(1) | NO | 0 | Indica si los documentos fueron entregados |
| fecha_entrega_documentos | timestamp | YES | NULL | Fecha y hora de entrega de documentos |
| usuario_entrega_id | bigint unsigned | YES | NULL | ID del usuario que marcó como entregado |
| observaciones | text | YES | NULL | Notas adicionales sobre la venta |
| cantidad_ediciones | int | NO | 0 | Número de veces que se ha editado |
| max_ediciones | int | NO | 3 | Máximo de ediciones permitidas |
| bloqueada_edicion | tinyint(1) | NO | 0 | Indica si está bloqueada para edición |
| fecha_primera_edicion | timestamp | YES | NULL | Fecha de la primera edición |
| fecha_ultima_edicion | timestamp | YES | NULL | Fecha de la última edición |
| created_at | timestamp | YES | NULL | Fecha de creación del registro |
| updated_at | timestamp | YES | NULL | Fecha de última actualización |

**Total de columnas:** 15

---

## Relaciones de Tabla

### Foreign Keys

1. **ventas_reserva_id_foreign**
   - Columna: `reserva_id`
   - Referencia: `reservas.id`
   - On Update: CASCADE
   - On Delete: RESTRICT

2. **ventas_usuario_entrega_id_foreign**
   - Columna: `usuario_entrega_id`
   - Referencia: `users.id`
   - On Update: NO ACTION
   - On Delete: SET NULL

### Índices

1. **primary** - Índice primario en `id` (BTREE)
2. **ventas_reserva_id_unique** - Índice único en `reserva_id` (BTREE)
3. **ventas_usuario_entrega_id_foreign** - Índice en `usuario_entrega_id` (BTREE)

---

## Historial de Ventas (`venta_historiales`)

### Migración Relacionada - `2025_11_06_030804_add_entrega_documentos_to_venta_historiales_accion.php`
**Batch:** 3  
**Estado:** Ejecutada  
**Descripción:** Agrega el tipo de acción 'entrega_documentos' al ENUM

**Tipos de acción disponibles:**
```sql
ENUM('creacion', 'edicion', 'documentos', 'entrega_documentos')
```

**Uso:**
- `creacion`: Registro inicial de la venta
- `edicion`: Modificación de datos de la venta
- `documentos`: Actualización del estado de documentos
- `entrega_documentos`: Marca de documentos como entregados (NUEVO)

---

## Modelo Eloquent - `app/Models/Venta.php`

### $fillable
```php
'reserva_id',
'fecha_venta',
'monto_final',
'documentos_entregados',
'observaciones',
'fecha_entrega_documentos',
'usuario_entrega_id',
'cantidad_ediciones',
'max_ediciones',
'bloqueada_edicion',
'fecha_primera_edicion',
'fecha_ultima_edicion'
```

### $casts
```php
'fecha_venta' => 'datetime',
'monto_final' => 'decimal:2',
'documentos_entregados' => 'boolean',
'fecha_entrega_documentos' => 'datetime',
'bloqueada_edicion' => 'boolean',
'fecha_primera_edicion' => 'datetime',
'fecha_ultima_edicion' => 'datetime'
```

### Relaciones
- `reserva()` → belongsTo(Reserva)
- `usuarioEntrega()` → belongsTo(User) [NUEVO]
- `departamento()` → hasOneThrough(Departamento, Reserva)
- `asesor()` → hasOneThrough(Asesor, Reserva)
- `cliente()` → hasOneThrough(Cliente, Reserva)
- `historial()` → hasMany(VentaHistorial)

### Métodos importantes
- `marcarDocumentosEntregados($usuarioId)` → Marca documentos como entregados y el depto como vendido
- `puedeEditarse()` → Verifica si la venta puede ser editada
- `diasDesdeVenta()` → Calcula días transcurridos desde la venta
- `enPeriodoEdicion($dias)` → Verifica si está dentro del periodo de edición

---

## Reglas de Negocio

### Entrega de Documentos
1. Solo se puede marcar como entregado UNA VEZ
2. Se registra automáticamente:
   - Fecha y hora de entrega (`fecha_entrega_documentos`)
   - Usuario que realizó la acción (`usuario_entrega_id`)
   - Registro en historial con acción `entrega_documentos`
3. Al marcar como entregado:
   - Se actualiza `documentos_entregados = true`
   - Se marca el departamento como `vendido`
   - Se actualiza `disponible = false` en departamentos

### Control de Ediciones
1. Máximo 3 ediciones por venta (configurable)
2. Solo se puede editar dentro de 7 días desde la fecha de venta
3. Cada edición requiere un motivo obligatorio (min 10 caracteres)
4. Se bloquea automáticamente al alcanzar el límite de ediciones
5. Todas las ediciones se registran en `venta_historiales`

---

## Endpoints API (Asesor)

### GET `/asesor/ventas`
Lista todas las ventas del asesor autenticado

### GET `/asesor/ventas/crear/{reserva_id?}`
Formulario para crear nueva venta

### POST `/asesor/ventas`
Crear nueva venta

### GET `/asesor/ventas/{id}`
Ver detalles de una venta

### GET `/asesor/ventas/{id}/editar`
Formulario para editar venta

### PATCH `/asesor/ventas/{id}`
Actualizar venta (con control de ediciones)

### PATCH `/asesor/ventas/{id}/documentos`
Actualizar estado de documentos

### PATCH `/asesor/ventas/{id}/entregar-documentos` [NUEVO]
Marcar documentos como entregados al cliente

### GET `/asesor/ventas/{id}/pdf`
Generar PDF de la venta

---

## Problemas Conocidos y Soluciones

### ⚠️ Problema: Columna `observaciones` inconsistente

**Síntoma:** La columna `observaciones` existe en la base de datos pero no está en la migración base.

**Causa:** Posiblemente agregada manualmente o mediante migración no rastreada.

**Solución implementada:** La migración `2025_11_05_000000_add_documento_tracking_to_ventas_table.php` verifica si existe antes de intentar crearla:

```php
if (!Schema::hasColumn('ventas', 'observaciones')) {
    $table->text('observaciones')->nullable()->after('documentos_entregados');
}
```

**Recomendación:** En ambientes de producción frescos, asegurarse de que esta migración se ejecute correctamente.

---

## Testing

### Áreas a Probar
1. ✅ Creación de venta con observaciones
2. ✅ Edición de venta (máximo 3 veces)
3. ✅ Bloqueo automático después de 3 ediciones
4. ✅ Restricción de edición después de 7 días
5. 🆕 Marcar documentos como entregados (una sola vez)
6. 🆕 Verificar que usuario_entrega_id se registre correctamente
7. 🆕 Verificar registro en historial con acción 'entrega_documentos'
8. 🆕 Verificar que departamento se marque como vendido

---

## Fecha de última actualización
**6 de noviembre de 2025**

---

## Cambios Recientes

### v2.0 (Nov 2025)
- ✨ Agregado seguimiento de entrega de documentos
- ✨ Campo `fecha_entrega_documentos` para rastrear cuándo se entregaron
- ✨ Campo `usuario_entrega_id` para saber quién entregó
- ✨ Nuevo endpoint `/entregar-documentos`
- ✨ Botón "Marcar Entregado" en UI (solo visible si no están entregados)
- ✨ Validación para evitar marcar dos veces como entregado
- ✨ Registro automático en historial
- 🔧 Migración segura con verificación de columnas existentes
- 📝 Documentación completa de migraciones

### v1.0 (Ago 2025)
- 🎯 Control de ediciones (máximo 3)
- 🎯 Historial completo de cambios
- 🎯 Bloqueo automático de ediciones
- 🎯 Validación de periodo de 7 días
