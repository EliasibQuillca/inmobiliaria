import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AsesorLayout from '@/Layouts/AsesorLayout';

export default function Detalle({ auth, reserva }) {
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('es-PE', {
            style: 'currency',
            currency: 'PEN',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('es-PE', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getEstadoBadge = (estado) => {
        const estados = {
            'pendiente': 'bg-yellow-100 text-yellow-800',
            'confirmada': 'bg-green-100 text-green-800',
            'cancelada': 'bg-red-100 text-red-800'
        };
        
        return estados[estado] || 'bg-gray-100 text-gray-800';
    };

    return (
        <AsesorLayout user={auth.user}>
            <Head title={`Reserva #${reserva.id}`} />

            <div className="py-12">
                <div className="max-w-6xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {/* Header */}
                            <div className="flex justify-between items-center mb-6">
                                <h1 className="text-3xl font-bold text-gray-800">
                                    <i className="fas fa-calendar-check mr-3 text-blue-600"></i>
                                    Detalle de Reserva #{reserva.id}
                                </h1>
                                <div className="flex space-x-3">
                                    <Link
                                        href={route('asesor.reservas')}
                                        className="inline-flex items-center px-4 py-2 bg-gray-300 border border-transparent rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest hover:bg-gray-400 focus:bg-gray-400 active:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                    >
                                        <i className="fas fa-arrow-left mr-2"></i>
                                        Volver
                                    </Link>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Información de la Reserva */}
                                <div className="space-y-6">
                                    <div className="bg-gray-50 rounded-lg p-6">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                            <i className="fas fa-info-circle mr-2 text-blue-500"></i>
                                            Información de la Reserva
                                        </h3>
                                        <div className="space-y-3">
                                            <div className="flex justify-between">
                                                <span className="font-medium text-gray-600">Estado:</span>
                                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getEstadoBadge(reserva.estado)}`}>
                                                    <i className={`fas mr-1 ${
                                                        reserva.estado === 'confirmada' ? 'fa-check-circle' :
                                                        reserva.estado === 'cancelada' ? 'fa-times-circle' :
                                                        'fa-clock'
                                                    }`}></i>
                                                    {reserva.estado?.charAt(0).toUpperCase() + reserva.estado?.slice(1)}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="font-medium text-gray-600">Fecha de Reserva:</span>
                                                <span className="text-gray-900">{formatDate(reserva.fecha_reserva)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="font-medium text-gray-600">Monto de Reserva:</span>
                                                <span className="text-2xl font-bold text-green-600">
                                                    {formatCurrency(reserva.monto_reserva)}
                                                </span>
                                            </div>
                                            {reserva.fecha_vencimiento && (
                                                <div className="flex justify-between">
                                                    <span className="font-medium text-gray-600">Vencimiento:</span>
                                                    <span className="text-gray-900">{formatDate(reserva.fecha_vencimiento)}</span>
                                                </div>
                                            )}
                                            {reserva.observaciones && (
                                                <div className="pt-2 border-t border-gray-200">
                                                    <span className="font-medium text-gray-600">Observaciones:</span>
                                                    <p className="text-gray-900 mt-1">{reserva.observaciones}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Información del Cliente */}
                                    <div className="bg-gray-50 rounded-lg p-6">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                            <i className="fas fa-user mr-2 text-blue-500"></i>
                                            Información del Cliente
                                        </h3>
                                        <div className="space-y-3">
                                            <div className="flex justify-between">
                                                <span className="font-medium text-gray-600">Nombre:</span>
                                                <span className="text-gray-900">
                                                    {reserva.cotizacion?.cliente?.usuario?.name || 
                                                     reserva.cotizacion?.cliente?.nombre || 'N/A'}
                                                </span>
                                            </div>
                                            {reserva.cotizacion?.cliente?.usuario?.email && (
                                                <div className="flex justify-between">
                                                    <span className="font-medium text-gray-600">Email:</span>
                                                    <span className="text-gray-900">
                                                        {reserva.cotizacion?.cliente?.usuario?.email}
                                                    </span>
                                                </div>
                                            )}
                                            {reserva.cotizacion?.cliente?.telefono && (
                                                <div className="flex justify-between">
                                                    <span className="font-medium text-gray-600">Teléfono:</span>
                                                    <span className="text-gray-900">
                                                        {reserva.cotizacion?.cliente?.telefono}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Información del Departamento */}
                                <div className="space-y-6">
                                    <div className="bg-gray-50 rounded-lg p-6">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                            <i className="fas fa-building mr-2 text-blue-500"></i>
                                            Información del Departamento
                                        </h3>
                                        {reserva.cotizacion?.departamento && (
                                            <div className="space-y-3">
                                                <div className="flex justify-between">
                                                    <span className="font-medium text-gray-600">Código:</span>
                                                    <span className="text-gray-900">
                                                        {reserva.cotizacion.departamento.codigo}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="font-medium text-gray-600">Título:</span>
                                                    <span className="text-gray-900">
                                                        {reserva.cotizacion.departamento.titulo}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="font-medium text-gray-600">Tipo:</span>
                                                    <span className="text-gray-900 capitalize">
                                                        {reserva.cotizacion.departamento.tipo_propiedad}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="font-medium text-gray-600">Habitaciones:</span>
                                                    <span className="text-gray-900">
                                                        {reserva.cotizacion.departamento.habitaciones}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="font-medium text-gray-600">Área:</span>
                                                    <span className="text-gray-900">
                                                        {reserva.cotizacion.departamento.area} m²
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="font-medium text-gray-600">Precio:</span>
                                                    <span className="text-gray-900">
                                                        {formatCurrency(reserva.cotizacion.departamento.precio)}
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Acciones */}
                                    <div className="bg-gray-50 rounded-lg p-6">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                            <i className="fas fa-cog mr-2 text-blue-500"></i>
                                            Acciones Disponibles
                                        </h3>
                                        <div className="space-y-3">
                                            {reserva.estado === 'pendiente' && (
                                                <>
                                                    <Link
                                                        href={route('asesor.reservas.confirmar', reserva.id)}
                                                        method="patch"
                                                        as="button"
                                                        className="w-full inline-flex justify-center items-center px-4 py-2 bg-green-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-green-700 focus:bg-green-700 active:bg-green-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                                    >
                                                        <i className="fas fa-check mr-2"></i>
                                                        Confirmar Reserva
                                                    </Link>
                                                    <Link
                                                        href={route('asesor.reservas.cancelar', reserva.id)}
                                                        method="patch"
                                                        as="button"
                                                        className="w-full inline-flex justify-center items-center px-4 py-2 bg-red-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-700 focus:bg-red-700 active:bg-red-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                                    >
                                                        <i className="fas fa-times mr-2"></i>
                                                        Cancelar Reserva
                                                    </Link>
                                                </>
                                            )}
                                            {reserva.estado === 'confirmada' && (
                                                <Link
                                                    href={route('asesor.ventas.create', { reserva_id: reserva.id })}
                                                    className="w-full inline-flex justify-center items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                                >
                                                    <i className="fas fa-handshake mr-2"></i>
                                                    Registrar Venta
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AsesorLayout>
    );
}
