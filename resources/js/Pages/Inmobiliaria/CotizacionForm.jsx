import React, { useState, useEffect } from 'react';
import { cotizacionService } from '../../services/api';
import { ESTADO_COTIZACION } from '../../constants';
import PrimaryButton from '@/components/PrimaryButton';
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
        if (!departamento?.precio) return 0;

        const montoFinanciar = departamento.precio - cotizacion.monto_inicial;

        // Tasas de interés anuales según tipo de financiamiento
        const tasasInteres = {
            'bancario': 0.09, // 9% anual para crédito bancario
            'directo': 0.12, // 12% anual para financiamiento directo
            'contado': 0 // Sin interés para pago al contado
        };

        // Si es pago al contado, no hay cuotas
        if (cotizacion.financiamiento === 'contado') return 0;

        // Tasa mensual (tasa anual dividida por 12 meses)
        const tasaMensual = tasasInteres[cotizacion.financiamiento] / 12;

        // Fórmula de cuota de amortización: P * r * (1+r)^n / ((1+r)^n - 1)
        // Donde P = principal, r = tasa mensual, n = número de cuotas
        if (tasaMensual === 0) return montoFinanciar / cotizacion.cuotas;

        const factor = Math.pow(1 + tasaMensual, cotizacion.cuotas);
        return montoFinanciar * (tasaMensual * factor) / (factor - 1);
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
        return (
            <div className="bg-white rounded-lg shadow-lg p-8 text-center border border-gray-200">
                <div className="flex flex-col items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    <h3 className="text-xl font-medium text-gray-600 mb-2">Seleccione un departamento</h3>
                    <p className="text-gray-500 max-w-md">
                        Para generar una cotización, primero debe seleccionar un departamento del catálogo disponible.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
            <h3 className="text-xl font-semibold mb-5 text-indigo-800 border-b pb-2">Generación de Cotización</h3>

            {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md border-l-4 border-red-500 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Detalles del departamento */}
                <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg shadow-sm p-4 border border-indigo-100">
                    <div className="flex items-center mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                        </svg>
                        <h4 className="font-medium text-indigo-800">Departamento seleccionado</h4>
                    </div>
                    <h5 className="text-lg font-medium">{departamento.titulo}</h5>
                    <p className="text-gray-600 flex items-center mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        {departamento.direccion}
                    </p>
                    <div className="flex justify-between items-center mt-3 pt-2 border-t border-indigo-100">
                        <span className="text-gray-600">Precio:</span>
                        <span className="text-lg font-semibold text-indigo-700">
                            S/ {parseFloat(departamento.precio).toLocaleString('es-PE')}
                        </span>
                    </div>
                </div>

                {/* Detalles del cliente */}
                {cliente ? (
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg shadow-sm p-4 border border-green-100">
                        <div className="flex items-center mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                            <h4 className="font-medium text-green-800">Cliente</h4>
                        </div>
                        <h5 className="text-lg font-medium">{cliente.nombres} {cliente.apellidos}</h5>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                            <p className="text-gray-600 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                </svg>
                                {cliente.email}
                            </p>
                            <p className="text-gray-600 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                </svg>
                                {cliente.telefono}
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="p-4 bg-yellow-50 text-yellow-800 rounded-lg border-l-4 border-yellow-400 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        Debe seleccionar un cliente para continuar
                    </div>
                )}

                {/* Datos de la cotización */}
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-5">
                    <h4 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        Detalles del Financiamiento
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Monto Inicial (S/)
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="text-gray-500 sm:text-sm">S/</span>
                                </div>
                                <input
                                    type="number"
                                    name="monto_inicial"
                                    value={cotizacion.monto_inicial}
                                    onChange={handleChange}
                                    className="pl-10 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    min={0}
                                    max={departamento.precio}
                                />
                            </div>

                            {/* Porcentaje del precio total */}
                            <div className="mt-2">
                                <div className="flex justify-between text-xs text-gray-500 mb-1">
                                    <span>0%</span>
                                    <span>{((cotizacion.monto_inicial / departamento.precio) * 100).toFixed(1)}%</span>
                                    <span>100%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-indigo-600 h-2 rounded-full"
                                        style={{ width: `${(cotizacion.monto_inicial / departamento.precio) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Tipo de Financiamiento
                            </label>
                            <div className="relative">
                                <select
                                    name="financiamiento"
                                    value={cotizacion.financiamiento}
                                    onChange={handleChange}
                                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                >
                                    <option value="bancario">Crédito Bancario (9% anual)</option>
                                    <option value="directo">Financiamiento Directo (12% anual)</option>
                                    <option value="contado">Pago al Contado</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {cotizacion.financiamiento !== 'contado' && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Plazo de Financiamiento
                                    </label>
                                    <div className="relative">
                                        <select
                                            name="cuotas"
                                            value={cotizacion.cuotas}
                                            onChange={handleChange}
                                            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        >
                                            <option value={120}>10 años (120 cuotas)</option>
                                            <option value={180}>15 años (180 cuotas)</option>
                                            <option value={240}>20 años (240 cuotas)</option>
                                            <option value={300}>25 años (300 cuotas)</option>
                                            <option value={360}>30 años (360 cuotas)</option>
                                        </select>
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Cuota Mensual Estimada
                                    </label>
                                    <div className="p-3 bg-indigo-50 rounded-lg border border-indigo-200 text-center">
                                        <span className="text-xs text-gray-500">Cuota mensual</span>
                                        <div className="text-xl font-bold text-indigo-700">
                                            S/ {calcularCuotaMensual().toLocaleString('es-PE', { maximumFractionDigits: 2 })}
                                        </div>
                                        <span className="text-xs text-gray-500">
                                            Total a financiar: S/ {(departamento.precio - cotizacion.monto_inicial).toLocaleString('es-PE')}
                                        </span>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Resumen financiero */}
                    {cotizacion.financiamiento !== 'contado' && (
                        <div className="mt-5 pt-4 border-t border-gray-200">
                            <h5 className="text-sm font-medium text-gray-700 mb-2">Resumen del Financiamiento:</h5>
                            <div className="grid grid-cols-3 gap-2 text-sm">
                                <div className="bg-gray-50 p-2 rounded">
                                    <div className="text-gray-500">Precio total</div>
                                    <div className="font-medium">S/ {parseFloat(departamento.precio).toLocaleString('es-PE')}</div>
                                </div>
                                <div className="bg-gray-50 p-2 rounded">
                                    <div className="text-gray-500">Cuota inicial</div>
                                    <div className="font-medium">S/ {parseFloat(cotizacion.monto_inicial).toLocaleString('es-PE')}</div>
                                </div>
                                <div className="bg-gray-50 p-2 rounded">
                                    <div className="text-gray-500">Total a financiar</div>
                                    <div className="font-medium">S/ {(departamento.precio - cotizacion.monto_inicial).toLocaleString('es-PE')}</div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-5">
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                        Observaciones Adicionales
                    </label>
                    <textarea
                        name="observaciones"
                        value={cotizacion.observaciones}
                        onChange={handleChange}
                        rows={3}
                        placeholder="Añada aquí detalles importantes sobre las necesidades del cliente, plazos deseados, o cualquier información relevante para la cotización..."
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    ></textarea>
                </div>

                <div className="flex justify-end pt-3">
                    <PrimaryButton
                        type="submit"
                        disabled={loading || !cliente}
                        className={`w-full sm:w-auto px-6 py-2.5 flex items-center justify-center ${loading || !cliente ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-lg transition-all duration-200'}`}
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Procesando...
                            </>
                        ) : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                Generar Cotización
                            </>
                        )}
                    </PrimaryButton>
                </div>
            </form>
        </div>
    );
};

export default CotizacionForm;
