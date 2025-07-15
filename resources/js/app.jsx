import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';

// Configuración de axios
axios.defaults.baseURL = window.location.origin;
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// Configurar token CSRF si existe
const token = document.head.querySelector('meta[name="csrf-token"]');
if (token) {
    axios.defaults.headers.common['X-CSRF-TOKEN'] = token.getAttribute('content');
}

// Importar contextos y componentes
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/layout/Navbar';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import CatalogoIndex from './components/catalogo/CatalogoIndex';
import CatalogoShow from './components/catalogo/CatalogoShow';
import Dashboard from './components/dashboard/Dashboard';

// Componente principal de navegación
const MainApp = () => {
    const [currentView, setCurrentView] = useState('catalogo');
    const [selectedDepartamento, setSelectedDepartamento] = useState(null);
    const [authView, setAuthView] = useState('login'); // 'login' o 'register'
    
    const { isAuthenticated, loading } = useAuth();

    // Mostrar loading mientras se verifica la autenticación
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    // Navegación para usuarios no autenticados
    const handleNavigation = (view) => {
        setCurrentView(view);
        setSelectedDepartamento(null);
    };

    // Ver detalles de departamento
    const handleViewDepartamento = (departamentoId) => {
        setSelectedDepartamento(departamentoId);
        setCurrentView('departamento-detalle');
    };

    // Volver al catálogo
    const handleBackToCatalogo = () => {
        setSelectedDepartamento(null);
        setCurrentView('catalogo');
    };

    // Renderizar vista de autenticación
    const renderAuthView = () => {
        if (authView === 'login') {
            return (
                <Login onSwitchToRegister={() => setAuthView('register')} />
            );
        } else {
            return (
                <Register onSwitchToLogin={() => setAuthView('login')} />
            );
        }
    };

    // Renderizar contenido principal
    const renderMainContent = () => {
        if (!isAuthenticated && (currentView === 'login' || currentView === 'register')) {
            return renderAuthView();
        }

        switch (currentView) {
            case 'catalogo':
                return <CatalogoIndex onViewDetails={handleViewDepartamento} />;
            
            case 'departamento-detalle':
                return (
                    <CatalogoShow 
                        departamentoId={selectedDepartamento}
                        onBack={handleBackToCatalogo}
                    />
                );
            
            case 'dashboard':
                return isAuthenticated ? <Dashboard /> : renderAuthView();
            
            default:
                return <CatalogoIndex onViewDetails={handleViewDepartamento} />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navbar siempre visible */}
            <Navbar />
            
            {/* Navegación principal */}
            {isAuthenticated && (
                <div className="bg-white border-b">
                    <div className="max-w-7xl mx-auto px-4">
                        <nav className="flex space-x-8 py-4">
                            <button
                                onClick={() => handleNavigation('catalogo')}
                                className={`text-sm font-medium transition-colors ${
                                    currentView === 'catalogo' || currentView === 'departamento-detalle'
                                        ? 'text-blue-600 border-b-2 border-blue-600'
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                🏠 Catálogo
                            </button>
                            <button
                                onClick={() => handleNavigation('dashboard')}
                                className={`text-sm font-medium transition-colors ${
                                    currentView === 'dashboard'
                                        ? 'text-blue-600 border-b-2 border-blue-600'
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                � Dashboard
                            </button>
                        </nav>
                    </div>
                </div>
            )}

            {/* Botones de autenticación para usuarios no autenticados */}
            {!isAuthenticated && currentView !== 'login' && currentView !== 'register' && (
                <div className="bg-blue-50 border-b">
                    <div className="max-w-7xl mx-auto px-4 py-3">
                        <div className="flex justify-center space-x-4">
                            <button
                                onClick={() => setCurrentView('login')}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                            >
                                Iniciar Sesión
                            </button>
                            <button
                                onClick={() => setCurrentView('register')}
                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                            >
                                Registrarse
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Contenido principal */}
            <main>
                {renderMainContent()}
            </main>
        </div>
    );
};

// Componente raíz con providers
const InmobiliariaApp = () => {
    return (
        <AuthProvider>
            <MainApp />
        </AuthProvider>
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
