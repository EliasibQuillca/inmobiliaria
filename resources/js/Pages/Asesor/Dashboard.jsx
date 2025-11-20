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
            color: 'bg-blue-600',
            iconBg: 'bg-blue-100',
            count: estadisticas.solicitudes_pendientes || 0,
            countLabel: 'pendientes'
        },
        {
            title: 'Cotizaciones',
            description: 'Crear y gestionar cotizaciones de departamentos',
            icon: '💰',
            href: '/asesor/cotizaciones',
            color: 'bg-emerald-600',
            iconBg: 'bg-emerald-100',
            count: estadisticas.cotizaciones_activas || 0,
            countLabel: 'pendientes'
        },
        {
            title: 'Reservas',
            description: 'Crear y gestionar reservas de departamentos',
            icon: '📋',
            href: '/asesor/reservas',
            color: 'bg-amber-600',
            iconBg: 'bg-amber-100',
            count: estadisticas.reservas_pendientes || 0,
            countLabel: 'pendientes'
        },
        {
            title: 'Ventas',
            description: 'Formalizar ventas y gestionar documentación',
            icon: '🏡',
            href: '/asesor/ventas',
            color: 'bg-purple-600',
            iconBg: 'bg-purple-100',
            count: estadisticas.ventas_mes || 0,
            countLabel: 'pendientes'
        },
        {
            title: 'Clientes',
            description: 'Gestionar base de datos de clientes',
            icon: '👥',
            href: '/asesor/clientes',
            color: 'bg-slate-600',
            iconBg: 'bg-slate-100',
            count: estadisticas.clientes_activos || 0,
            countLabel: 'pendientes'
        }
    ];

    return (
        <AsesorLayout user={auth.user}>
            <Head title="Dashboard - Asesor Inmobiliaria" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Banner de bienvenida */}
                    <div className="bg-gradient-to-r from-slate-700 to-slate-900 overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6 text-white">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="w-12 h-12 bg-white bg-opacity-10 rounded-full flex items-center justify-center">
                                            <span className="text-2xl">👋</span>
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <h2 className="text-2xl font-bold">¡Bienvenido, {auth.user?.name}!</h2>
                                        <p className="text-white text-opacity-80 text-sm">Gestiona tus actividades diarias como asesor inmobiliario</p>
                                    </div>
                                </div>
                                <div>
                                    <Link
                                        href={route('asesor.perfil')}
                                        className="px-4 py-2 bg-white bg-opacity-10 hover:bg-opacity-20 text-white text-sm rounded-lg transition-colors inline-flex items-center"
                                    >
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        Configurar Perfil
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Estadísticas rápidas */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg border-l-4 border-blue-500">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">
                                                Solicitudes Pendientes
                                            </dt>
                                            <dd className="text-2xl font-semibold text-gray-900">
                                                {estadisticas.solicitudes_pendientes || 0}
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg border-l-4 border-emerald-500">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center">
                                            <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">
                                                Cotizaciones Activas
                                            </dt>
                                            <dd className="text-2xl font-semibold text-gray-900">
                                                {estadisticas.cotizaciones_activas || 0}
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg border-l-4 border-amber-500">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="w-12 h-12 bg-amber-50 rounded-lg flex items-center justify-center">
                                            <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">
                                                Reservas Activas
                                            </dt>
                                            <dd className="text-2xl font-semibold text-gray-900">
                                                {estadisticas.reservas_activas || 0}
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg border-l-4 border-purple-500">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                                            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">
                                                Ventas Este Mes
                                            </dt>
                                            <dd className="text-2xl font-semibold text-gray-900">
                                                {estadisticas.ventas_mes || 1}
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
                                className="group bg-white overflow-hidden shadow-sm sm:rounded-lg hover:shadow-md transition-all duration-200 border border-gray-100"
                            >
                                <div className="p-6">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center space-x-4">
                                            <div className={`flex-shrink-0 w-14 h-14 ${item.iconBg} rounded-xl flex items-center justify-center text-2xl group-hover:scale-105 transition-transform duration-200`}>
                                                {item.icon}
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-slate-700 transition-colors">
                                                    {item.title}
                                                </h3>
                                                <p className="text-sm text-gray-500 mt-1">
                                                    {item.description}
                                                </p>
                                            </div>
                                        </div>
                                        {item.count > 0 && (
                                            <div className="flex-shrink-0">
                                                <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${item.color} text-white`}>
                                                    {item.count}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Información de rendimiento */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-8">
                        <div className="p-6">
                            <h2 className="text-xl font-bold mb-4">Tu rendimiento del mes</h2>
                            <div className="bg-gray-100 h-4 rounded-full overflow-hidden">
                                <div className="bg-gradient-to-r from-green-400 to-green-600 h-4 rounded-full" style={{ width: '75%' }}></div>
                            </div>
                            <div className="flex justify-between mt-2 text-sm text-gray-600">
                                <span>Meta mensual: 75%</span>
                                <span className="font-medium">¡Excelente progreso!</span>
                            </div>
                        </div>
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
