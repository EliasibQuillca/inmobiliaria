import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AsesorLayout from '../../Layouts/AsesorLayout';

export default function Dashboard({ auth, estadisticas = {}, clientesRecientes = [], cotizacionesRecientes = [] }) {
    const menuItems = [
        {
            title: 'Solicitudes de Contacto',
            description: 'Gestionar y responder solicitudes de clientes',
            icon: '📧',
            href: '/asesor/solicitudes',
            color: 'bg-blue-500',
            count: estadisticas.solicitudes_pendientes || 0
        },
        {
            title: 'Cotizaciones',
            description: 'Crear y gestionar cotizaciones de departamentos',
            icon: '💰',
            href: '/asesor/cotizaciones',
            color: 'bg-green-500',
            count: estadisticas.cotizaciones_activas || 0
        },
        {
            title: 'Reservas',
            description: 'Crear y gestionar reservas de departamentos',
            icon: '📋',
            href: '/asesor/reservas',
            color: 'bg-yellow-500',
            count: estadisticas.reservas_pendientes || 0
        },
        {
            title: 'Ventas',
            description: 'Formalizar ventas y gestionar documentación',
            icon: '🏡',
            href: '/asesor/ventas',
            color: 'bg-purple-500',
            count: estadisticas.ventas_mes || 0
        },
        {
            title: 'Clientes',
            description: 'Gestionar base de datos de clientes',
            icon: '👥',
            href: '/asesor/clientes',
            color: 'bg-indigo-500',
            count: estadisticas.clientes_activos || 0
        }
    ];

    return (
        <AsesorLayout user={auth.user}>
            <Head title="Dashboard - Asesor" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Bienvenida */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-8">
                        <div className="p-6 text-gray-900">
                            <h1 className="text-3xl font-bold mb-2">
                                ¡Bienvenido, {auth.user?.name}!
                            </h1>
                            <p className="text-gray-600">
                                Gestiona tus actividades diarias como asesor inmobiliario
                            </p>
                        </div>
                    </div>

                    {/* Estadísticas rápidas */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                            <span className="text-white text-sm">📧</span>
                                        </div>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">
                                                Solicitudes Pendientes
                                            </dt>
                                            <dd className="text-lg font-medium text-gray-900">
                                                {estadisticas.solicitudes_pendientes || 0}
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                            <span className="text-white text-sm">💰</span>
                                        </div>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">
                                                Cotizaciones Activas
                                            </dt>
                                            <dd className="text-lg font-medium text-gray-900">
                                                {estadisticas.cotizaciones_activas || 0}
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                                            <span className="text-white text-sm">📋</span>
                                        </div>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">
                                                Reservas Activas
                                            </dt>
                                            <dd className="text-lg font-medium text-gray-900">
                                                {estadisticas.reservas_activas || 0}
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                                            <span className="text-white text-sm">🏡</span>
                                        </div>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">
                                                Ventas Este Mes
                                            </dt>
                                            <dd className="text-lg font-medium text-gray-900">
                                                {estadisticas.ventas_mes || 0}
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Menu principal */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {menuItems.map((item, index) => (
                            <Link
                                key={index}
                                href={item.href}
                                className="group bg-white overflow-hidden shadow-sm sm:rounded-lg hover:shadow-lg transition-shadow duration-300"
                            >
                                <div className="p-6">
                                    <div className="flex items-center">
                                        <div className={`flex-shrink-0 w-12 h-12 ${item.color} rounded-lg flex items-center justify-center text-white text-xl group-hover:scale-110 transition-transform duration-300`}>
                                            {item.icon}
                                        </div>
                                        <div className="ml-4 flex-1">
                                            <h3 className="text-lg font-medium text-gray-900 group-hover:text-blue-600">
                                                {item.title}
                                            </h3>
                                            <p className="text-sm text-gray-500 mt-1">
                                                {item.description}
                                            </p>
                                            {item.count > 0 && (
                                                <div className="mt-2">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                        {item.count} pendientes
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="ml-4">
                                            <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Acciones rápidas */}
                    <div className="mt-8 bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h2 className="text-lg font-medium text-gray-900 mb-4">Acciones Rápidas</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Link
                                    href="/asesor/cotizaciones/crear"
                                    className="inline-flex items-center px-4 py-2 bg-green-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-green-700 active:bg-green-900 focus:outline-none focus:border-green-900 focus:ring ring-green-300 transition ease-in-out duration-150"
                                >
                                    Nueva Cotización
                                </Link>
                                <Link
                                    href="/asesor/reservas/crear"
                                    className="inline-flex items-center px-4 py-2 bg-yellow-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-yellow-700 active:bg-yellow-900 focus:outline-none focus:border-yellow-900 focus:ring ring-yellow-300 transition ease-in-out duration-150"
                                >
                                    Nueva Reserva
                                </Link>
                                <Link
                                    href="/asesor/ventas/crear"
                                    className="inline-flex items-center px-4 py-2 bg-purple-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-purple-700 active:bg-purple-900 focus:outline-none focus:border-purple-900 focus:ring ring-purple-300 transition ease-in-out duration-150"
                                >
                                    Nueva Venta
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AsesorLayout>
    );
}
