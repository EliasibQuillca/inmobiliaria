// Estados de departamentos
export const ESTADO_DEPARTAMENTO = {
    DISPONIBLE: 'disponible',
    RESERVADO: 'reservado',
    VENDIDO: 'vendido',
    INACTIVO: 'inactivo',
};

// Estados de cotizaciones
export const ESTADO_COTIZACION = {
    PENDIENTE: 'pendiente',
    ACEPTADA: 'aceptada',
    RECHAZADA: 'rechazada',
    EXPIRADA: 'expirada',
};

// Estados de reservas
export const ESTADO_RESERVA = {
    PENDIENTE: 'pendiente',
    CONFIRMADA: 'confirmada',
    CANCELADA: 'cancelada',
    COMPLETADA: 'completada',
    EXPIRADA: 'expirada',
};

// Estados de ventas
export const ESTADO_VENTA = {
    PROCESO: 'en_proceso',
    COMPLETADA: 'completada',
    CANCELADA: 'cancelada',
};

// Roles de usuarios
export const ROL_USUARIO = {
    ADMINISTRADOR: 'administrador',
    ASESOR: 'asesor',
    CLIENTE: 'cliente',
};

// Tipos de documentos
export const TIPO_DOCUMENTO = {
    DNI: 'dni',
    CARNET_EXTRANJERIA: 'carnet_extranjeria',
    PASAPORTE: 'pasaporte',
    RUC: 'ruc',
};

// Tipos de imágenes
export const TIPO_IMAGEN = {
    PRINCIPAL: 'principal',
    GALERIA: 'galeria',
    PLANO: 'plano',
    DOCUMENTO: 'documento',
};
