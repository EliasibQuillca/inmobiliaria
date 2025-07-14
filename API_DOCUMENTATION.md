# 🏢 **API SISTEMA INMOBILIARIO CUSCO - 2025**

## 📋 **CONFIGURACIÓN INICIAL**

### **Base URL:** `http://localhost:8000/api/v1`

### **Usuarios de Prueba:**
- **Administrador:** `admin@inmobiliaria.com` / `admin123`
- **Asesor:** `asesor@inmobiliaria.com` / `asesor123`  
- **Cliente:** `cliente@email.com` / `cliente123`

---

## 🔐 **AUTENTICACIÓN**

### **1. Login**
```http
POST /login
Content-Type: application/json

{
  "email": "asesor@inmobiliaria.com",
  "password": "asesor123"
}
```

**Respuesta:**
```json
{
  "message": "Login exitoso",
  "token": "1|abc123...",
  "user": {
    "id": 2,
    "nombre": "Juan Carlos Mendoza",
    "email": "asesor@inmobiliaria.com",
    "telefono": "+51987654322",
    "rol": "asesor"
  }
}
```

### **2. Logout**
```http
POST /logout
Authorization: Bearer {token}
```

### **3. Registro de Cliente**
```http
POST /register/cliente
Content-Type: application/json

{
  "nombre": "Ana García",
  "email": "ana@email.com",
  "telefono": "+51987123456",
  "password": "password123",
  "dni": "70123457",
  "direccion": "Av. Pardo 123, Cusco"
}
```

---

## 🏠 **DEPARTAMENTOS**

### **1. Listar Departamentos Públicos**
```http
GET /departamentos
```

**Filtros opcionales:**
- `?precio_min=200000`
- `?precio_max=400000`
- `?direccion=Cusco`

### **2. Ver Departamento Específico**
```http
GET /departamentos/{id}
```

### **3. Crear Departamento (Admin)**
```http
POST /admin/departamentos
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "codigo": "DEPT-004",
  "direccion": "Nueva dirección, Cusco",
  "precio": 300000,
  "propietario_id": 1,
  "atributos": [
    {
      "atributo_id": 1,
      "valor": "80"
    },
    {
      "atributo_id": 2,
      "valor": "3"
    }
  ]
}
```

---

## 💰 **COTIZACIONES** (Solo Asesores)

### **1. Crear Cotización**
```http
POST /cotizaciones
Authorization: Bearer {asesor_token}
Content-Type: application/json

{
  "departamento_id": 1,
  "cliente_data": {
    "nombre": "Pedro López",
    "email": "pedro@email.com",
    "telefono": "+51987111222",
    "dni": "70123458",
    "direccion": "Calle Real 456, Cusco"
  },
  "monto": 275000
}
```

**O usando cliente existente:**
```json
{
  "departamento_id": 2,
  "cliente_id": 1,
  "monto": 340000
}
```

### **2. Listar Cotizaciones del Asesor**
```http
GET /cotizaciones
Authorization: Bearer {asesor_token}
```

### **3. Aceptar Cotización**
```http
PATCH /cotizaciones/{id}/aceptar
Authorization: Bearer {token}
```

### **4. Rechazar Cotización**
```http
PATCH /cotizaciones/{id}/rechazar
Authorization: Bearer {token}
```

---

## 📋 **RESERVAS** (Solo Asesores)

### **1. Crear Reserva**
```http
POST /reservas
Authorization: Bearer {asesor_token}
Content-Type: application/json

{
  "cotizacion_id": 1
}
```

### **2. Listar Reservas del Asesor**
```http
GET /reservas
Authorization: Bearer {asesor_token}
```

---

## 💳 **VENTAS** (Solo Asesores)

### **1. Registrar Venta**
```http
POST /ventas
Authorization: Bearer {asesor_token}
Content-Type: application/json

{
  "reserva_id": 1,
  "fecha_venta": "2025-07-14",
  "monto_final": 270000,
  "documentos_entregados": false
}
```

### **2. Entregar Documentos**
```http
PATCH /ventas/{id}/entregar-documentos
Authorization: Bearer {asesor_token}
```

### **3. Listar Ventas del Asesor**
```http
GET /ventas
Authorization: Bearer {asesor_token}
```

---

## 👨‍💼 **RUTAS DE ADMINISTRADOR**

### **Ver Todas las Cotizaciones**
```http
GET /admin/cotizaciones
Authorization: Bearer {admin_token}
```

### **Ver Todas las Reservas**
```http
GET /admin/reservas
Authorization: Bearer {admin_token}
```

### **Ver Todas las Ventas**
```http
GET /admin/ventas
Authorization: Bearer {admin_token}
```

---

## 🔄 **FLUJO COMPLETO DEL NEGOCIO**

1. **Cliente ve departamentos** → `GET /departamentos`
2. **Asesor crea cotización** → `POST /cotizaciones`
3. **Cliente acepta cotización** → `PATCH /cotizaciones/{id}/aceptar`
4. **Asesor crea reserva** → `POST /reservas`
5. **Venta presencial en oficina** (fuera del sistema)
6. **Asesor registra venta** → `POST /ventas`
7. **Asesor entrega documentos** → `PATCH /ventas/{id}/entregar-documentos`
8. **Departamento queda marcado como vendido**
9. **Admin puede generar reportes** → `GET /admin/ventas`

---

## ⚡ **CÓDIGOS DE ESTADO**

- `200` - Éxito
- `201` - Creado exitosamente
- `400` - Datos inválidos
- `401` - No autenticado
- `403` - Sin permisos
- `404` - No encontrado
- `422` - Error de validación
- `500` - Error del servidor

---

## 🧪 **PRUEBA RÁPIDA**

```bash
# 1. Probar API
curl http://localhost:8000/api/test

# 2. Login como asesor
curl -X POST http://localhost:8000/api/v1/login \
  -H "Content-Type: application/json" \
  -d '{"email":"asesor@inmobiliaria.com","password":"asesor123"}'

# 3. Ver departamentos
curl http://localhost:8000/api/v1/departamentos
```

---

## 🎯 **FUNCIONALIDADES IMPLEMENTADAS**

✅ Sistema de autenticación con roles  
✅ CRUD de departamentos  
✅ Gestión de cotizaciones  
✅ Sistema de reservas  
✅ Registro de ventas  
✅ Auditoría de acciones  
✅ API RESTful completa  
✅ Relaciones de base de datos  
✅ Validaciones de negocio  
✅ Sistema de permisos
