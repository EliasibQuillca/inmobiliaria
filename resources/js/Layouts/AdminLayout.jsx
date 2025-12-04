import { useState, useEffect } from 'react';
import { Link, router, usePage } from '@inertiajs/react';

// Componente NavLink con detección de ruta activa
function NavLink({ href, active, children }) {
    const classes = active
        ? 'inline-flex items-center px-1 pt-1 border-b-2 border-indigo-500 text-sm font-medium leading-5 text-gray-900 focus:outline-none focus:border-indigo-700 transition duration-150 ease-in-out'
        : 'inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium leading-5 text-gray-500 hover:text-gray-700 hover:border-gray-300 focus:outline-none focus:text-gray-700 focus:border-gray-300 transition duration-150 ease-in-out';

    return (
        <Link href={href} className={classes}>
            {children}
        </Link>
    );
}

export default function AdminLayout({ user, auth, header, children }) {
    const { url } = usePage();
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const [showTimeoutWarning, setShowTimeoutWarning] = useState(false);

    // Aceptar tanto user como auth.user para compatibilidad
    const currentUser = user || (auth && auth.user);

    // Función para verificar si la ruta está activa
    const route = () => ({
        current: (name) => {
            if (name === 'admin.dashboard') {
                return url === '/admin/dashboard' || url === '/admin';
            }
            if (name === 'admin.usuarios.*') {
                return url.startsWith('/admin/usuarios');
            }
            if (name === 'admin.departamentos.*') {
                return url.startsWith('/admin/departamentos');
            }
            if (name === 'admin.ventas.*') {
                return url.startsWith('/admin/ventas');
            }
            if (name === 'admin.reportes.*') {
                return url.startsWith('/admin/reportes');
            }
            return false;
        }
    });

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

    // Generar breadcrumbs basado en la URL
    const getBreadcrumbs = () => {
        const segments = url.split('/').filter(Boolean);
        const breadcrumbs = [];

        if (segments[0] === 'admin') {
            breadcrumbs.push({ name: 'Dashboard', href: '/admin/dashboard' });

            if (segments[1]) {
                const sectionNames = {
                    'usuarios': 'Usuarios',
                    'departamentos': 'Propiedades',
                    'ventas': 'Ventas',
                    'reportes': 'Reportes',
                    'perfil': 'Mi Perfil',
                    'configuracion': 'Configuración',
                    'actividades': 'Actividades'
                };

                const sectionName = sectionNames[segments[1]] || segments[1];
                breadcrumbs.push({ name: sectionName, href: `/admin/${segments[1]}` });

                if (segments[2] === 'crear') {
                    breadcrumbs.push({ name: 'Crear', href: null });
                } else if (segments[2] && segments[2] !== 'index') {
                    breadcrumbs.push({ name: 'Detalle', href: null });
                }
            }
        }

        return breadcrumbs;
    };

    const breadcrumbs = getBreadcrumbs();

    const logout = (e) => {
        if (e) e.preventDefault();
        router.post('/logout', {}, {
            onSuccess: () => {
                window.location.href = '/';
            },
            onError: () => {
                // Forzar recarga incluso si hay error
                window.location.href = '/';
            }
        });
    };

    // Temporizador de cierre de sesión DESACTIVADO - Sin límite de tiempo
    useEffect(() => {
        /* TEMPORIZADOR DESACTIVADO
        // Aviso 1 minuto antes
        const warningTimer = setTimeout(() => {
            setShowTimeoutWarning(true);
        }, 840000); // 14 minutos
        // Logout real
        const timer = setTimeout(() => {
            logout();
        }, 900000); // 15 minutos
        return () => {
            clearTimeout(timer);r);
            // clearTimeout(warningTimer);
        };
        */
    }, []);

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Modal de aviso de cierre de sesión */}
            {showTimeoutWarning && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                    <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                        <h2 className="text-lg font-bold mb-2">Sesión por expirar</h2>
                        <p className="mb-4">Por seguridad, tu sesión se cerrará en 1 minuto por inactividad.</p>
                        <button className="px-4 py-2 bg-indigo-600 text-white rounded" onClick={() => { setShowTimeoutWarning(false); window.location.reload(); }}>Seguir conectado</button>
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
                                <Link href="/admin/dashboard" className="flex items-center cursor-pointer hover:opacity-80 transition-opacity">
                                    <div className="w-8 h-8 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-lg flex items-center justify-center shadow-sm">
                                        <span className="text-white font-bold text-sm">A</span>
                                    </div>
                                    <span className="ml-2 text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Admin Panel</span>
                                </Link>
                            </div>

                            {/* Navegación Principal */}
                            <div className="hidden space-x-8 sm:-my-px sm:ml-10 sm:flex">
                                <NavLink
                                    href="/admin/usuarios"
                                    active={route().current('admin.usuarios.*')}
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                    Usuarios
                                </NavLink>

                                <NavLink
                                    href="/admin/departamentos"
                                    active={route().current('admin.departamentos.*')}
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                    Propiedades
                                </NavLink>

                                <NavLink
                                    href="/admin/ventas"
                                    active={route().current('admin.ventas.*')}
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                    </svg>
                                    Ventas
                                </NavLink>

                                <NavLink
                                    href="/admin/reportes"
                                    active={route().current('admin.reportes.*')}
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                    Reportes
                                </NavLink>
                            </div>
                        </div>

                        {/* Configuraciones del Usuario */}
                        <div className="hidden sm:flex sm:items-center sm:ml-6">
                            {/* Dropdown del Perfil */}
                            <div className="relative profile-dropdown-container">
                                <div>
                                    <button
                                        type="button"
                                        className="bg-white flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-sm hover:shadow-md transition-shadow"
                                        onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                                    >
                                        <span className="sr-only">Abrir menú de usuario</span>
                                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center">
                                            <span className="text-white font-bold text-sm">
                                                A
                                            </span>
                                        </div>
                                    </button>
                                </div>

                                {showProfileDropdown && (
                                    <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                                        <div className="px-4 py-2 text-xs text-gray-500 border-b">
                                            Administrador
                                        </div>
                                        <div className="px-4 py-2 text-sm text-gray-700 border-b">
                                            <div className="font-medium">{currentUser?.name}</div>
                                            <div className="text-gray-500">{currentUser?.email}</div>
                                        </div>

                                        <Link
                                            href="/admin/perfil"
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            onClick={() => setShowProfileDropdown(false)}
                                        >
                                            <svg className="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            Mi Perfil
                                        </Link>

                                        {/* Configuración - Ocultado temporalmente */}
                                        {/* <Link
                                            href="/admin/configuracion"
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            onClick={() => setShowProfileDropdown(false)}
                                        >
                                            <svg className="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            Configuración
                                        </Link> */}

                                        <div className="border-t">
                                            <button
                                                onClick={logout}
                                                className="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                                            >
                                                <svg className="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                </svg>
                                                Cerrar Sesión
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Hamburger (móvil) */}
                        <div className="-mr-2 flex items-center sm:hidden">
                            <button
                                onClick={() => setShowingNavigationDropdown(!showingNavigationDropdown)}
                                className="inline-flex items-center justify-center p-3 rounded-lg text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 focus:outline-none focus:bg-indigo-50 focus:text-indigo-600 transition duration-150 ease-in-out shadow-sm border border-gray-200"
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
                            href="/admin/usuarios"
                            className={`flex items-center pl-3 pr-4 py-3 border-l-4 text-base font-medium transition duration-150 ease-in-out ${
                                url.startsWith('/admin/usuarios')
                                    ? 'border-indigo-500 text-indigo-700 bg-indigo-50 focus:outline-none focus:text-indigo-800 focus:bg-indigo-100 focus:border-indigo-700'
                                    : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:text-gray-800 focus:bg-gray-50 focus:border-gray-300'
                            }`}
                        >
                            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                            Usuarios
                        </Link>
                        <Link
                            href="/admin/departamentos"
                            className={`flex items-center pl-3 pr-4 py-3 border-l-4 text-base font-medium transition duration-150 ease-in-out ${
                                url.startsWith('/admin/departamentos')
                                    ? 'border-indigo-500 text-indigo-700 bg-indigo-50 focus:outline-none focus:text-indigo-800 focus:bg-indigo-100 focus:border-indigo-700'
                                    : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:text-gray-800 focus:bg-gray-50 focus:border-gray-300'
                            }`}
                        >
                            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            Propiedades
                        </Link>
                        <Link
                            href="/admin/ventas"
                            className={`flex items-center pl-3 pr-4 py-3 border-l-4 text-base font-medium transition duration-150 ease-in-out ${
                                url.startsWith('/admin/ventas')
                                    ? 'border-indigo-500 text-indigo-700 bg-indigo-50 focus:outline-none focus:text-indigo-800 focus:bg-indigo-100 focus:border-indigo-700'
                                    : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:text-gray-800 focus:bg-gray-50 focus:border-gray-300'
                            }`}
                        >
                            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                            Ventas
                        </Link>
                        <Link
                            href="/admin/reportes"
                            className={`flex items-center pl-3 pr-4 py-3 border-l-4 text-base font-medium transition duration-150 ease-in-out ${
                                url.startsWith('/admin/reportes')
                                    ? 'border-indigo-500 text-indigo-700 bg-indigo-50 focus:outline-none focus:text-indigo-800 focus:bg-indigo-100 focus:border-indigo-700'
                                    : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:text-gray-800 focus:bg-gray-50 focus:border-gray-300'
                            }`}
                        >
                            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                            Reportes
                        </Link>
                    </div>

                    {/* Usuario responsive */}
                    <div className="pt-4 pb-3 border-t border-gray-200 bg-gray-50">
                        <div className="px-4 py-3 bg-white border-b border-gray-200">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                                        <span className="text-white font-bold text-lg">A</span>
                                    </div>
                                </div>
                                <div className="ml-3">
                                    <div className="font-medium text-base text-gray-800">{currentUser?.name}</div>
                                    <div className="text-sm text-gray-500">{currentUser?.email}</div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-3 space-y-1 px-2">
                            <Link
                                href="/admin/perfil"
                                className="flex items-center px-3 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 focus:outline-none focus:text-indigo-600 focus:bg-indigo-50 transition duration-150 ease-in-out"
                            >
                                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                Mi Perfil
                            </Link>
                            {/* Configuración - Ocultado temporalmente */}
                            {/* <Link
                                href="/admin/configuracion"
                                className="flex items-center px-3 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 focus:outline-none focus:text-indigo-600 focus:bg-indigo-50 transition duration-150 ease-in-out"
                            >
                                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                Configuración
                            </Link> */}
                            <button
                                onClick={logout}
                                className="flex items-center w-full px-3 py-3 rounded-lg text-base font-medium text-red-600 hover:text-red-700 hover:bg-red-50 focus:outline-none focus:text-red-700 focus:bg-red-50 transition duration-150 ease-in-out"
                            >
                                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                Cerrar Sesión
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Breadcrumbs */}
            {breadcrumbs.length > 1 && (
                <div className="bg-white border-b">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <nav className="flex py-3 text-sm" aria-label="Breadcrumb">
                            <ol className="inline-flex items-center space-x-1 md:space-x-3">
                                {breadcrumbs.map((crumb, index) => (
                                    <li key={index} className="inline-flex items-center">
                                        {index > 0 && (
                                            <svg className="w-3 h-3 text-gray-400 mx-1" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                            </svg>
                                        )}
                                        {crumb.href ? (
                                            <Link
                                                href={crumb.href}
                                                className="inline-flex items-center text-gray-700 hover:text-indigo-600 transition-colors"
                                            >
                                                {crumb.name}
                                            </Link>
                                        ) : (
                                            <span className="text-gray-500">{crumb.name}</span>
                                        )}
                                    </li>
                                ))}
                            </ol>
                        </nav>
                    </div>
                </div>
            )}

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
