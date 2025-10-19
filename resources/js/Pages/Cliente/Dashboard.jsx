import React, { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import ClienteLayout from '@/Layouts/ClienteLayout';

export default function Dashboard({ 
    estadisticas = {},
    preferencias = {},
    destacados = [],
    progreso = {},
    actividades = [],
    notificaciones = [],
    asesor = null,
    cliente = null
}) {
    const { auth } = usePage().props;

    return (
        <ClienteLayout header="Mi Dashboard">
            <Head title="Dashboard" />

            <div className="bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    
                    {/* ========== HERO PERSONALIZADO ========== */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 mb-8">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            {/* Saludo */}
                            <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-3">
                                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl shadow-md">
                                        👋
                                    </div>
                                    <div>
                                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                                            Hola, {cliente?.nombre || auth?.user?.name || 'Cliente'}
                                        </h1>
                                        <p className="text-gray-600 text-sm mt-1">
                                            Tu panel de búsqueda personalizado
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Notificaciones y CTAs */}
                            <div className="flex items-center space-x-3">
                                {notificaciones && notificaciones.length > 0 && (
                                    <div className="relative">
                                        <button className="w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center transition">
                                            <span className="text-xl">🔔</span>
                                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-md">
                                                {notificaciones.length}
                                            </span>
                                        </button>
                                    </div>
                                )}
                                <Link
                                    href="/catalogo"
                                    className="hidden md:flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium transition shadow-sm"
                                >
                                    <span>🔍</span>
                                    <span>Explorar Propiedades</span>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* ========== ESTADÍSTICAS PRINCIPALES (Más Grandes y Claras) ========== */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
                        {/* Favoritos */}
                        <Link
                            href="/cliente/favoritos"
                            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md hover:border-blue-300 transition-all group"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                                    ❤️
                                </div>
                            </div>
                            <div className="text-3xl font-bold text-gray-900 mb-1">
                                {estadisticas.favoritos_total || 0}
                            </div>
                            <div className="text-sm text-gray-600">
                                Favoritos
                            </div>
                            <div className="mt-3 text-xs text-blue-600 font-medium group-hover:translate-x-1 transition-transform">
                                Ver todos →
                            </div>
                        </Link>

                        {/* Solicitudes */}
                        <Link
                            href="/cliente/solicitudes"
                            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md hover:border-green-300 transition-all group"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                                    📋
                                </div>
                            </div>
                            <div className="text-3xl font-bold text-gray-900 mb-1">
                                {estadisticas.solicitudes_activas || 0}
                            </div>
                            <div className="text-sm text-gray-600">
                                Solicitudes Activas
                            </div>
                            <div className="mt-3 text-xs text-green-600 font-medium group-hover:translate-x-1 transition-transform">
                                Gestionar →
                            </div>
                        </Link>

                        {/* Reservas */}
                        <Link
                            href="/cliente/reservas"
                            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md hover:border-orange-300 transition-all group"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                                    ⭐
                                </div>
                            </div>
                            <div className="text-3xl font-bold text-gray-900 mb-1">
                                {estadisticas.reservas_activas || 0}
                            </div>
                            <div className="text-sm text-gray-600">
                                Reservas
                            </div>
                            <div className="mt-3 text-xs text-orange-600 font-medium group-hover:translate-x-1 transition-transform">
                                Ver estado →
                            </div>
                        </Link>

                        {/* Respondidas */}
                        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-md p-6 text-white">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-2xl">
                                    ✅
                                </div>
                            </div>
                            <div className="text-3xl font-bold mb-1">
                                {estadisticas.solicitudes_respondidas || 0}
                            </div>
                            <div className="text-sm text-blue-100">
                                Respondidas
                            </div>
                            <div className="mt-3 text-xs text-blue-100 font-medium">
                                Total procesadas
                            </div>
                        </div>
                    </div>

                    {/* ========== BÚSQUEDA PERSONALIZADA ========== */}
                    {preferencias && (preferencias.presupuesto_min || preferencias.zona_preferida) && (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                                    <span className="mr-2">🎯</span>
                                    Tu Búsqueda Personalizada
                                </h2>
                                <Link
                                    href="/cliente/perfil"
                                    className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1"
                                >
                                    <span>✏️</span>
                                    <span>Editar</span>
                                </Link>
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                {preferencias.tipo_propiedad && (
                                    <div className="bg-blue-50 rounded-xl p-4">
                                        <div className="text-xs text-blue-600 font-medium mb-1">Tipo</div>
                                        <div className="font-semibold text-gray-900 capitalize text-sm">
                                            🏠 {preferencias.tipo_propiedad}
                                        </div>
                                    </div>
                                )}
                                {preferencias.zona_preferida && (
                                    <div className="bg-green-50 rounded-xl p-4">
                                        <div className="text-xs text-green-600 font-medium mb-1">Zona</div>
                                        <div className="font-semibold text-gray-900 text-sm">
                                            📍 {preferencias.zona_preferida}
                                        </div>
                                    </div>
                                )}
                                {(preferencias.presupuesto_min || preferencias.presupuesto_max) && (
                                    <div className="bg-yellow-50 rounded-xl p-4">
                                        <div className="text-xs text-yellow-600 font-medium mb-1">Presupuesto</div>
                                        <div className="font-semibold text-gray-900 text-sm">
                                            💰 S/ {preferencias.presupuesto_min?.toLocaleString() || '0'} - {preferencias.presupuesto_max?.toLocaleString() || '∞'}
                                        </div>
                                    </div>
                                )}
                                {preferencias.habitaciones_deseadas && (
                                    <div className="bg-purple-50 rounded-xl p-4">
                                        <div className="text-xs text-purple-600 font-medium mb-1">Habitaciones</div>
                                        <div className="font-semibold text-gray-900 text-sm">
                                            🛏️ {preferencias.habitaciones_deseadas} hab
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                <div className="text-sm text-gray-600">
                                    <span className="font-semibold text-gray-900">{preferencias.resultados_en_rango || 0}</span> propiedades coinciden con tus criterios
                                </div>
                                <Link
                                    href="/catalogo"
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl transition font-medium shadow-sm flex items-center space-x-2"
                                >
                                    <span>Ver resultados</span>
                                    <span>→</span>
                                </Link>
                            </div>
                        </div>
                    )}

                    {/* ========== LAYOUT PRINCIPAL: CONTENIDO + SIDEBAR ========== */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                        
                        {/* COLUMNA PRINCIPAL (2/3) */}
                        <div className="lg:col-span-2 space-y-6 md:space-y-8">
                            
                            {/* PROGRESO DE BÚSQUEDA */}
                            {progreso && progreso.tareas && (
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                    <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                                        <span className="mr-2">📊</span>
                                        Tu Progreso de Búsqueda
                                    </h2>
                                    
                                    {/* Barra de Progreso Grande */}
                                    <div className="mb-6">
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-sm font-medium text-gray-700">Completado</span>
                                            <span className="text-2xl font-bold text-blue-600">{progreso.porcentaje || 0}%</span>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden shadow-inner">
                                            <div 
                                                className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-700 ease-out shadow-sm"
                                                style={{ width: `${progreso.porcentaje || 0}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    {/* Lista de Tareas Compacta */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {progreso.tareas.map((tarea, index) => (
                                            <div 
                                                key={index}
                                                className={`flex items-center space-x-3 p-3 rounded-xl transition-all ${
                                                    tarea.completada 
                                                        ? 'bg-green-50 border border-green-200' 
                                                        : 'bg-gray-50 border border-gray-200 hover:border-gray-300'
                                                }`}
                                            >
                                                <div className="text-xl flex-shrink-0">
                                                    {tarea.completada ? '✅' : '⏳'}
                                                </div>
                                                <span className={`text-sm flex-1 ${
                                                    tarea.completada 
                                                        ? 'text-green-800 font-medium' 
                                                        : 'text-gray-700'
                                                }`}>
                                                    {tarea.texto}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* RECOMENDACIONES PARA TI */}
                            {destacados && destacados.length > 0 && (
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-xl font-bold text-gray-900 flex items-center">
                                            <span className="mr-2">🔥</span>
                                            Recomendados Para Ti
                                        </h2>
                                        {destacados.length > 4 && (
                                            <Link
                                                href="/catalogo"
                                                className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center space-x-1"
                                            >
                                                <span>Ver todos</span>
                                                <span>→</span>
                                            </Link>
                                        )}
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                        {destacados.slice(0, 4).map((propiedad) => (
                                            <div key={propiedad.id} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg hover:border-blue-300 transition-all group">
                                                {/* Imagen */}
                                                <div className="relative h-48 bg-gray-100 overflow-hidden">
                                                    {propiedad.imagenes && propiedad.imagenes[0] ? (
                                                        <img 
                                                            src={propiedad.imagenes[0].ruta} 
                                                            alt={propiedad.titulo}
                                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                            <span className="text-6xl">🏢</span>
                                                        </div>
                                                    )}
                                                    
                                                    {/* Match Score - MÁS PROMINENTE */}
                                                    {propiedad.match_score && (
                                                        <div className="absolute top-3 left-3 bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center space-x-1 shadow-lg">
                                                            <span>⭐</span>
                                                            <span>{propiedad.match_score}%</span>
                                                        </div>
                                                    )}
                                                    
                                                    {/* Código */}
                                                    <div className="absolute top-3 right-3 bg-blue-600 text-white px-2 py-1 rounded-lg text-xs font-semibold shadow-md">
                                                        {propiedad.codigo}
                                                    </div>
                                                    
                                                    {/* Favorito */}
                                                    <button className="absolute bottom-3 right-3 w-10 h-10 bg-white/95 backdrop-blur-sm rounded-full hover:bg-white hover:scale-110 transition-all shadow-md flex items-center justify-center">
                                                        <span className="text-xl">
                                                            {propiedad.es_favorito ? '❤️' : '🤍'}
                                                        </span>
                                                    </button>
                                                </div>

                                                {/* Info */}
                                                <div className="p-4 md:p-5">
                                                    {/* Precio */}
                                                    <div className="text-2xl font-bold text-blue-600 mb-3">
                                                        S/ {propiedad.precio?.toLocaleString()}
                                                    </div>

                                                    {/* Título */}
                                                    <h4 className="font-bold text-gray-900 mb-2 text-base leading-snug line-clamp-1">
                                                        {propiedad.titulo || 'Departamento'}
                                                    </h4>
                                                    
                                                    {/* Ubicación */}
                                                    <p className="text-sm text-gray-600 mb-4 flex items-center line-clamp-1">
                                                        <span className="mr-1">📍</span>
                                                        {propiedad.ubicacion}
                                                    </p>

                                                    {/* Características */}
                                                    <div className="flex items-center justify-between text-sm text-gray-700 mb-4 py-3 border-t border-gray-100">
                                                        <div className="flex items-center space-x-1">
                                                            <span>🛏️</span>
                                                            <span className="font-medium">{propiedad.habitaciones}</span>
                                                        </div>
                                                        <div className="flex items-center space-x-1">
                                                            <span>🚿</span>
                                                            <span className="font-medium">{propiedad.banos}</span>
                                                        </div>
                                                        <div className="flex items-center space-x-1">
                                                            <span>📐</span>
                                                            <span className="font-medium">{propiedad.area}m²</span>
                                                        </div>
                                                    </div>

                                                    {/* CTAs */}
                                                    <div className="flex items-center space-x-2">
                                                        <Link
                                                            href={`/catalogo/${propiedad.id}`}
                                                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-center px-4 py-2.5 rounded-xl transition font-medium shadow-sm"
                                                        >
                                                            Ver detalles
                                                        </Link>
                                                        <button 
                                                            className="w-12 h-12 bg-green-50 hover:bg-green-100 text-green-600 rounded-xl transition flex items-center justify-center"
                                                            title="Contactar asesor"
                                                        >
                                                            <span className="text-xl">📞</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* SIDEBAR (1/3) */}
                        <div className="space-y-6">
                            
                            {/* ASESOR DESTACADO */}
                            {asesor && (
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                    <h3 className="text-lg font-bold text-gray-900 mb-5 flex items-center">
                                        <span className="mr-2">👤</span>
                                        Tu Asesor Personal
                                    </h3>
                                    <div className="flex items-center space-x-4 mb-5">
                                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-3xl shadow-md flex-shrink-0">
                                            👨‍💼
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="font-bold text-gray-900 text-base truncate">
                                                {asesor.usuario?.name || 'Asesor'}
                                            </div>
                                            <div className="text-sm text-gray-600 truncate">
                                                {asesor.especialidad || 'Asesor inmobiliario'}
                                            </div>
                                        </div>
                                    </div>
                                    <Link
                                        href="/cliente/asesores"
                                        className="block w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white text-center px-4 py-3 rounded-xl transition font-medium shadow-sm flex items-center justify-center space-x-2"
                                    >
                                        <span>💬</span>
                                        <span>Contactar Ahora</span>
                                    </Link>
                                </div>
                            )}

                            {/* ACTIVIDAD RECIENTE COMPACTA */}
                            {actividades && actividades.length > 0 && (
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                    <h3 className="text-lg font-bold text-gray-900 mb-5 flex items-center">
                                        <span className="mr-2">🕐</span>
                                        Actividad Reciente
                                    </h3>
                                    <div className="space-y-3">
                                        {actividades.slice(0, 5).map((actividad, index) => (
                                            <div key={index} className="flex items-start space-x-3 pb-3 border-b border-gray-100 last:border-0 last:pb-0">
                                                <div className="text-lg flex-shrink-0 mt-0.5">
                                                    {actividad.tipo === 'solicitud' && '📋'}
                                                    {actividad.tipo === 'favorito' && '❤️'}
                                                    {actividad.tipo === 'reserva' && '⭐'}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm text-gray-700 line-clamp-2 leading-snug">
                                                        {actividad.descripcion}
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {actividad.fecha}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* ACCESOS RÁPIDOS MEJORADOS */}
                            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-md p-6 text-white">
                                <h3 className="text-lg font-bold mb-4 flex items-center">
                                    <span className="mr-2">⚡</span>
                                    Accesos Rápidos
                                </h3>
                                <div className="space-y-2">
                                    <Link
                                        href="/catalogo"
                                        className="block bg-white/10 hover:bg-white/20 backdrop-blur-sm px-4 py-3 rounded-xl transition font-medium flex items-center space-x-3"
                                    >
                                        <span className="text-xl">🔍</span>
                                        <span>Explorar Catálogo</span>
                                    </Link>
                                    <Link
                                        href="/cliente/favoritos"
                                        className="block bg-white/10 hover:bg-white/20 backdrop-blur-sm px-4 py-3 rounded-xl transition font-medium flex items-center space-x-3"
                                    >
                                        <span className="text-xl">❤️</span>
                                        <span>Mis Favoritos</span>
                                    </Link>
                                    <Link
                                        href="/cliente/solicitudes"
                                        className="block bg-white/10 hover:bg-white/20 backdrop-blur-sm px-4 py-3 rounded-xl transition font-medium flex items-center space-x-3"
                                    >
                                        <span className="text-xl">📋</span>
                                        <span>Mis Solicitudes</span>
                                    </Link>
                                    <Link
                                        href="/cliente/perfil"
                                        className="block bg-white/10 hover:bg-white/20 backdrop-blur-sm px-4 py-3 rounded-xl transition font-medium flex items-center space-x-3"
                                    >
                                        <span className="text-xl">⚙️</span>
                                        <span>Mi Perfil</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* CTA FINAL - MOBILE */}
                    <div className="mt-8 lg:hidden bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-lg p-6 text-white text-center">
                        <h3 className="text-xl font-bold mb-2">¿Encontraste algo que te gusta?</h3>
                        <p className="text-blue-100 mb-4">Explora todo nuestro catálogo</p>
                        <Link
                            href="/catalogo"
                            className="inline-block bg-white text-blue-700 px-8 py-3 rounded-xl hover:bg-blue-50 transition font-bold shadow-md"
                        >
                            Ver Todas las Propiedades →
                        </Link>
                    </div>
                </div>
            </div>
        </ClienteLayout>
    );
}
