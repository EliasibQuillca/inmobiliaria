import React, { useState } from 'react';
import { Head, router, Link } from '@inertiajs/react';
import AsesorLayout from '../../Layouts/AsesorLayout';

export default function Clientes({ auth, clientes = [] }) {
    const [filtro, setFiltro] = useState('todos');
    const [busqueda, setBusqueda] = useState('');

    const filtrarClientes = () => {
        let clientesFiltrados = clientes;

        // Filtrar por estado
        switch (filtro) {
            case 'activos':
                clientesFiltrados = clientesFiltrados.filter(c => c.estado === 'activo');
                break;
            case 'inactivos':
                clientesFiltrados = clientesFiltrados.filter(c => c.estado === 'inactivo');
                break;
        }

        // Filtrar por búsqueda
        if (busqueda.trim()) {
            clientesFiltrados = clientesFiltrados.filter(cliente =>
                cliente.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
                cliente.email?.toLowerCase().includes(busqueda.toLowerCase()) ||
                cliente.telefono?.includes(busqueda) ||
                cliente.ci?.includes(busqueda)
            );
        }

        return clientesFiltrados;
    };

    const verDetalle = (cliente) => {
        router.get(`/asesor/clientes/${cliente.id}`);
    };

    const crearCotizacion = (cliente) => {
        router.get(route('asesor.cotizaciones.create', { cliente_id: cliente.id }));
    };

    const getEstadoColor = (estado) => {
        switch (estado) {
            case 'activo':
                return 'bg-green-100 text-green-800';
            case 'inactivo':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <AsesorLayout user={auth.user}>
            <Head title="Clientes" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">
                                        Base de Datos de Clientes
                                    </h1>
                                    <p className="text-gray-600 mt-1">
                                        Gestiona la información de tus clientes
                                    </p>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <Link
                                        href={route('asesor.clientes.create')}
                                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                        <svg className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                        Registrar Cliente
                                    </Link>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => setFiltro('todos')}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium ${
                                                filtro === 'todos'
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                            }`}
                                        >
                                            Todos
                                        </button>
                                        <button
                                            onClick={() => setFiltro('activos')}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium ${
                                                filtro === 'activos'
                                                    ? 'bg-green-600 text-white'
                                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                            }`}
                                        >
                                            Activos
                                        </button>
                                    </div>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Buscar clientes..."
                                            value={busqueda}
                                            onChange={(e) => setBusqueda(e.target.value)}
                                            className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Lista de clientes */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filtrarClientes().map((cliente) => (
                            <div key={cliente.id} className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                {cliente.nombre}
                                            </h3>
                                            <p className="text-sm text-gray-600">
                                                {cliente.email}
                                            </p>
                                        </div>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(cliente.estado)}`}>
                                            {cliente.estado}
                                        </span>
                                    </div>

                                    <div className="space-y-2 mb-4">
                                        <p className="text-sm text-gray-600">
                                            <span className="font-medium">Teléfono:</span> {cliente.telefono}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            <span className="font-medium">CI:</span> {cliente.ci}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            <span className="font-medium">Dirección:</span> {cliente.direccion || 'No especificada'}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            <span className="font-medium">Registrado:</span> {new Date(cliente.created_at).toLocaleDateString()}
                                        </p>
                                    </div>

                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => verDetalle(cliente)}
                                            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium"
                                        >
                                            Ver Detalle
                                        </button>
                                        <button
                                            onClick={() => crearCotizacion(cliente)}
                                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium"
                                        >
                                            Cotizar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {filtrarClientes().length === 0 && (
                            <div className="col-span-full bg-white overflow-hidden shadow-sm sm:rounded-lg">
                                <div className="p-12 text-center">
                                    <p className="text-gray-500 text-lg">
                                        {busqueda ? 'No se encontraron clientes que coincidan con tu búsqueda' : 'No hay clientes registrados en este momento'}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AsesorLayout>
    );
}
