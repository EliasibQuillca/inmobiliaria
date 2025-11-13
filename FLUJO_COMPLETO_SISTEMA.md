# 🔄 FLUJO COMPLETO DEL SISTEMA - Cliente → Asesor → Venta

## 📋 Estado Actual del Flujo (✅ YA IMPLEMENTADO)

El sistema ya tiene implementado el flujo completo que describes. Aquí está cómo funciona:

---

## 1️⃣ CLIENTE SOLICITA INFORMACIÓN

### Vista del Cliente
📍 **Ubicación:** `Cliente/Solicitudes.jsx` o `Cliente/CrearSolicitud.jsx`

**El cliente puede:**
- Ver el catálogo de departamentos
- Enviar una solicitud de información sobre un departamento
- Seleccionar tipo de consulta:
  - 💰 Cotización
  - 📋 Información General  
  - 🔍 Agendar Visita
  - 📞 Contacto Directo

**Estado inicial:** `PENDIENTE` ⏳

```
Cliente completa formulario:
├── Departamento de interés
├── Tipo de solicitud
├── Mensaje/consulta
└── [Enviar] → Crea cotización con estado "pendiente"
```

---

## 2️⃣ ASESOR RECIBE Y RESPONDE CON COTIZACIÓN

### Vista del Asesor
📍 **Ubicación:** `Asesor/Solicitudes.jsx`

**El asesor ve:**
- ✅ Solicitudes Pendientes (nuevas)
- 🔄 En Proceso (ya respondidas, esperando cliente)
- ✅ Aprobadas (aceptadas por cliente)
- ❌ Rechazadas/Canceladas

**El asesor puede responder con:**

```php
POST /asesor/solicitudes/{id}/responder

Datos que envía:
├── Monto base: S/ 250,000
├── Descuento: 5%
├── Condiciones: "Pago inicial 30%, financiamiento disponible"
├── Notas: "Incluye estacionamiento"
└── Fecha de validez: 30 días
```

**Estado cambia a:** `EN_PROCESO` 🔄

**Código backend:**
- ✅ `AsesorSolicitudController::responderSolicitud()`
- ✅ Valida monto, descuento, fecha_validez
- ✅ Actualiza cotización
- ✅ Registra en logs

---

## 3️⃣ CLIENTE VE COTIZACIÓN Y RESPONDE

### Vista del Cliente
📍 **Ubicación:** `Cliente/Solicitudes.jsx` (sección de cotización)

**El cliente ve la cotización:**

```
💰 Cotización del Asesor
├── 💵 Monto Base: S/ 250,000
├── 📉 Descuento: 5%
├── ✨ Precio Final: S/ 237,500
├── 📋 Condiciones: [texto]
├── 📝 Notas: [texto]
└── ⏰ Válido hasta: 12/12/2025
```

**El cliente puede:**

### Opción A: ✅ ACEPTAR
```php
POST /cliente/solicitudes/{id}/aceptar
```
- Estado → `APROBADA` ✅
- Se registra `fecha_respuesta_cliente`
- **EL ASESOR AHORA PUEDE CREAR RESERVA**

### Opción B: ❌ RECHAZAR
```php
POST /cliente/solicitudes/{id}/rechazar
Body: { motivo_rechazo: "El precio excede mi presupuesto" }
```
- Estado → `CANCELADA` 🚫
- Se guarda el motivo en `motivo_rechazo_cliente`
- Proceso termina aquí

### Opción C: ✏️ SOLICITAR MODIFICACIONES
```php
POST /cliente/solicitudes/{id}/modificar
Body: { mensaje_modificacion: "¿Podría ofrecer mayor descuento?" }
```
- Estado → `PENDIENTE` ⏳ (vuelve al inicio)
- Se agregan notas con los cambios solicitados
- El asesor ve la solicitud nuevamente y puede ajustar

---

## 4️⃣ ASESOR CREA RESERVA (Cuando cliente acepta)

### Vista del Asesor
📍 **Ubicación:** `Asesor/Reservas/Crear.jsx`

**Cuando el estado es "APROBADA":**
- El asesor puede crear una reserva formal
- Se registra:
  - Cliente
  - Departamento
  - Monto acordado
  - Fecha de reserva
  - Plazo para formalizar

**Ruta:**
```php
Route::post('/asesor/reservas', [AsesorReservaController::class, 'store'])
```

**Estado de la reserva:**
- `activa` - Reserva vigente
- `vencida` - Si pasa el plazo
- `cancelada` - Si el cliente desiste

---

## 5️⃣ ASESOR REGISTRA LA VENTA (Cliente compra físicamente)

### Vista del Asesor
📍 **Ubicación:** `Asesor/Ventas/Crear.jsx`

**Cuando el cliente:**
- ✅ Visitó el departamento
- ✅ Firmó contrato
- ✅ Pagó presencialmente (inicial o total)

**El asesor registra:**

```php
Route::post('/asesor/ventas', [AsesorVentaController::class, 'store'])

Datos de la venta:
├── Cliente
├── Departamento
├── Precio de venta (puede ser diferente al inicial)
├── Fecha de venta
├── Método de pago: "Efectivo", "Transferencia", "Cheque", "Financiamiento"
├── Comisión del asesor
├── Observaciones
└── Documento de venta (opcional)
```

**Estado del departamento cambia a:** `VENDIDO` 🎉

**Se registra:**
- Venta en tabla `ventas`
- Historial en `venta_historial`
- Comisión del asesor
- Logs de auditoría

---

## 📊 TABLA DE ESTADOS Y TRANSICIONES

| Estado | Descripción | Puede cambiar a | Acción |
|--------|-------------|-----------------|--------|
| `pendiente` ⏳ | Cliente envió solicitud | `en_proceso` | Asesor responde con cotización |
| `en_proceso` 🔄 | Asesor envió cotización | `aprobada`, `cancelada`, `pendiente` | Cliente acepta/rechaza/modifica |
| `aprobada` ✅ | Cliente aceptó | → Reserva | Asesor crea reserva |
| `cancelada` 🚫 | Cliente rechazó o canceló | - | Proceso termina |

---

## 🔄 FLUJO VISUAL COMPLETO

```
┌─────────────────────────────────────────────────────────────────┐
│  1. CLIENTE SOLICITA                                            │
│  📱 Cliente/CrearSolicitud.jsx                                  │
│  Estado: PENDIENTE                                              │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│  2. ASESOR RESPONDE                                             │
│  💼 Asesor/Solicitudes.jsx                                      │
│  → Envía monto, descuento, condiciones, fecha validez          │
│  Estado: EN_PROCESO                                             │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│  3. CLIENTE VE COTIZACIÓN                                       │
│  📱 Cliente/Solicitudes.jsx                                     │
│                                                                 │
│  A) ✅ ACEPTAR → APROBADA                                       │
│  B) ❌ RECHAZAR → CANCELADA (termina)                           │
│  C) ✏️  MODIFICAR → PENDIENTE (vuelve al paso 2)               │
└─────────────────────────────────────────────────────────────────┘
                            ↓ (si acepta)
┌─────────────────────────────────────────────────────────────────┐
│  4. ASESOR CREA RESERVA                                         │
│  💼 Asesor/Reservas/Crear.jsx                                   │
│  → Formaliza la intención de compra                            │
│  → Separa el departamento por X días                           │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│  5. CLIENTE COMPRA PRESENCIALMENTE                              │
│  🏢 Visita física, firma contrato, paga                         │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│  6. ASESOR REGISTRA VENTA                                       │
│  💼 Asesor/Ventas/Crear.jsx                                     │
│  → Precio final                                                 │
│  → Método de pago                                               │
│  → Comisión                                                     │
│  Estado departamento: VENDIDO                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## ✅ COMUNICACIÓN CLIENTE ↔ ASESOR

### El cliente ve en tiempo real:

1. **En su panel de solicitudes:**
   - Estado de cada solicitud
   - Cotización completa cuando el asesor responde
   - Botones de acción (Aceptar/Rechazar/Modificar)

2. **Datos del asesor asignado:**
   - Nombre completo
   - Email
   - Teléfono (si está disponible)
   - Foto de perfil

3. **Detalle de la cotización:**
   - Monto original
   - Descuento aplicado
   - Precio final calculado
   - Condiciones de pago
   - Notas adicionales
   - Fecha de expiración

### El asesor ve:

1. **En su panel de solicitudes:**
   - Todas las solicitudes por estado
   - Datos del cliente (nombre, email, teléfono)
   - Departamento de interés
   - Mensaje original del cliente
   - Respuestas del cliente (si aceptó, rechazó o pidió cambios)

2. **Si el cliente rechazó:**
   - Motivo del rechazo
   - Fecha de respuesta

3. **Si el cliente pidió modificaciones:**
   - Mensaje con los cambios solicitados
   - La solicitud vuelve a "pendiente" para ajustar

---

## 🗄️ ESTRUCTURA DE BASE DE DATOS

### Tabla: `cotizaciones`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | bigint | ID único |
| `cliente_id` | bigint | FK a clientes |
| `asesor_id` | bigint | FK a asesores |
| `departamento_id` | bigint | FK a departamentos |
| `estado` | enum | pendiente, en_proceso, aprobada, cancelada |
| `mensaje_solicitud` | text | Consulta inicial del cliente |
| `tipo_solicitud` | enum | cotizacion, info, visita, contacto |
| `monto` | decimal | Precio ofrecido por asesor |
| `descuento` | decimal | % de descuento |
| `condiciones` | text | Condiciones de pago |
| `notas` | text | Notas adicionales o modificaciones |
| `fecha_validez` | datetime | Hasta cuándo es válida la oferta |
| `fecha_respuesta_cliente` | datetime | Cuándo respondió el cliente |
| `motivo_rechazo_cliente` | text | Por qué rechazó (si aplica) |
| `created_at` | timestamp | Cuándo se creó |

---

## 🎯 ARCHIVOS CLAVE DEL SISTEMA

### Backend (Controladores)

```
app/Http/Controllers/
├── Cliente/
│   └── SolicitudController.php
│       ├── index() - Lista solicitudes del cliente
│       ├── store() - Crea nueva solicitud
│       ├── show() - Detalle de solicitud
│       ├── aceptarCotizacion() - Cliente acepta
│       ├── rechazarCotizacion() - Cliente rechaza
│       └── solicitarModificacion() - Cliente pide cambios
│
├── Asesor/
│   ├── SolicitudController.php
│   │   ├── index() - Lista solicitudes del asesor
│   │   └── responderSolicitud() - Asesor envía cotización
│   │
│   ├── ReservaController.php
│   │   ├── index() - Lista reservas
│   │   ├── create() - Formulario nueva reserva
│   │   └── store() - Crea reserva
│   │
│   └── VentaController.php
│       ├── index() - Lista ventas
│       ├── create() - Formulario nueva venta
│       └── store() - Registra venta
```

### Frontend (Vistas React)

```
resources/js/Pages/
├── Cliente/
│   ├── Solicitudes.jsx - Lista solicitudes + cotizaciones
│   ├── DetalleSolicitud.jsx - Detalle individual
│   └── CrearSolicitud.jsx - Formulario nueva solicitud
│
└── Asesor/
    ├── Solicitudes.jsx - Panel de solicitudes
    ├── Reservas/
    │   ├── Crear.jsx - Nueva reserva
    │   └── Detalle.jsx - Ver reserva
    └── Ventas/
        ├── Crear.jsx - Registrar venta
        ├── Editar.jsx - Editar venta
        └── Detalle.jsx - Ver venta
```

---

## 🚀 FUNCIONALIDADES ADICIONALES IMPLEMENTADAS

### 1. Sistema de Comentarios
- Cliente y asesor pueden comentar en cada solicitud
- Historial de conversación completo

### 2. Historial de Cambios
- Se registra cada modificación de estado
- Auditoría completa de acciones

### 3. Notificaciones (preparado)
- Flash messages cuando hay actualizaciones
- Base para notificaciones en tiempo real

### 4. Validaciones
- ✅ Solo el cliente puede responder su solicitud
- ✅ Solo el asesor asignado puede responder
- ✅ No se puede cambiar estado si ya está finalizado
- ✅ Validación de montos y fechas

---

## 📝 EJEMPLO PRÁCTICO DEL FLUJO

### Caso de Uso Real:

**Juan (Cliente) está interesado en el Departamento "Los Andes 501"**

1. **Día 1 - 10:00 AM:**
   - Juan envía solicitud de cotización
   - Mensaje: "Me interesa este departamento, ¿cuál sería el precio final con financiamiento?"
   - Estado: `PENDIENTE`

2. **Día 1 - 11:30 AM:**
   - María (Asesora) ve la solicitud
   - Responde con:
     - Monto: S/ 250,000
     - Descuento: 5%
     - Precio final: S/ 237,500
     - Condiciones: "Inicial 30% (S/71,250), financiamiento bancario 70% a 20 años"
     - Válido hasta: 20/11/2025
   - Estado: `EN_PROCESO`

3. **Día 2 - 9:00 AM:**
   - Juan ve la cotización en su panel
   - Opciones:
     - ✅ Acepta → Puede agendar visita y formalizar
     - ❌ Rechaza → "El precio excede mi presupuesto"
     - ✏️ Modifica → "¿Podría ser 35% de inicial y mayor descuento?"

4. **Juan acepta la cotización**
   - Estado: `APROBADA`

5. **Día 3:**
   - María crea una reserva por 15 días
   - Juan visita el departamento
   - Firma contrato
   - Paga la inicial

6. **Día 4:**
   - María registra la venta en el sistema
   - Departamento cambia a `VENDIDO`
   - Se calcula comisión de María
   - ✅ **PROCESO COMPLETO**

---

## ✅ CONCLUSIÓN

**EL FLUJO QUE DESCRIBES YA ESTÁ 100% IMPLEMENTADO Y FUNCIONAL:**

✅ Cliente solicita  
✅ Asesor responde con cotización  
✅ Cliente acepta/rechaza/modifica  
✅ Asesor crea reserva (si se aprueba)  
✅ Asesor registra venta (cuando se compra físicamente)  
✅ Comunicación bidireccional completa  
✅ Historial y auditoría  

**El sistema está listo para usarse.** 🎉

