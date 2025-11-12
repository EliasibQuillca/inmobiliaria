import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import PublicLayout from '@/Layouts/PublicLayout';

export default function DetalleSolicitud({ auth, solicitud }) {
    const [showCancelModal, setShowCancelModal] = useState(false);
    const { flash } = usePage().props;

    const { patch, processing } = useForm({
        estado: 'cancelada'
    });

    const formatFecha = (fecha) => {
        return new Date(fecha).toLocaleDateString('es-PE', {
            year: 'numeric',
            month: 'long',
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
            'pendiente': 'bg-yellow-100 text-yellow-800 border-yellow-300',
            'en_proceso': 'bg-blue-100 text-blue-800 border-blue-300',
            'aprobada': 'bg-green-100 text-green-800 border-green-300',
            'rechazada': 'bg-red-100 text-red-800 border-red-300',
            'cancelada': 'bg-gray-100 text-gray-800 border-gray-300'
        };
        return badges[estado] || 'bg-gray-100 text-gray-800 border-gray-300';
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

    const getTipoConsultaTexto = (tipo) => {
        const textos = {
            'informacion': '📋 Información General',
            'visita': '🏠 Agendar Visita',
            'financiamiento': '💰 Financiamiento',
            'cotizacion': '📊 Cotización Formal'
        };
        return textos[tipo] || tipo;
    };

    const handleCancelar = () => {
        if (confirm('¿Estás seguro de cancelar esta solicitud? Esta acción no se puede deshacer.')) {
            patch(`/cliente/solicitudes/${solicitud.id}`, {
                preserveScroll: false,
                onSuccess: () => {
                    // Redirigir a la lista de solicitudes después de cancelar
                    window.location.href = '/cliente/solicitudes?mensaje=cancelada';
                }
            });
        }
    };

    return (
        <PublicLayout user={auth.user}>
            <Head title={`Solicitud #${solicitud.id}`} />

            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Mensaje de éxito */}
                    {flash?.success && (
                        <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg relative">
                            <span className="block sm:inline">{flash.success}</span>
                        </div>
                    )}

                    {/* Encabezado */}
                    <div className="mb-6">
                        <Link
                            href="/cliente/solicitudes"
                            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Volver a Mis Solicitudes
                        </Link>

                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">
                                    Solicitud #{solicitud.id}
                                </h1>
                                <p className="mt-1 text-gray-600">
                                    Creada el {formatFecha(solicitud.created_at)}
                                </p>
                            </div>
                            <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${getEstadoBadge(solicitud.estado)}`}>
                                {getEstadoTexto(solicitud.estado)}
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Columna Principal */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Información de la Solicitud */}
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h2 className="text-xl font-bold text-gray-900 mb-4">
                                    Detalles de la Solicitud
                                </h2>

                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm font-semibold text-gray-600">Tipo de Consulta</label>
                                        <p className="mt-1 text-gray-900">
                                            {getTipoConsultaTexto(solicitud.tipo_solicitud)}
                                        </p>
                                    </div>

                                    <div>
                                        <label className="text-sm font-semibold text-gray-600">Mensaje</label>
                                        <p className="mt-1 text-gray-900 whitespace-pre-wrap">
                                            {solicitud.mensaje_solicitud}
                                        </p>
                                    </div>

                                    {solicitud.monto > 0 && (
                                        <div>
                                            <label className="text-sm font-semibold text-gray-600">Monto Cotizado</label>
                                            <p className="mt-1 text-2xl font-bold text-green-600">
                                                {formatPrecio(solicitud.monto)}
                                            </p>
                                        </div>
                                    )}

                                    <div>
                                        <label className="text-sm font-semibold text-gray-600">Válida hasta</label>
                                        <p className="mt-1 text-gray-900">
                                            {formatFecha(solicitud.fecha_validez)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Información del Departamento */}
                            {solicitud.departamento && (
                                <div className="bg-white rounded-lg shadow-md p-6">
                                    <h2 className="text-xl font-bold text-gray-900 mb-4">
                                        Departamento
                                    </h2>

                                    <div className="flex gap-4">
                                        {solicitud.departamento.imagenes && solicitud.departamento.imagenes.length > 0 && (
                                            <img
                                                src={solicitud.departamento.imagenes[0].url}
                                                alt={solicitud.departamento.titulo}
                                                className="w-32 h-32 object-cover rounded-lg"
                                            />
                                        )}
                                        <div className="flex-1">
                                            <h3 className="text-lg font-bold text-gray-900">
                                                {solicitud.departamento.titulo}
                                            </h3>
                                            <p className="text-gray-600 mt-1">
                                                📍 {solicitud.departamento.ubicacion}
                                            </p>
                                            <p className="text-2xl font-bold text-blue-600 mt-2">
                                                {formatPrecio(solicitud.departamento.precio)}
                                            </p>
                                            <div className="flex gap-4 mt-2 text-sm text-gray-600">
                                                <span>🛏️ {solicitud.departamento.habitaciones} hab.</span>
                                                <span>🚿 {solicitud.departamento.banos} baños</span>
                                                <span>📐 {solicitud.departamento.area} m²</span>
                                            </div>
                                            <Link
                                                href={`/departamentos/${solicitud.departamento.id}`}
                                                className="inline-block mt-3 text-blue-600 hover:text-blue-800 text-sm font-semibold"
                                            >
                                                Ver detalles completos →
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Comentarios / Historial */}
                            {solicitud.comentarios && solicitud.comentarios.length > 0 && (
                                <div className="bg-white rounded-lg shadow-md p-6">
                                    <h2 className="text-xl font-bold text-gray-900 mb-4">
                                        💬 Historial de Comentarios
                                    </h2>

                                    <div className="space-y-4">
                                        {solicitud.comentarios.map((comentario) => (
                                            <div key={comentario.id} className="border-l-4 border-blue-500 pl-4 py-2">
                                                <div className="flex justify-between items-start">
                                                    <p className="font-semibold text-gray-900">
                                                        {comentario.usuario?.name || 'Sistema'}
                                                    </p>
                                                    <span className="text-xs text-gray-500">
                                                        {formatFecha(comentario.created_at)}
                                                    </span>
                                                </div>
                                                <p className="mt-1 text-gray-700">
                                                    {comentario.comentario}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Columna Lateral */}
                        <div className="space-y-6">
                            {/* Información del Asesor */}
                            {solicitud.asesor && (
                                <div className="bg-white rounded-lg shadow-md p-6">
                                    <h2 className="text-lg font-bold text-gray-900 mb-4">
                                        👤 Tu Asesor
                                    </h2>

                                    <div className="text-center">
                                        <div className="w-20 h-20 bg-blue-100 rounded-full mx-auto flex items-center justify-center mb-3">
                                            <span className="text-3xl">👨‍💼</span>
                                        </div>
                                        <h3 className="font-bold text-gray-900">
                                            {solicitud.asesor.nombre} {solicitud.asesor.apellidos}
                                        </h3>
                                        {solicitud.asesor.usuario && (
                                            <p className="text-sm text-gray-600 mt-1">
                                                ✉️ {solicitud.asesor.usuario.email}
                                            </p>
                                        )}
                                        {solicitud.asesor.telefono && (
                                            <p className="text-sm text-gray-600">
                                                📞 {solicitud.asesor.telefono}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Acciones */}
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h2 className="text-lg font-bold text-gray-900 mb-4">
                                    Acciones
                                </h2>

                                <div className="space-y-3">
                                    {(solicitud.estado === 'pendiente' || solicitud.estado === 'en_proceso') && (
                                        <button
                                            onClick={handleCancelar}
                                            disabled={processing}
                                            className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                        >
                                            {processing ? '⏳ Cancelando...' : '❌ Cancelar Solicitud'}
                                        </button>
                                    )}

                                    <Link
                                        href="/cliente/solicitudes"
                                        className="block w-full bg-gray-200 text-gray-800 text-center py-2 px-4 rounded-lg hover:bg-gray-300 transition"
                                    >
                                        📋 Ver Todas las Solicitudes
                                    </Link>

                                    <Link
                                        href="/catalogo"
                                        className="block w-full bg-blue-600 text-white text-center py-2 px-4 rounded-lg hover:bg-blue-700 transition"
                                    >
                                        🏢 Explorar Más Departamentos
                                    </Link>
                                </div>
                            </div>

                            {/* Información de Ayuda */}
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <h3 className="font-semibold text-blue-900 mb-2">
                                    💡 ¿Necesitas Ayuda?
                                </h3>
                                <p className="text-sm text-blue-800">
                                    Tu asesor te contactará pronto. Si tienes alguna duda urgente,
                                    puedes contactarlo directamente usando los datos de arriba.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
