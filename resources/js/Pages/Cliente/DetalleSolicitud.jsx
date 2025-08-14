import { Head, Link, useForm } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function DetalleSolicitud({ auth, cotizacion, cliente }) {
    const [nuevoComentario, setNuevoComentario] = useState('');
    const comentariosRef = useRef(null);
    
    const { data, setData, post, processing, errors, reset } = useForm({
        comentario: '',
    });

    // Auto-scroll to bottom when new comments are added
    useEffect(() => {
        if (comentariosRef.current) {
            comentariosRef.current.scrollTop = comentariosRef.current.scrollHeight;
        }
    }, [cotizacion.comentarios]);

    // Función para formatear fechas
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Función para formatear moneda
    const formatCurrency = (amount) => {
        if (!amount) return 'No especificado';
        return new Intl.NumberFormat('es-PE', {
            style: 'currency',
            currency: 'PEN'
        }).format(amount);
    };

    // Función para obtener el color del estado
    const getEstadoColor = (estado) => {
        const colores = {
            'pendiente': 'bg-yellow-100 text-yellow-800',
            'en_revision': 'bg-blue-100 text-blue-800',
            'aprobada': 'bg-green-100 text-green-800',
            'rechazada': 'bg-red-100 text-red-800',
            'en_proceso': 'bg-purple-100 text-purple-800',
            'completada': 'bg-green-100 text-green-800'
        };
        return colores[estado] || 'bg-gray-100 text-gray-800';
    };

    // Manejar envío de comentario
    const handleSubmit = (e) => {
        e.preventDefault();
        
        post(route('cliente.solicitudes.comentarios.store', cotizacion.id), {
            onSuccess: () => {
                reset('comentario');
                setData('comentario', '');
            },
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Detalle de Solicitud
                    </h2>
                    <Link
                        href={"/cliente/solicitudes"}
                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                    >
                        ← Volver a Solicitudes
                    </Link>
                </div>
            }
        >
            <Head title="Detalle de Solicitud" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        
                        {/* Información de la Solicitud */}
                        <div className="lg:col-span-1">
                            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                                <div className="p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                        Información de la Solicitud
                                    </h3>
                                    
                                    {/* Estado */}
                                    <div className="mb-4">
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getEstadoColor(cotizacion.estado)}`}>
                                            {cotizacion.estado.replace('_', ' ').toUpperCase()}
                                        </span>
                                    </div>

                                    {/* Departamento */}
                                    <div className="border-t pt-4">
                                        <h4 className="font-semibold text-gray-900 mb-2">Departamento</h4>
                                        <p className="text-lg font-bold text-blue-600">
                                            {cotizacion.departamento?.codigo}
                                        </p>
                                        <p className="text-gray-600">
                                            {cotizacion.departamento?.direccion}
                                        </p>
                                        <p className="text-xl font-bold text-green-600 mt-2">
                                            {formatCurrency(cotizacion.departamento?.precio)}
                                        </p>
                                    </div>

                                    {/* Asesor Asignado */}
                                    {cotizacion.asesor && (
                                        <div className="border-t pt-4 mt-4">
                                            <h4 className="font-semibold text-gray-900 mb-2">Asesor Asignado</h4>
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                                                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <p className="font-semibold">{cotizacion.asesor.usuario.name}</p>
                                                    <p className="text-sm text-gray-600">{cotizacion.asesor.usuario.email}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Fechas */}
                                    <div className="border-t pt-4 mt-4">
                                        <div className="grid grid-cols-1 gap-2 text-sm">
                                            <div>
                                                <span className="font-medium">Fecha de solicitud:</span>
                                                <span className="ml-2 text-gray-600">{formatDate(cotizacion.created_at)}</span>
                                            </div>
                                            {cotizacion.updated_at !== cotizacion.created_at && (
                                                <div>
                                                    <span className="font-medium">Última actualización:</span>
                                                    <span className="ml-2 text-gray-600">{formatDate(cotizacion.updated_at)}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Oferta */}
                                    {cotizacion.monto_ofertado && cotizacion.monto_ofertado > 0 && (
                                        <div className="border-t pt-4 mt-4">
                                            <h4 className="font-semibold text-gray-900 mb-2">Tu Oferta</h4>
                                            <p className="text-2xl font-bold text-green-600">
                                                {formatCurrency(cotizacion.monto_ofertado)}
                                            </p>
                                        </div>
                                    )}

                                    {/* Mensaje Original */}
                                    {cotizacion.mensaje_solicitud && (
                                        <div className="border-t pt-4 mt-4">
                                            <h4 className="font-semibold text-gray-900 mb-2">Tu Mensaje Inicial</h4>
                                            <div className="bg-gray-50 rounded-lg p-3">
                                                <p className="text-gray-700 text-sm">
                                                    {cotizacion.mensaje_solicitud}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Chat de Comentarios */}
                        <div className="lg:col-span-2">
                            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg h-96 lg:h-[600px] flex flex-col">
                                
                                {/* Header del Chat */}
                                <div className="bg-gray-50 px-6 py-4 border-b">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Conversación con tu Asesor
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        {cotizacion.comentarios?.length || 0} mensajes
                                    </p>
                                </div>

                                {/* Área de Comentarios */}
                                <div 
                                    ref={comentariosRef}
                                    className="flex-1 overflow-y-auto p-6 space-y-4"
                                    style={{ minHeight: '300px' }}
                                >
                                    {cotizacion.comentarios && cotizacion.comentarios.length > 0 ? (
                                        cotizacion.comentarios.map((comentario, index) => (
                                            <div key={index} className={`flex ${comentario.tipo === 'cliente' ? 'justify-end' : 'justify-start'}`}>
                                                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                                    comentario.tipo === 'cliente' 
                                                        ? 'bg-blue-500 text-white' 
                                                        : 'bg-gray-200 text-gray-800'
                                                }`}>
                                                    <div className="flex items-center mb-1">
                                                        <span className="text-xs font-medium">
                                                            {comentario.tipo === 'cliente' ? 'Tú' : comentario.usuario.name}
                                                        </span>
                                                        {comentario.tipo === 'asesor' && !comentario.leido && (
                                                            <span className="ml-2 w-2 h-2 bg-red-500 rounded-full"></span>
                                                        )}
                                                    </div>
                                                    <p className="text-sm">
                                                        {comentario.comentario}
                                                    </p>
                                                    <p className={`text-xs mt-2 ${
                                                        comentario.tipo === 'cliente' 
                                                            ? 'text-blue-100' 
                                                            : 'text-gray-500'
                                                    }`}>
                                                        {formatDate(comentario.created_at)}
                                                    </p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="flex items-center justify-center h-full">
                                            <div className="text-center">
                                                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                                </svg>
                                                <h4 className="text-lg font-semibold text-gray-600 mb-2">
                                                    Sin mensajes aún
                                                </h4>
                                                <p className="text-gray-500">
                                                    Inicia la conversación escribiendo un mensaje a tu asesor
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Formulario para Nuevo Comentario */}
                                <div className="border-t p-4">
                                    <form onSubmit={handleSubmit} className="flex space-x-4">
                                        <div className="flex-1">
                                            <textarea
                                                value={data.comentario}
                                                onChange={(e) => setData('comentario', e.target.value)}
                                                placeholder="Escribe tu mensaje aquí..."
                                                rows="2"
                                                className="block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 resize-none"
                                                disabled={processing}
                                            />
                                            {errors.comentario && (
                                                <p className="mt-1 text-sm text-red-600">{errors.comentario}</p>
                                            )}
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={processing || !data.comentario.trim()}
                                            className="bg-blue-500 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-2 px-6 rounded-md transition-colors"
                                        >
                                            {processing ? 'Enviando...' : 'Enviar'}
                                        </button>
                                    </form>
                                    
                                    <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                                        <span>Presiona Enter + Ctrl para enviar rápidamente</span>
                                        <span>{data.comentario.length}/1000 caracteres</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Acciones Rápidas */}
                    <div className="mt-6 bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h3>
                            <div className="flex flex-wrap gap-4">
                                <Link
                                    href={`/catalogo/${cotizacion.departamento?.id}`}
                                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                                >
                                    Ver Departamento Completo
                                </Link>
                                
                                <button className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded">
                                    Solicitar Visita
                                </button>
                                
                                {cotizacion.estado === 'pendiente' && (
                                    <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                                        Cancelar Solicitud
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
