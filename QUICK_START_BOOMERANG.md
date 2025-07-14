# 🚀 **INICIO RÁPIDO - BOOMERANG**

## ⚡ **PRUEBA RÁPIDA EN 5 PASOS**

### **1. LOGIN ASESOR** 
```
POST: http://127.0.0.1:8000/api/v1/login
Body: {"email":"asesor@inmobiliaria.com","password":"asesor123"}
```
**📝 Copiar el `token` de la respuesta**

### **2. VER DEPARTAMENTOS**
```
GET: http://127.0.0.1:8000/api/v1/departamentos
```

### **3. CREAR COTIZACIÓN**
```
POST: http://127.0.0.1:8000/api/v1/cotizaciones
Headers: Authorization: Bearer {TOKEN_DEL_PASO_1}
Body: {
  "departamento_id": 1,
  "cliente_data": {
    "nombre": "Juan Pérez",
    "email": "juan.perez@test.com",
    "telefono": "+51987654321",
    "dni": "12345678",
    "direccion": "Calle Test 123"
  },
  "monto": 280000
}
```

### **4. ACEPTAR COTIZACIÓN**
```
PATCH: http://127.0.0.1:8000/api/v1/cotizaciones/1/aceptar
Headers: Authorization: Bearer {TOKEN_DEL_PASO_1}
```

### **5. CREAR RESERVA**
```
POST: http://127.0.0.1:8000/api/v1/reservas
Headers: Authorization: Bearer {TOKEN_DEL_PASO_1}
Body: {"cotizacion_id": 1}
```

---

## 🔧 **CONFIGURACIÓN BOOMERANG**

### **Variables de Entorno Sugeridas:**
- `{{base_url}}` = `http://127.0.0.1:8000/api/v1`
- `{{token}}` = (token obtenido del login)

### **Ejemplo de URL con Variable:**
```
{{base_url}}/cotizaciones
```

### **Ejemplo de Header con Variable:**
```
Authorization: Bearer {{token}}
```

---

## ✅ **RESPUESTAS ESPERADAS**

### **Login Exitoso:**
```json
{
  "message": "Login exitoso",
  "token": "1|xxxxxx",
  "user": {
    "id": 2,
    "nombre": "Juan Carlos Mendoza",
    "email": "asesor@inmobiliaria.com",
    "rol": "asesor"
  }
}
```

### **Departamentos:**
```json
{
  "departamentos": [
    {
      "id": 1,
      "codigo": "DEPT-001",
      "direccion": "Av. El Sol 250, Departamento 3A, Cusco",
      "precio": "280000.00",
      "estado": "disponible"
    }
  ]
}
```

### **Cotización Creada:**
```json
{
  "message": "Cotización creada exitosamente",
  "cotizacion": {
    "id": 1,
    "estado": "pendiente",
    "monto": "280000.00"
  }
}
```

---

## 🎯 **SERVIDOR FUNCIONANDO**
✅ **URL:** `http://127.0.0.1:8000`  
✅ **Estado:** Activo y recibiendo peticiones  
✅ **Base de datos:** Poblada con datos de prueba

**¡Listo para probar con Boomerang! 🚀**
