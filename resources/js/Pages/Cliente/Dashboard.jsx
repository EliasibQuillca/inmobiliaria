import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import { HomeIcon, HeartIcon, DocumentTextIcon, CalendarIcon, UserCircleIcon, ChartBarIcon, ClockIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

export default function Dashboard({ auth, cliente, solicitudes = [], favoritos = [], reservas = [], estadisticas, actividades_recientes = [], asesores_contacto = [] }) {
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
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <PublicLayout auth={auth} user={auth.user}>
            <Head title="Mi Panel - Inmobiliaria" />

            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Encabezado de Bienvenida Mejorado */}
                    <div className="mb-8 bg-white rounded-2xl shadow-sm p-8 border-l-4 border-blue-600">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    ¡Bienvenido, {cliente.nombre || auth.user.name}!
                                </h1>
                                <p className="mt-3 text-lg text-gray-600 flex items-center">
                                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                                    Tu viaje hacia tu hogar ideal comienza aquí
                                </p>
                            </div>
                            <div className="hidden md:block">
                                <div className="flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full">
                                    <UserCircleIcon className="h-16 w-16 text-white" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Estadísticas Rápidas con Diseño Moderno */}
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                        {/* Total Solicitudes */}
                        <div className="relative bg-white overflow-hidden shadow-md rounded-2xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 p-3 bg-blue-100 rounded-xl">
                                        <DocumentTextIcon className="h-8 w-8 text-blue-600" />
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">
                                                Mis Solicitudes
                                            </dt>
                                            <dd className="flex items-baseline">
                                                <div className="text-3xl font-bold text-gray-900">
                                                    {estadisticas?.total_solicitudes || 0}
                                                </div>
                                                {estadisticas?.total_solicitudes > 0 && (
                                                    <span className="ml-2 text-sm text-green-600 font-semibold">
                                                        Activas
                                                    </span>
                                                )}
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-3">
                                <Link href="/cliente/solicitudes" className="text-sm font-semibold text-white hover:text-blue-100 flex items-center justify-between">
                                    Ver todas
                                    <svg className="h-4 w-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </Link>
                            </div>
                        </div>

                        {/* Favoritos */}
                        <div className="relative bg-white overflow-hidden shadow-md rounded-2xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 p-3 bg-red-100 rounded-xl">
                                        <HeartIcon className="h-8 w-8 text-red-600" />
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">
                                                Favoritos
                                            </dt>
                                            <dd className="flex items-baseline">
                                                <div className="text-3xl font-bold text-gray-900">
                                                    {estadisticas?.favoritos_count || 0}
                                                </div>
                                                {estadisticas?.favoritos_count > 0 && (
                                                    <span className="ml-2 text-sm text-gray-600 font-semibold">
                                                        Guardados
                                                    </span>
                                                )}
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gradient-to-r from-red-500 to-pink-600 px-6 py-3">
                                <Link href="/cliente/favoritos" className="text-sm font-semibold text-white hover:text-red-100 flex items-center justify-between">
                                    Ver favoritos
                                    <svg className="h-4 w-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </Link>
                            </div>
                        </div>

                        {/* Cotizaciones */}
                        <div className="relative bg-white overflow-hidden shadow-md rounded-2xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 p-3 bg-green-100 rounded-xl">
                                        <ChartBarIcon className="h-8 w-8 text-green-600" />
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">
                                                Cotizaciones
                                            </dt>
                                            <dd className="flex items-baseline">
                                                <div className="text-3xl font-bold text-gray-900">
                                                    {estadisticas?.cotizaciones_recibidas || 0}
                                                </div>
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-3">
                                <span className="text-sm font-semibold text-white">
                                    Recibidas recientemente
                                </span>
                            </div>
                        </div>

                        {/* Reservas */}
                        <div className="relative bg-white overflow-hidden shadow-md rounded-2xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 p-3 bg-purple-100 rounded-xl">
                                        <CalendarIcon className="h-8 w-8 text-purple-600" />
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">
                                                Reservas Activas
                                            </dt>
                                            <dd className="flex items-baseline">
                                                <div className="text-3xl font-bold text-gray-900">
                                                    {estadisticas?.reservas_activas || 0}
                                                </div>
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gradient-to-r from-purple-500 to-indigo-600 px-6 py-3">
                                <span className="text-sm font-semibold text-white">
                                    En proceso
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Acciones Rápidas con Diseño Atractivo */}
                    <div className="bg-white shadow-lg rounded-2xl p-8 mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                            <svg className="h-6 w-6 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            Acciones Rápidas
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <Link
                                href="/catalogo"
                                className="group relative flex items-center justify-center px-6 py-4 border-2 border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105"
                            >
                                <HomeIcon className="h-6 w-6 mr-2 group-hover:scale-110 transition-transform" />
                                Explorar Catálogo
                                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 rounded-xl transition-opacity"></div>
                            </Link>
                            <Link
                                href="/cliente/favoritos"
                                className="group relative flex items-center justify-center px-6 py-4 border-2 border-red-300 rounded-xl shadow-md text-sm font-bold text-red-700 bg-white hover:bg-red-50 transition-all duration-300 transform hover:scale-105"
                            >
                                <HeartIcon className="h-6 w-6 mr-2 group-hover:scale-110 transition-transform" />
                                Mis Favoritos
                            </Link>
                            <Link
                                href="/cliente/perfil"
                                className="group relative flex items-center justify-center px-6 py-4 border-2 border-purple-300 rounded-xl shadow-md text-sm font-bold text-purple-700 bg-white hover:bg-purple-50 transition-all duration-300 transform hover:scale-105"
                            >
                                <UserCircleIcon className="h-6 w-6 mr-2 group-hover:scale-110 transition-transform" />
                                Mi Perfil
                            </Link>
                        </div>
                    </div>

                    {/* Contenido Principal - 2 Columnas */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Columna Izquierda - Solicitudes */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Últimas Solicitudes Mejoradas */}
                            <div className="bg-white shadow-lg rounded-2xl p-8">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                                        <DocumentTextIcon className="h-6 w-6 mr-3 text-blue-600" />
                                        Últimas Solicitudes
                                    </h2>
                                    {solicitudes.length > 0 && (
                                        <Link href="/cliente/solicitudes" className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center">
                                            Ver todas
                                            <svg className="h-4 w-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </Link>
                                    )}
                                </div>

                                {solicitudes.length === 0 ? (
                                    <div className="text-center py-12 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl">
                                        <div className="flex justify-center mb-4">
                                            <div className="p-4 bg-blue-100 rounded-full">
                                                <DocumentTextIcon className="h-12 w-12 text-blue-600" />
                                            </div>
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-900 mb-2">No tienes solicitudes</h3>
                                        <p className="text-gray-600 mb-6 max-w-sm mx-auto">
                                            Comienza explorando nuestro catálogo y encuentra tu hogar ideal
                                        </p>
                                        <Link
                                            href="/catalogo"
                                            className="inline-flex items-center px-6 py-3 border border-transparent shadow-md text-sm font-bold rounded-lg text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-105"
                                        >
                                            <HomeIcon className="h-5 w-5 mr-2" />
                                            Explorar Propiedades
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {solicitudes.map((solicitud) => (
                                            <div key={solicitud.id} className="group border-2 border-gray-200 rounded-xl p-5 hover:shadow-md hover:border-blue-300 transition-all duration-300">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <h3 className="text-base font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                                            {solicitud.departamento?.codigo || ''} - {solicitud.departamento?.titulo || 'Propiedad'}
                                                        </h3>
                                                        <div className="mt-2 flex items-center text-sm text-gray-600">
                                                            <UserCircleIcon className="h-4 w-4 mr-1 text-purple-500" />
                                                            <span>Asesor: <span className="font-semibold">{solicitud.asesor?.usuario?.name || 'Sin asignar'}</span></span>
                                                        </div>
                                                        <div className="mt-1 flex items-center text-xs text-gray-500">
                                                            <ClockIcon className="h-4 w-4 mr-1" />
                                                            {formatFecha(solicitud.created_at)}
                                                        </div>
                                                    </div>
                                                    <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold shadow-sm ${
                                                        solicitud.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800 border border-yellow-300' :
                                                        solicitud.estado === 'en_proceso' ? 'bg-blue-100 text-blue-800 border border-blue-300' :
                                                        solicitud.estado === 'aprobada' ? 'bg-green-100 text-green-800 border border-green-300' :
                                                        solicitud.estado === 'rechazada' ? 'bg-red-100 text-red-800 border border-red-300' :
                                                        'bg-gray-100 text-gray-800 border border-gray-300'
                                                    }`}>
                                                        {solicitud.estado === 'pendiente' ? '⏳ Pendiente' :
                                                         solicitud.estado === 'en_proceso' ? '🔄 En Proceso' :
                                                         solicitud.estado === 'aprobada' ? '✅ Aprobada' :
                                                         solicitud.estado === 'rechazada' ? '❌ Rechazada' :
                                                         solicitud.estado}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Columna Derecha - Favoritos */}
                        <div className="space-y-6">
                            {/* Favoritos Destacados Mejorados */}
                            <div className="bg-white shadow-lg rounded-2xl p-8">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-bold text-gray-900 flex items-center">
                                        <HeartIcon className="h-6 w-6 mr-2 text-red-600" />
                                        Favoritos
                                    </h2>
                                    {favoritos.length > 0 && (
                                        <Link href="/cliente/favoritos" className="text-sm font-semibold text-red-600 hover:text-red-700 flex items-center">
                                            Ver todos
                                            <svg className="h-4 w-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </Link>
                                    )}
                                </div>

                                {favoritos.length === 0 ? (
                                    <div className="text-center py-8 bg-gradient-to-br from-red-50 to-pink-50 rounded-xl">
                                        <div className="flex justify-center mb-3">
                                            <div className="p-3 bg-red-100 rounded-full">
                                                <HeartIcon className="h-10 w-10 text-red-600" />
                                            </div>
                                        </div>
                                        <p className="text-sm font-medium text-gray-600">
                                            No tienes favoritos aún
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Guarda propiedades que te gusten
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {favoritos.slice(0, 3).map((favorito) => (
                                            <Link
                                                key={favorito.id}
                                                href={`/departamentos/${favorito.id}`}
                                                className="group block border-2 border-gray-200 rounded-xl p-4 hover:shadow-md hover:border-red-300 transition-all duration-300"
                                            >
                                                <div className="flex items-start space-x-4">
                                                    {favorito.imagenes && favorito.imagenes[0] ? (
                                                        <img
                                                            src={favorito.imagenes[0].url.startsWith('http') ? favorito.imagenes[0].url : `/storage/${favorito.imagenes[0].url}`}
                                                            alt={favorito.titulo}
                                                            className="h-20 w-20 rounded-lg object-cover group-hover:scale-105 transition-transform shadow-md"
                                                        />
                                                    ) : (
                                                        <div className="h-20 w-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center shadow-md">
                                                            <HomeIcon className="h-10 w-10 text-gray-400" />
                                                        </div>
                                                    )}
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-bold text-gray-900 truncate group-hover:text-red-600 transition-colors">
                                                            {favorito.codigo}
                                                        </p>
                                                        <p className="text-xs text-gray-600 truncate mb-1">
                                                            {favorito.titulo}
                                                        </p>
                                                        <p className="text-sm text-blue-600 font-bold">
                                                            {formatPrecio(favorito.precio)}
                                                        </p>
                                                        <div className="flex items-center text-xs text-gray-500 mt-1 space-x-2">
                                                            <span>🛏️ {favorito.dormitorios}</span>
                                                            <span>•</span>
                                                            <span>🚿 {favorito.banos}</span>
                                                            <span>•</span>
                                                            <span>📐 {favorito.area_total}m²</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Asesores de Contacto Mejorados */}
                            {asesores_contacto.length > 0 && (
                                <div className="bg-white shadow-lg rounded-2xl p-8">
                                    <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                                        <UserCircleIcon className="h-6 w-6 mr-2 text-purple-600" />
                                        Tus Asesores
                                    </h2>
                                    <div className="space-y-4">
                                        {asesores_contacto.map((asesor) => (
                                            <div key={asesor.id} className="flex items-center space-x-4 p-4 border-2 border-gray-200 rounded-xl hover:border-purple-300 hover:shadow-md transition-all">
                                                <div className="flex-shrink-0">
                                                    {asesor.usuario?.avatar ? (
                                                        <img
                                                            src={asesor.usuario.avatar}
                                                            alt={asesor.usuario.name}
                                                            className="h-12 w-12 rounded-full ring-2 ring-purple-200"
                                                        />
                                                    ) : (
                                                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center ring-2 ring-purple-300">
                                                            <span className="text-purple-700 font-bold text-lg">
                                                                {asesor.usuario?.name?.charAt(0) || 'A'}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-bold text-gray-900">
                                                        {asesor.usuario?.name}
                                                    </p>
                                                    <p className="text-xs text-gray-600 truncate">
                                                        📧 {asesor.usuario?.email}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Información del Cliente Mejorada */}
                            <div className="bg-gradient-to-br from-blue-50 to-purple-50 shadow-lg rounded-2xl p-8 border border-blue-200">
                                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                                    <svg className="h-6 w-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Mi Cuenta
                                </h2>
                                <div className="space-y-4">
                                    <div className="bg-white bg-opacity-70 rounded-lg p-3">
                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Nombre</p>
                                        <p className="text-base font-bold text-gray-900">{cliente.nombre || auth.user.name}</p>
                                    </div>
                                    <div className="bg-white bg-opacity-70 rounded-lg p-3">
                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Email</p>
                                        <p className="text-sm font-semibold text-gray-900 truncate">{auth.user.email}</p>
                                    </div>
                                    {cliente?.dni && (
                                        <div className="bg-white bg-opacity-70 rounded-lg p-3">
                                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">DNI</p>
                                            <p className="text-base font-bold text-gray-900">{cliente.dni}</p>
                                        </div>
                                    )}
                                    {cliente?.telefono && (
                                        <div className="bg-white bg-opacity-70 rounded-lg p-3">
                                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Teléfono</p>
                                            <p className="text-sm font-semibold text-gray-900">{cliente.telefono}</p>
                                        </div>
                                    )}
                                    <div className="pt-4 border-t-2 border-blue-200">
                                        <Link
                                            href="/cliente/perfil"
                                            className="inline-flex items-center justify-center w-full px-5 py-3 text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-md"
                                        >
                                            <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                            Editar mi Perfil
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
