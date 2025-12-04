import { Head, Link } from '@inertiajs/react';
import ClienteLayout from '@/Layouts/ClienteLayout';
import Card from '@/Components/DS/Card';
import Button from '@/Components/DS/Button';
import Badge from '@/Components/DS/Badge';
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
        <ClienteLayout auth={auth} user={auth.user}>
            <Head title="Mi Panel - Inmobiliaria Imperial Cusco" />

            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Encabezado de Bienvenida Mejorado */}
                    <Card className="mb-8 border-l-4 border-primary-600 relative" noPadding>
                        <div className="p-8">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-50 rounded-full blur-3xl opacity-30 -mr-32 -mt-32"></div>
                            <div className="relative z-10 flex items-center justify-between">
                            <div>
                                <h1 className="text-4xl font-bold text-primary-700">
                                    ¡Bienvenido, {cliente?.nombre || auth.user.name}!
                                </h1>
                                <p className="mt-3 text-lg text-gray-600 flex items-center">
                                    <CheckCircleIcon className="h-5 w-5 text-primary-600 mr-2" />
                                    Tu viaje hacia tu hogar ideal comienza aquí
                                </p>
                            </div>
                            <div className="hidden md:block">
                                <div className="flex items-center justify-center w-24 h-24 bg-primary-600 rounded-full shadow-lg">
                                    <UserCircleIcon className="h-16 w-16 text-white" />
                                </div>
                            </div>
                        </div>
                        </div>
                    </Card>

                    {/* Estadísticas Rápidas con Diseño Moderno */}
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                        {/* Total Solicitudes */}
                        <Card noPadding className="hover:shadow-md transition-all duration-300 border-primary-100">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 p-3 bg-primary-50 rounded-xl">
                                        <DocumentTextIcon className="h-8 w-8 text-primary-600" />
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-600 truncate">
                                                Mis Solicitudes
                                            </dt>
                                            <dd className="flex items-baseline">
                                                <div className="text-3xl font-bold text-gray-900">
                                                    {estadisticas?.total_solicitudes || 0}
                                                </div>
                                                {estadisticas?.total_solicitudes > 0 && (
                                                    <span className="ml-2 text-sm text-primary-600 font-semibold">
                                                        Activas
                                                    </span>
                                                )}
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-primary-600 px-6 py-3">
                                <Link href="/cliente/solicitudes" className="text-sm font-semibold text-white hover:text-primary-50 flex items-center justify-between group">
                                    Ver todas
                                    <svg className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </Link>
                            </div>
                        </Card>

                        {/* Favoritos */}
                        <Card noPadding className="hover:shadow-md transition-all duration-300 border-secondary-100">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 p-3 bg-secondary-50 rounded-xl">
                                        <HeartIcon className="h-8 w-8 text-secondary-600" />
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-600 truncate">
                                                Favoritos
                                            </dt>
                                            <dd className="flex items-baseline">
                                                <div className="text-3xl font-bold text-gray-900">
                                                    {estadisticas?.favoritos_count || 0}
                                                </div>
                                                {estadisticas?.favoritos_count > 0 && (
                                                    <span className="ml-2 text-sm text-secondary-600 font-semibold">
                                                        Guardados
                                                    </span>
                                                )}
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-secondary-600 px-6 py-3">
                                <Link href="/cliente/favoritos" className="text-sm font-semibold text-white hover:text-secondary-50 flex items-center justify-between group">
                                    Ver favoritos
                                    <svg className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </Link>
                            </div>
                        </Card>

                        {/* Cotizaciones */}
                        <Card noPadding className="hover:shadow-md transition-all duration-300 border-success-100">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 p-3 bg-success-50 rounded-xl">
                                        <ChartBarIcon className="h-8 w-8 text-success-600" />
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-600 truncate">
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
                            <div className="bg-success-600 px-6 py-3">
                                <span className="text-sm font-semibold text-white">
                                    Recibidas recientemente
                                </span>
                            </div>
                        </Card>

                        {/* Reservas */}
                        <Card noPadding className="hover:shadow-md transition-all duration-300 border-warning-100">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 p-3 bg-warning-50 rounded-xl">
                                        <CalendarIcon className="h-8 w-8 text-warning-600" />
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-600 truncate">
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
                            <div className="bg-warning-600 px-6 py-3">
                                <span className="text-sm font-semibold text-white">
                                    En proceso
                                </span>
                            </div>
                        </Card>
                    </div>

                    {/* Acciones Rápidas con Diseño Atractivo */}
                    <Card className="mb-8 border-primary-100">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                            <svg className="h-6 w-6 mr-3 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            Acciones Rápidas
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <Button
                                href="/catalogo"
                                variant="primary"
                                className="w-full justify-center py-4 text-sm font-bold"
                            >
                                <HomeIcon className="h-6 w-6 mr-2" />
                                Explorar Catálogo
                            </Button>
                            <Button
                                href="/cliente/favoritos"
                                variant="secondary"
                                className="w-full justify-center py-4 text-sm font-bold"
                            >
                                <HeartIcon className="h-6 w-6 mr-2" />
                                Mis Favoritos
                            </Button>
                            <Button
                                href="/cliente/perfil"
                                variant="secondary"
                                className="w-full justify-center py-4 text-sm font-bold"
                            >
                                <UserCircleIcon className="h-6 w-6 mr-2" />
                                Mi Perfil
                            </Button>
                        </div>
                    </Card>

                    {/* Contenido Principal - 2 Columnas */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Columna Izquierda - Solicitudes (2/3 del ancho) */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Últimas Solicitudes Mejoradas */}
                            <Card>
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                                        <DocumentTextIcon className="h-6 w-6 mr-3 text-primary-600" />
                                        Últimas Solicitudes
                                    </h2>
                                    {solicitudes.length > 0 && (
                                        <Link href="/cliente/solicitudes" className="text-sm font-semibold text-primary-600 hover:text-primary-700 flex items-center group">
                                            Ver todas
                                            <svg className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </Link>
                                    )}
                                </div>

                                {solicitudes.length === 0 ? (
                                    <div className="text-center py-12 bg-gray-50 rounded-xl">
                                        <div className="flex justify-center mb-4">
                                            <div className="p-4 bg-primary-100 rounded-full">
                                                <DocumentTextIcon className="h-12 w-12 text-primary-600" />
                                            </div>
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-900 mb-2">No tienes solicitudes</h3>
                                        <p className="text-gray-600 mb-6 max-w-sm mx-auto">
                                            Comienza explorando nuestro catálogo y encuentra tu hogar ideal
                                        </p>
                                        <Button
                                            href="/catalogo"
                                            variant="primary"
                                        >
                                            <HomeIcon className="h-5 w-5 mr-2" />
                                            Explorar Propiedades
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {solicitudes.map((solicitud) => (
                                            <div key={solicitud.id} className="group border border-gray-200 rounded-xl p-5 hover:shadow-md hover:border-primary-300 transition-all duration-300 bg-white">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <h3 className="text-base font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                                                            {solicitud.departamento?.codigo || ''} - {solicitud.departamento?.titulo || 'Propiedad'}
                                                        </h3>
                                                        <div className="mt-2 flex items-center text-sm text-gray-600">
                                                            <UserCircleIcon className="h-4 w-4 mr-1 text-primary-500" />
                                                            <span>Asesor: <span className="font-semibold">{solicitud.asesor?.usuario?.name || 'Sin asignar'}</span></span>
                                                        </div>
                                                        <div className="mt-1 flex items-center text-xs text-gray-500">
                                                            <ClockIcon className="h-4 w-4 mr-1" />
                                                            {formatFecha(solicitud.created_at)}
                                                        </div>
                                                    </div>
                                                    <Badge variant={
                                                        solicitud.estado === 'pendiente' ? 'warning' :
                                                        solicitud.estado === 'en_proceso' ? 'info' :
                                                        solicitud.estado === 'aprobada' ? 'success' :
                                                        solicitud.estado === 'rechazada' ? 'danger' :
                                                        'secondary'
                                                    }>
                                                        {solicitud.estado === 'pendiente' ? '⏳ Pendiente' :
                                                         solicitud.estado === 'en_proceso' ? '🔄 En Proceso' :
                                                         solicitud.estado === 'aprobada' ? '✅ Aprobada' :
                                                         solicitud.estado === 'rechazada' ? '❌ Rechazada' :
                                                         solicitud.estado}
                                                    </Badge>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </Card>

                            {/* Fila con Favoritos y Asesores lado a lado */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Favoritos */}
                                <Card>
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-xl font-bold text-gray-900 flex items-center">
                                            <HeartIcon className="h-6 w-6 mr-2 text-secondary-600" />
                                            Favoritos
                                        </h2>
                                        {favoritos.length > 0 && (
                                            <Link href="/cliente/favoritos" className="text-sm font-semibold text-secondary-600 hover:text-secondary-700 flex items-center group">
                                                Ver todos
                                                <svg className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </Link>
                                        )}
                                    </div>

                                    {favoritos.length === 0 ? (
                                        <div className="text-center py-8 bg-gray-50 rounded-xl">
                                            <div className="flex justify-center mb-3">
                                                <div className="p-3 bg-secondary-100 rounded-full">
                                                    <HeartIcon className="h-10 w-10 text-secondary-600" />
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
                                                    className="group block border border-gray-200 rounded-xl p-4 hover:shadow-md hover:border-secondary-300 transition-all duration-300 bg-white"
                                                >
                                                    <div className="flex items-start space-x-4">
                                                        {favorito.imagenes && favorito.imagenes[0] ? (
                                                            <img
                                                                src={favorito.imagenes[0].url.startsWith('http') ? favorito.imagenes[0].url : `/storage/${favorito.imagenes[0].url}`}
                                                                alt={favorito.titulo}
                                                                className="h-20 w-20 rounded-lg object-cover group-hover:scale-105 transition-transform shadow-md"
                                                            />
                                                        ) : (
                                                            <div className="h-20 w-20 bg-gray-200 rounded-lg flex items-center justify-center shadow-md">
                                                                <HomeIcon className="h-10 w-10 text-gray-400" />
                                                            </div>
                                                        )}
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-bold text-gray-900 truncate group-hover:text-secondary-600 transition-colors">
                                                                {favorito.codigo}
                                                            </p>
                                                            <p className="text-xs text-gray-600 truncate mb-1">
                                                                {favorito.titulo}
                                                            </p>
                                                            <p className="text-sm text-primary-600 font-bold">
                                                                {formatPrecio(favorito.precio)}
                                                            </p>
                                                            <div className="flex items-center text-xs text-gray-500 mt-1 space-x-2">
                                                                <span>🛏️ {favorito.dormitorios}</span>
                                                                <span>•</span>
                                                                <span>🚿 {favorito.banos}</span>
                                                                <span>•</span>
                                                                <span>📐 {favorito.area}m²</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </Card>

                                {/* Asesores de Contacto */}
                                {asesores_contacto.length > 0 && (
                                    <Card>
                                        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                                            <UserCircleIcon className="h-6 w-6 mr-2 text-primary-600" />
                                            Tus Asesores
                                        </h2>
                                        <div className="space-y-4">
                                            {asesores_contacto.map((asesor) => (
                                                <div key={asesor.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-xl hover:border-primary-300 hover:shadow-md transition-all bg-white">
                                                    <div className="flex-shrink-0">
                                                        {asesor.usuario?.avatar ? (
                                                            <img
                                                                src={asesor.usuario.avatar}
                                                                alt={asesor.usuario.name}
                                                                className="h-12 w-12 rounded-full ring-2 ring-primary-200"
                                                            />
                                                        ) : (
                                                            <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center ring-2 ring-primary-300">
                                                                <span className="text-primary-700 font-bold text-lg">
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
                                    </Card>
                                )}
                            </div>
                        </div>

                        {/* Columna Derecha - Mi Cuenta (1/3 del ancho) */}
                        <div className="space-y-6">
                            {/* Información del Cliente Mejorada */}
                            <Card className="relative overflow-hidden border-primary-200">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary-100 rounded-full blur-2xl opacity-40 -mr-16 -mt-16"></div>
                                <div className="relative z-10">
                                    <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                                        <div className="p-2 bg-primary-600 rounded-lg mr-2">
                                            <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        Mi Cuenta
                                    </h2>
                                    
                                    {/* Foto de perfil centrada */}
                                    <div className="flex justify-center mb-6">
                                        <div className="relative">
                                            <div className="w-24 h-24 rounded-full bg-primary-600 flex items-center justify-center shadow-lg ring-4 ring-white">
                                                <span className="text-3xl font-bold text-white">
                                                    {(cliente.nombre || auth.user.name)?.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                            <div className="absolute -bottom-2 -right-2 bg-success-500 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center">
                                                <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                                                </svg>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
                                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 flex items-center">
                                                <svg className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                                                </svg>
                                                Nombre Completo
                                            </p>
                                            <p className="text-base font-bold text-gray-900">{cliente.nombre || auth.user.name}</p>
                                        </div>
                                        <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
                                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 flex items-center">
                                                <svg className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                                                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                                                </svg>
                                                Correo Electrónico
                                            </p>
                                            <p className="text-sm font-semibold text-gray-900 break-all">{auth.user.email}</p>
                                        </div>
                                        {cliente?.dni && (
                                            <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
                                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 flex items-center">
                                                    <svg className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 2a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1zM4 4h3a3 3 0 006 0h3a2 2 0 012 2v9a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm2.5 7a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm2.45 4a2.5 2.5 0 10-4.9 0h4.9zM12 9a1 1 0 100 2h3a1 1 0 100-2h-3zm-1 4a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z" clipRule="evenodd"/>
                                                    </svg>
                                                    DNI
                                                </p>
                                                <p className="text-base font-bold text-gray-900">{cliente.dni}</p>
                                            </div>
                                        )}
                                        {cliente?.telefono && (
                                            <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
                                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 flex items-center">
                                                    <svg className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                                                    </svg>
                                                    Teléfono
                                                </p>
                                                <p className="text-sm font-semibold text-gray-900">{cliente.telefono}</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Información adicional */}
                                    <div className="mt-6 p-4 bg-white border border-gray-100 rounded-lg">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-600">Estado de cuenta</span>
                                            <Badge variant="success">
                                                Activa
                                            </Badge>
                                        </div>
                                    </div>

                                    <div className="pt-4 mt-4 border-t border-gray-100">
                                        <Button
                                            href="/cliente/perfil"
                                            variant="primary"
                                            className="w-full justify-center"
                                        >
                                            <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                            Editar mi Perfil
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </ClienteLayout>
    );
}
