import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function ClienteSolicitudes({ auth }) {
    // Datos de prueba para solicitudes
    const [solicitudes] = useState([
        {
            id: 1,
            departamento: {
                id: 1,
                titulo: 'Departamento Magisterio 202',
                ubicacion: 'Calle Magisterio 123, Sector A',
                precio: 150000
            },
            mensaje: 'Estoy interesado en conocer más detalles sobre este departamento. ¿Podrían proporcionar información sobre la disponibilidad y opciones de financiamiento?',
            estado: 'enviada',
            fecha_creacion: '2025-07-15',
            asesor_asignado: 'María González',
            respuesta: null,
            fecha_respuesta: null
        },
        {
            id: 2,
            departamento: {
                id: 2,
                titulo: 'Departamento Lima 305',
                ubicacion: 'Av. Lima 305, Sector B',
                precio: 180000
            },
            mensaje: 'Me gustaría programar una visita para este fin de semana. ¿Hay disponibilidad?',
            estado: 'respondida',
            fecha_creacion: '2025-07-10',
            asesor_asignado: 'Carlos Ruiz',
            respuesta: 'Hola! Claro que sí, tenemos disponibilidad este fin de semana. Te hemos enviado las opciones de horarios a tu correo. También hemos preparado una cotización preliminar.',
            fecha_respuesta: '2025-07-11'
        },
        {
            id: 3,
            departamento: {
                id: 3,
                titulo: 'Departamento San Juan 401',
                ubicacion: 'Av. San Juan 401, Sector C',
                precio: 200000
            },
            mensaje: 'Quisiera saber si este departamento incluye cochera y depósito.',
            estado: 'en_proceso',
            fecha_creacion: '2025-07-20',
            asesor_asignado: 'Ana Torres',
            respuesta: null,
            fecha_respuesta: null
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
            month: 'long',
            day: 'numeric'
        });
    };

    // Función para obtener el estilo del badge según el estado
    const getEstadoBadge = (estado) => {
        switch (estado) {
            case 'enviada':
                return 'bg-blue-100 text-blue-800';
            case 'en_proceso':
                return 'bg-yellow-100 text-yellow-800';
            case 'respondida':
                return 'bg-green-100 text-green-800';
            case 'cerrada':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Función para obtener el texto del estado
    const getEstadoTexto = (estado) => {
        switch (estado) {
            case 'enviada':
                return 'Enviada';
            case 'en_proceso':
                return 'En Proceso';
            case 'respondida':
                return 'Respondida';
            case 'cerrada':
                return 'Cerrada';
            default:
                return 'Desconocido';
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Mis Solicitudes</h2>}
        >
            <Head title="Mis Solicitudes - Inmobiliaria" />

            <div className="py-12 bg-gray-100 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header Section */}
                    <div className="mb-8">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                            <div className="mb-4 sm:mb-0">
                                <h1 className="text-3xl font-bold text-gray-900">
                                    Mis Solicitudes
                                </h1>
                                <p className="mt-1 text-lg text-gray-600">
                                    Gestiona tus consultas y solicitudes de información
                                </p>
                            </div>
                            <div className="flex space-x-3">
                                <Link
                                    href="/cliente/dashboard"
                                    className="inline-flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                    </svg>
                                    Mi Panel
                                </Link>
                                <Link
                                    href="/cliente/solicitudes/crear"
                                    className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    Nueva Solicitud
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Stats Section */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white overflow-hidden shadow-sm rounded-lg border-l-4 border-blue-500">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                                        <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-500">
                                            Total Solicitudes
                                        </p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {solicitudes.length}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow-sm rounded-lg border-l-4 border-yellow-500">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 bg-yellow-100 rounded-md p-3">
                                        <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-500">
                                            En Proceso
                                        </p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {solicitudes.filter(s => s.estado === 'en_proceso' || s.estado === 'enviada').length}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow-sm rounded-lg border-l-4 border-green-500">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                                        <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-500">
                                            Respondidas
                                        </p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {solicitudes.filter(s => s.estado === 'respondida').length}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow-sm rounded-lg border-l-4 border-purple-500">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 bg-purple-100 rounded-md p-3">
                                        <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h4a1 1 0 011 1v2h4a1 1 0 011 1v1a1 1 0 01-1 1v9a2 2 0 01-2 2H7a2 2 0 01-2-2V7a1 1 0 01-1-1V5a1 1 0 011-1h4z" />
                                        </svg>
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-500">
                                            Tiempo Promedio
                                        </p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            2 días
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Lista de Solicitudes */}
                    {solicitudes.length > 0 ? (
                        <div className="space-y-6">
                            {solicitudes.map((solicitud) => (
                                <div key={solicitud.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                                    <div className="p-6">
                                        {/* Header de la solicitud */}
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-3 mb-2">
                                                    <h3 className="text-lg font-semibold text-gray-900">
                                                        Solicitud #{solicitud.id}
                                                    </h3>
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEstadoBadge(solicitud.estado)}`}>
                                                        {getEstadoTexto(solicitud.estado)}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-500">
                                                    Enviada el {formatFecha(solicitud.fecha_creacion)}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm text-gray-500">Asesor asignado</p>
                                                <p className="font-medium text-gray-900">{solicitud.asesor_asignado}</p>
                                            </div>
                                        </div>

                                        {/* Información del departamento */}
                                        <div className="bg-gray-50 rounded-lg p-4 mb-4">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <h4 className="font-medium text-gray-900 mb-1">
                                                        {solicitud.departamento.titulo}
                                                    </h4>
                                                    <p className="text-sm text-gray-600 mb-2 flex items-center">
                                                        <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        </svg>
                                                        {solicitud.departamento.ubicacion}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xl font-bold text-green-600">
                                                        {formatPrecio(solicitud.departamento.precio)}
                                                    </p>
                                                    <Link
                                                        href={`/catalogo/${solicitud.departamento.id}`}
                                                        className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                                                    >
                                                        Ver departamento
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Mensaje de la solicitud */}
                                        <div className="mb-4">
                                            <h5 className="font-medium text-gray-900 mb-2">Tu consulta:</h5>
                                            <p className="text-gray-700 bg-blue-50 p-3 rounded-lg">
                                                {solicitud.mensaje}
                                            </p>
                                        </div>

                                        {/* Respuesta del asesor */}
                                        {solicitud.respuesta && (
                                            <div className="mb-4">
                                                <div className="flex items-center justify-between mb-2">
                                                    <h5 className="font-medium text-gray-900">Respuesta del asesor:</h5>
                                                    <p className="text-sm text-gray-500">
                                                        Respondido el {formatFecha(solicitud.fecha_respuesta)}
                                                    </p>
                                                </div>
                                                <p className="text-gray-700 bg-green-50 p-3 rounded-lg">
                                                    {solicitud.respuesta}
                                                </p>
                                            </div>
                                        )}

                                        {/* Acciones */}
                                        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                                            <div className="flex space-x-3">
                                                <Link
                                                    href={`/catalogo/${solicitud.departamento.id}`}
                                                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
                                                >
                                                    <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                    Ver Detalles
                                                </Link>
                                                {solicitud.estado === 'respondida' && (
                                                    <Link
                                                        href={`/cliente/cotizaciones?departamento=${solicitud.departamento.id}`}
                                                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
                                                    >
                                                        <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                                        </svg>
                                                        Ver Cotización
                                                    </Link>
                                                )}
                                            </div>

                                            <div className="text-sm text-gray-500">
                                                ID: {solicitud.id}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <div className="flex justify-center mb-6">
                                <div className="h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center">
                                    <svg className="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-2m-4-1v8m0 0l3-3m-3 3L9 8m-5 5h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293h3.172a1 1 0 00.707-.293l2.414-2.414a1 1 0 01.707-.293H20" />
                                    </svg>
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                No tienes solicitudes aún
                            </h3>
                            <p className="text-gray-500 mb-8 max-w-md mx-auto">
                                Explora nuestro catálogo de departamentos y envía una solicitud de información sobre los que te interesen.
                            </p>
                            <div className="flex justify-center space-x-4">
                                <Link
                                    href="/catalogo"
                                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                    Explorar Departamentos
                                </Link>
                                <Link
                                    href="/cliente/solicitudes/crear"
                                    className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    Nueva Solicitud
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
