import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';

export default function Propiedades({ auth }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('todos');

    // Mock data - replace with real data from backend
    const propiedades = [
        {
            id: 1,
            titulo: 'Departamento en Miraflores',
            tipo: 'Departamento',
            direccion: 'Av. Pardo 123, Miraflores',
            precio: 350000,
            area: 85,
            habitaciones: 2,
            baños: 2,
            estado: 'disponible',
            fechaCreacion: '2024-01-15'
        },
        {
            id: 2,
            titulo: 'Casa en San Isidro',
            tipo: 'Casa',
            direccion: 'Calle Los Pinos 456, San Isidro',
            precio: 450000,
            area: 120,
            habitaciones: 3,
            baños: 2,
            estado: 'vendido',
            fechaCreacion: '2024-01-20'
        },
        {
            id: 3,
            titulo: 'Oficina en San Borja',
            tipo: 'Oficina',
            direccion: 'Av. Javier Prado 789, San Borja',
            precio: 280000,
            area: 65,
            habitaciones: 0,
            baños: 1,
            estado: 'reservado',
            fechaCreacion: '2024-02-01'
        }
    ];

    const filteredPropiedades = propiedades.filter(propiedad => {
        const matchesSearch = propiedad.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            propiedad.direccion.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'todos' || propiedad.estado === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'disponible':
                return 'bg-green-100 text-green-800';
            case 'reservado':
                return 'bg-yellow-100 text-yellow-800';
            case 'vendido':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <AdminLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Gestión de Propiedades
                </h2>
            }
        >
            <Head title="Propiedades - Admin" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {/* Header with search and actions */}
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4 sm:mb-0">
                                    Lista de Propiedades
                                </h3>
                                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                                    <Link
                                        href="/admin/propiedades/crear"
                                        className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                    >
                                        Nueva Propiedad
                                    </Link>
                                </div>
                            </div>

                            {/* Filters */}
                            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 mb-6">
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        placeholder="Buscar propiedades..."
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
                                    <option value="todos">Todos los estados</option>
                                    <option value="disponible">Disponible</option>
                                    <option value="reservado">Reservado</option>
                                    <option value="vendido">Vendido</option>
                                </select>
                            </div>

                            {/* Properties table */}
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Propiedad
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Tipo
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Precio
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Área
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Estado
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Acciones
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredPropiedades.map((propiedad) => (
                                            <tr key={propiedad.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {propiedad.titulo}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {propiedad.direccion}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {propiedad.tipo}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    ${propiedad.precio.toLocaleString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {propiedad.area} m²
                                                    {propiedad.habitaciones > 0 && (
                                                        <div className="text-xs text-gray-500">
                                                            {propiedad.habitaciones} hab, {propiedad.baños} baños
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(propiedad.estado)}`}>
                                                        {propiedad.estado}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex space-x-2">
                                                        <Link
                                                            href={`/admin/propiedades/${propiedad.id}`}
                                                            className="text-blue-600 hover:text-blue-900"
                                                        >
                                                            Ver
                                                        </Link>
                                                        <Link
                                                            href={`/admin/propiedades/${propiedad.id}/editar`}
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

                                {filteredPropiedades.length === 0 && (
                                    <div className="text-center py-8">
                                        <p className="text-gray-500">No se encontraron propiedades.</p>
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
