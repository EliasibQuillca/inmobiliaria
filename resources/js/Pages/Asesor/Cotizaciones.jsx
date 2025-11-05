import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AsesorLayout from '../../Layouts/AsesorLayout';

export default function Cotizaciones({ auth, cotizaciones = [], mostrandoHistorial = false }) {
    const [selectedCotizacion, setSelectedCotizacion] = useState(null);
    const [showUpdateModal, setShowUpdateModal] = useState(false);

    const { data, setData, patch, processing, reset } = useForm({
        estado: '',
        notas: ''
    });

    const handleUpdateEstado = (cotizacion) => {
        setSelectedCotizacion(cotizacion);
        setData({
            estado: cotizacion.estado,
            notas: cotizacion.notas || ''
        });
        setShowUpdateModal(true);
    };

    const submitUpdate = (e) => {
        e.preventDefault();
        patch(`/asesor/cotizaciones/${selectedCotizacion.id}/estado`, {
            onSuccess: () => {
                setShowUpdateModal(false);
                setSelectedCotizacion(null);
                reset();
            }
        });
    };

    const getEstadoColor = (estado) => {
        const colors = {
            'pendiente': 'bg-yellow-100 text-yellow-800',
            'aceptada': 'bg-green-100 text-green-800',
            'rechazada': 'bg-red-100 text-red-800',
            'en_proceso': 'bg-blue-100 text-blue-800',
            'completada': 'bg-purple-100 text-purple-800',
            'cancelada': 'bg-orange-100 text-orange-800',
            'expirada': 'bg-gray-100 text-gray-800'
        };
        return colors[estado] || 'bg-gray-100 text-gray-800';
    };

    const getEstadoTexto = (estado) => {
        const textos = {
            'pendiente': 'Pendiente',
            'aceptada': 'Aceptada',
            'rechazada': 'Rechazada',
            'en_proceso': 'En Proceso',
            'completada': 'Finalizada',
            'cancelada': 'Cancelada',
            'expirada': 'Expirada'
        };
        return textos[estado] || estado;
    };

    const formatearMoneda = (monto) => {
        return new Intl.NumberFormat('es-PE', {
            style: 'currency',
            currency: 'PEN',
            minimumFractionDigits: 0
        }).format(monto);
    };

    return (
        <AsesorLayout user={auth.user}>
            <Head title="Cotizaciones" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="md:flex md:items-center md:justify-between">
                            <div className="flex-1 min-w-0">
                                <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                                    {mostrandoHistorial ? 'Historial de Cotizaciones' : 'Mis Cotizaciones Activas'}
                                </h2>
                                <p className="mt-1 text-sm text-gray-500">
                                    {mostrandoHistorial
                                        ? 'Cotizaciones procesadas, finalizadas o archivadas'
                                        : 'Gestiona las cotizaciones de departamentos para tus clientes'
                                    }
                                </p>
                            </div>
                            <div className="mt-4 flex md:mt-0 md:ml-4 space-x-3">
                                {/* Botón para alternar vista */}
                                <Link
                                    href={`/asesor/cotizaciones${!mostrandoHistorial ? '?historial=1' : ''}`}
                                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    {mostrandoHistorial ? (
                                        <>
                                            <i className="fas fa-list mr-2"></i>
                                            Ver Activas
                                        </>
                                    ) : (
                                        <>
                                            <i className="fas fa-history mr-2"></i>
                                            Ver Historial
                                        </>
                                    )}
                                </Link>

                                {!mostrandoHistorial && (
                                    <Link
                                        href="/asesor/cotizaciones/crear"
                                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                        <svg className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                        Nueva Cotización
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Estadísticas rápidas */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        {(mostrandoHistorial ? [
                            {
                                name: 'Total Historial',
                                value: cotizaciones.length,
                                color: 'bg-purple-500'
                            },
                            {
                                name: 'En Proceso',
                                value: cotizaciones.filter(c => c.estado === 'en_proceso').length,
                                color: 'bg-blue-500'
                            },
                            {
                                name: 'Finalizadas',
                                value: cotizaciones.filter(c => c.estado === 'completada').length,
                                color: 'bg-green-500'
                            },
                            {
                                name: 'Canceladas',
                                value: cotizaciones.filter(c => c.estado === 'cancelada').length,
                                color: 'bg-red-500'
                            }
                        ] : [
                            {
                                name: 'Total',
                                value: cotizaciones.length,
                                color: 'bg-blue-500'
                            },
                            {
                                name: 'Pendientes',
                                value: cotizaciones.filter(c => c.estado === 'pendiente').length,
                                color: 'bg-yellow-500'
                            },
                            {
                                name: 'Aceptadas',
                                value: cotizaciones.filter(c => c.estado === 'aceptada').length,
                                color: 'bg-green-500'
                            },
                            {
                                name: 'Rechazadas',
                                value: cotizaciones.filter(c => c.estado === 'rechazada').length,
                                color: 'bg-red-500'
                            }
                        ]).map((stat) => (
                            <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
                                <div className="p-5">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <div className={`w-8 h-8 ${stat.color} rounded-full flex items-center justify-center`}>
                                                <span className="text-white text-sm font-bold">{stat.value}</span>
                                            </div>
                                        </div>
                                        <div className="ml-5 w-0 flex-1">
                                            <dl>
                                                <dt className="text-sm font-medium text-gray-500 truncate">
                                                    {stat.name}
                                                </dt>
                                                <dd className="text-lg font-medium text-gray-900">
                                                    {stat.value} cotizaciones
                                                </dd>
                                            </dl>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Lista de cotizaciones */}
                    <div className="bg-white shadow overflow-hidden sm:rounded-md">
                        {cotizaciones.length === 0 ? (
                            <div className="text-center py-12">
                                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <h3 className="mt-2 text-sm font-medium text-gray-900">No hay cotizaciones</h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    Comienza creando una nueva cotización para tus clientes
                                </p>
                                <div className="mt-6">
                                    <Link
                                        href="/asesor/cotizaciones/crear"
                                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                        <svg className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                        Nueva Cotización
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <ul className="divide-y divide-gray-200">
                                {cotizaciones.map((cotizacion) => (
                                    <li key={cotizacion.id} className="px-6 py-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-3">
                                                    <h3 className="text-lg font-medium text-gray-900">
                                                        Cotización #{cotizacion.id}
                                                    </h3>
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEstadoColor(cotizacion.estado)}`}>
                                                        {getEstadoTexto(cotizacion.estado)}
                                                    </span>
                                                </div>

                                                <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                                                    <div>
                                                        <p><strong>Cliente:</strong> {cotizacion.cliente?.nombre || 'No especificado'}</p>
                                                        <p><strong>Departamento:</strong> {cotizacion.departamento?.nombre || 'No especificado'}</p>
                                                        <p><strong>Fecha:</strong> {cotizacion.created_at ? new Date(cotizacion.created_at).toLocaleDateString() : 'No disponible'}</p>
                                                    </div>
                                                    <div>
                                                        <p><strong>Monto:</strong> {formatearMoneda(cotizacion.monto)}</p>
                                                        {cotizacion.descuento > 0 && (
                                                            <p><strong>Descuento:</strong> {formatearMoneda(cotizacion.descuento)}</p>
                                                        )}
                                                        <p><strong>Total:</strong> {formatearMoneda(cotizacion.monto - (cotizacion.descuento || 0))}</p>
                                                        <p><strong>Válida hasta:</strong> {cotizacion.fecha_validez ? new Date(cotizacion.fecha_validez).toLocaleDateString() : 'No especificada'}</p>
                                                    </div>
                                                </div>

                                                {/* Información adicional para historial */}
                                                {mostrandoHistorial && (
                                                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-gray-600">
                                                            {cotizacion.estado === 'en_proceso' && cotizacion.reserva && (
                                                                <div>
                                                                    <p className="font-medium text-blue-700">📋 Reserva Activa</p>
                                                                    <p>Estado: {cotizacion.reserva.estado}</p>
                                                                    <p>Monto reserva: {formatearMoneda(cotizacion.reserva.monto_reserva)}</p>
                                                                </div>
                                                            )}
                                                            {cotizacion.estado === 'completada' && cotizacion.reserva?.venta && (
                                                                <div>
                                                                    <p className="font-medium text-green-700">✅ Venta Finalizada</p>
                                                                    <p>Fecha venta: {cotizacion.reserva.venta.fecha_venta ? new Date(cotizacion.reserva.venta.fecha_venta).toLocaleDateString() : 'No disponible'}</p>
                                                                    <p>Monto final: {formatearMoneda(cotizacion.reserva.venta.monto_final)}</p>
                                                                </div>
                                                            )}
                                                            <div>
                                                                <p className="font-medium">📅 Actualizado</p>
                                                                <p>{cotizacion.updated_at ? new Date(cotizacion.updated_at).toLocaleString() : 'No disponible'}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                {cotizacion.notas && (
                                                    <div className="mt-2">
                                                        <p className="text-sm text-gray-600">
                                                            <strong>Notas:</strong> {cotizacion.notas}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex space-x-2">
                                                {!mostrandoHistorial ? (
                                                    <>
                                                        <button
                                                            onClick={() => handleUpdateEstado(cotizacion)}
                                                            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                        >
                                                            <i className="fas fa-edit mr-1"></i>
                                                            Estado
                                                        </button>

                                                        <Link
                                                            href={`/asesor/cotizaciones/${cotizacion.id}/editar`}
                                                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                        >
                                                            <i className="fas fa-pencil-alt mr-1"></i>
                                                            Editar
                                                        </Link>

                                                        {cotizacion.estado === 'aceptada' && (
                                                            <Link
                                                                href={`/asesor/reservas/crear?cotizacion_id=${cotizacion.id}`}
                                                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                                            >
                                                                <i className="fas fa-calendar-plus mr-1"></i>
                                                                Reservar
                                                            </Link>
                                                        )}
                                                    </>
                                                ) : (
                                                    <div className="flex items-center text-sm text-gray-500">
                                                        <i className="fas fa-archive mr-2"></i>
                                                        <span>Cotización archivada</span>
                                                        {cotizacion.estado === 'completada' && (
                                                            <span className="ml-2 text-green-600 font-medium">
                                                                <i className="fas fa-check-circle mr-1"></i>
                                                                Proceso completado
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Modal para actualizar estado */}
                    {showUpdateModal && selectedCotizacion && (
                        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                                <div className="mt-3">
                                    <h3 className="text-lg font-medium text-gray-900 text-center mb-4">
                                        Actualizar Estado - Cotización #{selectedCotizacion.id}
                                    </h3>
                                    <form onSubmit={submitUpdate}>
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Estado *
                                            </label>
                                            <select
                                                value={data.estado}
                                                onChange={(e) => setData('estado', e.target.value)}
                                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                                required
                                            >
                                                <option value="pendiente">Pendiente</option>
                                                <option value="aceptada">Aceptada</option>
                                                <option value="rechazada">Rechazada</option>
                                                <option value="expirada">Expirada</option>
                                            </select>
                                        </div>

                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Notas Adicionales
                                            </label>
                                            <textarea
                                                value={data.notas}
                                                onChange={(e) => setData('notas', e.target.value)}
                                                rows={3}
                                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                                placeholder="Observaciones sobre el cambio de estado..."
                                            />
                                        </div>

                                        <div className="flex justify-end space-x-3">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setShowUpdateModal(false);
                                                    setSelectedCotizacion(null);
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
                </div>
            </div>
        </AsesorLayout>
    );
}
