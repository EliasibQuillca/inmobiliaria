import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/components/admin/AdminLayout';
import axios from 'axios';

export default function ReportesVentas({ auth }) {
    // Estados para los filtros
    const [filtros, setFiltros] = useState({
        fecha_inicio: '',
        fecha_fin: '',
        asesor_id: '',
        estado: 'completada'
    });

    // Estados para los datos y carga
    const [ventas, setVentas] = useState([]);
    const [asesores, setAsesores] = useState([]);
    const [loading, setLoading] = useState(false);
    const [generandoPDF, setGenerandoPDF] = useState(false);
    const [error, setError] = useState(null);
    const [estadisticas, setEstadisticas] = useState({
        total_ventas: 0,
        monto_total: 0,
        promedio_venta: 0
    });

    // Cargar asesores al montar el componente
    useEffect(() => {
        const cargarAsesores = async () => {
            try {
                const response = await axios.get('/api/v1/admin/asesores');
                if (response.data && response.data.data) {
                    setAsesores(response.data.data);
                }
            } catch (err) {
                console.error('Error al cargar asesores:', err);
                setError('No se pudieron cargar los asesores. Por favor, inténtelo de nuevo.');
            }
        };

        cargarAsesores();

        // Establecer fecha de inicio como primer día del mes actual y fecha fin como día actual por defecto
        const hoy = new Date();
        const primerDiaMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);

        setFiltros({
            ...filtros,
            fecha_inicio: primerDiaMes.toISOString().split('T')[0],
            fecha_fin: hoy.toISOString().split('T')[0]
        });
    }, []);

    // Manejar cambios en los filtros
    const handleFiltroChange = (e) => {
        const { name, value } = e.target;
        setFiltros({
            ...filtros,
            [name]: value
        });
    };

    // Función para buscar ventas
    const buscarVentas = async (e) => {
        e.preventDefault();

        setLoading(true);
        setError(null);

        try {
            const response = await axios.get('/api/v1/admin/ventas/reporte', {
                params: filtros
            });

            if (response.data) {
                setVentas(response.data.ventas || []);
                setEstadisticas(response.data.estadisticas || {
                    total_ventas: 0,
                    monto_total: 0,
                    promedio_venta: 0
                });
            }
        } catch (err) {
            console.error('Error al buscar ventas:', err);
            setError('No se pudieron cargar las ventas. Por favor, inténtelo de nuevo.');
            setVentas([]);
            setEstadisticas({
                total_ventas: 0,
                monto_total: 0,
                promedio_venta: 0
            });
        } finally {
            setLoading(false);
        }
    };

    // Función para generar PDF
    const generarPDF = async () => {
        setGenerandoPDF(true);
        setError(null);

        try {
            const response = await axios.post('/api/v1/admin/ventas/generar-pdf', filtros, {
                responseType: 'blob'
            });

            // Crear un enlace para descargar el PDF
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;

            // Generar nombre del archivo
            const fechaHoy = new Date().toISOString().split('T')[0];
            link.setAttribute('download', `reporte-ventas-${fechaHoy}.pdf`);

            document.body.appendChild(link);
            link.click();

            // Limpiar
            window.URL.revokeObjectURL(url);
            link.remove();
        } catch (err) {
            console.error('Error al generar PDF:', err);
            setError('No se pudo generar el PDF. Por favor, inténtelo de nuevo.');
        } finally {
            setGenerandoPDF(false);
        }
    };

    // Formatear moneda
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('es-PE', {
            style: 'currency',
            currency: 'PEN',
            minimumFractionDigits: 2
        }).format(amount);
    };

    // Formatear fecha
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    return (
        <AdminLayout auth={auth} title="Reportes de Ventas">
            <Head title="Reportes de Ventas - Inmobiliaria" />

            <div className="py-12 bg-gray-100">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Encabezado */}
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">
                                Reportes de Ventas
                            </h2>
                            <p className="mt-1 text-sm text-gray-600">
                                Genere reportes de ventas finalizadas en formato PDF
                            </p>
                        </div>
                    </div>

                    {/* Filtros */}
                    <div className="bg-white rounded-md shadow p-4 mb-6">
                        <form onSubmit={buscarVentas}>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                {/* Fecha Inicio */}
                                <div>
                                    <label htmlFor="fecha_inicio" className="block text-sm font-medium text-gray-700 mb-1">
                                        Fecha Inicio
                                    </label>
                                    <input
                                        type="date"
                                        id="fecha_inicio"
                                        name="fecha_inicio"
                                        value={filtros.fecha_inicio}
                                        onChange={handleFiltroChange}
                                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                    />
                                </div>

                                {/* Fecha Fin */}
                                <div>
                                    <label htmlFor="fecha_fin" className="block text-sm font-medium text-gray-700 mb-1">
                                        Fecha Fin
                                    </label>
                                    <input
                                        type="date"
                                        id="fecha_fin"
                                        name="fecha_fin"
                                        value={filtros.fecha_fin}
                                        onChange={handleFiltroChange}
                                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                    />
                                </div>

                                {/* Asesor */}
                                <div>
                                    <label htmlFor="asesor_id" className="block text-sm font-medium text-gray-700 mb-1">
                                        Asesor
                                    </label>
                                    <select
                                        id="asesor_id"
                                        name="asesor_id"
                                        value={filtros.asesor_id}
                                        onChange={handleFiltroChange}
                                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                    >
                                        <option value="">Todos los asesores</option>
                                        {asesores.map((asesor) => (
                                            <option key={asesor.id} value={asesor.id}>
                                                {asesor.nombre} {asesor.apellido}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Estado */}
                                <div>
                                    <label htmlFor="estado" className="block text-sm font-medium text-gray-700 mb-1">
                                        Estado
                                    </label>
                                    <select
                                        id="estado"
                                        name="estado"
                                        value={filtros.estado}
                                        onChange={handleFiltroChange}
                                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                    >
                                        <option value="completada">Completada</option>
                                        <option value="cancelada">Cancelada</option>
                                        <option value="todas">Todas</option>
                                    </select>
                                </div>
                            </div>

                            {/* Botones de acciones */}
                            <div className="mt-4 flex justify-end space-x-3">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                                        loading ? 'opacity-75 cursor-not-allowed' : ''
                                    }`}
                                >
                                    {loading ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Buscando...
                                        </>
                                    ) : (
                                        <>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                            </svg>
                                            Buscar Ventas
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Mensaje de error */}
                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-red-700">{error}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Resumen de Estadísticas */}
                    {ventas.length > 0 && (
                        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white overflow-hidden shadow rounded-lg">
                                <div className="px-4 py-5 sm:p-6">
                                    <dt className="text-sm font-medium text-gray-500 truncate">
                                        Total de Ventas
                                    </dt>
                                    <dd className="mt-1 text-3xl font-semibold text-gray-900">
                                        {estadisticas.total_ventas}
                                    </dd>
                                </div>
                            </div>

                            <div className="bg-white overflow-hidden shadow rounded-lg">
                                <div className="px-4 py-5 sm:p-6">
                                    <dt className="text-sm font-medium text-gray-500 truncate">
                                        Monto Total
                                    </dt>
                                    <dd className="mt-1 text-3xl font-semibold text-gray-900">
                                        {formatCurrency(estadisticas.monto_total)}
                                    </dd>
                                </div>
                            </div>

                            <div className="bg-white overflow-hidden shadow rounded-lg">
                                <div className="px-4 py-5 sm:p-6">
                                    <dt className="text-sm font-medium text-gray-500 truncate">
                                        Promedio por Venta
                                    </dt>
                                    <dd className="mt-1 text-3xl font-semibold text-gray-900">
                                        {formatCurrency(estadisticas.promedio_venta)}
                                    </dd>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Tabla de ventas */}
                    {ventas.length > 0 && (
                        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
                            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                                <h3 className="text-lg leading-6 font-medium text-gray-900">
                                    Resultados ({ventas.length})
                                </h3>
                                <button
                                    onClick={generarPDF}
                                    disabled={generandoPDF}
                                    className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${
                                        generandoPDF ? 'opacity-75 cursor-not-allowed' : ''
                                    }`}
                                >
                                    {generandoPDF ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Generando PDF...
                                        </>
                                    ) : (
                                        <>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
                                            </svg>
                                            Generar PDF
                                        </>
                                    )}
                                </button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Código
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Departamento
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Cliente
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Asesor
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Fecha
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Precio
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Estado
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {ventas.map((venta) => (
                                            <tr key={venta.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {venta.codigo}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {venta.departamento.titulo}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {venta.cliente.nombre} {venta.cliente.apellido}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {venta.asesor.nombre} {venta.asesor.apellido}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {formatDate(venta.fecha_venta)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {formatCurrency(venta.precio_venta)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                                                        ${venta.estado === 'completada' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                        {venta.estado === 'completada' ? 'Completada' : 'Cancelada'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Mensaje de no resultados */}
                    {!loading && ventas.length === 0 && !error && (
                        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                            <div className="px-4 py-12 text-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <h3 className="mt-2 text-lg font-medium text-gray-900">No hay resultados</h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    Ajuste los filtros o realice una nueva búsqueda para ver resultados.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
