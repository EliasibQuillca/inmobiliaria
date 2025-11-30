import React, { useState } from 'react';
import { Head, router, Link } from '@inertiajs/react';
import AsesorLayout from '../../Layouts/AsesorLayout';

export default function Reservas({ auth, reservas = [], flash = {} }) {
    const [filtro, setFiltro] = useState('todas');
    const [reservaSeleccionada, setReservaSeleccionada] = useState(null);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [mostrarAlerta, setMostrarAlerta] = useState(!!flash.warning || !!flash.success || !!flash.error);
    const [loadingAction, setLoadingAction] = useState(null);

    const filtrarReservas = () => {
        switch (filtro) {
            case 'pendientes':
                return reservas.filter(r => r.estado === 'pendiente');
            case 'confirmadas':
                return reservas.filter(r => r.estado === 'confirmada');
            case 'historial':
                return reservas.filter(r => ['cancelada', 'vencida'].includes(r.estado));
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
        if (!confirm('¿Estás seguro de confirmar esta reserva?\n\nUna vez confirmada, el cliente deberá proceder con el pago.')) {
            return;
        }

        setLoadingAction(`confirmar-${id}`);
        router.patch(`/asesor/reservas/${id}/confirmar`, {}, {
            onSuccess: () => {
                setLoadingAction(null);
                router.reload({ only: ['reservas'] });
            },
            onError: (error) => {
                setLoadingAction(null);
                console.error('Error al confirmar reserva:', error);
                alert('❌ Error al confirmar la reserva.\n\nPor favor, verifica:\n- La reserva está en estado pendiente\n- Tienes permisos suficientes\n\nIntenta nuevamente.');
            }
        });
    };

    const cancelarReserva = (id) => {
        // Confirmar la acción con el usuario
        const motivo = prompt('📝 Motivo de cancelación:\n\n¿Por qué deseas cancelar esta reserva?\n(Mínimo 10 caracteres)');

        if (!motivo || motivo.trim() === '') {
            alert('⚠️ Es necesario proporcionar un motivo para cancelar la reserva.');
            return;
        }

        if (motivo.trim().length < 10) {
            alert('⚠️ El motivo debe tener al menos 10 caracteres.\nActualmente: ' + motivo.trim().length + ' caracteres');
            return;
        }

        setLoadingAction(`cancelar-${id}`);
        router.patch(`/asesor/reservas/${id}/cancelar`, {
            motivo: motivo.trim()
        }, {
            onSuccess: () => {
                setLoadingAction(null);
                router.reload({ only: ['reservas'] });
            },
            onError: (error) => {
                setLoadingAction(null);
                console.error('Error al cancelar reserva:', error);
                alert(' Error al cancelar la reserva.\n\nDetalles: ' + (error.message || 'Error desconocido') + '\n\nPor favor, intenta de nuevo.');
            }
        });
    };

    const revertirConfirmacion = (id) => {
        // Confirmar la acción con el usuario
        const motivo = prompt('¿Por qué deseas revertir la confirmación?\n(El cliente no pagó, error de confirmación, etc.)');

        if (!motivo || motivo.trim() === '') {
            alert('Es necesario proporcionar un motivo para revertir la confirmación.');
            return;
        }

        if (motivo.trim().length < 10) {
            alert('El motivo debe tener al menos 10 caracteres.');
            return;
        }

        router.patch(`/asesor/reservas/${id}/revertir`, {
            motivo: motivo.trim()
        }, {
            onSuccess: () => {
                router.reload({ only: ['reservas'] });
            },
            onError: (error) => {
                console.error('Error al revertir confirmación:', error);
                alert('Error al revertir la confirmación. Por favor, intenta de nuevo.');
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
                    {/* Alertas Flash */}
                    {mostrarAlerta && (flash.warning || flash.success || flash.error) && (
                        <div className={`mb-6 rounded-lg p-4 ${
                            flash.warning ? 'bg-yellow-50 border border-yellow-200' :
                            flash.success ? 'bg-green-50 border border-green-200' :
                            'bg-red-50 border border-red-200'
                        }`}>
                            <div className="flex items-start">
                                <div className="flex-shrink-0">
                                    {flash.warning && (
                                        <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                    {flash.success && (
                                        <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                    {flash.error && (
                                        <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </div>
                                <div className="ml-3 flex-1">
                                    <p className={`text-sm font-medium ${
                                        flash.warning ? 'text-yellow-800' :
                                        flash.success ? 'text-green-800' :
                                        'text-red-800'
                                    }`}>
                                        {flash.warning || flash.success || flash.error}
                                    </p>
                                </div>
                                <div className="ml-auto pl-3">
                                    <button
                                        onClick={() => setMostrarAlerta(false)}
                                        className={`inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                                            flash.warning ? 'text-yellow-500 hover:bg-yellow-100 focus:ring-yellow-600' :
                                            flash.success ? 'text-green-500 hover:bg-green-100 focus:ring-green-600' :
                                            'text-red-500 hover:bg-red-100 focus:ring-red-600'
                                        }`}
                                    >
                                        <span className="sr-only">Cerrar</span>
                                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Header */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="p-4 sm:p-6">
                            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                                <div>
                                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                                        Reservas
                                    </h1>
                                    <p className="text-gray-600 mt-1 text-sm">
                                        Gestiona las reservas de departamentos de tus clientes
                                    </p>
                                </div>
                                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
                                    <div className="flex flex-wrap gap-2">
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
                                            onClick={() => setFiltro('pendientes')}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium ${
                                                filtro === 'pendientes'
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
                                        <button
                                            onClick={() => setFiltro('historial')}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium ${
                                                filtro === 'historial'
                                                    ? 'bg-gray-600 text-white'
                                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                            }`}
                                        >
                                            Historial
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Lista de reservas */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {filtrarReservas().map((reserva) => (
                            <div key={reserva.id} className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                Reserva #{reserva.id}
                                            </h3>
                                            <p className="text-sm text-gray-600">
                                                {reserva.cotizacion?.cliente?.usuario?.name || reserva.cotizacion?.cliente?.nombre}
                                            </p>
                                        </div>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(reserva.estado)}`}>
                                            {reserva.estado}
                                        </span>
                                    </div>

                                    <div className="space-y-2 mb-4">
                                        <p className="text-sm text-gray-600">
                                            <span className="font-medium">Departamento:</span> {reserva.cotizacion?.departamento?.titulo}
                                        </p>
                                        
                                        {/* Si tiene venta, mostrar precio de venta */}
                                        {reserva.venta ? (
                                            <>
                                                <p className="text-sm text-gray-600">
                                                    <span className="font-medium">Precio Venta:</span> <span className="text-purple-600 font-semibold">S/ {reserva.venta.monto_final?.toLocaleString()}</span>
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    <span className="font-medium">Fecha Venta:</span> {new Date(reserva.venta.fecha_venta).toLocaleDateString('es-PE')}
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    <span className="font-medium">Estado:</span> <span className="text-purple-600 font-semibold">✓ Vendido</span>
                                                </p>
                                            </>
                                        ) : (
                                            <>
                                                <p className="text-sm text-gray-600">
                                                    <span className="font-medium">Monto Reserva:</span> S/ {reserva.monto_reserva?.toLocaleString()}
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    <span className="font-medium">Precio Total:</span> S/ {reserva.precio_total?.toLocaleString()}
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    <span className="font-medium">Fecha Reserva:</span> {new Date(reserva.created_at).toLocaleDateString('es-PE')}
                                                </p>
                                                {reserva.fecha_vencimiento && (
                                                    <div>
                                                        <p className="text-sm text-gray-600">
                                                            <span className="font-medium">Vence:</span> {new Date(reserva.fecha_vencimiento).toLocaleDateString('es-PE')}
                                                        </p>
                                                        {reserva.estado === 'pendiente' && (
                                                            <p className={`text-sm ${diasRestantes(reserva.fecha_vencimiento) <= 7 ? 'text-red-600' : 'text-gray-600'}`}>
                                                                <span className="font-medium">Días restantes:</span> {diasRestantes(reserva.fecha_vencimiento)}
                                                            </p>
                                                        )}
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>

                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => verDetalle(reserva)}
                                            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium"
                                        >
                                            Ver Detalle
                                        </button>
                                        {/* ESTADO: PENDIENTE */}
                                        {reserva.estado === 'pendiente' && (
                                            <>
                                                <button
                                                    onClick={() => confirmarReserva(reserva.id)}
                                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium"
                                                >
                                                    Confirmar
                                                </button>
                                                <button
                                                    onClick={() => cancelarReserva(reserva.id)}
                                                    className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm font-medium"
                                                >
                                                    Cancelar
                                                </button>
                                            </>
                                        )}

                                        {/* ESTADO: CONFIRMADA */}
                                        {reserva.estado === 'confirmada' && (
                                            <>
                                                {/* Si NO tiene venta, mostrar ambos botones */}
                                                {!reserva.venta && (
                                                    <>
                                                        <button
                                                            onClick={() => crearVenta(reserva)}
                                                            className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm font-medium"
                                                        >
                                                            Crear Venta
                                                        </button>
                                                        <button
                                                            onClick={() => revertirConfirmacion(reserva.id)}
                                                            className="flex-1 bg-orange-600 hover:bg-orange-700 text-white px-3 py-2 rounded-lg text-sm font-medium"
                                                        >
                                                            Revertir
                                                        </button>
                                                    </>
                                                )}

                                                {/* Si YA tiene venta, solo mostrar enlace a venta */}
                                                {reserva.venta && (
                                                    <button
                                                        onClick={() => router.get(`/asesor/ventas/${reserva.venta.id}`)}
                                                        className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-lg text-sm font-medium"
                                                    >
                                                        Ver Venta
                                                    </button>
                                                )}
                                            </>
                                        )}

                                        {/* ESTADOS: CANCELADA, VENCIDA - Solo detalle */}
                                        {(reserva.estado === 'cancelada' || reserva.estado === 'vencida') && (
                                            <span className="flex-1 text-center text-gray-500 text-sm italic px-3 py-2">
                                                {reserva.estado === 'cancelada' ? 'Reserva cancelada' : 'Reserva vencida'}
                                            </span>
                                        )}
                                    </div>

                                    {/* Mostrar motivo de cancelación en la card */}
                                    {reserva.estado === 'cancelada' && reserva.notas && (
                                        <div className="mt-4 pt-4 border-t border-gray-200">
                                            <p className="text-xs font-medium text-gray-700 mb-1">Motivo de cancelación:</p>
                                            <p className="text-xs text-red-600 bg-red-50 p-2 rounded border border-red-100">
                                                {reserva.notas}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        {filtrarReservas().length === 0 && (
                            <div className="col-span-full bg-white overflow-hidden shadow-sm sm:rounded-lg">
                                <div className="p-12 text-center">
                                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                    </svg>
                                    <h3 className="mt-2 text-lg font-medium text-gray-900">
                                        No hay reservas {filtro !== 'todas' ? filtro : ''}
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Para crear una reserva, primero necesitas tener cotizaciones aceptadas por tus clientes.
                                    </p>
                                    <div className="mt-6">
                                        <Link
                                            href={route('asesor.reservas.crear')}
                                            className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                        >
                                            <svg className="mr-2 -ml-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                            </svg>
                                            Crear Reserva
                                        </Link>
                                    </div>
                                    <p className="mt-4 text-xs text-gray-400">
                                        💡 Tip: Ve a la sección de Cotizaciones para gestionar las propuestas de tus clientes
                                    </p>
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
                                            <span className="font-medium">Nombre:</span> {reservaSeleccionada.cotizacion?.cliente?.usuario?.name || reservaSeleccionada.cotizacion?.cliente?.nombre}
                                        </p>
                                        <p className="text-sm">
                                            <span className="font-medium">Email:</span> {reservaSeleccionada.cotizacion?.cliente?.usuario?.email || reservaSeleccionada.cotizacion?.cliente?.email}
                                        </p>
                                        <p className="text-sm">
                                            <span className="font-medium">Teléfono:</span> {reservaSeleccionada.cotizacion?.cliente?.telefono}
                                        </p>
                                        <p className="text-sm">
                                            <span className="font-medium">CI:</span> {reservaSeleccionada.cotizacion?.cliente?.ci}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="font-medium text-gray-900 mb-3">Información del Departamento</h4>
                                    <div className="space-y-2">
                                        <p className="text-sm">
                                            <span className="font-medium">Nombre:</span> {reservaSeleccionada.cotizacion?.departamento?.titulo}
                                        </p>
                                        <p className="text-sm">
                                            <span className="font-medium">Ubicación:</span> {reservaSeleccionada.cotizacion?.departamento?.ubicacion}
                                        </p>
                                        <p className="text-sm">
                                            <span className="font-medium">Habitaciones:</span> {reservaSeleccionada.cotizacion?.departamento?.habitaciones}
                                        </p>
                                        <p className="text-sm">
                                            <span className="font-medium">Baños:</span> {reservaSeleccionada.cotizacion?.departamento?.banos}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6">
                                <h4 className="font-medium text-gray-900 mb-3">
                                    {reservaSeleccionada.venta ? 'Detalles de la Venta' : 'Detalles de la Reserva'}
                                </h4>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="grid grid-cols-2 gap-4">
                                        {reservaSeleccionada.venta ? (
                                            <>
                                                <div>
                                                    <p className="text-sm text-gray-600">Monto Final de Venta</p>
                                                    <p className="text-lg font-semibold text-purple-600">S/ {reservaSeleccionada.venta.monto_final?.toLocaleString()}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-600">Documentos Entregados</p>
                                                    <p className="text-sm text-gray-900">{reservaSeleccionada.venta.documentos_entregados ? '✓ Sí' : '✗ No'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-600">Fecha de Venta</p>
                                                    <p className="text-sm text-gray-900">
                                                        {new Date(reservaSeleccionada.venta.fecha_venta).toLocaleDateString('es-PE')}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-600">Estado</p>
                                                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                                        Vendido
                                                    </span>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div>
                                                    <p className="text-sm text-gray-600">Monto de Reserva</p>
                                                    <p className="text-lg font-semibold text-green-600">S/ {reservaSeleccionada.monto_reserva?.toLocaleString()}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-600">Precio del Departamento</p>
                                                    <p className="text-lg font-semibold text-blue-600">S/ {reservaSeleccionada.precio_total?.toLocaleString()}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-600">Fecha de Reserva</p>
                                                    <p className="text-sm text-gray-900">
                                                        {new Date(reservaSeleccionada.fecha_reserva).toLocaleDateString('es-PE')}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-600">Estado</p>
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(reservaSeleccionada.estado)}`}>
                                                        {reservaSeleccionada.estado}
                                                    </span>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {reservaSeleccionada.notas && (
                                <div className="mt-6">
                                    <h4 className="font-medium text-gray-900 mb-2">
                                        {reservaSeleccionada.estado === 'cancelada' ? 'Motivo de Cancelación' : 'Notas'}
                                    </h4>
                                    <p className={`text-sm p-3 rounded-lg ${
                                        reservaSeleccionada.estado === 'cancelada'
                                            ? 'bg-red-50 text-red-700 border border-red-200'
                                            : 'bg-gray-50 text-gray-600'
                                    }`}>
                                        {reservaSeleccionada.notas}
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
