import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import Layout from '@/components/layout/Layout';

export default function AsesorCotizaciones({ auth }) {
    // Estado para el filtro
    const [filtro, setFiltro] = useState('todas');

    // Datos simulados de cotizaciones
    const [cotizaciones, setCotizaciones] = useState([
        {
            id: 1,
            cliente: 'María López',
            propiedad: 'Departamento Lima 305',
            precioLista: 120000,
            descuento: 5000,
            precioFinal: 115000,
            fecha: '2025-07-15',
            estado: 'emitida',
            validaHasta: '2025-08-15'
        },
        {
            id: 2,
            cliente: 'Carlos Mendoza',
            propiedad: 'Departamento San Sebastián 201',
            precioLista: 85000,
            descuento: 0,
            precioFinal: 85000,
            fecha: '2025-07-18',
            estado: 'enviada',
            validaHasta: '2025-08-18'
        },
        {
            id: 3,
            cliente: 'Julia Paredes',
            propiedad: 'Departamento Magisterio 405',
            precioLista: 155000,
            descuento: 10000,
            precioFinal: 145000,
            fecha: '2025-07-19',
            estado: 'aceptada',
            validaHasta: '2025-08-19'
        },
        {
            id: 4,
            cliente: 'Roberto Guzmán',
            propiedad: 'Departamento Universidad 102',
            precioLista: 65000,
            descuento: 3000,
            precioFinal: 62000,
            fecha: '2025-07-12',
            estado: 'rechazada',
            validaHasta: '2025-08-12'
        },
        {
            id: 5,
            cliente: 'Ana Ballón',
            propiedad: 'Departamento Wanchaq 501',
            precioLista: 110000,
            descuento: 5000,
            precioFinal: 105000,
            fecha: '2025-07-10',
            estado: 'vencida',
            validaHasta: '2025-08-10'
        }
    ]);

    // Filtrar cotizaciones según el estado seleccionado
    const cotizacionesFiltradas = filtro === 'todas'
        ? cotizaciones
        : cotizaciones.filter(c => c.estado === filtro);

    // Función para formatear moneda
    const formatMoney = (amount) => {
        return new Intl.NumberFormat('es-PE', {
            style: 'currency',
            currency: 'PEN',
            minimumFractionDigits: 0
        }).format(amount);
    };

    return (
        <Layout auth={auth}>
            <Head title="Gestión de Cotizaciones - Asesor" />

            <div className="py-12 bg-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Cotizaciones</h2>
                            <p className="mt-1 text-sm text-gray-600">
                                Administre las cotizaciones enviadas a clientes
                            </p>
                        </div>
                        <div className="flex space-x-4">
                            <Link
                                href="/asesor/cotizaciones/crear"
                                className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:border-indigo-900 focus:ring ring-indigo-300"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                                </svg>
                                Nueva Cotización
                            </Link>
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
                                    onClick={() => setFiltro('emitida')}
                                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                                        filtro === 'emitida'
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                    }`}
                                >
                                    Emitidas
                                </button>
                                <button
                                    onClick={() => setFiltro('enviada')}
                                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                                        filtro === 'enviada'
                                            ? 'bg-indigo-500 text-white'
                                            : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                                    }`}
                                >
                                    Enviadas
                                </button>
                                <button
                                    onClick={() => setFiltro('aceptada')}
                                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                                        filtro === 'aceptada'
                                            ? 'bg-green-500 text-white'
                                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                                    }`}
                                >
                                    Aceptadas
                                </button>
                                <button
                                    onClick={() => setFiltro('rechazada')}
                                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                                        filtro === 'rechazada'
                                            ? 'bg-red-500 text-white'
                                            : 'bg-red-100 text-red-700 hover:bg-red-200'
                                    }`}
                                >
                                    Rechazadas
                                </button>
                                <button
                                    onClick={() => setFiltro('vencida')}
                                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                                        filtro === 'vencida'
                                            ? 'bg-gray-500 text-white'
                                            : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                                    }`}
                                >
                                    Vencidas
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Tabla de Cotizaciones */}
                    <div className="bg-white overflow-hidden shadow-md rounded-lg">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Cliente
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Propiedad
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Precio
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Fecha
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
                                    {cotizacionesFiltradas.map((cotizacion) => (
                                        <tr key={cotizacion.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{cotizacion.cliente}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{cotizacion.propiedad}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900 font-medium">{formatMoney(cotizacion.precioFinal)}</div>
                                                {cotizacion.descuento > 0 && (
                                                    <div className="text-xs text-green-600">
                                                        Descuento: {formatMoney(cotizacion.descuento)}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{cotizacion.fecha}</div>
                                                <div className="text-xs text-gray-500">
                                                    Válida hasta: {cotizacion.validaHasta}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                    cotizacion.estado === 'emitida'
                                                        ? 'bg-blue-100 text-blue-800'
                                                        : cotizacion.estado === 'enviada'
                                                        ? 'bg-indigo-100 text-indigo-800'
                                                        : cotizacion.estado === 'aceptada'
                                                        ? 'bg-green-100 text-green-800'
                                                        : cotizacion.estado === 'rechazada'
                                                        ? 'bg-red-100 text-red-800'
                                                        : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                    {cotizacion.estado === 'emitida'
                                                        ? 'Emitida'
                                                        : cotizacion.estado === 'enviada'
                                                        ? 'Enviada'
                                                        : cotizacion.estado === 'aceptada'
                                                        ? 'Aceptada'
                                                        : cotizacion.estado === 'rechazada'
                                                        ? 'Rechazada'
                                                        : 'Vencida'
                                                    }
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex justify-end space-x-3">
                                                    <Link
                                                        href={`/asesor/cotizaciones/${cotizacion.id}`}
                                                        className="text-indigo-600 hover:text-indigo-900"
                                                    >
                                                        <span className="sr-only">Ver cotización</span>
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                                        </svg>
                                                    </Link>
                                                    {cotizacion.estado === 'emitida' && (
                                                        <button
                                                            className="text-green-600 hover:text-green-900"
                                                        >
                                                            <span className="sr-only">Enviar cotización</span>
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                                                            </svg>
                                                        </button>
                                                    )}
                                                    {cotizacion.estado === 'aceptada' && (
                                                        <Link
                                                            href={`/asesor/reservas/crear/${cotizacion.id}`}
                                                            className="text-green-600 hover:text-green-900"
                                                        >
                                                            <span className="sr-only">Crear reserva</span>
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                                            </svg>
                                                        </Link>
                                                    )}
                                                    <Link
                                                        href={`/asesor/cotizaciones/editar/${cotizacion.id}`}
                                                        className="text-yellow-600 hover:text-yellow-900"
                                                    >
                                                        <span className="sr-only">Editar cotización</span>
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                            <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                                                            <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                                                        </svg>
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {cotizacionesFiltradas.length === 0 && (
                                <div className="px-6 py-4 text-center text-gray-500">
                                    No hay cotizaciones que coincidan con el filtro seleccionado
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Paginación simulada */}
                    <div className="mt-6 flex justify-between items-center">
                        <div className="text-sm text-gray-700">
                            Mostrando <span className="font-medium">5</span> de <span className="font-medium">10</span> cotizaciones
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
