import { Head, Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import PublicLayout from '@/Layouts/PublicLayout';

export default function Solicitudes({ auth, solicitudes }) {
    const { flash } = usePage().props;
    const [filtroEstado, setFiltroEstado] = useState('activas'); // 'activas', 'todas', 'canceladas'

    const formatFecha = (fecha) => {
        return new Date(fecha).toLocaleDateString('es-PE', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatPrecio = (precio) => {
        return new Intl.NumberFormat('es-PE', {
            style: 'currency',
            currency: 'PEN',
            minimumFractionDigits: 0,
        }).format(precio);
    };

    const getEstadoBadge = (estado) => {
        const badges = {
            'pendiente': 'bg-yellow-100 text-yellow-800',
            'en_proceso': 'bg-blue-100 text-blue-800',
            'aprobada': 'bg-green-100 text-green-800',
            'rechazada': 'bg-red-100 text-red-800',
            'cancelada': 'bg-gray-100 text-gray-800'
        };
        return badges[estado] || 'bg-gray-100 text-gray-800';
    };

    const getEstadoTexto = (estado) => {
        const textos = {
            'pendiente': '⏳ Pendiente',
            'en_proceso': '🔄 En Proceso',
            'aprobada': '✅ Aprobada',
            'rechazada': '❌ Rechazada',
            'cancelada': '🚫 Cancelada'
        };
        return textos[estado] || estado;
    };

    const getTipoConsultaIcon = (tipo) => {
        const icons = {
            'informacion': '📋',
            'visita': '🏠',
            'financiamiento': '💰',
            'cotizacion': '📊'
        };
        return icons[tipo] || '📄';
    };

    return (
        <PublicLayout user={auth.user}>
            <Head title="Mis Solicitudes - Inmobiliaria" />

            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Encabezado */}
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900">
                                Mis Solicitudes
                            </h1>
                            <p className="mt-2 text-gray-600">
                                Gestiona tus consultas y solicitudes de información
                            </p>
                        </div>
                        <Link
                            href="/cliente/solicitudes/crear"
                            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Nueva Solicitud
                        </Link>
                    </div>

                    {/* Mensaje Flash de Éxito */}
                    {flash?.success && (
                        <div className="mb-6 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            {flash.success}
                        </div>
                    )}

                    {/* Filtros de Estado */}
                    <div className="mb-6 bg-white rounded-lg shadow p-2">
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => setFiltroEstado('activas')}
                                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                                    filtroEstado === 'activas'
                                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                🔵 Activas ({solicitudes.filter(s => !['cancelada', 'rechazada'].includes(s.estado)).length})
                            </button>
                            <button
                                onClick={() => setFiltroEstado('todas')}
                                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                                    filtroEstado === 'todas'
                                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                📋 Todas ({solicitudes.length})
                            </button>
                            <button
                                onClick={() => setFiltroEstado('canceladas')}
                                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                                    filtroEstado === 'canceladas'
                                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                ❌ Canceladas ({solicitudes.filter(s => s.estado === 'cancelada').length})
                            </button>
                        </div>
                    </div>

                    {/* Estadísticas */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 bg-blue-100 rounded-lg p-3">
                                    <span className="text-2xl">📨</span>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm text-gray-600">Total</p>
                                    <p className="text-2xl font-bold text-gray-900">{solicitudes.length}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 bg-yellow-100 rounded-lg p-3">
                                    <span className="text-2xl">⏳</span>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm text-gray-600">Pendientes</p>
                                    <p className="text-2xl font-bold text-yellow-600">
                                        {solicitudes.filter(s => s.estado === 'pendiente').length}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 bg-blue-100 rounded-lg p-3">
                                    <span className="text-2xl">🔄</span>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm text-gray-600">En Proceso</p>
                                    <p className="text-2xl font-bold text-blue-600">
                                        {solicitudes.filter(s => s.estado === 'en_proceso').length}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 bg-green-100 rounded-lg p-3">
                                    <span className="text-2xl">✅</span>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm text-gray-600">Aprobadas</p>
                                    <p className="text-2xl font-bold text-green-600">
                                        {solicitudes.filter(s => s.estado === 'aprobada').length}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Lista de Solicitudes */}
                    {(() => {
                        // Filtrar solicitudes según el estado seleccionado
                        const solicitudesFiltradas = solicitudes.filter(s => {
                            if (filtroEstado === 'activas') {
                                return !['cancelada', 'rechazada'].includes(s.estado);
                            } else if (filtroEstado === 'canceladas') {
                                return s.estado === 'cancelada';
                            }
                            return true; // 'todas'
                        });

                        return solicitudesFiltradas.length > 0 ? (
                        <div className="space-y-4">
                            {solicitudesFiltradas.map((solicitud) => (
                                <div key={solicitud.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                                    <div className="p-6">
                                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                                            {/* Info Principal */}
                                            <div className="flex-1 mb-4 lg:mb-0">
                                                <div className="flex items-center mb-2">
                                                    <span className="text-2xl mr-2">
                                                        {getTipoConsultaIcon(solicitud.tipo_solicitud)}
                                                    </span>
                                                    <h3 className="text-xl font-bold text-gray-900">
                                                        {solicitud.departamento?.titulo || 'Propiedad'}
                                                    </h3>
                                                    <span className={`ml-3 px-3 py-1 rounded-full text-xs font-semibold ${getEstadoBadge(solicitud.estado)}`}>
                                                        {getEstadoTexto(solicitud.estado)}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-600 mb-2">
                                                    📍 {solicitud.departamento?.direccion || 'N/A'}
                                                </p>
                                                <p className="text-sm text-gray-700 line-clamp-2">
                                                    {solicitud.mensaje_solicitud}
                                                </p>
                                            </div>

                                            {/* Info del Asesor */}
                                            {solicitud.asesor && (
                                                <div className="lg:ml-6 lg:border-l lg:pl-6">
                                                    <p className="text-xs text-gray-500 mb-1">Asesor asignado</p>
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
                                                            {solicitud.asesor.nombre?.charAt(0)}{solicitud.asesor.apellido?.charAt(0)}
                                                        </div>
                                                        <div className="ml-3">
                                                            <p className="font-semibold text-gray-900">
                                                                {solicitud.asesor.nombre} {solicitud.asesor.apellidos}
                                                            </p>
                                                            <p className="text-sm text-gray-600">
                                                                📧 {solicitud.asesor.usuario?.email}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Footer */}
                                        <div className="mt-4 pt-4 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3 sm:mb-0">
                                                <span>📅 {formatFecha(solicitud.created_at)}</span>
                                                {solicitud.comentarios && solicitud.comentarios.length > 0 && (
                                                    <span className="flex items-center">
                                                        💬 {solicitud.comentarios.length} comentario{solicitud.comentarios.length !== 1 ? 's' : ''}
                                                    </span>
                                                )}
                                            </div>
                                            <Link
                                                href={`/cliente/solicitudes/${solicitud.id}`}
                                                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
                                            >
                                                Ver Detalles
                                                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16 bg-white rounded-xl shadow">
                            <div className="flex justify-center mb-6">
                                <div className="bg-gray-100 rounded-full p-8">
                                    <span className="text-6xl">📭</span>
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                {filtroEstado === 'canceladas'
                                    ? 'No tienes solicitudes canceladas'
                                    : filtroEstado === 'activas'
                                    ? 'No tienes solicitudes activas'
                                    : 'No tienes solicitudes aún'
                                }
                            </h3>
                            <p className="text-gray-600 mb-6">
                                {filtroEstado === 'todas'
                                    ? 'Comienza explorando propiedades y solicita información'
                                    : 'Cambia el filtro para ver otras solicitudes'
                                }
                            </p>
                            {filtroEstado === 'todas' && (
                                <Link
                                    href="/cliente/catalogo"
                                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium"
                                >
                                    🏠 Ver Catálogo
                                </Link>
                            )}
                        </div>
                    );
                    })()}
                </div>
            </div>
        </PublicLayout>
    );
}
