import PublicLayout from '@/Layouts/PublicLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Aprobaciones({ auth, accionesPendientes, historial, estadisticas }) {
    const [mostrarHistorial, setMostrarHistorial] = useState(false);
    const [accionSeleccionada, setAccionSeleccionada] = useState(null);
    const [mostrarModalAprobar, setMostrarModalAprobar] = useState(false);
    const [mostrarModalRechazar, setMostrarModalRechazar] = useState(false);
    const [comentario, setComentario] = useState('');
    const [motivo, setMotivo] = useState('');
    const [procesando, setProcesando] = useState(false);

    const prioridadColor = {
        'baja': 'bg-gray-100 text-gray-800',
        'media': 'bg-blue-100 text-blue-800',
        'alta': 'bg-orange-100 text-orange-800',
        'urgente': 'bg-red-100 text-red-800'
    };

    const prioridadIcono = {
        'baja': '📝',
        'media': '📋',
        'alta': '⚠️',
        'urgente': '🚨'
    };

    const estadoColor = {
        'pendiente': 'bg-yellow-100 text-yellow-800',
        'aprobada': 'bg-green-100 text-green-800',
        'rechazada': 'bg-red-100 text-red-800'
    };

    const handleAprobar = (accion) => {
        setAccionSeleccionada(accion);
        setMostrarModalAprobar(true);
    };

    const handleRechazar = (accion) => {
        setAccionSeleccionada(accion);
        setMostrarModalRechazar(true);
    };

    const confirmarAprobacion = () => {
        if (!accionSeleccionada) return;

        setProcesando(true);
        router.post(`/cliente/aprobaciones/${accionSeleccionada.id}/aprobar`, {
            comentario: comentario
        }, {
            onFinish: () => {
                setProcesando(false);
                setMostrarModalAprobar(false);
                setAccionSeleccionada(null);
                setComentario('');
            }
        });
    };

    const confirmarRechazo = () => {
        if (!accionSeleccionada || !motivo.trim()) {
            alert('Debes indicar el motivo del rechazo');
            return;
        }

        setProcesando(true);
        router.post(`/cliente/aprobaciones/${accionSeleccionada.id}/rechazar`, {
            motivo: motivo
        }, {
            onFinish: () => {
                setProcesando(false);
                setMostrarModalRechazar(false);
                setAccionSeleccionada(null);
                setMotivo('');
            }
        });
    };

    const formatFecha = (fecha) => {
        return new Date(fecha).toLocaleDateString('es-PE', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <PublicLayout user={auth.user}>
            <Head title="Aprobaciones Pendientes" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">
                            📋 Aprobaciones y Consentimientos
                        </h1>
                        <p className="mt-2 text-gray-600">
                            Revisa las acciones que tu asesor ha realizado en tu nombre y otorga tu consentimiento
                        </p>
                    </div>

                    {/* Estadísticas */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center">
                                <div className="p-3 bg-yellow-100 rounded-full">
                                    <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm text-gray-600">Pendientes</p>
                                    <p className="text-2xl font-bold text-gray-900">{estadisticas.pendientes}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center">
                                <div className="p-3 bg-green-100 rounded-full">
                                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm text-gray-600">Aprobadas Hoy</p>
                                    <p className="text-2xl font-bold text-gray-900">{estadisticas.aprobadas_hoy}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center">
                                <div className="p-3 bg-blue-100 rounded-full">
                                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm text-gray-600">Total Aprobadas</p>
                                    <p className="text-2xl font-bold text-gray-900">{estadisticas.total_aprobadas}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center">
                                <div className="p-3 bg-red-100 rounded-full">
                                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm text-gray-600">Rechazadas</p>
                                    <p className="text-2xl font-bold text-gray-900">{estadisticas.total_rechazadas}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Toggle Historial */}
                    <div className="mb-6 flex space-x-4">
                        <button
                            onClick={() => setMostrarHistorial(false)}
                            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                                !mostrarHistorial
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-white text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                            ⏳ Pendientes ({accionesPendientes.length})
                        </button>
                        <button
                            onClick={() => setMostrarHistorial(true)}
                            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                                mostrarHistorial
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-white text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                            📜 Historial ({historial.length})
                        </button>
                    </div>

                    {/* Acciones Pendientes */}
                    {!mostrarHistorial && (
                        <div className="space-y-4">
                            {accionesPendientes.length === 0 ? (
                                <div className="bg-white rounded-lg shadow p-12 text-center">
                                    <div className="text-6xl mb-4">✅</div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                        ¡Todo al día!
                                    </h3>
                                    <p className="text-gray-600">
                                        No tienes acciones pendientes de aprobación
                                    </p>
                                </div>
                            ) : (
                                accionesPendientes.map((accion) => (
                                    <div key={accion.id} className="bg-white rounded-lg shadow-lg overflow-hidden border-l-4 border-yellow-400">
                                        <div className="p-6">
                                            {/* Header */}
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${prioridadColor[accion.prioridad]}`}>
                                                            {prioridadIcono[accion.prioridad]} {accion.prioridad.toUpperCase()}
                                                        </span>
                                                        <span className="text-sm text-gray-500">
                                                            {formatFecha(accion.created_at)}
                                                        </span>
                                                    </div>
                                                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                                                        {accion.titulo}
                                                    </h3>
                                                    <p className="text-sm text-gray-600 mb-1">
                                                        Realizado por: <span className="font-medium">{accion.usuario?.name}</span>
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Descripción */}
                                            <div className="bg-gray-50 rounded-lg p-4 mb-4">
                                                <p className="text-gray-700 whitespace-pre-line">{accion.descripcion}</p>
                                            </div>

                                            {/* Detalles adicionales */}
                                            {accion.detalles && (
                                                <div className="bg-blue-50 rounded-lg p-4 mb-4">
                                                    <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                        </svg>
                                                        Información Detallada:
                                                    </h4>
                                                    <div className="space-y-2">
                                                        {Object.entries(accion.detalles).map(([key, value]) => (
                                                            <div key={key} className="flex justify-between items-start py-2 border-b border-blue-200 last:border-0">
                                                                <span className="text-sm font-medium text-blue-900 capitalize">
                                                                    {key.replace(/_/g, ' ')}:
                                                                </span>
                                                                <span className="text-sm text-blue-800 text-right ml-4">
                                                                    {typeof value === 'boolean' 
                                                                        ? (value ? '✅ Sí' : '❌ No')
                                                                        : typeof value === 'number' && key.includes('monto')
                                                                        ? `S/ ${value.toLocaleString('es-PE')}`
                                                                        : value}
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Botones de acción */}
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => handleAprobar(accion)}
                                                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    Aprobar
                                                </button>
                                                <button
                                                    onClick={() => handleRechazar(accion)}
                                                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                    Rechazar
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {/* Historial */}
                    {mostrarHistorial && (
                        <div className="bg-white rounded-lg shadow overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acción</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Asesor</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tu Respuesta</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {historial.map((accion) => (
                                            <tr key={accion.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {formatFecha(accion.fecha_respuesta || accion.created_at)}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm font-medium text-gray-900">{accion.titulo}</div>
                                                    <div className="text-xs text-gray-500 mt-1 line-clamp-2">{accion.descripcion}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                    {accion.usuario?.name}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${estadoColor[accion.estado_aprobacion]}`}>
                                                        {accion.estado_aprobacion === 'aprobada' && '✅ Aprobada'}
                                                        {accion.estado_aprobacion === 'rechazada' && '❌ Rechazada'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600">
                                                    {accion.motivo_respuesta || '-'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal Aprobar */}
            {mostrarModalAprobar && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">
                            ✅ Aprobar Acción
                        </h3>
                        <p className="text-gray-600 mb-4">
                            ¿Estás seguro de aprobar esta acción? Esto significa que estás de acuerdo con lo realizado por tu asesor.
                        </p>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Comentario opcional:
                            </label>
                            <textarea
                                value={comentario}
                                onChange={(e) => setComentario(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                rows="3"
                                placeholder="Ej: Todo correcto, proceder"
                            />
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={confirmarAprobacion}
                                disabled={procesando}
                                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg disabled:opacity-50"
                            >
                                {procesando ? 'Procesando...' : 'Confirmar Aprobación'}
                            </button>
                            <button
                                onClick={() => {
                                    setMostrarModalAprobar(false);
                                    setComentario('');
                                }}
                                disabled={procesando}
                                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Rechazar */}
            {mostrarModalRechazar && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">
                            ❌ Rechazar Acción
                        </h3>
                        <p className="text-gray-600 mb-4">
                            Indica el motivo por el cual no estás de acuerdo con esta acción. Tu asesor será notificado.
                        </p>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Motivo del rechazo: <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                value={motivo}
                                onChange={(e) => setMotivo(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                                rows="4"
                                placeholder="Explica por qué no estás de acuerdo (mínimo 10 caracteres)"
                                required
                            />
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={confirmarRechazo}
                                disabled={procesando || motivo.trim().length < 10}
                                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg disabled:opacity-50"
                            >
                                {procesando ? 'Procesando...' : 'Confirmar Rechazo'}
                            </button>
                            <button
                                onClick={() => {
                                    setMostrarModalRechazar(false);
                                    setMotivo('');
                                }}
                                disabled={procesando}
                                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </PublicLayout>
    );
}
