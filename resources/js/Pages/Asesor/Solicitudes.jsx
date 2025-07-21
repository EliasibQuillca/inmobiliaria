import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import Layout from '@/Components/Layout/Layout';

export default function AsesorSolicitudes({ auth }) {
    // Estado para el filtro
    const [filtro, setFiltro] = useState('todas');

    // Datos simulados de solicitudes
    const [solicitudes, setSolicitudes] = useState([
        {
            id: 1,
            cliente: 'María López',
            email: 'maria@example.com',
            telefono: '987654321',
            fecha: '2025-07-15',
            mensaje: 'Interesada en departamento de 3 dormitorios en zona céntrica',
            estado: 'pendiente',
            preferencias: 'Zona céntrica, 3 dormitorios, terraza'
        },
        {
            id: 2,
            cliente: 'Carlos Mendoza',
            email: 'carlos@example.com',
            telefono: '987123456',
            fecha: '2025-07-18',
            mensaje: 'Quisiera información sobre departamentos con vista a la plaza',
            estado: 'pendiente',
            preferencias: 'Vista a la plaza, 2+ dormitorios'
        },
        {
            id: 3,
            cliente: 'Julia Paredes',
            email: 'julia@example.com',
            telefono: '999888777',
            fecha: '2025-07-19',
            mensaje: 'Solicito cotización para departamento familiar en San Sebastián',
            estado: 'en_proceso',
            preferencias: 'San Sebastián, familiar, 3+ dormitorios'
        },
        {
            id: 4,
            cliente: 'Roberto Guzmán',
            email: 'roberto@example.com',
            telefono: '965432198',
            fecha: '2025-07-12',
            mensaje: 'Me interesa un departamento cerca de la universidad',
            estado: 'contactado',
            preferencias: 'Cerca de universidad, 1-2 dormitorios, para estudiante'
        },
        {
            id: 5,
            cliente: 'Ana Ballón',
            email: 'ana@example.com',
            telefono: '943215678',
            fecha: '2025-07-10',
            mensaje: 'Busco departamento con estacionamiento en Wanchaq',
            estado: 'cotizado',
            preferencias: 'Wanchaq, estacionamiento incluido, 2 dormitorios'
        }
    ]);

    // Filtrar solicitudes según el estado seleccionado
    const solicitudesFiltradas = filtro === 'todas'
        ? solicitudes
        : solicitudes.filter(s => s.estado === filtro);

    // Función para cambiar el estado de una solicitud
    const cambiarEstado = (id, nuevoEstado) => {
        setSolicitudes(solicitudes.map(sol =>
            sol.id === id ? { ...sol, estado: nuevoEstado } : sol
        ));
    };

    return (
        <Layout auth={auth}>
            <Head title="Gestión de Solicitudes - Asesor" />

            <div className="py-12 bg-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Solicitudes de Contacto</h2>
                            <p className="mt-1 text-sm text-gray-600">
                                Gestione las solicitudes recibidas de clientes potenciales
                            </p>
                        </div>
                        <Link
                            href="/asesor/dashboard"
                            className="inline-flex items-center px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm font-medium rounded-md"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Volver al Dashboard
                        </Link>
                    </div>

                    {/* Filtros */}
                    <div className="bg-white shadow rounded-lg p-4 mb-6">
                        <div className="flex flex-wrap items-center gap-4">
                            <div className="font-medium text-gray-700">Filtrar por estado:</div>
                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={() => setFiltro('todas')}
                                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                                        filtro === 'todas'
                                            ? 'bg-indigo-600 text-white'
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                                >
                                    Todas
                                </button>
                                <button
                                    onClick={() => setFiltro('pendiente')}
                                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                                        filtro === 'pendiente'
                                            ? 'bg-yellow-500 text-white'
                                            : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                                    }`}
                                >
                                    Pendientes
                                </button>
                                <button
                                    onClick={() => setFiltro('en_proceso')}
                                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                                        filtro === 'en_proceso'
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                    }`}
                                >
                                    En Proceso
                                </button>
                                <button
                                    onClick={() => setFiltro('contactado')}
                                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                                        filtro === 'contactado'
                                            ? 'bg-green-500 text-white'
                                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                                    }`}
                                >
                                    Contactados
                                </button>
                                <button
                                    onClick={() => setFiltro('cotizado')}
                                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                                        filtro === 'cotizado'
                                            ? 'bg-purple-500 text-white'
                                            : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                                    }`}
                                >
                                    Cotizados
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Tabla de Solicitudes */}
                    <div className="bg-white overflow-hidden shadow-md rounded-lg">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Cliente
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Contacto
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Fecha
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Mensaje
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Estado
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Acciones
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {solicitudesFiltradas.map((solicitud) => (
                                        <tr key={solicitud.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{solicitud.cliente}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{solicitud.email}</div>
                                                <div className="text-sm text-gray-500">{solicitud.telefono}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{solicitud.fecha}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-900 max-w-xs truncate">{solicitud.mensaje}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                    solicitud.estado === 'pendiente'
                                                        ? 'bg-yellow-100 text-yellow-800'
                                                        : solicitud.estado === 'en_proceso'
                                                        ? 'bg-blue-100 text-blue-800'
                                                        : solicitud.estado === 'contactado'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-purple-100 text-purple-800'
                                                }`}>
                                                    {solicitud.estado === 'pendiente'
                                                        ? 'Pendiente'
                                                        : solicitud.estado === 'en_proceso'
                                                        ? 'En Proceso'
                                                        : solicitud.estado === 'contactado'
                                                        ? 'Contactado'
                                                        : 'Cotizado'
                                                    }
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex justify-end space-x-3">
                                                    <button
                                                        onClick={() => cambiarEstado(solicitud.id, 'contactado')}
                                                        className="text-indigo-600 hover:text-indigo-900"
                                                    >
                                                        <span className="sr-only">Marcar como contactado</span>
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                                        </svg>
                                                    </button>
                                                    <Link
                                                        href={`/asesor/cotizaciones/crear/${solicitud.id}`}
                                                        className="text-green-600 hover:text-green-900"
                                                    >
                                                        <span className="sr-only">Generar cotización</span>
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                                                        </svg>
                                                    </Link>
                                                    <Link
                                                        href={`/asesor/solicitudes/${solicitud.id}`}
                                                        className="text-blue-600 hover:text-blue-900"
                                                    >
                                                        <span className="sr-only">Ver detalles</span>
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                                        </svg>
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {solicitudesFiltradas.length === 0 && (
                                <div className="px-6 py-4 text-center text-gray-500">
                                    No hay solicitudes que coincidan con el filtro seleccionado
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Paginación simulada */}
                    <div className="mt-6 flex justify-between items-center">
                        <div className="text-sm text-gray-700">
                            Mostrando <span className="font-medium">5</span> de <span className="font-medium">12</span> solicitudes
                        </div>
                        <div className="flex justify-center">
                            <nav className="inline-flex rounded-md shadow">
                                <button className="py-2 px-4 rounded-l-md bg-white text-gray-500 border border-gray-300">
                                    Anterior
                                </button>
                                <button className="py-2 px-4 bg-indigo-600 text-white border-t border-b border-indigo-600">
                                    1
                                </button>
                                <button className="py-2 px-4 bg-white text-gray-700 border-t border-b border-gray-300">
                                    2
                                </button>
                                <button className="py-2 px-4 bg-white text-gray-700 border-t border-b border-gray-300">
                                    3
                                </button>
                                <button className="py-2 px-4 rounded-r-md bg-white text-gray-700 border border-gray-300">
                                    Siguiente
                                </button>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
