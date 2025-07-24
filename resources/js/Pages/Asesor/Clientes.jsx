import React, { useState } from 'react';
import { Head, router, Link } from '@inertiajs/react';
import AsesorLayout from '../../Layouts/AsesorLayout';

export default function Clientes({ auth, clientes = [] }) {
    const [filtro, setFiltro] = useState('todos');
    const [busqueda, setBusqueda] = useState('');
    const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
    const [mostrarModal, setMostrarModal] = useState(false);

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
        setClienteSeleccionado(cliente);
        setMostrarModal(true);
    };

    const crearCotizacion = (cliente) => {
        router.get(`/asesor/cotizaciones/crear?cliente_id=${cliente.id}`);
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

            {/* Modal de detalle */}
            {mostrarModal && clienteSeleccionado && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
                        <div className="mt-3">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-medium text-gray-900">
                                    Información del Cliente
                                </h3>
                                <button
                                    onClick={() => setMostrarModal(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="font-medium text-gray-900 mb-3">Datos Personales</h4>
                                    <div className="space-y-2">
                                        <p className="text-sm">
                                            <span className="font-medium">Nombre:</span> {clienteSeleccionado.nombre}
                                        </p>
                                        <p className="text-sm">
                                            <span className="font-medium">CI:</span> {clienteSeleccionado.ci}
                                        </p>
                                        <p className="text-sm">
                                            <span className="font-medium">Email:</span> {clienteSeleccionado.email}
                                        </p>
                                        <p className="text-sm">
                                            <span className="font-medium">Teléfono:</span> {clienteSeleccionado.telefono}
                                        </p>
                                        <p className="text-sm">
                                            <span className="font-medium">Dirección:</span> {clienteSeleccionado.direccion || 'No especificada'}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="font-medium text-gray-900 mb-3">Información Adicional</h4>
                                    <div className="space-y-2">
                                        <p className="text-sm">
                                            <span className="font-medium">Estado:</span>
                                            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(clienteSeleccionado.estado)}`}>
                                                {clienteSeleccionado.estado}
                                            </span>
                                        </p>
                                        <p className="text-sm">
                                            <span className="font-medium">Fecha de Registro:</span> {new Date(clienteSeleccionado.created_at).toLocaleDateString()}
                                        </p>
                                        <p className="text-sm">
                                            <span className="font-medium">Última Actualización:</span> {new Date(clienteSeleccionado.updated_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {clienteSeleccionado.observaciones && (
                                <div className="mt-6">
                                    <h4 className="font-medium text-gray-900 mb-2">Observaciones</h4>
                                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                                        {clienteSeleccionado.observaciones}
                                    </p>
                                </div>
                            )}

                            <div className="flex justify-end space-x-3 mt-6">
                                <button
                                    onClick={() => setMostrarModal(false)}
                                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                                >
                                    Cerrar
                                </button>
                                <button
                                    onClick={() => {
                                        setMostrarModal(false);
                                        crearCotizacion(clienteSeleccionado);
                                    }}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Crear Cotización
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AsesorLayout>
    );
}

