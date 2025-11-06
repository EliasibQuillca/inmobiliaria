import './bootstrap';
import '../css/app.css';

import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

// Configurar Inertia para usar el token CSRF
import { router } from '@inertiajs/react';

router.on('before', (event) => {
    const token = document.head.querySelector('meta[name="csrf-token"]');
    if (token) {
        event.detail.visit.headers = {
            ...event.detail.visit.headers,
            'X-CSRF-TOKEN': token.content
        };
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
