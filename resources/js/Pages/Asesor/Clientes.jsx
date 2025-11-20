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
                clientesFiltrados = clientesFiltrados.filter(c =>
                    ['contactado', 'interesado', 'cita_agendada'].includes(c.estado)
                );
                break;
            case 'inactivos':
                clientesFiltrados = clientesFiltrados.filter(c =>
                    ['sin_interes', 'perdido'].includes(c.estado)
                );
                break;
        }

        // Filtrar por búsqueda
        if (busqueda.trim()) {
            clientesFiltrados = clientesFiltrados.filter(cliente => {
                const nombre = cliente.nombre || cliente.usuario?.name || '';
                const email = cliente.email || cliente.usuario?.email || '';
                const telefono = cliente.telefono || '';
                const dni = cliente.dni || '';

                return nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                       email.toLowerCase().includes(busqueda.toLowerCase()) ||
                       telefono.includes(busqueda) ||
                       dni.includes(busqueda);
            });
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
            case 'contactado':
                return 'bg-blue-100 text-blue-800';
            case 'interesado':
                return 'bg-green-100 text-green-800';
            case 'sin_interes':
                return 'bg-gray-100 text-gray-800';
            case 'perdido':
                return 'bg-red-100 text-red-800';
            case 'cita_agendada':
                return 'bg-purple-100 text-purple-800';
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
                    <div className="mb-6">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">
                                    Mis Clientes
                                </h1>
                                <p className="text-gray-600 mt-1 text-sm">
                                    Gestiona tu cartera de clientes y sus preferencias
                                </p>
                            </div>
                            <Link
                                href="/asesor/clientes/crear"
                                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm"
                            >
                                <svg className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Registrar Cliente
                            </Link>
                        </div>

                        {/* Filtros y búsqueda */}
                        <div className="bg-white rounded-lg shadow-sm p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => setFiltro('todos')}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                            filtro === 'todos'
                                                ? 'bg-blue-600 text-white shadow-sm'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                    >
                                        Todos
                                    </button>
                                    <button
                                        onClick={() => setFiltro('activos')}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                            filtro === 'activos'
                                                ? 'bg-green-600 text-white shadow-sm'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                    >
                                        Activos
                                    </button>
                                </div>
                                <div className="relative flex-1 max-w-md ml-4">
                                    <input
                                        type="text"
                                        placeholder="Buscar clientes..."
                                        value={busqueda}
                                        onChange={(e) => setBusqueda(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

                    {/* Lista de clientes */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filtrarClientes().map((cliente) => (
                            <div key={cliente.id} className="bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 rounded-lg border border-gray-200">
                                <div className="p-6">
                                    {/* Header de la tarjeta */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center space-x-3 flex-1">
                                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                                                <span className="text-white font-bold text-lg">
                                                    {(cliente.nombre || cliente.usuario?.name || 'C')?.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-lg font-semibold text-gray-900 truncate">
                                                    {cliente.nombre || cliente.usuario?.name || 'Sin nombre'}
                                                </h3>
                                                <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(cliente.estado)}`}>
                                                    {cliente.estado === 'contactado' ? 'Contactado' :
                                                     cliente.estado === 'interesado' ? 'Interesado' :
                                                     cliente.estado === 'sin_interes' ? 'Sin Interés' :
                                                     cliente.estado === 'perdido' ? 'Perdido' :
                                                     cliente.estado === 'cita_agendada' ? 'Cita Agendada' :
                                                     cliente.estado}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Información del cliente */}
                                    <div className="space-y-2 mb-4 border-t pt-4">
                                        {cliente.telefono && (
                                            <div className="flex items-center text-sm text-gray-600">
                                                <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                </svg>
                                                <span className="font-medium">{cliente.telefono}</span>
                                            </div>
                                        )}
                                        {(cliente.email || cliente.usuario?.email) && (
                                            <div className="flex items-center text-sm text-gray-600">
                                                <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                </svg>
                                                <span className="truncate">{cliente.email || cliente.usuario?.email}</span>
                                            </div>
                                        )}
                                        {cliente.dni && (
                                            <div className="flex items-center text-sm text-gray-600">
                                                <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                                                </svg>
                                                <span>DNI: {cliente.dni}</span>
                                            </div>
                                        )}
                                        <div className="flex items-center text-xs text-gray-500 pt-2">
                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <span>Registrado: {new Date(cliente.created_at).toLocaleDateString('es-PE')}</span>
                                        </div>
                                    </div>

                                    {/* Acciones */}
                                    <div className="flex space-x-2 pt-2 border-t">
                                        <button
                                            onClick={() => verDetalle(cliente)}
                                            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                                        >
                                            Ver Detalle
                                        </button>
                                        <button
                                            onClick={() => crearCotizacion(cliente)}
                                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                                        >
                                            Cotizar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {filtrarClientes().length === 0 && (
                            <div className="col-span-full bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
                                <div className="p-12 text-center">
                                    <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                                        {busqueda ? 'No se encontraron resultados' : 'No hay clientes registrados'}
                                    </h3>
                                    <p className="text-gray-500">
                                        {busqueda ? 'Intenta con otros términos de búsqueda' : 'Comienza registrando tu primer cliente'}
                                    </p>
                                    {!busqueda && (
                                        <Link
                                            href="/asesor/clientes/crear"
                                            className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
                                        >
                                            <svg className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                            </svg>
                                            Registrar Cliente
                                        </Link>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AsesorLayout>
    );
}
