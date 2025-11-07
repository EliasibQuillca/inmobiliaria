import './bootstrap';
import '../css/app.css';

import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

// Configurar Inertia para usar el token CSRF
import { router } from '@inertiajs/react';

// Función para obtener el token CSRF
function getCsrfToken() {
    const token = document.head.querySelector('meta[name="csrf-token"]');
    if (!token) {
        console.error('CSRF token not found in meta tag');
        return null;
    }
    return token.content;
}

// Interceptor para todas las peticiones de Inertia
router.on('before', (event) => {
    const token = getCsrfToken();
    if (token) {
        // Asegurar que los headers existan
        if (!event.detail.visit.headers) {
            event.detail.visit.headers = {};
        }
        // Agregar el token CSRF
        event.detail.visit.headers['X-CSRF-TOKEN'] = token;

        // Log para debugging (puedes comentar esto en producción)
        console.log('Inertia request:', event.detail.visit.method, event.detail.visit.url);
    } else {
        console.error('No CSRF token available for request');
    }
});

// Interceptor para manejar errores de CSRF
router.on('error', (event) => {
    const response = event.detail.response;

    // Si hay un error 419 (CSRF token mismatch), recargar la página
    if (response && (response.status === 419 || response.statusText === 'unknown status')) {
        console.error('CSRF token mismatch (419). Reloading page to get new token...');
        setTimeout(() => {
            window.location.reload();
        }, 1500);
    }
});

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./Pages/${name}.jsx`, import.meta.glob('./Pages/**/*.jsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(<App {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
});
