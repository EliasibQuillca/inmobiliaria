import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Card from '@/Components/DS/Card';
import Button from '@/Components/DS/Button';
import Badge from '@/Components/DS/Badge';

export default function AdminDashboard({ auth, estadisticas, crecimiento, actividadesRecientes, rendimiento, debug }) {
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
                        <Card className="hover:shadow-md transition-shadow duration-300">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Total Usuarios</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-2">{estadisticas?.totalUsuarios || 0}</p>
                                    <div className="mt-2">
                                        <Badge variant={crecimiento?.usuarios >= 0 ? 'success' : 'danger'}>
                                            {formatGrowth(crecimiento?.usuarios || 0)} este mes
                                        </Badge>
                                    </div>
                                </div>
                                <div className="p-3 bg-primary-50 rounded-full">
                                    <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                </div>
                            </div>
                        </Card>

                        {/* Propiedades Activas */}
                        <Card className="hover:shadow-md transition-shadow duration-300">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Propiedades Activas</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-2">{estadisticas?.propiedadesActivas || 0}</p>
                                    <div className="mt-2">
                                        <Badge variant={crecimiento?.propiedades >= 0 ? 'success' : 'danger'}>
                                            {formatGrowth(crecimiento?.propiedades || 0)} este mes
                                        </Badge>
                                    </div>
                                </div>
                                <div className="p-3 bg-primary-50 rounded-full">
                                    <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                    </svg>
                                </div>
                            </div>
                        </Card>

                        {/* Ventas del Mes */}
                        <Card className="hover:shadow-md transition-shadow duration-300">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Ventas del Mes</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-2">{estadisticas?.ventasDelMes || 0}</p>
                                    <div className="mt-2">
                                        <Badge variant={crecimiento?.ventas >= 0 ? 'success' : 'danger'}>
                                            {formatGrowth(crecimiento?.ventas || 0)} vs mes anterior
                                        </Badge>
                                    </div>
                                </div>
                                <div className="p-3 bg-primary-50 rounded-full">
                                    <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                    </svg>
                                </div>
                            </div>
                        </Card>

                        {/* Ingresos del Mes */}
                        <Card className="hover:shadow-md transition-shadow duration-300">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Ingresos del Mes</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-2">{formatCurrency(estadisticas?.ingresosDelMes || 0)}</p>
                                    <div className="mt-2">
                                        <Badge variant={crecimiento?.ingresos >= 0 ? 'success' : 'danger'}>
                                            {formatGrowth(crecimiento?.ingresos || 0)} vs mes anterior
                                        </Badge>
                                    </div>
                                </div>
                                <div className="p-3 bg-primary-50 rounded-full">
                                    <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                    </svg>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Estadísticas Secundarias */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

                        {/* Asesores Activos */}
                        <Card>
                            <div className="flex items-center">
                                <div className="p-2 bg-primary-50 rounded-lg">
                                    <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Asesores Activos</p>
                                    <p className="text-2xl font-bold text-gray-900">{estadisticas?.asesoresActivos || 0}</p>
                                </div>
                            </div>
                        </Card>

                        {/* Clientes Nuevos */}
                        <Card>
                            <div className="flex items-center">
                                <div className="p-2 bg-primary-50 rounded-lg">
                                    <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Clientes Nuevos</p>
                                    <p className="text-2xl font-bold text-gray-900">{estadisticas?.clientesNuevos || 0}</p>
                                </div>
                            </div>
                        </Card>

                        {/* Reservas Activas */}
                        <Card>
                            <div className="flex items-center">
                                <div className="p-2 bg-primary-50 rounded-lg">
                                    <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Reservas Activas</p>
                                    <p className="text-2xl font-bold text-gray-900">{estadisticas?.reservasActivas || 0}</p>
                                </div>
                            </div>
                        </Card>

                        {/* Comisiones del Mes */}
                        <Card>
                            <div className="flex items-center">
                                <div className="p-2 bg-primary-50 rounded-lg">
                                    <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Comisiones del Mes</p>
                                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(estadisticas?.comisionesDelMes || 0)}</p>
                                    <p className="text-xs text-gray-500 mt-1">Generadas en ventas</p>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Acciones Rápidas (Horizontal) */}
                    <Card className="mb-8">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                <Button
                                    href="/admin/usuarios/create"
                                    variant="primary"
                                    className="w-full justify-center"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    Nuevo Usuario
                                </Button>

                                <Button
                                    href="/admin/propiedades/create"
                                    variant="primary"
                                    className="w-full justify-center"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                    </svg>
                                    Nueva Propiedad
                                </Button>

                                <Button
                                    href="/admin/reportes"
                                    variant="secondary"
                                    className="w-full justify-center"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                    Ver Reportes
                                </Button>

                                <Button
                                    href="/"
                                    target="_blank"
                                    variant="secondary"
                                    className="w-full justify-center"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                    Ver Frontend
                                </Button>
                            </div>
                        </div>
                    </Card>

                    {/* Área Principal de Contenido */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* Actividades Recientes */}
                        <div className="lg:col-span-2">
                            <Card noPadding className="h-full flex flex-col">
                                <div className="px-6 py-4 border-b border-gray-100">
                                    <h3 className="text-lg font-semibold text-gray-900">Actividad Reciente</h3>
                                    <p className="text-sm text-gray-600">Últimas actividades en el sistema</p>
                                </div>
                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="space-y-4 flex-1">
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
                                                            <p className="text-xs text-success-600 font-medium">
                                                                {formatCurrency(actividad.monto)}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <Badge variant={
                                                            actividad.tag === 'venta' ? 'success' :
                                                            actividad.tag === 'usuario' ? 'info' :
                                                            actividad.tag === 'propiedad' ? 'primary' :
                                                            'secondary'
                                                        }>
                                                            {actividad.tag || actividad.tipo}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-12 h-full flex flex-col justify-center">
                                                <div className="bg-gray-50 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                                                    <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                                    </svg>
                                                </div>
                                                <h3 className="text-base font-medium text-gray-900">Sin actividades recientes</h3>
                                                <p className="mt-1 text-sm text-gray-500">
                                                    Las nuevas actividades aparecerán aquí
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="mt-6 pt-4 border-t border-gray-100">
                                        <Button
                                            href="/admin/actividades"
                                            variant="ghost"
                                            className="w-full justify-center text-primary-600 hover:text-primary-700 hover:bg-primary-50"
                                        >
                                            Ver todas las actividades →
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        </div>

                        {/* Panel Lateral */}
                        <div className="space-y-6">

                            {/* Resumen de Estado */}
                            <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl shadow-md text-white overflow-hidden">
                                <div className="px-6 py-5">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-semibold">Estado del Sistema</h3>
                                        <div className="p-1.5 bg-white/20 rounded-lg">
                                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between border-b border-white/10 pb-2">
                                            <span className="text-sm text-primary-100">Rendimiento</span>
                                            <span className="text-sm font-bold bg-white/20 px-2 py-0.5 rounded">{rendimiento || 'Excelente'}</span>
                                        </div>
                                        <div className="flex items-center justify-between border-b border-white/10 pb-2">
                                            <span className="text-sm text-primary-100">Propiedades</span>
                                            <span className="text-sm font-bold">{estadisticas?.propiedadesActivas || 0}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-primary-100">Usuarios</span>
                                            <span className="text-sm font-bold">{estadisticas?.totalUsuarios || 0}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Panel de Debug */}
                            {debug && (
                                <Card noPadding>
                                    <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                                        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">🔧 Info Técnica</h3>
                                    </div>
                                    <div className="p-6">
                                        <div className="space-y-3 text-xs">
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-500">Memoria</span>
                                                <span className="font-mono bg-gray-100 px-2 py-1 rounded text-gray-700">{debug.memoria_usada_mb} MB</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-500">Tiempo</span>
                                                <span className="font-mono bg-gray-100 px-2 py-1 rounded text-gray-700">{debug.tiempo_respuesta} ms</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-500">PHP</span>
                                                <span className="font-medium text-gray-700">{debug.version_php}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-500">Laravel</span>
                                                <span className="font-medium text-gray-700">{debug.version_laravel}</span>
                                            </div>
                                            <div className="pt-2 border-t border-gray-100 flex justify-between items-center">
                                                <span className="text-gray-500">Ambiente</span>
                                                <Badge size="sm" variant={debug.ambiente === 'production' ? 'success' : 'warning'}>
                                                    {debug.ambiente}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
