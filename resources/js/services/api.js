import axios from 'axios';

// Crear instancia de axios con la configuración base
const api = axios.create({
    baseURL: '/api/v1',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
    },
});

// Interceptor para añadir el token CSRF
api.interceptors.request.use((config) => {
    const token = document.head.querySelector('meta[name="csrf-token"]');
    if (token) {
        config.headers['X-CSRF-TOKEN'] = token.content;
    }
    return config;
});

// Servicios para la gestión de departamentos
const departamentoService = {
    listar: (filtros) => api.get('/departamentos', { params: filtros }),
    obtener: (id) => api.get(`/departamentos/${id}`),
    crear: (data) => api.post('/departamentos', data),
    actualizar: (id, data) => api.put(`/departamentos/${id}`, data),
    eliminar: (id) => api.delete(`/departamentos/${id}`),
};

// Servicios para la gestión de clientes
const clienteService = {
    listar: () => api.get('/clientes'),
    obtener: (id) => api.get(`/clientes/${id}`),
    crear: (data) => api.post('/clientes', data),
    actualizar: (id, data) => api.put(`/clientes/${id}`, data),
};

// Servicios para cotizaciones
const cotizacionService = {
    listar: () => api.get('/cotizaciones'),
    obtener: (id) => api.get(`/cotizaciones/${id}`),
    crear: (data) => api.post('/cotizaciones', data),
    actualizar: (id, data) => api.put(`/cotizaciones/${id}`, data),
};

// Servicios para reservas
const reservaService = {
    listar: () => api.get('/reservas'),
    obtener: (id) => api.get(`/reservas/${id}`),
    crear: (data) => api.post('/reservas', data),
    actualizar: (id, data) => api.put(`/reservas/${id}`, data),
    cancelar: (id) => api.post(`/reservas/${id}/cancelar`),
};

// Servicios para ventas
const ventaService = {
    listar: () => api.get('/ventas'),
    obtener: (id) => api.get(`/ventas/${id}`),
    registrar: (data) => api.post('/ventas', data),
    generarPdf: (id) => api.get(`/ventas/${id}/pdf`, { responseType: 'blob' }),
};

// Servicios para gestión de imágenes
const imagenService = {
    listar: () => api.get('/imagenes'),
    subir: (formData) => api.post('/imagenes', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    eliminar: (id) => api.delete(`/imagenes/${id}`),
    verificarUrl: (url) => api.post('/imagenes/verificar-url', { url }),
};

export {
    api,
    departamentoService,
    clienteService,
    cotizacionService,
    reservaService,
    ventaService,
    imagenService
};
