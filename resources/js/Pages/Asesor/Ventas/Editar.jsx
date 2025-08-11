import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import AsesorLayout from '@/Layouts/AsesorLayout';

export default function Editar({ auth, venta }) {
    const { data, setData, patch, processing, errors } = useForm({
        fecha_venta: venta.fecha_venta,
        monto_final: venta.monto_final,
        documentos_entregados: venta.documentos_entregados,
        observaciones: venta.observaciones || ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        patch(route('asesor.ventas.update', venta.id));
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('es-PE', {
            style: 'currency',
            currency: 'PEN'
        }).format(amount);
    };

    return (
        <AsesorLayout user={auth.user}>
            <Head title={`Editar Venta #${venta.id}`} />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="flex justify-between items-center mb-6">
                                <h1 className="text-3xl font-bold text-gray-800">
                                    <i className="fas fa-edit mr-3 text-blue-600"></i>
                                    Editar Venta #{venta.id}
                                </h1>
                            </div>

                            {/* Información de la reserva (solo lectura) */}
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                                    Información de la Operación
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                    <div>
                                        <span className="font-medium text-gray-600">Cliente:</span>
                                        <p className="text-gray-900">
                                            {venta.reserva?.cotizacion?.cliente?.usuario?.name || 
                                             venta.reserva?.cotizacion?.cliente?.nombre || 'N/A'}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-600">Departamento:</span>
                                        <p className="text-gray-900">
                                            {venta.reserva?.cotizacion?.departamento?.codigo || 'N/A'}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-600">Precio Original:</span>
                                        <p className="text-gray-900">
                                            {venta.reserva?.cotizacion?.departamento?.precio && 
                                             formatCurrency(venta.reserva.cotizacion.departamento.precio)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                        
                                        {data.documentos_entregados && !venta.documentos_entregados && (
                                            <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                                                <div className="flex">
                                                    <i className="fas fa-exclamation-triangle text-yellow-500 mt-1 mr-2"></i>
                                                    <div className="text-sm text-yellow-700">
                                                        <p className="font-semibold">Atención:</p>
                                                        <p>
                                                            Al marcar esta opción, el departamento se marcará como vendido 
                                                            y no estará disponible para futuras cotizaciones.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {!data.documentos_entregados && venta.documentos_entregados && (
                                            <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-md">
                                                <div className="flex">
                                                    <i className="fas fa-exclamation-circle text-red-500 mt-1 mr-2"></i>
                                                    <div className="text-sm text-red-700">
                                                        <p className="font-semibold">Advertencia:</p>
                                                        <p>
                                                            Al desmarcar esta opción, el departamento volverá a estar disponible.
                                                            Solo haga esto si es necesario revertir la venta.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
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
                                            rows={4}
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
                                        href={route('asesor.ventas.show', venta.id)}
                                        className="inline-flex items-center px-4 py-2 bg-gray-300 border border-transparent rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest hover:bg-gray-400 focus:bg-gray-400 active:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                    >
                                        <i className="fas fa-times mr-2"></i>
                                        Cancelar
                                    </a>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition ease-in-out duration-150 disabled:opacity-25"
                                    >
                                        {processing ? (
                                            <>
                                                <i className="fas fa-spinner fa-spin mr-2"></i>
                                                Actualizando...
                                            </>
                                        ) : (
                                            <>
                                                <i className="fas fa-save mr-2"></i>
                                                Actualizar Venta
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AsesorLayout>
    );
}
