import { useState, useEffect } from 'react';
import { Link, router } from '@inertiajs/react';
import Button from '@/Components/DS/Button';

export default function AsesorLayout({ user, header, children }) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const [showTimeoutWarning, setShowTimeoutWarning] = useState(false);

    // Detectar la ruta actual para marcar el navbar activo
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';

    const isActive = (path) => {
        return currentPath.startsWith(path);
    };

    const getCsrfToken = () => {
        const meta = document.head.querySelector('meta[name="csrf-token"]');
        if (meta && meta.content) return meta.content;
        const match = document.cookie.match('(^|;)\\s*XSRF-TOKEN=([^;]+)');
        return match ? decodeURIComponent(match[2]) : '';
    };

    const logout = (e) => {
        if (e && e.preventDefault) e.preventDefault();
        const token = getCsrfToken();
        const form = document.getElementById('logout-form');
        if (form) {
            const input = form.querySelector('input[name="_token"]');
            if (input) input.value = token;
            form.submit();
            return;
        }
        fetch('/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-CSRF-TOKEN': token,
            },
            credentials: 'same-origin',
            body: `_token=${encodeURIComponent(token)}`,
        }).then(() => {
            window.location.href = '/';
        }).catch(() => {
            window.location.reload();
        });
    };

    // Cerrar dropdown al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showProfileDropdown && !event.target.closest('.profile-dropdown-container')) {
                setShowProfileDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showProfileDropdown]);

    // Temporizador de cierre de sesión automático para asesor (15 minutos)
    useEffect(() => {
        // Aviso 30 segundos antes
        const warningTimer = setTimeout(() => {
            setShowTimeoutWarning(true);
        }, 870000); // 14.5 minutos
        // Logout real
        const timer = setTimeout(() => {
            logout();
        }, 900000); // 15 minutos
        return () => {
            clearTimeout(timer);
            clearTimeout(warningTimer);
        };
    }, []);

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Modal de aviso de cierre de sesión */}
            {showTimeoutWarning && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                    <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                        <h2 className="text-lg font-bold mb-2">Sesión por expirar</h2>
                        <p className="mb-4">Por seguridad, tu sesión se cerrará en 30 segundos por inactividad.</p>
                        <Button variant="primary" onClick={() => { setShowTimeoutWarning(false); window.location.reload(); }}>Seguir conectado</Button>
                    </div>
                </div>
            )}

            {/* Navegación Principal */}
            <nav className="bg-white border-b border-gray-100 shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            {/* Logo */}
                            <div className="shrink-0 flex items-center">
                                <Link href="/asesor/dashboard" className="flex items-center hover:opacity-80 transition-opacity">
                                    <div className="w-8 h-8 bg-gradient-to-br from-primary-600 via-primary-500 to-primary-700 rounded-lg flex items-center justify-center shadow-sm">
                                        <span className="text-white font-bold text-sm">AS</span>
                                    </div>
                                    <span className="ml-2 text-lg sm:text-xl font-bold text-primary-700">Panel Asesor</span>
                                </Link>
                            </div>

                            {/* Navegación Principal */}
                            <div className="hidden space-x-8 sm:-my-px sm:ml-10 sm:flex">
                                <Link
                                    href="/asesor/clientes"
                                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium leading-5 transition duration-150 ease-in-out ${
                                        isActive('/asesor/clientes')
                                            ? 'border-primary-500 text-gray-900'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                    Mis Clientes
                                </Link>

                                <Link
                                    href="/asesor/solicitudes"
                                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium leading-5 transition duration-150 ease-in-out ${
                                        isActive('/asesor/solicitudes')
                                            ? 'border-primary-500 text-gray-900'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    Solicitudes
                                </Link>

                                <Link
                                    href="/asesor/cotizaciones"
                                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium leading-5 transition duration-150 ease-in-out ${
                                        isActive('/asesor/cotizaciones')
                                            ? 'border-primary-500 text-gray-900'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    Cotizaciones
                                </Link>

                                <Link
                                    href="/asesor/reservas"
                                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium leading-5 transition duration-150 ease-in-out ${
                                        isActive('/asesor/reservas')
                                            ? 'border-primary-500 text-gray-900'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    Reservas
                                </Link>

                                <Link
                                    href="/asesor/ventas"
                                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium leading-5 transition duration-150 ease-in-out ${
                                        isActive('/asesor/ventas')
                                            ? 'border-primary-500 text-gray-900'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                    </svg>
                                    Mis Ventas
                                </Link>
                            </div>
                        </div>

                        {/* Configuraciones del Usuario */}
                        <div className="hidden sm:flex sm:items-center sm:ml-6">
                            {/* Notificaciones */}
                            <button className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 mr-3">
                                <span className="sr-only">Ver notificaciones</span>
                                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                            </button>

                            {/* Dropdown del Perfil */}
                            <div className="ml-3 relative profile-dropdown-container">
                                <div>
                                    <button
                                        type="button"
                                        className="bg-white flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 shadow-sm hover:shadow-md transition-shadow"
                                        onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                                    >
                                        <span className="sr-only">Abrir menú de usuario</span>
                                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary-600 via-primary-500 to-primary-700 flex items-center justify-center">
                                            <span className="text-white font-medium text-sm">
                                                {user.name?.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                    </button>
                                </div>

                                {showProfileDropdown && (
                                    <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                                        <div className="px-4 py-2 text-xs text-gray-500 border-b">
                                            Asesor Inmobiliario
                                        </div>
                                        <div className="px-4 py-2 text-sm text-gray-700 border-b">
                                            <div className="font-medium">{user.name}</div>
                                            <div className="text-gray-500">{user.email}</div>
                                        </div>

                                        <Link
                                            href="/asesor/perfil"
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            onClick={() => setShowProfileDropdown(false)}
                                        >
                                            <svg className="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            Mi Perfil
                                        </Link>

                                        <div className="border-t">
                                            <Button
                                                variant="ghost"
                                                onClick={logout}
                                                className="block w-full justify-start px-4 py-2 text-sm text-danger-700 hover:bg-danger-50 rounded-none"
                                            >
                                                <svg className="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                </svg>
                                                Cerrar Sesión
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Hamburger (móvil) */}
                        <div className="-mr-2 flex items-center sm:hidden">
                            <button
                                onClick={() => setShowingNavigationDropdown(!showingNavigationDropdown)}
                                className="inline-flex items-center justify-center p-3 rounded-lg text-gray-600 hover:text-primary-600 hover:bg-primary-50 focus:outline-none focus:bg-primary-50 focus:text-primary-600 transition duration-150 ease-in-out shadow-sm border border-gray-200"
                                aria-label="Menú de navegación"
                            >
                                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    <path
                                        className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Navegación responsive */}
                <div className={(showingNavigationDropdown ? 'block' : 'hidden') + ' sm:hidden max-h-screen overflow-y-auto'}>
                    <div className="pt-2 pb-3 space-y-1">
                        <Link
                            href="/asesor/clientes"
                            className={`flex items-center pl-3 pr-4 py-3 border-l-4 text-base font-medium transition duration-150 ease-in-out ${
                                isActive('/asesor/clientes')
                                    ? 'border-primary-500 text-primary-700 bg-primary-50'
                                    : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300'
                            }`}
                        >
                            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                            Mis Clientes
                        </Link>
                        <Link
                            href="/asesor/solicitudes"
                            className={`flex items-center pl-3 pr-4 py-3 border-l-4 text-base font-medium transition duration-150 ease-in-out ${
                                isActive('/asesor/solicitudes')
                                    ? 'border-primary-500 text-primary-700 bg-primary-50'
                                    : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300'
                            }`}
                        >
                            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            Solicitudes
                        </Link>
                        <Link
                            href="/asesor/cotizaciones"
                            className={`flex items-center pl-3 pr-4 py-3 border-l-4 text-base font-medium transition duration-150 ease-in-out ${
                                isActive('/asesor/cotizaciones')
                                    ? 'border-primary-500 text-primary-700 bg-primary-50'
                                    : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300'
                            }`}
                        >
                            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Cotizaciones
                        </Link>
                        <Link
                            href="/asesor/reservas"
                            className={`flex items-center pl-3 pr-4 py-3 border-l-4 text-base font-medium transition duration-150 ease-in-out ${
                                isActive('/asesor/reservas')
                                    ? 'border-primary-500 text-primary-700 bg-primary-50'
                                    : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300'
                            }`}
                        >
                            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Reservas
                        </Link>
                        <Link
                            href="/asesor/ventas"
                            className={`flex items-center pl-3 pr-4 py-3 border-l-4 text-base font-medium transition duration-150 ease-in-out ${
                                isActive('/asesor/ventas')
                                    ? 'border-primary-500 text-primary-700 bg-primary-50'
                                    : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300'
                            }`}
                        >
                            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                            Mis Ventas
                        </Link>
                    </div>

                    {/* Usuario responsive */}
                    <div className="pt-4 pb-3 border-t border-gray-200 bg-gray-50">
                        <div className="px-4 py-3 bg-white border-b border-gray-200">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="w-10 h-10 bg-gradient-to-br from-primary-600 via-primary-500 to-primary-700 rounded-full flex items-center justify-center">
                                        <span className="text-white font-bold text-lg">{user.name?.charAt(0).toUpperCase()}</span>
                                    </div>
                                </div>
                                <div className="ml-3">
                                    <div className="font-medium text-base text-gray-800">{user.name}</div>
                                    <div className="text-sm text-gray-500">{user.email}</div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-3 space-y-1 px-2">
                            <Link
                                href="/asesor/perfil"
                                className="flex items-center px-3 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50 focus:outline-none focus:text-primary-600 focus:bg-primary-50 transition duration-150 ease-in-out"
                            >
                                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                Mi Perfil
                            </Link>
                            <Button
                                variant="ghost"
                                onClick={logout}
                                className="flex items-center w-full justify-start px-3 py-3 rounded-lg text-base font-medium text-danger-600 hover:text-danger-700 hover:bg-danger-50 focus:outline-none focus:text-danger-700 focus:bg-danger-50 transition duration-150 ease-in-out"
                            >
                                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                Cerrar Sesión
                            </Button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Encabezado de la página */}
            {header && (
                <header className="bg-white shadow">
                    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            {/* Contenido principal */}
            <main>{children}</main>
        </div>
    );
}
