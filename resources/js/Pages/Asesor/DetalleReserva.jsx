import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import Layout from '@/components/layout/Layout';

export default function DetalleReserva({ auth, reserva, cliente, departamento, cotizacion }) {
    // Estado para modal de confirmación
    const [modalVisible, setModalVisible] = useState(false);
    const [accion, setAccion] = useState('');

    // Función para formatear moneda
    const formatMoney = (amount) => {
        return new Intl.NumberFormat('es-PE', {
            style: 'currency',
            currency: 'PEN',
            minimumFractionDigits: 0
        }).format(amount);
    };

    // Función para formatear fecha
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('es-ES', options);
    };

    // Función para mostrar el modal de confirmación
    const confirmarAccion = (accionTipo) => {
        setAccion(accionTipo);
        setModalVisible(true);
    };

    // Función para ejecutar la acción
    const ejecutarAccion = () => {
        // Aquí se conectaría con el backend para realizar la acción
        setModalVisible(false);
    };

    // Determinar clase de estado para el badge
    const estadoClase =
        reserva.estado === 'pendiente'
            ? 'bg-yellow-100 text-yellow-800'
            : reserva.estado === 'pagado'
            ? 'bg-blue-100 text-blue-800'
            : reserva.estado === 'completado'
            ? 'bg-green-100 text-green-800'
            : reserva.estado === 'vencido'
            ? 'bg-red-100 text-red-800'
            : 'bg-gray-100 text-gray-800';

    return (
        <Layout auth={auth}>
            <Head title={`Reserva #${reserva.id}`} />

            <div className="py-12 bg-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Reserva #{reserva.id}</h2>
                            <p className="mt-1 text-sm text-gray-600">
                                Detalle de la reserva para {cliente.nombre} {cliente.apellidos}
                            </p>
                        </div>
                        <div className="flex space-x-3">
                            {reserva.estado === 'pendiente' && (
                                <>
                                    <button
                                        onClick={() => confirmarAccion('registrar-pago')}
                                        className="inline-flex items-center px-4 py-2 bg-green-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-green-700"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                        </svg>
                                        Registrar Pago
                                    </button>
                                    <button
                                        onClick={() => confirmarAccion('cancelar')}
                                        className="inline-flex items-center px-4 py-2 bg-red-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-700"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                        Cancelar Reserva
                                    </button>
                                </>
                            )}
                            {reserva.estado === 'pagado' && (
                                <button
                                    onClick={() => confirmarAccion('completar')}
                                    className="inline-flex items-center px-4 py-2 bg-green-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-green-700"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    Completar Reserva
                                </button>
                            )}
                            {reserva.estado === 'pendiente' && (
                                <Link
                                    href={`/asesor/reservas/editar/${reserva.id}`}
                                    className="inline-flex items-center px-4 py-2 bg-yellow-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-yellow-700"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                                        <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                                    </svg>
                                    Editar
                                </Link>
                            )}
                            <Link
                                href="/asesor/reservas"
                                className="inline-flex items-center px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm font-medium rounded-md"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Volver
                            </Link>
                        </div>
                    </div>

                    {/* Resumen de la reserva */}
                    <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
                        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                            <div>
                                <h3 className="text-lg leading-6 font-medium text-gray-900">Resumen de Reserva</h3>
                                <p className="mt-1 max-w-2xl text-sm text-gray-500">Detalles y estado actual.</p>
                            </div>
                            <div>
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${estadoClase}`}>
                                    {reserva.estado === 'pendiente'
                                        ? 'Pendiente'
                                        : reserva.estado === 'pagado'
                                        ? 'Pagado'
                                        : reserva.estado === 'completado'
                                        ? 'Completado'
                                        : reserva.estado === 'vencido'
                                        ? 'Vencido'
                                        : 'Cancelado'
                                    }
                                </span>
                            </div>
                        </div>
                        <div className="border-t border-gray-200">
                            <dl>
                                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Reserva ID</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">#{reserva.id}</dd>
                                </div>
                                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Cotización Asociada</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        <Link href={`/asesor/cotizaciones/${cotizacion.id}`} className="text-indigo-600 hover:text-indigo-900">
                                            Cotización #{cotizacion.id}
                                        </Link>
                                    </dd>
                                </div>
                                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Fecha de Creación</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{formatDate(reserva.fecha_creacion)}</dd>
                                </div>
                                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Fecha de Expiración</dt>
                                    <dd className={`mt-1 text-sm sm:mt-0 sm:col-span-2 ${reserva.estado === 'pendiente' ? 'text-red-600 font-medium' : 'text-gray-900'}`}>
                                        {formatDate(reserva.fecha_expiracion)}
                                    </dd>
                                </div>
                                {reserva.fecha_pago && (
                                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">Fecha de Pago</dt>
                                        <dd className="mt-1 text-sm text-green-600 font-medium sm:mt-0 sm:col-span-2">{formatDate(reserva.fecha_pago)}</dd>
                                    </div>
                                )}
                                <div className={`${reserva.fecha_pago ? 'bg-white' : 'bg-gray-50'} px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6`}>
                                    <dt className="text-sm font-medium text-gray-500">Método de Pago</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        {reserva.metodo_pago === 'transferencia'
                                            ? 'Transferencia Bancaria'
                                            : reserva.metodo_pago === 'efectivo'
                                            ? 'Efectivo'
                                            : reserva.metodo_pago === 'tarjeta'
                                            ? 'Tarjeta de Crédito/Débito'
                                            : reserva.metodo_pago === 'deposito'
                                            ? 'Depósito Bancario'
                                            : reserva.metodo_pago === 'yape'
                                            ? 'Yape'
                                            : 'Plin'
                                        }
                                    </dd>
                                </div>
                            </dl>
                        </div>
                    </div>

                    {/* Información del cliente */}
                    <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
                        <div className="px-4 py-5 sm:px-6">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">Información del Cliente</h3>
                            <p className="mt-1 max-w-2xl text-sm text-gray-500">Datos personales y de contacto.</p>
                        </div>
                        <div className="border-t border-gray-200">
                            <dl>
                                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Nombre completo</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{cliente.nombre} {cliente.apellidos}</dd>
                                </div>
                                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Correo electrónico</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{cliente.email}</dd>
                                </div>
                                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Teléfono</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{cliente.telefono}</dd>
                                </div>
                                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Documento de identidad</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{cliente.tipo_documento}: {cliente.documento}</dd>
                                </div>
                            </dl>
                        </div>
                    </div>

                    {/* Información de la propiedad */}
                    <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
                        <div className="px-4 py-5 sm:px-6">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">Información de la Propiedad</h3>
                            <p className="mt-1 max-w-2xl text-sm text-gray-500">Detalles del departamento reservado.</p>
                        </div>
                        <div className="border-t border-gray-200">
                            <dl>
                                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Nombre</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{departamento.nombre}</dd>
                                </div>
                                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Ubicación</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{departamento.ubicacion}</dd>
                                </div>
                                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Características</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        {departamento.area} m² • {departamento.habitaciones} hab. • {departamento.banos} baños
                                    </dd>
                                </div>
                            </dl>
                        </div>
                    </div>

                    {/* Detalles del precio */}
                    <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
                        <div className="px-4 py-5 sm:px-6">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">Detalles del Precio</h3>
                            <p className="mt-1 max-w-2xl text-sm text-gray-500">Información de montos y pagos.</p>
                        </div>
                        <div className="border-t border-gray-200">
                            <dl>
                                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Precio Total del Departamento</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{formatMoney(reserva.precio_total)}</dd>
                                </div>
                                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Monto de la Reserva</dt>
                                    <dd className="mt-1 text-lg font-bold text-gray-900 sm:mt-0 sm:col-span-2">{formatMoney(reserva.monto_reserva)}</dd>
                                </div>
                                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Porcentaje del Precio Total</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        {((reserva.monto_reserva / reserva.precio_total) * 100).toFixed(2)}%
                                    </dd>
                                </div>
                                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Saldo Pendiente</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        {formatMoney(reserva.precio_total - reserva.monto_reserva)}
                                    </dd>
                                </div>
                            </dl>
                        </div>
                    </div>

                    {/* Comentarios */}
                    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                        <div className="px-4 py-5 sm:px-6">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">Comentarios</h3>
                        </div>
                        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                            <p className="text-sm text-gray-900 whitespace-pre-line">{reserva.comentarios || 'No hay comentarios registrados.'}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal de confirmación */}
            {modalVisible && (
                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className={`mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full sm:mx-0 sm:h-10 sm:w-10 ${
                                        accion === 'registrar-pago' ? 'bg-green-100' :
                                        accion === 'completar' ? 'bg-green-100' :
                                        'bg-red-100'
                                    }`}>
                                        {accion === 'registrar-pago' && (
                                            <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        )}
                                        {accion === 'completar' && (
                                            <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                            </svg>
                                        )}
                                        {accion === 'cancelar' && (
                                            <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        )}
                                    </div>
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                                            {accion === 'registrar-pago' && 'Registrar pago de reserva'}
                                            {accion === 'completar' && 'Completar reserva'}
                                            {accion === 'cancelar' && 'Cancelar reserva'}
                                        </h3>
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-500">
                                                {accion === 'registrar-pago' && `¿Está seguro que desea registrar el pago de ${formatMoney(reserva.monto_reserva)} para esta reserva?`}
                                                {accion === 'completar' && '¿Está seguro que desea marcar esta reserva como completada? Esto confirmará que el proceso de reserva ha finalizado exitosamente.'}
                                                {accion === 'cancelar' && '¿Está seguro que desea cancelar esta reserva? Esta acción no se puede deshacer.'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    type="button"
                                    className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white sm:ml-3 sm:w-auto sm:text-sm ${
                                        accion === 'registrar-pago' || accion === 'completar'
                                            ? 'bg-green-600 hover:bg-green-700'
                                            : 'bg-red-600 hover:bg-red-700'
                                    }`}
                                    onClick={ejecutarAccion}
                                >
                                    Confirmar
                                </button>
                                <button
                                    type="button"
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                    onClick={() => setModalVisible(false)}
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
}
