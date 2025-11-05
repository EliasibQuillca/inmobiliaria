import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AsesorLayout from '../../../Layouts/AsesorLayout';

export default function DetalleCliente({ auth, cliente }) {
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showFollowUpModal, setShowFollowUpModal] = useState(false);

    const { data, setData, patch, processing, reset } = useForm({
        estado: cliente.estado || 'contactado',
        notas_seguimiento: cliente.notas_seguimiento || '',
    });

    const handleFollowUp = (e) => {
        e.preventDefault();
        patch(route('asesor.solicitudes.seguimiento', cliente.id), {
            onSuccess: () => {
                setShowFollowUpModal(false);
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
            'cita_agendada': 'bg-purple-100 text-purple-800'
        };
        return colors[estado] || 'bg-gray-100 text-gray-800';
    };

    const formatCurrency = (amount) => {
        if (!amount) return 'No especificado';
        return new Intl.NumberFormat('es-PE', {
            style: 'currency',
            currency: 'PEN',
            minimumFractionDigits: 0
        }).format(amount);
    };

    return (
        <AsesorLayout user={auth.user}>
            <Head title={`Cliente: ${cliente.nombre}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="md:flex md:items-center md:justify-between">
                            <div className="flex-1 min-w-0">
                                <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                                    {cliente.nombre}
                                </h2>
                                <div className="mt-1 flex items-center space-x-3">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEstadoColor(cliente.estado)}`}>
                                        {cliente.estado?.replace('_', ' ').toUpperCase()}
                                    </span>
                                    <span className="text-sm text-gray-500">
                                        Cliente desde {new Date(cliente.fecha_registro).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                            <div className="mt-4 flex md:mt-0 md:ml-4 space-x-3">
                                <Link
                                    href="/asesor/clientes"
                                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                                >
                                    ← Volver a Clientes
                                </Link>
                                <button
                                    onClick={() => setShowFollowUpModal(true)}
                                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                                >
                                    Actualizar Seguimiento
                                </button>
                                <Link
                                    href={route('asesor.cotizaciones.create', { cliente_id: cliente.id })}
                                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                                >
                                    + Crear Cotización
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Información del Cliente */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Datos Personales */}
                            <div className="bg-white shadow rounded-lg">
                                <div className="px-6 py-4 border-b border-gray-200">
                                    <h3 className="text-lg font-medium text-gray-900">Información Personal</h3>
                                </div>
                                <div className="px-6 py-4">
                                    <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Nombre Completo</dt>
                                            <dd className="mt-1 text-sm text-gray-900">{cliente.nombre}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Documento</dt>
                                            <dd className="mt-1 text-sm text-gray-900">{cliente.dni}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Teléfono</dt>
                                            <dd className="mt-1 text-sm text-gray-900">{cliente.telefono}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Email</dt>
                                            <dd className="mt-1 text-sm text-gray-900">{cliente.email || 'No proporcionado'}</dd>
                                        </div>
                                        <div className="md:col-span-2">
                                            <dt className="text-sm font-medium text-gray-500">Dirección</dt>
                                            <dd className="mt-1 text-sm text-gray-900">{cliente.direccion || 'No proporcionada'}</dd>
                                        </div>
                                    </dl>
                                </div>
                            </div>

                            {/* Preferencias de Propiedad */}
                            <div className="bg-white shadow rounded-lg">
                                <div className="px-6 py-4 border-b border-gray-200">
                                    <h3 className="text-lg font-medium text-gray-900">Preferencias de Propiedad</h3>
                                </div>
                                <div className="px-6 py-4">
                                    <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Tipo de Propiedad</dt>
                                            <dd className="mt-1 text-sm text-gray-900 capitalize">{cliente.tipo_propiedad}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Habitaciones Deseadas</dt>
                                            <dd className="mt-1 text-sm text-gray-900">{cliente.habitaciones_deseadas || 'Sin preferencia'}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Presupuesto Mínimo</dt>
                                            <dd className="mt-1 text-sm text-gray-900">{formatCurrency(cliente.presupuesto_min)}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Presupuesto Máximo</dt>
                                            <dd className="mt-1 text-sm text-gray-900">{formatCurrency(cliente.presupuesto_max)}</dd>
                                        </div>
                                        <div className="md:col-span-2">
                                            <dt className="text-sm font-medium text-gray-500">Zonas Preferidas</dt>
                                            <dd className="mt-1 text-sm text-gray-900">{cliente.zona_preferida || 'Sin preferencia específica'}</dd>
                                        </div>
                                    </dl>
                                </div>
                            </div>

                            {/* Historial de Cotizaciones */}
                            <div className="bg-white shadow rounded-lg">
                                <div className="px-6 py-4 border-b border-gray-200">
                                    <h3 className="text-lg font-medium text-gray-900">Historial de Cotizaciones</h3>
                                </div>
                                <div className="px-6 py-4">
                                    {cliente.cotizaciones && cliente.cotizaciones.length > 0 ? (
                                        <div className="space-y-4">
                                            {cliente.cotizaciones.map((cotizacion) => (
                                                <div key={cotizacion.id} className="border border-gray-200 rounded-lg p-4">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <h4 className="font-medium text-gray-900">
                                                                Cotización #{cotizacion.id}
                                                            </h4>
                                                            <p className="text-sm text-gray-600">
                                                                {cotizacion.departamento?.nombre}
                                                            </p>
                                                            <p className="text-sm text-gray-600">
                                                                {formatCurrency(cotizacion.monto)}
                                                            </p>
                                                        </div>
                                                        <div className="text-right">
                                                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(cotizacion.estado)}`}>
                                                                {cotizacion.estado}
                                                            </span>
                                                            <p className="text-xs text-gray-500 mt-1">
                                                                {new Date(cotizacion.fecha).toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-500 text-center py-4">
                                            No hay cotizaciones para este cliente aún.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Panel Lateral */}
                        <div className="space-y-6">
                            {/* Información de Contacto */}
                            <div className="bg-white shadow rounded-lg">
                                <div className="px-6 py-4 border-b border-gray-200">
                                    <h3 className="text-lg font-medium text-gray-900">Información de Contacto</h3>
                                </div>
                                <div className="px-6 py-4 space-y-3">
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Medio de Contacto</dt>
                                        <dd className="mt-1 text-sm text-gray-900 capitalize">{cliente.medio_contacto}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Notas de Primer Contacto</dt>
                                        <dd className="mt-1 text-sm text-gray-900">{cliente.notas_contacto || 'Sin notas'}</dd>
                                    </div>
                                    {cliente.notas_seguimiento && (
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Último Seguimiento</dt>
                                            <dd className="mt-1 text-sm text-gray-900">{cliente.notas_seguimiento}</dd>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Acciones Rápidas */}
                            <div className="bg-white shadow rounded-lg">
                                <div className="px-6 py-4 border-b border-gray-200">
                                    <h3 className="text-lg font-medium text-gray-900">Acciones Rápidas</h3>
                                </div>
                                <div className="px-6 py-4 space-y-3">
                                    <Link
                                        href={route('asesor.cotizaciones.create', { cliente_id: cliente.id })}
                                        className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                                    >
                                        💰 Nueva Cotización
                                    </Link>
                                    <button
                                        onClick={() => setShowFollowUpModal(true)}
                                        className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                                    >
                                        📞 Actualizar Seguimiento
                                    </button>
                                    <a
                                        href={`https://wa.me/${cliente.telefono.replace(/[^0-9]/g, '')}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full inline-flex items-center justify-center px-4 py-2 border border-green-300 rounded-md shadow-sm text-sm font-medium text-green-700 bg-green-50 hover:bg-green-100"
                                    >
                                        📱 WhatsApp
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Modal de Seguimiento */}
                    {showFollowUpModal && (
                        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                                <div className="mt-3">
                                    <h3 className="text-lg font-medium text-gray-900 text-center mb-4">
                                        Actualizar Seguimiento - {cliente.nombre}
                                    </h3>
                                    <form onSubmit={handleFollowUp}>
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Estado del Cliente *
                                            </label>
                                            <select
                                                value={data.estado}
                                                onChange={(e) => setData('estado', e.target.value)}
                                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                            >
                                                <option value="contactado">Contactado</option>
                                                <option value="interesado">Interesado</option>
                                                <option value="sin_interes">Sin Interés</option>
                                                <option value="perdido">Perdido</option>
                                                <option value="cita_agendada">Cita Agendada</option>
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
                                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="Detalles de la conversación, próximos pasos, etc."
                                            />
                                        </div>

                                        <div className="flex justify-end space-x-3">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setShowFollowUpModal(false);
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
