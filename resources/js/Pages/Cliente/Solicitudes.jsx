import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function ClienteSolicitudes({ auth, solicitudes = [], cliente }) {
    
    // Función para formatear números como moneda
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('es-PE', {
            style: 'currency',
            currency: 'PEN'
        }).format(amount);
    };

    // Función para formatear fechas
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Función para obtener el color del estado
    const getEstadoColor = (estado) => {
        const colores = {
            'pendiente': 'bg-yellow-100 text-yellow-800',
            'aprobada': 'bg-green-100 text-green-800',
            'rechazada': 'bg-red-100 text-red-800',
            'en_revision': 'bg-blue-100 text-blue-800',
            'contactado': 'bg-purple-100 text-purple-800'
        };
        return colores[estado] || 'bg-gray-100 text-gray-800';
    };

    // Función para obtener el texto del estado
    const getEstadoTexto = (estado) => {
        const textos = {
            'pendiente': 'Pendiente',
            'aprobada': 'Aprobada',
            'rechazada': 'Rechazada',
            'en_revision': 'En Revisión',
            'contactado': 'Contactado'
        };
        return textos[estado] || estado;
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Mis Solicitudes
                    </h2>
                    <Link
                        href={route('cliente.solicitudes.create')}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Nueva Solicitud
                    </Link>
                </div>
            }
        >
            <Head title="Mis Solicitudes" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Estadísticas rápidas */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm text-gray-600">Total</p>
                                        <p className="text-2xl font-semibold">{solicitudes.length}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm text-gray-600">Pendientes</p>
                                        <p className="text-2xl font-semibold">
                                            {solicitudes.filter(s => s.estado === 'pendiente').length}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="p-3 rounded-full bg-green-100 text-green-600">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm text-gray-600">Aprobadas</p>
                                        <p className="text-2xl font-semibold">
                                            {solicitudes.filter(s => s.estado === 'aprobada').length}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                        </svg>
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm text-gray-600">En Proceso</p>
                                        <p className="text-2xl font-semibold">
                                            {solicitudes.filter(s => s.estado === 'en_revision').length}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Lista de Solicitudes */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-6">
                                Historial de Solicitudes
                            </h3>

                            {solicitudes && solicitudes.length > 0 ? (
                                <div className="space-y-6">
                                    {solicitudes.map((solicitud) => (
                                        <div key={solicitud.id} className="border border-gray-200 rounded-lg p-6">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-4 mb-2">
                                                        <h4 className="text-lg font-semibold text-gray-900">
                                                            {solicitud.departamento?.codigo || 'Departamento'}
                                                        </h4>
                                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getEstadoColor(solicitud.estado)}`}>
                                                            {getEstadoTexto(solicitud.estado)}
                                                        </span>
                                                        {/* Indicador de mensajes nuevos */}
                                                        {solicitud.comentarios && solicitud.comentarios.some(c => c.tipo === 'asesor' && !c.leido) && (
                                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                                <span className="w-2 h-2 bg-red-500 rounded-full mr-1"></span>
                                                                Mensajes nuevos
                                                            </span>
                                                        )}
                                                    </div>
                                                    
                                                    <p className="text-gray-600 mb-2">
                                                        {solicitud.departamento?.direccion}
                                                    </p>
                                                    
                                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                                        <span>Fecha: {formatDate(solicitud.created_at)}</span>
                                                        {solicitud.asesor && (
                                                            <span>Asesor: {solicitud.asesor.usuario.name}</span>
                                                        )}
                                                        {solicitud.comentarios && (
                                                            <span>💬 {solicitud.comentarios.length} mensajes</span>
                                                        )}
                                                    </div>
                                                </div>
                                                
                                                <div className="text-right">
                                                    {solicitud.departamento?.precio && (
                                                        <p className="text-xl font-bold text-blue-600 mb-2">
                                                            {formatCurrency(solicitud.departamento.precio)}
                                                        </p>
                                                    )}
                                                    {solicitud.monto_ofertado && solicitud.monto_ofertado > 0 && (
                                                        <p className="text-sm text-green-600">
                                                            Oferta: {formatCurrency(solicitud.monto_ofertado)}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Mensaje de solicitud */}
                                            {solicitud.mensaje_solicitud && (
                                                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                                                    <p className="text-sm text-gray-700">
                                                        <strong>Tu mensaje:</strong>
                                                    </p>
                                                    <p className="text-gray-900 mt-2">
                                                        {solicitud.mensaje_solicitud}
                                                    </p>
                                                </div>
                                            )}

                                            {/* Último comentario del asesor */}
                                            {solicitud.comentarios && solicitud.comentarios.length > 0 && (
                                                <div className="bg-blue-50 rounded-lg p-4 mb-4">
                                                    <p className="text-sm text-blue-700 mb-2">
                                                        <strong>Último mensaje:</strong>
                                                    </p>
                                                    {(() => {
                                                        const ultimoComentario = solicitud.comentarios[solicitud.comentarios.length - 1];
                                                        return (
                                                            <div>
                                                                <p className="text-blue-900">
                                                                    <strong>{ultimoComentario.tipo === 'cliente' ? 'Tú:' : 'Asesor:'}</strong> {ultimoComentario.comentario}
                                                                </p>
                                                                <p className="text-xs text-blue-600 mt-1">
                                                                    {formatDate(ultimoComentario.created_at)}
                                                                </p>
                                                            </div>
                                                        );
                                                    })()}
                                                </div>
                                            )}

                                            <div className="flex justify-end gap-2">
                                                <Link
                                                    href={route('cliente.solicitudes.comentarios', solicitud.id)}
                                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm"
                                                >
                                                    💬 Ver Conversación
                                                </Link>
                                                <Link
                                                    href={route('catalogo.show', solicitud.departamento?.id)}
                                                    className="text-blue-600 hover:text-blue-800 text-sm font-medium border border-blue-600 hover:border-blue-800 py-2 px-4 rounded"
                                                >
                                                    Ver Departamento
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                        No tienes solicitudes aún
                                    </h3>
                                    <p className="text-gray-600 mb-6">
                                        Explora nuestro catálogo y envía tu primera solicitud
                                    </p>
                                    <div className="space-x-4">
                                        <Link
                                            href={route('catalogo.index')}
                                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                        >
                                            Ver Catálogo
                                        </Link>
                                        <Link
                                            href={route('cliente.solicitudes.create')}
                                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                                        >
                                            Nueva Solicitud
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
