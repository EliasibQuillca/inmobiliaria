import React, { useState, useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AsesorLayout from '../../../Layouts/AsesorLayout';

export default function EditarCotizacion({ auth, cotizacion, clientes, departamentos }) {
    const { data, setData, patch, processing, errors } = useForm({
        cliente_id: cotizacion.cliente_id || '',
        departamento_id: cotizacion.departamento_id || '',
        monto: cotizacion.monto || '',
        descuento: cotizacion.descuento || '',
        fecha_validez: cotizacion.fecha_validez || '',
        notas: cotizacion.notas || '',
        condiciones: cotizacion.condiciones || '',
    });

    const [departamentoSeleccionado, setDepartamentoSeleccionado] = useState(cotizacion.departamento || null);

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
                <div className="max-w-6xl mx-auto sm:px-6 lg:px-8">
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

                    <div className="bg-white shadow sm:rounded-lg">
                        <div className="px-4 py-5 sm:p-6">
                            <form onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                                    {/* Selección de Cliente */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Cliente *
                                        </label>
                                        <select
                                            value={data.cliente_id}
                                            onChange={(e) => setData('cliente_id', e.target.value)}
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                            required
                                        >
                                            <option value="">Seleccionar cliente</option>
                                            {clientes.map((cliente) => (
                                                <option key={cliente.id} value={cliente.id}>
                                                    {cliente.usuario?.name || cliente.nombre}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.cliente_id && <p className="text-red-500 text-xs mt-1">{errors.cliente_id}</p>}
                                    </div>

                                    {/* Selección de Departamento */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Departamento *
                                        </label>
                                        <select
                                            value={data.departamento_id}
                                            onChange={(e) => handleDepartamentoChange(e.target.value)}
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                            required
                                        >
                                            <option value="">Seleccionar departamento</option>
                                            {departamentos.map((departamento) => (
                                                <option key={departamento.id} value={departamento.id}>
                                                    {departamento.titulo} - {formatCurrency(departamento.precio)}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.departamento_id && <p className="text-red-500 text-xs mt-1">{errors.departamento_id}</p>}
                                    </div>

                                    {/* Información del departamento seleccionado */}
                                    {departamentoSeleccionado && (
                                        <div className="sm:col-span-2 bg-gray-50 p-4 rounded-md">
                                            <h4 className="text-sm font-medium text-gray-900 mb-2">Información del Departamento</h4>
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                                                <div>
                                                    <span className="font-medium text-gray-700">Ubicación:</span> {departamentoSeleccionado.ubicacion}
                                                </div>
                                                <div>
                                                    <span className="font-medium text-gray-700">Dormitorios:</span> {departamentoSeleccionado.dormitorios}
                                                </div>
                                                <div>
                                                    <span className="font-medium text-gray-700">Baños:</span> {departamentoSeleccionado.banos}
                                                </div>
                                                <div>
                                                    <span className="font-medium text-gray-700">Área:</span> {departamentoSeleccionado.area_total} m²
                                                </div>
                                                <div>
                                                    <span className="font-medium text-gray-700">Precio:</span> {formatCurrency(departamentoSeleccionado.precio)}
                                                </div>
                                                <div>
                                                    <span className="font-medium text-gray-700">Estado:</span> {departamentoSeleccionado.estado}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Monto */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Monto Cotización *
                                        </label>
                                        <div className="mt-1 relative rounded-md shadow-sm">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <span className="text-gray-500 sm:text-sm">$</span>
                                            </div>
                                            <input
                                                type="number"
                                                value={data.monto}
                                                onChange={(e) => setData('monto', e.target.value)}
                                                className="pl-7 mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="0.00"
                                                min="0"
                                                step="0.01"
                                                required
                                            />
                                        </div>
                                        {errors.monto && <p className="text-red-500 text-xs mt-1">{errors.monto}</p>}
                                    </div>

                                    {/* Descuento */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Descuento (opcional)
                                        </label>
                                        <div className="mt-1 relative rounded-md shadow-sm">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <span className="text-gray-500 sm:text-sm">$</span>
                                            </div>
                                            <input
                                                type="number"
                                                value={data.descuento}
                                                onChange={(e) => setData('descuento', e.target.value)}
                                                className="pl-7 mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="0.00"
                                                min="0"
                                                step="0.01"
                                            />
                                        </div>
                                        {errors.descuento && <p className="text-red-500 text-xs mt-1">{errors.descuento}</p>}
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
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                            required
                                            min={new Date().toISOString().split('T')[0]}
                                        />
                                        {errors.fecha_validez && <p className="text-red-500 text-xs mt-1">{errors.fecha_validez}</p>}
                                    </div>

                                    {/* Notas */}
                                    <div className="sm:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Notas Adicionales
                                        </label>
                                        <textarea
                                            value={data.notas}
                                            onChange={(e) => setData('notas', e.target.value)}
                                            rows={3}
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Notas o comentarios adicionales sobre la cotización"
                                        />
                                        {errors.notas && <p className="text-red-500 text-xs mt-1">{errors.notas}</p>}
                                    </div>

                                    {/* Condiciones */}
                                    <div className="sm:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Condiciones de la Cotización
                                        </label>
                                        <textarea
                                            value={data.condiciones}
                                            onChange={(e) => setData('condiciones', e.target.value)}
                                            rows={4}
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Términos y condiciones específicas para esta cotización"
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
                                        Cancelar
                                    </Link>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                                    >
                                        {processing ? 'Actualizando...' : 'Actualizar Cotización'}
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
