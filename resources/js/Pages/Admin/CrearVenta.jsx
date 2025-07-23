import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function CrearVenta({ auth, reservas }) {
    const [formData, setFormData] = useState({
        reserva_id: '',
        fecha_venta: new Date().toISOString().split('T')[0],
        monto_final: '',
        documentos_entregados: false
    });

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    // Lista de reservas disponibles para venta
    const listaReservas = reservas || [];

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        // Limpiar error del campo cuando el usuario empiece a escribir
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }

        // Si selecciona una reserva, auto-completar el monto
        if (name === 'reserva_id' && value) {
            const reservaSeleccionada = listaReservas.find(r => r.id == value);
            if (reservaSeleccionada && reservaSeleccionada.cotizacion) {
                setFormData(prev => ({
                    ...prev,
                    monto_final: reservaSeleccionada.cotizacion.monto_total || ''
                }));
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        router.post('/admin/ventas', formData, {
            onSuccess: () => {
                console.log('Venta creada exitosamente');
                // La redirección se maneja en el backend
            },
            onError: (errores) => {
                console.error('Errores de validación:', errores);
                setErrors(errores);
            },
            onFinish: () => {
                setLoading(false);
            }
        });
    };

    // Formatear precio
    const formatearPrecio = (precio) => {
        if (!precio) return 'No disponible';
        return new Intl.NumberFormat('es-PE', {
            style: 'currency',
            currency: 'PEN'
        }).format(precio);
    };

    // Formatear fecha
    const formatearFecha = (fecha) => {
        return new Date(fecha).toLocaleDateString('es-PE');
    };

    return (
        <AdminLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Crear Nueva Venta
                </h2>
            }
        >
            <Head title="Crear Venta - Admin" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {/* Breadcrumb */}
                            <nav className="flex mb-6" aria-label="Breadcrumb">
                                <ol className="inline-flex items-center space-x-1 md:space-x-3">
                                    <li className="inline-flex items-center">
                                        <Link href="/admin/ventas" className="text-gray-700 hover:text-gray-900">
                                            Ventas
                                        </Link>
                                    </li>
                                    <li>
                                        <div className="flex items-center">
                                            <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                            </svg>
                                            <span className="text-gray-500">Crear Venta</span>
                                        </div>
                                    </li>
                                </ol>
                            </nav>

                            {/* Alert si no hay reservas */}
                            {listaReservas.length === 0 && (
                                <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-md p-4">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <h3 className="text-sm font-medium text-yellow-800">
                                                No hay reservas disponibles
                                            </h3>
                                            <div className="mt-2 text-sm text-yellow-700">
                                                <p>No hay reservas confirmadas disponibles para crear una venta. Las reservas deben estar en estado "confirmada" y no tener una venta asociada.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Selección de Reserva */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Reserva a convertir en venta *
                                    </label>
                                    <select
                                        name="reserva_id"
                                        value={formData.reserva_id}
                                        onChange={handleChange}
                                        className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${errors.reserva_id ? 'border-red-500' : ''}`}
                                        required
                                        disabled={listaReservas.length === 0}
                                    >
                                        <option value="">Seleccionar reserva...</option>
                                        {listaReservas.map(reserva => (
                                            <option key={reserva.id} value={reserva.id}>
                                                Reserva #{reserva.id} - {reserva.cotizacion?.departamento?.titulo || 'Propiedad N/A'}
                                                - Cliente: {reserva.cotizacion?.cliente?.nombre || 'N/A'}
                                                - {formatearPrecio(reserva.cotizacion?.monto_total)}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.reserva_id && (
                                        <p className="mt-1 text-sm text-red-600">{errors.reserva_id}</p>
                                    )}
                                </div>

                                {/* Detalles de la reserva seleccionada */}
                                {formData.reserva_id && (
                                    <div className="bg-gray-50 p-4 rounded-md">
                                        {(() => {
                                            const reservaSeleccionada = listaReservas.find(r => r.id == formData.reserva_id);
                                            if (!reservaSeleccionada) return null;

                                            return (
                                                <div>
                                                    <h4 className="text-lg font-medium text-gray-900 mb-3">Detalles de la Reserva</h4>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div>
                                                            <p className="text-sm text-gray-600">Propiedad:</p>
                                                            <p className="font-medium">{reservaSeleccionada.cotizacion?.departamento?.titulo || 'N/A'}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-gray-600">Cliente:</p>
                                                            <p className="font-medium">{reservaSeleccionada.cotizacion?.cliente?.nombre || 'N/A'}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-gray-600">Asesor:</p>
                                                            <p className="font-medium">{reservaSeleccionada.cotizacion?.asesor?.usuario?.name || 'N/A'}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-gray-600">Fecha de Reserva:</p>
                                                            <p className="font-medium">{formatearFecha(reservaSeleccionada.fecha_reserva)}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })()}
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Fecha de Venta */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Fecha de Venta *
                                        </label>
                                        <input
                                            type="date"
                                            name="fecha_venta"
                                            value={formData.fecha_venta}
                                            onChange={handleChange}
                                            max={new Date().toISOString().split('T')[0]}
                                            className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${errors.fecha_venta ? 'border-red-500' : ''}`}
                                            required
                                        />
                                        {errors.fecha_venta && (
                                            <p className="mt-1 text-sm text-red-600">{errors.fecha_venta}</p>
                                        )}
                                    </div>

                                    {/* Monto Final */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Monto Final (S/) *
                                        </label>
                                        <input
                                            type="number"
                                            name="monto_final"
                                            value={formData.monto_final}
                                            onChange={handleChange}
                                            step="0.01"
                                            min="0"
                                            className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${errors.monto_final ? 'border-red-500' : ''}`}
                                            required
                                        />
                                        {errors.monto_final && (
                                            <p className="mt-1 text-sm text-red-600">{errors.monto_final}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Documentos Entregados */}
                                <div>
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            name="documentos_entregados"
                                            checked={formData.documentos_entregados}
                                            onChange={handleChange}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        />
                                        <span className="ml-2 text-sm text-gray-700">Documentos entregados al cliente</span>
                                    </label>
                                </div>

                                {/* Botones */}
                                <div className="flex justify-end space-x-3 pt-6">
                                    <Link
                                        href="/admin/ventas"
                                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                                    >
                                        Cancelar
                                    </Link>
                                    <button
                                        type="submit"
                                        disabled={loading || listaReservas.length === 0}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        {loading ? 'Creando...' : 'Crear Venta'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
