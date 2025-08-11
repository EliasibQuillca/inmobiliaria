import React, { useState } from 'react';
import { Head, router, Link } from '@inertiajs/react';
import AsesorLayout from '../../Layouts/AsesorLayout';

export default function Reservas({ auth, reservas = [] }) {
    const [filtro, setFiltro] = useState('todas');
    const [reservaSeleccionada, setReservaSeleccionada] = useState(null);
    const [mostrarModal, setMostrarModal] = useState(false);

    const filtrarReservas = () => {
        switch (filtro) {
            case 'activas':
                return reservas.filter(r => r.estado === 'pendiente');
            case 'confirmadas':
                return reservas.filter(r => r.estado === 'confirmada');
            case 'vencidas':
                return reservas.filter(r => r.estado === 'vencida');
            case 'canceladas':
                return reservas.filter(r => r.estado === 'cancelada');
            default:
                return reservas;
        }
    };

    const verDetalle = (reserva) => {
        setReservaSeleccionada(reserva);
        setMostrarModal(true);
    };

    const crearVenta = (reserva) => {
        router.get(`/asesor/ventas/create?reserva_id=${reserva.id}`);
    };

    const confirmarReserva = (id) => {
        // Asegurar que el token CSRF esté presente
        const token = document.head.querySelector('meta[name="csrf-token"]');
        if (!token) {
            console.error('Token CSRF no encontrado');
            return;
        }

        router.patch(`/asesor/reservas/${id}/confirmar`, {}, {
            headers: {
                'X-CSRF-TOKEN': token.content
            },
            onSuccess: () => {
                // Refrescar la página para mostrar los cambios
                router.reload({ only: ['reservas'] });
            },
            onError: (error) => {
                console.error('Error al confirmar reserva:', error);
                alert('Error al confirmar la reserva. Por favor, intenta de nuevo.');
            }
        });
    };

    const getEstadoColor = (estado) => {
        switch (estado) {
            case 'pendiente':
                return 'bg-yellow-100 text-yellow-800';
            case 'confirmada':
                return 'bg-green-100 text-green-800';
            case 'vencida':
                return 'bg-red-100 text-red-800';
            case 'cancelada':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const diasRestantes = (fechaVencimiento) => {
        const hoy = new Date();
        const vencimiento = new Date(fechaVencimiento);
        const diferencia = Math.ceil((vencimiento - hoy) / (1000 * 60 * 60 * 24));
        return diferencia;
    };

    return (
        <AsesorLayout user={auth.user}>
            <Head title="Reservas" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">
                                        Reservas
                                    </h1>
                                    <p className="text-gray-600 mt-1">
                                        Gestiona las reservas de departamentos de tus clientes
                                    </p>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => setFiltro('todas')}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium ${
                                                filtro === 'todas'
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                            }`}
                                        >
                                            Todas
                                        </button>
                                        <button
                                            onClick={() => setFiltro('activas')}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium ${
                                                filtro === 'activas'
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                            }`}
                                        >
                                            Pendientes
                                        </button>
                                        <button
                                            onClick={() => setFiltro('confirmadas')}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium ${
                                                filtro === 'confirmadas'
                                                    ? 'bg-green-600 text-white'
                                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                            }`}
                                        >
                                            Confirmadas
                                        </button>
                                    </div>
                                    <Link
                                        href="/asesor/reservas/crear"
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                                    >
                                        Nueva Reserva
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Lista de reservas */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filtrarReservas().map((reserva) => (
                            <div key={reserva.id} className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                Reserva #{reserva.id}
                                            </h3>
                                            <p className="text-sm text-gray-600">
                                                {reserva.cliente?.nombre}
                                            </p>
                                        </div>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(reserva.estado)}`}>
                                            {reserva.estado}
                                        </span>
                                    </div>

                                    <div className="space-y-2 mb-4">
                                        <p className="text-sm text-gray-600">
                                            <span className="font-medium">Departamento:</span> {reserva.departamento?.nombre}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            <span className="font-medium">Monto Reserva:</span> ${reserva.monto_reserva?.toLocaleString()}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            <span className="font-medium">Precio Total:</span> ${reserva.precio_total?.toLocaleString()}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            <span className="font-medium">Fecha Reserva:</span> {new Date(reserva.created_at).toLocaleDateString()}
                                        </p>
                                        {reserva.fecha_vencimiento && (
                                            <div>
                                                <p className="text-sm text-gray-600">
                                                    <span className="font-medium">Vence:</span> {new Date(reserva.fecha_vencimiento).toLocaleDateString()}
                                                </p>
                                                {reserva.estado === 'pendiente' && (
                                                    <p className={`text-sm ${diasRestantes(reserva.fecha_vencimiento) <= 7 ? 'text-red-600' : 'text-gray-600'}`}>
                                                        <span className="font-medium">Días restantes:</span> {diasRestantes(reserva.fecha_vencimiento)}
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => verDetalle(reserva)}
                                            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium"
                                        >
                                            Ver Detalle
                                        </button>
                                        {reserva.estado === 'pendiente' && (
                                            <button
                                                onClick={() => confirmarReserva(reserva.id)}
                                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium"
                                            >
                                                Confirmar
                                            </button>
                                        )}
                                        {reserva.estado === 'confirmada' && (
                                            <button
                                                onClick={() => crearVenta(reserva)}
                                                className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm font-medium"
                                            >
                                                Crear Venta
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {filtrarReservas().length === 0 && (
                            <div className="col-span-full bg-white overflow-hidden shadow-sm sm:rounded-lg">
                                <div className="p-12 text-center">
                                    <p className="text-gray-500 text-lg">
                                        No hay reservas {filtro !== 'todas' ? filtro : ''} en este momento
                                    </p>
                                    <Link
                                        href="/asesor/reservas/crear"
                                        className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700"
                                    >
                                        Crear Primera Reserva
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal de detalle */}
            {mostrarModal && reservaSeleccionada && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
                        <div className="mt-3">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-medium text-gray-900">
                                    Detalle de Reserva #{reservaSeleccionada.id}
                                </h3>
                                <button
                                    onClick={() => setMostrarModal(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="font-medium text-gray-900 mb-3">Información del Cliente</h4>
                                    <div className="space-y-2">
                                        <p className="text-sm">
                                            <span className="font-medium">Nombre:</span> {reservaSeleccionada.cliente?.nombre}
                                        </p>
                                        <p className="text-sm">
                                            <span className="font-medium">Email:</span> {reservaSeleccionada.cliente?.email}
                                        </p>
                                        <p className="text-sm">
                                            <span className="font-medium">Teléfono:</span> {reservaSeleccionada.cliente?.telefono}
                                        </p>
                                        <p className="text-sm">
                                            <span className="font-medium">CI:</span> {reservaSeleccionada.cliente?.ci}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="font-medium text-gray-900 mb-3">Información del Departamento</h4>
                                    <div className="space-y-2">
                                        <p className="text-sm">
                                            <span className="font-medium">Nombre:</span> {reservaSeleccionada.departamento?.nombre}
                                        </p>
                                        <p className="text-sm">
                                            <span className="font-medium">Ubicación:</span> {reservaSeleccionada.departamento?.ubicacion}
                                        </p>
                                        <p className="text-sm">
                                            <span className="font-medium">Dormitorios:</span> {reservaSeleccionada.departamento?.dormitorios}
                                        </p>
                                        <p className="text-sm">
                                            <span className="font-medium">Baños:</span> {reservaSeleccionada.departamento?.banos}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6">
                                <h4 className="font-medium text-gray-900 mb-3">Detalles de la Reserva</h4>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-600">Monto de Reserva</p>
                                            <p className="text-lg font-semibold">${reservaSeleccionada.monto_reserva?.toLocaleString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Precio Total</p>
                                            <p className="text-lg font-semibold">${reservaSeleccionada.precio_total?.toLocaleString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Saldo Pendiente</p>
                                            <p className="text-lg font-semibold text-red-600">
                                                ${(reservaSeleccionada.precio_total - reservaSeleccionada.monto_reserva)?.toLocaleString()}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Estado</p>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(reservaSeleccionada.estado)}`}>
                                                {reservaSeleccionada.estado}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {reservaSeleccionada.observaciones && (
                                <div className="mt-6">
                                    <h4 className="font-medium text-gray-900 mb-2">Observaciones</h4>
                                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                                        {reservaSeleccionada.observaciones}
                                    </p>
                                </div>
                            )}

                            <div className="flex justify-end space-x-3 mt-6">
                                <button
                                    onClick={() => setMostrarModal(false)}
                                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                                >
                                    Cerrar
                                </button>
                                {reservaSeleccionada.estado === 'confirmada' && (
                                    <button
                                        onClick={() => {
                                            setMostrarModal(false);
                                            crearVenta(reservaSeleccionada);
                                        }}
                                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                    >
                                        Crear Venta
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AsesorLayout>
    );
}
