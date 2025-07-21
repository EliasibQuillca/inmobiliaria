import { Head, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import Layout from '@/Components/Layout/Layout';

export default function Catalogo({ auth }) {
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
            imagen: '/img/departamento1.jpg',
            destacado: true
        },
        {
            id: 2,
            nombre: 'Departamento Magisterio 202',
            ubicacion: 'Calle Magisterio 123, Sector A',
            precio: 150000,
            metros: 90,
            habitaciones: 3,
            baños: 2,
            estado: 'Disponible',
            imagen: '/img/departamento2.jpg',
            destacado: true
        },
        {
            id: 3,
            nombre: 'Departamento Lima 305',
            ubicacion: 'Av. Lima 305, Sector B',
            precio: 180000,
            metros: 100,
            habitaciones: 3,
            baños: 2,
            estado: 'Disponible',
            imagen: '/img/departamento3.jpg',
            destacado: false
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
            imagen: '/img/departamento4.jpg',
            destacado: false
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
            imagen: '/img/departamento5.jpg',
            destacado: true
        },
        {
            id: 6,
            nombre: 'Departamento Tacna 308',
            ubicacion: 'Av. Tacna 308, Sector E',
            precio: 145000,
            metros: 88,
            habitaciones: 3,
            baños: 2,
            estado: 'Disponible',
            imagen: '/img/departamento6.jpg',
            destacado: false
        },
    ]);

    // Estado para los filtros
    const [filtros, setFiltros] = useState({
        busqueda: '',
        habitaciones: '',
        baños: '',
        precioMin: '',
        precioMax: '',
        ordenarPor: 'destacado'
    });

    // Estado para los departamentos filtrados
    const [departamentosFiltrados, setDepartamentosFiltrados] = useState([]);

    // Estado para los favoritos
    const [favoritos, setFavoritos] = useState([]);

    // Aplicar filtros cuando cambien los filtros o los departamentos
    useEffect(() => {
        let resultado = [...departamentos];

        // Filtro de búsqueda
        if (filtros.busqueda) {
            const busquedaLower = filtros.busqueda.toLowerCase();
            resultado = resultado.filter(depto =>
                depto.nombre.toLowerCase().includes(busquedaLower) ||
                depto.ubicacion.toLowerCase().includes(busquedaLower)
            );
        }

        // Filtro de habitaciones
        if (filtros.habitaciones) {
            resultado = resultado.filter(depto =>
                depto.habitaciones.toString() === filtros.habitaciones
            );
        }

        // Filtro de baños
        if (filtros.baños) {
            resultado = resultado.filter(depto =>
                depto.baños.toString() === filtros.baños
            );
        }

        // Filtro de precio mínimo
        if (filtros.precioMin) {
            resultado = resultado.filter(depto =>
                depto.precio >= parseInt(filtros.precioMin)
            );
        }

        // Filtro de precio máximo
        if (filtros.precioMax) {
            resultado = resultado.filter(depto =>
                depto.precio <= parseInt(filtros.precioMax)
            );
        }

        // Ordenar los resultados
        if (filtros.ordenarPor === 'destacado') {
            resultado.sort((a, b) => (b.destacado ? 1 : 0) - (a.destacado ? 1 : 0));
        } else if (filtros.ordenarPor === 'precioAsc') {
            resultado.sort((a, b) => a.precio - b.precio);
        } else if (filtros.ordenarPor === 'precioDesc') {
            resultado.sort((a, b) => b.precio - a.precio);
        }

        setDepartamentosFiltrados(resultado);
    }, [departamentos, filtros]);

    // Manejar cambio en los filtros
    const handleFiltroChange = (e) => {
        const { name, value } = e.target;
        setFiltros(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Función para resetear los filtros
    const resetFiltros = () => {
        setFiltros({
            busqueda: '',
            habitaciones: '',
            baños: '',
            precioMin: '',
            precioMax: '',
            ordenarPor: 'destacado'
        });
    };

    // Función para alternar favoritos
    const toggleFavorito = (id) => {
        if (favoritos.includes(id)) {
            setFavoritos(favoritos.filter(favId => favId !== id));
        } else {
            setFavoritos([...favoritos, id]);
        }
    };

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
            <Head title="Catálogo de Departamentos - Inmobiliaria" />

            <div className="py-12 bg-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-gray-900">
                            Catálogo de Departamentos
                        </h2>
                        <p className="mt-1 text-lg text-gray-600">
                            Encuentra el departamento perfecto para ti
                        </p>
                    </div>

                    {/* Filtros */}
                    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
                            <div className="lg:col-span-2">
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
                                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                />
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
                                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                >
                                    <option value="">Cualquiera</option>
                                    <option value="1">1 habitación</option>
                                    <option value="2">2 habitaciones</option>
                                    <option value="3">3 habitaciones</option>
                                    <option value="4">4+ habitaciones</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="baños" className="block text-sm font-medium text-gray-700 mb-1">
                                    Baños
                                </label>
                                <select
                                    id="baños"
                                    name="baños"
                                    value={filtros.baños}
                                    onChange={handleFiltroChange}
                                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                >
                                    <option value="">Cualquiera</option>
                                    <option value="1">1 baño</option>
                                    <option value="2">2 baños</option>
                                    <option value="3">3+ baños</option>
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
                                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
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
                                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                />
                            </div>
                        </div>

                        <div className="mt-6 flex items-center justify-between">
                            <div>
                                <label htmlFor="ordenarPor" className="block text-sm font-medium text-gray-700 mb-1">
                                    Ordenar por
                                </label>
                                <select
                                    id="ordenarPor"
                                    name="ordenarPor"
                                    value={filtros.ordenarPor}
                                    onChange={handleFiltroChange}
                                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                >
                                    <option value="destacado">Destacados</option>
                                    <option value="precioAsc">Precio: menor a mayor</option>
                                    <option value="precioDesc">Precio: mayor a menor</option>
                                </select>
                            </div>

                            <button
                                onClick={resetFiltros}
                                className="mt-6 px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Limpiar filtros
                            </button>
                        </div>
                    </div>

                    {/* Resultados */}
                    <div className="mb-8">
                        <div className="mb-4 flex justify-between items-center">
                            <p className="text-gray-700">
                                {departamentosFiltrados.length} departamentos encontrados
                            </p>
                            <div className="flex space-x-2">
                                <button className="p-2 bg-white rounded-md border border-gray-300 shadow-sm">
                                    <svg className="h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                                    </svg>
                                </button>
                                <button className="p-2 bg-blue-50 rounded-md border border-blue-300 shadow-sm">
                                    <svg className="h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {departamentosFiltrados.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {departamentosFiltrados.map((departamento) => (
                                    <div key={departamento.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
                                        <div className="relative h-48 bg-gray-300">
                                            <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                                                <svg className="h-12 w-12" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                            {departamento.destacado && (
                                                <div className="absolute top-2 left-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded">
                                                    Destacado
                                                </div>
                                            )}
                                            <button
                                                onClick={() => toggleFavorito(departamento.id)}
                                                className="absolute top-2 right-2 p-2 rounded-full bg-white shadow-md"
                                            >
                                                {favoritos.includes(departamento.id) ? (
                                                    <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                                                    </svg>
                                                ) : (
                                                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                                    </svg>
                                                )}
                                            </button>
                                        </div>
                                        <div className="p-6">
                                            <div className="mb-3">
                                                <h3 className="text-lg font-bold text-gray-900">{formatPrecio(departamento.precio)}</h3>
                                                <p className="text-sm text-gray-500">{departamento.ubicacion}</p>
                                            </div>
                                            <h4 className="text-base font-medium text-gray-900">{departamento.nombre}</h4>
                                            <div className="mt-4 flex items-center text-sm text-gray-700">
                                                <div className="flex items-center">
                                                    <svg className="h-5 w-5 text-gray-400 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                                    </svg>
                                                    <span>{departamento.metros} m²</span>
                                                </div>
                                                <span className="mx-2">•</span>
                                                <div className="flex items-center">
                                                    <svg className="h-5 w-5 text-gray-400 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                    <span>{departamento.habitaciones} hab.</span>
                                                </div>
                                                <span className="mx-2">•</span>
                                                <div className="flex items-center">
                                                    <svg className="h-5 w-5 text-gray-400 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                    <span>{departamento.baños} baños</span>
                                                </div>
                                            </div>
                                            <div className="mt-6 flex justify-between">
                                                <Link
                                                    href={`/properties/${departamento.id}`}
                                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                >
                                                    Ver detalles
                                                </Link>
                                                <Link
                                                    href={`/cliente/solicitudes/crear?departamento=${departamento.id}`}
                                                    className="inline-flex items-center px-4 py-2 border border-blue-300 text-sm font-medium rounded-md shadow-sm text-blue-600 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                >
                                                    Solicitar info
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white rounded-lg shadow-md p-8 text-center">
                                <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                                <h3 className="mt-2 text-lg font-medium text-gray-900">No se encontraron departamentos</h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    No hay departamentos que coincidan con tus filtros. Intenta con otros criterios.
                                </p>
                                <div className="mt-6">
                                    <button
                                        onClick={resetFiltros}
                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                        Limpiar filtros
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Paginación */}
                    <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 rounded-lg shadow-md">
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
                                    <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-blue-50 text-sm font-medium text-blue-600 hover:bg-gray-50">
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
