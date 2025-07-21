import React from 'react';
import { Link } from '@inertiajs/react';

const Navbar = ({ auth }) => {
    return (
        <nav className="bg-white shadow-md py-4">
            <div className="container mx-auto px-4 md:px-8 flex justify-between items-center">
                <Link href="/" className="flex items-center">
                    <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-indigo-700 to-blue-500 bg-clip-text text-transparent">
                        CUSCO PREMIUM
                    </span>
                </Link>

                <div className="hidden md:flex items-center space-x-8">
                    <Link href="/properties" className="text-gray-700 hover:text-indigo-600 font-medium">
                        Propiedades
                    </Link>
                    <Link href="/services" className="text-gray-700 hover:text-indigo-600 font-medium">
                        Servicios
                    </Link>
                    <Link href="/about" className="text-gray-700 hover:text-indigo-600 font-medium">
                        Nosotros
                    </Link>
                    <Link href="/contact" className="text-gray-700 hover:text-indigo-600 font-medium">
                        Contacto
                    </Link>

                    {auth?.user ? (
                        <div className="flex items-center space-x-2">
                            <Link href="/dashboard" className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200">
                                Dashboard
                            </Link>
                        </div>
                    ) : (
                        <div className="flex items-center space-x-2">
                            <Link href="/login" className="text-gray-700 hover:text-indigo-600 font-medium">
                                Iniciar Sesión
                            </Link>
                            <Link href="/register" className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200">
                                Registrarse
                            </Link>
                        </div>
                    )}
                </div>

                {/* Mobile menu button */}
                <div className="md:hidden flex items-center">
                    <button className="mobile-menu-button">
                        <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                        </svg>
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
