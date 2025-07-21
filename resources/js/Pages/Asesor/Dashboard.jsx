import { Head, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import Layout from '@/Components/Layout/Layout';

export default function AsesorDashboard({ auth }) {
    // Estado para las diferentes secciones del dashboard
    const [stats, setStats] = useState({
        solicitudesPendientes: 0,
        cotizacionesActivas: 0,
        reservasEnProceso: 0,
        ventasRecientes: 0,
        comisionesTotal: 0
    });

    // Datos simulados para demostración
    const [solicitudes, setSolicitudes] = useState([
        {
            id: 1,
            cliente: 'María López',
            email: 'maria@example.com',
            telefono: '987654321',
            fecha: '2025-07-15',
            mensaje: 'Interesada en departamento de 3 dormitorios en zona céntrica',
            estado: 'pendiente'
        },
        {
            id: 2,
            cliente: 'Carlos Mendoza',
            email: 'carlos@example.com',
            telefono: '987123456',
            fecha: '2025-07-18',
            mensaje: 'Quisiera información sobre departamentos con vista a la plaza',
            estado: 'pendiente'
        },
        {
            id: 3,
            cliente: 'Julia Paredes',
            email: 'julia@example.com',
            telefono: '999888777',
            fecha: '2025-07-19',
            mensaje: 'Solicito cotización para departamento familiar en San Sebastián',
            estado: 'en_proceso'
        }
    ]);

    // Datos simulados para actividades recientes
    const [actividades, setActividades] = useState([
        {
            id: 1,
            tipo: 'solicitud',
            cliente: 'Ana Ballón',
            descripcion: 'Nueva solicitud de contacto',
            fecha: '2025-07-20',
            estado: 'pendiente'
        },
        {
            id: 2,
            tipo: 'cotizacion',
            cliente: 'Roberto Guzmán',
            descripcion: 'Cotización enviada',
            fecha: '2025-07-19',
            estado: 'enviada'
        },
        {
            id: 3,
            tipo: 'venta',
            cliente: 'Julia Paredes',
            descripcion: 'Venta completada de Departamento Magisterio 405',
            fecha: '2025-07-18',
            estado: 'completada'
        }
    ]);

    // Función para formatear moneda
    const formatMoney = (amount) => {
        return new Intl.NumberFormat('es-PE', {
            style: 'currency',
            currency: 'PEN',
            minimumFractionDigits: 0
        }).format(amount);
    };

    // Función para actualizar estadísticas basadas en los datos
    useEffect(() => {
        // En una implementación real, estos datos vendrían de una API
        setStats({
            solicitudesPendientes: solicitudes.filter(s => s.estado === 'pendiente').length,
            cotizacionesActivas: 5,
            reservasEnProceso: 3,
            ventasRecientes: 4,
            comisionesTotal: 25350
        });
    }, [solicitudes]);

    return (
        <Layout auth={auth}>
            <Head title="Panel de Asesor - Inmobiliaria Cusco" />

            <div className="py-12 bg-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-gray-900">
                            Panel de Control del Asesor
                        </h2>
                        <p className="mt-1 text-lg text-gray-600">
                            Gestione solicitudes, cotizaciones, reservas y ventas
                        </p>
                    </div>

                    {/* Tarjetas de estadísticas */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white overflow-hidden shadow-sm rounded-lg border-l-4 border-indigo-500">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 bg-indigo-100 rounded-md p-3">
                                        <svg className="h-6 w-6 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                        </svg>
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-500 truncate">
                                            Solicitudes Pendientes
                                        </p>
                                        <p className="text-2xl font-semibold text-gray-900">
                                            {stats.solicitudesPendientes}
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <Link href="/asesor/solicitudes" className="text-sm text-indigo-600 hover:text-indigo-800">
                                        Ver solicitudes
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow-sm rounded-lg border-l-4 border-green-500">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                                        <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-500 truncate">
                                            Cotizaciones Activas
                                        </p>
                                        <p className="text-2xl font-semibold text-gray-900">
                                            {stats.cotizacionesActivas}
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <Link href="/asesor/cotizaciones" className="text-sm text-green-600 hover:text-green-800">
                                        Ver cotizaciones
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow-sm rounded-lg border-l-4 border-yellow-500">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 bg-yellow-100 rounded-md p-3">
                                        <svg className="h-6 w-6 text-yellow-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-500 truncate">
                                            Reservas En Proceso
                                        </p>
                                        <p className="text-2xl font-semibold text-gray-900">
                                            {stats.reservasEnProceso}
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <Link href="/asesor/reservas" className="text-sm text-yellow-600 hover:text-yellow-800">
                                        Ver reservas
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow-sm rounded-lg border-l-4 border-blue-500">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                                        <svg className="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-500 truncate">
                                            Ventas Recientes
                                        </p>
                                        <p className="text-2xl font-semibold text-gray-900">
                                            {stats.ventasRecientes}
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <Link href="/asesor/ventas" className="text-sm text-blue-600 hover:text-blue-800">
                                        Ver ventas
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Solicitudes Recientes */}
                    <div className="bg-white overflow-hidden shadow-md rounded-lg mb-8">
                        <div className="px-6 py-5 border-b border-gray-200">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">
                                Solicitudes de Contacto Recientes
                            </h3>
                        </div>
                        <div className="bg-white overflow-hidden overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Cliente
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Contacto
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Fecha
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Estado
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Acciones
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {solicitudes.map((solicitud) => (
                                        <tr key={solicitud.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{solicitud.cliente}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{solicitud.email}</div>
                                                <div className="text-sm text-gray-500">{solicitud.telefono}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{solicitud.fecha}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                    solicitud.estado === 'pendiente'
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : 'bg-green-100 text-green-800'
                                                }`}>
                                                    {solicitud.estado === 'pendiente' ? 'Pendiente' : 'En Proceso'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <Link href={`/asesor/solicitudes/${solicitud.id}`} className="text-indigo-600 hover:text-indigo-900 mr-4">
                                                    Ver detalles
                                                </Link>
                                                <Link href={`/asesor/cotizaciones/crear/${solicitud.id}`} className="text-green-600 hover:text-green-900">
                                                    Generar cotización
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {solicitudes.length === 0 && (
                                <div className="px-6 py-4 text-center text-gray-500">
                                    No hay solicitudes pendientes
                                </div>
                            )}
                        </div>
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                            <Link href="/asesor/solicitudes" className="text-sm text-indigo-600 hover:text-indigo-800">
                                Ver todas las solicitudes →
                            </Link>
                        </div>
                    </div>

                    {/* Acciones rápidas */}
                    <div className="bg-white overflow-hidden shadow-md rounded-lg mb-8">
                        <div className="px-6 py-5 border-b border-gray-200">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">
                                Acciones Rápidas
                            </h3>
                        </div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <Link href="/asesor/solicitudes" className="flex items-center p-5 rounded-lg bg-white border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors">
                                <div className="flex-shrink-0 bg-indigo-100 rounded-md p-3">
                                    <svg className="h-6 w-6 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <h4 className="text-base font-medium text-gray-900">Gestionar Solicitudes</h4>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Ver y procesar solicitudes de contacto
                                    </p>
                                </div>
                            </Link>

                            <Link href="/asesor/cotizaciones" className="flex items-center p-5 rounded-lg bg-white border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors">
                                <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                                    <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <h4 className="text-base font-medium text-gray-900">Gestionar Cotizaciones</h4>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Ver y crear cotizaciones
                                    </p>
                                </div>
                            </Link>

                            <Link href="/asesor/reservas" className="flex items-center p-5 rounded-lg bg-white border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors">
                                <div className="flex-shrink-0 bg-yellow-100 rounded-md p-3">
                                    <svg className="h-6 w-6 text-yellow-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <h4 className="text-base font-medium text-gray-900">Gestionar Reservas</h4>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Ver y crear reservas
                                    </p>
                                </div>
                            </Link>

                            <Link href="/asesor/ventas" className="flex items-center p-5 rounded-lg bg-white border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors">
                                <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                                    <svg className="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <h4 className="text-base font-medium text-gray-900">Gestionar Ventas</h4>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Ver y registrar ventas
                                    </p>
                                </div>
                            </Link>
                        </div>
                    </div>

                    {/* Actividades Recientes */}
                    <div className="bg-white overflow-hidden shadow-md rounded-lg mb-8">
                        <div className="px-6 py-5 border-b border-gray-200">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">
                                Actividades Recientes
                            </h3>
                        </div>
                        <div className="p-6">
                            <div className="flow-root">
                                <ul className="divide-y divide-gray-200">
                                    {actividades.map((actividad) => (
                                        <li key={actividad.id} className="py-4">
                                            <div className="flex items-start">
                                                <div className={`flex-shrink-0 rounded-full p-2 ${
                                                    actividad.tipo === 'solicitud'
                                                        ? 'bg-indigo-100'
                                                        : actividad.tipo === 'cotizacion'
                                                        ? 'bg-green-100'
                                                        : actividad.tipo === 'reserva'
                                                        ? 'bg-yellow-100'
                                                        : 'bg-blue-100'
                                                }`}>
                                                    {actividad.tipo === 'solicitud' && (
                                                        <svg className="h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                                        </svg>
                                                    )}
                                                    {actividad.tipo === 'cotizacion' && (
                                                        <svg className="h-5 w-5 text-green-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                                                        </svg>
                                                    )}
                                                    {actividad.tipo === 'reserva' && (
                                                        <svg className="h-5 w-5 text-yellow-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                                        </svg>
                                                    )}
                                                    {actividad.tipo === 'venta' && (
                                                        <svg className="h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                            <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                                                        </svg>
                                                    )}
                                                </div>
                                                <div className="ml-3 flex-1">
                                                    <div className="flex items-center justify-between">
                                                        <p className="text-sm font-medium text-gray-900">
                                                            {actividad.cliente}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            {actividad.fecha}
                                                        </p>
                                                    </div>
                                                    <p className="text-sm text-gray-600 mt-1">
                                                        {actividad.descripcion}
                                                    </p>
                                                    <div className="mt-2">
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                            actividad.estado === 'pendiente'
                                                                ? 'bg-yellow-100 text-yellow-800'
                                                                : actividad.estado === 'enviada'
                                                                ? 'bg-blue-100 text-blue-800'
                                                                : actividad.estado === 'confirmada'
                                                                ? 'bg-green-100 text-green-800'
                                                                : actividad.estado === 'completada'
                                                                ? 'bg-green-100 text-green-800'
                                                                : 'bg-purple-100 text-purple-800'
                                                        }`}>
                                                            {actividad.estado.charAt(0).toUpperCase() + actividad.estado.slice(1)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Resumen de Comisiones */}
                    <div className="bg-white overflow-hidden shadow-md rounded-lg">
                        <div className="px-6 py-5 border-b border-gray-200">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">
                                Resumen de Comisiones
                            </h3>
                        </div>
                        <div className="p-6">
                            <div className="flex items-center mb-6">
                                <div className="flex-shrink-0 bg-green-100 rounded-full p-3">
                                    <svg className="h-8 w-8 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div className="ml-5">
                                    <div className="text-sm font-medium text-gray-500">
                                        Comisiones Totales
                                    </div>
                                    <div className="text-2xl font-bold text-gray-900">
                                        {formatMoney(stats.comisionesTotal)}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <div className="text-sm text-gray-600">Comisiones del mes</div>
                                    <div className="text-sm font-medium text-gray-900">{formatMoney(12500)}</div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div className="text-sm text-gray-600">Comisiones pendientes</div>
                                    <div className="text-sm font-medium text-gray-900">{formatMoney(7350)}</div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div className="text-sm text-gray-600">Comisiones del trimestre</div>
                                    <div className="text-sm font-medium text-gray-900">{formatMoney(18750)}</div>
                                </div>
                            </div>

                            <div className="mt-6">
                                <Link
                                    href="/asesor/ventas"
                                    className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Ver detalle de ventas
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
