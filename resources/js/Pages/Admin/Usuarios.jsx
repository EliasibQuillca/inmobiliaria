import { Head, Link } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from '@/components/admin/AdminLayout';

export default function GestionUsuarios({ auth }) {
    // Estado para los usuarios
    const [usuarios, setUsuarios] = useState([]);
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
        role: '',
        estado: '',
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

    // Función para cargar usuarios desde la API
    const cargarUsuarios = async () => {
        setLoading(true);
        setError(null);

        try {
            // Construir los parámetros de consulta
            const params = new URLSearchParams();
            if (filtros.busqueda) params.append('search', filtros.busqueda);
            if (filtros.role) params.append('role', filtros.role);
            if (filtros.estado) params.append('status', filtros.estado);
            params.append('page', filtros.page);

            const response = await axios.get(`/api/v1/admin/usuarios?${params.toString()}`);

            if (response.data && response.data.data) {
                setUsuarios(response.data.data);
                setPaginacion(response.data.pagination || {
                    currentPage: 1,
                    lastPage: 1,
                    perPage: 10,
                    total: response.data.data.length,
                });
            }
        } catch (err) {
            console.error('Error al cargar usuarios:', err);
            setError('No se pudieron cargar los usuarios. Por favor, inténtelo de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    // Cambiar de página
    const cambiarPagina = (nuevaPagina) => {
        if (nuevaPagina > 0 && nuevaPagina <= paginacion.lastPage) {
            setFiltros({
                ...filtros,
                page: nuevaPagina,
            });
        }
    };

    // Función para desactivar/activar un usuario
    const toggleEstadoUsuario = async (id, estadoActual) => {
        try {
            const nuevoEstado = estadoActual === 'Activo' ? 'Inactivo' : 'Activo';

            await axios.put(`/api/v1/admin/usuarios/${id}`, {
                estado: nuevoEstado.toLowerCase()
            });

            // Actualizar el estado local
            cargarUsuarios();
        } catch (err) {
            console.error('Error al cambiar estado del usuario:', err);
            alert('No se pudo cambiar el estado del usuario. Por favor, inténtelo de nuevo.');
        }
    };

    // Función para eliminar un usuario
    const eliminarUsuario = async (id) => {
        if (!confirm('¿Está seguro de que desea eliminar este usuario? Esta acción no se puede deshacer.')) {
            return;
        }

        try {
            await axios.delete(`/api/v1/admin/usuarios/${id}`);

            // Actualizar el estado local
            cargarUsuarios();
        } catch (err) {
            console.error('Error al eliminar usuario:', err);
            alert('No se pudo eliminar el usuario. Por favor, inténtelo de nuevo.');
        }
    };

    // Cargar usuarios cuando cambian los filtros
    useEffect(() => {
        cargarUsuarios();
    }, [filtros.page]);

    // Cargar usuarios cuando se cambian los filtros (con debounce para la búsqueda)
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (filtros.page === 1) {
                cargarUsuarios();
            } else {
                setFiltros(prev => ({ ...prev, page: 1 }));
            }
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [filtros.busqueda, filtros.role, filtros.estado]);

    return (
        <AdminLayout auth={auth} title="Gestión de Usuarios">
            <Head title="Gestión de Usuarios - Inmobiliaria" />

            <div className="py-12 bg-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900">
                                Gestión de Usuarios
                            </h2>
                            <p className="mt-1 text-lg text-gray-600">
                                Administre los usuarios del sistema
                            </p>
                        </div>
                        <Link
                            href="/admin/usuarios/crear"
                            className="px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Crear Usuario
                        </Link>
                    </div>

                    {/* Filtros */}
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                                    placeholder="Nombre o correo electrónico"
                                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                />
                            </div>

                            <div>
                                <label htmlFor="rol" className="block text-sm font-medium text-gray-700 mb-1">
                                    Rol
                                </label>
                                <select
                                    id="rol"
                                    name="role"
                                    value={filtros.role}
                                    onChange={handleFiltroChange}
                                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                >
                                    <option value="">Todos los roles</option>
                                    <option value="administrador">Administrador</option>
                                    <option value="asesor">Asesor</option>
                                    <option value="cliente">Cliente</option>
                                </select>
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
                                    <option value="">Todos los estados</option>
                                    <option value="activo">Activo</option>
                                    <option value="inactivo">Inactivo</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Tabla de usuarios */}
                    <div className="bg-white shadow-md rounded-lg overflow-hidden">
                        {loading ? (
                            <div className="py-10 text-center">
                                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-2"></div>
                                <p className="text-gray-600">Cargando usuarios...</p>
                            </div>
                        ) : error ? (
                            <div className="py-10 text-center">
                                <div className="text-red-500 mb-2">❌</div>
                                <p className="text-gray-600">{error}</p>
                                <button
                                    onClick={cargarUsuarios}
                                    className="mt-3 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                                >
                                    Reintentar
                                </button>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Nombre
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Correo Electrónico
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Rol
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Estado
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Fecha de Registro
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Acciones
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {usuarios.length > 0 ? (
                                            usuarios.map((usuario) => (
                                                <tr key={usuario.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="flex-shrink-0 h-10 w-10">
                                                                <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                                                    <span className="font-medium text-indigo-800">
                                                                        {usuario.name.charAt(0)}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <div className="ml-4">
                                                                <div className="text-sm font-medium text-gray-900">
                                                                    {usuario.name}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900">{usuario.email}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                                                            ${usuario.role === 'administrador' ? 'bg-purple-100 text-purple-800' :
                                                              usuario.role === 'asesor' ? 'bg-blue-100 text-blue-800' :
                                                              'bg-green-100 text-green-800'}`}>
                                                            {usuario.role === 'administrador' ? 'Administrador' :
                                                             usuario.role === 'asesor' ? 'Asesor' : 'Cliente'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                                                            ${usuario.estado === 'activo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                            {usuario.estado === 'activo' ? 'Activo' : 'Inactivo'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {new Date(usuario.created_at).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <div className="flex space-x-2 justify-end">
                                                            <Link
                                                                href={`/admin/usuarios/${usuario.id}/editar`}
                                                                className="text-indigo-600 hover:text-indigo-900"
                                                            >
                                                                Editar
                                                            </Link>
                                                            <button
                                                                onClick={() => toggleEstadoUsuario(usuario.id, usuario.estado)}
                                                                className={`${usuario.estado === 'activo' ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}`}
                                                            >
                                                                {usuario.estado === 'activo' ? 'Desactivar' : 'Activar'}
                                                            </button>
                                                            <button
                                                                onClick={() => eliminarUsuario(usuario.id)}
                                                                className="text-gray-600 hover:text-gray-900"
                                                            >
                                                                Eliminar
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                                                    No se encontraron usuarios que coincidan con los filtros.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* Paginación */}
                    {!loading && !error && usuarios.length > 0 && (
                        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-4 rounded-lg shadow-md">
                            <div className="flex-1 flex justify-between sm:hidden">
                                <button
                                    onClick={() => cambiarPagina(paginacion.currentPage - 1)}
                                    disabled={paginacion.currentPage === 1}
                                    className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                                        paginacion.currentPage === 1
                                            ? 'text-gray-400 bg-gray-100'
                                            : 'text-gray-700 bg-white hover:bg-gray-50'
                                    }`}
                                >
                                    Anterior
                                </button>
                                <button
                                    onClick={() => cambiarPagina(paginacion.currentPage + 1)}
                                    disabled={paginacion.currentPage === paginacion.lastPage}
                                    className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                                        paginacion.currentPage === paginacion.lastPage
                                            ? 'text-gray-400 bg-gray-100'
                                            : 'text-gray-700 bg-white hover:bg-gray-50'
                                    }`}
                                >
                                    Siguiente
                                </button>
                            </div>
                            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm text-gray-700">
                                        Mostrando <span className="font-medium">{(paginacion.currentPage - 1) * paginacion.perPage + 1}</span> a <span className="font-medium">
                                            {Math.min(paginacion.currentPage * paginacion.perPage, paginacion.total)}
                                        </span> de <span className="font-medium">{paginacion.total}</span> resultados
                                    </p>
                                </div>
                                <div>
                                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                        <button
                                            onClick={() => cambiarPagina(paginacion.currentPage - 1)}
                                            disabled={paginacion.currentPage === 1}
                                            className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 ${
                                                paginacion.currentPage === 1
                                                    ? 'text-gray-400 bg-gray-100'
                                                    : 'bg-white text-gray-500 hover:bg-gray-50'
                                            }`}
                                        >
                                            <span className="sr-only">Anterior</span>
                                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </button>

                                        {/* Mostrar las páginas */}
                                        {Array.from({ length: paginacion.lastPage }, (_, i) => i + 1)
                                            .filter(page =>
                                                page === 1 ||
                                                page === paginacion.lastPage ||
                                                (page >= paginacion.currentPage - 1 && page <= paginacion.currentPage + 1)
                                            )
                                            .map((page, i, array) => {
                                                // Agregar elipsis si hay saltos
                                                const showEllipsisBefore = i > 0 && array[i-1] !== page - 1;
                                                const showEllipsisAfter = i < array.length - 1 && array[i+1] !== page + 1;

                                                return (
                                                    <React.Fragment key={page}>
                                                        {showEllipsisBefore && (
                                                            <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                                                                ...
                                                            </span>
                                                        )}
                                                        <button
                                                            onClick={() => cambiarPagina(page)}
                                                            className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium ${
                                                                page === paginacion.currentPage
                                                                    ? 'bg-indigo-50 text-indigo-600'
                                                                    : 'bg-white text-gray-700 hover:bg-gray-50'
                                                            }`}
                                                        >
                                                            {page}
                                                        </button>
                                                        {showEllipsisAfter && (
                                                            <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                                                                ...
                                                            </span>
                                                        )}
                                                    </React.Fragment>
                                                );
                                            })
                                        }

                                        <button
                                            onClick={() => cambiarPagina(paginacion.currentPage + 1)}
                                            disabled={paginacion.currentPage === paginacion.lastPage}
                                            className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 ${
                                                paginacion.currentPage === paginacion.lastPage
                                                    ? 'text-gray-400 bg-gray-100'
                                                    : 'bg-white text-gray-500 hover:bg-gray-50'
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
        </AdminLayout>
    );
}
