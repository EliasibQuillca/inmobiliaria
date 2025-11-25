import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AsesorLayout from '../../Layouts/AsesorLayout';

export default function Ventas({ auth, ventas = [] }) {
    const [selectedVenta, setSelectedVenta] = useState(null);
    const [showDocumentModal, setShowDocumentModal] = useState(false);

    const { data, setData, patch, processing, reset } = useForm({
        documentos_entregados: false,
        observaciones: ''
    });

    const handleUpdateDocuments = (venta) => {
        setSelectedVenta(venta);
        setData({
            documentos_entregados: venta.documentos_entregados,
            observaciones: venta.observaciones || ''
        });
        setShowDocumentModal(true);
    };

    const submitDocumentUpdate = (e) => {
        e.preventDefault();
        patch(route('asesor.ventas.documentos', selectedVenta.id), {
            onSuccess: () => {
                setShowDocumentModal(false);
                setSelectedVenta(null);
                reset();
            }
        });
    };

    const marcarDocumentosEntregados = (ventaId) => {
        if (confirm('¿Estás seguro de marcar los documentos como entregados? Esta acción marcará el departamento como vendido.')) {
            patch(route('asesor.ventas.entregar-documentos', ventaId), {
                preserveScroll: true
            });
        }
    };

    const getEstadoColor = (documentos_entregados) => {
        return documentos_entregados
            ? 'bg-green-100 text-green-800'
            : 'bg-yellow-100 text-yellow-800';
    };

    const formatearMoneda = (monto) => {
        return new Intl.NumberFormat('es-PE', {
            style: 'currency',
            currency: 'PEN',
            minimumFractionDigits: 0
        }).format(monto);
    };

    const calcularComision = (monto, porcentaje = 3) => {
        return monto * (porcentaje / 100);
    };

    const totalVentas = ventas.reduce((sum, venta) => sum + parseFloat(venta.monto_final || 0), 0);
    const totalComisiones = ventas.reduce((sum, venta) => sum + calcularComision(parseFloat(venta.monto_final || 0)), 0);
    const ventasDelMes = ventas.filter(venta => {
        const fechaVenta = new Date(venta.fecha_venta);
        const fechaActual = new Date();
        return fechaVenta.getMonth() === fechaActual.getMonth() &&
               fechaVenta.getFullYear() === fechaActual.getFullYear();
    });

    return (
        <AsesorLayout user={auth.user}>
            <Head title="Ventas" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="flex-1 min-w-0">
                                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold leading-7 text-gray-900">
                                    Mis Ventas
                                </h2>
                                <p className="mt-1 text-sm text-gray-500">
                                    Registro de ventas formalizadas y documentos entregados
                                </p>
                            </div>
                            <div className="flex">
                                <Link
                                    href={route('asesor.ventas.create')}
                                    className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                >
                                    <svg className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    Registrar Venta
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Estadísticas */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                            <span className="text-white text-sm">🏡</span>
                                        </div>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">
                                                Total Ventas
                                            </dt>
                                            <dd className="text-lg font-medium text-gray-900">
                                                {ventas.length}
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                            <span className="text-white text-sm">📅</span>
                                        </div>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">
                                                Ventas del Mes
                                            </dt>
                                            <dd className="text-lg font-medium text-gray-900">
                                                {ventasDelMes.length}
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                                            <span className="text-white text-sm">💰</span>
                                        </div>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">
                                                Valor Total
                                            </dt>
                                            <dd className="text-lg font-medium text-gray-900">
                                                {formatearMoneda(totalVentas)}
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                                            <span className="text-white text-sm">💳</span>
                                        </div>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">
                                                Comisiones
                                            </dt>
                                            <dd className="text-lg font-medium text-gray-900">
                                                {formatearMoneda(totalComisiones)}
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Lista de ventas */}
                    <div className="bg-white shadow overflow-hidden sm:rounded-md">
                        {ventas.length === 0 ? (
                            <div className="text-center py-12">
                                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                                <h3 className="mt-2 text-sm font-medium text-gray-900">No hay ventas registradas</h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    Comienza registrando tu primera venta formalizada
                                </p>
                                <div className="mt-6">
                                    <Link
                                        href={route('asesor.ventas.create')}
                                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                    >
                                        <svg className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                        Registrar Primera Venta
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <ul className="divide-y divide-gray-200">
                                {ventas.map((venta) => (
                                    <li key={venta.id} className="px-6 py-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-3">
                                                    <h3 className="text-lg font-medium text-gray-900">
                                                        Venta #{venta.id}
                                                    </h3>
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEstadoColor(venta.documentos_entregados)}`}>
                                                        {venta.documentos_entregados ? 'DOCUMENTOS ENTREGADOS' : 'PENDIENTE DOCUMENTOS'}
                                                    </span>
                                                </div>

                                                <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                                                    <div>
                                                        <p><strong>Cliente:</strong> {venta.reserva?.cotizacion?.cliente?.nombre || 'No especificado'}</p>
                                                        <p><strong>Departamento:</strong> {venta.reserva?.cotizacion?.departamento?.nombre || 'No especificado'}</p>
                                                        <p><strong>Fecha de Venta:</strong> {new Date(venta.fecha_venta).toLocaleDateString()}</p>
                                                    </div>
                                                    <div>
                                                        <p><strong>Monto Final:</strong> {formatearMoneda(venta.monto_final)}</p>
                                                        <p><strong>Comisión (3%):</strong> {formatearMoneda(calcularComision(venta.monto_final))}</p>
                                                        <p><strong>Reserva:</strong> #{venta.reserva?.id}</p>
                                                    </div>
                                                </div>

                                                {venta.observaciones && (
                                                    <div className="mt-2">
                                                        <p className="text-sm text-gray-600">
                                                            <strong>Observaciones:</strong> {venta.observaciones}
                                                        </p>
                                                    </div>
                                                )}

                                                {venta.documentos_entregados && venta.fecha_entrega_documentos && (
                                                    <div className="mt-2 p-2 bg-green-50 rounded-md">
                                                        <p className="text-sm text-green-800">
                                                            <svg className="inline h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                            <strong>Documentos entregados:</strong> {new Date(venta.fecha_entrega_documentos).toLocaleString('es-PE')}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex space-x-2">
                                                {!venta.documentos_entregados && (
                                                    <button
                                                        onClick={() => marcarDocumentosEntregados(venta.id)}
                                                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                                        title="Marcar documentos como entregados"
                                                    >
                                                        <svg className="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        Marcar Entregado
                                                    </button>
                                                )}

                                                <button
                                                    onClick={() => handleUpdateDocuments(venta)}
                                                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                >
                                                    Gestionar Documentos
                                                </button>

                                                <Link
                                                    href={route('asesor.ventas.show', venta.id)}
                                                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                >
                                                    Ver Detalles
                                                </Link>

                                                <Link
                                                    href={route('asesor.ventas.edit', venta.id)}
                                                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                                >
                                                    Editar
                                                </Link>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Modal para gestión de documentos */}
                    {showDocumentModal && selectedVenta && (
                        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                                <div className="mt-3">
                                    <h3 className="text-lg font-medium text-gray-900 text-center mb-4">
                                        Gestión de Documentos - Venta #{selectedVenta.id}
                                    </h3>
                                    <form onSubmit={submitDocumentUpdate}>
                                        <div className="mb-4">
                                            <label className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={data.documentos_entregados}
                                                    onChange={(e) => setData('documentos_entregados', e.target.checked)}
                                                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                                />
                                                <span className="ml-2 text-sm text-gray-700">
                                                    Documentos físicos entregados al cliente
                                                </span>
                                            </label>
                                            <p className="mt-1 text-xs text-gray-500">
                                                Al marcar esta opción, el departamento se marcará como "vendido"
                                            </p>
                                        </div>

                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Observaciones
                                            </label>
                                            <textarea
                                                value={data.observaciones}
                                                onChange={(e) => setData('observaciones', e.target.value)}
                                                rows={4}
                                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                                placeholder="Detalles sobre la entrega de documentos, notas adicionales..."
                                            />
                                        </div>

                                        <div className="flex justify-end space-x-3">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setShowDocumentModal(false);
                                                    setSelectedVenta(null);
                                                    reset();
                                                }}
                                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                                            >
                                                Cancelar
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={processing}
                                                className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50"
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
