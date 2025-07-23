import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import axios from 'axios';
import AdminLayout from '@/Layouts/AdminLayout';

export default function GestionDepartamentos({ auth }) {
    // Estado para los departamentos
    const [departamentos, setDepartamentos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Estado para la paginación
    const [paginacion, setPaginacion] = useState({
        currentPage: 1,
        lastPage: 1,
        perPage: 10,
        total: 0,
    });

    // Estado para los filtros
    const [filtros, setFiltros] = useState({
        busqueda: '',
        estado: '',
        disponibilidad: '',
        precioMin: '',
        precioMax: '',
        destacado: '',
        page: 1,
    });

    // Función para manejar cambios en los filtros
    const handleFiltroChange = (e) => {
        const { name, value } = e.target;
        setFiltros({
            ...filtros,
            [name]: value,
            page: 1, // Resetear la página al cambiar filtros
        });
    };

    // Función para cargar departamentos desde la API
    const cargarDepartamentos = async () => {
        setLoading(true);
        setError(null);

        try {
            // Construir los parámetros de consulta
            const params = new URLSearchParams();
            if (filtros.busqueda) params.append('search', filtros.busqueda);
            if (filtros.estado) params.append('estado', filtros.estado);
            if (filtros.disponibilidad) params.append('disponibilidad', filtros.disponibilidad);
            if (filtros.precioMin) params.append('precio_min', filtros.precioMin);
            if (filtros.precioMax) params.append('precio_max', filtros.precioMax);
            if (filtros.destacado) params.append('destacado', filtros.destacado);
            params.append('page', filtros.page);

            const response = await axios.get(`/api/v1/admin/departamentos?${params.toString()}`);

            if (response.data && response.data.data) {
                setDepartamentos(response.data.data);
                setPaginacion(response.data.pagination || {
                    currentPage: 1,
                    lastPage: 1,
                    perPage: 10,
                    total: response.data.data.length,
                });
            }
        } catch (err) {
            console.error('Error al cargar departamentos:', err);
            setError('No se pudieron cargar los departamentos. Por favor, inténtelo de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    // Cargar departamentos al montar el componente o cuando cambien los filtros
    useEffect(() => {
        cargarDepartamentos();
    }, [filtros]);

    // Cambiar de página
    const cambiarPagina = (nuevaPagina) => {
        if (nuevaPagina > 0 && nuevaPagina <= paginacion.lastPage) {
            setFiltros({
                ...filtros,
                page: nuevaPagina,
            });
        }
    };

    // Función para cambiar el estado de un departamento
    const cambiarEstadoDepartamento = async (id, estadoActual) => {
        try {
            const nuevoEstado = estadoActual === 'activo' ? 'inactivo' : 'activo';

            await axios.patch(`/api/v1/admin/departamentos/${id}/estado`, {
                estado: nuevoEstado
            });

            // Actualizar el estado local
            cargarDepartamentos();
        } catch (err) {
            console.error('Error al cambiar estado del departamento:', err);
            alert('No se pudo cambiar el estado del departamento. Por favor, inténtelo de nuevo.');
        }
    };

    // Función para marcar/desmarcar un departamento como destacado
    const toggleDestacado = async (id, destacadoActual) => {
        try {
            await axios.patch(`/api/v1/admin/departamentos/${id}/destacado`, {
                destacado: !destacadoActual
            });

            // Actualizar el estado local
            cargarDepartamentos();
        } catch (err) {
            console.error('Error al cambiar estado destacado:', err);
            alert('No se pudo cambiar el estado destacado del departamento. Por favor, inténtelo de nuevo.');
        }
    };

    // Función para eliminar un departamento
    const eliminarDepartamento = async (id) => {
        if (!confirm('¿Está seguro de que desea eliminar este departamento? Esta acción no se puede deshacer.')) {
            return;
        }

        try {
            await axios.delete(`/api/v1/admin/departamentos/${id}`);
            cargarDepartamentos();
        } catch (err) {
            console.error('Error al eliminar departamento:', err);
            alert('No se pudo eliminar el departamento. Por favor, inténtelo de nuevo.');
        }
    };

    return (
        <AdminLayout auth={auth} title="Gestión de Departamentos">
            <Head title="Gestión de Departamentos - Inmobiliaria" />

            <div className="py-12 bg-gray-100">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">Gestión de Departamentos</h2>
                                <Link
                                    href="/admin/departamentos/crear"
                                    className="px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 focus:outline-none focus:border-indigo-700 focus:ring focus:ring-indigo-200 active:bg-indigo-700 transition"
                                >
                                    Agregar Departamento
                                </Link>
                            </div>

                            {/* Filtros */}
                            <div className="mb-6 bg-gray-50 p-4 rounded-lg">
                                <h3 className="text-lg font-medium text-gray-700 mb-3">Filtros</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label htmlFor="busqueda" className="block text-sm font-medium text-gray-700 mb-1">
                                            Búsqueda
                                        </label>
                                        <input
                                            type="text"
                                            id="busqueda"
                                            name="busqueda"
                                            value={filtros.busqueda}
                                            onChange={handleFiltroChange}
                                            placeholder="Buscar por título, dirección..."
                                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                        />
                                    </div>

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
                                            <option value="">Todos</option>
                                            <option value="activo">Activo</option>
                                            <option value="inactivo">Inactivo</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label htmlFor="disponibilidad" className="block text-sm font-medium text-gray-700 mb-1">
                                            Disponibilidad
                                        </label>
                                        <select
                                            id="disponibilidad"
                                            name="disponibilidad"
                                            value={filtros.disponibilidad}
                                            onChange={handleFiltroChange}
                                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                        >
                                            <option value="">Todos</option>
                                            <option value="disponible">Disponible</option>
                                            <option value="reservado">Reservado</option>
                                            <option value="vendido">Vendido</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label htmlFor="precioMin" className="block text-sm font-medium text-gray-700 mb-1">
                                            Precio Mínimo
                                        </label>
                                        <input
                                            type="number"
                                            id="precioMin"
                                            name="precioMin"
                                            value={filtros.precioMin}
                                            onChange={handleFiltroChange}
                                            placeholder="Ej: 50000"
                                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="precioMax" className="block text-sm font-medium text-gray-700 mb-1">
                                            Precio Máximo
                                        </label>
                                        <input
                                            type="number"
                                            id="precioMax"
                                            name="precioMax"
                                            value={filtros.precioMax}
                                            onChange={handleFiltroChange}
                                            placeholder="Ej: 300000"
                                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="destacado" className="block text-sm font-medium text-gray-700 mb-1">
                                            Destacado
                                        </label>
                                        <select
                                            id="destacado"
                                            name="destacado"
                                            value={filtros.destacado}
                                            onChange={handleFiltroChange}
                                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                        >
                                            <option value="">Todos</option>
                                            <option value="1">Destacados</option>
                                            <option value="0">No destacados</option>
                                        </select>
                                    </div>

                                    <div className="md:col-span-3 flex justify-end">
                                        <button
                                            onClick={() => setFiltros({
                                                busqueda: '',
                                                estado: '',
                                                disponibilidad: '',
                                                precioMin: '',
                                                precioMax: '',
                                                destacado: '',
                                                page: 1,
                                            })}
                                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 mr-2"
                                        >
                                            Limpiar Filtros
                                        </button>
                                        <button
                                            onClick={() => cargarDepartamentos()}
                                            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        >
                                            Aplicar Filtros
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {error && (
                                <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
                                    <p>{error}</p>
                                </div>
                            )}

                            {/* Tabla de departamentos */}
                            {loading ? (
                                <div className="flex justify-center items-center py-10">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
                                    <p className="ml-3 text-gray-600">Cargando departamentos...</p>
                                </div>
                            ) : (
                                <>
                                    {departamentos.length === 0 ? (
                                        <div className="text-center py-10">
                                            <p className="text-gray-500">No se encontraron departamentos con los filtros seleccionados.</p>
                                        </div>
                                    ) : (
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Título / Ubicación
                                                        </th>
                                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Precio
                                                        </th>
                                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Características
                                                        </th>
                                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Estado
                                                        </th>
                                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Destacado
                                                        </th>
                                                        <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Acciones
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {departamentos.map((departamento) => (
                                                        <tr key={departamento.id}>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <div className="flex items-center">
                                                                    {departamento.imagen_principal ? (
                                                                        <img
                                                                            src={departamento.imagen_principal.url}
                                                                            alt={departamento.titulo}
                                                                            className="h-10 w-10 rounded-md object-cover mr-3"
                                                                        />
                                                                    ) : (
                                                                        <div className="h-10 w-10 rounded-md bg-gray-200 flex items-center justify-center mr-3">
                                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                                            </svg>
                                                                        </div>
                                                                    )}
                                                                    <div>
                                                                        <div className="text-sm font-medium text-gray-900">{departamento.titulo}</div>
                                                                        <div className="text-sm text-gray-500">{departamento.direccion}</div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <div className="text-sm text-gray-900">S/. {departamento.precio.toLocaleString()}</div>
                                                                <div className="text-xs text-gray-500">{departamento.moneda || 'PEN'}</div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <div className="text-sm text-gray-900">
                                                                    <span className="mr-2">{departamento.habitaciones} Hab.</span>
                                                                    <span className="mr-2">{departamento.banos} Baños</span>
                                                                    <span>{departamento.area_total} m²</span>
                                                                </div>
                                                                <div className="text-xs text-gray-500">
                                                                    {departamento.disponibilidad}
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <span
                                                                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                                        departamento.estado === 'activo'
                                                                            ? 'bg-green-100 text-green-800'
                                                                            : 'bg-red-100 text-red-800'
                                                                    }`}
                                                                >
                                                                    {departamento.estado === 'activo' ? 'Activo' : 'Inactivo'}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                                {departamento.destacado ? (
                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500 mx-auto" fill="currentColor" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                                                    </svg>
                                                                ) : (
                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                                                    </svg>
                                                                )}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                                                <div className="flex justify-center space-x-2">
                                                                    <Link
                                                                        href={`/admin/departamentos/${departamento.id}/editar`}
                                                                        className="text-indigo-600 hover:text-indigo-900"
                                                                        title="Editar"
                                                                    >
                                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                                                        </svg>
                                                                    </Link>

                                                                    <button
                                                                        onClick={() => cambiarEstadoDepartamento(departamento.id, departamento.estado)}
                                                                        className={departamento.estado === 'activo' ? "text-red-600 hover:text-red-900" : "text-green-600 hover:text-green-900"}
                                                                        title={departamento.estado === 'activo' ? "Desactivar" : "Activar"}
                                                                    >
                                                                        {departamento.estado === 'activo' ? (
                                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                                                <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
                                                                            </svg>
                                                                        ) : (
                                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                                            </svg>
                                                                        )}
                                                                    </button>

                                                                    <button
                                                                        onClick={() => toggleDestacado(departamento.id, departamento.destacado)}
                                                                        className={departamento.destacado ? "text-gray-600 hover:text-gray-900" : "text-yellow-600 hover:text-yellow-900"}
                                                                        title={departamento.destacado ? "Quitar destacado" : "Marcar como destacado"}
                                                                    >
                                                                        {departamento.destacado ? (
                                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                                            </svg>
                                                                        ) : (
                                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                                            </svg>
                                                                        )}
                                                                    </button>

                                                                    <button
                                                                        onClick={() => eliminarDepartamento(departamento.id)}
                                                                        className="text-red-600 hover:text-red-900"
                                                                        title="Eliminar"
                                                                    >
                                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                                        </svg>
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}

                                    {/* Paginación */}
                                    {departamentos.length > 0 && (
                                        <div className="mt-4 flex justify-between items-center">
                                            <div className="text-sm text-gray-700">
                                                Mostrando <span className="font-medium">{(paginacion.currentPage - 1) * paginacion.perPage + 1}</span> a <span className="font-medium">{Math.min(paginacion.currentPage * paginacion.perPage, paginacion.total)}</span> de <span className="font-medium">{paginacion.total}</span> resultados
                                            </div>
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => cambiarPagina(paginacion.currentPage - 1)}
                                                    disabled={paginacion.currentPage === 1}
                                                    className={`px-3 py-1 rounded-md ${
                                                        paginacion.currentPage === 1
                                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                            : 'bg-white text-gray-700 hover:bg-gray-50'
                                                    } border border-gray-300`}
                                                >
                                                    Anterior
                                                </button>
                                                <button
                                                    onClick={() => cambiarPagina(paginacion.currentPage + 1)}
                                                    disabled={paginacion.currentPage === paginacion.lastPage}
                                                    className={`px-3 py-1 rounded-md ${
                                                        paginacion.currentPage === paginacion.lastPage
                                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                            : 'bg-white text-gray-700 hover:bg-gray-50'
                                                    } border border-gray-300`}
                                                >
                                                    Siguiente
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
