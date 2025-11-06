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

// Helper para generar rutas sin Ziggy
window.route = function(name, params = {}) {
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
