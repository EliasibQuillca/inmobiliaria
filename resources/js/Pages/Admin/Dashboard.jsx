import { Head, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function AdminDashboard({ auth, estadisticas, crecimiento, actividadesRecientes, rendimiento }) {
    // Formatear moneda
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('es-PE', {
            style: 'currency',
            currency: 'PEN'
        }).format(amount);
    };

    // Formatear porcentaje de crecimiento
    const formatGrowth = (percentage) => {
        const sign = percentage >= 0 ? '+' : '';
        return `${sign}${percentage}%`;
    };

    // Obtener color para el crecimiento
    const getGrowthColor = (percentage) => {
        if (percentage > 0) return 'text-green-600';
        if (percentage < 0) return 'text-red-600';
        return 'text-gray-600';
    };

    return (
        <AdminLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                            Panel de Administración
                        </h2>
                        <p className="text-sm text-gray-600">
                            Bienvenido de vuelta, {auth.user.name}
                        </p>
                    </div>
                    <div className="text-sm text-gray-500">
                        {new Date().toLocaleDateString('es-ES', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </div>
                </div>
            }
        >
            <Head title="Panel de Administración" />

            <div className="py-12 bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">

                    {/* Tarjetas de Estadísticas Principales */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

                        {/* Total Usuarios */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Total Usuarios</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-2">{estadisticas?.totalUsuarios || 0}</p>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-2 ${
                                        crecimiento?.usuarios >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                    }`}>
                                        {formatGrowth(crecimiento?.usuarios || 0)} este mes
                                    </span>
                                </div>
                                <div className="p-3 bg-blue-100 rounded-full">
                                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Propiedades Activas */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Propiedades Activas</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-2">{estadisticas?.propiedadesActivas || 0}</p>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-2 ${
                                        crecimiento?.propiedades >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                    }`}>
                                        {formatGrowth(crecimiento?.propiedades || 0)} este mes
                                    </span>
                                </div>
                                <div className="p-3 bg-green-100 rounded-full">
                                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Ventas del Mes */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Ventas del Mes</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-2">{estadisticas?.ventasDelMes || 0}</p>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-2 ${
                                        crecimiento?.ventas >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                    }`}>
                                        {formatGrowth(crecimiento?.ventas || 0)} vs mes anterior
                                    </span>
                                </div>
                                <div className="p-3 bg-purple-100 rounded-full">
                                    <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Ingresos del Mes */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Ingresos del Mes</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-2">{formatCurrency(estadisticas?.ingresosDelMes || 0)}</p>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-2 ${
                                        crecimiento?.ingresos >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                    }`}>
                                        {formatGrowth(crecimiento?.ingresos || 0)} vs mes anterior
                                    </span>
                                </div>
                                <div className="p-3 bg-yellow-100 rounded-full">
                                    <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Estadísticas Secundarias */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

                        {/* Asesores Activos */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center">
                                <div className="p-2 bg-indigo-100 rounded-lg">
                                    <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Asesores Activos</p>
                                    <p className="text-2xl font-bold text-gray-900">{estadisticas?.asesoresActivos || 0}</p>
                                </div>
                            </div>
                        </div>

                        {/* Clientes Nuevos */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Clientes Nuevos</p>
                                    <p className="text-2xl font-bold text-gray-900">{estadisticas?.clientesNuevos || 0}</p>
                                </div>
                            </div>
                        </div>

                        {/* Reservas Activas */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center">
                                <div className="p-2 bg-orange-100 rounded-lg">
                                    <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Reservas Activas</p>
                                    <p className="text-2xl font-bold text-gray-900">{estadisticas?.reservasActivas || 0}</p>
                                </div>
                            </div>
                        </div>

                        {/* Comisiones Pendientes */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center">
                                <div className="p-2 bg-red-100 rounded-lg">
                                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Comisiones Pendientes</p>
                                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(estadisticas?.comisionesPendientes || 0)}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Área Principal de Contenido */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* Actividades Recientes */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                                <div className="px-6 py-4 border-b border-gray-200">
                                    <h3 className="text-lg font-semibold text-gray-900">Actividad Reciente</h3>
                                    <p className="text-sm text-gray-600">Últimas actividades en el sistema</p>
                                </div>
                                <div className="p-6">
                                    <div className="space-y-4">
                                        {actividadesRecientes && actividadesRecientes.length > 0 ? (
                                            actividadesRecientes.map((actividad, index) => (
                                                <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                                    <div className="flex-shrink-0">
                                                        <span className="text-2xl">
                                                            {actividad.tipo === 'venta' ? '💰' : 
                                                             actividad.tipo === 'usuario' ? '👤' : 
                                                             actividad.tipo === 'propiedad' ? '🏠' : '📅'}
                                                        </span>
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-gray-900">{actividad.titulo}</p>
                                                        <p className="text-sm text-gray-600">{actividad.descripcion}</p>
                                                        <p className="text-xs text-gray-500 mt-1">{actividad.tiempo}</p>
                                                        {actividad.monto && (
                                                            <p className="text-xs text-green-600 font-medium">
                                                                {formatCurrency(actividad.monto)}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                        actividad.tag === 'venta' ? 'bg-green-100 text-green-800' :
                                                        actividad.tag === 'usuario' ? 'bg-blue-100 text-blue-800' :
                                                        actividad.tag === 'propiedad' ? 'bg-purple-100 text-purple-800' :
                                                        'bg-orange-100 text-orange-800'
                                                    }`}>
                                                        {actividad.tag || actividad.tipo}
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-8">
                                                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                                </svg>
                                                <h3 className="mt-2 text-sm font-medium text-gray-900">Sin actividades recientes</h3>
                                                <p className="mt-1 text-sm text-gray-500">
                                                    Cuando hay nueva actividad aparecerá aquí
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="mt-6">
                                        <Link
                                            href="/admin/actividades"
                                            className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                                        >
                                            Ver todas las actividades
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Panel de Acciones Rápidas */}
                        <div className="space-y-6">

                            {/* Acciones Rápidas */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                                <div className="px-6 py-4 border-b border-gray-200">
                                    <h3 className="text-lg font-semibold text-gray-900">Acciones Rápidas</h3>
                                </div>
                                <div className="p-6 space-y-3">
                                    <Link
                                        href="/admin/usuarios/create"
                                        className="w-full flex items-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                        Nuevo Usuario
                                    </Link>

                                    <Link
                                        href="/admin/propiedades/create"
                                        className="w-full flex items-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                    >
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                        </svg>
                                        Nueva Propiedad
                                    </Link>

                                    <Link
                                        href="/admin/reportes"
                                        className="w-full flex items-center px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                                    >
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                        </svg>
                                        Ver Reportes
                                    </Link>
                                </div>
                            </div>

                            {/* Resumen de Estado */}
                            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-sm text-white">
                                <div className="px-6 py-4">
                                    <h3 className="text-lg font-semibold">Estado del Sistema</h3>
                                    <div className="mt-4 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm">Rendimiento</span>
                                            <span className="text-sm font-medium">{rendimiento || 'Excelente'}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm">Total Propiedades</span>
                                            <span className="text-sm font-medium">{estadisticas?.propiedadesActivas || 0}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm">Total Usuarios</span>
                                            <span className="text-sm font-medium">{estadisticas?.totalUsuarios || 0}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Acceso al Frontend */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                                <div className="px-6 py-4 border-b border-gray-200">
                                    <h3 className="text-lg font-semibold text-gray-900">Acceso Rápido</h3>
                                </div>
                                <div className="p-6 space-y-3">
                                    <Link
                                        href="/"
                                        target="_blank"
                                        className="w-full flex items-center px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                                    >
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                        Ver Frontend
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
