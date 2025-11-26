import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import PublicLayout from '@/Layouts/PublicLayout';

export default function ClienteFavoritos({ auth, favoritos }) {
    const [favoritosLocales, setFavoritosLocales] = useState(favoritos);

    // Función para quitar de favoritos
    const quitarFavorito = async (departamentoId) => {
        try {
            await router.post('/cliente/favoritos/toggle', {
                departamento_id: departamentoId
            }, {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    // Actualizar estado local
                    setFavoritosLocales(prevFavoritos =>
                        prevFavoritos.filter(fav => fav.id !== departamentoId)
                    );
                },
                onError: (errors) => {
                    console.error('Error al quitar favorito:', errors);
                }
            });
        } catch (error) {
            console.error('Error:', error);
        }
    };
    // Formato de moneda
    const formatPrecio = (precio) => {
        return new Intl.NumberFormat('es-PE', {
            style: 'currency',
            currency: 'PEN',
            minimumFractionDigits: 0,
        }).format(precio);
    };

    // Formato de fecha
    const formatFecha = (fecha) => {
        return new Date(fecha).toLocaleDateString('es-PE', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <PublicLayout user={auth.user}>
            <Head title="Mis Favoritos - Inmobiliaria Imperial Cusco" />

            <div className="py-12 bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header Section */}
                    <div className="mb-8">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                            <div className="mb-4 sm:mb-0">
                                <h1 className="text-3xl font-bold text-gray-900">
                                    Mis Departamentos Favoritos
                                </h1>
                                <p className="mt-1 text-lg text-gray-600">
                                    Gestiona tus departamentos guardados y encuentra tu hogar ideal
                                </p>
                            </div>
                            <div className="flex space-x-3">
                                <Link
                                    href="/cliente/dashboard"
                                    className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                    </svg>
                                    Mi Panel
                                </Link>
                                <Link
                                    href="/cliente/catalogo"
                                    className="inline-flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                    </svg>
                                    Catálogo
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Stats Section */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white overflow-hidden shadow-sm rounded-lg border-l-4 border-red-500">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 bg-red-100 rounded-md p-3">
                                        <svg className="h-6 w-6 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                        </svg>
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-500">
                                            Total Favoritos
                                        </p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {favoritosLocales.length}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow-sm rounded-lg border-l-4 border-green-500">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                                        <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-500">
                                            Precio Promedio
                                        </p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {favoritosLocales.length > 0 ? formatPrecio(favoritosLocales.reduce((sum, fav) => sum + fav.precio, 0) / favoritosLocales.length) : 'S/ 0'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow-sm rounded-lg border-l-4 border-blue-500">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                                        <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-500">
                                            Área Promedio
                                        </p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {favoritosLocales.length > 0 ? Math.round(favoritosLocales.reduce((sum, fav) => sum + fav.area_total, 0) / favoritosLocales.length) : '0'}m²
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Favoritos Grid */}
                    {favoritosLocales.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                            {favoritosLocales.map((favorito) => (
                                <div key={favorito.id} className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
                                    {/* Imagen */}
                                    <div className="relative aspect-w-16 aspect-h-9 bg-gray-200">
                                        {favorito.imagenes && favorito.imagenes.length > 0 ? (
                                            <img
                                                src={favorito.imagenes[0].url.startsWith('http') ? favorito.imagenes[0].url : `/storage/${favorito.imagenes[0].url}`}
                                                alt={favorito.titulo || favorito.codigo}
                                                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        ) : (
                                            <div className="w-full h-64 bg-gradient-to-br from-gray-100 to-gray-300 flex items-center justify-center">
                                                <svg className="h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                                </svg>
                                            </div>
                                        )}
                                        {/* Badge de estado */}
                                        <div className="absolute top-4 left-4">
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                {favorito.estado}
                                            </span>
                                        </div>
                                        {/* Botón de eliminar favorito */}
                                        <div className="absolute top-4 right-4">
                                            <button
                                                onClick={() => quitarFavorito(favorito.id)}
                                                className="bg-white rounded-full p-2 shadow-md hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
                                                title="Quitar de favoritos"
                                            >
                                                <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Contenido */}
                                    <div className="p-6">
                                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 mb-2">
                                            {favorito.titulo}
                                        </h3>

                                        <p className="text-gray-600 mb-4 flex items-center">
                                            <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            {favorito.ubicacion}
                                        </p>

                                        {/* Características */}
                                        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                                            <div className="flex items-center space-x-4">
                                                <span className="flex items-center">
                                                    <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                                    </svg>
                                                    {favorito.habitaciones} hab.
                                                </span>
                                                <span className="flex items-center">
                                                    <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                                                    </svg>
                                                    {favorito.banos} baños
                                                </span>
                                                <span className="flex items-center">
                                                    <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5M20 16l-5-5m5 5v4m0 0h-4m4 0z" />
                                                    </svg>
                                                    {favorito.area_total}m²
                                                </span>
                                            </div>
                                        </div>

                                        {/* Precio y fecha guardado */}
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="text-2xl font-bold text-green-600">
                                                {formatPrecio(favorito.precio)}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                Guardado el {formatFecha(favorito.fecha_guardado)}
                                            </span>
                                        </div>

                                        {/* Botones de acción */}
                                        <div className="flex space-x-3">
                                            <Link
                                                href={`/catalogo/${favorito.id}`}
                                                className="flex-1 bg-blue-600 text-white text-center py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                                            >
                                                Ver Detalles
                                            </Link>
                                            <Link
                                                href={`/cliente/solicitudes/crear?departamento_id=${favorito.id}`}
                                                className="flex-1 bg-green-600 text-white text-center py-3 px-4 rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium"
                                            >
                                                📩 Solicitar Info
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <div className="flex justify-center mb-6">
                                <div className="h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center">
                                    <svg className="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                No tienes favoritos aún
                            </h3>
                            <p className="text-gray-500 mb-8 max-w-md mx-auto">
                                Explora nuestro catálogo de departamentos y guarda tus favoritos para encontrarlos fácilmente después.
                            </p>
                            <Link
                                href={"/catalogo"}
                                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                Explorar Departamentos
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </PublicLayout>
    );
}
