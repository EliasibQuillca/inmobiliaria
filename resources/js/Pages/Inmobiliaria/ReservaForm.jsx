import React, { useState, useEffect } from 'react';
import { reservaService } from '../../services/api';
import { ESTADO_RESERVA } from '../../constants';
import PrimaryButton from '../PrimaryButton';
import SecondaryButton from '../SecondaryButton';
import { useAuth } from '../../contexts/AuthContext';

const ReservaForm = ({ cotizacion, onSuccess }) => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [reserva, setReserva] = useState({
        cotizacion_id: cotizacion?.id || '',
        departamento_id: cotizacion?.departamento_id || '',
        cliente_id: cotizacion?.cliente_id || '',
        asesor_id: user?.asesor?.id || '',
        fecha_reserva: new Date().toISOString().split('T')[0],
        fecha_expiracion: (() => {
            const fecha = new Date();
            fecha.setDate(fecha.getDate() + 7); // Expiración por defecto: 7 días
            return fecha.toISOString().split('T')[0];
        })(),
        monto_reserva: cotizacion?.departamento?.precio * 0.05 || 0, // 5% por defecto
        metodo_pago: 'transferencia',
        comprobante_url: '',
        observaciones: '',
    });

    useEffect(() => {
        // Actualizar cuando cambie la cotización
        if (cotizacion) {
            setReserva(prev => ({
                ...prev,
                cotizacion_id: cotizacion.id,
                departamento_id: cotizacion.departamento_id,
                cliente_id: cotizacion.cliente_id,
                monto_reserva: cotizacion.departamento?.precio * 0.05 || 0,
            }));
        }
    }, [cotizacion]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setReserva(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // En un caso real, aquí se cargaría el archivo a un servidor
            // Por ahora, solo simularemos la URL del comprobante
            const fakeUrl = URL.createObjectURL(file);
            setReserva(prev => ({
                ...prev,
                comprobante_url: fakeUrl
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!reserva.cotizacion_id || !reserva.departamento_id || !reserva.cliente_id) {
            setError('Debe tener una cotización válida para generar una reserva');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Aquí se podría implementar la lógica para subir el comprobante si existe
            const response = await reservaService.crear(reserva);
            if (onSuccess) {
                onSuccess(response.data);
            }
        } catch (err) {
            console.error("Error al crear reserva:", err);
            setError('Hubo un error al crear la reserva. Verifique los datos e intente nuevamente.');
        } finally {
            setLoading(false);
        }
    };

    if (!cotizacion || !cotizacion.departamento) {
        return <div className="p-4 text-center text-gray-600">Seleccione una cotización para generar una reserva</div>;
    }

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-medium mb-4">Generar Reserva</h3>

            {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Información de la cotización */}
                <div className="p-3 bg-gray-50 rounded-md">
                    <h4 className="font-medium mb-2">Cotización seleccionada:</h4>
                    <p>Departamento: {cotizacion.departamento?.titulo}</p>
                    <p>Cliente: {cotizacion.cliente?.nombres} {cotizacion.cliente?.apellidos}</p>
                    <p className="font-medium mt-1">
                        Precio total: S/ {parseFloat(cotizacion.departamento?.precio || 0).toLocaleString('es-PE')}
                    </p>
                </div>

                {/* Datos de la reserva */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Fecha de Reserva
                        </label>
                        <input
                            type="date"
                            name="fecha_reserva"
                            value={reserva.fecha_reserva}
                            onChange={handleChange}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            readOnly
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Fecha de Expiración
                        </label>
                        <input
                            type="date"
                            name="fecha_expiracion"
                            value={reserva.fecha_expiracion}
                            onChange={handleChange}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Monto de Reserva (S/)
                        </label>
                        <input
                            type="number"
                            name="monto_reserva"
                            value={reserva.monto_reserva}
                            onChange={handleChange}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            min={0}
                            max={cotizacion.departamento?.precio}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Se recomienda un 5% del valor total del departamento
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Método de Pago
                        </label>
                        <select
                            name="metodo_pago"
                            value={reserva.metodo_pago}
                            onChange={handleChange}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                            <option value="transferencia">Transferencia Bancaria</option>
                            <option value="efectivo">Efectivo</option>
                            <option value="tarjeta">Tarjeta de Crédito/Débito</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Comprobante de Pago
                    </label>
                    <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={handleFileChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    {reserva.comprobante_url && (
                        <div className="mt-2 p-2 border rounded-md flex items-center">
                            <span className="text-sm text-green-600">✓ Comprobante cargado</span>
                        </div>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Observaciones
                    </label>
                    <textarea
                        name="observaciones"
                        value={reserva.observaciones}
                        onChange={handleChange}
                        rows={3}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    ></textarea>
                </div>

                <div className="flex justify-end space-x-3">
                    <SecondaryButton type="button">
                        Cancelar
                    </SecondaryButton>
                    <PrimaryButton type="submit" disabled={loading}>
                        {loading ? 'Procesando...' : 'Generar Reserva'}
                    </PrimaryButton>
                </div>
            </form>
        </div>
    );
};

export default ReservaForm;
