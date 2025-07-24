import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';

export default function Ver({ auth, venta }) {
    // Formatear precio
    const formatearPrecio = (precio) => {
        return new Intl.NumberFormat('es-PE', {
            style: 'currency',
            currency: 'PEN'
        }).format(precio);
    };

    // Formatear fecha
    const formatearFecha = (fecha) => {
        return new Date(fecha).toLocaleDateString('es-PE', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Obtener color del estado
    const getEstadoColor = (estado) => {
        switch (estado) {
            case 'confirmada':
                return 'bg-green-100 text-green-800';
            case 'pendiente':
                return 'bg-yellow-100 text-yellow-800';
            case 'cancelada':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <AdminLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Detalle de Venta #{venta.id}
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
            <Head title={`Venta #${venta.id} - Admin`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {/* Información Principal */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                {/* Información de la Venta */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
                                        Información de la Venta
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-500">ID de Venta</label>
                                            <p className="mt-1 text-sm text-gray-900">#{venta.id}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-500">Fecha de Venta</label>
                                            <p className="mt-1 text-sm text-gray-900">{formatearFecha(venta.fecha_venta)}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-500">Monto Final</label>
                                            <p className="mt-1 text-lg font-semibold text-green-600">{formatearPrecio(venta.monto_final)}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-500">Estado</label>
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getEstadoColor(venta.reserva?.estado || 'pendiente')}`}>
                                                {venta.reserva?.estado || 'Pendiente'}
                                            </span>
                                        </div>
                                        <div className="col-span-2">
                                            <label className="block text-sm font-medium text-gray-500">Documentos Entregados</label>
                                            <p className="mt-1 text-sm text-gray-900">
                                                {venta.documentos_entregados ?
                                                    <span className="text-green-600 font-medium">Sí</span> :
                                                    <span className="text-red-600 font-medium">No</span>
                                                }
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Información del Cliente */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
                                        Información del Cliente
                                    </h3>
                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-500">Nombre</label>
                                            <p className="mt-1 text-sm text-gray-900">
                                                {venta.reserva?.cotizacion?.cliente?.nombre || 'No disponible'}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-500">Email</label>
                                            <p className="mt-1 text-sm text-gray-900">
                                                {venta.reserva?.cotizacion?.cliente?.usuario?.email || 'No disponible'}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-500">Teléfono</label>
                                            <p className="mt-1 text-sm text-gray-900">
                                                {venta.reserva?.cotizacion?.cliente?.telefono || 'No disponible'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Información de la Propiedad */}
                            <div className="mb-8">
                                <h3 className="text-lg font-medium text-gray-900 border-b pb-2 mb-4">
                                    Información de la Propiedad
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500">Título</label>
                                        <p className="mt-1 text-sm text-gray-900">
                                            {venta.reserva?.cotizacion?.departamento?.titulo || 'No disponible'}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500">Precio Original</label>
                                        <p className="mt-1 text-sm text-gray-900">
                                            {venta.reserva?.cotizacion?.departamento?.precio ?
                                                formatearPrecio(venta.reserva.cotizacion.departamento.precio) :
                                                'No disponible'
                                            }
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500">Ubicación</label>
                                        <p className="mt-1 text-sm text-gray-900">
                                            {venta.reserva?.cotizacion?.departamento?.ubicacion || 'No disponible'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Información del Asesor */}
                            <div className="mb-8">
                                <h3 className="text-lg font-medium text-gray-900 border-b pb-2 mb-4">
                                    Asesor Responsable
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500">Nombre</label>
                                        <p className="mt-1 text-sm text-gray-900">
                                            {venta.reserva?.cotizacion?.asesor?.usuario?.name || 'No disponible'}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500">Email</label>
                                        <p className="mt-1 text-sm text-gray-900">
                                            {venta.reserva?.cotizacion?.asesor?.usuario?.email || 'No disponible'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Acciones */}
                            <div className="flex justify-end space-x-3 pt-6 border-t">
                                <Link
                                    href={`/admin/ventas/${venta.id}/edit`}
                                    className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                >
                                    Editar Venta
                                </Link>
                                <button
                                    onClick={() => {
                                        if (confirm('¿Estás seguro de que deseas generar el reporte de esta venta?')) {
                                            router.post('/admin/ventas/reporte', { venta_id: venta.id });
                                        }
                                    }}
                                    className="inline-flex items-center px-4 py-2 bg-green-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-green-700 focus:bg-green-700 active:bg-green-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                >
                                    Generar Reporte
                                </button>
                                {venta.reserva?.estado !== 'cancelada' && (
                                    <button
                                        onClick={() => {
                                            if (confirm('¿Estás seguro de que deseas cancelar esta venta? Esta acción no se puede deshacer.')) {
                                                router.delete(`/admin/ventas/${venta.id}/cancelar`);
                                            }
                                        }}
                                        className="inline-flex items-center px-4 py-2 bg-red-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-700 focus:bg-red-700 active:bg-red-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                    >
                                        Cancelar Venta
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
