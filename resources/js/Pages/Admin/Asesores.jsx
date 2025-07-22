import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/components/admin/AdminLayout';
import axios from 'axios';

export default function Asesores({ auth }) {
    // Estados para los asesores y filtros
    const [asesores, setAsesores] = useState([]);
    const [filtros, setFiltros] = useState({
        busqueda: '',
        estado: '',
        especialidad: ''
    });
    const [ordenamiento, setOrdenamiento] = useState({
        campo: 'created_at',
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

    // Estados para manejo del modal de eliminación
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [asesorAEliminar, setAsesorAEliminar] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    // Especialidades disponibles para el filtro
    const especialidades = ['Ventas', 'Alquileres', 'Propiedades de lujo', 'Comercial', 'Residencial'];

    // Cargar asesores al montar el componente o cuando cambian los filtros
    useEffect(() => {
        cargarAsesores();
    }, [filtros, ordenamiento, paginacion.pagina_actual]);

    // Función para cargar asesores desde la API
    const cargarAsesores = async () => {
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
            const response = await axios.get('/api/v1/admin/asesores', { params });

            // Actualizar el estado con los datos recibidos
            if (response.data) {
                setAsesores(response.data.data);
                setPaginacion({
                    pagina_actual: response.data.current_page,
                    por_pagina: response.data.per_page,
                    total: response.data.total,
                    total_paginas: response.data.last_page
                });
            }
        } catch (err) {
            console.error('Error al cargar asesores:', err);
            setError('No se pudieron cargar los asesores. Por favor, inténtelo de nuevo.');
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
            especialidad: ''
        });
        setPaginacion({
            ...paginacion,
            pagina_actual: 1
        });
    };

    // Manejar la búsqueda
    const handleBusqueda = (e) => {
        e.preventDefault();
        cargarAsesores();
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

    // Abrir modal de confirmación para eliminar asesor
    const confirmarEliminar = (asesor) => {
        setAsesorAEliminar(asesor);
        setShowDeleteModal(true);
    };

    // Cancelar la eliminación
    const cancelarEliminar = () => {
        setShowDeleteModal(false);
        setAsesorAEliminar(null);
    };

    // Eliminar asesor
    const eliminarAsesor = async () => {
        if (!asesorAEliminar) return;

        try {
            setDeleteLoading(true);

            // Llamada a la API para eliminar el asesor
            await axios.delete(`/api/v1/admin/asesores/${asesorAEliminar.id}`);

            // Cerrar el modal y recargar la lista
            setShowDeleteModal(false);
            setAsesorAEliminar(null);

            // Recargar la lista de asesores
            cargarAsesores();
        } catch (err) {
            console.error('Error al eliminar asesor:', err);
            setError('No se pudo eliminar el asesor. Por favor, inténtelo de nuevo.');
        } finally {
            setDeleteLoading(false);
        }
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

    return (
        <AdminLayout auth={auth} title="Asesores">
            <Head title="Asesores - Inmobiliaria" />

            <div className="py-12 bg-gray-100">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Encabezado con botón de añadir */}
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">
                            Asesores
                        </h2>
                        <Link
                            href="/admin/asesores/crear"
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                            Añadir Asesor
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

                                {/* Filtro por especialidad */}
                                <div>
                                    <label htmlFor="especialidad" className="block text-sm font-medium text-gray-700 mb-1">
                                        Especialidad
                                    </label>
                                    <select
                                        id="especialidad"
                                        name="especialidad"
                                        value={filtros.especialidad}
                                        onChange={handleFiltroChange}
                                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                    >
                                        <option value="">Todas las especialidades</option>
                                        {especialidades.map((especialidad) => (
                                            <option key={especialidad} value={especialidad}>
                                                {especialidad}
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
                                        <option value="vacaciones">Vacaciones</option>
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

                    {/* Tabla de asesores */}
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
                                                Nombre
                                                {ordenamiento.campo === 'nombre' && (
                                                    <span className="ml-1">
                                                        {ordenamiento.direccion === 'asc' ? '↑' : '↓'}
                                                    </span>
                                                )}
                                            </div>
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                            onClick={() => cambiarOrdenamiento('documento')}
                                        >
                                            <div className="flex items-center">
                                                Documento
                                                {ordenamiento.campo === 'documento' && (
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
                                            onClick={() => cambiarOrdenamiento('especialidad')}
                                        >
                                            <div className="flex items-center">
                                                Especialidad
                                                {ordenamiento.campo === 'especialidad' && (
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
                                            onClick={() => cambiarOrdenamiento('created_at')}
                                        >
                                            <div className="flex items-center">
                                                Fecha registro
                                                {ordenamiento.campo === 'created_at' && (
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
                                            <td colSpan="7" className="px-6 py-4 text-center">
                                                <div className="flex justify-center items-center">
                                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-500"></div>
                                                    <span className="ml-2">Cargando...</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : asesores.length === 0 ? (
                                        <tr>
                                            <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                                                No se encontraron asesores con los filtros seleccionados.
                                            </td>
                                        </tr>
                                    ) : (
                                        asesores.map((asesor) => (
                                            <tr key={asesor.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-10 w-10">
                                                            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold">
                                                                {asesor.nombre.charAt(0).toUpperCase()}
                                                            </div>
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {asesor.nombre} {asesor.apellido}
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                {asesor.codigo || 'N/A'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {asesor.tipo_documento}: {asesor.documento}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">{asesor.email}</div>
                                                    <div className="text-sm text-gray-500">{asesor.telefono}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {asesor.especialidad || 'General'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEstadoColor(asesor.estado)}`}>
                                                        {asesor.estado}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {formatDate(asesor.created_at)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex justify-end space-x-2">
                                                        <Link
                                                            href={`/admin/asesores/${asesor.id}`}
                                                            className="text-indigo-600 hover:text-indigo-900"
                                                            title="Ver detalles"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                            </svg>
                                                        </Link>
                                                        <Link
                                                            href={`/admin/asesores/${asesor.id}/editar`}
                                                            className="text-blue-600 hover:text-blue-900"
                                                            title="Editar"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                            </svg>
                                                        </Link>
                                                        <button
                                                            onClick={() => confirmarEliminar(asesor)}
                                                            className="text-red-600 hover:text-red-900"
                                                            title="Eliminar"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                        </button>
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

            {/* Modal de confirmación de eliminación */}
            {showDeleteModal && (
                <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>

                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                        <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                    </div>
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                            Eliminar asesor
                                        </h3>
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-500">
                                                ¿Está seguro de que desea eliminar al asesor{' '}
                                                <span className="font-semibold">{asesorAEliminar?.nombre} {asesorAEliminar?.apellido}</span>?
                                                Esta acción no se puede deshacer.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    type="button"
                                    onClick={eliminarAsesor}
                                    disabled={deleteLoading}
                                    className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm ${
                                        deleteLoading ? 'opacity-75 cursor-not-allowed' : ''
                                    }`}
                                >
                                    {deleteLoading ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Eliminando...
                                        </>
                                    ) : (
                                        'Eliminar'
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={cancelarEliminar}
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
