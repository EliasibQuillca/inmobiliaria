import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import axios from 'axios';

export default function DetalleAsesor({ auth, id }) {
    // Estados para manejar la carga y datos del asesor
    const [asesor, setAsesor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Estados para estadísticas
    const [estadisticas, setEstadisticas] = useState({
        total_clientes: 0,
        propiedades_vendidas: 0,
        propiedades_alquiladas: 0,
        comisiones_totales: 0,
    });

    // Estado para el historial de actividades
    const [actividades, setActividades] = useState([]);
    const [loadingActividades, setLoadingActividades] = useState(true);

    // Estado para clientes asignados
    const [clientes, setClientes] = useState([]);
    const [loadingClientes, setLoadingClientes] = useState(true);

    // Cargar datos del asesor
    useEffect(() => {
        const cargarAsesor = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await axios.get(`/api/v1/admin/asesores/${id}`);
                setAsesor(response.data);

                // Cargar estadísticas
                await cargarEstadisticas();

                // Cargar actividades
                await cargarActividades();

                // Cargar clientes
                await cargarClientes();
            } catch (err) {
                console.error('Error al cargar el asesor:', err);
                setError('No se pudo cargar la información del asesor. Por favor, inténtelo de nuevo.');
            } finally {
                setLoading(false);
            }
        };

        cargarAsesor();
    }, [id]);

    // Cargar estadísticas del asesor
    const cargarEstadisticas = async () => {
        try {
            const response = await axios.get(`/api/v1/admin/asesores/${id}/estadisticas`);
            setEstadisticas(response.data);
        } catch (err) {
            console.error('Error al cargar estadísticas:', err);
            // No establecer error global para permitir que la página se cargue parcialmente
        }
    };

    // Cargar historial de actividades
    const cargarActividades = async () => {
        try {
            setLoadingActividades(true);
            const response = await axios.get(`/api/v1/admin/asesores/${id}/actividades`);
            setActividades(response.data);
        } catch (err) {
            console.error('Error al cargar actividades:', err);
        } finally {
            setLoadingActividades(false);
        }
    };

    // Cargar clientes asignados
    const cargarClientes = async () => {
        try {
            setLoadingClientes(true);
            const response = await axios.get(`/api/v1/admin/asesores/${id}/clientes`);
            setClientes(response.data);
        } catch (err) {
            console.error('Error al cargar clientes:', err);
        } finally {
            setLoadingClientes(false);
        }
    };

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
        if (amount === null || amount === undefined) return 'N/A';

        return new Intl.NumberFormat('es-PE', {
            style: 'currency',
            currency: 'PEN',
            minimumFractionDigits: 2
        }).format(amount);
    };

    // Función para dar color al estado del asesor
    const getEstadoColor = (estado) => {
        switch (estado) {
            case 'activo':
                return 'bg-green-100 text-green-800';
            case 'inactivo':
                return 'bg-red-100 text-red-800';
            case 'vacaciones':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Si está cargando, mostrar un spinner
    if (loading) {
        return (
            <AdminLayout auth={auth} title="Detalle del Asesor">
                <Head title="Detalle del Asesor - Inmobiliaria" />
                <div className="py-12 bg-gray-100">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
                            <span className="ml-3 text-gray-700">Cargando información del asesor...</span>
                        </div>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    // Si hay un error, mostrar mensaje
    if (error) {
        return (
            <AdminLayout auth={auth} title="Detalle del Asesor">
                <Head title="Detalle del Asesor - Inmobiliaria Imperial Cusco" />
                <div className="py-12 bg-gray-100">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex items-center text-red-600">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                <h2 className="text-xl font-semibold">Error</h2>
                            </div>
                            <p className="mt-2 text-gray-600">{error}</p>
                            <div className="mt-4">
                                <Link
                                    href="/admin/asesores"
                                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Volver a la lista de asesores
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout auth={auth} title="Detalle del Asesor">
            <Head title={`${asesor.nombre} ${asesor.apellido} - Asesor - Inmobiliaria Imperial Cusco`} />

            <div className="py-12 bg-gray-100">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Encabezado con botones de acción */}
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">
                            Detalle del Asesor
                        </h2>
                        <div className="flex space-x-3">
                            <Link
                                href={`/admin/asesores/${id}/editar`}
                                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Editar Asesor
                            </Link>
                            <Link
                                href="/admin/asesores"
                                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Volver a Asesores
                            </Link>
                        </div>
                    </div>

                    {/* Información general */}
                    <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
                        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                            <div>
                                <h3 className="text-lg leading-6 font-medium text-gray-900">
                                    Información del Asesor
                                </h3>
                                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                                    Detalles personales y profesionales.
                                </p>
                            </div>
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getEstadoColor(asesor.estado)}`}>
                                {asesor.estado.charAt(0).toUpperCase() + asesor.estado.slice(1)}
                            </span>
                        </div>
                        <div className="border-t border-gray-200">
                            <dl>
                                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">
                                        Nombre completo
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        {asesor.nombre} {asesor.apellido}
                                    </dd>
                                </div>
                                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">
                                        Código de asesor
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        {asesor.codigo || 'No asignado'}
                                    </dd>
                                </div>
                                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">
                                        Documento de identidad
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        {asesor.tipo_documento}: {asesor.documento}
                                    </dd>
                                </div>
                                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">
                                        Email
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        {asesor.email}
                                    </dd>
                                </div>
                                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">
                                        Teléfono
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        {asesor.telefono}
                                    </dd>
                                </div>
                                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">
                                        Dirección
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        {asesor.direccion || 'No registrada'}
                                    </dd>
                                </div>
                                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">
                                        Especialidad
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        {asesor.especialidad || 'General'}
                                    </dd>
                                </div>
                                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">
                                        Comisión (%)
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        {asesor.comision ? `${asesor.comision}%` : 'No establecida'}
                                    </dd>
                                </div>
                                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">
                                        Fecha de registro
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        {formatDate(asesor.created_at)}
                                    </dd>
                                </div>
                                {asesor.notas && (
                                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">
                                            Notas
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                            {asesor.notas}
                                        </dd>
                                    </div>
                                )}
                            </dl>
                        </div>
                    </div>

                    {/* Estadísticas */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="px-4 py-5 sm:p-6">
                                <dt className="text-sm font-medium text-gray-500 truncate">
                                    Total de Clientes
                                </dt>
                                <dd className="mt-1 text-3xl font-semibold text-gray-900">
                                    {estadisticas.total_clientes}
                                </dd>
                            </div>
                        </div>
                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="px-4 py-5 sm:p-6">
                                <dt className="text-sm font-medium text-gray-500 truncate">
                                    Propiedades Vendidas
                                </dt>
                                <dd className="mt-1 text-3xl font-semibold text-gray-900">
                                    {estadisticas.propiedades_vendidas}
                                </dd>
                            </div>
                        </div>
                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="px-4 py-5 sm:p-6">
                                <dt className="text-sm font-medium text-gray-500 truncate">
                                    Propiedades Alquiladas
                                </dt>
                                <dd className="mt-1 text-3xl font-semibold text-gray-900">
                                    {estadisticas.propiedades_alquiladas}
                                </dd>
                            </div>
                        </div>
                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="px-4 py-5 sm:p-6">
                                <dt className="text-sm font-medium text-gray-500 truncate">
                                    Comisiones Totales
                                </dt>
                                <dd className="mt-1 text-3xl font-semibold text-gray-900">
                                    {formatCurrency(estadisticas.comisiones_totales)}
                                </dd>
                            </div>
                        </div>
                    </div>

                    {/* Clientes Asignados */}
                    <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
                        <div className="px-4 py-5 sm:px-6">
                            <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                                Clientes Asignados
                                <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                                    {clientes.length}
                                </span>
                            </h3>
                            <p className="mt-1 max-w-2xl text-sm text-gray-500">
                                Lista de clientes actualmente asignados a este asesor.
                            </p>
                        </div>
                        <div className="border-t border-gray-200">
                            {loadingClientes ? (
                                <div className="px-4 py-8 text-center text-gray-500">
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-500 mx-auto"></div>
                                    <p className="mt-2">Cargando clientes...</p>
                                </div>
                            ) : clientes.length === 0 ? (
                                <div className="px-4 py-8 text-center text-gray-500">
                                    No hay clientes asignados a este asesor.
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
                                                    Contacto
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Intereses
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Estado
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Fecha asignación
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Acciones
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {clientes.map((cliente) => (
                                                <tr key={cliente.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="flex-shrink-0 h-10 w-10">
                                                                <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold">
                                                                    {cliente.nombre.charAt(0).toUpperCase()}
                                                                </div>
                                                            </div>
                                                            <div className="ml-4">
                                                                <div className="text-sm font-medium text-gray-900">
                                                                    {cliente.nombre} {cliente.apellido}
                                                                </div>
                                                                <div className="text-sm text-gray-500">
                                                                    {cliente.tipo_documento}: {cliente.documento}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900">{cliente.email}</div>
                                                        <div className="text-sm text-gray-500">{cliente.telefono}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {cliente.intereses || 'No especificados'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                            {cliente.estado || 'Activo'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {formatDate(cliente.fecha_asignacion)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <Link
                                                            href={`/admin/clientes/${cliente.id}`}
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
                        </div>
                    </div>

                    {/* Historial de actividades */}
                    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                        <div className="px-4 py-5 sm:px-6">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">
                                Historial de Actividades
                            </h3>
                            <p className="mt-1 max-w-2xl text-sm text-gray-500">
                                Registro de actividades recientes del asesor.
                            </p>
                        </div>
                        <div className="border-t border-gray-200">
                            {loadingActividades ? (
                                <div className="px-4 py-8 text-center text-gray-500">
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-500 mx-auto"></div>
                                    <p className="mt-2">Cargando actividades...</p>
                                </div>
                            ) : actividades.length === 0 ? (
                                <div className="px-4 py-8 text-center text-gray-500">
                                    No hay actividades registradas para este asesor.
                                </div>
                            ) : (
                                <div className="flow-root px-4 py-5">
                                    <ul className="-mb-8">
                                        {actividades.map((actividad, index) => (
                                            <li key={actividad.id}>
                                                <div className="relative pb-8">
                                                    {index !== actividades.length - 1 ? (
                                                        <span className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                                                    ) : null}
                                                    <div className="relative flex items-start space-x-3">
                                                        <div className="relative">
                                                            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center ring-8 ring-white">
                                                                {actividad.tipo === 'venta' && (
                                                                    <svg className="h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                    </svg>
                                                                )}
                                                                {actividad.tipo === 'alquiler' && (
                                                                    <svg className="h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                                                    </svg>
                                                                )}
                                                                {actividad.tipo === 'visita' && (
                                                                    <svg className="h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                                    </svg>
                                                                )}
                                                                {actividad.tipo === 'contacto' && (
                                                                    <svg className="h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                                    </svg>
                                                                )}
                                                                {actividad.tipo === 'sistema' && (
                                                                    <svg className="h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                                    </svg>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="min-w-0 flex-1">
                                                            <div>
                                                                <div className="text-sm">
                                                                    <span className="font-medium text-gray-900">
                                                                        {actividad.titulo}
                                                                    </span>
                                                                </div>
                                                                <p className="mt-0.5 text-sm text-gray-500">
                                                                    {formatDate(actividad.fecha)} a las {formatTime(actividad.fecha)}
                                                                </p>
                                                            </div>
                                                            <div className="mt-2 text-sm text-gray-700">
                                                                <p>{actividad.descripcion}</p>
                                                            </div>
                                                            {actividad.enlace && (
                                                                <div className="mt-2">
                                                                    <Link
                                                                        href={actividad.enlace}
                                                                        className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                                                                    >
                                                                        Ver detalles
                                                                    </Link>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
