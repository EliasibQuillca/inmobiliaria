import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import Layout from '@/components/layout/Layout';
import DepartamentosDestacados from '@/components/DepartamentosDestacados';

export default function Catalogo({ auth }) {
    const [departamentos, setDepartamentos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        ubicacion: '',
        habitaciones: '',
        precio_min: '',
        precio_max: '',
        area_min: '',
        area_max: '',
    });
    const [pagination, setPagination] = useState({
        current_page: 1,
        total: 0,
        per_page: 9,
        last_page: 1,
    });

    const loadDepartamentos = async (page = 1, newFilters = null) => {
        try {
            setLoading(true);
            const useFilters = newFilters || filters;

            // Construir query params para la URL
            const params = new URLSearchParams();
            params.append('page', page);

            Object.keys(useFilters).forEach(key => {
                if (useFilters[key]) {
                    params.append(key, useFilters[key]);
                }
            });

            const response = await axios.get(`/api/v1/departamentos?${params.toString()}`);

            if (response.data) {
                setDepartamentos(response.data.data);
                setPagination({
                    current_page: response.data.current_page,
                    total: response.data.total,
                    per_page: response.data.per_page,
                    last_page: response.data.last_page,
                });
            }
        } catch (err) {
            console.error('Error al cargar departamentos:', err);
            setError('No se pudieron cargar los departamentos. Por favor, inténtelo de nuevo más tarde.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Obtener parámetros de la URL si existen
        const urlParams = new URLSearchParams(window.location.search);
        const initialFilters = { ...filters };

        // Mapeo de parámetros URL a filtros
        if (urlParams.get('location')) initialFilters.ubicacion = urlParams.get('location');
        if (urlParams.get('bedrooms') && urlParams.get('bedrooms') !== 'any') {
            initialFilters.habitaciones = urlParams.get('bedrooms');
        }
        if (urlParams.get('priceRange') && urlParams.get('priceRange') !== 'any') {
            const priceRange = urlParams.get('priceRange').split('-');
            if (priceRange.length === 2) {
                initialFilters.precio_min = priceRange[0];
                initialFilters.precio_max = priceRange[1];
            } else if (priceRange[0].endsWith('+')) {
                initialFilters.precio_min = priceRange[0].replace('+', '');
            }
        }

        setFilters(initialFilters);
        loadDepartamentos(1, initialFilters);
    }, []);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleFilterSubmit = (e) => {
        e.preventDefault();
        loadDepartamentos(1);
    };

    const handlePageChange = (page) => {
        loadDepartamentos(page);
        window.scrollTo(0, 0);
    };

    return (
        <Layout auth={auth}>
            <Head title="Catálogo de Departamentos - Inmobiliaria Cusco" />

            {/* Hero Section */}
            <div className="relative h-64 bg-indigo-700">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-800 to-indigo-600"></div>
                <div className="absolute inset-0 flex items-center justify-center px-4">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-white mb-4">Catálogo de Propiedades</h1>
                        <p className="text-xl text-indigo-100 max-w-xl mx-auto">
                            Encuentra el departamento perfecto para ti entre nuestra exclusiva selección de propiedades
                        </p>
                    </div>
                </div>
            </div>

            {/* Destacados Section */}
            <DepartamentosDestacados />

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Filters Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                            <h2 className="text-xl font-semibold mb-4">Filtros</h2>
                            <form onSubmit={handleFilterSubmit}>
                                <div className="mb-4">
                                    <label htmlFor="ubicacion" className="block text-sm font-medium text-gray-700 mb-1">
                                        Ubicación
                                    </label>
                                    <input
                                        type="text"
                                        id="ubicacion"
                                        name="ubicacion"
                                        value={filters.ubicacion}
                                        onChange={handleFilterChange}
                                        placeholder="Distrito o zona"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="habitaciones" className="block text-sm font-medium text-gray-700 mb-1">
                                        Habitaciones
                                    </label>
                                    <select
                                        id="habitaciones"
                                        name="habitaciones"
                                        value={filters.habitaciones}
                                        onChange={handleFilterChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    >
                                        <option value="">Cualquiera</option>
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                        <option value="4">4+</option>
                                    </select>
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Rango de Precio (S/.)
                                    </label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <input
                                            type="number"
                                            name="precio_min"
                                            value={filters.precio_min}
                                            onChange={handleFilterChange}
                                            placeholder="Mínimo"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                        <input
                                            type="number"
                                            name="precio_max"
                                            value={filters.precio_max}
                                            onChange={handleFilterChange}
                                            placeholder="Máximo"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Área (m²)
                                    </label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <input
                                            type="number"
                                            name="area_min"
                                            value={filters.area_min}
                                            onChange={handleFilterChange}
                                            placeholder="Mínimo"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                        <input
                                            type="number"
                                            name="area_max"
                                            value={filters.area_max}
                                            onChange={handleFilterChange}
                                            placeholder="Máximo"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                                >
                                    Aplicar Filtros
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Catalog Listings */}
                    <div className="lg:col-span-3">
                        {loading ? (
                            // Skeleton Loading
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[...Array(6)].map((_, index) => (
                                    <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                                        <div className="h-48 bg-gray-300"></div>
                                        <div className="p-4">
                                            <div className="h-6 bg-gray-300 rounded w-3/4 mb-3"></div>
                                            <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
                                            <div className="h-5 bg-gray-300 rounded w-1/3 mb-4"></div>
                                            <div className="h-4 bg-gray-300 rounded w-full"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : error ? (
                            // Error Message
                            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm text-red-700">{error}</p>
                                    </div>
                                </div>
                            </div>
                        ) : departamentos.length === 0 ? (
                            // No Results
                            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm text-yellow-700">No se encontraron propiedades con los filtros seleccionados.</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            // Departamentos Grid
                            <>
                                <div className="mb-6 flex justify-between items-center">
                                    <p className="text-gray-600">
                                        Mostrando {departamentos.length} de {pagination.total} propiedades
                                    </p>
                                    <div>
                                        <select
                                            className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                            onChange={(e) => console.log(e.target.value)}
                                            defaultValue="recientes"
                                        >
                                            <option value="recientes">Más recientes</option>
                                            <option value="precio_asc">Precio: menor a mayor</option>
                                            <option value="precio_desc">Precio: mayor a menor</option>
                                            <option value="area_desc">Mayor área</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {departamentos.map((departamento) => (
                                        <a
                                            key={departamento.id}
                                            href={`/catalogo/${departamento.id}`}
                                            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                                        >
                                            <div className="relative h-48">
                                                {departamento.imagenes && departamento.imagenes.length > 0 ? (
                                                    <img
                                                        src={departamento.imagenes[0].url}
                                                        alt={departamento.titulo}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                    </div>
                                                )}
                                                {departamento.destacado && (
                                                    <div className="absolute top-0 right-0 bg-yellow-500 text-white px-3 py-1 m-2 rounded-full text-xs font-bold">
                                                        Destacado
                                                    </div>
                                                )}
                                                <div className="absolute bottom-0 left-0 bg-indigo-600 text-white px-3 py-1 m-2 rounded-md text-sm font-semibold">
                                                    S/. {departamento.precio.toLocaleString()}
                                                </div>
                                            </div>
                                            <div className="p-4">
                                                <h3 className="text-lg font-semibold text-gray-900 mb-2">{departamento.titulo}</h3>
                                                <p className="text-gray-600 mb-4 truncate">{departamento.direccion}</p>
                                                <div className="flex justify-between text-sm text-gray-500">
                                                    <div className="flex items-center">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                                        </svg>
                                                        {departamento.area_total} m²
                                                    </div>
                                                    <div className="flex items-center">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                        </svg>
                                                        {departamento.habitaciones} Hab.
                                                    </div>
                                                    <div className="flex items-center">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                        {departamento.banos} Baños
                                                    </div>
                                                </div>
                                            </div>
                                        </a>
                                    ))}
                                </div>

                                {/* Pagination */}
                                {pagination.last_page > 1 && (
                                    <div className="mt-8 flex justify-center">
                                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                            <button
                                                onClick={() => handlePageChange(pagination.current_page - 1)}
                                                disabled={pagination.current_page === 1}
                                                className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${pagination.current_page === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            >
                                                <span className="sr-only">Anterior</span>
                                                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            </button>

                                            {[...Array(pagination.last_page)].map((_, index) => {
                                                const page = index + 1;
                                                // Mostrar siempre primera, última y páginas cercanas a la actual
                                                if (
                                                    page === 1 ||
                                                    page === pagination.last_page ||
                                                    (page >= pagination.current_page - 1 && page <= pagination.current_page + 1)
                                                ) {
                                                    return (
                                                        <button
                                                            key={page}
                                                            onClick={() => handlePageChange(page)}
                                                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${pagination.current_page === page ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'}`}
                                                        >
                                                            {page}
                                                        </button>
                                                    );
                                                } else if (
                                                    page === pagination.current_page - 2 ||
                                                    page === pagination.current_page + 2
                                                ) {
                                                    // Mostrar puntos suspensivos
                                                    return (
                                                        <span
                                                            key={page}
                                                            className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                                                        >
                                                            ...
                                                        </span>
                                                    );
                                                }
                                                return null;
                                            })}

                                            <button
                                                onClick={() => handlePageChange(pagination.current_page + 1)}
                                                disabled={pagination.current_page === pagination.last_page}
                                                className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${pagination.current_page === pagination.last_page ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            >
                                                <span className="sr-only">Siguiente</span>
                                                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </nav>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
}
