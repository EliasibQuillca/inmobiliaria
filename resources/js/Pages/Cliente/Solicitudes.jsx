import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import Layout from '@/components/layout/Layout';

export default function Solicitudes({ auth }) {
    // Estado para manejar las solicitudes
    const [solicitudes, setSolicitudes] = useState([
        {
            id: 1,
            departamento: 'Departamento Magisterio 101',
            tipo: 'informacion',
            mensaje: 'Me gustaría obtener más información sobre este departamento, específicamente sobre las facilidades de pago.',
            fecha: '2023-08-10',
            estado: 'pendiente',
            asesor: null,
        },
        {
            id: 2,
            departamento: 'Departamento Lima 305',
            tipo: 'visita',
            mensaje: 'Quisiera programar una visita para ver el departamento, estoy disponible los fines de semana.',
            fecha: '2023-07-28',
            estado: 'en_proceso',
            asesor: 'María Rodríguez',
        },
        {
            id: 3,
            departamento: 'Departamento Cusco 205',
            tipo: 'cotizacion',
            mensaje: 'Solicito una cotización detallada de este departamento, incluyendo las opciones de financiamiento disponibles.',
            fecha: '2023-07-15',
            estado: 'completada',
            asesor: 'Juan Pérez',
        },
    ]);

    // Estado para filtrado
    const [filtro, setFiltro] = useState({
        estado: 'todos',
        tipo: 'todos',
    });

    // Tipos de solicitud para traducción
    const tiposSolicitud = {
        'informacion': 'Información',
        'visita': 'Programar visita',
        'financiamiento': 'Financiamiento',
        'cotizacion': 'Cotización',
    };

    // Estados de solicitud para traducción
    const estadosSolicitud = {
        'pendiente': 'Pendiente',
        'en_proceso': 'En proceso',
        'completada': 'Completada',
        'cancelada': 'Cancelada',
    };

    // Colores para los estados
    const estadoColors = {
        'pendiente': 'bg-yellow-100 text-yellow-800',
        'en_proceso': 'bg-blue-100 text-blue-800',
        'completada': 'bg-green-100 text-green-800',
        'cancelada': 'bg-red-100 text-red-800',
    };

    // Función para manejar cambio de filtros
    const handleFiltroChange = (e) => {
        const { name, value } = e.target;
        setFiltro({
            ...filtro,
            [name]: value,
        });
    };

    // Filtrar las solicitudes
    const solicitudesFiltradas = solicitudes.filter(solicitud => {
        if (filtro.estado !== 'todos' && solicitud.estado !== filtro.estado) {
            return false;
        }
        if (filtro.tipo !== 'todos' && solicitud.tipo !== filtro.tipo) {
            return false;
        }
        return true;
    });

    // Formatear fecha
    const formatearFecha = (fecha) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(fecha).toLocaleDateString('es-ES', options);
    };

    return (
        <Layout auth={auth}>
            <Head title="Mis Solicitudes - Inmobiliaria" />

            <div className="py-12 bg-gray-100 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                        Mis Solicitudes
                                    </h2>
                                    <p className="text-gray-600">
                                        Administra y realiza seguimiento a tus solicitudes de información o visitas.
                                    </p>
                                </div>
                                <Link
                                    href="/cliente/solicitudes/crear"
                                    className="mt-4 md:mt-0 px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                    </svg>
                                    Nueva Solicitud
                                </Link>
                            </div>

                            {/* Filtros */}
                            <div className="bg-gray-50 p-4 rounded-md mb-6">
                                <div className="flex flex-col md:flex-row md:space-x-4">
                                    <div className="w-full md:w-1/3 mb-4 md:mb-0">
                                        <label htmlFor="estado" className="block text-sm font-medium text-gray-700 mb-1">
                                            Filtrar por estado
                                        </label>
                                        <select
                                            id="estado"
                                            name="estado"
                                            value={filtro.estado}
                                            onChange={handleFiltroChange}
                                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                        >
                                            <option value="todos">Todos los estados</option>
                                            <option value="pendiente">Pendiente</option>
                                            <option value="en_proceso">En proceso</option>
                                            <option value="completada">Completada</option>
                                            <option value="cancelada">Cancelada</option>
                                        </select>
                                    </div>
                                    <div className="w-full md:w-1/3">
                                        <label htmlFor="tipo" className="block text-sm font-medium text-gray-700 mb-1">
                                            Filtrar por tipo
                                        </label>
                                        <select
                                            id="tipo"
                                            name="tipo"
                                            value={filtro.tipo}
                                            onChange={handleFiltroChange}
                                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                        >
                                            <option value="todos">Todos los tipos</option>
                                            <option value="informacion">Información</option>
                                            <option value="visita">Programar visita</option>
                                            <option value="financiamiento">Financiamiento</option>
                                            <option value="cotizacion">Cotización</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Lista de solicitudes */}
                            {solicitudesFiltradas.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Departamento
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Tipo
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Fecha
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Estado
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Asesor
                                                </th>
                                                <th scope="col" className="relative px-6 py-3">
                                                    <span className="sr-only">Acciones</span>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {solicitudesFiltradas.map((solicitud) => (
                                                <tr key={solicitud.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        {solicitud.departamento}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {tiposSolicitud[solicitud.tipo]}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {formatearFecha(solicitud.fecha)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${estadoColors[solicitud.estado]}`}>
                                                            {estadosSolicitud[solicitud.estado]}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {solicitud.asesor || 'Sin asignar'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <Link
                                                            href={`/cliente/solicitudes/${solicitud.id}`}
                                                            className="text-blue-600 hover:text-blue-900 mr-4"
                                                        >
                                                            Ver detalles
                                                        </Link>
                                                        {solicitud.estado !== 'completada' && solicitud.estado !== 'cancelada' && (
                                                            <button
                                                                className="text-red-600 hover:text-red-900"
                                                                onClick={() => {
                                                                    if (confirm("¿Estás seguro de que deseas cancelar esta solicitud?")) {
                                                                        // Aquí iría la lógica para cancelar
                                                                        console.log('Cancelar solicitud:', solicitud.id);
                                                                    }
                                                                }}
                                                            >
                                                                Cancelar
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="bg-gray-50 p-6 text-center rounded-lg">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <h3 className="mt-2 text-sm font-medium text-gray-900">No hay solicitudes</h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        No se encontraron solicitudes con los filtros seleccionados.
                                    </p>
                                    <div className="mt-6">
                                        <Link
                                            href="/cliente/solicitudes/crear"
                                            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                            </svg>
                                            Crear nueva solicitud
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
