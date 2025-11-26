# 🔄 FLUJO COMPLETO: SOLICITUD → COTIZACIÓN → RESERVA → VENTA

## Fecha: 25 de noviembre de 2025
## Sistema: Inmobiliaria Imperial Cusco

---

## 📋 FLUJO PASO A PASO

### 1️⃣ SOLICITUD DE INFORMACIÓN (Cliente inicia)
**Archivo:** `ClienteSolicitudController@store`
**Tabla:** `cotizaciones`

```
Cliente → Selecciona departamento
       → Elige tipo de consulta (información, visita, financiamiento, cotización)
       → Escribe mensaje y teléfono
       → [OPCIONAL] Selecciona asesor específico
       → Envía solicitud

Sistema → Crea registro en `cotizaciones` con estado='pendiente'
        → Asigna asesor automáticamente (si no eligió uno)
        → Asigna cliente al asesor (asesor_id en tabla clientes)
        → Cliente.estado = 'interesado'
```

---

### 2️⃣ ASESOR RECIBE Y CONTACTA AL CLIENTE
**Archivo:** `AsesorSolicitudController@index`
**Panel:** Asesor → Solicitudes → Pestaña "Pendientes"

```
Asesor → Ve solicitud en panel "Pendientes"
       → Lee información: cliente, departamento, tipo consulta, mensaje, teléfono
       → Llama al cliente por teléfono/WhatsApp
       → Conversa sobre la propiedad y requisitos
```

**Opciones del Asesor:**
- ✅ **Aceptar** → Cliente está interesado → Pasa a crear cotización
- ❌ **Rechazar** → Cliente no está interesado o no califica
- 📝 **Responder con información** → Envía monto, descuento, condiciones

---

### 3️⃣ CREACIÓN DE COTIZACIÓN (Asesor propone)
**Archivo:** `AsesorCotizacionController@store`
**Panel:** Asesor → Cotizaciones → Crear Nueva
**Tabla:** `cotizaciones` (actualiza el registro existente o crea uno nuevo)

```
Asesor → Accede desde solicitud o crea cotización directa
       → Selecciona cliente y departamento
       → Define:
          - Precio base
          - Descuento (%)
          - Fecha de validez
          - Condiciones de pago
          - Notas adicionales
       → Guarda cotización

Sistema → cotizaciones.estado = 'en_proceso'
        → Notifica al cliente (email/sistema)
```

---

### 4️⃣ CLIENTE REVISA COTIZACIÓN
**Archivo:** `ClienteSolicitudController@show`
**Panel:** Cliente → Mis Solicitudes → Ver Detalle

```
Cliente → Ve cotización con:
          - Precio ofrecido
          - Descuento aplicado
          - Monto final
          - Condiciones
          - Fecha de validez
```

**Acciones del Cliente:**
- ✅ **Aceptar Cotización** → `ClienteSolicitudController@aceptarCotizacion`
  - cotizaciones.estado = 'aceptada'
  - Se habilita crear RESERVA
  
- ❌ **Rechazar Cotización** → `ClienteSolicitudController@rechazarCotizacion`
  - cotizaciones.estado = 'rechazada'
  - Solicita motivo
  
- 🔄 **Solicitar Modificación** → `ClienteSolicitudController@solicitarModificacion`
  - Cliente pide cambios (precio, condiciones, etc.)
  - Asesor recibe notificación y ajusta

---

### 5️⃣ CREACIÓN DE RESERVA (Acuerdo confirmado)
**Archivo:** `AsesorReservaController@store`
**Panel:** Asesor → Reservas → Crear Nueva
**Tabla:** `reservas`

```
Condición: cotizaciones.estado = 'aceptada'

Asesor → Crea reserva desde cotización aceptada
       → Define:
          - Fecha de reserva
          - Monto de separación (%)
          - Fecha de vencimiento
          - Fecha de cita para firma
          - Notas de la reserva
       → Guarda reserva

Sistema → reservas.estado = 'pendiente'
        → departamentos.estado = 'reservado'
        → Bloquea el departamento para otros clientes
        → Notifica al cliente con datos de la cita
```

**Estados de Reserva:**
- **pendiente** → Esperando confirmación/pago de separación
- **confirmada** → Cliente pagó separación, cita agendada
- **cancelada** → Cliente canceló o venció el plazo
- **convertida** → Se convirtió en venta

---

### 6️⃣ CITA PRESENCIAL (Día del encuentro)
**Panel:** Asesor → Reservas → Ver Detalle → Confirmar Reserva

```
Día de la cita:
Asesor → Se reúne con cliente
       → Muestra el departamento físicamente
       → Revisa documentos del cliente:
          - DNI
          - Comprobantes de ingresos
          - Referencias
       → Confirma reserva en el sistema

Sistema → reservas.estado = 'confirmada'
        → reservas.fecha_confirmacion = now()
```

**Si todo está OK:**
- ✅ Cliente confirma que quiere comprar → Procede a VENTA
- ❌ Cliente se arrepiente → Cancelar reserva
  - reservas.estado = 'cancelada'
  - departamentos.estado = 'disponible'

---

### 7️⃣ REGISTRO DE VENTA (Cierre del negocio)
**Archivo:** `AsesorVentaController@store`
**Panel:** Asesor → Ventas → Crear Nueva
**Tabla:** `ventas`

```
Condición: reservas.estado = 'confirmada'

Asesor → Crea venta desde reserva confirmada
       → Registra:
          - Fecha de venta
          - Precio final (puede diferir de cotización)
          - Forma de pago (contado, financiado, mixto)
          - Cuota inicial
          - Número de cuotas (si aplica)
          - Banco financiador (si aplica)
          - Estado de documentos:
            * Escritura pública
            * Registro en SUNARP
            * Entrega de llaves
       → Sube documentos escaneados
       → Guarda venta

Sistema → ventas.estado = 'registrada'
        → departamentos.estado = 'vendido'
        → reservas.estado = 'convertida'
        → cotizaciones.estado = 'finalizada'
        → Genera comisión para asesor
        → Auditoría completa registrada
```

---

### 8️⃣ SEGUIMIENTO POST-VENTA
**Panel:** Asesor → Ventas → Ver Detalle

```
Asesor → Actualiza estados de documentos:
       → ventas.estado = 'proceso_escritura'
       → ventas.estado = 'proceso_registro'
       → ventas.estado = 'finalizada' (todo entregado)

Admin → Revisa venta completa
      → Aprueba comisión del asesor
      → Cierra expediente
```

---

## 📊 TABLA DE ESTADOS POR ENTIDAD

### COTIZACIONES
| Estado | Significado | Puede pasar a |
|--------|-------------|---------------|
| `pendiente` | Solicitud recién creada | en_proceso, rechazada |
| `en_proceso` | Asesor respondió con oferta | aceptada, rechazada |
| `aceptada` | Cliente acepta cotización | (se crea reserva) |
| `rechazada` | Cliente o asesor rechaza | - |
| `finalizada` | Convertida en venta exitosa | - |

### RESERVAS
| Estado | Significado | Puede pasar a |
|--------|-------------|---------------|
| `pendiente` | Reserva creada, esperando confirmación | confirmada, cancelada |
| `confirmada` | Cliente confirmó en cita | convertida |
| `cancelada` | Cliente canceló o venció | - |
| `convertida` | Se convirtió en venta | - |

### VENTAS
| Estado | Significado | Puede pasar a |
|--------|-------------|---------------|
| `registrada` | Venta inicial registrada | proceso_escritura |
| `proceso_escritura` | Tramitando escritura pública | proceso_registro |
| `proceso_registro` | Registrando en SUNARP | finalizada |
| `finalizada` | Todo entregado al cliente | - |

### DEPARTAMENTOS
| Estado | Significado |
|--------|-------------|
| `disponible` | Libre para solicitudes |
| `reservado` | Tiene reserva activa |
| `vendido` | Ya vendido |

---

## 🔐 VALIDACIONES IMPORTANTES

### ✅ No se puede crear Reserva si:
- La cotización NO está en estado `aceptada`
- El departamento NO está `disponible`
- Ya existe una reserva activa para ese departamento

### ✅ No se puede crear Venta si:
- La reserva NO está en estado `confirmada`
- El cliente no tiene documentos validados
- El departamento ya está `vendido`

### ✅ No se puede modificar una Venta si:
- El estado es `finalizada`
- Ya se entregaron las llaves

---

## 🎯 FLUJO RESUMIDO (Vista Rápida)

```
1. SOLICITUD (Cliente)
   ↓
2. CONTACTO (Asesor llama)
   ↓
3. COTIZACIÓN (Asesor propone)
   ↓
4. ACEPTACIÓN (Cliente acepta)
   ↓
5. RESERVA (Se agenda cita)
   ↓
6. CITA (Se encuentran)
   ↓
7. CONFIRMACIÓN (Todo OK)
   ↓
8. VENTA (Cierre del negocio)
   ↓
9. POST-VENTA (Documentos y entrega)
   ↓
10. FINALIZADA ✅
```

---

## 📝 NOTAS TÉCNICAS

- **Tabla principal:** `cotizaciones` actúa como solicitudes iniciales
- **Asignación automática:** Cliente se asigna a asesor al enviar solicitud
- **Trazabilidad completa:** Cada cambio genera auditoría
- **Estados inmutables:** No se puede retroceder en el flujo (solo cancelar)
- **Protección de datos:** Solo el asesor asignado puede modificar sus registros

---

**Elaborado por:** Sistema Inmobiliaria Imperial Cusco
**Versión:** 2.0
**Última actualización:** 25 de noviembre de 2025
