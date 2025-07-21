import React, { useState, useEffect } from 'react';
import { cotizacionService } from '../../services/api';
import { ESTADO_COTIZACION } from '../../constants';
import PrimaryButton from '../PrimaryButton';
import { useAuth } from '../../contexts/AuthContext';

const CotizacionForm = ({ departamento, cliente, onSuccess }) => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [cotizacion, setCotizacion] = useState({
        departamento_id: departamento?.id || '',
        cliente_id: cliente?.id || '',
        asesor_id: user?.asesor?.id || '',
        fecha_cotizacion: new Date().toISOString().split('T')[0],
        monto_inicial: departamento?.precio * 0.1 || 0, // 10% por defecto
        financiamiento: 'bancario',
        cuotas: 240, // 20 años por defecto
        observaciones: '',
    });

    useEffect(() => {
        // Actualizar cuando cambie el departamento o cliente
        if (departamento) {
            setCotizacion(prev => ({
                ...prev,
                departamento_id: departamento.id,
                monto_inicial: departamento.precio * 0.1,
            }));
        }

        if (cliente) {
            setCotizacion(prev => ({
                ...prev,
                cliente_id: cliente.id
            }));
        }
    }, [departamento, cliente]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCotizacion(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const calcularCuotaMensual = () => {
        // Cálculo simple de cuota mensual (sin intereses)
        if (!departamento?.precio) return 0;

        const montoFinanciar = departamento.precio - cotizacion.monto_inicial;
        return montoFinanciar / cotizacion.cuotas;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!cotizacion.departamento_id || !cotizacion.cliente_id) {
            setError('Debe seleccionar un departamento y un cliente');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await cotizacionService.crear(cotizacion);
            if (onSuccess) {
                onSuccess(response.data);
            }
        } catch (err) {
            console.error("Error al crear cotización:", err);
            setError('Hubo un error al crear la cotización. Verifique los datos e intente nuevamente.');
        } finally {
            setLoading(false);
        }
    };

    if (!departamento) {
        return <div className="p-4 text-center text-gray-600">Seleccione un departamento para generar una cotización</div>;
    }

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-medium mb-4">Generar Cotización</h3>

            {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Detalles del departamento */}
                <div className="p-3 bg-gray-50 rounded-md">
                    <h4 className="font-medium mb-2">Departamento seleccionado:</h4>
                    <p>{departamento.titulo}</p>
                    <p className="text-sm text-gray-600">{departamento.direccion}</p>
                    <p className="font-medium mt-1">
                        Precio: S/ {parseFloat(departamento.precio).toLocaleString('es-PE')}
                    </p>
                </div>

                {/* Detalles del cliente */}
                {cliente ? (
                    <div className="p-3 bg-gray-50 rounded-md">
                        <h4 className="font-medium mb-2">Cliente:</h4>
                        <p>{cliente.nombres} {cliente.apellidos}</p>
                        <p className="text-sm text-gray-600">{cliente.email}</p>
                        <p className="text-sm text-gray-600">{cliente.telefono}</p>
                    </div>
                ) : (
                    <div className="p-3 bg-yellow-50 text-yellow-700 rounded-md">
                        Debe seleccionar un cliente para continuar
                    </div>
                )}

                {/* Datos de la cotización */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Monto Inicial (S/)
                        </label>
                        <input
                            type="number"
                            name="monto_inicial"
                            value={cotizacion.monto_inicial}
                            onChange={handleChange}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            min={0}
                            max={departamento.precio}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Tipo de Financiamiento
                        </label>
                        <select
                            name="financiamiento"
                            value={cotizacion.financiamiento}
                            onChange={handleChange}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                            <option value="bancario">Crédito Bancario</option>
                            <option value="directo">Financiamiento Directo</option>
                            <option value="contado">Pago al Contado</option>
                        </select>
                    </div>

                    {cotizacion.financiamiento !== 'contado' && (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Número de Cuotas
                                </label>
                                <select
                                    name="cuotas"
                                    value={cotizacion.cuotas}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                >
                                    <option value={120}>10 años (120 cuotas)</option>
                                    <option value={180}>15 años (180 cuotas)</option>
                                    <option value={240}>20 años (240 cuotas)</option>
                                    <option value={300}>25 años (300 cuotas)</option>
                                    <option value={360}>30 años (360 cuotas)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Cuota Mensual Aproximada
                                </label>
                                <div className="mt-1 p-2 bg-gray-50 rounded border border-gray-200">
                                    S/ {calcularCuotaMensual().toLocaleString('es-PE', { maximumFractionDigits: 2 })}
                                </div>
                            </div>
                        </>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Observaciones
                    </label>
                    <textarea
                        name="observaciones"
                        value={cotizacion.observaciones}
                        onChange={handleChange}
                        rows={3}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    ></textarea>
                </div>

                <div className="flex justify-end">
                    <PrimaryButton
                        type="submit"
                        disabled={loading || !cliente}
                        className="w-full sm:w-auto"
                    >
                        {loading ? 'Procesando...' : 'Generar Cotización'}
                    </PrimaryButton>
                </div>
            </form>
        </div>
    );
};

export default CotizacionForm;
