# 🔄 FLUJO COMPLETO: CLIENTE ↔ ASESOR INTEGRADO

## ✅ IMPLEMENTACIÓN COMPLETADA

### 📊 **ESTRUCTURA DE DATOS**

**Tabla cotizaciones - Nuevos campos agregados:**
- ✅ `fecha_respuesta_cliente` (timestamp) - Cuando el cliente responde
- ✅ `motivo_rechazo_cliente` (text) - Por qué rechazó la oferta

---

## 🔄 FLUJO COMPLETO PASO A PASO

### 1️⃣ **CLIENTE SOLICITA INFORMACIÓN**

**Vista:** `/cliente/solicitudes/crear`

**El cliente:**
- Selecciona un departamento
- Elige tipo de consulta: información | visita | financiamiento | cotización
- Escribe su mensaje/consulta
- Opcionalmente elige un asesor

**Backend:** `ClienteSolicitudController@store`
```php
POST /cliente/solicitudes
```

**Resultado:**
- Se crea Cotización con estado `pendiente`
- Asesor recibe notificación (TODO)

---

### 2️⃣ **ASESOR VE LA SOLICITUD**

**Vista:** `/asesor/solicitudes` (Tab: Pendientes)

**El asesor ve:**
- Información del departamento
- Mensaje del cliente
- Botones: **[💜 Responder]** **[🔵 En Proceso]** **[🔴 Rechazar]**

---

### 3️⃣ **ASESOR RESPONDE CON COTIZACIÓN**

**Acción:** Click en **[💜 Responder]**

**Modal se abre con formulario:**
- Precio/Monto: S/ XXX.XX
- Descuento: % (opcional)
- Válido hasta: fecha
- Información adicional
- Condiciones

**Backend:** `AsesorSolicitudController@responderSolicitud`
```php
POST /asesor/solicitudes/{id}/responder
```

**Resultado:**
- Estado cambia a `en_proceso`
- Se guardan: monto, descuento, fecha_validez, notas, condiciones
- Cliente puede ver la cotización ✅

---

### 4️⃣ **CLIENTE VE LA RESPUESTA DEL ASESOR** 🆕

**Vista:** `/cliente/solicitudes`

**El cliente ve:**
```
┌──────────────────────────────────────────────────────┐
│ 🏠 DPTO-AND-501 - Departamento Los Andes 501         │
│ Estado: En Proceso                                   │
│                                                      │
│ 💰 COTIZACIÓN DEL ASESOR                            │
│ Precio: S/ 150,000.00                               │
│ Descuento: 5% (S/ 7,500.00)                        │
│ ────────────────────────────                       │
│ Total: S/ 142,500.00                               │
│                                                      │
│ Válido hasta: 30/11/2025                           │
│                                                      │
│ ℹ️ Información adicional:                           │
│ "Departamento de 3 habitaciones con vista al       │
│  parque. Incluye estacionamiento..."                │
│                                                      │
│ 📋 Condiciones:                                      │
│ "Sujeto a disponibilidad y aprobación crediticia"  │
│                                                      │
│ [✅ Aceptar Cotización] [❌ Rechazar]               │
│ [✏️ Solicitar Modificación]                         │
└──────────────────────────────────────────────────────┘
```

---

### 5️⃣ **CLIENTE RESPONDE** 🆕

#### **OPCIÓN A: ACEPTA LA COTIZACIÓN** ✅

**Acción:** Click en **[✅ Aceptar Cotización]**

**Backend:** `ClienteSolicitudController@aceptarCotizacion`
```php
POST /cliente/solicitudes/{id}/aceptar
```

**Validaciones:**
- ✅ Cotización debe estar en `en_proceso` o `pendiente`
- ✅ Debe tener monto definido
- ✅ Cliente debe ser el propietario

**Resultado:**
- Estado → `aprobada`
- `fecha_respuesta_cliente` → now()
- Mensaje: "¡Excelente! Has aceptado la cotización..."
- Asesor puede ver botón **[✅ Crear Reserva]**

---

#### **OPCIÓN B: RECHAZA LA COTIZACIÓN** ❌

**Acción:** Click en **[❌ Rechazar]**

**Modal se abre:**
```
┌──────────────────────────────────────────┐
│ ¿Por qué rechazas esta cotización?       │
│                                          │
│ ┌────────────────────────────────────┐  │
│ │ Precio muy alto...                 │  │
│ │                                    │  │
│ └────────────────────────────────────┘  │
│                                          │
│ [Cancelar] [Confirmar Rechazo]          │
└──────────────────────────────────────────┘
```

**Backend:** `ClienteSolicitudController@rechazarCotizacion`
```php
POST /cliente/solicitudes/{id}/rechazar
Body: { motivo: "Precio muy alto" }
```

**Resultado:**
- Estado → `rechazada`
- `fecha_respuesta_cliente` → now()
- `motivo_rechazo_cliente` → guardado
- Mensaje: "Cotización rechazada. Puedes realizar una nueva solicitud..."

---

#### **OPCIÓN C: SOLICITA MODIFICACIÓN** ✏️

**Acción:** Click en **[✏️ Solicitar Modificación]**

**Modal se abre:**
```
┌──────────────────────────────────────────┐
│ ¿Qué modificaciones necesitas?          │
│                                          │
│ ┌────────────────────────────────────┐  │
│ │ Quisiera un descuento mayor o      │  │
│ │ facilidades de pago...             │  │
│ └────────────────────────────────────┘  │
│                                          │
│ [Cancelar] [Enviar Solicitud]           │
└──────────────────────────────────────────┘
```

**Backend:** `ClienteSolicitudController@solicitarModificacion`
```php
POST /cliente/solicitudes/{id}/modificar
Body: { mensaje: "Quisiera un descuento mayor..." }
```

**Resultado:**
- Estado → `pendiente` (vuelve a pendiente)
- Mensaje se agrega a `notas` con timestamp
- Asesor ve la solicitud en pendientes nuevamente
- Puede responder con nueva cotización

---

### 6️⃣ **ASESOR CREA LA RESERVA** (Si el cliente aceptó)

**Vista:** `/asesor/solicitudes` (Tab: Aprobadas)

**El asesor ve:**
- Solicitud con estado `aprobada`
- Botón **[✅ Crear Reserva]**

**Acción:** Click en botón

**Redirección:**
```php
GET /asesor/reservas/crear?cotizacion_id={id}
```

**Formulario de reserva prellenado con:**
- Cliente
- Departamento
- Monto de la cotización
- Fecha actual

---

### 7️⃣ **GESTIÓN DE LA RESERVA**

Una vez creada la reserva:
- Departamento → `reservado`
- Cliente puede ver su reserva
- Asesor gestiona pagos
- Procede a venta final

---

## 🎯 RUTAS IMPLEMENTADAS

### **Cliente:**
```
GET    /cliente/solicitudes              - Ver mis solicitudes
GET    /cliente/solicitudes/crear        - Crear nueva solicitud
POST   /cliente/solicitudes              - Guardar solicitud
GET    /cliente/solicitudes/{id}         - Ver detalle
POST   /cliente/solicitudes/{id}/aceptar - ✅ Aceptar cotización
POST   /cliente/solicitudes/{id}/rechazar - ❌ Rechazar cotización
POST   /cliente/solicitudes/{id}/modificar - ✏️ Pedir cambios
```

### **Asesor:**
```
GET    /asesor/solicitudes                - Ver solicitudes asignadas
POST   /asesor/solicitudes/{id}/responder - 💜 Enviar cotización
PATCH  /asesor/solicitudes/{id}/estado    - Cambiar estado
GET    /asesor/reservas/crear?cotizacion_id={id} - Crear reserva desde solicitud
```

---

## 📊 ESTADOS DE LA COTIZACIÓN

```
pendiente     → Cliente solicitó información (inicial)
                ↓ (Asesor responde)
en_proceso    → Asesor envió cotización
                ↓ (Cliente decide)
    ┌───────────┼───────────┐
    ↓           ↓           ↓
aprobada   pendiente   rechazada
(acepta)   (pide      (rechaza)
           cambios)
    ↓
[Crear Reserva]
```

---

## ✨ PRÓXIMOS PASOS

### **Frontend del Cliente:**
- [ ] Mejorar vista de solicitudes con tabs (Pendientes/En Proceso/Aprobadas/Rechazadas)
- [ ] Modal de aceptación/rechazo con UI bonita
- [ ] Mostrar cotización detallada con cálculos
- [ ] Timeline de interacciones con el asesor

### **Notificaciones:**
- [ ] Email al cliente cuando asesor responde
- [ ] Email al asesor cuando cliente acepta/rechaza
- [ ] Notificaciones en tiempo real

### **Mejoras:**
- [ ] Chat en vivo cliente-asesor
- [ ] Historial de todas las interacciones
- [ ] Estadísticas y métricas

---

## 🚀 TESTING

### **Flujo de Prueba:**

1. **Login como Cliente**
   - Ir a catálogo
   - Seleccionar departamento
   - Crear solicitud

2. **Login como Asesor**
   - Ver solicitud en pendientes
   - Click "Responder"
   - Completar cotización
   - Enviar

3. **Login como Cliente**
   - Ver cotización recibida
   - Probar las 3 opciones:
     - ✅ Aceptar
     - ❌ Rechazar
     - ✏️ Modificar

4. **Login como Asesor** (si aceptó)
   - Ver en aprobadas
   - Click "Crear Reserva"
   - Completar reserva

---

**Estado:** ✅ BACKEND COMPLETO  
**Pendiente:** Frontend del cliente (vistas React)  
**Fecha:** 12 de noviembre de 2025
