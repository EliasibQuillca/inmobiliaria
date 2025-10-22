import React from 'react';
import { Head, Link } from '@inertiajs/react';
import ClienteLayout from '@/Layouts/ClienteLayout';

export default function MiPanel({ 
    estadisticas = {},
    busqueda = {},
    recomendadas = [],
    favoritos_recientes = [],
    solicitudes = [],
    actividad_reciente = [],
    alertas = [],
    asesor = null,
    cliente = null
}) {
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('es-PE', {
            style: 'currency',
            currency: 'PEN',
        }).format(amount);
    };

    const getEstadoBadge = (estado) => {
        const badges = {
            'pendiente': { color: 'yellow', text: 'Pendiente', icon: '⏳' },
            'en_proceso': { color: 'blue', text: 'En Proceso', icon: '🔄' },
            'respondida': { color: 'green', text: 'Respondida', icon: '✅' },
            'cancelada': { color: 'red', text: 'Cancelada', icon: '❌' },
        };
        return badges[estado] || badges['pendiente'];
    };

    const getAlertColor = (tipo) => {
        const colors = {
            'success': 'green',
            'warning': 'yellow',
            'info': 'blue',
            'error': 'red',
        };
        return colors[tipo] || 'blue';
    };

    return (
        <ClienteLayout>
            <Head title="Mi Panel" />

            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    
                    {/* ================================================ */}
                    {/* HERO SECTION */}
                    {/* ================================================ */}
                    <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 rounded-2xl shadow-xl p-8 mb-8 text-white">
                        <div className="flex flex-col md:flex-row justify-between items-center">
                            <div className="mb-6 md:mb-0">
                                <h1 className="text-4xl font-bold mb-2">
                                    ¡Hola, {cliente?.nombre || 'Cliente'}! 👋
                                </h1>
                                <p className="text-blue-100 text-lg">
                                    Gestiona tus favoritos, solicitudes y más desde tu panel personal
                                </p>
                            </div>
                            
                            <div className="flex gap-4">
                                <Link 
                                    href="/cliente/dashboard"
                                    className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-200 shadow-lg flex items-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                    Buscar Propiedades
                                </Link>
                                
                                <Link 
                                    href="/cliente/favoritos"
                                    className="bg-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-600 transition-all duration-200 shadow-lg flex items-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                                    </svg>
                                    Mis Favoritos
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* ================================================ */}
                    {/* ALERTAS CONTEXTUALES */}
                    {/* ================================================ */}
                    {alertas && alertas.length > 0 && (
                        <div className="space-y-4 mb-8">
                            {alertas.map((alerta, index) => {
                                const color = getAlertColor(alerta.tipo);
                                const bgColors = {
                                    'green': 'bg-green-50 border-green-200',
                                    'yellow': 'bg-yellow-50 border-yellow-200',
                                    'blue': 'bg-blue-50 border-blue-200',
                                    'red': 'bg-red-50 border-red-200',
                                };
                                const textColors = {
                                    'green': 'text-green-800',
                                    'yellow': 'text-yellow-800',
                                    'blue': 'text-blue-800',
                                    'red': 'text-red-800',
                                };
                                const buttonColors = {
                                    'green': 'bg-green-600 hover:bg-green-700',
                                    'yellow': 'bg-yellow-600 hover:bg-yellow-700',
                                    'blue': 'bg-blue-600 hover:bg-blue-700',
                                    'red': 'bg-red-600 hover:bg-red-700',
                                };

                                return (
                                    <div key={index} className={`${bgColors[color]} border-l-4 p-4 rounded-r-lg shadow-sm`}>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <div className={`${textColors[color]} font-semibold text-lg mr-3`}>
                                                    {alerta.icono}
                                                </div>
                                                <div>
                                                    <h3 className={`${textColors[color]} font-bold`}>{alerta.titulo}</h3>
                                                    <p className={`${textColors[color]} text-sm mt-1`}>{alerta.mensaje}</p>
                                                </div>
                                            </div>
                                            
                                            {alerta.accion && (
                                                <Link 
                                                    href={alerta.accion_url}
                                                    className={`${buttonColors[color]} text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200`}
                                                >
                                                    {alerta.accion}
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* ================================================ */}
                    {/* ESTADÍSTICAS PRINCIPALES */}
                    {/* ================================================ */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {/* Favoritos */}
                        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-shadow duration-300">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 text-sm font-medium">Favoritos</p>
                                    <p className="text-3xl font-bold text-gray-800 mt-2">
                                        {estadisticas.propiedades_favoritas || 0}
                                    </p>
                                </div>
                                <div className="bg-red-100 p-4 rounded-full">
                                    <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Solicitudes */}
                        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-shadow duration-300">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 text-sm font-medium">Solicitudes</p>
                                    <p className="text-3xl font-bold text-gray-800 mt-2">
                                        {estadisticas.solicitudes_activas || 0}
                                    </p>
                                </div>
                                <div className="bg-orange-100 p-4 rounded-full">
                                    <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Mensajes */}
                        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-shadow duration-300">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 text-sm font-medium">Mensajes</p>
                                    <p className="text-3xl font-bold text-gray-800 mt-2">
                                        {estadisticas.mensajes_nuevos || 0}
                                    </p>
                                </div>
                                <div className="bg-purple-100 p-4 rounded-full">
                                    <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Citas */}
                        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-shadow duration-300">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 text-sm font-medium">Citas</p>
                                    <p className="text-3xl font-bold text-gray-800 mt-2">
                                        {estadisticas.citas_programadas || 0}
                                    </p>
                                </div>
                                <div className="bg-blue-100 p-4 rounded-full">
                                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Layout de 2 columnas: Contenido Principal + Sidebar */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        
                        {/* ================================================ */}
                        {/* COLUMNA PRINCIPAL (2/3) */}
                        {/* ================================================ */}
                        <div className="lg:col-span-2 space-y-8">
                            
                            {/* PROPIEDADES RECOMENDADAS */}
                            <div className="bg-white rounded-xl shadow-md p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                                        🏠 Propiedades Recomendadas para Ti
                                    </h2>
                                    <Link 
                                        href="/cliente/dashboard"
                                        className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                                    >
                                        Ver todas
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                        </svg>
                                    </Link>
                                </div>

                                {recomendadas && recomendadas.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {recomendadas.map((propiedad) => (
                                            <div key={propiedad.id} className="border rounded-lg hover:shadow-lg transition-shadow duration-200 overflow-hidden">
                                                <div className="h-48 bg-gray-200 relative">
                                                    {propiedad.imagen_principal ? (
                                                        <img 
                                                            src={propiedad.imagen_principal} 
                                                            alt={propiedad.titulo}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                                                            <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                                            </svg>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="p-4">
                                                    <h3 className="font-semibold text-lg text-gray-800 mb-2">
                                                        {propiedad.titulo}
                                                    </h3>
                                                    <p className="text-2xl font-bold text-blue-600 mb-2">
                                                        {formatCurrency(propiedad.precio)}
                                                    </p>
                                                    <div className="flex gap-4 text-sm text-gray-600 mb-3">
                                                        <span>{propiedad.habitaciones} hab • {propiedad.banos} baños • {propiedad.area} m²</span>
                                                    </div>
                                                    <Link 
                                                        href={`/catalogo/${propiedad.id}`}
                                                        className="block w-full text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                                                    >
                                                        Ver Detalles
                                                    </Link>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 text-center py-8">
                                        No hay propiedades recomendadas en este momento. 
                                        <Link href="/cliente/perfil" className="text-blue-600 hover:underline ml-1">
                                            Actualiza tus preferencias
                                        </Link> para obtener mejores recomendaciones.
                                    </p>
                                )}
                            </div>

                            {/* SOLICITUDES ACTIVAS */}
                            <div className="bg-white rounded-xl shadow-md p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold text-gray-800">
                                        📋 Solicitudes Activas
                                    </h2>
                                    <Link 
                                        href="/cliente/solicitudes"
                                        className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                                    >
                                        Ver todas
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                        </svg>
                                    </Link>
                                </div>

                                {solicitudes && solicitudes.length > 0 ? (
                                    <div className="space-y-4">
                                        {solicitudes.map((solicitud) => {
                                            const badge = getEstadoBadge(solicitud.estado);
                                            return (
                                                <div key={solicitud.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                                                    <div className="flex items-start justify-between mb-2">
                                                        <h3 className="font-semibold text-gray-800">
                                                            {solicitud.departamento?.titulo || 'Propiedad'}
                                                        </h3>
                                                        <span className={`px-3 py-1 rounded-full text-xs font-medium bg-${badge.color}-100 text-${badge.color}-800`}>
                                                            {badge.icon} {badge.text}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-gray-600 mb-3">
                                                        {solicitud.mensaje?.substring(0, 100)}...
                                                    </p>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs text-gray-500">
                                                            {new Date(solicitud.created_at).toLocaleDateString('es-PE')}
                                                        </span>
                                                        <Link 
                                                            href={`/cliente/solicitudes/${solicitud.id}`}
                                                            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                                                        >
                                                            Ver detalles →
                                                        </Link>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 text-center py-8">
                                        No tienes solicitudes activas.
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* ================================================ */}
                        {/* SIDEBAR (1/3) */}
                        {/* ================================================ */}
                        <div className="space-y-6">
                            
                            {/* TU BÚSQUEDA */}
                            <div className="bg-white rounded-xl shadow-md p-6">
                                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    🔍 Tu Búsqueda
                                </h3>
                                
                                {busqueda?.preferencias ? (
                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-xs text-gray-500">Tipo</p>
                                            <p className="font-medium text-gray-800">
                                                {busqueda.preferencias.tipo_propiedad || 'Cualquier tipo'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Zona</p>
                                            <p className="font-medium text-gray-800">
                                                {busqueda.preferencias.zona_preferida || 'Cualquier zona'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Presupuesto</p>
                                            <p className="font-medium text-gray-800">
                                                {busqueda.preferencias.presupuesto_min && busqueda.preferencias.presupuesto_max
                                                    ? `${formatCurrency(busqueda.preferencias.presupuesto_min)} - ${formatCurrency(busqueda.preferencias.presupuesto_max)}`
                                                    : 'No definido'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Habitaciones</p>
                                            <p className="font-medium text-gray-800">
                                                {busqueda.preferencias.habitaciones || 'Cualquiera'}
                                            </p>
                                        </div>

                                        <div className="pt-4 border-t">
                                            <div className="bg-blue-50 rounded-lg p-4 mb-3">
                                                <p className="text-sm text-gray-600 mb-1">Propiedades disponibles</p>
                                                <p className="text-3xl font-bold text-blue-600">
                                                    {busqueda.propiedades_en_rango || 0}
                                                </p>
                                                {busqueda.nuevas_propiedades > 0 && (
                                                    <p className="text-xs text-green-600 mt-1">
                                                        +{busqueda.nuevas_propiedades} nueva{busqueda.nuevas_propiedades > 1 ? 's' : ''} esta semana
                                                    </p>
                                                )}
                                            </div>
                                            
                                            <Link 
                                                href="/cliente/perfil"
                                                className="block w-full text-center bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors duration-200 text-sm"
                                            >
                                                ✏️ Editar preferencias
                                            </Link>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-4">
                                        <p className="text-gray-500 text-sm mb-3">No has definido preferencias</p>
                                        <Link 
                                            href="/cliente/perfil"
                                            className="text-blue-600 hover:text-blue-700 font-medium"
                                        >
                                            Configurar ahora →
                                        </Link>
                                    </div>
                                )}
                            </div>

                            {/* TU ASESOR */}
                            {asesor && (
                                <div className="bg-white rounded-xl shadow-md p-6">
                                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                        👤 Tu Asesor
                                    </h3>
                                    
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                            <span className="text-xl font-bold text-blue-600">
                                                {asesor.nombre?.charAt(0) || 'A'}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-800">{asesor.nombre}</p>
                                            <p className="text-xs text-gray-500">{asesor.email}</p>
                                        </div>
                                    </div>
                                    
                                    {asesor.telefono && (
                                        <a 
                                            href={`tel:${asesor.telefono}`}
                                            className="block w-full text-center bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 mb-2"
                                        >
                                            📞 Llamar
                                        </a>
                                    )}
                                    
                                    <Link 
                                        href="/cliente/solicitudes"
                                        className="block w-full text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                                    >
                                        💬 Enviar mensaje
                                    </Link>
                                </div>
                            )}

                            {/* ACTIVIDAD RECIENTE */}
                            <div className="bg-white rounded-xl shadow-md p-6">
                                <h3 className="text-lg font-bold text-gray-800 mb-4">
                                    ⏱️ Actividad Reciente
                                </h3>
                                
                                {actividad_reciente && actividad_reciente.length > 0 ? (
                                    <div className="space-y-3">
                                        {actividad_reciente.map((actividad, index) => (
                                            <div key={index} className="flex items-start gap-3 pb-3 border-b last:border-b-0">
                                                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                    <span className="text-sm">{actividad.icono}</span>
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm text-gray-800">{actividad.descripcion}</p>
                                                    <p className="text-xs text-gray-500 mt-1">{actividad.fecha}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 text-sm text-center py-4">
                                        No hay actividad reciente
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ClienteLayout>
    );
}
