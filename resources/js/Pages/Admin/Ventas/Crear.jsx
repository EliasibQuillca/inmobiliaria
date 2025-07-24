import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function Crear({ auth, reservasDisponibles }) {
    const [formData, setFormData] = useState({
        reserva_id: '',
        fecha_venta: new Date().toISOString().split('T')[0],
        monto_final: '',
        documentos_entregados: false
    });

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [selectedReserva, setSelectedReserva] = useState(null);

    // Lista de reservas disponibles para venta
    const listaReservas = reservasDisponibles || [];

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

        // Si se selecciona una reserva, llenar automáticamente el monto
        if (name === 'reserva_id' && value) {
            const reserva = listaReservas.find(r => r.id == value);
            if (reserva) {
                setSelectedReserva(reserva);
                setFormData(prev => ({
                    ...prev,
                    monto_final: reserva.cotizacion?.monto_cotizado || ''
                }));
            }
        } else if (name === 'reserva_id' && !value) {
            setSelectedReserva(null);
            setFormData(prev => ({
                ...prev,
                monto_final: ''
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        router.post('/admin/ventas', formData, {
            onSuccess: () => {
                // La redirección se maneja en el backend
            },
            onError: (errors) => {
                setErrors(errors);
                setLoading(false);
            },
            onFinish: () => {
                setLoading(false);
            }
        });
    };

    // Formatear precio
    const formatearPrecio = (precio) => {
        return new Intl.NumberFormat('es-PE', {
            style: 'currency',
            currency: 'PEN'
        }).format(precio);
    };

    return (
        <AdminLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Crear Nueva Venta
                    </h2>
                    <Link
                        href="/admin/ventas"
                        className="inline-flex items-center px-4 py-2 bg-gray-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 focus:bg-gray-700 active:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition ease-in-out duration-150"
                    >
                        Volver a Ventas
                    </Link>
                </div>
            }
        >
            <Head title="Crear Venta - Admin" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {listaReservas.length === 0 ? (
                                <div className="text-center py-8">
                                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">No hay reservas disponibles</h3>
                                    <p className="text-gray-500 mb-4">
                                        No existen reservas confirmadas disponibles para crear ventas.
                                    </p>
                                    <Link
                                        href="/admin/reservas"
                                        className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                    >
                                        Ver Reservas
                                    </Link>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Selección de Reserva */}
                                    <div>
                                        <label htmlFor="reserva_id" className="block text-sm font-medium text-gray-700 mb-2">
                                            Seleccionar Reserva
                                        </label>
                                        <select
                                            id="reserva_id"
                                            name="reserva_id"
                                            value={formData.reserva_id}
                                            onChange={handleChange}
                                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                                errors.reserva_id ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                            required
                                            disabled={loading}
                                        >
                                            <option value="">Seleccionar reserva...</option>
                                            {listaReservas.map((reserva) => (
                                                <option key={reserva.id} value={reserva.id}>
                                                    Reserva #{reserva.id} - {reserva.cotizacion?.cliente?.nombre || 'Cliente'} -
                                                    {reserva.cotizacion?.departamento?.titulo || 'Propiedad'} -
                                                    {formatearPrecio(reserva.cotizacion?.monto_cotizado || 0)}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.reserva_id && (
                                            <p className="mt-1 text-sm text-red-600">{errors.reserva_id}</p>
                                        )}
                                    </div>

                                    {/* Información de la Reserva Seleccionada */}
                                    {selectedReserva && (
                                        <div className="bg-blue-50 p-4 rounded-md">
                                            <h3 className="text-sm font-medium text-blue-900 mb-3">Detalles de la Reserva</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                                <div>
                                                    <span className="font-medium text-blue-800">Cliente:</span>
                                                    <p className="text-blue-700">
                                                        {selectedReserva.cotizacion?.cliente?.nombre || 'No disponible'}
                                                    </p>
                                                </div>
                                                <div>
                                                    <span className="font-medium text-blue-800">Email:</span>
                                                    <p className="text-blue-700">
                                                        {selectedReserva.cotizacion?.cliente?.usuario?.email || 'No disponible'}
                                                    </p>
                                                </div>
                                                <div>
                                                    <span className="font-medium text-blue-800">Propiedad:</span>
                                                    <p className="text-blue-700">
                                                        {selectedReserva.cotizacion?.departamento?.titulo || 'No disponible'}
                                                    </p>
                                                </div>
                                                <div>
                                                    <span className="font-medium text-blue-800">Asesor:</span>
                                                    <p className="text-blue-700">
                                                        {selectedReserva.cotizacion?.asesor?.usuario?.name || 'No disponible'}
                                                    </p>
                                                </div>
                                                <div>
                                                    <span className="font-medium text-blue-800">Monto Cotizado:</span>
                                                    <p className="text-blue-700">
                                                        {formatearPrecio(selectedReserva.cotizacion?.monto_cotizado || 0)}
                                                    </p>
                                                </div>
                                                <div>
                                                    <span className="font-medium text-blue-800">Estado:</span>
                                                    <p className="text-blue-700">
                                                        {selectedReserva.estado}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Fecha de Venta */}
                                    <div>
                                        <label htmlFor="fecha_venta" className="block text-sm font-medium text-gray-700 mb-2">
                                            Fecha de Venta
                                        </label>
                                        <input
                                            type="date"
                                            id="fecha_venta"
                                            name="fecha_venta"
                                            value={formData.fecha_venta}
                                            onChange={handleChange}
                                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                                errors.fecha_venta ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                            required
                                            disabled={loading}
                                        />
                                        {errors.fecha_venta && (
                                            <p className="mt-1 text-sm text-red-600">{errors.fecha_venta}</p>
                                        )}
                                    </div>

                                    {/* Monto Final */}
                                    <div>
                                        <label htmlFor="monto_final" className="block text-sm font-medium text-gray-700 mb-2">
                                            Monto Final de Venta (PEN)
                                        </label>
                                        <input
                                            type="number"
                                            id="monto_final"
                                            name="monto_final"
                                            value={formData.monto_final}
                                            onChange={handleChange}
                                            step="0.01"
                                            min="0"
                                            placeholder="0.00"
                                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                                errors.monto_final ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                            required
                                            disabled={loading}
                                        />
                                        {errors.monto_final && (
                                            <p className="mt-1 text-sm text-red-600">{errors.monto_final}</p>
                                        )}
                                        <p className="mt-1 text-sm text-gray-500">
                                            Este monto puede ser diferente al monto cotizado si hubo negociaciones.
                                        </p>
                                    </div>

                                    {/* Documentos Entregados */}
                                    <div>
                                        <label className="flex items-center space-x-3">
                                            <input
                                                type="checkbox"
                                                name="documentos_entregados"
                                                checked={formData.documentos_entregados}
                                                onChange={handleChange}
                                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                disabled={loading}
                                            />
                                            <span className="text-sm font-medium text-gray-700">
                                                Documentos entregados al cliente
                                            </span>
                                        </label>
                                        {errors.documentos_entregados && (
                                            <p className="mt-1 text-sm text-red-600">{errors.documentos_entregados}</p>
                                        )}
                                        <p className="mt-1 text-sm text-gray-500">
                                            Marcar si ya se han entregado todos los documentos legales al cliente.
                                        </p>
                                    </div>

                                    {/* Botones de Acción */}
                                    <div className="flex justify-end space-x-3 pt-6 border-t">
                                        <Link
                                            href="/admin/ventas"
                                            className="inline-flex items-center px-4 py-2 bg-gray-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 focus:bg-gray-700 active:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                        >
                                            Cancelar
                                        </Link>
                                        <button
                                            type="submit"
                                            disabled={loading || !formData.reserva_id}
                                            className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition ease-in-out duration-150 disabled:opacity-50"
                                        >
                                            {loading ? 'Creando...' : 'Crear Venta'}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
