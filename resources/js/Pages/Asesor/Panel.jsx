import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import AsesorLayout from '@/components/asesor/AsesorLayout';
import axios from 'axios';

export default function PanelAsesor({ auth }) {
    // Estados para manejar datos
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [resumen, setResumen] = useState({
        total_clientes: 0,
        clientes_nuevos: 0,
        propiedades_activas: 0,
        visitas_programadas: 0,
        cotizaciones_pendientes: 0,
        ventas_mes: 0,
        alquileres_mes: 0,
        comisiones_mes: 0
    });

    // Estado para clientes recientes
    const [clientesRecientes, setClientesRecientes] = useState([]);

    // Estado para próximas visitas
    const [proximasVisitas, setProximasVisitas] = useState([]);

    // Estado para cotizaciones pendientes
    const [cotizacionesPendientes, setCotizacionesPendientes] = useState([]);

    // Cargar datos del panel
    useEffect(() => {
        const cargarDatosPanelAsesor = async () => {
            try {
                setLoading(true);
                setError(null);

                // Cargar resumen de datos
                const resumenResponse = await axios.get('/api/v1/asesor/panel/resumen');
                setResumen(resumenResponse.data);

                // Cargar clientes recientes
                const clientesResponse = await axios.get('/api/v1/asesor/clientes/recientes');
                setClientesRecientes(clientesResponse.data);

                // Cargar próximas visitas
                const visitasResponse = await axios.get('/api/v1/asesor/visitas/proximas');
                setProximasVisitas(visitasResponse.data);

                // Cargar cotizaciones pendientes
                const cotizacionesResponse = await axios.get('/api/v1/asesor/cotizaciones/pendientes');
                setCotizacionesPendientes(cotizacionesResponse.data);
            } catch (err) {
                console.error('Error al cargar datos del panel:', err);
                setError('No se pudieron cargar los datos. Por favor, inténtelo de nuevo.');
            } finally {
                setLoading(false);
            }
        };

        cargarDatosPanelAsesor();
    }, []);

    // Formatear fecha
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';

        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Formatear hora
    const formatTime = (dateString) => {
        if (!dateString) return '';

        const date = new Date(dateString);
        return date.toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Formatear moneda
    const formatCurrency = (amount) => {
        if (amount === null || amount === undefined) return 'S/ 0.00';

        return new Intl.NumberFormat('es-PE', {
            style: 'currency',
            currency: 'PEN',
            minimumFractionDigits: 2
        }).format(amount);
    };

    // Si está cargando, mostrar un spinner
    if (loading) {
        return (
            <AsesorLayout auth={auth} title="Panel de Asesor">
                <Head title="Panel de Asesor - Inmobiliaria" />
                <div className="py-12 bg-gray-100">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
                            <span className="ml-3 text-gray-700">Cargando información del panel...</span>
                        </div>
                    </div>
                </div>
            </AsesorLayout>
        );
    }

    return (
        <AsesorLayout auth={auth} title="Panel de Asesor">
            <Head title="Panel de Asesor - Inmobiliaria" />

            <div className="py-12 bg-gray-100">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Mensaje de bienvenida */}
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <div className="sm:flex sm:items-center sm:justify-between">
                            <div>
                                <h3 className="text-lg leading-6 font-medium text-gray-900">
                                    Bienvenido, {auth.user.name}
                                </h3>
                                <p className="mt-2 max-w-4xl text-sm text-gray-500">
                                    Este es tu panel de control. Aquí puedes ver un resumen de tus clientes, propiedades, visitas programadas y más.
                                </p>
                            </div>
                            <div className="mt-5 sm:mt-0 sm:ml-6 sm:flex-shrink-0 sm:flex sm:items-center">
                                <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                    Activo
                                </span>
                            </div>
                        </div>
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

                    {/* Tarjetas de estadísticas */}
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-6">
                        {/* Clientes */}
                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                                        <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">
                                                Total Clientes
                                            </dt>
                                            <dd>
                                                <div className="text-lg font-medium text-gray-900">
                                                    {resumen.total_clientes}
                                                </div>
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-5 py-3">
                                <div className="text-sm">
                                    <Link
                                        href="/asesor/clientes"
                                        className="font-medium text-indigo-600 hover:text-indigo-900"
                                    >
                                        Ver todos
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Propiedades activas */}
                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                                        <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                        </svg>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">
                                                Propiedades Activas
                                            </dt>
                                            <dd>
                                                <div className="text-lg font-medium text-gray-900">
                                                    {resumen.propiedades_activas}
                                                </div>
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-5 py-3">
                                <div className="text-sm">
                                    <Link
                                        href="/asesor/propiedades"
                                        className="font-medium text-indigo-600 hover:text-indigo-900"
                                    >
                                        Ver todas
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Visitas programadas */}
                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                                        <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">
                                                Visitas Programadas
                                            </dt>
                                            <dd>
                                                <div className="text-lg font-medium text-gray-900">
                                                    {resumen.visitas_programadas}
                                                </div>
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-5 py-3">
                                <div className="text-sm">
                                    <Link
                                        href="/asesor/visitas"
                                        className="font-medium text-indigo-600 hover:text-indigo-900"
                                    >
                                        Ver todas
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Cotizaciones Pendientes */}
                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                                        <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">
                                                Cotizaciones Pendientes
                                            </dt>
                                            <dd>
                                                <div className="text-lg font-medium text-gray-900">
                                                    {resumen.cotizaciones_pendientes}
                                                </div>
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-5 py-3">
                                <div className="text-sm">
                                    <Link
                                        href="/asesor/cotizaciones"
                                        className="font-medium text-indigo-600 hover:text-indigo-900"
                                    >
                                        Ver todas
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Rendimiento del mes */}
                    <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
                        <div className="px-4 py-5 sm:px-6">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">
                                Rendimiento del Mes
                            </h3>
                            <p className="mt-1 max-w-2xl text-sm text-gray-500">
                                Resumen de ventas, alquileres y comisiones del mes actual.
                            </p>
                        </div>
                        <div className="border-t border-gray-200">
                            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200">
                                <div className="p-6 text-center">
                                    <p className="text-sm font-medium text-gray-500">Ventas Realizadas</p>
                                    <p className="mt-2 text-3xl font-semibold text-gray-900">{resumen.ventas_mes}</p>
                                </div>
                                <div className="p-6 text-center">
                                    <p className="text-sm font-medium text-gray-500">Alquileres Realizados</p>
                                    <p className="mt-2 text-3xl font-semibold text-gray-900">{resumen.alquileres_mes}</p>
                                </div>
                                <div className="p-6 text-center">
                                    <p className="text-sm font-medium text-gray-500">Comisiones Generadas</p>
                                    <p className="mt-2 text-3xl font-semibold text-gray-900">{formatCurrency(resumen.comisiones_mes)}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Grilla de contenido */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Clientes recientes */}
                        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                                <div>
                                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                                        Clientes Recientes
                                    </h3>
                                    <p className="mt-1 max-w-2xl text-sm text-gray-500">
                                        Últimos clientes asignados a tu cartera.
                                    </p>
                                </div>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                    {resumen.clientes_nuevos} nuevos
                                </span>
                            </div>
                            <div className="border-t border-gray-200">
                                {clientesRecientes.length === 0 ? (
                                    <div className="px-4 py-5 text-center text-gray-500">
                                        No hay clientes recientes para mostrar.
                                    </div>
                                ) : (
                                    <ul className="divide-y divide-gray-200">
                                        {clientesRecientes.map((cliente) => (
                                            <li key={cliente.id}>
                                                <div className="px-4 py-4 flex items-center hover:bg-gray-50">
                                                    <div className="min-w-0 flex-1 flex items-center">
                                                        <div className="flex-shrink-0">
                                                            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold">
                                                                {cliente.nombre.charAt(0).toUpperCase()}
                                                            </div>
                                                        </div>
                                                        <div className="min-w-0 flex-1 px-4">
                                                            <div>
                                                                <p className="text-sm font-medium text-indigo-600 truncate">
                                                                    {cliente.nombre} {cliente.apellido}
                                                                </p>
                                                                <p className="mt-1 text-sm text-gray-500">
                                                                    {cliente.email}
                                                                </p>
                                                                <p className="mt-1 text-xs text-gray-400">
                                                                    Asignado: {formatDate(cliente.fecha_asignacion)}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <Link
                                                            href={`/asesor/clientes/${cliente.id}`}
                                                            className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                        >
                                                            Ver
                                                        </Link>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                                {clientesRecientes.length > 0 && (
                                    <div className="bg-gray-50 px-4 py-3 text-right">
                                        <Link
                                            href="/asesor/clientes"
                                            className="text-sm font-medium text-indigo-600 hover:text-indigo-900"
                                        >
                                            Ver todos los clientes
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Próximas Visitas */}
                        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                            <div className="px-4 py-5 sm:px-6">
                                <h3 className="text-lg leading-6 font-medium text-gray-900">
                                    Próximas Visitas
                                </h3>
                                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                                    Visitas programadas para los próximos días.
                                </p>
                            </div>
                            <div className="border-t border-gray-200">
                                {proximasVisitas.length === 0 ? (
                                    <div className="px-4 py-5 text-center text-gray-500">
                                        No hay visitas programadas para los próximos días.
                                    </div>
                                ) : (
                                    <ul className="divide-y divide-gray-200">
                                        {proximasVisitas.map((visita) => (
                                            <li key={visita.id}>
                                                <div className="px-4 py-4 hover:bg-gray-50">
                                                    <div className="flex items-center justify-between">
                                                        <p className="text-sm font-medium text-indigo-600 truncate">
                                                            {visita.cliente_nombre}
                                                        </p>
                                                        <div className="ml-2 flex-shrink-0 flex">
                                                            <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                                {visita.estado}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="mt-2 flex justify-between">
                                                        <div className="sm:flex">
                                                            <p className="flex items-center text-sm text-gray-500">
                                                                <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                                                </svg>
                                                                {visita.propiedad_direccion}
                                                            </p>
                                                        </div>
                                                        <div className="ml-2 flex items-center text-sm text-gray-500">
                                                            <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                                            </svg>
                                                            <p>
                                                                {formatDate(visita.fecha)} <span className="text-indigo-600">{formatTime(visita.fecha)}</span>
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="mt-2 flex justify-end">
                                                        <Link
                                                            href={`/asesor/visitas/${visita.id}`}
                                                            className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                        >
                                                            Detalles
                                                        </Link>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                                {proximasVisitas.length > 0 && (
                                    <div className="bg-gray-50 px-4 py-3 text-right">
                                        <Link
                                            href="/asesor/visitas"
                                            className="text-sm font-medium text-indigo-600 hover:text-indigo-900"
                                        >
                                            Ver todas las visitas
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Cotizaciones Pendientes */}
                        <div className="bg-white shadow overflow-hidden sm:rounded-lg lg:col-span-2">
                            <div className="px-4 py-5 sm:px-6">
                                <h3 className="text-lg leading-6 font-medium text-gray-900">
                                    Cotizaciones Pendientes
                                </h3>
                                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                                    Cotizaciones que requieren seguimiento.
                                </p>
                            </div>
                            <div className="border-t border-gray-200">
                                {cotizacionesPendientes.length === 0 ? (
                                    <div className="px-4 py-5 text-center text-gray-500">
                                        No hay cotizaciones pendientes para mostrar.
                                    </div>
                                ) : (
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
                                                        Monto
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Fecha
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Estado
                                                    </th>
                                                    <th scope="col" className="relative px-6 py-3">
                                                        <span className="sr-only">Acciones</span>
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {cotizacionesPendientes.map((cotizacion) => (
                                                    <tr key={cotizacion.id} className="hover:bg-gray-50">
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                <div className="flex-shrink-0 h-10 w-10">
                                                                    <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold">
                                                                        {cotizacion.cliente_nombre.charAt(0).toUpperCase()}
                                                                    </div>
                                                                </div>
                                                                <div className="ml-4">
                                                                    <div className="text-sm font-medium text-gray-900">
                                                                        {cotizacion.cliente_nombre}
                                                                    </div>
                                                                    <div className="text-sm text-gray-500">
                                                                        {cotizacion.cliente_email}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm text-gray-900">{cotizacion.propiedad_titulo}</div>
                                                            <div className="text-sm text-gray-500">{cotizacion.propiedad_tipo}</div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm text-gray-900">{formatCurrency(cotizacion.monto)}</div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {formatDate(cotizacion.fecha)}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                                                {cotizacion.estado}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                            <Link
                                                                href={`/asesor/cotizaciones/${cotizacion.id}`}
                                                                className="text-indigo-600 hover:text-indigo-900"
                                                            >
                                                                Ver detalles
                                                            </Link>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                                {cotizacionesPendientes.length > 0 && (
                                    <div className="bg-gray-50 px-4 py-3 text-right">
                                        <Link
                                            href="/asesor/cotizaciones"
                                            className="text-sm font-medium text-indigo-600 hover:text-indigo-900"
                                        >
                                            Ver todas las cotizaciones
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AsesorLayout>
    );
}
