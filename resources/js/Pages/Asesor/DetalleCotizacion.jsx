import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import Layout from '@/components/layout/Layout';

export default function DetalleCotizacion({ auth, cotizacion, cliente, departamento }) {
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
        cotizacion.estado === 'emitida'
            ? 'bg-blue-100 text-blue-800'
            : cotizacion.estado === 'enviada'
            ? 'bg-indigo-100 text-indigo-800'
            : cotizacion.estado === 'aceptada'
            ? 'bg-green-100 text-green-800'
            : cotizacion.estado === 'rechazada'
            ? 'bg-red-100 text-red-800'
            : 'bg-gray-100 text-gray-800';

    return (
        <Layout auth={auth}>
            <Head title={`Cotización #${cotizacion.id}`} />

            <div className="py-12 bg-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Cotización #{cotizacion.id}</h2>
                            <p className="mt-1 text-sm text-gray-600">
                                Detalle de la cotización para {cliente.nombre} {cliente.apellidos}
                            </p>
                        </div>
                        <div className="flex space-x-3">
                            {cotizacion.estado === 'emitida' && (
                                <button
                                    onClick={() => confirmarAccion('enviar')}
                                    className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                                    </svg>
                                    Enviar Cotización
                                </button>
                            )}
                            {cotizacion.estado === 'enviada' && (
                                <>
                                    <button
                                        onClick={() => confirmarAccion('aceptar')}
                                        className="inline-flex items-center px-4 py-2 bg-green-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-green-700"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        Marcar como Aceptada
                                    </button>
                                    <button
                                        onClick={() => confirmarAccion('rechazar')}
                                        className="inline-flex items-center px-4 py-2 bg-red-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-700"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                        Marcar como Rechazada
                                    </button>
                                </>
                            )}
                            {cotizacion.estado === 'aceptada' && (
                                <Link
                                    href={`/asesor/reservas/crear/${cotizacion.id}`}
                                    className="inline-flex items-center px-4 py-2 bg-green-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-green-700"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                    </svg>
                                    Crear Reserva
                                </Link>
                            )}
                            {cotizacion.estado === 'emitida' && (
                                <Link
                                    href={`/asesor/cotizaciones/editar/${cotizacion.id}`}
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
                                href="/asesor/cotizaciones"
                                className="inline-flex items-center px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm font-medium rounded-md"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Volver
                            </Link>
                        </div>
                    </div>

                    <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
                        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                            <div>
                                <h3 className="text-lg leading-6 font-medium text-gray-900">Resumen de Cotización</h3>
                                <p className="mt-1 max-w-2xl text-sm text-gray-500">Detalles y estado actual.</p>
                            </div>
                            <div>
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${estadoClase}`}>
                                    {cotizacion.estado === 'emitida'
                                        ? 'Emitida'
                                        : cotizacion.estado === 'enviada'
                                        ? 'Enviada'
                                        : cotizacion.estado === 'aceptada'
                                        ? 'Aceptada'
                                        : cotizacion.estado === 'rechazada'
                                        ? 'Rechazada'
                                        : 'Vencida'
                                    }
                                </span>
                            </div>
                        </div>
                        <div className="border-t border-gray-200">
                            <dl>
                                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Cotización ID</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">#{cotizacion.id}</dd>
                                </div>
                                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Fecha de Emisión</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{formatDate(cotizacion.fecha)}</dd>
                                </div>
                                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Válida Hasta</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{formatDate(cotizacion.validaHasta)}</dd>
                                </div>
                                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Cliente</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        {cliente.nombre} {cliente.apellidos}<br />
                                        <span className="text-gray-500">{cliente.email}</span><br />
                                        <span className="text-gray-500">{cliente.telefono}</span>
                                    </dd>
                                </div>
                            </dl>
                        </div>
                    </div>

                    <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
                        <div className="px-4 py-5 sm:px-6">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">Información de la Propiedad</h3>
                            <p className="mt-1 max-w-2xl text-sm text-gray-500">Detalles del departamento cotizado.</p>
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
                                    <dt className="text-sm font-medium text-gray-500">Área</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{departamento.area} m²</dd>
                                </div>
                                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Habitaciones</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{departamento.habitaciones}</dd>
                                </div>
                                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Baños</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{departamento.banos}</dd>
                                </div>
                                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Estacionamientos</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{departamento.estacionamientos}</dd>
                                </div>
                            </dl>
                        </div>
                    </div>

                    <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
                        <div className="px-4 py-5 sm:px-6">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">Detalles del Precio</h3>
                            <p className="mt-1 max-w-2xl text-sm text-gray-500">Información de precios y descuentos.</p>
                        </div>
                        <div className="border-t border-gray-200">
                            <dl>
                                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Precio de Lista</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{formatMoney(cotizacion.precioLista)}</dd>
                                </div>
                                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Descuento</dt>
                                    <dd className="mt-1 text-sm text-green-600 sm:mt-0 sm:col-span-2">
                                        {cotizacion.descuento > 0 ? `- ${formatMoney(cotizacion.descuento)}` : 'Sin descuento'}
                                    </dd>
                                </div>
                                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Precio Final</dt>
                                    <dd className="mt-1 text-lg font-bold text-gray-900 sm:mt-0 sm:col-span-2">{formatMoney(cotizacion.precioFinal)}</dd>
                                </div>
                            </dl>
                        </div>
                    </div>

                    {cotizacion.observaciones && (
                        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                            <div className="px-4 py-5 sm:px-6">
                                <h3 className="text-lg leading-6 font-medium text-gray-900">Observaciones</h3>
                            </div>
                            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                                <p className="text-sm text-gray-900 whitespace-pre-line">{cotizacion.observaciones}</p>
                            </div>
                        </div>
                    )}
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
                                        accion === 'enviar' ? 'bg-blue-100' :
                                        accion === 'aceptar' ? 'bg-green-100' :
                                        'bg-red-100'
                                    }`}>
                                        {accion === 'enviar' && (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                                            </svg>
                                        )}
                                        {accion === 'aceptar' && (
                                            <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                            </svg>
                                        )}
                                        {accion === 'rechazar' && (
                                            <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        )}
                                    </div>
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                                            {accion === 'enviar' && 'Enviar cotización'}
                                            {accion === 'aceptar' && 'Confirmar aceptación'}
                                            {accion === 'rechazar' && 'Confirmar rechazo'}
                                        </h3>
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-500">
                                                {accion === 'enviar' && '¿Está seguro que desea enviar esta cotización al cliente? Se enviará un correo electrónico con los detalles.'}
                                                {accion === 'aceptar' && '¿Está seguro que desea marcar esta cotización como aceptada? Esto permitirá crear una reserva.'}
                                                {accion === 'rechazar' && '¿Está seguro que desea marcar esta cotización como rechazada? Esta acción no se puede deshacer.'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    type="button"
                                    className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white sm:ml-3 sm:w-auto sm:text-sm ${
                                        accion === 'enviar' ? 'bg-blue-600 hover:bg-blue-700' :
                                        accion === 'aceptar' ? 'bg-green-600 hover:bg-green-700' :
                                        'bg-red-600 hover:bg-red-700'
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
