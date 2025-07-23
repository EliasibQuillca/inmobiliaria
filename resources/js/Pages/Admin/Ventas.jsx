import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';

export default function Ventas({ auth }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('todas');
    const [dateFilter, setDateFilter] = useState('mes');

    // Mock data - replace with real data from backend
    const ventas = [
        {
            id: 1,
            numeroVenta: 'V-2024-001',
            cliente: 'María González',
            asesor: 'Juan Pérez',
            propiedad: 'Departamento en Miraflores',
            precio: 350000,
            comision: 17500,
            estado: 'completada',
            fechaVenta: '2024-01-15',
            fechaEntrega: '2024-02-15'
        },
        {
            id: 2,
            numeroVenta: 'V-2024-002',
            cliente: 'Carlos Mendoza',
            asesor: 'Ana López',
            propiedad: 'Casa en San Isidro',
            precio: 450000,
            comision: 22500,
            estado: 'en_proceso',
            fechaVenta: '2024-01-20',
            fechaEntrega: '2024-03-01'
        },
        {
            id: 3,
            numeroVenta: 'V-2024-003',
            cliente: 'Luis Rodríguez',
            asesor: 'Pedro Sánchez',
            propiedad: 'Oficina en San Borja',
            precio: 280000,
            comision: 14000,
            estado: 'pendiente',
            fechaVenta: '2024-02-01',
            fechaEntrega: '2024-03-15'
        }
    ];

    const filteredVentas = ventas.filter(venta => {
        const matchesSearch = venta.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            venta.asesor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            venta.propiedad.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            venta.numeroVenta.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'todas' || venta.estado === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'completada':
                return 'bg-green-100 text-green-800';
            case 'en_proceso':
                return 'bg-yellow-100 text-yellow-800';
            case 'pendiente':
                return 'bg-blue-100 text-blue-800';
            case 'cancelada':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const totalVentas = filteredVentas.reduce((total, venta) => total + venta.precio, 0);
    const totalComisiones = filteredVentas.reduce((total, venta) => total + venta.comision, 0);

    return (
        <AdminLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Gestión de Ventas
                </h2>
            }
        >
            <Head title="Ventas - Admin" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div className="bg-white shadow-sm sm:rounded-lg p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <dt className="text-sm font-medium text-gray-500">Total Ventas</dt>
                                    <dd className="text-2xl font-semibold text-gray-900">${totalVentas.toLocaleString()}</dd>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white shadow-sm sm:rounded-lg p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <dt className="text-sm font-medium text-gray-500">Número de Ventas</dt>
                                    <dd className="text-2xl font-semibold text-gray-900">{filteredVentas.length}</dd>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white shadow-sm sm:rounded-lg p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <dt className="text-sm font-medium text-gray-500">Total Comisiones</dt>
                                    <dd className="text-2xl font-semibold text-gray-900">${totalComisiones.toLocaleString()}</dd>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {/* Header with search and actions */}
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4 sm:mb-0">
                                    Lista de Ventas
                                </h3>
                                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                                    <Link
                                        href="/admin/ventas/crear"
                                        className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                    >
                                        Nueva Venta
                                    </Link>
                                </div>
                            </div>

                            {/* Filters */}
                            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 mb-6">
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        placeholder="Buscar ventas..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="todas">Todos los estados</option>
                                    <option value="completada">Completada</option>
                                    <option value="en_proceso">En Proceso</option>
                                    <option value="pendiente">Pendiente</option>
                                    <option value="cancelada">Cancelada</option>
                                </select>
                                <select
                                    value={dateFilter}
                                    onChange={(e) => setDateFilter(e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="mes">Este mes</option>
                                    <option value="trimestre">Este trimestre</option>
                                    <option value="año">Este año</option>
                                    <option value="todos">Todos</option>
                                </select>
                            </div>

                            {/* Sales table */}
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Venta
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Cliente
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Asesor
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Precio
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Estado
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Fecha
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Acciones
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredVentas.map((venta) => (
                                            <tr key={venta.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {venta.numeroVenta}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {venta.propiedad}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {venta.cliente}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {venta.asesor}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        ${venta.precio.toLocaleString()}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        Comisión: ${venta.comision.toLocaleString()}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(venta.estado)}`}>
                                                        {venta.estado.replace('_', ' ')}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {new Date(venta.fechaVenta).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex space-x-2">
                                                        <Link
                                                            href={`/admin/ventas/${venta.id}`}
                                                            className="text-blue-600 hover:text-blue-900"
                                                        >
                                                            Ver
                                                        </Link>
                                                        <Link
                                                            href={`/admin/ventas/${venta.id}/editar`}
                                                            className="text-green-600 hover:text-green-900"
                                                        >
                                                            Editar
                                                        </Link>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                {filteredVentas.length === 0 && (
                                    <div className="text-center py-8">
                                        <p className="text-gray-500">No se encontraron ventas.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
