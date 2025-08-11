import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AsesorLayout from '../../Layouts/AsesorLayout';

export default function Solicitudes({ auth, clientesNuevos = [], departamentosInteres = [] }) {
    const [showContactForm, setShowContactForm] = useState(false);
    const [selectedClient, setSelectedClient] = useState(null);
    const [showFollowUp, setShowFollowUp] = useState(false);

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
        patch(route('asesor.solicitudes.seguimiento', selectedClient.id), {
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
            'cita_agendada': 'bg-purple-100 text-purple-800'
        };
        return colors[estado] || 'bg-gray-100 text-gray-800';
    };

    return (
        <AsesorLayout user={auth.user}>
            <Head title="Solicitudes de Contacto" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="md:flex md:items-center md:justify-between">
                            <div className="flex-1 min-w-0">
                                <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                                    Solicitudes de Contacto
                                </h2>
                                <p className="mt-1 text-sm text-gray-500">
                                    Gestiona las solicitudes e inquietudes de tus clientes
                                </p>
                            </div>
                            <div className="mt-4 flex md:mt-0 md:ml-4">
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

                    {/* Lista de clientes nuevos */}
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
                </div>
            </div>
        </AsesorLayout>
    );
}
