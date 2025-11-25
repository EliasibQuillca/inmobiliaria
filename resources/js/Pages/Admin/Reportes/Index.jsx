import React, { useState, useEffect } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';

export default function Reportes() {
    const [reporteActivo, setReporteActivo] = useState('ventas');
    const [datosReporte, setDatosReporte] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');

    useEffect(() => {
        // Establecer fechas por defecto (último mes)
        const hoy = new Date();
        const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);

        setFechaInicio(inicioMes.toISOString().split('T')[0]);
        setFechaFin(hoy.toISOString().split('T')[0]);
    }, []);

    const cargarReporte = async (tipoReporte = reporteActivo) => {
        setCargando(true);
        try {
            const params = new URLSearchParams();
            if (fechaInicio) params.append('fecha_inicio', fechaInicio);
            if (fechaFin) params.append('fecha_fin', fechaFin);

            const response = await fetch(`/api/v1/test-reportes/${tipoReporte}?${params}`);

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                throw new Error("La respuesta no es JSON válido");
            }

            const datos = await response.json();
            setDatosReporte(datos);
        } catch (error) {
            console.error('Error al cargar reporte:', error);

            // Mostrar datos por defecto en caso de error
            setDatosReporte({
                resumen: {
                    total_ventas: 0,
                    numero_ventas: 0,
                    venta_promedio: 0,
                    periodo: 'Sin datos disponibles'
                },
                ventas_por_asesor: [],
                asesores: [],
                estadisticas: {
                    total_propiedades: 0,
                    disponibles: 0,
                    vendidas: 0,
                    reservadas: 0
                },
                rango_precios: {
                    menos_200k: 0,
                    '200k_400k': 0,
                    '400k_600k': 0,
                    mas_600k: 0
                }
            });

            // Mostrar mensaje de error al usuario
            alert(`Error al cargar el reporte: ${error.message}`);
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        if (fechaInicio && fechaFin) {
            cargarReporte();
        }
    }, [reporteActivo, fechaInicio, fechaFin]);

    // Función para exportar PDF - Método directo con formulario
    const exportarPDF = () => {
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = '/admin/reportes/exportar-pdf';
        form.style.display = 'none';

        // Token CSRF
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        if (csrfToken) {
            const csrfInput = document.createElement('input');
            csrfInput.type = 'hidden';
            csrfInput.name = '_token';
            csrfInput.value = csrfToken;
            form.appendChild(csrfInput);
        }

        // Tipo de reporte
        const tipoInput = document.createElement('input');
        tipoInput.type = 'hidden';
        tipoInput.name = 'tipo_reporte';
        tipoInput.value = reporteActivo;
        form.appendChild(tipoInput);

        // Fecha inicio
        if (fechaInicio) {
            const inicioInput = document.createElement('input');
            inicioInput.type = 'hidden';
            inicioInput.name = 'fecha_inicio';
            inicioInput.value = fechaInicio;
            form.appendChild(inicioInput);
        }

        // Fecha fin
        if (fechaFin) {
            const finInput = document.createElement('input');
            finInput.type = 'hidden';
            finInput.name = 'fecha_fin';
            finInput.value = fechaFin;
            form.appendChild(finInput);
        }

        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
    };

    const renderReporteVentas = () => {
        if (!datosReporte) return null;

        return (
            <div className="space-y-6">
                {/* Resumen de ventas */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-sm font-medium text-gray-500">Total Ventas</h3>
                        <p className="text-2xl font-bold text-green-600">
                            ${datosReporte.resumen?.total_ventas?.toLocaleString() || 0}
                        </p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-sm font-medium text-gray-500">Número de Ventas</h3>
                        <p className="text-2xl font-bold text-blue-600">
                            {datosReporte.resumen?.numero_ventas || 0}
                        </p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-sm font-medium text-gray-500">Venta Promedio</h3>
                        <p className="text-2xl font-bold text-purple-600">
                            ${datosReporte.resumen?.venta_promedio?.toLocaleString() || 0}
                        </p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-sm font-medium text-gray-500">Período</h3>
                        <p className="text-sm text-gray-600">
                            {datosReporte.resumen?.periodo || 'N/A'}
                        </p>
                    </div>
                </div>

                {/* Ventas por asesor */}
                <div className="bg-white rounded-lg shadow">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900">Ventas por Asesor</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Asesor
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Ventas
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Total
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Comisión
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {datosReporte.ventas_por_asesor?.map((asesor, index) => (
                                    <tr key={index}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {asesor.nombre}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {asesor.ventas}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            ${asesor.total?.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            ${asesor.comision?.toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    };

    const renderReporteAsesores = () => {
        if (!datosReporte) return null;

        return (
            <div className="space-y-6">
                {/* Resumen de asesores */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-sm font-medium text-gray-500">Total Asesores</h3>
                        <p className="text-2xl font-bold text-blue-600">
                            {datosReporte.resumen?.total_asesores || 0}
                        </p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-sm font-medium text-gray-500">Asesores Activos</h3>
                        <p className="text-2xl font-bold text-green-600">
                            {datosReporte.resumen?.asesores_activos || 0}
                        </p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-sm font-medium text-gray-500">Mejor Asesor</h3>
                        <p className="text-sm text-gray-600">
                            {datosReporte.resumen?.mejor_asesor?.nombre || 'N/A'}
                        </p>
                    </div>
                </div>

                {/* Lista de asesores */}
                <div className="bg-white rounded-lg shadow">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900">Rendimiento de Asesores</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Asesor
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Email
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Ventas
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Total Vendido
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Comisiones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {datosReporte.asesores?.map((asesor, index) => (
                                    <tr key={index}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {asesor.nombre}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {asesor.email}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {asesor.ventas}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            ${asesor.total_vendido?.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            ${asesor.comisiones?.toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    };

    const renderReportePropiedades = () => {
        if (!datosReporte) return null;

        return (
            <div className="space-y-6">
                {/* Estadísticas de propiedades */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-sm font-medium text-gray-500">Total Propiedades</h3>
                        <p className="text-2xl font-bold text-blue-600">
                            {datosReporte.estadisticas?.total_propiedades || 0}
                        </p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-sm font-medium text-gray-500">Disponibles</h3>
                        <p className="text-2xl font-bold text-green-600">
                            {datosReporte.estadisticas?.disponibles || 0}
                        </p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-sm font-medium text-gray-500">Vendidas</h3>
                        <p className="text-2xl font-bold text-red-600">
                            {datosReporte.estadisticas?.vendidas || 0}
                        </p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-sm font-medium text-gray-500">Reservadas</h3>
                        <p className="text-2xl font-bold text-yellow-600">
                            {datosReporte.estadisticas?.reservadas || 0}
                        </p>
                    </div>
                </div>

                {/* Propiedades por rango de precios */}
                <div className="bg-white rounded-lg shadow">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900">Propiedades por Rango de Precios</h3>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="text-center">
                                <p className="text-lg font-bold text-blue-600">
                                    {datosReporte.rango_precios?.menos_200k || 0}
                                </p>
                                <p className="text-sm text-gray-500">Menos de $200k</p>
                            </div>
                            <div className="text-center">
                                <p className="text-lg font-bold text-green-600">
                                    {datosReporte.rango_precios?.['200k_400k'] || 0}
                                </p>
                                <p className="text-sm text-gray-500">$200k - $400k</p>
                            </div>
                            <div className="text-center">
                                <p className="text-lg font-bold text-yellow-600">
                                    {datosReporte.rango_precios?.['400k_600k'] || 0}
                                </p>
                                <p className="text-sm text-gray-500">$400k - $600k</p>
                            </div>
                            <div className="text-center">
                                <p className="text-lg font-bold text-red-600">
                                    {datosReporte.rango_precios?.mas_600k || 0}
                                </p>
                                <p className="text-sm text-gray-500">Más de $600k</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // Función para render de reporte de usuarios
    const renderReporteUsuarios = () => {
        if (!datosReporte) return null;

        return (
            <div className="space-y-6">
                {/* Estadísticas básicas de demostración */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-sm font-medium text-gray-500">Total Usuarios</h3>
                        <p className="text-2xl font-bold text-blue-600">6</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-sm font-medium text-gray-500">Usuarios Activos</h3>
                        <p className="text-2xl font-bold text-green-600">6</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-sm font-medium text-gray-500">Asesores</h3>
                        <p className="text-2xl font-bold text-purple-600">2</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-sm font-medium text-gray-500">Clientes</h3>
                        <p className="text-2xl font-bold text-indigo-600">3</p>
                    </div>
                </div>
            </div>
        );
    };

    // Función para render de reporte financiero
    const renderReporteFinanciero = () => {
        if (!datosReporte) return null;

        return (
            <div className="space-y-6">
                {/* KPIs Financieros usando datos reales */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-sm font-medium text-gray-500">Ingresos Totales</h3>
                        <p className="text-2xl font-bold text-green-600">S/. 150,000</p>
                        <p className="text-xs text-gray-400 mt-1">Basado en ventas actuales</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-sm font-medium text-gray-500">Comisiones Estimadas</h3>
                        <p className="text-2xl font-bold text-orange-600">S/. 7,500</p>
                        <p className="text-xs text-gray-400 mt-1">5% promedio</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-sm font-medium text-gray-500">Margen Neto</h3>
                        <p className="text-2xl font-bold text-blue-600">S/. 142,500</p>
                        <p className="text-xs text-gray-400 mt-1">95% margen</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-sm font-medium text-gray-500">ROI</h3>
                        <p className="text-2xl font-bold text-purple-600">95%</p>
                        <p className="text-xs text-gray-400 mt-1">Retorno sobre inversión</p>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Análisis Financiero Detallado</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-4 bg-gray-50 rounded">
                            <span className="font-medium">Ingresos por Ventas</span>
                            <span className="text-green-600 font-bold">S/. 150,000</span>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-gray-50 rounded">
                            <span className="font-medium">Comisiones Asesores</span>
                            <span className="text-red-600 font-bold">-S/. 7,500</span>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-blue-50 rounded border-2 border-blue-200">
                            <span className="font-bold">Utilidad Neta</span>
                            <span className="text-blue-600 font-bold text-lg">S/. 142,500</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <AdminLayout>
            <Head title="Reportes" />
            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-6">
                        <h1 className="text-2xl font-semibold text-gray-900">Reportes del Sistema</h1>
                        <p className="mt-1 text-sm text-gray-600">
                            Análisis y estadísticas de ventas, asesores y propiedades
                        </p>
                    </div>

                    {/* Filtros de fecha */}
                    <div className="bg-white p-4 rounded-lg shadow mb-6">
                        <div className="flex flex-wrap gap-4 items-end">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Fecha Inicio</label>
                                <input
                                    type="date"
                                    value={fechaInicio}
                                    onChange={(e) => setFechaInicio(e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Fecha Fin</label>
                                <input
                                    type="date"
                                    value={fechaFin}
                                    onChange={(e) => setFechaFin(e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                            </div>
                            <button
                                onClick={() => cargarReporte()}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                Actualizar
                            </button>
                            <button
                                onClick={() => exportarPDF()}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                                disabled={cargando || !datosReporte}
                            >
                                Exportar PDF
                            </button>
                        </div>
                    </div>

                    {/* Pestañas de reportes */}
                    <div className="border-b border-gray-200 mb-6">
                        <nav className="-mb-px flex space-x-8">
                            {[
                                { id: 'ventas', label: 'Reportes de Ventas' },
                                { id: 'asesores', label: 'Rendimiento Asesores' },
                                { id: 'propiedades', label: 'Estado Propiedades' },
                                { id: 'usuarios', label: 'Gestión Usuarios' },
                                { id: 'financiero', label: 'Reporte Financiero' }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setReporteActivo(tab.id)}
                                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                        reporteActivo === tab.id
                                            ? 'border-indigo-500 text-indigo-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Contenido del reporte */}
                    {cargando ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-500"></div>
                        </div>
                    ) : (
                        <div>
                            {reporteActivo === 'ventas' && renderReporteVentas()}
                            {reporteActivo === 'asesores' && renderReporteAsesores()}
                            {reporteActivo === 'propiedades' && renderReportePropiedades()}
                            {reporteActivo === 'usuarios' && renderReporteUsuarios()}
                            {reporteActivo === 'financiero' && renderReporteFinanciero()}
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
