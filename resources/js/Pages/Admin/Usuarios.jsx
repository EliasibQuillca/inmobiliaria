import { Head, Link, router } from '@inertiajs/react';
import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function GestionUsuarios({ auth, usuarios, pagination, filters, error }) {
    // Estado para los filtros
    const [filtros, setFiltros] = useState(filters || {
        search: '',
        role: '',
        estado: '',
        page: 1,
    });

    const [loading, setLoading] = useState(false);

    // Datos de usuarios que vienen del servidor
    const listaUsuarios = usuarios?.data || [];
    const paginacion = pagination || { current_page: 1, last_page: 1, per_page: 15, total: 0 };

    // Función para manejar cambios en los filtros
    const handleFiltroChange = (e) => {
        const { name, value } = e.target;
        const nuevosFiltros = {
            ...filtros,
            [name]: value,
            page: 1, // Resetear la página al cambiar filtros
        };
        setFiltros(nuevosFiltros);

        // Para búsqueda, usar debounce
        if (name === 'search') {
            clearTimeout(window.searchTimeout);
            window.searchTimeout = setTimeout(() => {
                router.get('/admin/usuarios', nuevosFiltros, {
                    preserveState: true,
                    preserveScroll: true,
                });
            }, 500);
        } else {
            router.get('/admin/usuarios', nuevosFiltros, {
                preserveState: true,
                preserveScroll: true,
            });
        }
    };

    // Cambiar de página
    const cambiarPagina = (nuevaPagina) => {
        if (nuevaPagina > 0 && nuevaPagina <= paginacion.last_page) {
            const nuevosFiltros = {
                ...filtros,
                page: nuevaPagina,
            };
            router.get('/admin/usuarios', nuevosFiltros, {
                preserveState: true,
                preserveScroll: true,
            });
        }
    };

    // Función para desactivar/activar un usuario
    const toggleEstadoUsuario = async (id, estadoActual) => {
        try {
            const nuevoEstado = estadoActual === 'activo' ? 'inactivo' : 'activo';
            const accion = nuevoEstado === 'activo' ? 'activar' : 'desactivar';

            setLoading(true);

            router.patch(`/admin/usuarios/${id}/estado`, {
                estado: nuevoEstado
            }, {
                preserveState: false,
                onSuccess: () => {
                    alert(`✅ Usuario ${accion === 'activar' ? 'activado' : 'desactivado'} correctamente`);
                    router.reload();
                },
                onError: (errors) => {
                    console.error('Errores:', errors);
                    alert(`❌ No se pudo ${accion} el usuario. Por favor, inténtelo de nuevo.`);
                },
                onFinish: () => {
                    setLoading(false);
                }
            });
        } catch (err) {
            console.error('Error al cambiar estado del usuario:', err);
            alert('❌ Error inesperado al cambiar el estado del usuario. Por favor, inténtelo de nuevo.');
            setLoading(false);
        }
    };

    // Función para eliminar un usuario
    const eliminarUsuario = async (id, usuario) => {
        // Verificar si el usuario puede ser eliminado
        if (!usuario.can_delete) {
            alert(`❌ Este usuario no puede ser eliminado.\n\nRazón: Puede tener actividad comercial registrada (cotizaciones, reservas, etc.).\n\n💡 Tip: Puede desactivar el usuario en lugar de eliminarlo.`);
            return;
        }

        // Confirmación con información adicional
        const confirmMessage = `⚠️ ¿Está seguro de que desea eliminar este usuario?\n\n👤 Usuario: ${usuario.name}\n📧 Email: ${usuario.email}\n🏷️ Rol: ${getRoleDisplay(usuario.role)}\n\n❗ Esta acción NO se puede deshacer.`;

        if (!confirm(confirmMessage)) {
            return;
        }

        try {
            setLoading(true);
            router.delete(`/admin/usuarios/${id}`, {
                preserveState: false,
                onSuccess: () => {
                    alert('✅ Usuario eliminado correctamente');
                    router.reload();
                },
                onError: (errors) => {
                    console.error('Errores:', errors);
                    let mensaje = '❌ No se pudo eliminar el usuario.';

                    if (errors.message) {
                        mensaje += `\n\nRazón: ${errors.message}`;
                    }

                    if (errors.reason) {
                        mensaje += `\n\nDetalle: ${errors.reason}`;
                    }

                    mensaje += '\n\n💡 Verifique que el usuario no tenga actividad comercial registrada.';

                    alert(mensaje);
                },
                onFinish: () => {
                    setLoading(false);
                }
            });
        } catch (err) {
            console.error('Error al eliminar usuario:', err);
            alert('❌ Error inesperado al eliminar el usuario. Por favor, inténtelo de nuevo.');
            setLoading(false);
        }
    };

    // Función para formatear fecha
    const formatearFecha = (fechaString) => {
        try {
            return new Date(fechaString).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            });
        } catch {
            return fechaString;
        }
    };

    // Función para obtener el color del rol
    const getRoleColor = (role) => {
        switch (role) {
            case 'administrador':
                return 'bg-purple-100 text-purple-800';
            case 'asesor':
                return 'bg-blue-100 text-blue-800';
            case 'cliente':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Función para obtener el display del rol
    const getRoleDisplay = (role) => {
        switch (role) {
            case 'administrador':
                return 'Administrador';
            case 'asesor':
                return 'Asesor';
            case 'cliente':
                return 'Cliente';
            default:
                return role;
        }
    };

    return (
        <AdminLayout
            auth={auth}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Gestión de Usuarios
                </h2>
            }
        >
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

                    {/* Mostrar error si existe */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                            {error}
                        </div>
                    )}

                    {/* Filtros */}
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                                    Buscar
                                </label>
                                <input
                                    type="text"
                                    id="search"
                                    name="search"
                                    value={filtros.search}
                                    onChange={handleFiltroChange}
                                    placeholder="Nombre o correo electrónico"
                                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                />
                            </div>

                            <div>
                                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                                    Rol
                                </label>
                                <select
                                    id="role"
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
                                        {listaUsuarios.length > 0 ? (
                                            listaUsuarios.map((usuario) => (
                                                <tr key={usuario.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="flex-shrink-0 h-10 w-10">
                                                                <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                                                    <span className="font-medium text-indigo-800">
                                                                        {usuario.name?.charAt(0) || 'U'}
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
                                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleColor(usuario.role)}`}>
                                                            {getRoleDisplay(usuario.role)}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                                                            ${usuario.estado === 'activo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                            {usuario.estado === 'activo' ? 'Activo' : 'Inactivo'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {formatearFecha(usuario.created_at)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <div className="flex space-x-2 justify-end">
                                                            <Link
                                                                href={`/admin/usuarios/${usuario.id}/editar`}
                                                                className="text-indigo-600 hover:text-indigo-900 inline-flex items-center"
                                                            >
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                                </svg>
                                                                Editar
                                                            </Link>
                                                            <button
                                                                onClick={() => toggleEstadoUsuario(usuario.id, usuario.estado)}
                                                                className={`inline-flex items-center ${usuario.estado === 'activo' ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}`}
                                                            >
                                                                {usuario.estado === 'activo' ? (
                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                                                                    </svg>
                                                                ) : (
                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                    </svg>
                                                                )}
                                                                {usuario.estado === 'activo' ? 'Desactivar' : 'Activar'}
                                                            </button>
                                                            <button
                                                                onClick={() => eliminarUsuario(usuario.id, usuario)}
                                                                disabled={!usuario.can_delete}
                                                                className={`${usuario.can_delete
                                                                    ? 'text-red-600 hover:text-red-900 cursor-pointer'
                                                                    : 'text-gray-400 cursor-not-allowed opacity-50'
                                                                }`}
                                                                title={!usuario.can_delete ? 'Este usuario no puede ser eliminado (tiene actividad comercial)' : 'Eliminar usuario'}
                                                            >
                                                                {usuario.can_delete ? (
                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                    </svg>
                                                                ) : (
                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                                                                    </svg>
                                                                )}
                                                                Eliminar
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                                                    No se encontraron usuarios.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* Paginación */}
                    {paginacion.total > 0 && (
                        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-4 rounded-lg shadow-md">
                            <div className="flex-1 flex justify-between sm:hidden">
                                <button
                                    onClick={() => cambiarPagina(paginacion.current_page - 1)}
                                    disabled={paginacion.current_page === 1}
                                    className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                                        paginacion.current_page === 1
                                            ? 'text-gray-400 bg-gray-100'
                                            : 'text-gray-700 bg-white hover:bg-gray-50'
                                    }`}
                                >
                                    Anterior
                                </button>
                                <button
                                    onClick={() => cambiarPagina(paginacion.current_page + 1)}
                                    disabled={paginacion.current_page === paginacion.last_page}
                                    className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                                        paginacion.current_page === paginacion.last_page
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
                                        Mostrando <span className="font-medium">{(paginacion.current_page - 1) * paginacion.per_page + 1}</span> a <span className="font-medium">
                                            {Math.min(paginacion.current_page * paginacion.per_page, paginacion.total)}
                                        </span> de <span className="font-medium">{paginacion.total}</span> resultados
                                    </p>
                                </div>
                                <div>
                                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                        <button
                                            onClick={() => cambiarPagina(paginacion.current_page - 1)}
                                            disabled={paginacion.current_page === 1}
                                            className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 ${
                                                paginacion.current_page === 1
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
                                        {Array.from({ length: paginacion.last_page }, (_, i) => i + 1)
                                            .filter(page =>
                                                page === 1 ||
                                                page === paginacion.last_page ||
                                                (page >= paginacion.current_page - 1 && page <= paginacion.current_page + 1)
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
                                                                page === paginacion.current_page
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
                                            onClick={() => cambiarPagina(paginacion.current_page + 1)}
                                            disabled={paginacion.current_page === paginacion.last_page}
                                            className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 ${
                                                paginacion.current_page === paginacion.last_page
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
