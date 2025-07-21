import React, { useState, useEffect } from 'react';
import { ventaService } from '../../services/api';
import { ESTADO_VENTA } from '../../constants';
import PrimaryButton from '../PrimaryButton';
import SecondaryButton from '../SecondaryButton';
import { useAuth } from '../../contexts/AuthContext';

const RegistroVentaForm = ({ reserva, onSuccess }) => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [venta, setVenta] = useState({
        reserva_id: reserva?.id || '',
        departamento_id: reserva?.departamento_id || '',
        cliente_id: reserva?.cliente_id || '',
        asesor_id: user?.asesor?.id || '',
        fecha_venta: new Date().toISOString().split('T')[0],
        monto_total: reserva?.departamento?.precio || 0,
        monto_inicial: reserva?.monto_reserva || 0,
        metodo_pago: 'financiamiento_bancario',
        banco: '',
        numero_contrato: '',
        entrega_documentacion: false,
        observaciones: '',
        documentos: []
    });

    useEffect(() => {
        // Actualizar cuando cambie la reserva
        if (reserva) {
            setVenta(prev => ({
                ...prev,
                reserva_id: reserva.id,
                departamento_id: reserva.departamento_id,
                cliente_id: reserva.cliente_id,
                monto_total: reserva.departamento?.precio || 0,
                monto_inicial: reserva.monto_reserva || 0,
            }));
        }
    }, [reserva]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setVenta(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            // En un caso real, aquí se cargarían los archivos a un servidor
            // Por ahora, solo simularemos las URLs de los documentos
            const newDocs = files.map(file => ({
                nombre: file.name,
                tipo: file.type,
                url: URL.createObjectURL(file)
            }));

            setVenta(prev => ({
                ...prev,
                documentos: [...prev.documentos, ...newDocs]
            }));
        }
    };

    const removeDocument = (index) => {
        setVenta(prev => ({
            ...prev,
            documentos: prev.documentos.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!venta.reserva_id || !venta.departamento_id || !venta.cliente_id) {
            setError('Debe tener una reserva válida para registrar una venta');
            return;
        }

        if (venta.documentos.length === 0) {
            setError('Debe adjuntar al menos un documento');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Aquí se podría implementar la lógica para subir los documentos si existen
            const response = await ventaService.registrar(venta);
            if (onSuccess) {
                onSuccess(response.data);
            }
        } catch (err) {
            console.error("Error al registrar venta:", err);
            setError('Hubo un error al registrar la venta. Verifique los datos e intente nuevamente.');
        } finally {
            setLoading(false);
        }
    };

    if (!reserva || !reserva.departamento) {
        return <div className="p-4 text-center text-gray-600">Seleccione una reserva para registrar una venta</div>;
    }

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-medium mb-4">Registro de Venta</h3>

            {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Información de la reserva */}
                <div className="p-3 bg-gray-50 rounded-md">
                    <h4 className="font-medium mb-2">Reserva seleccionada:</h4>
                    <p>Departamento: {reserva.departamento?.titulo}</p>
                    <p>Cliente: {reserva.cliente?.nombres} {reserva.cliente?.apellidos}</p>
                    <p>Monto de reserva: S/ {parseFloat(reserva.monto_reserva || 0).toLocaleString('es-PE')}</p>
                    <p className="font-medium mt-1">
                        Precio total: S/ {parseFloat(reserva.departamento?.precio || 0).toLocaleString('es-PE')}
                    </p>
                </div>

                {/* Datos de la venta */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Fecha de Venta
                        </label>
                        <input
                            type="date"
                            name="fecha_venta"
                            value={venta.fecha_venta}
                            onChange={handleChange}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Método de Pago
                        </label>
                        <select
                            name="metodo_pago"
                            value={venta.metodo_pago}
                            onChange={handleChange}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                            <option value="financiamiento_bancario">Financiamiento Bancario</option>
                            <option value="financiamiento_directo">Financiamiento Directo</option>
                            <option value="contado">Pago al Contado</option>
                        </select>
                    </div>

                    {venta.metodo_pago === 'financiamiento_bancario' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Banco
                            </label>
                            <select
                                name="banco"
                                value={venta.banco}
                                onChange={handleChange}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            >
                                <option value="">Seleccione un banco</option>
                                <option value="bcp">Banco de Crédito del Perú</option>
                                <option value="interbank">Interbank</option>
                                <option value="bbva">BBVA</option>
                                <option value="scotiabank">Scotiabank</option>
                                <option value="otro">Otro</option>
                            </select>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Número de Contrato
                        </label>
                        <input
                            type="text"
                            name="numero_contrato"
                            value={venta.numero_contrato}
                            onChange={handleChange}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="Ej: CNT-2025-001"
                        />
                    </div>

                    <div className="col-span-full">
                        <div className="flex items-center">
                            <input
                                id="entrega_documentacion"
                                name="entrega_documentacion"
                                type="checkbox"
                                checked={venta.entrega_documentacion}
                                onChange={handleChange}
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            />
                            <label htmlFor="entrega_documentacion" className="ml-2 block text-sm text-gray-900">
                                Confirmo que se ha realizado la entrega de documentación física
                            </label>
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Documentos Digitalizados
                    </label>
                    <input
                        type="file"
                        multiple
                        accept="image/*,.pdf"
                        onChange={handleFileChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        Adjunte copias digitalizadas del contrato, DNI, comprobantes de pago, etc.
                    </p>

                    {venta.documentos.length > 0 && (
                        <div className="mt-3 space-y-2">
                            <p className="text-sm font-medium">Documentos adjuntos:</p>
                            <ul className="divide-y divide-gray-200 border rounded-md overflow-hidden">
                                {venta.documentos.map((doc, index) => (
                                    <li key={index} className="flex items-center justify-between p-3 bg-gray-50">
                                        <span className="text-sm">{doc.nombre}</span>
                                        <button
                                            type="button"
                                            onClick={() => removeDocument(index)}
                                            className="text-red-600 hover:text-red-800 text-sm"
                                        >
                                            Eliminar
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Observaciones
                    </label>
                    <textarea
                        name="observaciones"
                        value={venta.observaciones}
                        onChange={handleChange}
                        rows={3}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    ></textarea>
                </div>

                <div className="flex justify-end space-x-3">
                    <SecondaryButton type="button">
                        Cancelar
                    </SecondaryButton>
                    <PrimaryButton
                        type="submit"
                        disabled={loading || !venta.entrega_documentacion}
                        className="bg-green-600 hover:bg-green-700"
                    >
                        {loading ? 'Procesando...' : 'Completar Venta'}
                    </PrimaryButton>
                </div>
            </form>
        </div>
    );
};

export default RegistroVentaForm;
