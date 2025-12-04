import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AsesorLayout from '@/Layouts/AsesorLayout';
import Card from '@/Components/DS/Card';
import Button from '@/Components/DS/Button';
import Badge from '@/Components/DS/Badge';

export default function Dashboard({ auth, estadisticas = {}, clientesRecientes = [], cotizacionesRecientes = [] }) {
    const menuItems = [
        {
            title: 'Solicitudes de Contacto',
            description: 'Gestionar y responder solicitudes de clientes',
            icon: <svg className="w-7 h-7 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
            href: '/asesor/solicitudes',
            iconBg: 'bg-primary-50',
            count: estadisticas.solicitudes_pendientes || 0,
            countLabel: 'pendientes',
            badgeVariant: 'primary'
        },
        {
            title: 'Cotizaciones',
            description: 'Crear y gestionar cotizaciones de departamentos',
            icon: <svg className="w-7 h-7 text-success-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>,
            href: '/asesor/cotizaciones',
            iconBg: 'bg-success-50',
            count: estadisticas.cotizaciones_activas || 0,
            countLabel: 'pendientes',
            badgeVariant: 'success'
        },
        {
            title: 'Reservas',
            description: 'Crear y gestionar reservas de departamentos',
            icon: <svg className="w-7 h-7 text-warning-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>,
            href: '/asesor/reservas',
            iconBg: 'bg-warning-50',
            count: estadisticas.reservas_pendientes || 0,
            countLabel: 'pendientes',
            badgeVariant: 'warning'
        },
        {
            title: 'Ventas',
            description: 'Formalizar ventas y gestionar documentación',
            icon: <svg className="w-7 h-7 text-info-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
            href: '/asesor/ventas',
            iconBg: 'bg-info-50',
            count: estadisticas.ventas_mes || 0,
            countLabel: 'pendientes',
            badgeVariant: 'info'
        },
        {
            title: 'Clientes',
            description: 'Gestionar base de datos de clientes',
            icon: <svg className="w-7 h-7 text-secondary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
            href: '/asesor/clientes',
            iconBg: 'bg-secondary-50',
            count: estadisticas.clientes_activos || 0,
            countLabel: 'pendientes',
            badgeVariant: 'secondary'
        }
    ];

    return (
        <AsesorLayout user={auth.user}>
            <Head title="Dashboard - Asesor Inmobiliaria Imperial Cusco" />

            <div className="py-12 bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Banner de bienvenida */}
                    <div className="bg-gradient-to-r from-primary-700 to-primary-900 overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="p-4 sm:p-6 text-white">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="w-12 h-12 bg-white bg-opacity-10 rounded-full flex items-center justify-center">
                                            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <h2 className="text-xl sm:text-2xl font-bold">¡Bienvenido, {auth.user?.name}!</h2>
                                        <p className="text-white text-opacity-80 text-xs sm:text-sm">Gestiona tus actividades diarias como asesor inmobiliario</p>
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
                        <Card className="border-l-4 border-primary-500">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center">
                                        <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                        </Card>

                        <Card className="border-l-4 border-success-500">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 bg-success-50 rounded-lg flex items-center justify-center">
                                        <svg className="w-6 h-6 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                        </Card>

                        <Card className="border-l-4 border-warning-500">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 bg-warning-50 rounded-lg flex items-center justify-center">
                                        <svg className="w-6 h-6 text-warning-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                        </Card>

                        <Card className="border-l-4 border-info-500">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 bg-info-50 rounded-lg flex items-center justify-center">
                                        <svg className="w-6 h-6 text-info-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                        </Card>
                    </div>

                    {/* Menu principal */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {menuItems.map((item, index) => (
                            <Link
                                key={index}
                                href={item.href}
                                className="group block"
                            >
                                <Card className="h-full hover:shadow-md transition-all duration-200 border border-gray-100 group-hover:border-primary-200">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center space-x-4">
                                            <div className={`flex-shrink-0 w-14 h-14 ${item.iconBg} rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-200`}>
                                                {item.icon}
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-700 transition-colors">
                                                    {item.title}
                                                </h3>
                                                <p className="text-sm text-gray-500 mt-1">
                                                    {item.description}
                                                </p>
                                            </div>
                                        </div>
                                        {item.count > 0 && (
                                            <div className="flex-shrink-0">
                                                <Badge variant={item.badgeVariant} className="w-8 h-8 flex items-center justify-center rounded-full">
                                                    {item.count}
                                                </Badge>
                                            </div>
                                        )}
                                    </div>
                                </Card>
                            </Link>
                        ))}
                    </div>

                    {/* Información de rendimiento */}
                    <Card className="mt-8 mb-8">
                        <h2 className="text-xl font-bold mb-4">Tu rendimiento del mes</h2>
                        <div className="bg-gray-100 h-4 rounded-full overflow-hidden">
                            <div className="bg-gradient-to-r from-success-400 to-success-600 h-4 rounded-full" style={{ width: '75%' }}></div>
                        </div>
                        <div className="flex justify-between mt-2 text-sm text-gray-600">
                            <span>Meta mensual: 75%</span>
                            <span className="font-medium">¡Excelente progreso!</span>
                        </div>
                    </Card>

                    {/* Acciones rápidas */}
                    <Card>
                        <h2 className="text-lg font-medium text-gray-900 mb-4">Acciones Rápidas</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Button
                                href={route('asesor.cotizaciones.crear')}
                                variant="success"
                                className="w-full justify-center"
                            >
                                Nueva Cotización
                            </Button>
                            <Button
                                href={route('asesor.reservas.crear')}
                                variant="warning"
                                className="w-full justify-center"
                            >
                                Nueva Reserva
                            </Button>
                            <Button
                                href={route('asesor.ventas.crear')}
                                variant="info"
                                className="w-full justify-center"
                            >
                                Nueva Venta
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        </AsesorLayout>
    );
}
