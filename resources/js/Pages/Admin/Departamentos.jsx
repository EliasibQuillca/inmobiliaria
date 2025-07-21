import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import Layout from '@/Components/Layout/Layout';

export default function GestionDepartamentos({ auth }) {
    // Estado para los departamentos
    const [departamentos, setDepartamentos] = useState([
        {
            id: 1,
            nombre: 'Departamento Magisterio 101',
            ubicacion: 'Calle Magisterio 123, Sector A',
            precio: 120000,
            metros: 75,
            habitaciones: 2,
            baños: 1,
            estado: 'Disponible',
            creado: '2025-03-15',
        },
        {
            id: 2,
            nombre: 'Departamento Magisterio 202',
            ubicacion: 'Calle Magisterio 123, Sector A',
            precio: 150000,
            metros: 90,
            habitaciones: 3,
            baños: 2,
            estado: 'Reservado',
            creado: '2025-03-15',
        },
        {
            id: 3,
            nombre: 'Departamento Lima 305',
            ubicacion: 'Av. Lima 305, Sector B',
            precio: 180000,
            metros: 100,
            habitaciones: 3,
            baños: 2,
            estado: 'Vendido',
            creado: '2025-04-10',
        },
        {
            id: 4,
            nombre: 'Departamento Arequipa 401',
            ubicacion: 'Av. Arequipa 401, Sector C',
            precio: 130000,
            metros: 85,
            habitaciones: 2,
            baños: 2,
            estado: 'Disponible',
            creado: '2025-04-20',
        },
        {
            id: 5,
            nombre: 'Departamento Cusco 205',
            ubicacion: 'Calle Cusco 205, Sector D',
            precio: 165000,
            metros: 95,
            habitaciones: 3,
            baños: 2,
            estado: 'Disponible',
            creado: '2025-05-05',
        },
    ]);

    // Estado para los filtros
    const [filtros, setFiltros] = useState({
        busqueda: '',
        estado: '',
        habitaciones: '',
        precioMin: '',
        precioMax: '',
    });

    // Función para manejar cambios en los filtros
    const handleFiltroChange = (e) => {
        const { name, value } = e.target;
        setFiltros({
            ...filtros,
            [name]: value,
        });
    };

    // Filtrar departamentos
    const departamentosFiltrados = departamentos.filter((departamento) => {
        const cumpleBusqueda = departamento.nombre.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
            departamento.ubicacion.toLowerCase().includes(filtros.busqueda.toLowerCase());

        const cumpleEstado = filtros.estado === '' || departamento.estado === filtros.estado;

        const cumpleHabitaciones = filtros.habitaciones === '' ||
            departamento.habitaciones.toString() === filtros.habitaciones;

        const cumplePrecioMin = filtros.precioMin === '' ||
            departamento.precio >= parseInt(filtros.precioMin);

        const cumplePrecioMax = filtros.precioMax === '' ||
            departamento.precio <= parseInt(filtros.precioMax);

        return cumpleBusqueda && cumpleEstado && cumpleHabitaciones && cumplePrecioMin && cumplePrecioMax;
    });

    // Formato de moneda para los precios
    const formatPrecio = (precio) => {
        return precio.toLocaleString('es-ES', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        });
    };

    return (
        <Layout auth={auth}>
            <Head title="Gestión de Departamentos - Inmobiliaria" />

            <div className="py-12 bg-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900">
                                Gestión de Departamentos
                            </h2>
                            <p className="mt-1 text-lg text-gray-600">
                                Administre el catálogo de departamentos
                            </p>
                        </div>
                        <Link
                            href="/admin/departamentos/crear"
                            className="px-4 py-2 bg-green-600 border border-transparent rounded-md font-semibold text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                            Crear Departamento
                        </Link>
                    </div>

                    {/* Filtros */}
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
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
                                    placeholder="Nombre o ubicación"
                                    className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
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
                                    className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                >
                                    <option value="">Todos los estados</option>
                                    <option value="Disponible">Disponible</option>
                                    <option value="Reservado">Reservado</option>
                                    <option value="Vendido">Vendido</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="habitaciones" className="block text-sm font-medium text-gray-700 mb-1">
                                    Habitaciones
                                </label>
                                <select
                                    id="habitaciones"
                                    name="habitaciones"
                                    value={filtros.habitaciones}
                                    onChange={handleFiltroChange}
                                    className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                >
                                    <option value="">Cualquier cantidad</option>
                                    <option value="1">1 habitación</option>
                                    <option value="2">2 habitaciones</option>
                                    <option value="3">3 habitaciones</option>
                                    <option value="4">4+ habitaciones</option>
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
                                    placeholder="USD"
                                    className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
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
                                    placeholder="USD"
                                    className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Tabla de departamentos */}
                    <div className="bg-white shadow-md rounded-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Departamento
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Características
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Precio
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Estado
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Fecha de Creación
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Acciones
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {departamentosFiltrados.length > 0 ? (
                                        departamentosFiltrados.map((departamento) => (
                                            <tr key={departamento.id}>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-10 w-10">
                                                            <div className="h-10 w-10 rounded-md bg-green-100 flex items-center justify-center">
                                                                <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                                </svg>
                                                            </div>
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {departamento.nombre}
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                {departamento.ubicacion}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-gray-900">
                                                        <span className="font-medium">{departamento.metros} m²</span> • {departamento.habitaciones} hab. • {departamento.baños} baños
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {formatPrecio(departamento.precio)}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                                                        ${departamento.estado === 'Disponible' ? 'bg-green-100 text-green-800' :
                                                          departamento.estado === 'Reservado' ? 'bg-yellow-100 text-yellow-800' :
                                                          'bg-blue-100 text-blue-800'}`}>
                                                        {departamento.estado}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {departamento.creado}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex space-x-2 justify-end">
                                                        <Link
                                                            href={`/admin/departamentos/${departamento.id}`}
                                                            className="text-green-600 hover:text-green-900"
                                                        >
                                                            Ver
                                                        </Link>
                                                        <Link
                                                            href={`/admin/departamentos/${departamento.id}/editar`}
                                                            className="text-indigo-600 hover:text-indigo-900"
                                                        >
                                                            Editar
                                                        </Link>
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
                                            <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                                                No se encontraron departamentos que coincidan con los filtros.
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
                                    Mostrando <span className="font-medium">1</span> a <span className="font-medium">{departamentosFiltrados.length}</span> de <span className="font-medium">{departamentosFiltrados.length}</span> resultados
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
                                    <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-green-50 text-sm font-medium text-green-600 hover:bg-gray-50">
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
