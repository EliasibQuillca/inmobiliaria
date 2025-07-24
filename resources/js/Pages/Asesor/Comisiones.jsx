import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AsesorLayout from '../../Layouts/AsesorLayout';

export default function Comisiones({ auth }) {
    const [filtro, setFiltro] = useState('todos');
    const [periodo, setPeriodo] = useState('mes_actual');

    // Datos de ejemplo de comisiones
    const comisiones = [
        {
            id: 1,
            cliente: 'María González',
            departamento: 'Departamento A1 - Wanchaq',
            fecha_venta: '2025-01-15',
            precio_venta: 280000,
            porcentaje_comision: 3,
            monto_comision: 8400,
            estado: 'pagada',
            fecha_pago: '2025-01-25'
        },
        {
            id: 2,
            cliente: 'Carlos Mendoza',
            departamento: 'Departamento B2 - San Blas',
            fecha_venta: '2025-01-20',
            precio_venta: 320000,
            porcentaje_comision: 3,
            monto_comision: 9600,
            estado: 'pendiente',
            fecha_pago: null
        },
        {
            id: 3,
            cliente: 'Ana Rodríguez',
            departamento: 'Departamento C3 - Centro Histórico',
            fecha_venta: '2025-01-10',
            precio_venta: 350000,
            porcentaje_comision: 3.5,
            monto_comision: 12250,
            estado: 'pagada',
            fecha_pago: '2025-01-20'
        }
    ];

    const filtrarComisiones = () => {
        let comisionesFiltradas = comisiones;

        // Filtrar por estado
        switch (filtro) {
            case 'pagadas':
                comisionesFiltradas = comisionesFiltradas.filter(c => c.estado === 'pagada');
                break;
            case 'pendientes':
                comisionesFiltradas = comisionesFiltradas.filter(c => c.estado === 'pendiente');
                break;
        }

        return comisionesFiltradas;
    };

    const getEstadoColor = (estado) => {
        switch (estado) {
            case 'pagada':
                return 'bg-green-100 text-green-800';
            case 'pendiente':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const calcularTotales = () => {
        const comisionesFiltradas = filtrarComisiones();
        const total = comisionesFiltradas.reduce((sum, c) => sum + c.monto_comision, 0);
        const pagadas = comisionesFiltradas.filter(c => c.estado === 'pagada').reduce((sum, c) => sum + c.monto_comision, 0);
        const pendientes = comisionesFiltradas.filter(c => c.estado === 'pendiente').reduce((sum, c) => sum + c.monto_comision, 0);

        return { total, pagadas, pendientes };
    };

    const totales = calcularTotales();

    return (
        <AsesorLayout user={auth.user}>
            <Head title="Comisiones" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">
                                        Mis Comisiones
                                    </h1>
                                    <p className="text-gray-600 mt-1">
                                        Seguimiento de comisiones por ventas realizadas
                                    </p>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <select
                                        value={periodo}
                                        onChange={(e) => setPeriodo(e.target.value)}
                                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="mes_actual">Este mes</option>
                                        <option value="mes_anterior">Mes anterior</option>
                                        <option value="trimestre">Último trimestre</option>
                                        <option value="año">Este año</option>
                                    </select>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => setFiltro('todos')}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium ${
                                                filtro === 'todos'
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                            }`}
                                        >
                                            Todas
                                        </button>
                                        <button
                                            onClick={() => setFiltro('pagadas')}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium ${
                                                filtro === 'pagadas'
                                                    ? 'bg-green-600 text-white'
                                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                            }`}
                                        >
                                            Pagadas
                                        </button>
                                        <button
                                            onClick={() => setFiltro('pendientes')}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium ${
                                                filtro === 'pendientes'
                                                    ? 'bg-yellow-600 text-white'
                                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                            }`}
                                        >
                                            Pendientes
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Resumen de totales */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3-.895-3-2s1.343-2 3-2 3 .895 3 2-1.343 2-3 2z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14c-1.657 0-3-.895-3-2s1.343-2 3-2 3 .895 3 2-1.343 2-3 2z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 20c-1.657 0-3-.895-3-2s1.343-2 3-2 3 .895 3 2-1.343 2-3 2z" />
                                        </svg>
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600">Total Comisiones</p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            S/ {totales.total.toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="p-2 bg-green-100 rounded-lg">
                                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600">Comisiones Pagadas</p>
                                        <p className="text-2xl font-bold text-green-600">
                                            S/ {totales.pagadas.toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="p-2 bg-yellow-100 rounded-lg">
                                        <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600">Pendientes de Pago</p>
                                        <p className="text-2xl font-bold text-yellow-600">
                                            S/ {totales.pendientes.toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Lista de comisiones */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                Detalle de Comisiones
                            </h3>

                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Cliente / Propiedad
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Fecha de Venta
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Precio de Venta
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                % Comisión
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Monto Comisión
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Estado
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Fecha de Pago
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filtrarComisiones().map((comision) => (
                                            <tr key={comision.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {comision.cliente}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {comision.departamento}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {new Date(comision.fecha_venta).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    S/ {comision.precio_venta.toLocaleString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {comision.porcentaje_comision}%
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-600">
                                                    S/ {comision.monto_comision.toLocaleString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(comision.estado)}`}>
                                                        {comision.estado === 'pagada' ? 'Pagada' : 'Pendiente'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {comision.fecha_pago
                                                        ? new Date(comision.fecha_pago).toLocaleDateString()
                                                        : '-'
                                                    }
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {filtrarComisiones().length === 0 && (
                                <div className="text-center py-12">
                                    <p className="text-gray-500 text-lg">
                                        No hay comisiones para mostrar con los filtros seleccionados
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AsesorLayout>
    );
}
