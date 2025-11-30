import React from 'react';
import { Head, router } from '@inertiajs/react';
import AsesorLayout from '@/Layouts/AsesorLayout';

export default function Detalle({ auth, venta }) {
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('es-PE', {
            style: 'currency',
            currency: 'PEN'
        }).format(amount);
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('es-BO', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <AsesorLayout user={auth.user}>
            <Head title={`Venta #${venta.id}`} />

            <div className="py-12">
                <div className="max-w-6xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {/* Header */}
                            <div className="flex justify-between items-center mb-6">
                                <h1 className="text-3xl font-bold text-gray-800">
                                    <i className="fas fa-handshake mr-3 text-green-600"></i>
                                    Detalle de Venta #{venta.id}
                                </h1>
                                <div className="flex space-x-3">
                                    <button
                                        onClick={() => router.get(`/asesor/ventas/${venta.id}/edit`)}
                                        className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                    >
                                        <i className="fas fa-edit mr-2"></i>
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => router.get('/asesor/ventas')}
                                        className="inline-flex items-center px-4 py-2 bg-gray-300 border border-transparent rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest hover:bg-gray-400 focus:bg-gray-400 active:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                    >
                                        <i className="fas fa-arrow-left mr-2"></i>
                                        Volver
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Información de la Venta */}
                                <div className="space-y-6">
                                    <div className="bg-gray-50 rounded-lg p-6">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                            <i className="fas fa-info-circle mr-2 text-blue-500"></i>
                                            Información de la Venta
                                        </h3>
                                        <div className="space-y-3">
                                            <div className="flex justify-between">
                                                <span className="font-medium text-gray-600">Fecha de Venta:</span>
                                                <span className="text-gray-900">{formatDate(venta.fecha_venta)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="font-medium text-gray-600">Monto Final:</span>
                                                <span className="text-2xl font-bold text-green-600">
                                                    {formatCurrency(venta.monto_final)}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="font-medium text-gray-600">Documentos Entregados:</span>
                                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                                    venta.documentos_entregados 
                                                        ? 'bg-green-100 text-green-800' 
                                                        : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                    <i className={`fas mr-1 ${
                                                        venta.documentos_entregados 
                                                            ? 'fa-check-circle' 
                                                            : 'fa-clock'
                                                    }`}></i>
                                                    {venta.documentos_entregados ? 'Sí' : 'Pendiente'}
                                                </span>
                                            </div>
                                            {venta.observaciones && (
                                                <div className="pt-2 border-t border-gray-200">
                                                    <span className="font-medium text-gray-600">Observaciones:</span>
                                                    <p className="text-gray-900 mt-1">{venta.observaciones}</p>
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
                                                    {venta.reserva?.cotizacion?.cliente?.usuario?.name || 
                                                     venta.reserva?.cotizacion?.cliente?.nombre || 'N/A'}
                                                </span>
                                            </div>
                                            {venta.reserva?.cotizacion?.cliente?.usuario?.email && (
                                                <div className="flex justify-between">
                                                    <span className="font-medium text-gray-600">Email:</span>
                                                    <span className="text-gray-900">
                                                        {venta.reserva?.cotizacion?.cliente?.usuario?.email}
                                                    </span>
                                                </div>
                                            )}
                                            {venta.reserva?.cotizacion?.cliente?.telefono && (
                                                <div className="flex justify-between">
                                                    <span className="font-medium text-gray-600">Teléfono:</span>
                                                    <span className="text-gray-900">
                                                        {venta.reserva?.cotizacion?.cliente?.telefono}
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
                                        {venta.reserva?.cotizacion?.departamento && (
                                            <div className="space-y-3">
                                                <div className="flex justify-between">
                                                    <span className="font-medium text-gray-600">Código:</span>
                                                    <span className="text-gray-900">
                                                        {venta.reserva.cotizacion.departamento.codigo}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="font-medium text-gray-600">Título:</span>
                                                    <span className="text-gray-900">
                                                        {venta.reserva.cotizacion.departamento.titulo}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="font-medium text-gray-600">Tipo:</span>
                                                    <span className="text-gray-900 capitalize">
                                                        {venta.reserva.cotizacion.departamento.tipo_propiedad}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="font-medium text-gray-600">Habitaciones:</span>
                                                    <span className="text-gray-900">
                                                        {venta.reserva.cotizacion.departamento.habitaciones}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="font-medium text-gray-600">Área:</span>
                                                    <span className="text-gray-900">
                                                        {venta.reserva.cotizacion.departamento.area} m²
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="font-medium text-gray-600">Precio Original:</span>
                                                    <span className="text-gray-900">
                                                        {formatCurrency(venta.reserva.cotizacion.departamento.precio)}
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Historial de la Operación */}
                                    <div className="bg-gray-50 rounded-lg p-6">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                            <i className="fas fa-history mr-2 text-blue-500"></i>
                                            Historial de la Operación
                                        </h3>
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray-600">Cotización creada:</span>
                                                <span className="text-gray-900">
                                                    {venta.reserva?.cotizacion?.fecha && 
                                                     formatDate(venta.reserva.cotizacion.fecha)}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray-600">Reserva confirmada:</span>
                                                <span className="text-gray-900">
                                                    {venta.reserva?.created_at && 
                                                     formatDate(venta.reserva.created_at)}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray-600">Venta registrada:</span>
                                                <span className="text-gray-900">
                                                    {formatDate(venta.created_at)}
                                                </span>
                                            </div>
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
