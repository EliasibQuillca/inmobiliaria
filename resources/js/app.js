import './bootstrap';

// Importar Alpine.js y sus plugins
import Alpine from 'alpinejs';
import focus from '@alpinejs/focus';
import collapse from '@alpinejs/collapse';

// Registrar plugins
Alpine.plugin(focus);
Alpine.plugin(collapse);

// Inicializar Alpine.js
window.Alpine = Alpine;
Alpine.start();

// Importar SweetAlert2 para notificaciones
import Swal from 'sweetalert2';
window.Swal = Swal;
