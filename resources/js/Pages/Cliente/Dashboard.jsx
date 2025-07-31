import { Head, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function ClienteDashboard({ auth }) {
    // Estado para las estadísticas del dashboard
    const [stats, setStats] = useState({
        solicitudesEnviadas: 3,
        cotizacionesRecibidas: 2,
        reservasActivas: 1,
        departamentosVistos: 8
    });

    // Actividades recientes con datos más coherentes
    const [actividadesRecientes, setActividadesRecientes] = useState([
        {
            id: 1,
            tipo: 'solicitud',
            descripcion: 'Solicitud enviada: Departamento Magisterio 202',
            fecha: '2025-07-15',
            estado: 'enviada'
        },
        {
            id: 2,
            tipo: 'cotizacion',
            descripcion: 'Cotización recibida: Departamento Magisterio 202',
            fecha: '2025-07-16',
            asesor: 'María González',
            monto: 150000
        },
        {
            id: 3,
            tipo: 'visita',
            descripcion: 'Visita programada: Departamento Magisterio 202',
            fecha: '2025-07-22',
            asesor: 'María González',
            hora: '10:00 AM'
        },
    ]);

    // Departamentos favoritos
    const [favoritos, setFavoritos] = useState([
        {
            id: 1,
            titulo: 'Departamento Magisterio 202',
            ubicacion: 'Calle Magisterio 123, Sector A',
            precio: 150000,
            habitaciones: 3,
            banos: 2,
            area_total: 120,
            estado: 'disponible'
        },
        {
            id: 2,
            titulo: 'Departamento Lima 305',
            ubicacion: 'Av. Lima 305, Sector B',
            precio: 180000,
            habitaciones: 3,
            banos: 2,
            area_total: 140,
            estado: 'disponible'
        }
    ]);

    // Formato de moneda
    const formatPrecio = (precio) => {
        return new Intl.NumberFormat('es-PE', {
            style: 'currency',
            currency: 'PEN',
            minimumFractionDigits: 0,
        }).format(precio);
    };

    // Formato de fecha
    const formatFecha = (fecha) => {
        return new Date(fecha).toLocaleDateString('es-PE', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard Cliente</h2>}
        >
            <Head title="Mi Panel - Inmobiliaria" />

            <div className="py-12 bg-gray-100 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header Section */}
                    <div className="mb-8">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                            <div className="mb-4 sm:mb-0">
                                <h1 className="text-3xl font-bold text-gray-900">
                                    Mi Panel
                                </h1>
                                <p className="mt-1 text-lg text-gray-600">
                                    Gestiona tus solicitudes, cotizaciones y reservas
                                </p>
                            </div>
                            <Link
                                href="/catalogo"
                                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                                Ver Catálogo de Propiedades
                            </Link>
                        </div>
                    </div>

                    {/* Tarjetas de estadísticas */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {/* Solicitudes Enviadas */}
                        <div className="bg-white overflow-hidden shadow-sm rounded-lg border-l-4 border-blue-500 hover:shadow-md transition-shadow duration-200">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                                        <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-2m-4-1v8m0 0l3-3m-3 3L9 8m-5 5h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293h3.172a1 1 0 00.707-.293l2.414-2.414a1 1 0 01.707-.293H20" />
                                        </svg>
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-500 truncate">
                                            Solicitudes Enviadas
                                        </p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {stats.solicitudesEnviadas}
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <Link
                                        href="/cliente/solicitudes"
                                        className="text-sm text-blue-600 hover:text-blue-800 font-medium hover:underline"
                                    >
                                        Ver mis solicitudes
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Cotizaciones Recibidas */}
                        <div className="bg-white overflow-hidden shadow-sm rounded-lg border-l-4 border-green-500 hover:shadow-md transition-shadow duration-200">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                                        <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                        </svg>
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-500 truncate">
                                            Cotizaciones Recibidas
                                        </p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {stats.cotizacionesRecibidas}
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <Link
                                        href="/cliente/cotizaciones"
                                        className="text-sm text-green-600 hover:text-green-800 font-medium hover:underline"
                                    >
                                        Ver mis cotizaciones
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Reservas Activas */}
                        <div className="bg-white overflow-hidden shadow-sm rounded-lg border-l-4 border-yellow-500 hover:shadow-md transition-shadow duration-200">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 bg-yellow-100 rounded-md p-3">
                                        <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-500 truncate">
                                            Reservas Activas
                                        </p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {stats.reservasActivas}
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <Link
                                        href="/cliente/reservas"
                                        className="text-sm text-yellow-600 hover:text-yellow-800 font-medium hover:underline"
                                    >
                                        Ver mis reservas
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Departamentos Vistos */}
                        <div className="bg-white overflow-hidden shadow-sm rounded-lg border-l-4 border-purple-500 hover:shadow-md transition-shadow duration-200">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 bg-purple-100 rounded-md p-3">
                                        <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-500 truncate">
                                            Departamentos Vistos
                                        </p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {stats.departamentosVistos}
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <Link
                                        href="/cliente/historial"
                                        className="text-sm text-purple-600 hover:text-purple-800 font-medium hover:underline"
                                    >
                                        Ver mi historial
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Acciones rápidas */}
                    <div className="bg-white overflow-hidden shadow-md rounded-lg mb-8">
                        <div className="px-6 py-5 border-b border-gray-200">
                            <h3 className="text-lg leading-6 font-semibold text-gray-900">
                                Acciones Rápidas
                            </h3>
                        </div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Explorar Departamentos */}
                            <Link
                                href="/catalogo"
                                className="group flex items-center p-5 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 hover:from-blue-100 hover:to-blue-200 transition-all duration-200 transform hover:scale-105"
                            >
                                <div className="flex-shrink-0 bg-blue-600 rounded-md p-3 group-hover:bg-blue-700 transition-colors duration-200">
                                    <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <h4 className="text-base font-semibold text-gray-900 group-hover:text-blue-800">
                                        Explorar Departamentos
                                    </h4>
                                    <p className="mt-1 text-sm text-gray-600">
                                        Descubre nuestros departamentos disponibles
                                    </p>
                                </div>
                            </Link>

                            {/* Nueva Solicitud */}
                            <Link
                                href="/cliente/solicitudes/crear"
                                className="group flex items-center p-5 rounded-lg bg-gradient-to-br from-green-50 to-green-100 border border-green-200 hover:from-green-100 hover:to-green-200 transition-all duration-200 transform hover:scale-105"
                            >
                                <div className="flex-shrink-0 bg-green-600 rounded-md p-3 group-hover:bg-green-700 transition-colors duration-200">
                                    <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <h4 className="text-base font-semibold text-gray-900 group-hover:text-green-800">
                                        Nueva Solicitud
                                    </h4>
                                    <p className="mt-1 text-sm text-gray-600">
                                        Solicita información sobre un departamento
                                    </p>
                                </div>
                            </Link>

                            {/* Actualizar Perfil */}
                            <Link
                                href="/cliente/perfil"
                                className="group flex items-center p-5 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 hover:from-purple-100 hover:to-purple-200 transition-all duration-200 transform hover:scale-105"
                            >
                                <div className="flex-shrink-0 bg-purple-600 rounded-md p-3 group-hover:bg-purple-700 transition-colors duration-200">
                                    <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <h4 className="text-base font-semibold text-gray-900 group-hover:text-purple-800">
                                        Actualizar Perfil
                                    </h4>
                                    <p className="mt-1 text-sm text-gray-600">
                                        Actualiza tu información personal
                                    </p>
                                </div>
                            </Link>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                        {/* Actividades recientes */}
                    {/* Actividad reciente */}
                    <div className="bg-white overflow-hidden shadow-md rounded-lg">
                        <div className="px-6 py-5 border-b border-gray-200">
                            <h3 className="text-lg leading-6 font-semibold text-gray-900">
                                Actividad Reciente
                            </h3>
                        </div>
                        <div className="p-6">
                            {actividadesRecientes.length > 0 ? (
                                <div className="space-y-6">
                                    {actividadesRecientes.map((actividad, index) => (
                                        <div key={index} className="flex items-start space-x-4 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
                                            <div className="flex-shrink-0">
                                                <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                                                    actividad.tipo === 'cotizacion' ? 'bg-blue-100' :
                                                    actividad.tipo === 'reserva' ? 'bg-yellow-100' :
                                                    actividad.tipo === 'venta' ? 'bg-green-100' :
                                                    actividad.tipo === 'solicitud' ? 'bg-purple-100' :
                                                    actividad.tipo === 'visita' ? 'bg-orange-100' : 'bg-gray-100'
                                                }`}>
                                                    {actividad.tipo === 'cotizacion' && (
                                                        <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                                        </svg>
                                                    )}
                                                    {actividad.tipo === 'reserva' && (
                                                        <svg className="h-5 w-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                    )}
                                                    {actividad.tipo === 'venta' && (
                                                        <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    )}
                                                    {actividad.tipo === 'solicitud' && (
                                                        <svg className="h-5 w-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-2m-4-1v8m0 0l3-3m-3 3L9 8m-5 5h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293h3.172a1 1 0 00.707-.293l2.414-2.414a1 1 0 01.707-.293H20" />
                                                        </svg>
                                                    )}
                                                    {actividad.tipo === 'visita' && (
                                                        <svg className="h-5 w-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                        </svg>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between">
                                                    <p className="text-sm font-semibold text-gray-900">
                                                        {actividad.tipo === 'cotizacion' && 'Nueva Cotización'}
                                                        {actividad.tipo === 'reserva' && 'Reserva Realizada'}
                                                        {actividad.tipo === 'venta' && 'Venta Completada'}
                                                        {actividad.tipo === 'solicitud' && 'Solicitud Enviada'}
                                                        {actividad.tipo === 'visita' && 'Visita Programada'}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {formatFecha(actividad.fecha)}
                                                    </p>
                                                </div>
                                                <p className="mt-1 text-sm text-gray-600">
                                                    {actividad.descripcion}
                                                </p>
                                                {actividad.monto && (
                                                    <p className="mt-2 text-sm font-medium text-green-600">
                                                        {formatPrecio(actividad.monto)}
                                                    </p>
                                                )}
                                                {actividad.asesor && (
                                                    <p className="mt-1 text-xs text-gray-500">
                                                        Asesor: {actividad.asesor}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <div className="flex justify-center mb-4">
                                        <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center">
                                            <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                            </svg>
                                        </div>
                                    </div>
                                    <h4 className="text-lg font-medium text-gray-900 mb-2">
                                        No hay actividad reciente
                                    </h4>
                                    <p className="text-gray-500">
                                        Cuando realices una cotización, reserva o venta, aparecerá aquí.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Departamentos favoritos */}
                    <div className="bg-white overflow-hidden shadow-md rounded-lg mt-8">
                        <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
                            <h3 className="text-lg leading-6 font-semibold text-gray-900">
                                Departamentos Favoritos
                            </h3>
                            <Link
                                href="/cliente/favoritos"
                                className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
                            >
                                Ver todos
                            </Link>
                        </div>
                        <div className="p-6">
                            {favoritos.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {favoritos.slice(0, 3).map((favorito) => (
                                        <div key={favorito.id} className="group bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200">
                                            <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                                                {favorito.imagen_principal ? (
                                                    <img
                                                        src={favorito.imagen_principal}
                                                        alt={`Departamento ${favorito.nombre}`}
                                                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
                                                    />
                                                ) : (
                                                    <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                                                        <svg className="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="p-4">
                                                <h4 className="text-base font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                                                    {favorito.titulo}
                                                </h4>
                                                <p className="mt-1 text-sm text-gray-600">
                                                    📍 {favorito.ubicacion}
                                                </p>
                                                <div className="mt-3 flex items-center space-x-3 text-sm text-gray-500">
                                                    <span className="flex items-center">
                                                        🛏️ {favorito.habitaciones} hab.
                                                    </span>
                                                    <span className="flex items-center">
                                                        🚿 {favorito.banos} baños
                                                    </span>
                                                    <span className="flex items-center">
                                                        📐 {favorito.area_total}m²
                                                    </span>
                                                </div>
                                                <div className="mt-3 flex items-center justify-between">
                                                    <span className="text-lg font-bold text-green-600">
                                                        {formatPrecio(favorito.precio)}
                                                    </span>
                                                    <div className="flex items-center space-x-2">
                                                        <Link
                                                            href={`/departamentos/${favorito.id}`}
                                                            className="text-sm bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200"
                                                        >
                                                            Ver detalles
                                                        </Link>
                                                        <button className="text-red-500 hover:text-red-700 transition-colors duration-200">
                                                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <div className="flex justify-center mb-4">
                                        <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center">
                                            <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <h4 className="text-lg font-medium text-gray-900 mb-2">
                                        No tienes favoritos aún
                                    </h4>
                                    <p className="text-gray-500 mb-4">
                                        Explora nuestros departamentos y guarda tus favoritos para verlos aquí.
                                    </p>
                                    <Link
                                        href="/departamentos"
                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
                                    >
                                        Explorar Departamentos
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
