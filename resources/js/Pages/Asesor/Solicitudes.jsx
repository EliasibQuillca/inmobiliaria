import React, { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import AsesorLayout from '../../Layouts/AsesorLayout';
import axios from 'axios';

export default function Solicitudes({
    auth,
    solicitudes = [],
    solicitudesPendientes = [],
    solicitudesAprobadas = [],
    solicitudesRechazadas = [],
    clientesNuevos = [],
    departamentosInteres = [],
    estadisticas = {},
    asesor = {}
}) {
    const [showContactForm, setShowContactForm] = useState(false);
    const [selectedClient, setSelectedClient] = useState(null);
    const [selectedSolicitud, setSelectedSolicitud] = useState(null);
    const [showFollowUp, setShowFollowUp] = useState(false);
    const [showResponseForm, setShowResponseForm] = useState(false);
    const [showDetalleModal, setShowDetalleModal] = useState(false);
    const [activeTab, setActiveTab] = useState('pendientes'); // pendientes, aprobadas, rechazadas, clientes

    const { data, setData, post, patch, processing, errors, reset } = useForm({
        nombre: '',
        telefono: '',
        dni: '',
        email: '',
        departamento_interes: '',
        notas_contacto: '',
        medio_contacto: 'whatsapp',
        estado: 'contactado',
        notas_seguimiento: ''
    });

    const { data: responseData, setData: setResponseData, post: postResponse, processing: processingResponse, errors: responseErrors, reset: resetResponse } = useForm({
        monto: '',
        descuento: '',
        fecha_validez: '',
        notas: '',
        condiciones: 'Sujeto a disponibilidad y aprobación crediticia.'
    });

    const handleSubmitContact = (e) => {
        e.preventDefault();
        post(route('asesor.solicitudes.contacto'), {
            onSuccess: () => {
                reset();
                setShowContactForm(false);
            }
        });
    };

    const handleFollowUp = (cliente) => {
        setSelectedClient(cliente);
        setData({
            ...data,
            estado: cliente.estado,
            notas_seguimiento: cliente.notas_seguimiento || ''
        });
        setShowFollowUp(true);
    };

    const submitFollowUp = (e) => {
        e.preventDefault();
        patch(route('asesor.solicitudes.seguimiento', { id: selectedClient.id }), {
            onSuccess: () => {
                setShowFollowUp(false);
                setSelectedClient(null);
                reset();
            }
        });
    };

    const getEstadoColor = (estado) => {
        const colors = {
            'contactado': 'bg-blue-100 text-blue-800',
            'interesado': 'bg-green-100 text-green-800',
            'sin_interes': 'bg-red-100 text-red-800',
            'perdido': 'bg-gray-100 text-gray-800',
            'cita_agendada': 'bg-purple-100 text-purple-800',
            'pendiente': 'bg-yellow-100 text-yellow-800',
            'en_proceso': 'bg-blue-100 text-blue-800',
            'aprobada': 'bg-green-100 text-green-800',
            'rechazada': 'bg-red-100 text-red-800',
        };
        return colors[estado] || 'bg-gray-100 text-gray-800';
    };

    const handleUpdateEstado = (solicitudId, nuevoEstado) => {
        if (!solicitudId) {
            console.error('Error: solicitudId no definido');
            return;
        }

        // Usar router.patch de Inertia
        router.patch(`/asesor/solicitudes/${solicitudId}/estado`, {
            estado: nuevoEstado
        }, {
            preserveState: false,
            onSuccess: () => {
                // Recarga completa de la página
                window.location.href = '/asesor/solicitudes';
            },
            onError: (errors) => {
                console.error('Error al actualizar:', errors);
                alert('Error al actualizar el estado. Por favor, intenta de nuevo.');
            }
        });
    };

    const handleResponderSolicitud = (solicitud) => {
        setSelectedSolicitud(solicitud);
        // Pre-llenar con el precio del departamento si existe
        setResponseData({
            monto: solicitud.departamento?.precio || '',
            descuento: '',
            fecha_validez: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            notas: `Información del departamento ${solicitud.departamento?.nombre || ''}`,
            condiciones: 'Sujeto a disponibilidad y aprobación crediticia.'
        });
        setShowResponseForm(true);
    };

    const handleVerDetalle = (solicitud) => {
        setSelectedSolicitud(solicitud);
        setShowDetalleModal(true);
    };

    const extraerDatosMensaje = (mensaje) => {
        const datos = {
            telefono: null,
            tipoConsulta: null,
            mensajeAdicional: null
        };

        // Extraer teléfono
        const telMatch = mensaje.match(/Teléfono de contacto:\s*(.+?)(\n|$)/i);
        if (telMatch) datos.telefono = telMatch[1].trim();

        // Extraer tipo de consulta
        const tipoMatch = mensaje.match(/Tipo de consulta:\s*(.+?)(\n|$)/i);
        if (tipoMatch) datos.tipoConsulta = tipoMatch[1].trim();

        // Extraer mensaje adicional
        const mensajeMatch = mensaje.match(/Mensaje adicional del cliente:\s*(.+)/is);
        if (mensajeMatch) datos.mensajeAdicional = mensajeMatch[1].trim();

        return datos;
    };

    const submitResponse = (e) => {
        e.preventDefault();
        postResponse(route('asesor.solicitudes.responder', { id: selectedSolicitud.id }), {
            onSuccess: () => {
                setShowResponseForm(false);
                setSelectedSolicitud(null);
                resetResponse();
            }
        });
    };

    const formatFecha = (fecha) => {
        return new Date(fecha).toLocaleDateString('es-PE', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <AsesorLayout user={auth.user}>
            <Head title="Solicitudes de Contacto" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="flex-1 min-w-0">
                                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold leading-7 text-gray-900">
                                    Solicitudes de Información
                                </h2>
                                <p className="mt-1 text-sm text-gray-500">
                                    Gestiona las solicitudes de información de departamentos de tus clientes
                                </p>
                            </div>
                            <div className="flex">
                                <button
                                    onClick={() => setShowContactForm(true)}
                                    className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    <svg className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    Registrar Contacto
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Panel de Estadísticas */}
                    {estadisticas && Object.keys(estadisticas).length > 0 && (
                        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-5">
                            {/* Total Solicitudes */}
                            <div className="bg-white overflow-hidden shadow rounded-lg">
                                <div className="p-5">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </div>
                                        <div className="ml-5 w-0 flex-1">
                                            <dl>
                                                <dt className="text-sm font-medium text-gray-500 truncate">
                                                    Total Solicitudes
                                                </dt>
                                                <dd className="text-lg font-medium text-gray-900">
                                                    {estadisticas.total_solicitudes || 0}
                                                </dd>
                                            </dl>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Pendientes */}
                            <div className="bg-white overflow-hidden shadow rounded-lg">
                                <div className="p-5">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <svg className="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div className="ml-5 w-0 flex-1">
                                            <dl>
                                                <dt className="text-sm font-medium text-gray-500 truncate">
                                                    Pendientes
                                                </dt>
                                                <dd className="text-lg font-medium text-yellow-600">
                                                    {estadisticas.pendientes || 0}
                                                </dd>
                                            </dl>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Aprobadas */}
                            <div className="bg-white overflow-hidden shadow rounded-lg">
                                <div className="p-5">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <svg className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div className="ml-5 w-0 flex-1">
                                            <dl>
                                                <dt className="text-sm font-medium text-gray-500 truncate">
                                                    Aprobadas
                                                </dt>
                                                <dd className="text-lg font-medium text-green-600">
                                                    {estadisticas.aprobadas || 0}
                                                </dd>
                                            </dl>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Tabs de filtrado */}
                    <div className="mb-6">
                        <div className="border-b border-gray-200 overflow-x-auto">
                            <nav className="-mb-px flex space-x-4 sm:space-x-8 min-w-max">
                                <button
                                    onClick={() => setActiveTab('pendientes')}
                                    className={`${
                                        activeTab === 'pendientes'
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
                                >
                                    Pendientes
                                    {solicitudesPendientes.length > 0 && (
                                        <span className="ml-2 bg-yellow-100 text-yellow-800 py-0.5 px-2.5 rounded-full text-xs font-medium">
                                            {solicitudesPendientes.length}
                                        </span>
                                    )}
                                </button>
                                <button
                                    onClick={() => setActiveTab('aprobadas')}
                                    className={`${
                                        activeTab === 'aprobadas'
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
                                >
                                    Aprobadas
                                    {solicitudesAprobadas.length > 0 && (
                                        <span className="ml-2 bg-green-100 text-green-800 py-0.5 px-2.5 rounded-full text-xs font-medium">
                                            {solicitudesAprobadas.length}
                                        </span>
                                    )}
                                </button>
                                <button
                                    onClick={() => setActiveTab('rechazadas')}
                                    className={`${
                                        activeTab === 'rechazadas'
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
                                >
                                    Rechazadas
                                    {solicitudesRechazadas.length > 0 && (
                                        <span className="ml-2 bg-red-100 text-red-800 py-0.5 px-2.5 rounded-full text-xs font-medium">
                                            {solicitudesRechazadas.length}
                                        </span>
                                    )}
                                </button>
                                <button
                                    onClick={() => setActiveTab('clientes')}
                                    className={`${
                                        activeTab === 'clientes'
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
                                >
                                    Clientes Sin Cotización
                                    {clientesNuevos.length > 0 && (
                                        <span className="ml-2 bg-purple-100 text-purple-800 py-0.5 px-2.5 rounded-full text-xs font-medium">
                                            {clientesNuevos.length}
                                        </span>
                                    )}
                                </button>
                            </nav>
                        </div>
                    </div>

                    {/* Contenido de las pestañas - Solicitudes */}
                    {activeTab !== 'clientes' && (
                        <div className="bg-white shadow overflow-hidden sm:rounded-md">
                            <div className="px-4 py-5 sm:p-6">
                                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                                    {activeTab === 'pendientes' && `Solicitudes Pendientes (${solicitudesPendientes.length})`}
                                    {activeTab === 'aprobadas' && `Solicitudes Aprobadas (${solicitudesAprobadas.length})`}
                                    {activeTab === 'rechazadas' && `Solicitudes Rechazadas (${solicitudesRechazadas.length})`}
                                </h3>

                                {(() => {
                                    let solicitudesFiltradas = [];
                                    if (activeTab === 'pendientes') solicitudesFiltradas = solicitudesPendientes;
                                    else if (activeTab === 'aprobadas') solicitudesFiltradas = solicitudesAprobadas;
                                    else if (activeTab === 'rechazadas') solicitudesFiltradas = solicitudesRechazadas;

                                    return solicitudesFiltradas.length === 0 ? (
                                        <div className="text-center py-12">
                                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                            </svg>
                                            <h3 className="mt-2 text-sm font-medium text-gray-900">No hay solicitudes</h3>
                                            <p className="mt-1 text-sm text-gray-500">
                                                No se encontraron solicitudes {activeTab}.
                                            </p>
                                        </div>
                                    ) : (
                                        <ul className="divide-y divide-gray-200">
                                            {solicitudesFiltradas.map((solicitud) => (
                                                <li key={solicitud.id} className="py-4">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex-1">
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center">
                                                                    <svg className="h-10 w-10 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                                                    </svg>
                                                                    <div className="ml-4">
                                                                        <p className="text-sm font-medium text-gray-900">
                                                                            {solicitud.departamento?.codigo} - {solicitud.departamento?.titulo}
                                                                        </p>
                                                                        <p className="text-sm text-gray-500">
                                                                            Cliente: {solicitud.cliente?.nombre || solicitud.cliente?.usuario?.name}
                                                                        </p>
                                                                        <p className="text-xs text-gray-400">
                                                                            {formatFecha(solicitud.created_at)}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getEstadoColor(solicitud.estado)}`}>
                                                                    {solicitud.estado}
                                                                </span>
                                                            </div>
                                                            {solicitud.mensaje && (
                                                                <p className="mt-2 text-sm text-gray-600 ml-14">
                                                                    💬 {solicitud.mensaje}
                                                                </p>
                                                            )}
                                                        </div>
                                                        <div className="ml-4 flex flex-wrap gap-2">
                                                            {solicitud.estado === 'pendiente' && (
                                                                <>
                                                                    <button
                                                                        onClick={() => handleUpdateEstado(solicitud.id, 'aprobada')}
                                                                        className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700"
                                                                    >
                                                                        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                        </svg>
                                                                        Aprobar
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleUpdateEstado(solicitud.id, 'rechazada')}
                                                                        className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700"
                                                                    >
                                                                        Rechazar
                                                                    </button>
                                                                </>
                                                            )}
                                                            {solicitud.estado === 'aprobada' && (
                                                                <>
                                                                    <Link
                                                                        href={route('asesor.cotizaciones.crear', { solicitud_id: solicitud.id })}
                                                                        className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-white bg-purple-600 hover:bg-purple-700"
                                                                    >
                                                                        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                                        </svg>
                                                                        Crear Cotización
                                                                    </Link>
                                                                    <button
                                                                        onClick={() => handleUpdateEstado(solicitud.id, 'finalizada')}
                                                                        className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-white bg-gray-600 hover:bg-gray-700"
                                                                    >
                                                                        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                                        </svg>
                                                                        Finalizar (No Interesado)
                                                                    </button>
                                                                </>
                                                            )}
                                                            {solicitud.estado === 'en_proceso' && (
                                                                <>
                                                                    <Link
                                                                        href={route('asesor.reservas.crear', { cotizacion_id: solicitud.id })}
                                                                        className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700"
                                                                    >
                                                                        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                        </svg>
                                                                        Crear Reserva
                                                                    </Link>
                                                                    <button
                                                                        onClick={() => handleUpdateEstado(solicitud.id, 'rechazada')}
                                                                        className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700"
                                                                    >
                                                                        Rechazar
                                                                    </button>
                                                                </>
                                                            )}
                                                            {(solicitud.estado === 'aprobada' || solicitud.estado === 'aceptada') && !solicitud.reserva && (
                                                                <Link
                                                                    href={route('asesor.reservas.crear', { cotizacion_id: solicitud.id })}
                                                                    className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700"
                                                                >
                                                                    <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                    </svg>
                                                                    Crear Reserva
                                                                </Link>
                                                            )}
                                                            {solicitud.reserva && (
                                                                <Link
                                                                    href={route('asesor.reservas.show', { id: solicitud.reserva.id })}
                                                                    className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-white bg-blue-600 hover:bg-blue-700"
                                                                >
                                                                    Ver Reserva
                                                                </Link>
                                                            )}
                                                            <button
                                                                onClick={() => handleVerDetalle(solicitud)}
                                                                className="inline-flex items-center px-3 py-1 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                                                            >
                                                                Ver Detalles
                                                            </button>
                                                        </div>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    );
                                })()}
                            </div>
                        </div>
                    )}

                    {/* Lista de clientes nuevos */}
                    {activeTab === 'clientes' && (
                        <div className="bg-white shadow overflow-hidden sm:rounded-md">
                            <div className="px-4 py-5 sm:p-6">
                                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                                    Clientes Sin Cotización ({clientesNuevos.length})
                                </h3>

                            {clientesNuevos.length === 0 ? (
                                <div className="text-center py-8">
                                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 0 0-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v2zM2 12h20M2 12a10 10 0 0 1 10-10m-10 10a10 10 0 0 0 10 10M12 2a10 10 0 0 1 10 10" />
                                    </svg>
                                    <h3 className="mt-2 text-sm font-medium text-gray-900">No hay solicitudes pendientes</h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Comienza registrando el contacto de un nuevo cliente
                                    </p>
                                </div>
                            ) : (
                                <div className="grid gap-4">
                                    {clientesNuevos.map((cliente) => (
                                        <div key={cliente.id} className="border border-gray-200 rounded-lg p-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center space-x-3">
                                                        <h4 className="text-lg font-medium text-gray-900">
                                                            {cliente.nombre}
                                                        </h4>
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEstadoColor(cliente.estado)}`}>
                                                            {cliente.estado.replace('_', ' ').toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <div className="mt-2 text-sm text-gray-600">
                                                        <p><strong>Teléfono:</strong> {cliente.telefono}</p>
                                                        {cliente.email && <p><strong>Email:</strong> {cliente.email}</p>}
                                                        <p><strong>Contacto por:</strong> {cliente.medio_contacto}</p>
                                                        {cliente.notas_contacto && <p><strong>Notas:</strong> {cliente.notas_contacto}</p>}
                                                        {cliente.departamentoInteres && (
                                                            <p><strong>Departamento de Interés:</strong>
                                                                {cliente.departamentoInteres?.titulo || cliente.departamentoInteres?.codigo}
                                                                {cliente.departamentoInteres?.precio && ` - $${Number(cliente.departamentoInteres.precio).toLocaleString()}`}
                                                            </p>
                                                        )}
                                                        <p><strong>Fecha:</strong> {new Date(cliente.created_at).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => handleFollowUp(cliente)}
                                                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                    >
                                                        Seguimiento
                                                    </button>
                                                    <Link
                                                        href={route('asesor.cotizaciones.create', { cliente_id: cliente.id })}
                                                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                    >
                                                        Crear Cotización
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    )}

                    {/* Modal para registrar contacto */}
                    {showContactForm && (
                        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                                <div className="mt-3">
                                    <h3 className="text-lg font-medium text-gray-900 text-center mb-4">
                                        Registrar Nuevo Contacto
                                    </h3>
                                    <form onSubmit={handleSubmitContact}>
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Nombre Completo *
                                            </label>
                                            <input
                                                type="text"
                                                value={data.nombre}
                                                onChange={(e) => setData('nombre', e.target.value)}
                                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                                required
                                            />
                                            {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>}
                                        </div>

                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Teléfono *
                                            </label>
                                            <input
                                                type="tel"
                                                value={data.telefono}
                                                onChange={(e) => setData('telefono', e.target.value)}
                                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                                required
                                            />
                                            {errors.telefono && <p className="text-red-500 text-xs mt-1">{errors.telefono}</p>}
                                        </div>

                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700">
                                                DNI (opcional)
                                            </label>
                                            <input
                                                type="text"
                                                value={data.dni}
                                                onChange={(e) => setData('dni', e.target.value)}
                                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                                placeholder="Ej: 12345678"
                                            />
                                            {errors.dni && <p className="text-red-500 text-xs mt-1">{errors.dni}</p>}
                                        </div>

                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Email (opcional)
                                            </label>
                                            <input
                                                type="email"
                                                value={data.email}
                                                onChange={(e) => setData('email', e.target.value)}
                                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                            />
                                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                                        </div>

                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Medio de Contacto *
                                            </label>
                                            <select
                                                value={data.medio_contacto}
                                                onChange={(e) => setData('medio_contacto', e.target.value)}
                                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                            >
                                                <option value="whatsapp">WhatsApp</option>
                                                <option value="telefono">Teléfono</option>
                                                <option value="presencial">Presencial</option>
                                            </select>
                                        </div>

                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Departamento de Interés
                                            </label>
                                            <select
                                                value={data.departamento_interes}
                                                onChange={(e) => setData('departamento_interes', e.target.value)}
                                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                            >
                                                <option value="">Sin especificar</option>
                                                {departamentosInteres.map((depto) => (
                                                    <option key={depto.id} value={depto.id}>
                                                        {depto.nombre} - ${depto.precio?.toLocaleString()}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Notas del Contacto
                                            </label>
                                            <textarea
                                                value={data.notas_contacto}
                                                onChange={(e) => setData('notas_contacto', e.target.value)}
                                                rows={3}
                                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                                placeholder="Detalles del contacto, preferencias, etc."
                                            />
                                        </div>

                                        <div className="flex justify-end space-x-3">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setShowContactForm(false);
                                                    reset();
                                                }}
                                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                                            >
                                                Cancelar
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={processing}
                                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
                                            >
                                                {processing ? 'Registrando...' : 'Registrar'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Modal para seguimiento */}
                    {showFollowUp && selectedClient && (
                        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                                <div className="mt-3">
                                    <h3 className="text-lg font-medium text-gray-900 text-center mb-4">
                                        Actualizar Seguimiento - {selectedClient.nombre}
                                    </h3>
                                    <form onSubmit={submitFollowUp}>
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Estado del Cliente *
                                            </label>
                                            <select
                                                value={data.estado}
                                                onChange={(e) => setData('estado', e.target.value)}
                                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                            >
                                                <option value="contactado">Contactado</option>
                                                <option value="interesado">Interesado</option>
                                                <option value="sin_interes">Sin Interés</option>
                                                <option value="perdido">Perdido</option>
                                            </select>
                                        </div>

                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Notas de Seguimiento
                                            </label>
                                            <textarea
                                                value={data.notas_seguimiento}
                                                onChange={(e) => setData('notas_seguimiento', e.target.value)}
                                                rows={4}
                                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                                placeholder="Detalles de la conversación, próximos pasos, etc."
                                            />
                                        </div>

                                        <div className="flex justify-end space-x-3">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setShowFollowUp(false);
                                                    setSelectedClient(null);
                                                    reset();
                                                }}
                                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                                            >
                                                Cancelar
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={processing}
                                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
                                            >
                                                {processing ? 'Actualizando...' : 'Actualizar'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Modal para responder solicitud con cotización */}
                    {showResponseForm && selectedSolicitud && (
                        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
                                <div className="mt-3">
                                    <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                                        Responder Solicitud - {selectedSolicitud.cliente?.nombre}
                                    </h3>
                                    <div className="mb-4 p-4 bg-blue-50 rounded-md">
                                        <p className="text-sm text-gray-700">
                                            <strong>Departamento:</strong> {selectedSolicitud.departamento?.nombre}
                                        </p>
                                        <p className="text-sm text-gray-700">
                                            <strong>Mensaje del cliente:</strong> {selectedSolicitud.mensaje_solicitud || 'Sin mensaje'}
                                        </p>
                                    </div>
                                    <form onSubmit={submitResponse} className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Precio/Monto *
                                                </label>
                                                <div className="relative">
                                                    <span className="absolute left-3 top-2 text-gray-500">S/</span>
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        value={responseData.monto}
                                                        onChange={(e) => setResponseData('monto', e.target.value)}
                                                        className="pl-10 w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                        required
                                                    />
                                                </div>
                                                {responseErrors.monto && <p className="mt-1 text-sm text-red-600">{responseErrors.monto}</p>}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Descuento (%)
                                                </label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    max="100"
                                                    value={responseData.descuento}
                                                    onChange={(e) => setResponseData('descuento', e.target.value)}
                                                    className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                />
                                                {responseErrors.descuento && <p className="mt-1 text-sm text-red-600">{responseErrors.descuento}</p>}
                                            </div>
                                        </div>

                                        {responseData.monto && responseData.descuento && (
                                            <div className="p-3 bg-green-50 rounded-md">
                                                <p className="text-sm font-medium text-green-800">
                                                    Precio Final: S/ {(parseFloat(responseData.monto) - (parseFloat(responseData.monto) * parseFloat(responseData.descuento || 0) / 100)).toFixed(2)}
                                                </p>
                                            </div>
                                        )}

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Válido hasta
                                            </label>
                                            <input
                                                type="date"
                                                value={responseData.fecha_validez}
                                                onChange={(e) => setResponseData('fecha_validez', e.target.value)}
                                                min={new Date().toISOString().split('T')[0]}
                                                className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            />
                                            {responseErrors.fecha_validez && <p className="mt-1 text-sm text-red-600">{responseErrors.fecha_validez}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Información adicional
                                            </label>
                                            <textarea
                                                value={responseData.notas}
                                                onChange={(e) => setResponseData('notas', e.target.value)}
                                                rows="3"
                                                className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="Detalles del departamento, amenidades, etc."
                                            />
                                            {responseErrors.notas && <p className="mt-1 text-sm text-red-600">{responseErrors.notas}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Condiciones
                                            </label>
                                            <textarea
                                                value={responseData.condiciones}
                                                onChange={(e) => setResponseData('condiciones', e.target.value)}
                                                rows="2"
                                                className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            />
                                            {responseErrors.condiciones && <p className="mt-1 text-sm text-red-600">{responseErrors.condiciones}</p>}
                                        </div>

                                        <div className="flex justify-end space-x-3 pt-4">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setShowResponseForm(false);
                                                    setSelectedSolicitud(null);
                                                    resetResponse();
                                                }}
                                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                                            >
                                                Cancelar
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={processingResponse}
                                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
                                            >
                                                {processingResponse ? 'Enviando...' : 'Enviar Respuesta'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Modal de Detalles */}
                    {showDetalleModal && selectedSolicitud && (
                        <div className="fixed z-10 inset-0 overflow-y-auto">
                            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowDetalleModal(false)}></div>
                                <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
                                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
                                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                        <div className="sm:flex sm:items-start">
                                            <div className="w-full mt-3 text-center sm:mt-0 sm:text-left">
                                                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                                                    Detalles de la Solicitud
                                                </h3>

                                                <div className="space-y-4">
                                                    {/* Información del Cliente */}
                                                    <div className="bg-gray-50 p-4 rounded-lg">
                                                        <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
                                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                            </svg>
                                                            Información del Cliente
                                                        </h4>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                            <div>
                                                                <span className="text-sm text-gray-500">Nombre:</span>
                                                                <p className="font-medium">{selectedSolicitud.cliente?.usuario?.name || 'N/A'}</p>
                                                            </div>
                                                            <div>
                                                                <span className="text-sm text-gray-500">Email:</span>
                                                                <p className="font-medium">{selectedSolicitud.cliente?.usuario?.email || 'N/A'}</p>
                                                            </div>
                                                            <div>
                                                                <span className="text-sm text-gray-500">Teléfono:</span>
                                                                <p className="font-medium text-blue-600">
                                                                    {(() => {
                                                                        const datos = extraerDatosMensaje(selectedSolicitud.mensaje_solicitud || '');
                                                                        return datos.telefono || 'No especificado';
                                                                    })()}
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <span className="text-sm text-gray-500">Estado:</span>
                                                                <p>
                                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                                        selectedSolicitud.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
                                                                        selectedSolicitud.estado === 'en_proceso' ? 'bg-blue-100 text-blue-800' :
                                                                        selectedSolicitud.estado === 'respondida' ? 'bg-green-100 text-green-800' :
                                                                        'bg-gray-100 text-gray-800'
                                                                    }`}>
                                                                        {selectedSolicitud.estado.replace('_', ' ').toUpperCase()}
                                                                    </span>
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Información de la Consulta */}
                                                    <div className="bg-blue-50 p-4 rounded-lg">
                                                        <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
                                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                            Tipo de Consulta
                                                        </h4>
                                                        <p className="text-gray-700">
                                                            {(() => {
                                                                const datos = extraerDatosMensaje(selectedSolicitud.mensaje_solicitud || '');
                                                                return datos.tipoConsulta || 'No especificado';
                                                            })()}
                                                        </p>
                                                    </div>

                                                    {/* Información del Departamento */}
                                                    {selectedSolicitud.departamento && (
                                                        <div className="bg-green-50 p-4 rounded-lg">
                                                            <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
                                                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                                </svg>
                                                                Departamento de Interés
                                                            </h4>
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                                <div>
                                                                    <span className="text-sm text-gray-500">Código:</span>
                                                                    <p className="font-medium">{selectedSolicitud.departamento.codigo}</p>
                                                                </div>
                                                                <div>
                                                                    <span className="text-sm text-gray-500">Precio:</span>
                                                                    <p className="font-medium text-green-600">
                                                                        S/ {parseFloat(selectedSolicitud.departamento.precio).toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                                                                    </p>
                                                                </div>
                                                                <div>
                                                                    <span className="text-sm text-gray-500">Ubicación:</span>
                                                                    <p className="font-medium">{selectedSolicitud.departamento.ubicacion}</p>
                                                                </div>
                                                                <div>
                                                                    <span className="text-sm text-gray-500">Características:</span>
                                                                    <p className="font-medium">
                                                                        {selectedSolicitud.departamento.numero_dormitorios} dorm. •
                                                                        {selectedSolicitud.departamento.numero_banos} baños •
                                                                        {selectedSolicitud.departamento.area_m2} m²
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Mensaje Adicional */}
                                                    {(() => {
                                                        const datos = extraerDatosMensaje(selectedSolicitud.mensaje_solicitud || '');
                                                        return datos.mensajeAdicional ? (
                                                            <div className="bg-purple-50 p-4 rounded-lg">
                                                                <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
                                                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                                                    </svg>
                                                                    Mensaje Adicional del Cliente
                                                                </h4>
                                                                <p className="text-gray-700 whitespace-pre-wrap">{datos.mensajeAdicional}</p>
                                                            </div>
                                                        ) : null;
                                                    })()}

                                                    {/* Fechas */}
                                                    <div className="bg-gray-50 p-4 rounded-lg">
                                                        <h4 className="font-semibold text-gray-700 mb-3">Fechas</h4>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                            <div>
                                                                <span className="text-sm text-gray-500">Fecha de Solicitud:</span>
                                                                <p className="font-medium">{new Date(selectedSolicitud.created_at).toLocaleString('es-PE')}</p>
                                                            </div>
                                                            <div>
                                                                <span className="text-sm text-gray-500">Última Actualización:</span>
                                                                <p className="font-medium">{new Date(selectedSolicitud.updated_at).toLocaleString('es-PE')}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-2">
                                        {selectedSolicitud.estado === 'pendiente' && (
                                            <>
                                                <button
                                                    onClick={() => {
                                                        setShowDetalleModal(false);
                                                        handleUpdateEstado(selectedSolicitud.id, 'respondida');
                                                    }}
                                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                                                >
                                                    Aprobar (Llamar Cliente)
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setShowDetalleModal(false);
                                                        handleUpdateEstado(selectedSolicitud.id, 'rechazada');
                                                    }}
                                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                                                >
                                                    Rechazar
                                                </button>
                                            </>
                                        )}
                                        {selectedSolicitud.estado === 'respondida' && (
                                            <>
                                                <Link
                                                    href={route('asesor.cotizaciones.crear', { solicitud_id: selectedSolicitud.id })}
                                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-purple-600 text-base font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:ml-3 sm:w-auto sm:text-sm"
                                                >
                                                    Crear Cotización
                                                </Link>
                                                <button
                                                    onClick={() => {
                                                        setShowDetalleModal(false);
                                                        handleUpdateEstado(selectedSolicitud.id, 'finalizada');
                                                    }}
                                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-gray-600 text-base font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:ml-3 sm:w-auto sm:text-sm"
                                                >
                                                    Finalizar (No Interesado)
                                                </button>
                                            </>
                                        )}
                                        <button
                                            onClick={() => setShowDetalleModal(false)}
                                            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
                                        >
                                            Cerrar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AsesorLayout>
    );
}
