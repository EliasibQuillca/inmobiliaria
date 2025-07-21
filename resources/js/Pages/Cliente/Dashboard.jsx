import { Head, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import Layout from '@/Components/Layout/Layout';

export default function ClienteDashboard({ auth }) {
    // Estado para las diferentes secciones del dashboard
    const [stats, setStats] = useState({
        solicitudesEnviadas: 0,
        cotizacionesRecibidas: 0,
        reservasActivas: 0,
        departamentosVistos: 0
    });

    // Datos simulados para demostración
    const [actividadesRecientes, setActividadesRecientes] = useState([
        {
            id: 1,
            tipo: 'solicitud',
            descripcion: 'Solicitud enviada: Departamento Magisterio 202',
            fecha: '2025-07-15',
        },
        {
            id: 2,
            tipo: 'cotizacion',
            descripcion: 'Cotización recibida: Departamento Magisterio 202',
            fecha: '2025-07-16',
            asesor: 'Juan Pérez'
        },
        {
            id: 3,
            tipo: 'visita',
            descripcion: 'Visita programada: Departamento Magisterio 202',
            fecha: '2025-07-22',
            asesor: 'Juan Pérez'
        },
    ]);

    // Datos simulados para departamentos favoritos
    const [favoritos, setFavoritos] = useState([
        {
            id: 1,
            nombre: 'Departamento Magisterio 202',
            ubicacion: 'Calle Magisterio 123, Sector A',
            precio: 150000,
            habitaciones: 3,
            baños: 2,
            imagen: '/img/departamento1.jpg'
        },
        {
            id: 2,
            nombre: 'Departamento Lima 305',
            ubicacion: 'Av. Lima 305, Sector B',
            precio: 180000,
            habitaciones: 3,
            baños: 2,
            imagen: '/img/departamento2.jpg'
        }
    ]);

    // Función para actualizar estadísticas
    useEffect(() => {
        // En una implementación real, estos datos vendrían de una API
        setStats({
            solicitudesEnviadas: 3,
            cotizacionesRecibidas: 2,
            reservasActivas: 1,
            departamentosVistos: 8
        });
    }, []);

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
            <Head title="Mi Panel - Inmobiliaria" />

            <div className="py-12 bg-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-gray-900">
                            Mi Panel
                        </h2>
                        <p className="mt-1 text-lg text-gray-600">
                            Gestiona tus solicitudes, cotizaciones y reservas
                        </p>
                    </div>

                    {/* Tarjetas de estadísticas */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white overflow-hidden shadow-sm rounded-lg border-l-4 border-blue-500">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                                        <svg className="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-2m-4-1v8m0 0l3-3m-3 3L9 8m-5 5h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293h3.172a1 1 0 00.707-.293l2.414-2.414a1 1 0 01.707-.293H20" />
                                        </svg>
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-500 truncate">
                                            Solicitudes Enviadas
                                        </p>
                                        <p className="text-2xl font-semibold text-gray-900">
                                            {stats.solicitudesEnviadas}
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <Link href="/cliente/solicitudes" className="text-sm text-blue-600 hover:text-blue-800">
                                        Ver mis solicitudes
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow-sm rounded-lg border-l-4 border-green-500">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                                        <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                        </svg>
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-500 truncate">
                                            Cotizaciones Recibidas
                                        </p>
                                        <p className="text-2xl font-semibold text-gray-900">
                                            {stats.cotizacionesRecibidas}
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <Link href="/cliente/cotizaciones" className="text-sm text-green-600 hover:text-green-800">
                                        Ver mis cotizaciones
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow-sm rounded-lg border-l-4 border-yellow-500">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 bg-yellow-100 rounded-md p-3">
                                        <svg className="h-6 w-6 text-yellow-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-500 truncate">
                                            Reservas Activas
                                        </p>
                                        <p className="text-2xl font-semibold text-gray-900">
                                            {stats.reservasActivas}
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <Link href="/cliente/reservas" className="text-sm text-yellow-600 hover:text-yellow-800">
                                        Ver mis reservas
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow-sm rounded-lg border-l-4 border-purple-500">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 bg-purple-100 rounded-md p-3">
                                        <svg className="h-6 w-6 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-500 truncate">
                                            Departamentos Vistos
                                        </p>
                                        <p className="text-2xl font-semibold text-gray-900">
                                            {stats.departamentosVistos}
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <Link href="/cliente/historial" className="text-sm text-purple-600 hover:text-purple-800">
                                        Ver mi historial
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Acciones rápidas */}
                    <div className="bg-white overflow-hidden shadow-md rounded-lg mb-8">
                        <div className="px-6 py-5 border-b border-gray-200">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">
                                Acciones Rápidas
                            </h3>
                        </div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Link href="/properties" className="flex items-center p-5 rounded-lg bg-white border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors">
                                <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                                    <svg className="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <h4 className="text-base font-medium text-gray-900">Explorar Departamentos</h4>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Descubre nuestros departamentos disponibles
                                    </p>
                                </div>
                            </Link>

                            <Link href="/cliente/solicitudes/crear" className="flex items-center p-5 rounded-lg bg-white border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors">
                                <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                                    <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <h4 className="text-base font-medium text-gray-900">Nueva Solicitud</h4>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Solicita información sobre un departamento
                                    </p>
                                </div>
                            </Link>

                            <Link href="/cliente/perfil" className="flex items-center p-5 rounded-lg bg-white border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors">
                                <div className="flex-shrink-0 bg-purple-100 rounded-md p-3">
                                    <svg className="h-6 w-6 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <h4 className="text-base font-medium text-gray-900">Actualizar Perfil</h4>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Actualiza tu información personal
                                    </p>
                                </div>
                            </Link>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                        {/* Actividades recientes */}
                        <div className="lg:col-span-2 bg-white overflow-hidden shadow-md rounded-lg">
                            <div className="px-6 py-5 border-b border-gray-200">
                                <h3 className="text-lg leading-6 font-medium text-gray-900">
                                    Actividad Reciente
                                </h3>
                            </div>
                            <div className="bg-white overflow-hidden">
                                <ul className="divide-y divide-gray-200">
                                    {actividadesRecientes.map((actividad) => (
                                        <li key={actividad.id} className="px-6 py-4">
                                            <div className="flex items-start">
                                                <div className={`flex-shrink-0 rounded-md p-2 ${
                                                    actividad.tipo === 'solicitud'
                                                    ? 'bg-blue-100 text-blue-600'
                                                    : actividad.tipo === 'cotizacion'
                                                    ? 'bg-green-100 text-green-600'
                                                    : 'bg-yellow-100 text-yellow-600'
                                                }`}>
                                                    {actividad.tipo === 'solicitud' && (
                                                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-2m-4-1v8m0 0l3-3m-3 3L9 8m-5 5h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293h3.172a1 1 0 00.707-.293l2.414-2.414a1 1 0 01.707-.293H20" />
                                                        </svg>
                                                    )}
                                                    {actividad.tipo === 'cotizacion' && (
                                                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                                        </svg>
                                                    )}
                                                    {actividad.tipo === 'visita' && (
                                                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                    )}
                                                </div>
                                                <div className="ml-4 flex-1">
                                                    <div className="flex items-center justify-between">
                                                        <p className="text-sm font-medium text-gray-900">
                                                            {actividad.descripcion}
                                                        </p>
                                                        <p className="text-sm text-gray-500">
                                                            {actividad.fecha}
                                                        </p>
                                                    </div>
                                                    {actividad.asesor && (
                                                        <div className="mt-1 text-sm text-gray-500">
                                                            Asesor: {actividad.asesor}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                                <Link href="/cliente/actividades" className="text-sm text-blue-600 hover:text-blue-800">
                                    Ver todas las actividades →
                                </Link>
                            </div>
                        </div>

                        {/* Departamentos favoritos */}
                        <div className="bg-white overflow-hidden shadow-md rounded-lg">
                            <div className="px-6 py-5 border-b border-gray-200">
                                <h3 className="text-lg leading-6 font-medium text-gray-900">
                                    Mis Favoritos
                                </h3>
                            </div>
                            <div className="p-6">
                                {favoritos.length > 0 ? (
                                    <div className="space-y-4">
                                        {favoritos.map(favorito => (
                                            <div key={favorito.id} className="flex flex-col border border-gray-200 rounded-lg overflow-hidden">
                                                <div className="h-40 bg-gray-300 relative">
                                                    <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                                                        <svg className="h-10 w-10" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div className="p-4">
                                                    <h4 className="font-medium text-gray-900">{favorito.nombre}</h4>
                                                    <p className="text-sm text-gray-500 mt-1">{favorito.ubicacion}</p>
                                                    <div className="mt-2 flex items-center text-sm text-gray-700">
                                                        <span className="font-medium text-gray-900">{formatPrecio(favorito.precio)}</span>
                                                        <span className="mx-2">•</span>
                                                        <span>{favorito.habitaciones} hab.</span>
                                                        <span className="mx-2">•</span>
                                                        <span>{favorito.baños} baños</span>
                                                    </div>
                                                    <div className="mt-3 flex justify-between">
                                                        <Link href={`/properties/${favorito.id}`} className="text-blue-600 hover:text-blue-800 text-sm">
                                                            Ver detalles
                                                        </Link>
                                                        <button className="text-red-600 hover:text-red-800 text-sm">
                                                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                                                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                        </svg>
                                        <h4 className="mt-2 text-sm font-medium text-gray-900">Sin favoritos</h4>
                                        <p className="mt-1 text-sm text-gray-500">
                                            Aún no has agregado departamentos a tu lista de favoritos
                                        </p>
                                        <div className="mt-6">
                                            <Link
                                                href="/properties"
                                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                            >
                                                Explorar departamentos
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
