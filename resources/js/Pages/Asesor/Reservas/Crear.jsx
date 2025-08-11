import React, { useState, useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AsesorLayout from '../../../Layouts/AsesorLayout';

export default function CrearReserva({ auth, cotizaciones, cotizacionSeleccionada }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        cotizacion_id: cotizacionSeleccionada ? cotizacionSeleccionada.id : '',
        fecha_inicio: '',
        fecha_fin: '',
        monto_reserva: '',
        notas: '',
    });

    const [cotizacionActual, setCotizacionActual] = useState(cotizacionSeleccionada);

    useEffect(() => {
        if (cotizacionSeleccionada) {
            // Pre-llenar campos basados en la cotización
            setData(prev => ({
                ...prev,
                cotizacion_id: cotizacionSeleccionada.id,
                monto_reserva: Math.round(cotizacionSeleccionada.monto * 0.1) // 10% del monto como reserva por defecto
            }));
        }
    }, [cotizacionSeleccionada]);

    const handleCotizacionChange = (cotizacionId) => {
        const cotizacion = cotizaciones.find(c => c.id == cotizacionId);
        setCotizacionActual(cotizacion);
        setData(prev => ({
            ...prev,
            cotizacion_id: cotizacionId,
            monto_reserva: cotizacion ? Math.round(cotizacion.monto * 0.1) : ''
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Asegurar que el token CSRF esté presente
        const token = document.head.querySelector('meta[name="csrf-token"]');
        if (!token) {
            console.error('Token CSRF no encontrado');
            return;
        }
        
        post('/asesor/reservas', {
            headers: {
                'X-CSRF-TOKEN': token.content
            },
            onSuccess: () => {
                reset();
            },
            onError: (errors) => {
                console.log('Errores:', errors);
            }
        });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('es-PE', {
            style: 'currency',
            currency: 'PEN',
            minimumFractionDigits: 0
        }).format(amount);
    };

    return (
        <AsesorLayout user={auth.user}>
            <Head title="Crear Reserva" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="md:flex md:items-center md:justify-between">
                            <div className="flex-1 min-w-0">
                                <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                                    Crear Nueva Reserva
                                </h2>
                                <p className="mt-1 text-sm text-gray-500">
                                    Registra una reserva basada en una cotización aceptada
                                </p>
                            </div>
                            <div className="mt-4 md:mt-0">
                                <Link
                                    href={route('asesor.reservas')}
                                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                                >
                                    Volver a Reservas
                                </Link>
                            </div>
                        </div>
                    </div>

                    {cotizaciones.length === 0 ? (
                        <div className="bg-white shadow sm:rounded-lg">
                            <div className="px-4 py-5 sm:p-6 text-center">
                                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <h3 className="mt-2 text-sm font-medium text-gray-900">No hay cotizaciones disponibles</h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    Para crear una reserva necesitas tener cotizaciones aceptadas que aún no tengan reserva.
                                </p>
                                <div className="mt-6">
                                    <Link
                                        href={route('asesor.cotizaciones')}
                                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                                    >
                                        Ver Cotizaciones
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white shadow sm:rounded-lg">
                            <div className="px-4 py-5 sm:p-6">
                                <form onSubmit={handleSubmit}>
                                    <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                                        {/* Selección de Cotización */}
                                        <div className="sm:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Cotización *
                                            </label>
                                            <select
                                                value={data.cotizacion_id}
                                                onChange={(e) => handleCotizacionChange(e.target.value)}
                                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                                required
                                            >
                                                <option value="">Seleccionar cotización</option>
                                                {cotizaciones.map((cotizacion) => (
                                                    <option key={cotizacion.id} value={cotizacion.id}>
                                                        {cotizacion.cliente?.usuario?.name || cotizacion.cliente?.nombre} - {cotizacion.departamento?.titulo} - {formatCurrency(cotizacion.monto)}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.cotizacion_id && <p className="text-red-500 text-xs mt-1">{errors.cotizacion_id}</p>}
                                        </div>

                                        {/* Información de la cotización seleccionada */}
                                        {cotizacionActual && (
                                            <div className="sm:col-span-2 bg-gray-50 p-4 rounded-md">
                                                <h4 className="text-sm font-medium text-gray-900 mb-3">Detalles de la Cotización</h4>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                                    <div>
                                                        <span className="font-medium text-gray-700">Cliente:</span> {cotizacionActual.cliente?.usuario?.name || cotizacionActual.cliente?.nombre}
                                                    </div>
                                                    <div>
                                                        <span className="font-medium text-gray-700">Departamento:</span> {cotizacionActual.departamento?.titulo}
                                                    </div>
                                                    <div>
                                                        <span className="font-medium text-gray-700">Monto:</span> {formatCurrency(cotizacionActual.monto)}
                                                    </div>
                                                    <div>
                                                        <span className="font-medium text-gray-700">Estado:</span> 
                                                        <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                            Aceptada
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Fecha de Inicio */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Fecha de Inicio *
                                            </label>
                                            <input
                                                type="date"
                                                value={data.fecha_inicio}
                                                onChange={(e) => setData('fecha_inicio', e.target.value)}
                                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                                required
                                                min={new Date().toISOString().split('T')[0]}
                                            />
                                            {errors.fecha_inicio && <p className="text-red-500 text-xs mt-1">{errors.fecha_inicio}</p>}
                                        </div>

                                        {/* Fecha de Fin */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Fecha de Fin *
                                            </label>
                                            <input
                                                type="date"
                                                value={data.fecha_fin}
                                                onChange={(e) => setData('fecha_fin', e.target.value)}
                                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                                required
                                                min={data.fecha_inicio || new Date().toISOString().split('T')[0]}
                                            />
                                            {errors.fecha_fin && <p className="text-red-500 text-xs mt-1">{errors.fecha_fin}</p>}
                                        </div>

                                        {/* Monto de Reserva */}
                                        <div className="sm:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Monto de Reserva *
                                            </label>
                                            <div className="mt-1 relative rounded-md shadow-sm">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <span className="text-gray-500 sm:text-sm">$</span>
                                                </div>
                                                <input
                                                    type="number"
                                                    value={data.monto_reserva}
                                                    onChange={(e) => setData('monto_reserva', e.target.value)}
                                                    className="pl-7 mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                                    placeholder="0.00"
                                                    min="0"
                                                    step="0.01"
                                                    required
                                                />
                                            </div>
                                            {errors.monto_reserva && <p className="text-red-500 text-xs mt-1">{errors.monto_reserva}</p>}
                                            <p className="mt-1 text-xs text-gray-500">
                                                Sugerido: 10% del valor del departamento
                                            </p>
                                        </div>

                                        {/* Notas */}
                                        <div className="sm:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Notas Adicionales
                                            </label>
                                            <textarea
                                                value={data.notas}
                                                onChange={(e) => setData('notas', e.target.value)}
                                                rows={3}
                                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="Condiciones especiales, términos adicionales, etc."
                                            />
                                            {errors.notas && <p className="text-red-500 text-xs mt-1">{errors.notas}</p>}
                                        </div>
                                    </div>

                                    {/* Botones */}
                                    <div className="mt-8 flex justify-end space-x-3">
                                        <Link
                                            href={route('asesor.reservas')}
                                            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                                        >
                                            Cancelar
                                        </Link>
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                                        >
                                            {processing ? 'Creando...' : 'Crear Reserva'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AsesorLayout>
    );
}
