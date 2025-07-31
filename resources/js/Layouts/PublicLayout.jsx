import React from 'react';
import { Link } from '@inertiajs/react';

export default function PublicLayout({ auth, children }) {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        {/* Logo/Brand */}
                        <div className="flex items-center">
                            <Link href={route('catalogo.index')} className="flex items-center">
                                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <div className="text-lg font-bold text-gray-900">Inmobiliaria</div>
                                    <div className="text-sm text-gray-500">Tu hogar ideal</div>
                                </div>
                            </Link>
                        </div>

                        {/* Navigation */}
                        <nav className="hidden md:flex space-x-8">
                            <Link
                                href={route('catalogo.index')}
                                className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium"
                            >
                                Catálogo
                            </Link>
                            <a href="#" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">
                                Sobre Nosotros
                            </a>
                            <a href="#" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">
                                Contacto
                            </a>
                        </nav>

                        {/* Auth Section */}
                        <div className="flex items-center space-x-4">
                            {auth.user ? (
                                <div className="flex items-center space-x-3">
                                    <span className="text-sm text-gray-700">
                                        Hola, {auth.user.name}
                                    </span>
                                    <div className="relative group">
                                        <button className="flex items-center space-x-1 text-sm text-gray-700 hover:text-blue-600">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 hidden group-hover:block">
                                            {auth.user.role === 'administrador' && (
                                                <Link
                                                    href={route('admin.dashboard')}
                                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                >
                                                    Panel de Administrador
                                                </Link>
                                            )}
                                            {auth.user.role === 'asesor' && (
                                                <Link
                                                    href={route('asesor.dashboard')}
                                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                >
                                                    Panel de Asesor
                                                </Link>
                                            )}
                                            {auth.user.role === 'cliente' && (
                                                <>
                                                    <Link
                                                        href={route('cliente.dashboard')}
                                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                    >
                                                        <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                                        </svg>
                                                        Mi Panel
                                                    </Link>
                                                    <Link
                                                        href={route('cliente.favoritos')}
                                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                    >
                                                        <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                                        </svg>
                                                        Mis Favoritos
                                                    </Link>
                                                    <Link
                                                        href={route('cliente.solicitudes')}
                                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                    >
                                                        <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-2m-4-1v8m0 0l3-3m-3 3L9 8m-5 5h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293h3.172a1 1 0 00.707-.293l2.414-2.414a1 1 0 01.707-.293H20" />
                                                        </svg>
                                                        Mis Solicitudes
                                                    </Link>
                                                    <Link
                                                        href={route('cliente.perfil')}
                                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                    >
                                                        <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                        </svg>
                                                        Mi Perfil
                                                    </Link>
                                                    <hr className="my-1" />
                                                </>
                                            )}
                                            <Link
                                                href={route('logout')}
                                                method="post"
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                                Cerrar Sesión
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center space-x-3">
                                    <Link
                                        href={route('login')}
                                        className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium"
                                    >
                                        Iniciar Sesión
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                                    >
                                        Registrarse
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Mobile menu button */}
                        <div className="md:hidden">
                            <button className="text-gray-700 hover:text-blue-600">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main>
                {children}
            </main>

            {/* Footer */}
            <footer className="bg-gray-800 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {/* Company Info */}
                        <div className="col-span-1 md:col-span-2">
                            <div className="flex items-center mb-4">
                                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <div className="text-lg font-bold">Inmobiliaria</div>
                                    <div className="text-sm text-gray-300">Tu hogar ideal</div>
                                </div>
                            </div>
                            <p className="text-gray-300 text-sm mb-4">
                                Encontramos el hogar perfecto para ti. Con años de experiencia en el mercado inmobiliario,
                                te ayudamos a hacer realidad tus sueños de vivienda.
                            </p>
                            <div className="flex space-x-4">
                                <a href="#" className="text-gray-300 hover:text-white">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                                    </svg>
                                </a>
                                <a href="#" className="text-gray-300 hover:text-white">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                                    </svg>
                                </a>
                                <a href="#" className="text-gray-300 hover:text-white">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.758-1.378l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641 0 12.017 0z"/>
                                    </svg>
                                </a>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Enlaces Rápidos</h3>
                            <ul className="space-y-2">
                                <li>
                                    <Link href={route('catalogo.index')} className="text-gray-300 hover:text-white text-sm">
                                        Catálogo de Propiedades
                                    </Link>
                                </li>
                                <li>
                                    <a href="#" className="text-gray-300 hover:text-white text-sm">
                                        Sobre Nosotros
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-gray-300 hover:text-white text-sm">
                                        Servicios
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-gray-300 hover:text-white text-sm">
                                        Blog
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* Contact Info */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Contacto</h3>
                            <ul className="space-y-2">
                                <li className="flex items-center text-gray-300 text-sm">
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    Bogotá, Colombia
                                </li>
                                <li className="flex items-center text-gray-300 text-sm">
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    +57 (1) 234-5678
                                </li>
                                <li className="flex items-center text-gray-300 text-sm">
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    info@inmobiliaria.com
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-gray-700 mt-8 pt-8 text-center">
                        <p className="text-gray-300 text-sm">
                            © {new Date().getFullYear()} Inmobiliaria. Todos los derechos reservados.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
