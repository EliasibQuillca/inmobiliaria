import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import ClienteLayout from '@/Layouts/ClienteLayout';
import Card from '@/Components/DS/Card';
import Button from '@/Components/DS/Button';
import Badge from '@/Components/DS/Badge';

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

    const getEstadoVariant = (estado) => {
        const variants = {
            'pendiente': 'warning',
            'en_proceso': 'info',
            'aprobada': 'success',
            'rechazada': 'danger',
            'cancelada': 'default'
        };
        return variants[estado] || 'default';
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
        <ClienteLayout>
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
                        <div className="mb-4">
                            <Button
                                variant="ghost"
                                href="/cliente/solicitudes"
                                className="pl-0 text-blue-600 hover:text-blue-800 hover:bg-transparent"
                            >
                                ← Volver a Mis Solicitudes
                            </Button>
                        </div>

                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">
                                    Solicitud #{solicitud.id}
                                </h1>
                                <p className="mt-1 text-gray-600">
                                    Creada el {formatFecha(solicitud.created_at)}
                                </p>
                            </div>
                            <Badge variant={getEstadoVariant(solicitud.estado)} size="lg">
                                {getEstadoTexto(solicitud.estado)}
                            </Badge>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Columna Principal */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Información de la Solicitud */}
                            <Card>
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
                            </Card>

                            {/* Información del Departamento */}
                            {solicitud.departamento && (
                                <Card>
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
                                            <div className="mt-3">
                                                <Button
                                                    variant="link"
                                                    href={`/departamentos/${solicitud.departamento.id}`}
                                                    className="pl-0 text-blue-600"
                                                >
                                                    Ver detalles completos →
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            )}

                            {/* Comentarios / Historial */}
                            {solicitud.comentarios && solicitud.comentarios.length > 0 && (
                                <Card>
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
                                </Card>
                            )}
                        </div>

                        {/* Columna Lateral */}
                        <div className="space-y-6">
                            {/* Información del Asesor */}
                            {solicitud.asesor && (
                                <Card>
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
                                </Card>
                            )}

                            {/* Acciones */}
                            <Card>
                                <h2 className="text-lg font-bold text-gray-900 mb-4">
                                    Acciones
                                </h2>

                                <div className="space-y-3">
                                    {(solicitud.estado === 'pendiente' || solicitud.estado === 'en_proceso') && (
                                        <Button
                                            variant="danger"
                                            onClick={handleCancelar}
                                            disabled={processing}
                                            className="w-full justify-center"
                                        >
                                            {processing ? '⏳ Cancelando...' : '❌ Cancelar Solicitud'}
                                        </Button>
                                    )}

                                    <Button
                                        variant="secondary"
                                        href="/cliente/solicitudes"
                                        className="w-full justify-center"
                                    >
                                        📋 Ver Todas las Solicitudes
                                    </Button>

                                    <Button
                                        variant="primary"
                                        href="/catalogo"
                                        className="w-full justify-center"
                                    >
                                        🏢 Explorar Más Departamentos
                                    </Button>
                                </div>
                            </Card>

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
        </ClienteLayout>
    );
}
