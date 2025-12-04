import axios from 'axios';
window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
window.axios.defaults.withCredentials = true;

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

// Axios response interceptor: if server returns 419 (Page Expired) or 401,
// reload the page automatically so the user receives fresh session/token.
window.axios.interceptors.response.use(
    function (response) {
        return response;
    },
    function (error) {
        try {
            const status = error?.response?.status;
            if (status === 419 || status === 401) {
                if (!window.__csrfReloading) {
                    window.__csrfReloading = true;
                    window.location.reload();
                }
            }
        } catch (e) {
            // ignore
        }
        return Promise.reject(error);
    }
);

// Wrap native fetch to detect 419/401 responses (Inertia/fetch requests).
if (typeof window !== 'undefined' && window.fetch) {
    const nativeFetch = window.fetch.bind(window);
    window.fetch = function (...args) {
        return nativeFetch(...args).then((res) => {
            try {
                if (res && (res.status === 419 || res.status === 401)) {
                    if (!window.__csrfReloading) {
                        window.__csrfReloading = true;
                        // reload to refresh CSRF token / session state
                        window.location.reload();
                    }
                }
            } catch (e) {
                // ignore
            }
            return res;
        }).catch((err) => {
            return Promise.reject(err);
        });
    };
}

// Wrap XMLHttpRequest to detect 419/401 responses for libraries that use XHR.
if (typeof window !== 'undefined' && window.XMLHttpRequest) {
    (function () {
        const proto = window.XMLHttpRequest.prototype;
        const _send = proto.send;
        proto.send = function () {
            try {
                this.addEventListener('load', function () {
                    try {
                        const status = this.status;
                        if (status === 419 || status === 401) {
                            if (!window.__csrfReloading) {
                                window.__csrfReloading = true;
                                // Use replace to avoid back button loops
                                window.location.reload();
                            }
                        }
                    } catch (e) {
                        // ignore
                    }
                });
            } catch (e) {
                // ignore
            }
            return _send.apply(this, arguments);
        };
    })();
}

// Global logout submit handler:
// Intercept forms with `data-logout` to perform a fetch POST and silently
// handle errors (reload the page on error or after success).
function getCsrfTokenFromMetaOrCookie() {
    const meta = document.head.querySelector('meta[name="csrf-token"]');
    if (meta && meta.content) return meta.content;
    const match = document.cookie.match('(^|;)\\s*XSRF-TOKEN=([^;]+)');
    return match ? decodeURIComponent(match[2]) : '';
}

document.addEventListener('submit', function (e) {
    const form = e.target;
    if (!(form instanceof HTMLFormElement)) return;
    if (!form.hasAttribute('data-logout')) return;

    e.preventDefault();

    const token = getCsrfTokenFromMetaOrCookie();
    const body = `_token=${encodeURIComponent(token)}`;

    fetch(form.action || '/logout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-CSRF-TOKEN': token,
        },
        credentials: 'same-origin',
        body,
    }).then((res) => {
        // On success or redirect, go to home.
        try { window.location.href = '/'; } catch (err) { window.location.reload(); }
    }).catch(() => {
        // Silently reload page so server can provide fresh token/login state
        window.location.reload();
    });
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
