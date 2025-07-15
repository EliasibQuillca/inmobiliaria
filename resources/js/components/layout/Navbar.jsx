import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = () => {
    const { user, logout, isAuthenticated } = useAuth();

    const handleLogout = async () => {
        await logout();
    };

    return (
        <nav className="bg-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <h1 className="text-xl font-bold text-gray-800">
                                🏠 Sistema Inmobiliario
                            </h1>
                        </div>
                        <div className="hidden md:ml-6 md:flex md:space-x-8">
                            <a href="#catalogo" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">
                                Catálogo
                            </a>
                            {isAuthenticated && (
                                <a href="#dashboard" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">
                                    Dashboard
                                </a>
                            )}
                        </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                        {isAuthenticated ? (
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-2">
                                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                        <span className="text-white text-sm font-medium">
                                            {user?.nombre?.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="hidden md:block">
                                        <div className="text-sm font-medium text-gray-700">{user?.nombre}</div>
                                        <div className="text-xs text-gray-500 capitalize">{user?.rol}</div>
                                    </div>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                                >
                                    Cerrar Sesión
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-2">
                                <span className="text-gray-500 text-sm">No autenticado</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
