import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import Layout from '@/components/layout/Layout';

export default function AsesorVentas({ auth }) {
    // Estado para el filtro
    const [filtro, setFiltro] = useState('todas');
    const [periodoFiltro, setPeriodoFiltro] = useState('todos');

    // Datos simulados de ventas
    const [ventas, setVentas] = useState([
        {
            id: 1,
            cliente: 'María López',
            propiedad: 'Departamento Lima 305',
            valorVenta: 115000,
            comision: 5750,
            fechaVenta: '2025-07-15',
            estado: 'completada',
            metodoPago: 'crédito hipotecario',
            banco: 'BCP'
        },
        {
            id: 2,
            cliente: 'Carlos Mendoza',
            propiedad: 'Departamento San Sebastián 201',
            valorVenta: 85000,
            comision: 4250,
            fechaVenta: '2025-07-10',
            estado: 'pendiente',
            metodoPago: 'crédito hipotecario',
            banco: 'Interbank'
        },
        {
            id: 3,
            cliente: 'Julia Paredes',
            propiedad: 'Departamento Magisterio 405',
            valorVenta: 145000,
            comision: 7250,
            fechaVenta: '2025-06-25',
            estado: 'completada',
            metodoPago: 'contado',
            banco: null
        },
        {
            id: 4,
            cliente: 'Roberto Guzmán',
            propiedad: 'Departamento Universidad 102',
            valorVenta: 62000,
            comision: 3100,
            fechaVenta: '2025-06-05',
            estado: 'completada',
            metodoPago: 'crédito hipotecario',
            banco: 'Scotiabank'
        },
        {
            id: 5,
            cliente: 'Ana Ballón',
            propiedad: 'Departamento Wanchaq 501',
            valorVenta: 105000,
            comision: 5250,
            fechaVenta: '2025-05-20',
            estado: 'completada',
            metodoPago: 'contado',
            banco: null
        }
    ]);

    // Filtrar ventas según el estado y período seleccionado
    const ventasFiltradas = ventas.filter(venta => {
        // Filtro por estado
        if (filtro !== 'todas' && venta.estado !== filtro) {
            return false;
        }

        // Filtro por período
        if (periodoFiltro === 'todos') {
            return true;
        }

        const fechaVenta = new Date(venta.fechaVenta);
        const hoy = new Date();

        if (periodoFiltro === 'mes') {
            // Ventas del mes actual
            return fechaVenta.getMonth() === hoy.getMonth() &&
                   fechaVenta.getFullYear() === hoy.getFullYear();
        } else if (periodoFiltro === 'trimestre') {
            // Ventas del trimestre actual
            const mesActual = hoy.getMonth();
            const trimestreActual = Math.floor(mesActual / 3);
            const mesVenta = fechaVenta.getMonth();
            const trimestreVenta = Math.floor(mesVenta / 3);

            return trimestreVenta === trimestreActual &&
                   fechaVenta.getFullYear() === hoy.getFullYear();
        } else if (periodoFiltro === 'año') {
            // Ventas del año actual
            return fechaVenta.getFullYear() === hoy.getFullYear();
        }

        return true;
    });

    // Cálculos de resumen
    const totalVentas = ventasFiltradas.reduce((total, venta) => total + venta.valorVenta, 0);
    const totalComisiones = ventasFiltradas.reduce((total, venta) => total + venta.comision, 0);
    const cantidadVentas = ventasFiltradas.length;

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
            <Head title="Gestión de Ventas - Asesor" />

            <div className="py-12 bg-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Ventas</h2>
                            <p className="mt-1 text-sm text-gray-600">
                                Gestione y haga seguimiento a sus ventas
                            </p>
                        </div>
                        <div className="flex space-x-4">
                            <Link
                                href="/asesor/ventas/crear"
                                className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:border-indigo-900 focus:ring ring-indigo-300"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                                </svg>
                                Registrar Venta
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

                    {/* Tarjetas de resumen */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div className="bg-white overflow-hidden shadow-md rounded-lg p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 bg-indigo-100 rounded-md p-3">
                                    <svg className="h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dt className="text-sm font-medium text-gray-500 truncate">
                                        Total Ventas
                                    </dt>
                                    <dd className="flex items-baseline">
                                        <div className="text-2xl font-semibold text-gray-900">
                                            {formatMoney(totalVentas)}
                                        </div>
                                    </dd>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow-md rounded-lg p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                                    <svg className="h-8 w-8 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dt className="text-sm font-medium text-gray-500 truncate">
                                        Comisiones Generadas
                                    </dt>
                                    <dd className="flex items-baseline">
                                        <div className="text-2xl font-semibold text-gray-900">
                                            {formatMoney(totalComisiones)}
                                        </div>
                                    </dd>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow-md rounded-lg p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                                    <svg className="h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dt className="text-sm font-medium text-gray-500 truncate">
                                        Cantidad de Ventas
                                    </dt>
                                    <dd className="flex items-baseline">
                                        <div className="text-2xl font-semibold text-gray-900">
                                            {cantidadVentas}
                                        </div>
                                    </dd>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filtros */}
                    <div className="bg-white shadow rounded-lg p-4 mb-6">
                        <div className="flex flex-wrap items-center gap-4">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                <div>
                                    <div className="font-medium text-gray-700">Estado:</div>
                                    <div className="flex flex-wrap gap-2 mt-1">
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
                                            onClick={() => setFiltro('completada')}
                                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                                                filtro === 'completada'
                                                    ? 'bg-green-500 text-white'
                                                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                                            }`}
                                        >
                                            Completadas
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
                                    </div>
                                </div>
                                <div className="sm:ml-6">
                                    <div className="font-medium text-gray-700">Período:</div>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        <button
                                            onClick={() => setPeriodoFiltro('todos')}
                                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                                                periodoFiltro === 'todos'
                                                    ? 'bg-indigo-600 text-white'
                                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                            }`}
                                        >
                                            Todos
                                        </button>
                                        <button
                                            onClick={() => setPeriodoFiltro('mes')}
                                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                                                periodoFiltro === 'mes'
                                                    ? 'bg-blue-500 text-white'
                                                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                            }`}
                                        >
                                            Este Mes
                                        </button>
                                        <button
                                            onClick={() => setPeriodoFiltro('trimestre')}
                                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                                                periodoFiltro === 'trimestre'
                                                    ? 'bg-purple-500 text-white'
                                                    : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                                            }`}
                                        >
                                            Este Trimestre
                                        </button>
                                        <button
                                            onClick={() => setPeriodoFiltro('año')}
                                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                                                periodoFiltro === 'año'
                                                    ? 'bg-teal-500 text-white'
                                                    : 'bg-teal-100 text-teal-700 hover:bg-teal-200'
                                            }`}
                                        >
                                            Este Año
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tabla de Ventas */}
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
                                            Valor de Venta
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Comisión
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Fecha / Método
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
                                    {ventasFiltradas.map((venta) => (
                                        <tr key={venta.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{venta.cliente}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{venta.propiedad}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900 font-medium">{formatMoney(venta.valorVenta)}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-green-600 font-medium">{formatMoney(venta.comision)}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{venta.fechaVenta}</div>
                                                <div className="text-xs text-gray-500">
                                                    {venta.metodoPago.charAt(0).toUpperCase() + venta.metodoPago.slice(1)}
                                                    {venta.banco && ` (${venta.banco})`}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                    venta.estado === 'completada'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                    {venta.estado === 'completada'
                                                        ? 'Completada'
                                                        : 'Pendiente'
                                                    }
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex justify-end space-x-3">
                                                    <Link
                                                        href={`/asesor/ventas/${venta.id}`}
                                                        className="text-indigo-600 hover:text-indigo-900"
                                                    >
                                                        <span className="sr-only">Ver detalles</span>
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                                        </svg>
                                                    </Link>
                                                    {venta.estado === 'pendiente' && (
                                                        <button
                                                            className="text-green-600 hover:text-green-900"
                                                        >
                                                            <span className="sr-only">Marcar como completada</span>
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                            </svg>
                                                        </button>
                                                    )}
                                                    <Link
                                                        href={`/asesor/ventas/documentos/${venta.id}`}
                                                        className="text-blue-600 hover:text-blue-900"
                                                    >
                                                        <span className="sr-only">Documentos</span>
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                                                        </svg>
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {ventasFiltradas.length === 0 && (
                                <div className="px-6 py-4 text-center text-gray-500">
                                    No hay ventas que coincidan con los filtros seleccionados
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Paginación simulada */}
                    <div className="mt-6 flex justify-between items-center">
                        <div className="text-sm text-gray-700">
                            Mostrando <span className="font-medium">5</span> de <span className="font-medium">15</span> ventas
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
