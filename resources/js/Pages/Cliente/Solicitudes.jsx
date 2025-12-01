import { Head, Link, usePage, router } from '@inertiajs/react';
import { useState } from 'react';
import PublicLayout from '@/Layouts/PublicLayout';

export default function Solicitudes({ auth, solicitudes }) {
    const { flash, aprobacionesPendientes } = usePage().props;
    const [filtroEstado, setFiltroEstado] = useState('activas'); // 'activas', 'todas', 'canceladas'

    // Estados para los modales
    const [showRechazarModal, setShowRechazarModal] = useState(false);
    const [showModificarModal, setShowModificarModal] = useState(false);
    const [solicitudSeleccionada, setSolicitudSeleccionada] = useState(null);
    const [motivoRechazo, setMotivoRechazo] = useState('');
    const [mensajeModificacion, setMensajeModificacion] = useState('');
    const [procesando, setProcesando] = useState(false);

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
        const estados = {
            pendiente: 'Pendiente',
            en_proceso: 'En Proceso',
            aprobada: 'Aprobada',
            cancelada: 'Cancelada',
        };
        return estados[estado] || estado;
    };

    // Funciones para manejar las acciones del cliente
    const handleAceptarCotizacion = (solicitudId) => {
        if (confirm('¿Estás seguro de aceptar esta cotización? Se procederá con la reserva.')) {
            setProcesando(true);
            router.post(`/cliente/solicitudes/${solicitudId}/aceptar`, {}, {
                onFinish: () => setProcesando(false),
            });
        }
    };

    const handleRechazarClick = (solicitud) => {
        setSolicitudSeleccionada(solicitud);
        setMotivoRechazo('');
        setShowRechazarModal(true);
    };

    const handleRechazarSubmit = () => {
        if (!motivoRechazo.trim()) {
            alert('Por favor, indica el motivo del rechazo');
            return;
        }
        setProcesando(true);
        router.post(`/cliente/solicitudes/${solicitudSeleccionada.id}/rechazar`, {
            motivo_rechazo: motivoRechazo
        }, {
            onFinish: () => {
                setProcesando(false);
                setShowRechazarModal(false);
                setSolicitudSeleccionada(null);
                setMotivoRechazo('');
            }
        });
    };

    const handleModificarClick = (solicitud) => {
        setSolicitudSeleccionada(solicitud);
        setMensajeModificacion('');
        setShowModificarModal(true);
    };

    const handleModificarSubmit = () => {
        if (!mensajeModificacion.trim()) {
            alert('Por favor, describe los cambios que solicitas');
            return;
        }
        setProcesando(true);
        router.post(`/cliente/solicitudes/${solicitudSeleccionada.id}/modificar`, {
            mensaje_modificacion: mensajeModificacion
        }, {
            onFinish: () => {
                setProcesando(false);
                setShowModificarModal(false);
                setSolicitudSeleccionada(null);
                setMensajeModificacion('');
            }
        });
    };    const getTipoConsultaIcon = (tipo) => {
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
            <Head title="Mis Solicitudes - Inmobiliaria Imperial Cusco" />

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
                        <div className="flex gap-3">
                            <Link
                                href="/cliente/aprobaciones"
                                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:from-orange-600 hover:to-red-700 transition-all duration-200 font-medium shadow-lg relative"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Aprobaciones
                                {aprobacionesPendientes > 0 && (
                                    <span className="absolute -top-2 -right-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full animate-pulse">
                                        {aprobacionesPendientes}
                                    </span>
                                )}
                            </Link>
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

                                        {/* Cotización del Asesor */}
                                        {solicitud.estado === 'en_proceso' && solicitud.monto && (
                                            <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border-2 border-blue-200">
                                                <h4 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
                                                    💰 Cotización del Asesor
                                                </h4>
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                                    <div className="bg-white rounded-lg p-3 shadow-sm">
                                                        <p className="text-xs text-gray-500 mb-1">Monto Base</p>
                                                        <p className="text-xl font-bold text-gray-900">
                                                            S/ {formatPrecio(solicitud.monto)}
                                                        </p>
                                                    </div>
                                                    {solicitud.descuento > 0 && (
                                                        <div className="bg-white rounded-lg p-3 shadow-sm">
                                                            <p className="text-xs text-gray-500 mb-1">Descuento</p>
                                                            <p className="text-xl font-bold text-green-600">
                                                                - {solicitud.descuento}%
                                                            </p>
                                                        </div>
                                                    )}
                                                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-3 shadow-md">
                                                        <p className="text-xs opacity-90 mb-1">Precio Final</p>
                                                        <p className="text-2xl font-bold">
                                                            S/ {formatPrecio(solicitud.monto * (1 - (solicitud.descuento || 0) / 100))}
                                                        </p>
                                                    </div>
                                                </div>

                                                {solicitud.condiciones && (
                                                    <div className="bg-white rounded-lg p-3 mb-3 shadow-sm">
                                                        <p className="text-sm font-semibold text-gray-700 mb-1">📋 Condiciones:</p>
                                                        <p className="text-sm text-gray-600">{solicitud.condiciones}</p>
                                                    </div>
                                                )}

                                                {solicitud.notas && (
                                                    <div className="bg-white rounded-lg p-3 mb-3 shadow-sm">
                                                        <p className="text-sm font-semibold text-gray-700 mb-1">📝 Notas:</p>
                                                        <p className="text-sm text-gray-600">{solicitud.notas}</p>
                                                    </div>
                                                )}

                                                {solicitud.fecha_validez && (
                                                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                                                        <p className="text-sm text-yellow-800">
                                                            ⏰ Válido hasta: <span className="font-semibold">{formatFecha(solicitud.fecha_validez)}</span>
                                                        </p>
                                                    </div>
                                                )}

                                                {/* Botones de acción */}
                                                <div className="flex flex-col sm:flex-row gap-3">
                                                    <button
                                                        onClick={() => handleAceptarCotizacion(solicitud.id)}
                                                        disabled={procesando}
                                                        className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        ✓ Aceptar Cotización
                                                    </button>
                                                    <button
                                                        onClick={() => handleModificarClick(solicitud)}
                                                        disabled={procesando}
                                                        className="flex-1 px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        ✏️ Solicitar Cambios
                                                    </button>
                                                    <button
                                                        onClick={() => handleRechazarClick(solicitud)}
                                                        disabled={procesando}
                                                        className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        ✗ Rechazar
                                                    </button>
                                                </div>
                                            </div>
                                        )}

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

            {/* Modal de Rechazo */}
            {showRechazarModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
                        <div className="flex items-center mb-4">
                            <div className="bg-red-100 rounded-full p-3 mr-3">
                                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">Rechazar Cotización</h3>
                        </div>

                        <p className="text-gray-600 mb-4">
                            Por favor, indica el motivo por el cual rechazas esta cotización:
                        </p>

                        <textarea
                            value={motivoRechazo}
                            onChange={(e) => setMotivoRechazo(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg p-3 mb-4 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            rows="4"
                            placeholder="Ej: El precio excede mi presupuesto..."
                        />

                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setShowRechazarModal(false);
                                    setSolicitudSeleccionada(null);
                                    setMotivoRechazo('');
                                }}
                                disabled={procesando}
                                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleRechazarSubmit}
                                disabled={procesando || !motivoRechazo.trim()}
                                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {procesando ? 'Rechazando...' : 'Confirmar Rechazo'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Modificación */}
            {showModificarModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
                        <div className="flex items-center mb-4">
                            <div className="bg-yellow-100 rounded-full p-3 mr-3">
                                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">Solicitar Modificaciones</h3>
                        </div>

                        <p className="text-gray-600 mb-4">
                            Describe los cambios que deseas en la cotización:
                        </p>

                        <textarea
                            value={mensajeModificacion}
                            onChange={(e) => setMensajeModificacion(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg p-3 mb-4 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                            rows="4"
                            placeholder="Ej: Me gustaría un mayor descuento o cambiar las condiciones de pago..."
                        />

                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setShowModificarModal(false);
                                    setSolicitudSeleccionada(null);
                                    setMensajeModificacion('');
                                }}
                                disabled={procesando}
                                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleModificarSubmit}
                                disabled={procesando || !mensajeModificacion.trim()}
                                className="flex-1 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {procesando ? 'Enviando...' : 'Enviar Solicitud'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </PublicLayout>
    );
}
