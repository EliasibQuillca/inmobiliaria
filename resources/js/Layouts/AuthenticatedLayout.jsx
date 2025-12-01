import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const { aprobacionesPendientes } = usePage().props;
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const [showTimeoutWarning, setShowTimeoutWarning] = useState(false);

    const logout = () => {
        router.post("/logout");
    };

    // Temporizador de cierre de sesión automático para cliente (30 minutos)
    useEffect(() => {
        // Aviso 30 segundos antes
        const warningTimer = setTimeout(() => {
            setShowTimeoutWarning(true);
        }, 1770000); // 29.5 minutos
        // Logout real
        const timer = setTimeout(() => {
            logout();
        }, 1800000); // 30 minutos
        return () => {
            clearTimeout(timer);
            clearTimeout(warningTimer);
        };
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Modal de aviso de cierre de sesión */}
            {showTimeoutWarning && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                    <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                        <h2 className="text-lg font-bold mb-2">Sesión por expirar</h2>
                        <p className="mb-4">Por seguridad, tu sesión se cerrará en 30 segundos por inactividad.</p>
                        <button className="px-4 py-2 bg-teal-600 text-white rounded" onClick={() => { setShowTimeoutWarning(false); window.location.reload(); }}>Seguir conectado</button>
                    </div>
                </div>
            )}

            <nav className="border-b border-gray-100 bg-white shadow-sm">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-20 justify-between">
                        <div className="flex">
                            <div className="flex shrink-0 items-center">
                                <Link href="/">
                                    <ApplicationLogo className="block h-10 w-auto text-teal-600" />
                                </Link>
                            </div>

                            <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                {user.role === 'asesor' ? (
                                    <>
                                        <NavLink
                                            href={"/asesor/dashboard"}
                                            active={route().current('asesor.dashboard')}
                                            className="text-gray-700 hover:text-teal-600"
                                        >
                                            Dashboard
                                        </NavLink>
                                        <NavLink
                                            href="/asesor/propiedades"
                                            className="text-gray-700 hover:text-teal-600"
                                        >
                                            Propiedades
                                        </NavLink>
                                        <NavLink
                                            href="/asesor/clientes"
                                            className="text-gray-700 hover:text-teal-600"
                                        >
                                            Clientes
                                        </NavLink>
                                        <NavLink
                                            href="/asesor/cotizaciones"
                                            className="text-gray-700 hover:text-teal-600"
                                        >
                                            Cotizaciones
                                        </NavLink>
                                        <NavLink
                                            href="/asesor/solicitudes"
                                            className="text-gray-700 hover:text-teal-600"
                                        >
                                            Solicitudes
                                        </NavLink>
                                    </>
                                ) : (
                                    <>
                                        <NavLink
                                            href={"/cliente/dashboard"}
                                            active={route().current('cliente.dashboard')}
                                            className="text-gray-700 hover:text-teal-600"
                                        >
                                            Dashboard
                                        </NavLink>
                                        <NavLink
                                            href="/cliente/catalogo"
                                            className="text-gray-700 hover:text-teal-600"
                                        >
                                            Propiedades
                                        </NavLink>
                                        <NavLink
                                            href="/cliente/favoritos"
                                            className="text-gray-700 hover:text-teal-600"
                                        >
                                            Favoritos
                                        </NavLink>
                                        <NavLink
                                            href="/cliente/solicitudes"
                                            className="text-gray-700 hover:text-teal-600"
                                        >
                                            Solicitudes
                                        </NavLink>
                                        <NavLink
                                            href="/cliente/aprobaciones"
                                            className="text-gray-700 hover:text-teal-600 relative"
                                        >
                                            Aprobaciones
                                            {aprobacionesPendientes > 0 && (
                                                <span className="absolute -top-2 -right-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                                                    {aprobacionesPendientes}
                                                </span>
                                            )}
                                        </NavLink>
                                        <NavLink
                                            href="/cliente/asesores"
                                            className="text-gray-700 hover:text-teal-600"
                                        >
                                            Asesores
                                        </NavLink>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="hidden sm:ms-6 sm:flex sm:items-center">
                            <div className="relative ms-3">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center rounded-md border border-transparent bg-white px-4 py-2 text-sm font-medium leading-4 text-gray-700 transition duration-150 ease-in-out hover:text-teal-600 focus:outline-none"
                                            >
                                                {user.name}

                                                <svg
                                                    className="-me-0.5 ms-2 h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content width="48" contentClasses="py-1 bg-white">
                                        <Dropdown.Link
                                            href={route('profile.edit')}
                                            className="hover:bg-gray-50"
                                        >
                                            Mi Perfil
                                        </Dropdown.Link>
                                        <Dropdown.Link
                                            href="#"
                                            className="hover:bg-gray-50"
                                        >
                                            Configuración
                                        </Dropdown.Link>
                                        <Dropdown.Link
                                            href={"/logout"}
                                            method="post"
                                            as="button"
                                            className="hover:bg-gray-50"
                                        >
                                            Cerrar Sesión
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() =>
                                    setShowingNavigationDropdown(
                                        (previousState) => !previousState,
                                    )
                                }
                                className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-gray-500 focus:bg-gray-100 focus:text-gray-500 focus:outline-none"
                            >
                                <svg
                                    className="h-6 w-6"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        className={
                                            !showingNavigationDropdown
                                                ? 'inline-flex'
                                                : 'hidden'
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={
                                            showingNavigationDropdown
                                                ? 'inline-flex'
                                                : 'hidden'
                                        }
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

                <div
                    className={
                        (showingNavigationDropdown ? 'block' : 'hidden') +
                        ' sm:hidden'
                    }
                >
                    <div className="space-y-1 pb-3 pt-2">
                        <ResponsiveNavLink
                            href={route('dashboard')}
                            active={route().current('dashboard')}
                        >
                            Dashboard
                        </ResponsiveNavLink>
                        <ResponsiveNavLink href="#">
                            Propiedades
                        </ResponsiveNavLink>
                        <ResponsiveNavLink href="#">
                            Clientes
                        </ResponsiveNavLink>
                        <ResponsiveNavLink href="#">
                            Ventas
                        </ResponsiveNavLink>
                        <ResponsiveNavLink href="#">
                            Reportes
                        </ResponsiveNavLink>
                    </div>

                    <div className="border-t border-gray-200 pb-1 pt-4">
                        <div className="px-4">
                            <div className="text-base font-medium text-gray-800">
                                {user.name}
                            </div>
                            <div className="text-sm font-medium text-gray-500">
                                {user.email}
                            </div>
                        </div>

                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink href={route('profile.edit')}>
                                Mi Perfil
                            </ResponsiveNavLink>
                            <ResponsiveNavLink href="#">
                                Configuración
                            </ResponsiveNavLink>
                            <ResponsiveNavLink
                                method="post"
                                href={"/logout"}
                                as="button"
                            >
                                Cerrar Sesión
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="bg-white shadow">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main className="py-6">{children}</main>
        </div>
    );
}
