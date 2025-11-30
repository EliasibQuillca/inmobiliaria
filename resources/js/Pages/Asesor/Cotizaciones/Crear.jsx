import React, { useState, useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AsesorLayout from '../../../Layouts/AsesorLayout';

export default function CrearCotizacion({ auth, clientes, departamentos, departamentosFiltrados = [], clienteSeleccionado, departamentoSeleccionado, solicitud }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        cliente_id: clienteSeleccionado ? clienteSeleccionado.id : '',
        departamento_id: departamentoSeleccionado ? departamentoSeleccionado.id : '',
        monto: departamentoSeleccionado ? departamentoSeleccionado.precio : '',
        descuento: '',
        fecha_validez: '',
        notas: solicitud ? solicitud.mensaje_solicitud : '',
        condiciones: '',
        solicitud_id: solicitud ? solicitud.id : '',
    });

    const [mostrarFiltrados, setMostrarFiltrados] = useState(true);
    const [departamentoSeleccionadoState, setDepartamentoSeleccionadoState] = useState(departamentoSeleccionado);

    // Determinar qué departamentos mostrar
    const departamentosAMostrar = mostrarFiltrados && departamentosFiltrados.length > 0
        ? departamentosFiltrados
        : departamentos;

    useEffect(() => {
        // Inicialmente mostrar filtrados si hay cliente seleccionado y hay departamentos filtrados
        if (clienteSeleccionado && departamentosFiltrados.length === 0) {
            setMostrarFiltrados(false);
        }
    }, [clienteSeleccionado, departamentosFiltrados]);

    const handleDepartamentoChange = (departamentoId) => {
        const departamento = departamentos.find(d => d.id == departamentoId);
        setDepartamentoSeleccionadoState(departamento);
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
        post('/asesor/cotizaciones', {
            onSuccess: () => {
                reset();
            }
        });
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
            <Head title="Crear Cotización" />

            <div className="py-12">
                <div className="max-w-6xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="md:flex md:items-center md:justify-between">
                            <div className="flex-1 min-w-0">
                                <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                                    Crear Nueva Cotización
                                </h2>
                                <p className="mt-1 text-sm text-gray-500">
                                    {clienteSeleccionado
                                        ? `Cotización para ${clienteSeleccionado.nombre}`
                                        : 'Completa los datos para generar la cotización'
                                    }
                                </p>
                            </div>
                            <div className="mt-4 flex md:mt-0 md:ml-4">
                                <Link
                                    href={route('asesor.cotizaciones')}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                                >
                                    Cancelar
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Formulario Principal */}
                        <div className="lg:col-span-2">
                            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                                <div className="p-6">
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        {/* Selección de Cliente */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Cliente
                                            </label>
                                            <select
                                                value={data.cliente_id}
                                                onChange={(e) => setData('cliente_id', e.target.value)}
                                                disabled={clienteSeleccionado}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                                                required
                                            >
                                                <option value="">Seleccionar cliente...</option>
                                                {clientes.map((cliente) => (
                                                    <option key={cliente.id} value={cliente.id}>
                                                        {cliente.nombre} {cliente.dni ? `(DNI: ${cliente.dni})` : ''}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.cliente_id && (
                                                <p className="mt-1 text-sm text-red-600">{errors.cliente_id}</p>
                                            )}
                                        </div>

                                        {/* Selección de Departamento */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Departamento *
                                                {clienteSeleccionado && departamentosFiltrados.length > 0 && (
                                                    <span className="text-xs text-blue-600 ml-2">
                                                        (Filtrado por preferencias del cliente)
                                                    </span>
                                                )}
                                            </label>

                                            {/* Controles para alternar entre filtrados y todos */}
                                            {clienteSeleccionado && departamentosFiltrados.length > 0 && (
                                                <div className="mb-2 flex space-x-4">
                                                    <label className="inline-flex items-center">
                                                        <input
                                                            type="radio"
                                                            checked={mostrarFiltrados}
                                                            onChange={() => setMostrarFiltrados(true)}
                                                            className="form-radio text-blue-600"
                                                        />
                                                        <span className="ml-2 text-sm text-gray-700">
                                                            Recomendados ({departamentosFiltrados.length})
                                                        </span>
                                                    </label>
                                                    <label className="inline-flex items-center">
                                                        <input
                                                            type="radio"
                                                            checked={!mostrarFiltrados}
                                                            onChange={() => setMostrarFiltrados(false)}
                                                            className="form-radio text-blue-600"
                                                        />
                                                        <span className="ml-2 text-sm text-gray-700">
                                                            Todos los disponibles ({departamentos.length})
                                                        </span>
                                                    </label>
                                                </div>
                                            )}

                                            <select
                                                value={data.departamento_id}
                                                onChange={(e) => handleDepartamentoChange(e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                required
                                            >
                                                <option value="">Seleccionar departamento...</option>
                                                {departamentosAMostrar.map((departamento) => (
                                                    <option key={departamento.id} value={departamento.id}>
                                                        {departamento.titulo || departamento.codigo} - {formatCurrency(departamento.precio)}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.departamento_id && (
                                                <p className="mt-1 text-sm text-red-600">{errors.departamento_id}</p>
                                            )}

                                            {/* Mensaje informativo si no hay departamentos filtrados */}
                                            {clienteSeleccionado && departamentosFiltrados.length === 0 && (
                                                <p className="mt-1 text-sm text-yellow-600">
                                                    <i className="fas fa-info-circle mr-1"></i>
                                                    No hay departamentos que coincidan con las preferencias del cliente.
                                                    Se muestran todos los disponibles.
                                                </p>
                                            )}
                                        </div>

                                        {/* Monto y Descuento */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Monto Base
                                                </label>
                                                <input
                                                    type="number"
                                                    value={data.monto}
                                                    onChange={(e) => setData('monto', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    min="0"
                                                    step="1000"
                                                    required
                                                />
                                                {errors.monto && (
                                                    <p className="mt-1 text-sm text-red-600">{errors.monto}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Descuento (S/) - Opcional
                                                </label>
                                                <input
                                                    type="number"
                                                    value={data.descuento}
                                                    onChange={(e) => setData('descuento', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    placeholder="0"
                                                    min="0"
                                                    step="0.01"
                                                />
                                                <p className="mt-1 text-xs text-gray-500">Ingresa el monto de descuento en soles (ej: 5000)</p>
                                                {errors.descuento && (
                                                    <p className="mt-1 text-sm text-red-600">{errors.descuento}</p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Fecha de Validez */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Válida hasta
                                            </label>
                                            <input
                                                type="date"
                                                value={data.fecha_validez}
                                                onChange={(e) => setData('fecha_validez', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                min={new Date().toISOString().split('T')[0]}
                                                required
                                            />
                                            {errors.fecha_validez && (
                                                <p className="mt-1 text-sm text-red-600">{errors.fecha_validez}</p>
                                            )}
                                        </div>

                                        {/* Notas */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Notas Adicionales
                                            </label>
                                            <textarea
                                                value={data.notas}
                                                onChange={(e) => setData('notas', e.target.value)}
                                                rows={3}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="Comentarios o notas sobre la cotización..."
                                            />
                                            {errors.notas && (
                                                <p className="mt-1 text-sm text-red-600">{errors.notas}</p>
                                            )}
                                        </div>

                                        {/* Condiciones */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Condiciones Especiales
                                            </label>
                                            <textarea
                                                value={data.condiciones}
                                                onChange={(e) => setData('condiciones', e.target.value)}
                                                rows={4}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="Condiciones específicas de la cotización, métodos de pago, etc."
                                            />
                                            {errors.condiciones && (
                                                <p className="mt-1 text-sm text-red-600">{errors.condiciones}</p>
                                            )}
                                        </div>

                                        {/* Botones */}
                                        <div className="flex justify-end space-x-3">
                                            <Link
                                                href={route('asesor.cotizaciones')}
                                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                                            >
                                                Cancelar
                                            </Link>
                                            <button
                                                type="submit"
                                                disabled={processing}
                                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                                            >
                                                {processing ? 'Creando...' : 'Crear Cotización'}
                                            </button>
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
                                    {clienteSeleccionado && (
                                        <div className="mb-6">
                                            <h4 className="font-medium text-gray-700 mb-2">Cliente</h4>
                                            <div className="text-sm text-gray-600">
                                                <p>{clienteSeleccionado.nombre}</p>
                                                <p>{clienteSeleccionado.telefono}</p>
                                                {clienteSeleccionado.email && <p>{clienteSeleccionado.email}</p>}
                                            </div>
                                        </div>
                                    )}

                                    {/* Información del Departamento */}
                                    {departamentoSeleccionadoState && (
                                        <div className="mb-6">
                                            <h4 className="font-medium text-gray-700 mb-2">Departamento</h4>
                                            <div className="text-sm text-gray-600">
                                                <p><strong>Código:</strong> {departamentoSeleccionadoState.codigo}</p>
                                                <p><strong>Tipo:</strong> {departamentoSeleccionadoState.tipo_propiedad}</p>
                                                <p><strong>Habitaciones:</strong> {departamentoSeleccionadoState.habitaciones}</p>
                                                <p><strong>Baños:</strong> {departamentoSeleccionadoState.banos}</p>
                                                <p><strong>Área:</strong> {departamentoSeleccionadoState.area_construida} m²</p>
                                                <p><strong>Precio:</strong> {formatCurrency(departamentoSeleccionadoState.precio)}</p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Resumen de Precios */}
                                    {data.monto && (
                                        <div className="border-t pt-4">
                                            <h4 className="font-medium text-gray-700 mb-2">Resumen</h4>
                                            <div className="text-sm space-y-1">
                                                <div className="flex justify-between">
                                                    <span>Precio Base:</span>
                                                    <span>{formatCurrency(data.monto)}</span>
                                                </div>
                                                {data.descuento && (
                                                    <div className="flex justify-between text-red-600">
                                                        <span>Descuento:</span>
                                                        <span>-{formatCurrency(data.descuento)}</span>
                                                    </div>
                                                )}
                                                <div className="flex justify-between font-medium border-t pt-1">
                                                    <span>Total:</span>
                                                    <span>{formatCurrency((data.monto || 0) - (data.descuento || 0))}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AsesorLayout>
    );
}
