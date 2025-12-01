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
            <Head title="Mi Panel - Inmobiliaria Imperial Cusco" />

            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Encabezado de Bienvenida Mejorado */}
                    <div className="mb-8 bg-white rounded-2xl shadow-lg p-8 border-l-4 border-blue-600 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full blur-3xl opacity-30 -mr-32 -mt-32"></div>
                        <div className="relative z-10 flex items-center justify-between">
                            <div>
                                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">
                                    ¡Bienvenido, {cliente.nombre || auth.user.name}!
                                </h1>
                                <p className="mt-3 text-lg text-slate-600 flex items-center">
                                    <CheckCircleIcon className="h-5 w-5 text-blue-600 mr-2" />
                                    Tu viaje hacia tu hogar ideal comienza aquí
                                </p>
                            </div>
                            <div className="hidden md:block">
                                <div className="flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full shadow-lg">
                                    <UserCircleIcon className="h-16 w-16 text-white" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Estadísticas Rápidas con Diseño Moderno */}
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                        {/* Total Solicitudes */}
                        <div className="relative bg-white overflow-hidden shadow-lg rounded-2xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-blue-100">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                                        <DocumentTextIcon className="h-8 w-8 text-blue-600" />
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-slate-600 truncate">
                                                Mis Solicitudes
                                            </dt>
                                            <dd className="flex items-baseline">
                                                <div className="text-3xl font-bold text-slate-900">
                                                    {estadisticas?.total_solicitudes || 0}
                                                </div>
                                                {estadisticas?.total_solicitudes > 0 && (
                                                    <span className="ml-2 text-sm text-blue-600 font-semibold">
                                                        Activas
                                                    </span>
                                                )}
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-3">
                                <Link href="/cliente/solicitudes" className="text-sm font-semibold text-white hover:text-blue-50 flex items-center justify-between group">
                                    Ver todas
                                    <svg className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </Link>
                            </div>
                        </div>

                        {/* Favoritos */}
                        <div className="relative bg-white overflow-hidden shadow-lg rounded-2xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-indigo-100">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 p-3 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl">
                                        <HeartIcon className="h-8 w-8 text-indigo-600" />
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-slate-600 truncate">
                                                Favoritos
                                            </dt>
                                            <dd className="flex items-baseline">
                                                <div className="text-3xl font-bold text-slate-900">
                                                    {estadisticas?.favoritos_count || 0}
                                                </div>
                                                {estadisticas?.favoritos_count > 0 && (
                                                    <span className="ml-2 text-sm text-indigo-600 font-semibold">
                                                        Guardados
                                                    </span>
                                                )}
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 px-6 py-3">
                                <Link href="/cliente/favoritos" className="text-sm font-semibold text-white hover:text-indigo-50 flex items-center justify-between group">
                                    Ver favoritos
                                    <svg className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </Link>
                            </div>
                        </div>

                        {/* Cotizaciones */}
                        <div className="relative bg-white overflow-hidden shadow-lg rounded-2xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-cyan-100">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 p-3 bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-xl">
                                        <ChartBarIcon className="h-8 w-8 text-cyan-600" />
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-slate-600 truncate">
                                                Cotizaciones
                                            </dt>
                                            <dd className="flex items-baseline">
                                                <div className="text-3xl font-bold text-slate-900">
                                                    {estadisticas?.cotizaciones_recibidas || 0}
                                                </div>
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gradient-to-r from-cyan-500 to-cyan-600 px-6 py-3">
                                <span className="text-sm font-semibold text-white">
                                    Recibidas recientemente
                                </span>
                            </div>
                        </div>

                        {/* Reservas */}
                        <div className="relative bg-white overflow-hidden shadow-lg rounded-2xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-sky-100">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 p-3 bg-gradient-to-br from-sky-50 to-sky-100 rounded-xl">
                                        <CalendarIcon className="h-8 w-8 text-sky-600" />
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-slate-600 truncate">
                                                Reservas Activas
                                            </dt>
                                            <dd className="flex items-baseline">
                                                <div className="text-3xl font-bold text-slate-900">
                                                    {estadisticas?.reservas_activas || 0}
                                                </div>
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gradient-to-r from-sky-500 to-sky-600 px-6 py-3">
                                <span className="text-sm font-semibold text-white">
                                    En proceso
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Acciones Rápidas con Diseño Atractivo */}
                    <div className="bg-white shadow-lg rounded-2xl p-8 mb-8 border border-blue-100">
                        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                            <svg className="h-6 w-6 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            Acciones Rápidas
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <Link
                                href="/catalogo"
                                className="group relative flex items-center justify-center px-6 py-4 border-2 border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105"
                            >
                                <HomeIcon className="h-6 w-6 mr-2 group-hover:scale-110 transition-transform" />
                                Explorar Catálogo
                                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 rounded-xl transition-opacity"></div>
                            </Link>
                            <Link
                                href="/cliente/favoritos"
                                className="group relative flex items-center justify-center px-6 py-4 border-2 border-indigo-200 rounded-xl shadow-md text-sm font-bold text-indigo-700 bg-white hover:bg-indigo-50 transition-all duration-300 transform hover:scale-105"
                            >
                                <HeartIcon className="h-6 w-6 mr-2 group-hover:scale-110 transition-transform" />
                                Mis Favoritos
                            </Link>
                            <Link
                                href="/cliente/perfil"
                                className="group relative flex items-center justify-center px-6 py-4 border-2 border-blue-200 rounded-xl shadow-md text-sm font-bold text-blue-700 bg-white hover:bg-blue-50 transition-all duration-300 transform hover:scale-105"
                            >
                                <UserCircleIcon className="h-6 w-6 mr-2 group-hover:scale-110 transition-transform" />
                                Mi Perfil
                            </Link>
                        </div>
                    </div>

                    {/* Contenido Principal - 2 Columnas */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Columna Izquierda - Solicitudes (2/3 del ancho) */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Últimas Solicitudes Mejoradas */}
                            <div className="bg-white shadow-lg rounded-2xl p-8 border border-blue-100">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold text-slate-900 flex items-center">
                                        <DocumentTextIcon className="h-6 w-6 mr-3 text-blue-600" />
                                        Últimas Solicitudes
                                    </h2>
                                    {solicitudes.length > 0 && (
                                        <Link href="/cliente/solicitudes" className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center group">
                                            Ver todas
                                            <svg className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </Link>
                                    )}
                                </div>

                                {solicitudes.length === 0 ? (
                                    <div className="text-center py-12 bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50 rounded-xl">
                                        <div className="flex justify-center mb-4">
                                            <div className="p-4 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full">
                                                <DocumentTextIcon className="h-12 w-12 text-blue-600" />
                                            </div>
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-900 mb-2">No tienes solicitudes</h3>
                                        <p className="text-slate-600 mb-6 max-w-sm mx-auto">
                                            Comienza explorando nuestro catálogo y encuentra tu hogar ideal
                                        </p>
                                        <Link
                                            href="/catalogo"
                                            className="inline-flex items-center px-6 py-3 border border-transparent shadow-md text-sm font-bold rounded-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105"
                                        >
                                            <HomeIcon className="h-5 w-5 mr-2" />
                                            Explorar Propiedades
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {solicitudes.map((solicitud) => (
                                            <div key={solicitud.id} className="group border-2 border-slate-200 rounded-xl p-5 hover:shadow-md hover:border-blue-300 transition-all duration-300 bg-gradient-to-r from-white to-blue-50">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                                            {solicitud.departamento?.codigo || ''} - {solicitud.departamento?.titulo || 'Propiedad'}
                                                        </h3>
                                                        <div className="mt-2 flex items-center text-sm text-slate-600">
                                                            <UserCircleIcon className="h-4 w-4 mr-1 text-blue-500" />
                                                            <span>Asesor: <span className="font-semibold">{solicitud.asesor?.usuario?.name || 'Sin asignar'}</span></span>
                                                        </div>
                                                        <div className="mt-1 flex items-center text-xs text-slate-500">
                                                            <ClockIcon className="h-4 w-4 mr-1" />
                                                            {formatFecha(solicitud.created_at)}
                                                        </div>
                                                    </div>
                                                    <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold shadow-sm ${
                                                        solicitud.estado === 'pendiente' ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                                                        solicitud.estado === 'en_proceso' ? 'bg-blue-100 text-blue-800 border border-blue-300' :
                                                        solicitud.estado === 'aprobada' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                                                        solicitud.estado === 'rechazada' ? 'bg-rose-100 text-rose-800 border border-rose-300' :
                                                        'bg-slate-100 text-slate-800 border border-slate-300'
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

                            {/* Fila con Favoritos y Asesores lado a lado */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Favoritos */}
                                <div className="bg-white shadow-lg rounded-2xl p-8 border border-indigo-100">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-bold text-slate-900 flex items-center">
                                        <HeartIcon className="h-6 w-6 mr-2 text-indigo-600" />
                                        Favoritos
                                    </h2>
                                    {favoritos.length > 0 && (
                                        <Link href="/cliente/favoritos" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 flex items-center group">
                                            Ver todos
                                            <svg className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </Link>
                                    )}
                                </div>

                                {favoritos.length === 0 ? (
                                    <div className="text-center py-8 bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50 rounded-xl">
                                        <div className="flex justify-center mb-3">
                                            <div className="p-3 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-full">
                                                <HeartIcon className="h-10 w-10 text-indigo-600" />
                                            </div>
                                        </div>
                                        <p className="text-sm font-medium text-slate-600">
                                            No tienes favoritos aún
                                        </p>
                                        <p className="text-xs text-slate-500 mt-1">
                                            Guarda propiedades que te gusten
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {favoritos.slice(0, 3).map((favorito) => (
                                            <Link
                                                key={favorito.id}
                                                href={`/departamentos/${favorito.id}`}
                                                className="group block border-2 border-slate-200 rounded-xl p-4 hover:shadow-md hover:border-indigo-300 transition-all duration-300 bg-gradient-to-r from-white to-indigo-50"
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
                                                        <p className="text-sm font-bold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
                                                            {favorito.codigo}
                                                        </p>
                                                        <p className="text-xs text-slate-600 truncate mb-1">
                                                            {favorito.titulo}
                                                        </p>
                                                        <p className="text-sm text-blue-600 font-bold">
                                                            {formatPrecio(favorito.precio)}
                                                        </p>
                                                        <div className="flex items-center text-xs text-slate-500 mt-1 space-x-2">
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

                                {/* Asesores de Contacto */}
                                {asesores_contacto.length > 0 && (
                                    <div className="bg-white shadow-lg rounded-2xl p-8 border border-blue-100">
                                        <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
                                            <UserCircleIcon className="h-6 w-6 mr-2 text-blue-600" />
                                            Tus Asesores
                                        </h2>
                                        <div className="space-y-4">
                                            {asesores_contacto.map((asesor) => (
                                                <div key={asesor.id} className="flex items-center space-x-4 p-4 border-2 border-slate-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all bg-gradient-to-r from-white to-blue-50">
                                                    <div className="flex-shrink-0">
                                                        {asesor.usuario?.avatar ? (
                                                            <img
                                                                src={asesor.usuario.avatar}
                                                                alt={asesor.usuario.name}
                                                                className="h-12 w-12 rounded-full ring-2 ring-blue-200"
                                                            />
                                                        ) : (
                                                            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center ring-2 ring-blue-300">
                                                                <span className="text-blue-700 font-bold text-lg">
                                                                    {asesor.usuario?.name?.charAt(0) || 'A'}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-bold text-slate-900">
                                                            {asesor.usuario?.name}
                                                        </p>
                                                        <p className="text-xs text-slate-600 truncate">
                                                            📧 {asesor.usuario?.email}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Columna Derecha - Mi Cuenta (1/3 del ancho) */}
                        <div className="space-y-6">
                            {/* Información del Cliente Mejorada */}
                            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50 shadow-lg rounded-2xl p-8 border border-blue-200 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-200 to-indigo-200 rounded-full blur-2xl opacity-40 -mr-16 -mt-16"></div>
                                <div className="relative z-10">
                                    <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
                                        <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg mr-2">
                                            <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        Mi Cuenta
                                    </h2>
                                    
                                    {/* Foto de perfil centrada */}
                                    <div className="flex justify-center mb-6">
                                        <div className="relative">
                                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg ring-4 ring-white">
                                                <span className="text-3xl font-bold text-white">
                                                    {(cliente.nombre || auth.user.name)?.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                            <div className="absolute -bottom-2 -right-2 bg-green-500 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center">
                                                <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                                                </svg>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="bg-white bg-opacity-80 backdrop-blur-sm rounded-lg p-4 shadow-sm">
                                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1 flex items-center">
                                                <svg className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                                                </svg>
                                                Nombre Completo
                                            </p>
                                            <p className="text-base font-bold text-slate-900">{cliente.nombre || auth.user.name}</p>
                                        </div>
                                        <div className="bg-white bg-opacity-80 backdrop-blur-sm rounded-lg p-4 shadow-sm">
                                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1 flex items-center">
                                                <svg className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                                                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                                                </svg>
                                                Correo Electrónico
                                            </p>
                                            <p className="text-sm font-semibold text-slate-900 break-all">{auth.user.email}</p>
                                        </div>
                                        {cliente?.dni && (
                                            <div className="bg-white bg-opacity-80 backdrop-blur-sm rounded-lg p-4 shadow-sm">
                                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1 flex items-center">
                                                    <svg className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 2a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1zM4 4h3a3 3 0 006 0h3a2 2 0 012 2v9a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm2.5 7a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm2.45 4a2.5 2.5 0 10-4.9 0h4.9zM12 9a1 1 0 100 2h3a1 1 0 100-2h-3zm-1 4a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z" clipRule="evenodd"/>
                                                    </svg>
                                                    DNI
                                                </p>
                                                <p className="text-base font-bold text-slate-900">{cliente.dni}</p>
                                            </div>
                                        )}
                                        {cliente?.telefono && (
                                            <div className="bg-white bg-opacity-80 backdrop-blur-sm rounded-lg p-4 shadow-sm">
                                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1 flex items-center">
                                                    <svg className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                                                    </svg>
                                                    Teléfono
                                                </p>
                                                <p className="text-sm font-semibold text-slate-900">{cliente.telefono}</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Información adicional */}
                                    <div className="mt-6 p-4 bg-white bg-opacity-60 backdrop-blur-sm rounded-lg">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-slate-600">Estado de cuenta</span>
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800">
                                                <svg className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                                                </svg>
                                                Activa
                                            </span>
                                        </div>
                                    </div>

                                    <div className="pt-4 mt-4 border-t-2 border-blue-200">
                                        <Link
                                            href="/cliente/perfil"
                                            className="inline-flex items-center justify-center w-full px-5 py-3 text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 shadow-lg"
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
