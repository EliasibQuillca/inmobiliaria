import React, { useState, useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AsesorLayout from '../../../Layouts/AsesorLayout';

export default function EditarCotizacion({ auth, cotizacion, clientes, departamentos }) {
    // Formatear fecha al formato yyyy-MM-dd requerido por input type="date"
    const formatearFechaParaInput = (fecha) => {
        if (!fecha) return '';
        const date = new Date(fecha);
        return date.toISOString().split('T')[0];
    };

    const { data, setData, patch, processing, errors } = useForm({
        cliente_id: cotizacion.cliente_id || '',
        departamento_id: cotizacion.departamento_id || '',
        monto: cotizacion.monto || '',
        descuento: cotizacion.descuento || 0,
        fecha_validez: formatearFechaParaInput(cotizacion.fecha_validez),
        notas: cotizacion.notas || '',
        condiciones: cotizacion.condiciones || '',
    });

    const [departamentoSeleccionado, setDepartamentoSeleccionado] = useState(cotizacion.departamento || null);
    const [montoFinal, setMontoFinal] = useState(0);

    // Calcular monto final cuando cambia monto o descuento
    useEffect(() => {
        const monto = parseFloat(data.monto) || 0;
        const descuento = parseFloat(data.descuento) || 0;
        setMontoFinal(monto - descuento);
    }, [data.monto, data.descuento]);

    // Validar si la cotización puede editarse
    const puedeEditar = ['pendiente', 'aprobada'].includes(cotizacion.estado);
    const soloNotas = ['en_proceso'].includes(cotizacion.estado);
    const bloqueada = ['aceptada', 'rechazada'].includes(cotizacion.estado);

    const handleDepartamentoChange = (departamentoId) => {
        const departamento = departamentos.find(d => d.id == departamentoId);
        setDepartamentoSeleccionado(departamento);
        setData('departamento_id', departamentoId);

        if (departamento) {
            setData(prev => ({
                ...prev,
                departamento_id: departamentoId,
                monto: departamento.precio
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        patch(`/asesor/cotizaciones/${cotizacion.id}`);
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
            <Head title="Editar Cotización" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="md:flex md:items-center md:justify-between">
                            <div className="flex-1 min-w-0">
                                <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                                    Editar Cotización
                                </h2>
                                <p className="mt-1 text-sm text-gray-500">
                                    Modifica los detalles de la cotización existente
                                </p>
                            </div>
                            <div className="mt-4 md:mt-0">
                                <Link
                                    href={route('asesor.cotizaciones')}
                                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                                >
                                    Volver a Cotizaciones
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Información actual */}
                    <div className="bg-blue-50 p-4 rounded-md mb-6">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-blue-800">
                                    Cotización #{cotizacion.id} - Estado: {cotizacion.estado}
                                </h3>
                                <div className="mt-2 text-sm text-blue-700">
                                    <p>Cliente: {cotizacion.cliente?.usuario?.name || cotizacion.cliente?.nombre}</p>
                                    <p>Departamento: {cotizacion.departamento?.titulo}</p>
                                    <p>Fecha de creación: {new Date(cotizacion.created_at).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {bloqueada && (
                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-yellow-700">
                                        Esta cotización está en estado <strong>{cotizacion.estado}</strong> y no puede ser editada.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Formulario Principal */}
                        <div className="lg:col-span-2">
                            <div className="bg-white shadow sm:rounded-lg">
                                <div className="px-4 py-5 sm:p-6">
                            <form onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                                    {/* Selección de Cliente - BLOQUEADO */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Cliente *
                                        </label>
                                        <input
                                            type="text"
                                            value={cotizacion.cliente?.usuario?.name || cotizacion.cliente?.nombre}
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm bg-gray-100 cursor-not-allowed"
                                            disabled
                                            readOnly
                                        />
                                        <p className="mt-1 text-xs text-gray-500">El cliente no puede ser modificado</p>
                                    </div>

                                    {/* Selección de Departamento - BLOQUEADO */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Departamento *
                                        </label>
                                        <input
                                            type="text"
                                            value={`${cotizacion.departamento?.titulo} - ${formatCurrency(cotizacion.departamento?.precio)}`}
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm bg-gray-100 cursor-not-allowed"
                                            disabled
                                            readOnly
                                        />
                                        <p className="mt-1 text-xs text-gray-500">El departamento no puede ser modificado</p>
                                    </div>

                                    {/* Información del departamento */}
                                    <div className="sm:col-span-2 bg-gray-50 p-4 rounded-md">
                                        <h4 className="text-sm font-medium text-gray-900 mb-2">Información del Departamento</h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                                            <div>
                                                <span className="font-medium text-gray-700">Ubicación:</span> {cotizacion.departamento?.ubicacion}
                                            </div>
                                            <div>
                                                <span className="font-medium text-gray-700">Habitaciones:</span> {cotizacion.departamento?.habitaciones}
                                            </div>
                                            <div>
                                                <span className="font-medium text-gray-700">Baños:</span> {cotizacion.departamento?.banos}
                                            </div>
                                            <div>
                                                <span className="font-medium text-gray-700">Área:</span> {cotizacion.departamento?.area} m²
                                            </div>
                                            <div>
                                                <span className="font-medium text-gray-700">Precio:</span> {formatCurrency(cotizacion.departamento?.precio)}
                                            </div>
                                            <div>
                                                <span className="font-medium text-gray-700">Estado:</span> {cotizacion.departamento?.estado}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Monto Base - BLOQUEADO */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Precio Base (Departamento)
                                        </label>
                                        <div className="mt-1 relative rounded-md shadow-sm">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <span className="text-gray-500 sm:text-sm">S/</span>
                                            </div>
                                            <input
                                                type="text"
                                                value={formatCurrency(data.monto)}
                                                className="pl-10 mt-1 block w-full border-gray-300 rounded-md shadow-sm bg-gray-100 cursor-not-allowed"
                                                disabled
                                                readOnly
                                            />
                                        </div>
                                        <p className="mt-1 text-xs text-gray-500">El precio base no puede ser modificado</p>
                                    </div>

                                    {/* Descuento - SIEMPRE EDITABLE */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Descuento (S/) - Opcional
                                        </label>
                                        <div className="mt-1 relative rounded-md shadow-sm">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <span className="text-gray-500 sm:text-sm">S/</span>
                                            </div>
                                            <input
                                                type="number"
                                                value={data.descuento}
                                                onChange={(e) => setData('descuento', e.target.value)}
                                                className={`pl-10 mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${bloqueada ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                                                placeholder="0.00"
                                                min="0"
                                                max={data.monto * 0.5}
                                                step="0.01"
                                                disabled={bloqueada}
                                                readOnly={bloqueada}
                                            />
                                        </div>
                                        {errors.descuento && <p className="text-red-500 text-xs mt-1">{errors.descuento}</p>}
                                        {parseFloat(data.descuento) > (data.monto * 0.5) && (
                                            <p className="text-red-500 text-xs mt-1">⚠️ El descuento máximo permitido es S/ {formatCurrency(data.monto * 0.5)} (50% del precio)</p>
                                        )}
                                        {bloqueada && <p className="mt-1 text-xs text-gray-500">No editable en estado actual</p>}
                                        <p className="mt-1 text-xs text-gray-500">Máximo permitido: 50% del precio base (S/ {formatCurrency(data.monto * 0.5)})</p>
                                    </div>

                                    {/* Fecha de Validez */}
                                    <div className="sm:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Fecha de Validez *
                                        </label>
                                        <input
                                            type="date"
                                            value={data.fecha_validez}
                                            onChange={(e) => setData('fecha_validez', e.target.value)}
                                            className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${bloqueada ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                                            required
                                            min={new Date().toISOString().split('T')[0]}
                                            disabled={bloqueada}
                                            readOnly={bloqueada}
                                        />
                                        {errors.fecha_validez && <p className="text-red-500 text-xs mt-1">{errors.fecha_validez}</p>}
                                        {bloqueada && <p className="mt-1 text-xs text-gray-500">No editable en estado actual</p>}
                                    </div>

                                    {/* Notas - SIEMPRE EDITABLE */}
                                    <div className="sm:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Notas Adicionales
                                        </label>
                                        <textarea
                                            value={data.notas}
                                            onChange={(e) => setData('notas', e.target.value)}
                                            rows={3}
                                            className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${bloqueada ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                                            placeholder="Notas o comentarios adicionales sobre la cotización"
                                            disabled={bloqueada}
                                            readOnly={bloqueada}
                                        />
                                        {errors.notas && <p className="text-red-500 text-xs mt-1">{errors.notas}</p>}
                                    </div>

                                    {/* Condiciones - SIEMPRE EDITABLE (excepto bloqueada) */}
                                    <div className="sm:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Condiciones de la Cotización
                                        </label>
                                        <textarea
                                            value={data.condiciones}
                                            onChange={(e) => setData('condiciones', e.target.value)}
                                            rows={4}
                                            className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${bloqueada ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                                            placeholder="Términos y condiciones específicas para esta cotización"
                                            disabled={bloqueada}
                                            readOnly={bloqueada}
                                        />
                                        {errors.condiciones && <p className="text-red-500 text-xs mt-1">{errors.condiciones}</p>}
                                    </div>
                                </div>

                                {/* Botones */}
                                <div className="mt-8 flex justify-end space-x-3">
                                    <Link
                                        href={route('asesor.cotizaciones')}
                                        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                                    >
                                        {bloqueada ? 'Cerrar' : 'Cancelar'}
                                    </Link>
                                    {!bloqueada && (
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                                        >
                                            {processing ? 'Actualizando...' : 'Actualizar Cotización'}
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>
                            </div>
                        </div>

                        {/* Panel de Vista Previa */}
                        <div className="lg:col-span-1">
                            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg sticky top-6">
                                <div className="p-6">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Vista Previa</h3>

                                    {/* Información del Cliente */}
                                    <div className="mb-6">
                                        <h4 className="font-medium text-gray-700 mb-2">Cliente</h4>
                                        <div className="text-sm text-gray-600">
                                            <p>{cotizacion.cliente?.usuario?.name || cotizacion.cliente?.nombre}</p>
                                            <p>{cotizacion.cliente?.telefono}</p>
                                            {cotizacion.cliente?.email && <p>{cotizacion.cliente?.email}</p>}
                                        </div>
                                    </div>

                                    {/* Información del Departamento */}
                                    <div className="mb-6">
                                        <h4 className="font-medium text-gray-700 mb-2">Departamento</h4>
                                        <div className="text-sm text-gray-600">
                                            <p><strong>Nombre:</strong> {cotizacion.departamento?.titulo}</p>
                                            <p><strong>Ubicación:</strong> {cotizacion.departamento?.ubicacion}</p>
                                            <p><strong>Habitaciones:</strong> {cotizacion.departamento?.habitaciones}</p>
                                            <p><strong>Baños:</strong> {cotizacion.departamento?.banos}</p>
                                            <p><strong>Área:</strong> {cotizacion.departamento?.area} m²</p>
                                            <p><strong>Estado:</strong> {cotizacion.departamento?.estado}</p>
                                        </div>
                                    </div>

                                    {/* Resumen de Precios */}
                                    <div className="border-t pt-4">
                                        <h4 className="font-medium text-gray-700 mb-2">Resumen</h4>
                                        <div className="text-sm space-y-1">
                                            <div className="flex justify-between">
                                                <span>Precio Base:</span>
                                                <span>{formatCurrency(data.monto)}</span>
                                            </div>
                                            {data.descuento > 0 && (
                                                <div className="flex justify-between text-red-600">
                                                    <span>Descuento:</span>
                                                    <span>-{formatCurrency(data.descuento)}</span>
                                                </div>
                                            )}
                                            <div className="flex justify-between font-medium text-lg border-t pt-2 mt-2">
                                                <span>Total:</span>
                                                <span>{formatCurrency(montoFinal)}</span>
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
