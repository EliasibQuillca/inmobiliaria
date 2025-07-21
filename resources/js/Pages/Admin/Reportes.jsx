import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import Layout from '@/components/layout/Layout';

export default function Reportes({ auth }) {
    // Estado para los reportes
    const [reportes, setReportes] = useState([
        {
            id: 1,
            titulo: 'Informe de Ventas - Julio 2025',
            tipo: 'Ventas',
            periodo: 'Julio 2025',
            generado: '2025-08-02',
            creador: 'admin@example.com',
            descargas: 15,
            formato: 'PDF'
        },
        {
            id: 2,
            titulo: 'Reporte de Actividad de Asesores - Q2 2025',
            tipo: 'Actividad',
            periodo: 'Abril - Junio 2025',
            generado: '2025-07-10',
            creador: 'admin@example.com',
            descargas: 8,
            formato: 'PDF'
        },
        {
            id: 3,
            titulo: 'Análisis de Inventario - Junio 2025',
            tipo: 'Inventario',
            periodo: 'Junio 2025',
            generado: '2025-07-05',
            creador: 'admin@example.com',
            descargas: 12,
            formato: 'PDF'
        },
        {
            id: 4,
            titulo: 'Reporte Financiero - Q2 2025',
            tipo: 'Financiero',
            periodo: 'Abril - Junio 2025',
            generado: '2025-07-15',
            creador: 'admin@example.com',
            descargas: 7,
            formato: 'PDF'
        },
        {
            id: 5,
            titulo: 'Resumen de Ventas por Asesor - Junio 2025',
            tipo: 'Ventas',
            periodo: 'Junio 2025',
            generado: '2025-07-03',
            creador: 'admin@example.com',
            descargas: 10,
            formato: 'PDF'
        }
    ]);

    // Estado para los filtros
    const [filtros, setFiltros] = useState({
        busqueda: '',
        tipo: '',
        fechaInicio: '',
        fechaFin: '',
    });

    // Función para manejar cambios en los filtros
    const handleFiltroChange = (e) => {
        const { name, value } = e.target;
        setFiltros({
            ...filtros,
            [name]: value,
        });
    };

    // Filtrar reportes
    const reportesFiltrados = reportes.filter((reporte) => {
        const cumpleBusqueda = reporte.titulo.toLowerCase().includes(filtros.busqueda.toLowerCase());
        const cumpleTipo = filtros.tipo === '' || reporte.tipo === filtros.tipo;
        const cumpleFechaInicio = filtros.fechaInicio === '' || reporte.generado >= filtros.fechaInicio;
        const cumpleFechaFin = filtros.fechaFin === '' || reporte.generado <= filtros.fechaFin;

        return cumpleBusqueda && cumpleTipo && cumpleFechaInicio && cumpleFechaFin;
    });

    // Plantillas de reportes predefinidos
    const plantillasReportes = [
        { id: 1, titulo: 'Reporte de Ventas', descripcion: 'Resumen de todas las ventas del período seleccionado' },
        { id: 2, titulo: 'Actividad de Asesores', descripcion: 'Análisis del rendimiento de los asesores inmobiliarios' },
        { id: 3, titulo: 'Estado de Inventario', descripcion: 'Resumen del estado actual del inventario de departamentos' },
        { id: 4, titulo: 'Reporte Financiero', descripcion: 'Análisis financiero de ingresos, costos y ganancias' }
    ];

    return (
        <Layout auth={auth}>
            <Head title="Reportes - Inmobiliaria" />

            <div className="py-12 bg-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900">
                                Reportes
                            </h2>
                            <p className="mt-1 text-lg text-gray-600">
                                Genera y administra los reportes del sistema
                            </p>
                        </div>
                        <Link
                            href="/admin/reportes/generar"
                            className="px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Generar Nuevo Reporte
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                        {/* Reportes generados recientemente */}
                        <div className="lg:col-span-2 bg-white shadow-md rounded-lg overflow-hidden">
                            <div className="px-6 py-5 border-b border-gray-200">
                                <h3 className="text-lg leading-6 font-medium text-gray-900">
                                    Reportes Generados
                                </h3>
                            </div>

                            {/* Filtros */}
                            <div className="p-6 border-b border-gray-200">
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                    <div>
                                        <label htmlFor="busqueda" className="block text-sm font-medium text-gray-700 mb-1">
                                            Buscar
                                        </label>
                                        <input
                                            type="text"
                                            id="busqueda"
                                            name="busqueda"
                                            value={filtros.busqueda}
                                            onChange={handleFiltroChange}
                                            placeholder="Título del reporte"
                                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="tipo" className="block text-sm font-medium text-gray-700 mb-1">
                                            Tipo
                                        </label>
                                        <select
                                            id="tipo"
                                            name="tipo"
                                            value={filtros.tipo}
                                            onChange={handleFiltroChange}
                                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                        >
                                            <option value="">Todos los tipos</option>
                                            <option value="Ventas">Ventas</option>
                                            <option value="Actividad">Actividad</option>
                                            <option value="Inventario">Inventario</option>
                                            <option value="Financiero">Financiero</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label htmlFor="fechaInicio" className="block text-sm font-medium text-gray-700 mb-1">
                                            Desde
                                        </label>
                                        <input
                                            type="date"
                                            id="fechaInicio"
                                            name="fechaInicio"
                                            value={filtros.fechaInicio}
                                            onChange={handleFiltroChange}
                                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="fechaFin" className="block text-sm font-medium text-gray-700 mb-1">
                                            Hasta
                                        </label>
                                        <input
                                            type="date"
                                            id="fechaFin"
                                            name="fechaFin"
                                            value={filtros.fechaFin}
                                            onChange={handleFiltroChange}
                                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Lista de reportes */}
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Reporte
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Tipo
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Generado
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Descargas
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Acciones
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {reportesFiltrados.length > 0 ? (
                                            reportesFiltrados.map((reporte) => (
                                                <tr key={reporte.id}>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center">
                                                            <div className="flex-shrink-0 h-10 w-10">
                                                                <div className="h-10 w-10 rounded-md bg-blue-100 flex items-center justify-center">
                                                                    <svg className="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                                    </svg>
                                                                </div>
                                                            </div>
                                                            <div className="ml-4">
                                                                <div className="text-sm font-medium text-gray-900">
                                                                    {reporte.titulo}
                                                                </div>
                                                                <div className="text-sm text-gray-500">
                                                                    Período: {reporte.periodo}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                                                            ${reporte.tipo === 'Ventas' ? 'bg-green-100 text-green-800' :
                                                              reporte.tipo === 'Actividad' ? 'bg-yellow-100 text-yellow-800' :
                                                              reporte.tipo === 'Inventario' ? 'bg-indigo-100 text-indigo-800' :
                                                              'bg-blue-100 text-blue-800'}`}>
                                                            {reporte.tipo}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900">{reporte.generado}</div>
                                                        <div className="text-sm text-gray-500">{reporte.creador}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {reporte.descargas} <span className="text-xs text-gray-400">veces</span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <div className="flex space-x-2 justify-end">
                                                            <Link
                                                                href={`/admin/reportes/${reporte.id}`}
                                                                className="text-blue-600 hover:text-blue-900"
                                                            >
                                                                Ver
                                                            </Link>
                                                            <button
                                                                className="text-green-600 hover:text-green-900"
                                                            >
                                                                Descargar
                                                            </button>
                                                            <button
                                                                className="text-red-600 hover:text-red-900"
                                                            >
                                                                Eliminar
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                                                    No se encontraron reportes que coincidan con los filtros.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Panel de plantillas de reportes */}
                        <div className="bg-white shadow-md rounded-lg overflow-hidden">
                            <div className="px-6 py-5 border-b border-gray-200">
                                <h3 className="text-lg leading-6 font-medium text-gray-900">
                                    Plantillas de Reportes
                                </h3>
                            </div>
                            <div className="px-6 py-5">
                                <p className="text-sm text-gray-600 mb-4">
                                    Selecciona una plantilla para generar un nuevo reporte rápidamente.
                                </p>

                                <div className="space-y-4">
                                    {plantillasReportes.map((plantilla) => (
                                        <div key={plantilla.id} className="border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors p-4">
                                            <h4 className="font-medium text-gray-900">{plantilla.titulo}</h4>
                                            <p className="mt-1 text-sm text-gray-500">{plantilla.descripcion}</p>
                                            <div className="mt-3">
                                                <Link
                                                    href={`/admin/reportes/generar?plantilla=${plantilla.id}`}
                                                    className="text-sm text-blue-600 hover:text-blue-800"
                                                >
                                                    Usar esta plantilla →
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-6 pt-6 border-t border-gray-200">
                                    <h4 className="font-medium text-gray-900 mb-3">Generar Reporte Personalizado</h4>
                                    <Link
                                        href="/admin/reportes/generar"
                                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                        Crear Reporte Personalizado
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Gráficos y estadísticas */}
                    <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
                        <div className="px-6 py-5 border-b border-gray-200">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">
                                Resumen de Reportes
                            </h3>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                    <div className="text-sm font-medium text-gray-500">Total Reportes</div>
                                    <div className="mt-1 text-3xl font-semibold text-gray-900">25</div>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                    <div className="text-sm font-medium text-gray-500">Reportes de Ventas</div>
                                    <div className="mt-1 text-3xl font-semibold text-green-600">12</div>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                    <div className="text-sm font-medium text-gray-500">Reportes Mensuales</div>
                                    <div className="mt-1 text-3xl font-semibold text-blue-600">8</div>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                    <div className="text-sm font-medium text-gray-500">Descargas Totales</div>
                                    <div className="mt-1 text-3xl font-semibold text-indigo-600">142</div>
                                </div>
                            </div>

                            <div className="mb-6">
                                <h4 className="text-base font-medium text-gray-700 mb-2">Reportes por Tipo</h4>
                                <div className="h-8 bg-gray-200 rounded-md flex items-end overflow-hidden">
                                    <div className="h-8 w-2/5 bg-green-500" title="Ventas"></div>
                                    <div className="h-8 w-1/5 bg-yellow-500" title="Actividad"></div>
                                    <div className="h-8 w-1/5 bg-indigo-500" title="Inventario"></div>
                                    <div className="h-8 w-1/5 bg-blue-500" title="Financiero"></div>
                                </div>
                                <div className="flex justify-between mt-2 text-xs text-gray-500">
                                    <span className="flex items-center"><span className="h-2 w-2 rounded-full bg-green-500 mr-1"></span> Ventas (40%)</span>
                                    <span className="flex items-center"><span className="h-2 w-2 rounded-full bg-yellow-500 mr-1"></span> Actividad (20%)</span>
                                    <span className="flex items-center"><span className="h-2 w-2 rounded-full bg-indigo-500 mr-1"></span> Inventario (20%)</span>
                                    <span className="flex items-center"><span className="h-2 w-2 rounded-full bg-blue-500 mr-1"></span> Financiero (20%)</span>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-base font-medium text-gray-700 mb-2">Reportes Generados por Mes</h4>
                                <div className="h-40 bg-gray-100 rounded-md flex items-end justify-around p-4">
                                    <div className="flex flex-col items-center">
                                        <div className="bg-blue-500 w-8" style={{ height: '30%' }}></div>
                                        <div className="mt-2 text-xs text-gray-500">Ene</div>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <div className="bg-blue-500 w-8" style={{ height: '45%' }}></div>
                                        <div className="mt-2 text-xs text-gray-500">Feb</div>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <div className="bg-blue-500 w-8" style={{ height: '60%' }}></div>
                                        <div className="mt-2 text-xs text-gray-500">Mar</div>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <div className="bg-blue-500 w-8" style={{ height: '40%' }}></div>
                                        <div className="mt-2 text-xs text-gray-500">Abr</div>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <div className="bg-blue-500 w-8" style={{ height: '75%' }}></div>
                                        <div className="mt-2 text-xs text-gray-500">May</div>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <div className="bg-blue-500 w-8" style={{ height: '80%' }}></div>
                                        <div className="mt-2 text-xs text-gray-500">Jun</div>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <div className="bg-blue-500 w-8" style={{ height: '90%' }}></div>
                                        <div className="mt-2 text-xs text-gray-500">Jul</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
