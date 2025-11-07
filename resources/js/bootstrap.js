import axios from 'axios';
window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// Configurar token CSRF para Axios
let token = document.head.querySelector('meta[name="csrf-token"]');

if (token) {
    window.axios.defaults.headers.common['X-CSRF-TOKEN'] = token.content;
} else {
    console.error('CSRF token not found: https://laravel.com/docs/csrf#csrf-x-csrf-token');
}

// Interceptor para actualizar el token en cada petición
window.axios.interceptors.request.use(function (config) {
    const token = document.head.querySelector('meta[name="csrf-token"]');
    if (token) {
        config.headers['X-CSRF-TOKEN'] = token.content;
    }
    return config;
}, function (error) {
    return Promise.reject(error);
});

// Helper para generar rutas sin Ziggy
window.route = function(name, params = {}) {
    // Si se llama sin argumentos, devolver objeto con método current()
    if (!name) {
        return {
            current: function(routeName) {
                // Obtener la URL actual
                const currentPath = window.location.pathname;
                const routePath = '/' + (routeName || '').replace(/\./g, '/');
                return currentPath === routePath || currentPath.startsWith(routePath + '/');
            }
        };
    }

    // Validar que name es string
    if (typeof name !== 'string') {
        console.error('route() - Nombre de ruta inválido:', name);
        return '/';
    }

    // Convertir nombre de ruta a URL
    let url = '/' + name.replace(/\./g, '/');

    // Si params es un número o string, es un ID
    if (typeof params === 'number' || (typeof params === 'string' && !params.includes('='))) {
        url = url + '/' + params;
    }
    // Si params es un objeto, construir query string
    else if (typeof params === 'object' && Object.keys(params).length > 0) {
        const queryString = Object.keys(params)
            .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
            .join('&');
        url = url + '?' + queryString;
    }

    return url;
};
