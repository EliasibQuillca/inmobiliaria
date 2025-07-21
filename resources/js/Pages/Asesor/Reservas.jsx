import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import Layout from '@/Components/Layout/Layout';

export default function AsesorReservas({ auth }) {
    // Estado para el filtro
    const [filtro, setFiltro] = useState('todas');

    // Datos simulados de reservas
    const [reservas, setReservas] = useState([
        {
            id: 1,
            cliente: 'María López',
            propiedad: 'Departamento Lima 305',
            montoReserva: 5000,
            fechaCreacion: '2025-07-15',
            fechaVencimiento: '2025-08-15',
            estado: 'vigente',
            cotizacionId: 3
        },
        {
            id: 2,
            cliente: 'Carlos Mendoza',
            propiedad: 'Departamento San Sebastián 201',
            montoReserva: 3500,
            fechaCreacion: '2025-07-10',
            fechaVencimiento: '2025-08-10',
            estado: 'confirmada',
            cotizacionId: 7
        },
        {
            id: 3,
            cliente: 'Julia Paredes',
            propiedad: 'Departamento Magisterio 405',
            montoReserva: 7500,
            fechaCreacion: '2025-06-25',
            fechaVencimiento: '2025-07-25',
            estado: 'vencida',
            cotizacionId: 12
        },
        {
            id: 4,
            cliente: 'Roberto Guzmán',
            propiedad: 'Departamento Universidad 102',
            montoReserva: 2500,
            fechaCreacion: '2025-07-05',
            fechaVencimiento: '2025-08-05',
            estado: 'cancelada',
            cotizacionId: 15
        },
        {
            id: 5,
            cliente: 'Ana Ballón',
            propiedad: 'Departamento Wanchaq 501',
            montoReserva: 5000,
            fechaCreacion: '2025-07-20',
            fechaVencimiento: '2025-08-20',
            estado: 'vigente',
            cotizacionId: 18
        }
    ]);

    // Filtrar reservas según el estado seleccionado
    const reservasFiltradas = filtro === 'todas'
        ? reservas
        : reservas.filter(r => r.estado === filtro);

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
            <Head title="Gestión de Reservas - Asesor" />

            <div className="py-12 bg-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Reservas</h2>
                            <p className="mt-1 text-sm text-gray-600">
                                Gestione las reservas de propiedades realizadas por los clientes
                            </p>
                        </div>
                        <div className="flex space-x-4">
                            <Link
                                href="/asesor/reservas/crear"
                                className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:border-indigo-900 focus:ring ring-indigo-300"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                                </svg>
                                Nueva Reserva
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
                                    onClick={() => setFiltro('vigente')}
                                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                                        filtro === 'vigente'
                                            ? 'bg-yellow-500 text-white'
                                            : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                                    }`}
                                >
                                    Vigentes
                                </button>
                                <button
                                    onClick={() => setFiltro('confirmada')}
                                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                                        filtro === 'confirmada'
                                            ? 'bg-green-500 text-white'
                                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                                    }`}
                                >
                                    Confirmadas
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
                                <button
                                    onClick={() => setFiltro('cancelada')}
                                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                                        filtro === 'cancelada'
                                            ? 'bg-red-500 text-white'
                                            : 'bg-red-100 text-red-700 hover:bg-red-200'
                                    }`}
                                >
                                    Canceladas
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Tabla de Reservas */}
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
                                            Monto de Reserva
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
                                    {reservasFiltradas.map((reserva) => (
                                        <tr key={reserva.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{reserva.cliente}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{reserva.propiedad}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900 font-medium">{formatMoney(reserva.montoReserva)}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">Creada: {reserva.fechaCreacion}</div>
                                                <div className="text-xs text-gray-500">
                                                    Vence: {reserva.fechaVencimiento}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                    reserva.estado === 'vigente'
                                                        ? 'bg-yellow-100 text-yellow-800'
                                                        : reserva.estado === 'confirmada'
                                                        ? 'bg-green-100 text-green-800'
                                                        : reserva.estado === 'vencida'
                                                        ? 'bg-gray-100 text-gray-800'
                                                        : 'bg-red-100 text-red-800'
                                                }`}>
                                                    {reserva.estado === 'vigente'
                                                        ? 'Vigente'
                                                        : reserva.estado === 'confirmada'
                                                        ? 'Confirmada'
                                                        : reserva.estado === 'vencida'
                                                        ? 'Vencida'
                                                        : 'Cancelada'
                                                    }
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex justify-end space-x-3">
                                                    <Link
                                                        href={`/asesor/reservas/${reserva.id}`}
                                                        className="text-indigo-600 hover:text-indigo-900"
                                                    >
                                                        <span className="sr-only">Ver reserva</span>
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                                        </svg>
                                                    </Link>
                                                    <Link
                                                        href={`/asesor/cotizaciones/${reserva.cotizacionId}`}
                                                        className="text-blue-600 hover:text-blue-900"
                                                    >
                                                        <span className="sr-only">Ver cotización</span>
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                                                        </svg>
                                                    </Link>
                                                    {(reserva.estado === 'vigente' || reserva.estado === 'confirmada') && (
                                                        <Link
                                                            href={`/asesor/ventas/crear/${reserva.id}`}
                                                            className="text-green-600 hover:text-green-900"
                                                        >
                                                            <span className="sr-only">Registrar venta</span>
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                                <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h8V3a1 1 0 112 0v1h1a2 2 0 012 2v10a2 2 0 01-2 2H3a2 2 0 01-2-2V6a2 2 0 012-2h1V3a1 1 0 011-1zm11 14a1 1 0 01-1 1H5a1 1 0 01-1-1V7h12v9z" clipRule="evenodd" />
                                                            </svg>
                                                        </Link>
                                                    )}
                                                    {reserva.estado === 'vigente' && (
                                                        <button
                                                            className="text-red-600 hover:text-red-900"
                                                        >
                                                            <span className="sr-only">Cancelar reserva</span>
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                                            </svg>
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {reservasFiltradas.length === 0 && (
                                <div className="px-6 py-4 text-center text-gray-500">
                                    No hay reservas que coincidan con el filtro seleccionado
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Paginación simulada */}
                    <div className="mt-6 flex justify-between items-center">
                        <div className="text-sm text-gray-700">
                            Mostrando <span className="font-medium">5</span> de <span className="font-medium">8</span> reservas
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
