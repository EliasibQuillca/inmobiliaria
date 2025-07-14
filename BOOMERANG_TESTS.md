# 🚀 **PRUEBAS API INMOBILIARIA CON BOOMERANG**

## 📋 **CONFIGURACIÓN INICIAL**

**Base URL:** `http://127.0.0.1:8000/api/v1`

---

## 🔐 **1. AUTENTICACIÓN**

### **Login Asesor**
```
Method: POST
URL: http://127.0.0.1:8000/api/v1/login
Headers:
  Content-Type: application/json

Body (JSON):
{
  "email": "asesor@inmobiliaria.com",
  "password": "asesor123"
}
```

### **Login Admin**
```
Method: POST
URL: http://127.0.0.1:8000/api/v1/login
Headers:
  Content-Type: application/json

Body (JSON):
{
  "email": "admin@inmobiliaria.com",
  "password": "admin123"
}
```

### **Login Cliente**
```
Method: POST
URL: http://127.0.0.1:8000/api/v1/login
Headers:
  Content-Type: application/json

Body (JSON):
{
  "email": "cliente@email.com",
  "password": "cliente123"
}
```

### **Verificar Usuario Autenticado**
```
Method: GET
URL: http://127.0.0.1:8000/api/v1/me
Headers:
  Authorization: Bearer {TOKEN_AQUI}
  Content-Type: application/json
```

### **Logout**
```
Method: POST
URL: http://127.0.0.1:8000/api/v1/logout
Headers:
  Authorization: Bearer {TOKEN_AQUI}
  Content-Type: application/json
```

---

## 🏠 **2. DEPARTAMENTOS**

### **Listar Departamentos (Público)**
```
Method: GET
URL: http://127.0.0.1:8000/api/v1/departamentos
```

### **Ver Departamento Específico**
```
Method: GET
URL: http://127.0.0.1:8000/api/v1/departamentos/1
```

### **Listar Departamentos con Filtros**
```
Method: GET
URL: http://127.0.0.1:8000/api/v1/departamentos?precio_min=200000&precio_max=400000
```

### **Crear Departamento (Solo Admin)**
```
Method: POST
URL: http://127.0.0.1:8000/api/v1/admin/departamentos
Headers:
  Authorization: Bearer {ADMIN_TOKEN}
  Content-Type: application/json

Body (JSON):
{
  "codigo": "DEPT-TEST-001",
  "direccion": "Av. Nueva 123, Cusco",
  "precio": 350000,
  "propietario_id": 1,
  "atributos": [
    {
      "atributo_id": 1,
      "valor": "90"
    },
    {
      "atributo_id": 2,
      "valor": "3"
    },
    {
      "atributo_id": 3,
      "valor": "2"
    }
  ]
}
```

---

## 💰 **3. COTIZACIONES**

### **Crear Cotización con Cliente Nuevo (Asesor)**
```
Method: POST
URL: http://127.0.0.1:8000/api/v1/cotizaciones
Headers:
  Authorization: Bearer {ASESOR_TOKEN}
  Content-Type: application/json

Body (JSON):
{
  "departamento_id": 1,
  "cliente_data": {
    "nombre": "María López",
    "email": "maria.lopez@email.com",
    "telefono": "+51987654321",
    "dni": "70123459",
    "direccion": "Jr. Cusco 456, Cusco"
  },
  "monto": 275000
}
```

### **Crear Cotización con Cliente Existente (Asesor)**
```
Method: POST
URL: http://127.0.0.1:8000/api/v1/cotizaciones
Headers:
  Authorization: Bearer {ASESOR_TOKEN}
  Content-Type: application/json

Body (JSON):
{
  "departamento_id": 2,
  "cliente_id": 1,
  "monto": 320000
}
```

### **Listar Cotizaciones del Asesor**
```
Method: GET
URL: http://127.0.0.1:8000/api/v1/cotizaciones
Headers:
  Authorization: Bearer {ASESOR_TOKEN}
```

### **Ver Cotización Específica**
```
Method: GET
URL: http://127.0.0.1:8000/api/v1/cotizaciones/1
Headers:
  Authorization: Bearer {ASESOR_TOKEN}
```

### **Aceptar Cotización**
```
Method: PATCH
URL: http://127.0.0.1:8000/api/v1/cotizaciones/1/aceptar
Headers:
  Authorization: Bearer {TOKEN}
  Content-Type: application/json
```

### **Rechazar Cotización**
```
Method: PATCH
URL: http://127.0.0.1:8000/api/v1/cotizaciones/1/rechazar
Headers:
  Authorization: Bearer {TOKEN}
  Content-Type: application/json
```

---

## 📋 **4. RESERVAS**

### **Crear Reserva desde Cotización Aceptada (Asesor)**
```
Method: POST
URL: http://127.0.0.1:8000/api/v1/reservas
Headers:
  Authorization: Bearer {ASESOR_TOKEN}
  Content-Type: application/json

Body (JSON):
{
  "cotizacion_id": 1
}
```

### **Listar Reservas del Asesor**
```
Method: GET
URL: http://127.0.0.1:8000/api/v1/reservas
Headers:
  Authorization: Bearer {ASESOR_TOKEN}
```

### **Ver Reserva Específica**
```
Method: GET
URL: http://127.0.0.1:8000/api/v1/reservas/1
Headers:
  Authorization: Bearer {ASESOR_TOKEN}
```

---

## 💳 **5. VENTAS**

### **Registrar Venta (Asesor)**
```
Method: POST
URL: http://127.0.0.1:8000/api/v1/ventas
Headers:
  Authorization: Bearer {ASESOR_TOKEN}
  Content-Type: application/json

Body (JSON):
{
  "reserva_id": 1,
  "fecha_venta": "2025-07-14",
  "monto_final": 270000,
  "documentos_entregados": false
}
```

### **Marcar Documentos como Entregados**
```
Method: PATCH
URL: http://127.0.0.1:8000/api/v1/ventas/1/entregar-documentos
Headers:
  Authorization: Bearer {ASESOR_TOKEN}
  Content-Type: application/json
```

### **Listar Ventas del Asesor**
```
Method: GET
URL: http://127.0.0.1:8000/api/v1/ventas
Headers:
  Authorization: Bearer {ASESOR_TOKEN}
```

### **Ver Venta Específica**
```
Method: GET
URL: http://127.0.0.1:8000/api/v1/ventas/1
Headers:
  Authorization: Bearer {ASESOR_TOKEN}
```

---

## 👨‍💼 **6. RUTAS DE ADMINISTRADOR**

### **Ver Todas las Cotizaciones (Admin)**
```
Method: GET
URL: http://127.0.0.1:8000/api/v1/admin/cotizaciones
Headers:
  Authorization: Bearer {ADMIN_TOKEN}
```

### **Ver Todas las Reservas (Admin)**
```
Method: GET
URL: http://127.0.0.1:8000/api/v1/admin/reservas
Headers:
  Authorization: Bearer {ADMIN_TOKEN}
```

### **Ver Todas las Ventas (Admin)**
```
Method: GET
URL: http://127.0.0.1:8000/api/v1/admin/ventas
Headers:
  Authorization: Bearer {ADMIN_TOKEN}
```

### **Ver Todos los Departamentos (Admin)**
```
Method: GET
URL: http://127.0.0.1:8000/api/v1/admin/departamentos
Headers:
  Authorization: Bearer {ADMIN_TOKEN}
```

---

## 🧪 **7. FLUJO COMPLETO DE PRUEBA**

### **Paso 1: Login como Asesor**
1. Hacer login con asesor
2. Copiar el token obtenido

### **Paso 2: Ver Departamentos Disponibles**
1. Listar departamentos disponibles
2. Anotar ID de un departamento disponible

### **Paso 3: Crear Cotización**
1. Crear cotización con cliente nuevo
2. Anotar ID de cotización creada

### **Paso 4: Aceptar Cotización**
1. Aceptar la cotización creada
2. Verificar que el estado cambió a "aceptada"

### **Paso 5: Crear Reserva**
1. Crear reserva usando la cotización aceptada
2. Anotar ID de reserva creada

### **Paso 6: Registrar Venta**
1. Registrar venta usando la reserva
2. Anotar ID de venta

### **Paso 7: Entregar Documentos**
1. Marcar documentos como entregados
2. Verificar el estado de la venta

### **Paso 8: Verificación Admin**
1. Login como admin
2. Ver todas las cotizaciones, reservas y ventas

---

## 📊 **8. ENDPOINTS DE PRUEBA**

### **API Health Check**
```
Method: GET
URL: http://127.0.0.1:8000/api/test
```

### **Registro de Nuevo Cliente**
```
Method: POST
URL: http://127.0.0.1:8000/api/v1/register/cliente
Headers:
  Content-Type: application/json

Body (JSON):
{
  "nombre": "Ana García",
  "email": "ana.garcia@email.com",
  "telefono": "+51987123456",
  "password": "password123",
  "dni": "70123460",
  "direccion": "Av. Pardo 789, Cusco"
}
```

---

## 🔑 **CREDENCIALES DE PRUEBA**

- **Administrador:** `admin@inmobiliaria.com` / `admin123`
- **Asesor:** `asesor@inmobiliaria.com` / `asesor123`
- **Cliente:** `cliente@email.com` / `cliente123`

---

## 💡 **TIPS PARA BOOMERANG**

1. **Crear Variables de Entorno:**
   - `base_url` = `http://127.0.0.1:8000/api/v1`
   - `asesor_token` = (copiar después del login)
   - `admin_token` = (copiar después del login)

2. **Orden de Pruebas:**
   1. Login → Obtener tokens
   2. Departamentos → Ver disponibles
   3. Cotizaciones → Crear y aceptar
   4. Reservas → Crear desde cotización
   5. Ventas → Registrar y completar

3. **Verificar Estados:**
   - Cotización: pendiente → aceptada/rechazada
   - Departamento: disponible → vendido
   - Venta: documentos_entregados: false → true

¡Listo para probar con Boomerang! 🚀
