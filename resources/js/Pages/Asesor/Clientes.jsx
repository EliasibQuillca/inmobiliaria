import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import AsesorLayout from '@/components/asesor/AsesorLayout';
import axios from 'axios';

export default function ClientesAsesor({ auth }) {
    // Estados para los clientes y filtros
    const [clientes, setClientes] = useState([]);
    const [filtros, setFiltros] = useState({
        busqueda: '',
        estado: '',
        interes: ''
    });
    const [ordenamiento, setOrdenamiento] = useState({
        campo: 'fecha_asignacion',
        direccion: 'desc'
    });
    const [paginacion, setPaginacion] = useState({
        pagina_actual: 1,
        por_pagina: 10,
        total: 0,
        total_paginas: 0
    });

    // Estados para manejo de carga y errores
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Intereses disponibles para el filtro
    const intereses = ['Compra', 'Alquiler', 'Inversión', 'Terreno', 'Casa', 'Departamento', 'Local Comercial'];

    // Cargar clientes al montar el componente o cuando cambian los filtros
    useEffect(() => {
        cargarClientes();
    }, [filtros, ordenamiento, paginacion.pagina_actual]);

    // Función para cargar clientes desde la API
    const cargarClientes = async () => {
        try {
            setLoading(true);
            setError(null);

            // Construir parámetros para la consulta
            const params = {
                page: paginacion.pagina_actual,
                per_page: paginacion.por_pagina,
                sort_by: ordenamiento.campo,
                sort_direction: ordenamiento.direccion,
                ...filtros
            };

            // Realizar la petición a la API
            const response = await axios.get('/api/v1/asesor/clientes', { params });

            // Actualizar el estado con los datos recibidos
            if (response.data) {
                setClientes(response.data.data);
                setPaginacion({
                    pagina_actual: response.data.current_page,
                    por_pagina: response.data.per_page,
                    total: response.data.total,
                    total_paginas: response.data.last_page
                });
            }
        } catch (err) {
            console.error('Error al cargar clientes:', err);
            setError('No se pudieron cargar los clientes. Por favor, inténtelo de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    // Manejar cambios en los filtros
    const handleFiltroChange = (e) => {
        const { name, value } = e.target;
        setFiltros({
            ...filtros,
            [name]: value
        });
        // Resetear la paginación al cambiar filtros
        setPaginacion({
            ...paginacion,
            pagina_actual: 1
        });
    };

    // Limpiar todos los filtros
    const limpiarFiltros = () => {
        setFiltros({
            busqueda: '',
            estado: '',
            interes: ''
        });
        setPaginacion({
            ...paginacion,
            pagina_actual: 1
        });
    };

    // Manejar la búsqueda
    const handleBusqueda = (e) => {
        e.preventDefault();
        cargarClientes();
    };

    // Cambiar el ordenamiento de la tabla
    const cambiarOrdenamiento = (campo) => {
        setOrdenamiento({
            campo,
            direccion: ordenamiento.campo === campo && ordenamiento.direccion === 'asc' ? 'desc' : 'asc'
        });
    };

    // Cambiar la página actual
    const cambiarPagina = (pagina) => {
        if (pagina < 1 || pagina > paginacion.total_paginas) return;

        setPaginacion({
            ...paginacion,
            pagina_actual: pagina
        });
    };

    // Formatear fecha
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Días desde asignación
    const diasDesdeAsignacion = (fechaAsignacion) => {
        const fecha = new Date(fechaAsignacion);
        const hoy = new Date();
        const diferencia = hoy - fecha;
        return Math.floor(diferencia / (1000 * 60 * 60 * 24));
    };

    return (
        <AsesorLayout auth={auth} title="Mis Clientes">
            <Head title="Mis Clientes - Inmobiliaria" />

            <div className="py-12 bg-gray-100">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Encabezado */}
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">
                            Mis Clientes
                        </h2>
                        <Link
                            href="/asesor/panel"
                            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Volver al Panel
                        </Link>
                    </div>

                    {/* Filtros y búsqueda */}
                    <div className="bg-white rounded-md shadow p-4 mb-6">
                        <form onSubmit={handleBusqueda}>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Búsqueda por texto */}
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
                                        placeholder="Nombre, documento, email..."
                                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                    />
                                </div>

                                {/* Filtro por interés */}
                                <div>
                                    <label htmlFor="interes" className="block text-sm font-medium text-gray-700 mb-1">
                                        Interés
                                    </label>
                                    <select
                                        id="interes"
                                        name="interes"
                                        value={filtros.interes}
                                        onChange={handleFiltroChange}
                                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                    >
                                        <option value="">Todos los intereses</option>
                                        {intereses.map((interes) => (
                                            <option key={interes} value={interes}>
                                                {interes}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Filtro por estado */}
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
                                        <option value="">Todos los estados</option>
                                        <option value="activo">Activo</option>
                                        <option value="inactivo">Inactivo</option>
                                        <option value="potencial">Potencial</option>
                                        <option value="comprador">Comprador</option>
                                        <option value="vendedor">Vendedor</option>
                                    </select>
                                </div>
                            </div>

                            {/* Botones de acciones */}
                            <div className="mt-4 flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={limpiarFiltros}
                                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Limpiar filtros
                                </button>
                                <button
                                    type="submit"
                                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                    </svg>
                                    Buscar
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

                    {/* Tabla de clientes */}
                    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                            onClick={() => cambiarOrdenamiento('nombre')}
                                        >
                                            <div className="flex items-center">
                                                Cliente
                                                {ordenamiento.campo === 'nombre' && (
                                                    <span className="ml-1">
                                                        {ordenamiento.direccion === 'asc' ? '↑' : '↓'}
                                                    </span>
                                                )}
                                            </div>
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Contacto
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                            onClick={() => cambiarOrdenamiento('intereses')}
                                        >
                                            <div className="flex items-center">
                                                Intereses
                                                {ordenamiento.campo === 'intereses' && (
                                                    <span className="ml-1">
                                                        {ordenamiento.direccion === 'asc' ? '↑' : '↓'}
                                                    </span>
                                                )}
                                            </div>
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                            onClick={() => cambiarOrdenamiento('estado')}
                                        >
                                            <div className="flex items-center">
                                                Estado
                                                {ordenamiento.campo === 'estado' && (
                                                    <span className="ml-1">
                                                        {ordenamiento.direccion === 'asc' ? '↑' : '↓'}
                                                    </span>
                                                )}
                                            </div>
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                            onClick={() => cambiarOrdenamiento('fecha_asignacion')}
                                        >
                                            <div className="flex items-center">
                                                Asignado
                                                {ordenamiento.campo === 'fecha_asignacion' && (
                                                    <span className="ml-1">
                                                        {ordenamiento.direccion === 'asc' ? '↑' : '↓'}
                                                    </span>
                                                )}
                                            </div>
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Acciones
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {loading ? (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-4 text-center">
                                                <div className="flex justify-center items-center">
                                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-500"></div>
                                                    <span className="ml-2">Cargando...</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : clientes.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                                                No se encontraron clientes con los filtros seleccionados.
                                            </td>
                                        </tr>
                                    ) : (
                                        clientes.map((cliente) => (
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
                                                    {cliente.intereses || 'No especificado'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                        {cliente.estado || 'Activo'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    <span title={formatDate(cliente.fecha_asignacion)}>
                                                        Hace {diasDesdeAsignacion(cliente.fecha_asignacion)} días
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex justify-end space-x-2">
                                                        <Link
                                                            href={`/asesor/clientes/${cliente.id}`}
                                                            className="text-indigo-600 hover:text-indigo-900"
                                                            title="Ver detalles"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                            </svg>
                                                        </Link>
                                                        <Link
                                                            href={`/asesor/clientes/${cliente.id}/contactar`}
                                                            className="text-blue-600 hover:text-blue-900"
                                                            title="Contactar"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                            </svg>
                                                        </Link>
                                                        <Link
                                                            href={`/asesor/clientes/${cliente.id}/agendar-visita`}
                                                            className="text-green-600 hover:text-green-900"
                                                            title="Agendar visita"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                            </svg>
                                                        </Link>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Paginación */}
                    {paginacion.total_paginas > 1 && (
                        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-6 rounded-md shadow">
                            <div className="flex-1 flex justify-between sm:hidden">
                                <button
                                    onClick={() => cambiarPagina(paginacion.pagina_actual - 1)}
                                    disabled={paginacion.pagina_actual === 1}
                                    className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                                        paginacion.pagina_actual === 1
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            : 'bg-white text-gray-700 hover:bg-gray-50'
                                    }`}
                                >
                                    Anterior
                                </button>
                                <button
                                    onClick={() => cambiarPagina(paginacion.pagina_actual + 1)}
                                    disabled={paginacion.pagina_actual === paginacion.total_paginas}
                                    className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                                        paginacion.pagina_actual === paginacion.total_paginas
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            : 'bg-white text-gray-700 hover:bg-gray-50'
                                    }`}
                                >
                                    Siguiente
                                </button>
                            </div>
                            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm text-gray-700">
                                        Mostrando{' '}
                                        <span className="font-medium">
                                            {paginacion.total === 0 ? 0 : (paginacion.pagina_actual - 1) * paginacion.por_pagina + 1}
                                        </span>{' '}
                                        a{' '}
                                        <span className="font-medium">
                                            {Math.min(paginacion.pagina_actual * paginacion.por_pagina, paginacion.total)}
                                        </span>{' '}
                                        de <span className="font-medium">{paginacion.total}</span> resultados
                                    </p>
                                </div>
                                <div>
                                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                        <button
                                            onClick={() => cambiarPagina(paginacion.pagina_actual - 1)}
                                            disabled={paginacion.pagina_actual === 1}
                                            className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                                                paginacion.pagina_actual === 1
                                                    ? 'text-gray-300 cursor-not-allowed'
                                                    : 'text-gray-500 hover:bg-gray-50'
                                            }`}
                                        >
                                            <span className="sr-only">Anterior</span>
                                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </button>

                                        {/* Generación de botones de página */}
                                        {Array.from({ length: paginacion.total_paginas }, (_, i) => i + 1).map((pagina) => {
                                            // Mostrar siempre la primera y la última página
                                            // Para páginas intermedias, mostrar solo las que están cerca de la página actual
                                            const mostrarPagina =
                                                pagina === 1 ||
                                                pagina === paginacion.total_paginas ||
                                                (pagina >= paginacion.pagina_actual - 1 && pagina <= paginacion.pagina_actual + 1);

                                            // Mostrar puntos suspensivos si hay un salto
                                            const mostrarEllipsis =
                                                (pagina === 2 && paginacion.pagina_actual > 3) ||
                                                (pagina === paginacion.total_paginas - 1 && paginacion.pagina_actual < paginacion.total_paginas - 2);

                                            if (mostrarPagina) {
                                                return (
                                                    <button
                                                        key={pagina}
                                                        onClick={() => cambiarPagina(pagina)}
                                                        className={`relative inline-flex items-center px-4 py-2 border ${
                                                            pagina === paginacion.pagina_actual
                                                                ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                                                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                        } text-sm font-medium`}
                                                    >
                                                        {pagina}
                                                    </button>
                                                );
                                            } else if (mostrarEllipsis) {
                                                return (
                                                    <span
                                                        key={`ellipsis-${pagina}`}
                                                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                                                    >
                                                        ...
                                                    </span>
                                                );
                                            }

                                            return null;
                                        })}

                                        <button
                                            onClick={() => cambiarPagina(paginacion.pagina_actual + 1)}
                                            disabled={paginacion.pagina_actual === paginacion.total_paginas}
                                            className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                                                paginacion.pagina_actual === paginacion.total_paginas
                                                    ? 'text-gray-300 cursor-not-allowed'
                                                    : 'text-gray-500 hover:bg-gray-50'
                                            }`}
                                        >
                                            <span className="sr-only">Siguiente</span>
                                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AsesorLayout>
    );
}
