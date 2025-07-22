import { useState, useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import Layout from '@/components/layout/Layout';
import TextInput from '@/components/common/TextInput';
import InputLabel from '@/components/common/InputLabel';
import InputError from '@/components/common/InputError';
import SelectInput from '@/components/common/SelectInput';
import TextareaInput from '@/components/common/TextareaInput';

export default function CrearReserva({ auth, cotizacion, cliente, departamento }) {
    // Formatear moneda
    const formatMoney = (amount) => {
        return new Intl.NumberFormat('es-PE', {
            style: 'currency',
            currency: 'PEN',
            minimumFractionDigits: 0
        }).format(amount);
    };

    // Formulario con Inertia
    const { data, setData, post, processing, errors } = useForm({
        cotizacion_id: cotizacion.id,
        monto_reserva: Math.round(cotizacion.precioFinal * 0.03), // 3% del precio por defecto
        fecha_expiracion: '', // Calculado abajo
        metodo_pago: 'transferencia',
        estado: 'pendiente',
        comentarios: '',
    });

    // Establece la fecha de expiración por defecto (7 días desde hoy)
    useEffect(() => {
        const hoy = new Date();
        const expiracion = new Date(hoy);
        expiracion.setDate(hoy.getDate() + 7);

        // Formato YYYY-MM-DD para el input type="date"
        const fechaFormateada = expiracion.toISOString().split('T')[0];
        setData('fecha_expiracion', fechaFormateada);
    }, []);

    // Función para enviar el formulario
    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('asesor.reservas.store'));
    };

    return (
        <Layout auth={auth}>
            <Head title="Crear Reserva" />

            <div className="py-12 bg-gray-100">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Crear Reserva para Cotización #{cotizacion.id}</h2>
                        <Link
                            href={`/asesor/cotizaciones/${cotizacion.id}`}
                            className="inline-flex items-center px-4 py-2 bg-gray-200 border border-transparent rounded-md font-semibold text-xs text-gray-800 uppercase tracking-widest hover:bg-gray-300 active:bg-gray-400 focus:outline-none focus:border-gray-500 focus:ring ring-gray-300 disabled:opacity-25 transition"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Volver a la Cotización
                        </Link>
                    </div>

                    {/* Resumen de la cotización */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="px-4 py-5 sm:px-6">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">Resumen de la Cotización</h3>
                            <p className="mt-1 max-w-2xl text-sm text-gray-500">Información de la cotización aceptada.</p>
                        </div>
                        <div className="border-t border-gray-200">
                            <dl>
                                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Cliente</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        {cliente.nombre} {cliente.apellidos}
                                    </dd>
                                </div>
                                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Departamento</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        {departamento.nombre} - {departamento.ubicacion}
                                    </dd>
                                </div>
                                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Precio Final</dt>
                                    <dd className="mt-1 text-sm font-bold text-gray-900 sm:mt-0 sm:col-span-2">
                                        {formatMoney(cotizacion.precioFinal)}
                                    </dd>
                                </div>
                            </dl>
                        </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <form onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Monto de reserva */}
                                    <div>
                                        <InputLabel htmlFor="monto_reserva" value="Monto de Reserva (S/)" />
                                        <div className="mt-1 relative rounded-md shadow-sm">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <span className="text-gray-500 sm:text-sm">S/</span>
                                            </div>
                                            <TextInput
                                                id="monto_reserva"
                                                type="number"
                                                name="monto_reserva"
                                                value={data.monto_reserva}
                                                className="pl-10 mt-1 block w-full"
                                                onChange={(e) => setData('monto_reserva', e.target.value)}
                                                required
                                            />
                                        </div>
                                        <p className="mt-1 text-xs text-gray-500">Recomendado: 3% del precio final ({formatMoney(Math.round(cotizacion.precioFinal * 0.03))}).</p>
                                        <InputError message={errors.monto_reserva} className="mt-2" />
                                    </div>

                                    {/* Fecha de expiración */}
                                    <div>
                                        <InputLabel htmlFor="fecha_expiracion" value="Fecha de Expiración" />
                                        <TextInput
                                            id="fecha_expiracion"
                                            type="date"
                                            name="fecha_expiracion"
                                            value={data.fecha_expiracion}
                                            className="mt-1 block w-full"
                                            onChange={(e) => setData('fecha_expiracion', e.target.value)}
                                            required
                                        />
                                        <p className="mt-1 text-xs text-gray-500">Fecha límite para realizar el pago de la reserva.</p>
                                        <InputError message={errors.fecha_expiracion} className="mt-2" />
                                    </div>

                                    {/* Método de pago */}
                                    <div>
                                        <InputLabel htmlFor="metodo_pago" value="Método de Pago" />
                                        <SelectInput
                                            id="metodo_pago"
                                            name="metodo_pago"
                                            value={data.metodo_pago}
                                            onChange={(e) => setData('metodo_pago', e.target.value)}
                                            className="mt-1 block w-full"
                                            required
                                        >
                                            <option value="transferencia">Transferencia Bancaria</option>
                                            <option value="efectivo">Efectivo</option>
                                            <option value="tarjeta">Tarjeta de Crédito/Débito</option>
                                            <option value="deposito">Depósito Bancario</option>
                                            <option value="yape">Yape</option>
                                            <option value="plin">Plin</option>
                                        </SelectInput>
                                        <InputError message={errors.metodo_pago} className="mt-2" />
                                    </div>

                                    {/* Estado */}
                                    <div>
                                        <InputLabel htmlFor="estado" value="Estado Inicial" />
                                        <SelectInput
                                            id="estado"
                                            name="estado"
                                            value={data.estado}
                                            onChange={(e) => setData('estado', e.target.value)}
                                            className="mt-1 block w-full"
                                            required
                                        >
                                            <option value="pendiente">Pendiente de Pago</option>
                                            <option value="pagado">Pagado</option>
                                        </SelectInput>
                                        <InputError message={errors.estado} className="mt-2" />
                                    </div>

                                    {/* Comentarios */}
                                    <div className="md:col-span-2">
                                        <InputLabel htmlFor="comentarios" value="Comentarios o Instrucciones de Pago" />
                                        <TextareaInput
                                            id="comentarios"
                                            name="comentarios"
                                            value={data.comentarios}
                                            className="mt-1 block w-full"
                                            onChange={(e) => setData('comentarios', e.target.value)}
                                            rows={4}
                                        />
                                        <InputError message={errors.comentarios} className="mt-2" />
                                    </div>
                                </div>

                                <div className="bg-gray-50 p-4 mt-6 rounded-lg">
                                    <h4 className="font-medium text-gray-800 mb-2">Información Importante</h4>
                                    <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                                        <li>La reserva será válida una vez confirmado el pago del monto de reserva.</li>
                                        <li>Si el cliente no realiza el pago antes de la fecha de expiración, la reserva quedará anulada.</li>
                                        <li>El monto de la reserva se descontará del precio final del departamento.</li>
                                        <li>En caso de desistimiento, aplicarán las políticas de reembolso establecidas en el contrato.</li>
                                    </ul>
                                </div>

                                <div className="flex items-center justify-end mt-6">
                                    <button
                                        type="submit"
                                        className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:border-indigo-900 focus:ring ring-indigo-300 disabled:opacity-25 transition"
                                        disabled={processing}
                                    >
                                        {processing ? 'Procesando...' : 'Crear Reserva'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
