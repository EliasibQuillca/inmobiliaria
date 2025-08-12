import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard({ auth, stats, recentCotizaciones, favoritos, solicitudes }) {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [animatedStats, setAnimatedStats] = useState(false);

    // Reloj en tiempo real
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // Animación de estadísticas
    useEffect(() => {
        const timer = setTimeout(() => {
            setAnimatedStats(true);
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    const formatTime = (date) => {
        return date.toLocaleTimeString('es-ES', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Dashboard Cliente" />
            
            {/* Hero Section con Gradiente Dinámico */}
            <div className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-blue-900 to-purple-900 text-white py-16 mb-8">
                <div className="absolute inset-0 bg-black opacity-20"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-5 animate-pulse"></div>
                
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <div className="inline-flex items-center px-4 py-2 bg-white bg-opacity-10 backdrop-blur-sm rounded-full mb-6">
                            <div className="w-3 h-3 bg-green-400 rounded-full mr-3 animate-pulse"></div>
                            <span className="font-mono text-sm">
                                En línea • {formatTime(currentTime)}
                            </span>
                        </div>
                        
                        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
                            ¡Bienvenido, {auth.user.name}!
                        </h1>
                        <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                            Tu portal personalizado para encontrar el departamento perfecto. 
                            Explora, solicita, y haz realidad tu nuevo hogar.
                        </p>
                        
                        <div className="flex flex-wrap justify-center gap-4">
                            <Link href="/cliente/departamentos" 
                                className="inline-flex items-center px-6 py-3 bg-white bg-opacity-20 backdrop-blur-sm border border-white border-opacity-30 rounded-lg hover:bg-opacity-30 transition-all duration-300 transform hover:scale-105">
                                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-9 9a1 1 0 001.414 1.414L2 12.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-4.586l.293.293a1 1 0 001.414-1.414l-9-9z"/>
                                </svg>
                                Explorar Departamentos
                            </Link>
                            <Link href="/cliente/solicitudes" 
                                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
                                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"/>
                                </svg>
                                Mis Solicitudes
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Panel de Estadísticas Animado */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className={`bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-xl border border-blue-200 shadow-lg transform transition-all duration-700 ${animatedStats ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-600 text-sm font-medium uppercase tracking-wider">Favoritos</p>
                                <p className="text-3xl font-bold text-blue-900 mt-2">
                                    {stats?.favoritos || 0}
                                </p>
                            </div>
                            <div className="bg-blue-500 bg-opacity-20 p-3 rounded-full">
                                <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"/>
                                </svg>
                            </div>
                        </div>
                        <div className="mt-4 flex items-center">
                            <span className="text-green-500 text-sm font-medium">
                                <svg className="w-4 h-4 inline mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"/>
                                </svg>
                                Propiedades guardadas
                            </span>
                        </div>
                    </div>

                    <div className={`bg-gradient-to-br from-purple-50 to-pink-100 p-6 rounded-xl border border-purple-200 shadow-lg transform transition-all duration-700 delay-100 ${animatedStats ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-purple-600 text-sm font-medium uppercase tracking-wider">Solicitudes</p>
                                <p className="text-3xl font-bold text-purple-900 mt-2">
                                    {stats?.solicitudes || 0}
                                </p>
                            </div>
                            <div className="bg-purple-500 bg-opacity-20 p-3 rounded-full">
                                <svg className="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"/>
                                </svg>
                            </div>
                        </div>
                        <div className="mt-4 flex items-center">
                            <span className="text-blue-500 text-sm font-medium">
                                Consultas enviadas
                            </span>
                        </div>
                    </div>

                    <div className={`bg-gradient-to-br from-green-50 to-emerald-100 p-6 rounded-xl border border-green-200 shadow-lg transform transition-all duration-700 delay-200 ${animatedStats ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-green-600 text-sm font-medium uppercase tracking-wider">Cotizaciones</p>
                                <p className="text-3xl font-bold text-green-900 mt-2">
                                    {stats?.cotizaciones || 0}
                                </p>
                            </div>
                            <div className="bg-green-500 bg-opacity-20 p-3 rounded-full">
                                <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"/>
                                </svg>
                            </div>
                        </div>
                        <div className="mt-4 flex items-center">
                            <span className="text-orange-500 text-sm font-medium">
                                Presupuestos activos
                            </span>
                        </div>
                    </div>

                    <div className={`bg-gradient-to-br from-orange-50 to-red-100 p-6 rounded-xl border border-orange-200 shadow-lg transform transition-all duration-700 delay-300 ${animatedStats ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-orange-600 text-sm font-medium uppercase tracking-wider">Reservas</p>
                                <p className="text-3xl font-bold text-orange-900 mt-2">
                                    {stats?.reservas || 0}
                                </p>
                            </div>
                            <div className="bg-orange-500 bg-opacity-20 p-3 rounded-full">
                                <svg className="w-8 h-8 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"/>
                                </svg>
                            </div>
                        </div>
                        <div className="mt-4 flex items-center">
                            <span className="text-red-500 text-sm font-medium">
                                Apartados confirmados
                            </span>
                        </div>
                    </div>
                </div>

                {/* Sección de Accesos Rápidos */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                    {/* Acciones Principales */}
                    <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Acciones Rápidas</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <Link href="/cliente/departamentos" 
                                className="group flex items-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-2 border-transparent hover:border-blue-200 transition-all duration-300">
                                <div className="bg-blue-100 p-3 rounded-lg group-hover:bg-blue-200 transition-colors">
                                    <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M10.707 2.293a1 1 0 00-1.414 0l-9 9a1 1 0 001.414 1.414L2 12.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-4.586l.293.293a1 1 0 001.414-1.414l-9-9z"/>
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <h3 className="font-semibold text-gray-900">Explorar</h3>
                                    <p className="text-sm text-gray-600">Ver departamentos</p>
                                </div>
                            </Link>

                            <Link href="/cliente/favoritos" 
                                className="group flex items-center p-4 bg-gradient-to-r from-pink-50 to-red-50 rounded-xl border-2 border-transparent hover:border-pink-200 transition-all duration-300">
                                <div className="bg-pink-100 p-3 rounded-lg group-hover:bg-pink-200 transition-colors">
                                    <svg className="w-6 h-6 text-pink-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"/>
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <h3 className="font-semibold text-gray-900">Favoritos</h3>
                                    <p className="text-sm text-gray-600">Tus preferidos</p>
                                </div>
                            </Link>

                            <Link href="/cliente/cotizaciones" 
                                className="group flex items-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-transparent hover:border-green-200 transition-all duration-300">
                                <div className="bg-green-100 p-3 rounded-lg group-hover:bg-green-200 transition-colors">
                                    <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"/>
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <h3 className="font-semibold text-gray-900">Cotizaciones</h3>
                                    <p className="text-sm text-gray-600">Mis presupuestos</p>
                                </div>
                            </Link>

                            <Link href="/cliente/reservas" 
                                className="group flex items-center p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border-2 border-transparent hover:border-purple-200 transition-all duration-300">
                                <div className="bg-purple-100 p-3 rounded-lg group-hover:bg-purple-200 transition-colors">
                                    <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"/>
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <h3 className="font-semibold text-gray-900">Reservas</h3>
                                    <p className="text-sm text-gray-600">Mis apartados</p>
                                </div>
                            </Link>
                        </div>
                    </div>

                    {/* Tips y Consejos */}
                    <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl shadow-lg border border-yellow-200 p-6">
                        <div className="flex items-center mb-4">
                            <div className="bg-yellow-100 p-2 rounded-lg">
                                <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"/>
                                </svg>
                            </div>
                            <h3 className="ml-3 text-lg font-semibold text-gray-900">Consejo del día</h3>
                        </div>
                        <div className="space-y-4">
                            <div className="bg-white bg-opacity-50 p-4 rounded-lg">
                                <h4 className="font-medium text-gray-800 mb-2">💡 Busca inteligentemente</h4>
                                <p className="text-sm text-gray-600">Usa los filtros para encontrar departamentos que se ajusten a tu presupuesto y ubicación preferida.</p>
                            </div>
                            <div className="bg-white bg-opacity-50 p-4 rounded-lg">
                                <h4 className="font-medium text-gray-800 mb-2">⭐ Guarda tus favoritos</h4>
                                <p className="text-sm text-gray-600">Marca como favoritos los departamentos que más te gusten para compararlos fácilmente.</p>
                            </div>
                            <div className="bg-white bg-opacity-50 p-4 rounded-lg">
                                <h4 className="font-medium text-gray-800 mb-2">📱 Mantente actualizado</h4>
                                <p className="text-sm text-gray-600">Revisa tus notificaciones para no perderte respuestas de los asesores.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actividad Reciente */}
                {(recentCotizaciones?.length > 0 || favoritos?.length > 0 || solicitudes?.length > 0) && (
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Actividad Reciente</h2>
                        
                        {recentCotizaciones?.length > 0 && (
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
                                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"/>
                                    </svg>
                                    Cotizaciones Recientes
                                </h3>
                                <div className="space-y-3">
                                    {recentCotizaciones.map((cotizacion) => (
                                        <div key={cotizacion.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                            <div>
                                                <p className="font-medium text-gray-900">{cotizacion.publicacion?.titulo || 'Departamento'}</p>
                                                <p className="text-sm text-gray-600">Estado: {cotizacion.estado}</p>
                                            </div>
                                            <span className="text-sm font-medium text-green-600">
                                                ${cotizacion.monto?.toLocaleString('es-MX')}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {favoritos?.length > 0 && (
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
                                    <svg className="w-5 h-5 text-pink-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"/>
                                    </svg>
                                    Favoritos Recientes
                                </h3>
                                <div className="space-y-3">
                                    {favoritos.slice(0, 3).map((favorito) => (
                                        <div key={favorito.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                            <div>
                                                <p className="font-medium text-gray-900">{favorito.publicacion?.titulo}</p>
                                                <p className="text-sm text-gray-600">{favorito.publicacion?.ubicacion}</p>
                                            </div>
                                            <Link href={`/cliente/departamentos/${favorito.publicacion?.id}`} 
                                                className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                                                Ver detalles
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Estado del Sistema */}
                <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="bg-green-100 p-3 rounded-full">
                                <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/>
                                </svg>
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-semibold text-gray-900">Sistema Operativo</h3>
                                <p className="text-gray-600">Todos los servicios funcionando correctamente</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-500">Última actualización</p>
                            <p className="font-mono text-sm text-gray-700">{formatTime(currentTime)}</p>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
