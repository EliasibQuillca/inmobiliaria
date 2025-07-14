import React from 'react';
import ReactDOM from 'react-dom/client';

// Componente principal de la aplicación React
const InmobiliariaApp = () => {
    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    🏠 Sistema Inmobiliario
                </h1>
                <p className="text-gray-600">
                    Plataforma de gestión de propiedades
                </p>
                <div className="mt-4 flex justify-center space-x-4 text-sm">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">⚛️ React 19</span>
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">🎨 Tailwind CSS</span>
                    <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full">🚀 Vite</span>
                    <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full">🔥 Laravel</span>
                </div>
            </div>

            {/* Contenido principal */}
            <div className="text-center p-8 bg-white rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    ¡Proyecto listo para el desarrollo!
                </h2>
                <p className="text-gray-600">
                    El proyecto ha sido limpiado y está preparado para comenzar el desarrollo de la aplicación inmobiliaria.
                </p>
            </div>
        </div>
    );
};

// Función para inicializar React solo si existe el contenedor
export const initializeReactApp = () => {
    const container = document.getElementById('react-app');
    if (container) {
        const root = ReactDOM.createRoot(container);
        root.render(<InmobiliariaApp />);
    }
};

// Auto-inicializar si el DOM ya está listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeReactApp);
} else {
    initializeReactApp();
}

export default InmobiliariaApp;
