import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import { HomeIcon, HeartIcon, DocumentTextIcon, CalendarIcon, UserCircleIcon, ChartBarIcon } from '@heroicons/react/24/outline';

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
        <PublicLayout user={auth.user}>
            <Head title="Mi Panel - Inmobiliaria" />

            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Encabezado de Bienvenida */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">
                            ¡Bienvenido, {auth.user.name}!
                        </h1>
                        <p className="mt-2 text-gray-600">
                            Aquí puedes gestionar tus propiedades favoritas, solicitudes y perfil.
                        </p>
                    </div>

                    {/* Estadísticas Rápidas */}
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                        {/* Total Solicitudes */}
                        <div className="bg-white overflow-hidden shadow-sm rounded-lg hover:shadow-md transition-shadow">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <DocumentTextIcon className="h-8 w-8 text-blue-500" />
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">
                                                Mis Solicitudes
                                            </dt>
                                            <dd className="flex items-baseline">
                                                <div className="text-2xl font-semibold text-gray-900">
                                                    {estadisticas?.total_solicitudes || 0}
                                                </div>
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-5 py-3">
                                <Link href="/cliente/solicitudes" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                                    Ver todas →
                                </Link>
                            </div>
                        </div>

                        {/* Favoritos */}
                        <div className="bg-white overflow-hidden shadow-sm rounded-lg hover:shadow-md transition-shadow">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <HeartIcon className="h-8 w-8 text-red-500" />
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">
                                                Favoritos
                                            </dt>
                                            <dd className="flex items-baseline">
                                                <div className="text-2xl font-semibold text-gray-900">
                                                    {estadisticas?.favoritos_count || 0}
                                                </div>
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-5 py-3">
                                <Link href="/cliente/favoritos" className="text-sm font-medium text-red-600 hover:text-red-500">
                                    Ver favoritos →
                                </Link>
                            </div>
                        </div>

                        {/* Cotizaciones */}
                        <div className="bg-white overflow-hidden shadow-sm rounded-lg hover:shadow-md transition-shadow">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <ChartBarIcon className="h-8 w-8 text-green-500" />
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">
                                                Cotizaciones
                                            </dt>
                                            <dd className="flex items-baseline">
                                                <div className="text-2xl font-semibold text-gray-900">
                                                    {estadisticas?.cotizaciones_recibidas || 0}
                                                </div>
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-5 py-3">
                                <span className="text-sm text-gray-500">
                                    Recibidas
                                </span>
                            </div>
                        </div>

                        {/* Reservas */}
                        <div className="bg-white overflow-hidden shadow-sm rounded-lg hover:shadow-md transition-shadow">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <CalendarIcon className="h-8 w-8 text-purple-500" />
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">
                                                Reservas Activas
                                            </dt>
                                            <dd className="flex items-baseline">
                                                <div className="text-2xl font-semibold text-gray-900">
                                                    {estadisticas?.reservas_activas || 0}
                                                </div>
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-5 py-3">
                                <span className="text-sm text-gray-500">
                                    En proceso
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Contenido Principal - 2 Columnas */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Columna Izquierda - Actividad Reciente y Solicitudes */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Acciones Rápidas */}
                            <div className="bg-white shadow-sm rounded-lg p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <Link
                                        href="/cliente/catalogo"
                                        className="flex items-center justify-center px-4 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                                    >
                                        <HomeIcon className="h-5 w-5 mr-2" />
                                        Explorar Catálogo
                                    </Link>
                                    <Link
                                        href="/cliente/favoritos"
                                        className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                                    >
                                        <HeartIcon className="h-5 w-5 mr-2" />
                                        Mis Favoritos
                                    </Link>
                                    <Link
                                        href="/cliente/perfil"
                                        className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                                    >
                                        <UserCircleIcon className="h-5 w-5 mr-2" />
                                        Mi Perfil
                                    </Link>
                                </div>
                            </div>

                            {/* Últimas Solicitudes */}
                            <div className="bg-white shadow-sm rounded-lg p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-lg font-semibold text-gray-900">Últimas Solicitudes</h2>
                                    {solicitudes.length > 0 && (
                                        <Link href="/cliente/solicitudes" className="text-sm text-blue-600 hover:text-blue-500">
                                            Ver todas
                                        </Link>
                                    )}
                                </div>

                                {solicitudes.length === 0 ? (
                                    <div className="text-center py-8">
                                        <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
                                        <h3 className="mt-2 text-sm font-medium text-gray-900">No tienes solicitudes</h3>
                                        <p className="mt-1 text-sm text-gray-500">
                                            Comienza explorando nuestro catálogo de propiedades.
                                        </p>
                                        <div className="mt-6">
                                            <Link
                                                href="/cliente/catalogo"
                                                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                                            >
                                                <HomeIcon className="h-5 w-5 mr-2" />
                                                Explorar Propiedades
                                            </Link>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {solicitudes.map((solicitud) => (
                                            <div key={solicitud.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <h3 className="text-sm font-medium text-gray-900">
                                                            {solicitud.departamento?.titulo || 'Propiedad'}
                                                        </h3>
                                                        <p className="mt-1 text-sm text-gray-500">
                                                            Asesor: {solicitud.asesor?.usuario?.name || 'Sin asignar'}
                                                        </p>
                                                        <p className="mt-1 text-xs text-gray-400">
                                                            {formatFecha(solicitud.created_at)}
                                                        </p>
                                                    </div>
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                        solicitud.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
                                                        solicitud.estado === 'en_proceso' ? 'bg-blue-100 text-blue-800' :
                                                        solicitud.estado === 'completada' ? 'bg-green-100 text-green-800' :
                                                        'bg-gray-100 text-gray-800'
                                                    }`}>
                                                        {solicitud.estado}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Actividades Recientes */}
                            {actividades_recientes.length > 0 && (
                                <div className="bg-white shadow-sm rounded-lg p-6">
                                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Actividad Reciente</h2>
                                    <div className="flow-root">
                                        <ul className="-mb-8">
                                            {actividades_recientes.map((actividad, idx) => (
                                                <li key={idx}>
                                                    <div className="relative pb-8">
                                                        {idx !== actividades_recientes.length - 1 && (
                                                            <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                                                        )}
                                                        <div className="relative flex space-x-3">
                                                            <div>
                                                                <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                                                                    <DocumentTextIcon className="h-5 w-5 text-white" />
                                                                </span>
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <div>
                                                                    <p className="text-sm text-gray-500">{actividad.descripcion}</p>
                                                                    <p className="mt-0.5 text-xs text-gray-400">{formatFecha(actividad.fecha)}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Columna Derecha - Favoritos y Asesores */}
                        <div className="space-y-6">
                            {/* Favoritos Destacados */}
                            <div className="bg-white shadow-sm rounded-lg p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-lg font-semibold text-gray-900">Favoritos Recientes</h2>
                                    {favoritos.length > 0 && (
                                        <Link href="/cliente/favoritos" className="text-sm text-red-600 hover:text-red-500">
                                            Ver todos
                                        </Link>
                                    )}
                                </div>

                                {favoritos.length === 0 ? (
                                    <div className="text-center py-6">
                                        <HeartIcon className="mx-auto h-10 w-10 text-gray-400" />
                                        <p className="mt-2 text-sm text-gray-500">
                                            No tienes favoritos aún
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {favoritos.slice(0, 3).map((favorito) => (
                                            <Link
                                                key={favorito.id}
                                                href={`/cliente/catalogo/${favorito.id}`}
                                                className="block border border-gray-200 rounded-lg p-3 hover:shadow-sm transition-shadow"
                                            >
                                                <div className="flex items-start space-x-3">
                                                    {favorito.imagenes && favorito.imagenes[0] ? (
                                                        <img
                                                            src={favorito.imagenes[0].url}
                                                            alt={favorito.titulo}
                                                            className="h-16 w-16 rounded object-cover"
                                                        />
                                                    ) : (
                                                        <div className="h-16 w-16 bg-gray-200 rounded flex items-center justify-center">
                                                            <HomeIcon className="h-8 w-8 text-gray-400" />
                                                        </div>
                                                    )}
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-gray-900 truncate">
                                                            {favorito.titulo}
                                                        </p>
                                                        <p className="text-sm text-blue-600 font-semibold">
                                                            {formatPrecio(favorito.precio)}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            {favorito.habitaciones} hab. • {favorito.banos} baños
                                                        </p>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Asesores de Contacto */}
                            {asesores_contacto.length > 0 && (
                                <div className="bg-white shadow-sm rounded-lg p-6">
                                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Tus Asesores</h2>
                                    <div className="space-y-3">
                                        {asesores_contacto.map((asesor) => (
                                            <div key={asesor.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                                                <div className="flex-shrink-0">
                                                    {asesor.usuario?.avatar ? (
                                                        <img
                                                            src={asesor.usuario.avatar}
                                                            alt={asesor.usuario.name}
                                                            className="h-10 w-10 rounded-full"
                                                        />
                                                    ) : (
                                                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                                            <span className="text-blue-600 font-medium text-sm">
                                                                {asesor.usuario?.name?.charAt(0) || 'A'}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-gray-900 truncate">
                                                        {asesor.usuario?.name}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {asesor.usuario?.email}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Información del Cliente */}
                            <div className="bg-white shadow-sm rounded-lg p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Mi Cuenta</h2>
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-xs text-gray-500">Nombre</p>
                                        <p className="text-sm font-medium text-gray-900">{auth.user.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Email</p>
                                        <p className="text-sm font-medium text-gray-900">{auth.user.email}</p>
                                    </div>
                                    {cliente?.dni && (
                                        <div>
                                            <p className="text-xs text-gray-500">DNI</p>
                                            <p className="text-sm font-medium text-gray-900">{cliente.dni}</p>
                                        </div>
                                    )}
                                    <div className="pt-3 border-t border-gray-200">
                                        <Link
                                            href="/cliente/perfil"
                                            className="text-sm text-blue-600 hover:text-blue-500 font-medium"
                                        >
                                            Editar perfil →
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
