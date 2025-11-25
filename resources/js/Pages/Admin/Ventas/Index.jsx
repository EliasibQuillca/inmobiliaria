import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function Ventas({ auth, ventas, estadisticas, filtros }) {
    const [searchTerm, setSearchTerm] = useState(filtros?.busqueda || '');
    const [statusFilter, setStatusFilter] = useState(filtros?.estado || '');
    const [dateFrom, setDateFrom] = useState(filtros?.fecha_desde || '');
    const [dateTo, setDateTo] = useState(filtros?.fecha_hasta || '');

    // Datos reales desde el backend con validación de estructura
    const listaVentas = ventas?.data || [];
    const paginacion = ventas?.meta || ventas?.links ? {
        current_page: ventas.current_page || 1,
        last_page: ventas.last_page || 1,
        per_page: ventas.per_page || 15,
        total: ventas.total || 0
    } : { current_page: 1, last_page: 1, per_page: 15, total: 0 };

    const stats = estadisticas || {
        total_ventas: 0,
        numero_ventas: 0,
        venta_promedio: 0,
        ventas_mes_actual: 0
    };

    // Manejar filtros
    const handleFiltroChange = (filtro, valor) => {
        const nuevosFiltros = {
            ...filtros,
            [filtro]: valor,
            page: 1, // Resetear página
        };

        router.get('/admin/ventas', nuevosFiltros, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    // Formatear precio
    const formatearPrecio = (precio) => {
        return new Intl.NumberFormat('es-PE', {
            style: 'currency',
            currency: 'PEN'
        }).format(precio);
    };

    // Formatear fecha
    const formatearFecha = (fecha) => {
        return new Date(fecha).toLocaleDateString('es-PE');
    };

    // Obtener color del estado
    const getEstadoColor = (estado) => {
        switch (estado) {
            case 'completada':
                return 'bg-green-100 text-green-800';
            case 'en_proceso':
                return 'bg-yellow-100 text-yellow-800';
            case 'pendiente':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Cambiar página
    const cambiarPagina = (nuevaPagina) => {
        if (nuevaPagina > 0 && nuevaPagina <= paginacion.last_page) {
            const nuevosFiltros = {
                ...filtros,
                page: nuevaPagina,
            };
            router.get('/admin/ventas', nuevosFiltros, {
                preserveState: true,
                preserveScroll: true,
            });
        }
    };

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
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
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
                                    <dd className="text-2xl font-semibold text-gray-900">{formatearPrecio(stats.total_ventas)}</dd>
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
                                    <dd className="text-2xl font-semibold text-gray-900">{stats.numero_ventas}</dd>
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
                                    <dt className="text-sm font-medium text-gray-500">Venta Promedio</dt>
                                    <dd className="text-2xl font-semibold text-gray-900">{formatearPrecio(stats.venta_promedio)}</dd>
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
                                        onChange={(e) => {
                                            setSearchTerm(e.target.value);
                                            clearTimeout(window.searchTimeout);
                                            window.searchTimeout = setTimeout(() => {
                                                handleFiltroChange('busqueda', e.target.value);
                                            }, 500);
                                        }}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <select
                                    value={statusFilter}
                                    onChange={(e) => {
                                        setStatusFilter(e.target.value);
                                        handleFiltroChange('estado', e.target.value);
                                    }}
                                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Todos los estados</option>
                                    <option value="confirmada">Confirmada</option>
                                    <option value="pendiente">Pendiente</option>
                                    <option value="cancelada">Cancelada</option>
                                </select>
                                <div className="flex space-x-2">
                                    <input
                                        type="date"
                                        value={dateFrom}
                                        onChange={(e) => {
                                            setDateFrom(e.target.value);
                                            handleFiltroChange('fecha_desde', e.target.value);
                                        }}
                                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Desde"
                                    />
                                    <input
                                        type="date"
                                        value={dateTo}
                                        onChange={(e) => {
                                            setDateTo(e.target.value);
                                            handleFiltroChange('fecha_hasta', e.target.value);
                                        }}
                                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Hasta"
                                    />
                                </div>
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
                                        {listaVentas.map((venta) => (
                                            <tr key={venta.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">
                                                            Venta #{venta.id}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {venta.reserva?.cotizacion?.departamento?.titulo || 'Propiedad no disponible'}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {venta.reserva?.cotizacion?.cliente?.nombre || 'Cliente no disponible'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {venta.reserva?.cotizacion?.asesor?.usuario?.name || 'Asesor no disponible'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {formatearPrecio(venta.monto_final)}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getEstadoColor(venta.reserva?.estado || 'pendiente')}`}>
                                                        {venta.reserva?.estado || 'Pendiente'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {formatearFecha(venta.fecha_venta)}
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
                                                            href={`/admin/ventas/${venta.id}/edit`}
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

                                {listaVentas.length === 0 && (
                                    <div className="text-center py-8">
                                        <p className="text-gray-500">No se encontraron ventas.</p>
                                    </div>
                                )}

                                {/* Paginación */}
                                {paginacion.last_page > 1 && (
                                    <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
                                        <div className="flex-1 flex justify-between sm:hidden">
                                            <button
                                                onClick={() => cambiarPagina(paginacion.current_page - 1)}
                                                disabled={paginacion.current_page <= 1}
                                                className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                                            >
                                                Anterior
                                            </button>
                                            <button
                                                onClick={() => cambiarPagina(paginacion.current_page + 1)}
                                                disabled={paginacion.current_page >= paginacion.last_page}
                                                className="relative ml-3 inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                                            >
                                                Siguiente
                                            </button>
                                        </div>
                                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                            <div>
                                                <p className="text-sm text-gray-700">
                                                    Mostrando <span className="font-medium">{((paginacion.current_page - 1) * paginacion.per_page) + 1}</span> a{' '}
                                                    <span className="font-medium">{Math.min(paginacion.current_page * paginacion.per_page, paginacion.total)}</span> de{' '}
                                                    <span className="font-medium">{paginacion.total}</span> resultados
                                                </p>
                                            </div>
                                            <div>
                                                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                                    <button
                                                        onClick={() => cambiarPagina(paginacion.current_page - 1)}
                                                        disabled={paginacion.current_page <= 1}
                                                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                                    >
                                                        Anterior
                                                    </button>
                                                    {[...Array(Math.min(5, paginacion.last_page))].map((_, i) => {
                                                        const pageNum = i + 1;
                                                        return (
                                                            <button
                                                                key={pageNum}
                                                                onClick={() => cambiarPagina(pageNum)}
                                                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                                                    pageNum === paginacion.current_page
                                                                        ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                                                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                                }`}
                                                            >
                                                                {pageNum}
                                                            </button>
                                                        );
                                                    })}
                                                    <button
                                                        onClick={() => cambiarPagina(paginacion.current_page + 1)}
                                                        disabled={paginacion.current_page >= paginacion.last_page}
                                                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                                    >
                                                        Siguiente
                                                    </button>
                                                </nav>
                                            </div>
                                        </div>
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
