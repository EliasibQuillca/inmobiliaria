import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import Layout from '@/Components/Layout/Layout';

export default function GestionUsuarios({ auth }) {
    // Estado para los usuarios
    const [usuarios, setUsuarios] = useState([
        {
            id: 1,
            nombre: 'Juan Pérez',
            email: 'juan.perez@example.com',
            rol: 'Administrador',
            estado: 'Activo',
            fecha_registro: '2025-01-15',
        },
        {
            id: 2,
            nombre: 'María López',
            email: 'maria.lopez@example.com',
            rol: 'Asesor',
            estado: 'Activo',
            fecha_registro: '2025-02-10',
        },
        {
            id: 3,
            nombre: 'Carlos Rodríguez',
            email: 'carlos.rodriguez@example.com',
            rol: 'Cliente',
            estado: 'Activo',
            fecha_registro: '2025-03-05',
        },
        {
            id: 4,
            nombre: 'Ana Martínez',
            email: 'ana.martinez@example.com',
            rol: 'Asesor',
            estado: 'Inactivo',
            fecha_registro: '2025-03-15',
        },
        {
            id: 5,
            nombre: 'Roberto Sánchez',
            email: 'roberto.sanchez@example.com',
            rol: 'Asesor',
            estado: 'Activo',
            fecha_registro: '2025-04-20',
        },
    ]);

    // Estado para los filtros
    const [filtros, setFiltros] = useState({
        busqueda: '',
        rol: '',
        estado: '',
    });

    // Función para manejar cambios en los filtros
    const handleFiltroChange = (e) => {
        const { name, value } = e.target;
        setFiltros({
            ...filtros,
            [name]: value,
        });
    };

    // Filtrar usuarios
    const usuariosFiltrados = usuarios.filter((usuario) => {
        return (
            (usuario.nombre.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
                usuario.email.toLowerCase().includes(filtros.busqueda.toLowerCase())) &&
            (filtros.rol === '' || usuario.rol === filtros.rol) &&
            (filtros.estado === '' || usuario.estado === filtros.estado)
        );
    });

    return (
        <Layout auth={auth}>
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
                                    name="rol"
                                    value={filtros.rol}
                                    onChange={handleFiltroChange}
                                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                >
                                    <option value="">Todos los roles</option>
                                    <option value="Administrador">Administrador</option>
                                    <option value="Asesor">Asesor</option>
                                    <option value="Cliente">Cliente</option>
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
                                    <option value="Activo">Activo</option>
                                    <option value="Inactivo">Inactivo</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Tabla de usuarios */}
                    <div className="bg-white shadow-md rounded-lg overflow-hidden">
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
                                    {usuariosFiltrados.length > 0 ? (
                                        usuariosFiltrados.map((usuario) => (
                                            <tr key={usuario.id}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-10 w-10">
                                                            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                                                <span className="font-medium text-indigo-800">
                                                                    {usuario.nombre.charAt(0)}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {usuario.nombre}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">{usuario.email}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                                                        ${usuario.rol === 'Administrador' ? 'bg-purple-100 text-purple-800' :
                                                          usuario.rol === 'Asesor' ? 'bg-blue-100 text-blue-800' :
                                                          'bg-green-100 text-green-800'}`}>
                                                        {usuario.rol}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                                                        ${usuario.estado === 'Activo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                        {usuario.estado}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {usuario.fecha_registro}
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
                                                            className={`${usuario.estado === 'Activo' ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}`}
                                                        >
                                                            {usuario.estado === 'Activo' ? 'Desactivar' : 'Activar'}
                                                        </button>
                                                        <button className="text-gray-600 hover:text-gray-900">
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
                    </div>

                    {/* Paginación */}
                    <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-4 rounded-lg shadow-md">
                        <div className="flex-1 flex justify-between sm:hidden">
                            <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                                Anterior
                            </button>
                            <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                                Siguiente
                            </button>
                        </div>
                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-gray-700">
                                    Mostrando <span className="font-medium">1</span> a <span className="font-medium">{usuariosFiltrados.length}</span> de <span className="font-medium">{usuariosFiltrados.length}</span> resultados
                                </p>
                            </div>
                            <div>
                                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                    <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                                        <span className="sr-only">Anterior</span>
                                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                    <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-indigo-50 text-sm font-medium text-indigo-600 hover:bg-gray-50">
                                        1
                                    </button>
                                    <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                                        <span className="sr-only">Siguiente</span>
                                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
