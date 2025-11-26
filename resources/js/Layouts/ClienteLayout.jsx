import { useState, useEffect } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';

export default function ClienteLayout({ children, header }) {
    const { auth, flash, url } = usePage().props;
    const currentUrl = usePage().url;
    const user = auth.user;
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const [showTimeoutWarning, setShowTimeoutWarning] = useState(false);
    const [notifications, setNotifications] = useState([]);

    const logout = () => {
        router.post('/logout');
    };

    // Sistema de notificaciones automático
    useEffect(() => {
        if (flash.message) {
            setNotifications(prev => [...prev, {
                id: Date.now(),
                message: flash.message,
                type: flash.type || 'success'
            }]);
        }
    }, [flash]);

    // Auto-eliminar notificaciones
    useEffect(() => {
        notifications.forEach(notification => {
            setTimeout(() => {
                setNotifications(prev => prev.filter(n => n.id !== notification.id));
            }, 5000);
        });
    }, [notifications]);

    // Temporizador de sesión
    useEffect(() => {
        const warningTimer = setTimeout(() => {
            setShowTimeoutWarning(true);
        }, 1770000); // 29.5 minutos

        const logoutTimer = setTimeout(() => {
            logout();
        }, 1800000); // 30 minutos

        return () => {
            clearTimeout(warningTimer);
            clearTimeout(logoutTimer);
        };
    }, []);

    // Helper para verificar si la ruta está activa
    const isActive = (path) => {
        if (path.endsWith('*')) {
            const basePath = path.slice(0, -1);
            return currentUrl.startsWith(basePath);
        }
        return currentUrl === path;
    };

    const menuItems = [
        { 
            name: 'Dashboard', 
            href: '/cliente/dashboard', 
            icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z',
            active: isActive('/cliente/dashboard')
        },
        { 
            name: 'Explorar', 
            href: '/catalogo', 
            icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
            active: isActive('/catalogo*')
        },
        { 
            name: 'Favoritos', 
            href: '/cliente/favoritos', 
            icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
            active: isActive('/cliente/favoritos*')
        },
        { 
            name: 'Solicitudes', 
            href: '/cliente/solicitudes', 
            icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
            active: isActive('/cliente/solicitudes*')
        },
        { 
            name: 'Cotizaciones', 
            href: '/cliente/cotizaciones', 
            icon: 'M9 5H7a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-8a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
            active: isActive('/cliente/cotizaciones*')
        },
        { 
            name: 'Reservas', 
            href: '/cliente/reservas', 
            icon: 'M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 8v4a2 2 0 002 2h4a2 2 0 002-2v-4M8 7h8v4H8V7z',
            active: isActive('/cliente/reservas*')
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            {/* Notificaciones Toast */}
            <div className="fixed top-4 right-4 z-50 space-y-2">
                {notifications.map(notification => (
                    <div
                        key={notification.id}
                        className={`p-4 rounded-lg shadow-lg transform transition-all duration-300 ${
                            notification.type === 'success' 
                                ? 'bg-green-500 text-white' 
                                : notification.type === 'error'
                                ? 'bg-red-500 text-white'
                                : 'bg-blue-500 text-white'
                        }`}
                    >
                        <div className="flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            {notification.message}
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal de aviso de sesión */}
            {showTimeoutWarning && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-xl shadow-2xl p-8 text-center max-w-md mx-4">
                        <div className="w-16 h-16 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Sesión por expirar</h2>
                        <p className="text-gray-600 mb-6">
                            Por seguridad, tu sesión se cerrará en 30 segundos por inactividad.
                        </p>
                        <div className="flex space-x-4">
                            <button 
                                onClick={() => { setShowTimeoutWarning(false); window.location.reload(); }}
                                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Seguir conectado
                            </button>
                            <button 
                                onClick={logout}
                                className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                            >
                                Cerrar sesión
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Navegación principal */}
            <nav className="bg-white shadow-lg border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-20">
                        {/* Logo y navegación principal */}
                        <div className="flex">
                            <div className="flex-shrink-0 flex items-center">
                                <Link href="/cliente/dashboard">
                                    <ApplicationLogo className="h-12 w-auto text-blue-600" />
                                </Link>
                                <div className="ml-4">
                                    <h1 className="text-xl font-bold text-gray-900">Portal Cliente</h1>
                                    <p className="text-sm text-gray-500">Encuentra tu hogar ideal</p>
                                </div>
                            </div>

                            {/* Navegación desktop */}
                            <div className="hidden sm:ml-8 sm:flex sm:space-x-1">
                                {menuItems.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                                            item.active
                                                ? 'bg-blue-100 text-blue-700 shadow-sm'
                                                : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                                        }`}
                                    >
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                                        </svg>
                                        {item.name}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Perfil y configuraciones */}
                        <div className="hidden sm:flex sm:items-center sm:space-x-4">
                            {/* Botón de ayuda */}
                            <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </button>

                            {/* Dropdown del usuario */}
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <button className="flex items-center px-3 py-2 text-sm rounded-lg text-gray-700 hover:bg-gray-100 transition-colors">
                                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="text-left">
                                            <div className="font-medium">{user.name}</div>
                                            <div className="text-xs text-gray-500">Cliente</div>
                                        </div>
                                        <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                </Dropdown.Trigger>

                                <Dropdown.Content>
                                    <Dropdown.Link href="/cliente/perfil">
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        Mi Perfil
                                    </Dropdown.Link>
                                    <Dropdown.Link href="/cliente/asesores">
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                        Mis Asesores
                                    </Dropdown.Link>
                                    <hr className="my-2" />
                                    <Dropdown.Link href="/profile" method="get">
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        Configuración
                                    </Dropdown.Link>
                                    <Dropdown.Link href="/logout" method="post" as="button">
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                        </svg>
                                        Cerrar Sesión
                                    </Dropdown.Link>
                                </Dropdown.Content>
                            </Dropdown>
                        </div>

                        {/* Botón menú móvil */}
                        <div className="flex items-center sm:hidden">
                            <button
                                onClick={() => setShowingNavigationDropdown(!showingNavigationDropdown)}
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors"
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

                {/* Navegación móvil */}
                <div className={`${showingNavigationDropdown ? 'block' : 'hidden'} sm:hidden bg-white border-t border-gray-200`}>
                    <div className="px-4 py-2 space-y-1">
                        {menuItems.map((item) => (
                            <ResponsiveNavLink
                                key={item.name}
                                href={item.href}
                                active={item.active}
                                className="flex items-center"
                            >
                                <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                                </svg>
                                {item.name}
                            </ResponsiveNavLink>
                        ))}
                    </div>
                    
                    <div className="pt-4 pb-1 border-t border-gray-200">
                        <div className="px-4">
                            <div className="font-medium text-base text-gray-800">{user.name}</div>
                            <div className="font-medium text-sm text-gray-500">{user.email}</div>
                        </div>
                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink href="/cliente/perfil">Mi Perfil</ResponsiveNavLink>
                            <ResponsiveNavLink href="/profile">Configuración</ResponsiveNavLink>
                            <ResponsiveNavLink method="post" href="/logout" as="button">
                                Cerrar Sesión
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Header personalizable */}
            {header && (
                <header className="bg-white shadow-sm border-b border-gray-200">
                    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            {/* Contenido principal */}
            <main className="py-8">
                {children}
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-200 mt-auto">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-500">
                            © {new Date().getFullYear()} Inmobiliaria Imperial Cusco. Todos los derechos reservados.
                        </div>
                        <div className="flex space-x-4">
                            <Link href="/ayuda" className="text-sm text-gray-500 hover:text-blue-600">
                                Ayuda
                            </Link>
                            <Link href="/contacto" className="text-sm text-gray-500 hover:text-blue-600">
                                Contacto
                            </Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
