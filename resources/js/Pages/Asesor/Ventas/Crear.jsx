import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import AsesorLayout from '@/Layouts/AsesorLayout';

export default function Crear({ reservas }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        reserva_id: '',
        fecha_venta: new Date().toISOString().split('T')[0], // Fecha actual por defecto
        monto_final: '',
        documentos_entregados: false,
        observaciones: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('asesor.ventas.store'), {
            onSuccess: () => {
                reset();
            }
        });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('es-PE', {
            style: 'currency',
            currency: 'PEN'
        }).format(amount);
    };

    const handleReservaChange = (reservaId) => {
        setData('reserva_id', reservaId);
        
        if (reservaId) {
            const reserva = reservas.find(r => r.id == reservaId);
            if (reserva && reserva.cotizacion) {
                setData(prev => ({
                    ...prev,
                    reserva_id: reservaId,
                    monto_final: reserva.cotizacion.monto || ''
                }));
            }
        }
    };

    return (
        <AsesorLayout>
            <Head title="Registrar Venta" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="flex justify-between items-center mb-6">
                                <h1 className="text-3xl font-bold text-gray-800">
                                    <i className="fas fa-handshake mr-3 text-green-600"></i>
                                    Registrar Nueva Venta
                                </h1>
                            </div>

                            {reservas.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="mb-4">
                                        <i className="fas fa-inbox text-6xl text-gray-400"></i>
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                                        No hay reservas disponibles
                                    </h3>
                                    <p className="text-gray-500 mb-6">
                                        No tienes reservas confirmadas pendientes de venta.
                                    </p>
                                    <a
                                        href={route('asesor.reservas')}
                                        className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                    >
                                        <i className="fas fa-calendar-check mr-2"></i>
                                        Ver Reservas
                                    </a>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Información de ayuda */}
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                                        <div className="flex">
                                            <i className="fas fa-info-circle text-blue-500 mt-1 mr-2"></i>
                                            <div className="text-sm text-blue-700">
                                                <p className="font-semibold mb-1">¿Cómo registrar una venta?</p>
                                                <p>
                                                    Selecciona una reserva confirmada, ingresa la fecha de venta y el monto final acordado.
                                                    Si ya entregaste los documentos, marca la casilla correspondiente.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Selección de Reserva */}
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Reserva a Convertir en Venta *
                                            </label>
                                            <select
                                                value={data.reserva_id}
                                                onChange={(e) => handleReservaChange(e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                required
                                            >
                                                <option value="">Seleccionar reserva...</option>
                                                {reservas.map((reserva) => (
                                                    <option key={reserva.id} value={reserva.id}>
                                                        {reserva.cotizacion?.departamento?.codigo || 'N/A'} - 
                                                        {reserva.cotizacion?.cliente?.usuario?.name || reserva.cotizacion?.cliente?.nombre || 'Cliente'} - 
                                                        {formatCurrency(reserva.cotizacion?.monto || 0)}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.reserva_id && (
                                                <p className="mt-1 text-sm text-red-600">{errors.reserva_id}</p>
                                            )}
                                        </div>

                                        {/* Fecha de Venta */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Fecha de Venta *
                                            </label>
                                            <input
                                                type="date"
                                                value={data.fecha_venta}
                                                onChange={(e) => setData('fecha_venta', e.target.value)}
                                                max={new Date().toISOString().split('T')[0]}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                                                step="0.01"
                                                min="0"
                                                value={data.monto_final}
                                                onChange={(e) => setData('monto_final', e.target.value)}
                                                placeholder="0.00"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                required
                                            />
                                            {errors.monto_final && (
                                                <p className="mt-1 text-sm text-red-600">{errors.monto_final}</p>
                                            )}
                                        </div>

                                        {/* Documentos Entregados */}
                                        <div className="md:col-span-2">
                                            <label className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={data.documentos_entregados}
                                                    onChange={(e) => setData('documentos_entregados', e.target.checked)}
                                                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:ring-blue-500"
                                                />
                                                <span className="ml-2 text-sm text-gray-700">
                                                    Documentos entregados al cliente
                                                </span>
                                            </label>
                                            {data.documentos_entregados && (
                                                <p className="mt-1 text-xs text-green-600">
                                                    <i className="fas fa-check-circle mr-1"></i>
                                                    Al marcar esta opción, el departamento se marcará como vendido.
                                                </p>
                                            )}
                                        </div>

                                        {/* Observaciones */}
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Observaciones
                                            </label>
                                            <textarea
                                                value={data.observaciones}
                                                onChange={(e) => setData('observaciones', e.target.value)}
                                                rows={3}
                                                placeholder="Notas adicionales sobre la venta..."
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                            />
                                            {errors.observaciones && (
                                                <p className="mt-1 text-sm text-red-600">{errors.observaciones}</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Botones */}
                                    <div className="flex justify-end space-x-3 pt-6">
                                        <a
                                            href={route('asesor.ventas')}
                                            className="inline-flex items-center px-4 py-2 bg-gray-300 border border-transparent rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest hover:bg-gray-400 focus:bg-gray-400 active:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                        >
                                            <i className="fas fa-times mr-2"></i>
                                            Cancelar
                                        </a>
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="inline-flex items-center px-4 py-2 bg-green-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-green-700 focus:bg-green-700 active:bg-green-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition ease-in-out duration-150 disabled:opacity-25"
                                        >
                                            {processing ? (
                                                <>
                                                    <i className="fas fa-spinner fa-spin mr-2"></i>
                                                    Procesando...
                                                </>
                                            ) : (
                                                <>
                                                    <i className="fas fa-save mr-2"></i>
                                                    Registrar Venta
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AsesorLayout>
    );
}
