import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AsesorLayout from '../../Layouts/AsesorLayout';

export default function Propiedades({
    auth,
    propiedades,
    estadisticas,
    filtros,
    cotizacionesAsesor = [],
    tiposPropiedad
}) {
    const [filtrosLocales, setFiltrosLocales] = useState({
        estado: filtros.estado || 'disponible',
        tipo_propiedad: filtros.tipo_propiedad || '',
        habitaciones: filtros.habitaciones || '',
        precio_min: filtros.precio_min || '',
        precio_max: filtros.precio_max || '',
        busqueda: filtros.busqueda || '',
    });

    const aplicarFiltros = () => {
        router.get(route('asesor.propiedades'), filtrosLocales, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const limpiarFiltros = () => {
        const filtrosVacios = {
            estado: 'disponible',
            tipo_propiedad: '',
            habitaciones: '',
            precio_min: '',
            precio_max: '',
            busqueda: '',
        };
        setFiltrosLocales(filtrosVacios);
        router.get(route('asesor.propiedades'), filtrosVacios);
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const getEstadoColor = (estado) => {
        switch (estado) {
            case 'disponible':
                return 'bg-green-100 text-green-800';
            case 'reservado':
                return 'bg-yellow-100 text-yellow-800';
            case 'vendido':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const haCotizado = (propiedadId) => {
        return cotizacionesAsesor.includes(propiedadId);
    };

    const crearCotizacion = (propiedad) => {
        router.get(route('asesor.cotizaciones.create'), {
            departamento_id: propiedad.id
        });
    };

    return (
        <AsesorLayout user={auth.user}>
            <Head title="Catálogo de Propiedades" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="md:flex md:items-center md:justify-between">
                            <div className="flex-1 min-w-0">
                                <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                                    Catálogo de Propiedades
                                </h2>
                                <p className="mt-1 text-sm text-gray-500">
                                    Explora las propiedades disponibles para cotizar a tus clientes
                                </p>
                            </div>
                            <div className="mt-4 flex md:mt-0 md:ml-4">
                                <Link
                                    href={route('asesor.cotizaciones.create')}
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Nueva Cotización
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Estadísticas */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
                                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-2xl font-semibold text-gray-900">{estadisticas.total}</p>
                                        <p className="text-sm text-gray-500">Total Propiedades</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 bg-green-100 rounded-md flex items-center justify-center">
                                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-2xl font-semibold text-gray-900">{estadisticas.disponibles}</p>
                                        <p className="text-sm text-gray-500">Disponibles</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 bg-yellow-100 rounded-md flex items-center justify-center">
                                            <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-2xl font-semibold text-gray-900">{estadisticas.reservados}</p>
                                        <p className="text-sm text-gray-500">Reservados</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 bg-red-100 rounded-md flex items-center justify-center">
                                            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-2xl font-semibold text-gray-900">{estadisticas.vendidos}</p>
                                        <p className="text-sm text-gray-500">Vendidos</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filtros */}
                    <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                            {/* Estado */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                                <select
                                    value={filtrosLocales.estado}
                                    onChange={(e) => setFiltrosLocales(prev => ({ ...prev, estado: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Todos</option>
                                    <option value="disponible">Disponible</option>
                                    <option value="reservado">Reservado</option>
                                    <option value="vendido">Vendido</option>
                                </select>
                            </div>

                            {/* Tipo de Propiedad */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
                                <select
                                    value={filtrosLocales.tipo_propiedad}
                                    onChange={(e) => setFiltrosLocales(prev => ({ ...prev, tipo_propiedad: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Todos los tipos</option>
                                    {Object.entries(tiposPropiedad).map(([key, label]) => (
                                        <option key={key} value={key}>{label}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Habitaciones */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Habitaciones</label>
                                <select
                                    value={filtrosLocales.habitaciones}
                                    onChange={(e) => setFiltrosLocales(prev => ({ ...prev, habitaciones: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Cualquier cantidad</option>
                                    <option value="1">1 habitación</option>
                                    <option value="2">2 habitaciones</option>
                                    <option value="3">3 habitaciones</option>
                                    <option value="4">4+ habitaciones</option>
                                </select>
                            </div>

                            {/* Precio Mínimo */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Precio Mín.</label>
                                <input
                                    type="number"
                                    value={filtrosLocales.precio_min}
                                    onChange={(e) => setFiltrosLocales(prev => ({ ...prev, precio_min: e.target.value }))}
                                    placeholder="Desde..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {/* Precio Máximo */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Precio Máx.</label>
                                <input
                                    type="number"
                                    value={filtrosLocales.precio_max}
                                    onChange={(e) => setFiltrosLocales(prev => ({ ...prev, precio_max: e.target.value }))}
                                    placeholder="Hasta..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {/* Búsqueda */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Buscar</label>
                                <input
                                    type="text"
                                    value={filtrosLocales.busqueda}
                                    onChange={(e) => setFiltrosLocales(prev => ({ ...prev, busqueda: e.target.value }))}
                                    placeholder="Código, descripción..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end space-x-3 mt-6">
                            <button
                                onClick={limpiarFiltros}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                            >
                                Limpiar Filtros
                            </button>
                            <button
                                onClick={aplicarFiltros}
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                            >
                                Aplicar Filtros
                            </button>
                        </div>
                    </div>

                    {/* Grid de Propiedades */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {propiedades.data.map((propiedad) => (
                            <div key={propiedad.id} className="bg-white overflow-hidden shadow-sm sm:rounded-lg hover:shadow-md transition-shadow">
                                {/* Imagen */}
                                <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                                    {propiedad.imagenes && propiedad.imagenes.length > 0 ? (
                                        <img
                                            src={`/storage/${propiedad.imagenes[0].ruta}`}
                                            alt={propiedad.codigo}
                                            className="w-full h-48 object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-48 bg-gray-300 flex items-center justify-center">
                                            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                    )}
                                </div>

                                {/* Contenido */}
                                <div className="p-6">
                                    {/* Header con código y estado */}
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            {propiedad.codigo}
                                        </h3>
                                        <div className="flex space-x-2">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(propiedad.estado)}`}>
                                                {propiedad.estado}
                                            </span>
                                            {haCotizado(propiedad.id) && (
                                                <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                    Cotizado
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Detalles */}
                                    <div className="space-y-2 mb-4">
                                        <p className="text-sm text-gray-600">
                                            <span className="font-medium">Tipo:</span> {tiposPropiedad[propiedad.tipo_propiedad] || propiedad.tipo_propiedad}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            <span className="font-medium">Habitaciones:</span> {propiedad.habitaciones}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            <span className="font-medium">Baños:</span> {propiedad.banos}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            <span className="font-medium">Área:</span> {propiedad.area_construida} m²
                                        </p>
                                        <p className="text-lg font-bold text-blue-600">
                                            {formatCurrency(propiedad.precio)}
                                        </p>
                                    </div>

                                    {/* Acciones */}
                                    <div className="flex space-x-2">
                                        <Link
                                            href={route('asesor.propiedades.show', propiedad.id)}
                                            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium text-center"
                                        >
                                            Ver Detalle
                                        </Link>
                                        {propiedad.estado === 'disponible' && (
                                            <button
                                                onClick={() => crearCotizacion(propiedad)}
                                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium"
                                            >
                                                Cotizar
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Paginación */}
                    {propiedades.links && propiedades.links.length > 3 && (
                        <div className="mt-8 flex justify-center">
                            <nav className="flex space-x-2">
                                {propiedades.links.map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.url || '#'}
                                        className={`px-3 py-2 text-sm rounded-md ${
                                            link.active
                                                ? 'bg-blue-600 text-white'
                                                : link.url
                                                    ? 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </nav>
                        </div>
                    )}

                    {/* Mensaje cuando no hay propiedades */}
                    {propiedades.data.length === 0 && (
                        <div className="text-center py-12">
                            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron propiedades</h3>
                            <p className="text-gray-500 mb-6">
                                Intenta ajustar los filtros para ver más resultados.
                            </p>
                            <button
                                onClick={limpiarFiltros}
                                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                            >
                                Limpiar Filtros
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </AsesorLayout>
    );
}
