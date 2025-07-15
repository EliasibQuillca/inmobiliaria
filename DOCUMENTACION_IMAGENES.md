# API de Gestión de Imágenes

Esta documentación explica cómo usar la API para gestionar imágenes de departamentos mediante URLs.

## Características Principales

- ✅ **Subida mediante URLs**: No necesitas subir archivos, solo proporciona enlaces
- ✅ **Validación automática**: Verifica que las URLs apunten a imágenes válidas
- ✅ **Tipos de imagen**: Principal, galería y planos
- ✅ **Ordenamiento**: Control del orden de visualización
- ✅ **Gestión completa**: CRUD completo para imágenes

## Endpoints Disponibles

### 📋 Listar Imágenes
```http
GET /api/v1/imagenes?departamento_id={id}
```

**Respuesta:**
```json
{
    "success": true,
    "data": [
        {
            "id": 1,
            "departamento_id": 1,
            "url": "https://ejemplo.com/imagen.jpg",
            "titulo": "Sala principal",
            "descripcion": "Vista de la sala con excelente iluminación",
            "tipo": "principal",
            "orden": 1,
            "activa": true,
            "created_at": "2025-07-15T03:00:00.000000Z",
            "updated_at": "2025-07-15T03:00:00.000000Z"
        }
    ]
}
```

### ➕ Agregar Nueva Imagen
```http
POST /api/v1/imagenes
Content-Type: application/json
```

**Cuerpo de la petición:**
```json
{
    "departamento_id": 1,
    "url": "https://ejemplo.com/imagen-nueva.jpg",
    "titulo": "Cocina moderna",
    "descripcion": "Cocina completamente equipada",
    "tipo": "galeria",
    "orden": 2
}
```

**Campos:**
- `departamento_id` (requerido): ID del departamento
- `url` (requerido): URL válida de la imagen
- `titulo` (opcional): Título descriptivo (máx. 100 caracteres)
- `descripcion` (opcional): Descripción detallada (máx. 255 caracteres)
- `tipo` (requerido): `principal`, `galeria`, o `plano`
- `orden` (opcional): Número de orden para visualización

### 🔍 Ver Imagen Específica
```http
GET /api/v1/imagenes/{id}
```

### ✏️ Actualizar Imagen
```http
PATCH /api/v1/imagenes/{id}
Content-Type: application/json
```

**Cuerpo de la petición (todos los campos son opcionales):**
```json
{
    "url": "https://ejemplo.com/imagen-actualizada.jpg",
    "titulo": "Nuevo título",
    "descripcion": "Nueva descripción",
    "tipo": "principal",
    "orden": 1,
    "activa": true
}
```

### 🗑️ Eliminar Imagen
```http
DELETE /api/v1/imagenes/{id}
```

### 🔄 Reordenar Imágenes
```http
POST /api/v1/imagenes/reordenar
Content-Type: application/json
```

**Cuerpo de la petición:**
```json
{
    "departamento_id": 1,
    "imagenes": [
        {"id": 1, "orden": 2},
        {"id": 2, "orden": 1},
        {"id": 3, "orden": 3}
    ]
}
```

### ✅ Verificar URL de Imagen
```http
POST /api/v1/imagenes/verificar-url
Content-Type: application/json
```

**Cuerpo de la petición:**
```json
{
    "url": "https://ejemplo.com/imagen.jpg"
}
```

**Respuesta:**
```json
{
    "success": true,
    "data": {
        "url_valida": true,
        "es_imagen": true,
        "content_type": "image/jpeg"
    }
}
```

## Tipos de Imagen

### 🔥 Principal
- Solo puede haber **1 imagen principal** por departamento
- Se muestra como imagen destacada
- Al marcar una imagen como principal, las otras se convierten en galería automáticamente

### 🖼️ Galería
- Múltiples imágenes permitidas
- Se muestran en la galería del departamento
- Perfectas para mostrar diferentes áreas y características

### 📐 Planos
- Para planos arquitectónicos y distribución
- Útiles para mostrar la estructura del departamento

## Ejemplos de Uso

### JavaScript/React
```javascript
// Agregar imagen
const agregarImagen = async (departamentoId, datosImagen) => {
    const response = await fetch('/api/v1/imagenes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
        },
        body: JSON.stringify({
            departamento_id: departamentoId,
            ...datosImagen
        })
    });
    
    return await response.json();
};

// Cargar imágenes
const cargarImagenes = async (departamentoId) => {
    const response = await fetch(`/api/v1/imagenes?departamento_id=${departamentoId}`);
    return await response.json();
};

// Verificar URL
const verificarUrl = async (url) => {
    const response = await fetch('/api/v1/imagenes/verificar-url', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
        },
        body: JSON.stringify({ url })
    });
    
    return await response.json();
};
```

### PHP/Laravel
```php
use App\Models\Imagen;

// Agregar imagen
$imagen = Imagen::create([
    'departamento_id' => 1,
    'url' => 'https://ejemplo.com/imagen.jpg',
    'titulo' => 'Sala principal',
    'tipo' => 'principal'
]);

// Obtener imágenes de un departamento
$imagenes = Imagen::where('departamento_id', 1)
    ->activas()
    ->ordenadas()
    ->get();

// Obtener solo imagen principal
$imagenPrincipal = Imagen::principal(1);

// Obtener galería
$galeria = Imagen::where('departamento_id', 1)
    ->porTipo('galeria')
    ->activas()
    ->ordenadas()
    ->get();
```

## Buenas Prácticas

### 🌐 URLs Recomendadas
- Usa servicios confiables como:
  - **Cloudinary**: `https://res.cloudinary.com/...`
  - **AWS S3**: `https://s3.amazonaws.com/...`
  - **Google Cloud**: `https://storage.googleapis.com/...`
  - **Unsplash** (para pruebas): `https://images.unsplash.com/...`

### 🖼️ Calidad de Imagen
- **Resolución mínima**: 800x600px
- **Formatos admitidos**: JPG, PNG, WebP
- **Tamaño recomendado**: Máximo 2MB por imagen

### 📱 Responsividad
- Las imágenes se adaptan automáticamente a diferentes dispositivos
- Usa URLs que soporten parámetros de redimensionamiento

### 🔒 Seguridad
- Solo usuarios autenticados pueden agregar/editar/eliminar imágenes
- Las URLs son validadas antes de guardarse
- Las imágenes se verifican automáticamente

## Códigos de Error Comunes

| Código | Significado |
|--------|-------------|
| 400 | ID del departamento requerido |
| 404 | Imagen o departamento no encontrado |
| 422 | Datos de validación incorrectos |
| 500 | Error interno del servidor |

## Modelos Relacionados

```php
// En el modelo Departamento
public function imagenes()
{
    return $this->hasMany(Imagen::class);
}

public function imagenPrincipal()
{
    return $this->hasOne(Imagen::class)->where('tipo', 'principal');
}

public function galeriaImagenes()
{
    return $this->hasMany(Imagen::class)->where('tipo', 'galeria');
}
```

## Componentes React Incluidos

1. **`ImagenManager`**: Gestión completa de imágenes
2. **`DepartamentoImagenes`**: Visualización y gestión integrada

Estos componentes están listos para usar y se integran perfectamente con la API.
