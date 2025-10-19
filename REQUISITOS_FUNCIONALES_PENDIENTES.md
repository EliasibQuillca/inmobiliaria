# 📋 REQUISITOS FUNCIONALES PENDIENTES PARA IMPLEMENTAR

**Fecha:** 18 de octubre de 2025  
**Sistema:** Inmobiliaria Laravel + React + Inertia.js  
**Objetivo:** Identificar funcionalidades críticas antes de implementar Dashboard Cliente

---

## 🎯 ESTADO ACTUAL DEL SISTEMA

### ✅ LO QUE YA ESTÁ IMPLEMENTADO

#### 1. **Autenticación y Usuarios** (90% Completo)
- ✅ Sistema de login/logout multi-rol
- ✅ Registro de usuarios públicos
- ✅ Recuperación de contraseña
- ✅ Middleware de roles (Admin, Asesor, Cliente)
- ✅ Redirección automática por rol
- ✅ Verificación de email

#### 2. **Base de Datos** (95% Completo)
- ✅ 14 migraciones creadas y aplicadas
- ✅ Modelos Eloquent completos:
  - `User`, `Cliente`, `Asesor`, `Departamento`
  - `Cotizacion`, `Reserva`, `Venta`
  - `Propietario`, `Imagen`, `Publicacion`
  - `ComentarioSolicitud`, `AuditoriaUsuario`
- ✅ Relaciones Eloquent funcionando:
  - Cliente → Usuario, Asesor, Favoritos, Cotizaciones, Reservas
  - Departamento → Propietario, Imágenes, Cotizaciones, Reservas, Ventas
  - Cotizacion → Asesor, Cliente, Departamento, Reserva
  - Reserva → Cotizacion, Cliente, Asesor, Departamento, Venta

#### 3. **Módulo Cliente** (80% Completo)
- ✅ Modelo `Cliente` con Accessors seguros
- ✅ 6 Scopes útiles (`conUsuario`, `sinUsuario`, `deAsesor`, etc.)
- ✅ Factory corregido con campos reales
- ✅ Controlador `ClienteController` con métodos básicos
- ✅ Páginas React:
  - `Perfil.jsx` - Gestión de perfil ✅
  - `Asesores.jsx` - Lista de asesores ✅
  - `Favoritos.jsx` - Gestión de favoritos ✅
  - `Solicitudes.jsx` - Lista de solicitudes ✅
  - `Dashboard.jsx` - **VACÍO (Por implementar)** ❌

#### 4. **Catálogo Público** (70% Completo)
- ✅ Listado público de departamentos
- ✅ Vista detallada de propiedades
- ✅ Rutas públicas funcionando
- ⚠️ Falta: Filtros avanzados, búsqueda, paginación

#### 5. **Módulo Asesor** (60% Completo)
- ✅ Dashboard básico con estadísticas
- ✅ Gestión de solicitudes (contactos)
- ✅ Cotizaciones básicas
- ✅ Reservas
- ⚠️ Falta: Completar flujos, notificaciones

#### 6. **Módulo Admin** (40% Completo)
- ✅ CRUD de departamentos
- ✅ Gestión de usuarios
- ⚠️ Falta: Dashboard ejecutivo, reportes

---

## ❌ REQUISITOS FUNCIONALES CRÍTICOS PENDIENTES

### 🔴 **RF-CLIENTE-01: Dashboard del Cliente** (CRÍTICO - 0%)

#### **Descripción:**
Panel principal para clientes registrados con información personalizada y acciones rápidas.

#### **Sub-requisitos:**

##### RF-CLIENTE-01.1: Estadísticas Personales
```
Estado: ❌ NO IMPLEMENTADO
Prioridad: CRÍTICA

Funcionalidades:
1. Contador de favoritos guardados
2. Número de solicitudes activas/pendientes
3. Número de solicitudes respondidas
4. Reservas vigentes (si existen)
5. Citas programadas próximas

Datos requeridos:
- Cliente::favoritos()->count()
- Cliente::cotizaciones()->whereIn('estado', ['pendiente', 'en_proceso'])->count()
- Cliente::reservas()->where('estado', 'activa')->count()
```

##### RF-CLIENTE-01.2: Recomendaciones Personalizadas
```
Estado: ❌ NO IMPLEMENTADO
Prioridad: ALTA

Funcionalidades:
1. Algoritmo de recomendación basado en:
   - presupuesto_min y presupuesto_max
   - tipo_propiedad
   - zona_preferida
   - habitaciones_deseadas
2. Mostrar 4-6 propiedades recomendadas
3. Indicador de "Match Score" (% compatibilidad)
4. Botones de acción: Ver, Favorito, Solicitar

Lógica backend necesaria:
- Método: Departamento::recomendadosPara($cliente)
- Cálculo de match score (0-100%)
- Ordenar por relevancia
```

##### RF-CLIENTE-01.3: Actividad Reciente
```
Estado: ❌ NO IMPLEMENTADO
Prioridad: MEDIA

Funcionalidades:
1. Timeline de últimas 10 acciones del cliente:
   - Favoritos agregados
   - Solicitudes enviadas
   - Respuestas recibidas de asesores
   - Propiedades visitadas (vistas)
   - Citas agendadas
2. Formato: "Acción - Hace X tiempo"
3. Enlaces directos a cada elemento

Tablas involucradas:
- favoritos (created_at)
- cotizaciones (created_at)
- cliente (updated_at para cambios)
```

##### RF-CLIENTE-01.4: Notificaciones Inteligentes
```
Estado: ⚠️ PARCIAL (solo backend)
Prioridad: MEDIA

Funcionalidades:
1. Nuevas propiedades en rango de presupuesto
2. Cambios en estado de solicitudes
3. Respuestas de asesores
4. Recordatorios de citas
5. Ofertas especiales/destacados

Sistema requerido:
- Tabla notifications (Laravel Notifications)
- Componente NotificationDropdown.jsx
- Badge de contador en navbar
```

##### RF-CLIENTE-01.5: Búsqueda Rápida Personalizada
```
Estado: ❌ NO IMPLEMENTADO
Prioridad: BAJA

Funcionalidades:
1. Barra de búsqueda en dashboard
2. Filtros rápidos pre-configurados con preferencias
3. Botón "Aplicar mis preferencias"
4. Resultados en tiempo real

Datos:
- Pre-llenar filtros con cliente->zona_preferida, etc.
- Redirigir a catálogo con query params
```

---

### 🔴 **RF-CLIENTE-02: Sistema de Favoritos** (CRÍTICO - 50%)

#### **Estado Actual:**
- ✅ Tabla `favoritos` creada
- ✅ Relación Cliente → Favoritos
- ✅ Página `Favoritos.jsx` básica
- ❌ Funcionalidades avanzadas

#### **Pendientes:**

##### RF-CLIENTE-02.1: Comparador de Favoritos
```
Estado: ❌ NO IMPLEMENTADO
Prioridad: ALTA

Funcionalidades:
1. Seleccionar 2-3 propiedades favoritas
2. Vista comparativa lado a lado:
   - Precio, habitaciones, baños, m²
   - Precio por m²
   - Ubicación, características especiales
3. Botón "Solicitar información" masivo

Componente: ComparadorFavoritos.jsx
Endpoint: GET /cliente/favoritos/comparar?ids=1,2,3
```

##### RF-CLIENTE-02.2: Alertas de Cambio de Precio
```
Estado: ❌ NO IMPLEMENTADO
Prioridad: MEDIA

Funcionalidades:
1. Notificar si un favorito baja de precio
2. Notificar si un favorito se reserva/vende
3. Configuración de alertas por email
4. Historial de cambios en favoritos

Tabla necesaria: precio_historico
```

##### RF-CLIENTE-02.3: Notas Personales en Favoritos
```
Estado: ❌ NO IMPLEMENTADO
Prioridad: BAJA

Funcionalidades:
1. Campo de notas privadas por favorito
2. Calificación personal (estrellas 1-5)
3. Tags personalizados
4. Filtrar favoritos por notas/tags

Migración: agregar columna 'pivot' en favoritos
```

---

### 🟡 **RF-CLIENTE-03: Gestión de Solicitudes** (MEDIA - 60%)

#### **Estado Actual:**
- ✅ Tabla `cotizaciones` creada
- ✅ Página `Solicitudes.jsx` básica
- ✅ Backend parcial en `ClienteController`
- ❌ Flujo completo

#### **Pendientes:**

##### RF-CLIENTE-03.1: Crear Solicitud desde Propiedad
```
Estado: ⚠️ PARCIAL
Prioridad: ALTA

Funcionalidades actuales:
✅ Formulario básico de solicitud
✅ Guardar en tabla cotizaciones

Pendientes:
❌ Validación de datos en frontend
❌ Preview de propiedad antes de enviar
❌ Mensaje personalizado al asesor
❌ Selección de horario preferido de contacto
❌ Confirmación visual al enviar

Archivos:
- Cliente/CrearSolicitud.jsx (existe pero incompleto)
- ClienteSolicitudController::store()
```

##### RF-CLIENTE-03.2: Seguimiento de Solicitudes
```
Estado: ❌ NO IMPLEMENTADO
Prioridad: CRÍTICA

Funcionalidades:
1. Estados visuales:
   - Pendiente (amarillo)
   - En proceso (azul)
   - Respondida (verde)
   - Rechazada (rojo)
   - Expirada (gris)
2. Timeline de cambios de estado
3. Mensajes del asesor visibles
4. Botón "Contactar asesor" directo
5. Cancelar solicitud (solo si pendiente)

Vista: Cliente/DetalleSolicitud.jsx (existe pero básico)
```

##### RF-CLIENTE-03.3: Chat/Comentarios en Solicitud
```
Estado: ⚠️ TABLA EXISTE, NO UI
Prioridad: MEDIA

Funcionalidades:
1. Sistema de comentarios bidireccional
2. Cliente escribe → Asesor responde
3. Notificaciones de nuevos mensajes
4. Adjuntar archivos (documentos)
5. Marcar como leído/no leído

Tabla: comentarios_solicitud ✅
Componente: ComentariosThread.jsx ❌
```

---

### 🟡 **RF-CLIENTE-04: Catálogo y Búsqueda** (MEDIA - 40%)

#### **Estado Actual:**
- ✅ Catálogo público básico
- ✅ Vista detallada de propiedad
- ❌ Filtros avanzados

#### **Pendientes:**

##### RF-CLIENTE-04.1: Filtros Avanzados
```
Estado: ❌ NO IMPLEMENTADO
Prioridad: CRÍTICA

Filtros necesarios:
1. Rango de precio (slider)
2. Número de habitaciones (select)
3. Número de baños (select)
4. Área mínima/máxima (m²)
5. Zona/Ubicación (multi-select)
6. Características especiales:
   - Garage ✓/✗
   - Balcón ✓/✗
   - Amueblado ✓/✗
   - Mascotas permitidas ✓/✗
7. Ordenamiento:
   - Precio (asc/desc)
   - Fecha publicación (nuevo primero)
   - Área (grande a pequeño)
   - Relevancia

Componente: FiltrosAvanzados.jsx
Backend: CatalogoController con query builder
```

##### RF-CLIENTE-04.2: Búsqueda Textual
```
Estado: ❌ NO IMPLEMENTADO
Prioridad: ALTA

Funcionalidades:
1. Búsqueda por:
   - Código de propiedad
   - Título
   - Descripción
   - Ubicación
2. Autocompletado con sugerencias
3. Búsqueda fuzzy (tolerante a errores)
4. Historial de búsquedas

Paquete recomendado: Laravel Scout + Meilisearch
```

##### RF-CLIENTE-04.3: Mapa Interactivo
```
Estado: ❌ NO IMPLEMENTADO
Prioridad: BAJA

Funcionalidades:
1. Mapa con marcadores de propiedades
2. Filtrar por área en mapa
3. Clústeres de propiedades cercanas
4. Info popup al hacer clic

Librería: React Leaflet o Google Maps
```

---

### 🟡 **RF-CLIENTE-05: Perfil y Preferencias** (MEDIA - 70%)

#### **Estado Actual:**
- ✅ Página `Perfil.jsx` funcional
- ✅ Edición de datos básicos
- ❌ Gestión completa de preferencias

#### **Pendientes:**

##### RF-CLIENTE-05.1: Gestión de Preferencias de Búsqueda
```
Estado: ⚠️ CAMPOS EXISTEN, NO UI
Prioridad: ALTA

Campos en BD (tabla clientes):
✅ tipo_propiedad
✅ habitaciones_deseadas
✅ presupuesto_min
✅ presupuesto_max
✅ zona_preferida

UI necesaria:
❌ Formulario de edición de preferencias
❌ Sugerencias basadas en mercado
❌ "Guardar búsqueda" feature
❌ Aplicar automáticamente en dashboard
```

##### RF-CLIENTE-05.2: Configuración de Notificaciones
```
Estado: ❌ NO IMPLEMENTADO
Prioridad: MEDIA

Funcionalidades:
1. Activar/desactivar notificaciones por:
   - Email
   - SMS (futuro)
   - En plataforma
2. Frecuencia de alertas:
   - Inmediato
   - Diario
   - Semanal
3. Tipos de notificaciones:
   - Nuevas propiedades
   - Cambios en solicitudes
   - Ofertas especiales

Tabla: notification_settings
```

---

### 🟢 **RF-CLIENTE-06: Interacción con Asesores** (BAJA - 30%)

#### **Estado Actual:**
- ✅ Página `Asesores.jsx` con lista
- ❌ Funcionalidades de contacto

#### **Pendientes:**

##### RF-CLIENTE-06.1: Contacto Directo con Asesor
```
Estado: ❌ NO IMPLEMENTADO
Prioridad: MEDIA

Funcionalidades:
1. Botón "Contactar asesor" en cada solicitud
2. Formulario de mensaje rápido
3. Programar llamada/videollamada
4. Ver disponibilidad del asesor
5. Historial de conversaciones

Vista: ContactarAsesor.jsx
```

##### RF-CLIENTE-06.2: Calificación de Asesores
```
Estado: ❌ NO IMPLEMENTADO
Prioridad: BAJA

Funcionalidades:
1. Calificar asesor después de solicitud (1-5 estrellas)
2. Dejar reseña escrita
3. Ver calificaciones de otros clientes
4. Promedio de calificación visible

Tabla: asesor_reviews
```

---

## 📊 PRIORIZACIÓN DE REQUISITOS

### 🔴 **URGENTE - Implementar ANTES del Dashboard**

1. **RF-CLIENTE-01.1**: Estadísticas Personales (2 horas)
   - Necesario para mostrar KPIs en dashboard
   - Consultas simples a la BD

2. **RF-CLIENTE-01.2**: Recomendaciones Personalizadas (4 horas)
   - Core del dashboard
   - Algoritmo de match score

3. **RF-CLIENTE-01.3**: Actividad Reciente (3 horas)
   - Mejora engagement
   - Timeline visual

4. **RF-CLIENTE-04.1**: Filtros Avanzados (6 horas)
   - Crítico para usabilidad del catálogo
   - Clientes esperan esta funcionalidad

**TOTAL URGENTE: ~15 horas (2 días de desarrollo)**

---

### 🟡 **IMPORTANTE - Implementar CON el Dashboard**

5. **RF-CLIENTE-01.4**: Notificaciones Inteligentes (5 horas)
   - Mejora retención de usuarios
   - Sistema de alertas

6. **RF-CLIENTE-03.2**: Seguimiento de Solicitudes (4 horas)
   - Estados visuales claros
   - Timeline de cambios

7. **RF-CLIENTE-02.1**: Comparador de Favoritos (6 horas)
   - Feature diferenciadora
   - Alta utilidad

**TOTAL IMPORTANTE: ~15 horas (2 días de desarrollo)**

---

### 🟢 **OPCIONAL - Implementar DESPUÉS del Dashboard**

8. **RF-CLIENTE-05.1**: Gestión de Preferencias (3 horas)
9. **RF-CLIENTE-03.3**: Chat en Solicitudes (8 horas)
10. **RF-CLIENTE-04.2**: Búsqueda Textual (6 horas)
11. **RF-CLIENTE-02.2**: Alertas de Precio (4 horas)
12. **RF-CLIENTE-06.1**: Contacto Directo (5 horas)

**TOTAL OPCIONAL: ~26 horas (3-4 días de desarrollo)**

---

## 🎯 RECOMENDACIÓN DE IMPLEMENTACIÓN

### **ESTRATEGIA SUGERIDA:**

#### **FASE 1: MVP del Dashboard** (2-3 días)
Implementar **solo** lo urgente:
1. ✅ Estadísticas personales básicas
2. ✅ Recomendaciones con match score simple
3. ✅ Actividad reciente (últimos 10 eventos)
4. ✅ Enlaces rápidos a secciones existentes

**Resultado:** Dashboard funcional y usable que muestra valor inmediato al cliente.

#### **FASE 2: Mejoras del Dashboard** (2 días)
Agregar funcionalidades importantes:
5. ✅ Notificaciones en tiempo real
6. ✅ Seguimiento visual de solicitudes
7. ✅ Comparador de favoritos
8. ✅ Filtros avanzados en catálogo

**Resultado:** Dashboard completo con todas las funcionalidades core.

#### **FASE 3: Features Avanzadas** (3-4 días)
Implementar opcionales según prioridad de negocio:
9. ✅ Chat en solicitudes
10. ✅ Búsqueda textual avanzada
11. ✅ Alertas de precios
12. ✅ Sistema de reviews

**Resultado:** Sistema completo y competitivo.

---

## 📋 CHECKLIST PRE-IMPLEMENTACIÓN

### **Antes de elegir propuesta de dashboard, verificar:**

- [x] Tabla `clientes` tiene campos de preferencias ✅
- [x] Relaciones Eloquent funcionando ✅
- [x] Factory `ClienteFactory` corregido ✅
- [x] Scopes útiles implementados ✅
- [x] Accessors seguros implementados ✅
- [ ] Método `Departamento::recomendadosPara($cliente)` ❌
- [ ] Método `Cliente::calcularMatchScore($departamento)` ❌
- [ ] Sistema de notificaciones configurado ❌
- [ ] Componentes React base creados ❌

### **Tareas técnicas pendientes:**

#### Backend:
1. [ ] Crear método `recomendadosPara()` en Departamento
2. [ ] Crear método `calcularMatchScore()` en Cliente
3. [ ] Crear método `obtenerActividadesRecientes()` en ClienteController
4. [ ] Configurar Laravel Notifications
5. [ ] Crear endpoints API para dashboard datos

#### Frontend:
1. [ ] Crear componente `EstadisticasCard.jsx`
2. [ ] Crear componente `PropiedadRecomendada.jsx`
3. [ ] Crear componente `TimelineActividad.jsx`
4. [ ] Crear componente `NotificacionesBadge.jsx`
5. [ ] Crear hook `useDashboardData.js`

#### Base de Datos:
1. [ ] Migración: `create_notifications_table`
2. [ ] Migración: `add_match_score_to_favoritos` (opcional)
3. [ ] Seeder: Datos de prueba para dashboard

---

## 🚀 DECISIÓN FINAL

### **Opción A: Implementar Dashboard Completo (Recomendado)**
- **Tiempo:** 4-5 días
- **Incluye:** Todas las funcionalidades urgentes + importantes
- **Ventaja:** Dashboard robusto desde el inicio
- **Desventaja:** Más tiempo inicial

### **Opción B: Implementar Dashboard MVP (Rápido)**
- **Tiempo:** 2-3 días
- **Incluye:** Solo funcionalidades urgentes
- **Ventaja:** Rápido lanzamiento
- **Desventaja:** Requiere iteración posterior

### **Opción C: Dashboard Híbrido Público-Privado (Equilibrado)** ⭐
- **Tiempo:** 3-4 días
- **Incluye:** Funcionalidades urgentes + versión pública
- **Ventaja:** Doble funcionalidad (lead generation + cliente)
- **Desventaja:** Complejidad media-alta

---

## 📝 CONCLUSIÓN

**Estado actual:** El sistema tiene una base sólida (BD, modelos, relaciones) pero le faltan las **capas de presentación y lógica de negocio** específicas del cliente.

**Recomendación:** Implementar primero las **funcionalidades urgentes** (15 horas) y luego elegir una de las 3 propuestas de dashboard según necesidad de negocio.

**Próximo paso:** Decidir entre:
1. Dashboard Minimalista (rápido)
2. Dashboard Premium (completo)
3. Dashboard Híbrido (equilibrado) ⭐ **RECOMENDADO**

---

**¿Listo para elegir la propuesta de dashboard?** 🎯

Responde con el número (1, 2 o 3) y procederé a implementar todas las funcionalidades necesarias.
