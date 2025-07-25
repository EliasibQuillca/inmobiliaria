import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AsesorLayout from '../../../Layouts/AsesorLayout';

export default function DetallePropiedad({
    auth,
    propiedad,
    haCotizado,
    cotizacionesAsesor = [],
    propiedadesSimilares = []
}) {
    const [imagenActual, setImagenActual] = useState(0);

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

    const crearCotizacion = () => {
        router.get(route('asesor.cotizaciones.create'), {
            departamento_id: propiedad.id
        });
    };

    const siguienteImagen = () => {
        if (propiedad.imagenes && propiedad.imagenes.length > 0) {
            setImagenActual((prev) => (prev + 1) % propiedad.imagenes.length);
        }
    };

    const anteriorImagen = () => {
        if (propiedad.imagenes && propiedad.imagenes.length > 0) {
            setImagenActual((prev) => (prev - 1 + propiedad.imagenes.length) % propiedad.imagenes.length);
        }
    };

    return (
        <AsesorLayout user={auth.user}>
            <Head title={`Propiedad ${propiedad.codigo}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Breadcrumb */}
                    <nav className="flex mb-8" aria-label="Breadcrumb">
                        <ol className="inline-flex items-center space-x-1 md:space-x-3">
                            <li className="inline-flex items-center">
                                <Link
                                    href={route('asesor.propiedades')}
                                    className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600"
                                >
                                    Propiedades
                                </Link>
                            </li>
                            <li>
                                <div className="flex items-center">
                                    <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                    </svg>
                                    <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">
                                        {propiedad.codigo}
                                    </span>
                                </div>
                            </li>
                        </ol>
                    </nav>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Columna Principal */}
                        <div className="lg:col-span-2">
                            {/* Galería de Imágenes */}
                            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
                                {propiedad.imagenes && propiedad.imagenes.length > 0 ? (
                                    <div className="relative">
                                        <img
                                            src={`/storage/${propiedad.imagenes[imagenActual].ruta}`}
                                            alt={propiedad.codigo}
                                            className="w-full h-96 object-cover"
                                        />

                                        {propiedad.imagenes.length > 1 && (
                                            <>
                                                <button
                                                    onClick={anteriorImagen}
                                                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
                                                >
                                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={siguienteImagen}
                                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
                                                >
                                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                    </svg>
                                                </button>

                                                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                                                    {propiedad.imagenes.map((_, index) => (
                                                        <button
                                                            key={index}
                                                            onClick={() => setImagenActual(index)}
                                                            className={`w-3 h-3 rounded-full ${
                                                                index === imagenActual ? 'bg-white' : 'bg-white bg-opacity-50'
                                                            }`}
                                                        />
                                                    ))}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                ) : (
                                    <div className="w-full h-96 bg-gray-300 flex items-center justify-center">
                                        <svg className="w-24 h-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                )}
                            </div>

                            {/* Descripción */}
                            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Descripción</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {propiedad.descripcion || 'Esta propiedad no tiene descripción disponible.'}
                                </p>
                            </div>

                            {/* Características */}
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Características</h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    <div className="flex items-center space-x-2">
                                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2V7" />
                                        </svg>
                                        <span className="text-sm text-gray-600">{propiedad.habitaciones} Habitaciones</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                                        </svg>
                                        <span className="text-sm text-gray-600">{propiedad.banos} Baños</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                                        </svg>
                                        <span className="text-sm text-gray-600">{propiedad.area_construida} m²</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5" />
                                        </svg>
                                        <span className="text-sm text-gray-600">Piso {propiedad.piso}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                        <span className="text-sm text-gray-600">Vista: {propiedad.vista}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span className="text-sm text-gray-600">
                                            {propiedad.amoblado ? 'Amoblado' : 'Sin amoblar'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="lg:col-span-1">
                            {/* Información Principal */}
                            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                                <div className="flex justify-between items-start mb-4">
                                    <h1 className="text-2xl font-bold text-gray-900">
                                        {propiedad.codigo}
                                    </h1>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getEstadoColor(propiedad.estado)}`}>
                                        {propiedad.estado}
                                    </span>
                                </div>

                                <div className="space-y-3 mb-6">
                                    <div>
                                        <span className="text-sm text-gray-500">Tipo de Propiedad</span>
                                        <p className="font-medium text-gray-900 capitalize">{propiedad.tipo_propiedad}</p>
                                    </div>
                                    <div>
                                        <span className="text-sm text-gray-500">Dirección</span>
                                        <p className="font-medium text-gray-900">{propiedad.direccion}</p>
                                    </div>
                                    <div>
                                        <span className="text-sm text-gray-500">Número</span>
                                        <p className="font-medium text-gray-900">{propiedad.numero}</p>
                                    </div>
                                </div>

                                <div className="border-t pt-6">
                                    <div className="text-center">
                                        <span className="text-sm text-gray-500">Precio</span>
                                        <p className="text-3xl font-bold text-blue-600">
                                            {formatCurrency(propiedad.precio)}
                                        </p>
                                    </div>
                                </div>

                                {/* Acciones */}
                                <div className="mt-6 space-y-3">
                                    {propiedad.estado === 'disponible' && (
                                        <button
                                            onClick={crearCotizacion}
                                            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium"
                                        >
                                            Crear Cotización
                                        </button>
                                    )}

                                    <Link
                                        href={route('asesor.propiedades')}
                                        className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-lg font-medium text-center block"
                                    >
                                        Volver al Catálogo
                                    </Link>
                                </div>

                                {haCotizado && (
                                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                                        <div className="flex items-center">
                                            <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span className="text-sm text-blue-800 font-medium">
                                                Has cotizado esta propiedad
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Mis Cotizaciones para esta Propiedad */}
                            {cotizacionesAsesor.length > 0 && (
                                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Mis Cotizaciones</h3>
                                    <div className="space-y-3">
                                        {cotizacionesAsesor.map((cotizacion) => (
                                            <div key={cotizacion.id} className="border border-gray-200 rounded-lg p-3">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <p className="font-medium text-gray-900">
                                                            {cotizacion.cliente?.nombre}
                                                        </p>
                                                        <p className="text-sm text-gray-500">
                                                            {formatCurrency(cotizacion.monto - (cotizacion.descuento || 0))}
                                                        </p>
                                                    </div>
                                                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                                                        cotizacion.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
                                                        cotizacion.estado === 'aceptada' ? 'bg-green-100 text-green-800' :
                                                        'bg-red-100 text-red-800'
                                                    }`}>
                                                        {cotizacion.estado}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-gray-400 mt-1">
                                                    {new Date(cotizacion.created_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Propiedades Similares */}
                    {propiedadesSimilares.length > 0 && (
                        <div className="mt-12">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Propiedades Similares</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {propiedadesSimilares.map((similar) => (
                                    <div key={similar.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                                        <div className="aspect-w-16 aspect-h-9">
                                            {similar.imagenes && similar.imagenes.length > 0 ? (
                                                <img
                                                    src={`/storage/${similar.imagenes[0].ruta}`}
                                                    alt={similar.codigo}
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
                                        <div className="p-4">
                                            <h3 className="font-semibold text-gray-900 mb-2">{similar.codigo}</h3>
                                            <p className="text-sm text-gray-600 mb-2">
                                                {similar.habitaciones} hab • {similar.banos} baños • {similar.area_construida} m²
                                            </p>
                                            <p className="text-lg font-bold text-blue-600 mb-3">
                                                {formatCurrency(similar.precio)}
                                            </p>
                                            <Link
                                                href={route('asesor.propiedades.show', similar.id)}
                                                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium text-center block"
                                            >
                                                Ver Detalles
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AsesorLayout>
    );
}
