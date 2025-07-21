import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import Layout from '@/Components/Layout/Layout';

export default function DetalleSolicitud({ auth, solicitudId = 1 }) {
    // Estado para la solicitud
    const [solicitud, setSolicitud] = useState({
        id: solicitudId,
        departamento: {
            id: 3,
            nombre: 'Departamento Lima 305',
            ubicacion: 'Av. Lima 305, Sector B',
            precio: 180000,
            imagen: '/img/depto3.jpg'
        },
        tipo: 'visita',
        mensaje: 'Quisiera programar una visita para ver el departamento, estoy disponible los fines de semana. Me interesa particularmente conocer los acabados de la cocina y los baños, así como verificar la vista desde el balcón. ¿Sería posible programar la visita para el próximo sábado por la tarde?',
        fecha_creacion: '2023-07-28T10:15:30',
        fecha_actualizacion: '2023-08-02T14:25:10',
        estado: 'en_proceso',
        asesor: {
            id: 2,
            nombre: 'María Rodríguez',
            email: 'maria.rodriguez@inmobiliaria.com',
            telefono: '+51 987 654 321'
        },
        disponibilidad: ['tarde', 'finde'],
        preferencia_contacto: 'whatsapp',
        telefono: '+51 912 345 678',
        comentarios: [
            {
                id: 1,
                usuario: 'María Rodríguez',
                rol: 'asesor',
                fecha: '2023-07-29T09:30:00',
                mensaje: 'Hola, he recibido tu solicitud para visitar el departamento. Podemos programar la visita para el próximo sábado a las 15:00 horas. ¿Te parece bien?'
            },
            {
                id: 2,
                usuario: 'Juan Cliente',
                rol: 'cliente',
                fecha: '2023-07-29T11:45:00',
                mensaje: 'Perfecto, me parece bien. ¿Debo llevar algún documento para la visita?'
            },
            {
                id: 3,
                usuario: 'María Rodríguez',
                rol: 'asesor',
                fecha: '2023-07-30T08:15:00',
                mensaje: 'Solo necesitas traer tu documento de identidad. Te estaré esperando en el lobby del edificio. ¡Hasta entonces!'
            },
            {
                id: 4,
                usuario: 'Sistema',
                rol: 'sistema',
                fecha: '2023-08-02T14:25:10',
                mensaje: 'La visita ha sido programada para el sábado 5 de agosto a las 15:00 horas.'
            }
        ]
    });

    // Estado para el nuevo comentario
    const [nuevoComentario, setNuevoComentario] = useState('');

    // Tipos de solicitud para traducción
    const tiposSolicitud = {
        'informacion': 'Información',
        'visita': 'Programar visita',
        'financiamiento': 'Financiamiento',
        'cotizacion': 'Cotización',
    };

    // Estados de solicitud para traducción
    const estadosSolicitud = {
        'pendiente': 'Pendiente',
        'en_proceso': 'En proceso',
        'completada': 'Completada',
        'cancelada': 'Cancelada',
    };

    // Colores para los estados
    const estadoColors = {
        'pendiente': 'bg-yellow-100 text-yellow-800',
        'en_proceso': 'bg-blue-100 text-blue-800',
        'completada': 'bg-green-100 text-green-800',
        'cancelada': 'bg-red-100 text-red-800',
    };

    // Formatear fecha
    const formatearFecha = (fecha) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(fecha).toLocaleDateString('es-ES', options);
    };

    // Formatear precio
    const formatearPrecio = (precio) => {
        return precio.toLocaleString('es-ES', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        });
    };

    // Manejar envío de nuevo comentario
    const handleSubmitComentario = (e) => {
        e.preventDefault();

        if (!nuevoComentario.trim()) {
            return;
        }

        // Aquí iría la lógica para enviar el comentario al servidor
        // Simulación de adición de comentario
        const nuevoComentarioObj = {
            id: solicitud.comentarios.length + 1,
            usuario: auth.user.name,
            rol: 'cliente',
            fecha: new Date().toISOString(),
            mensaje: nuevoComentario,
        };

        setSolicitud({
            ...solicitud,
            comentarios: [...solicitud.comentarios, nuevoComentarioObj],
        });

        setNuevoComentario('');
    };

    // Traducir disponibilidad
    const traducirDisponibilidad = (disponibilidad) => {
        const traducciones = {
            'manana': 'Mañana (8:00 - 12:00)',
            'tarde': 'Tarde (12:00 - 18:00)',
            'noche': 'Noche (18:00 - 20:00)',
            'finde': 'Fin de semana',
        };

        return disponibilidad.map(d => traducciones[d] || d).join(', ');
    };

    // Traducir preferencia de contacto
    const traducirPreferenciaContacto = (preferencia) => {
        const traducciones = {
            'email': 'Correo electrónico',
            'telefono': 'Teléfono',
            'whatsapp': 'WhatsApp',
        };

        return traducciones[preferencia] || preferencia;
    };

    return (
        <Layout auth={auth}>
            <Head title={`Solicitud #${solicitudId} - Inmobiliaria`} />

            <div className="py-12 bg-gray-100 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <div className="flex justify-between items-center mb-6">
                                <div className="flex items-center">
                                    <Link
                                        href="/cliente/solicitudes"
                                        className="text-blue-600 hover:text-blue-800 flex items-center mr-4"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                                        </svg>
                                        Volver a solicitudes
                                    </Link>
                                    <h2 className="text-2xl font-bold text-gray-900">
                                        Solicitud #{solicitud.id} - {tiposSolicitud[solicitud.tipo]}
                                    </h2>
                                </div>
                                <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${estadoColors[solicitud.estado]}`}>
                                    {estadosSolicitud[solicitud.estado]}
                                </span>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Información de la solicitud */}
                                <div className="lg:col-span-2 space-y-6">
                                    <div className="bg-gray-50 p-4 rounded-md">
                                        <h3 className="text-lg font-medium text-gray-900 mb-3">Detalles de la solicitud</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-sm text-gray-600">Tipo de solicitud</p>
                                                <p className="font-medium">{tiposSolicitud[solicitud.tipo]}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Fecha de creación</p>
                                                <p className="font-medium">{formatearFecha(solicitud.fecha_creacion)}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Última actualización</p>
                                                <p className="font-medium">{formatearFecha(solicitud.fecha_actualizacion)}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Estado</p>
                                                <p className="font-medium">{estadosSolicitud[solicitud.estado]}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 p-4 rounded-md">
                                        <h3 className="text-lg font-medium text-gray-900 mb-3">Mensaje</h3>
                                        <div className="bg-white p-3 rounded border border-gray-200">
                                            <p className="text-gray-700 whitespace-pre-line">{solicitud.mensaje}</p>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 p-4 rounded-md">
                                        <h3 className="text-lg font-medium text-gray-900 mb-3">Información de contacto</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-sm text-gray-600">Teléfono</p>
                                                <p className="font-medium">{solicitud.telefono}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Disponibilidad</p>
                                                <p className="font-medium">{traducirDisponibilidad(solicitud.disponibilidad)}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Preferencia de contacto</p>
                                                <p className="font-medium">{traducirPreferenciaContacto(solicitud.preferencia_contacto)}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {solicitud.asesor && (
                                        <div className="bg-gray-50 p-4 rounded-md">
                                            <h3 className="text-lg font-medium text-gray-900 mb-3">Información del asesor</h3>
                                            <div className="flex items-start">
                                                <div className="flex-shrink-0">
                                                    <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                                                        {solicitud.asesor.nombre.charAt(0)}
                                                    </div>
                                                </div>
                                                <div className="ml-3">
                                                    <p className="text-sm font-medium text-gray-900">{solicitud.asesor.nombre}</p>
                                                    <p className="text-sm text-gray-500">{solicitud.asesor.email}</p>
                                                    <p className="text-sm text-gray-500">{solicitud.asesor.telefono}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Comunicación */}
                                    <div className="bg-gray-50 p-4 rounded-md">
                                        <h3 className="text-lg font-medium text-gray-900 mb-3">Comunicación</h3>
                                        <div className="space-y-4">
                                            {solicitud.comentarios.map((comentario) => (
                                                <div
                                                    key={comentario.id}
                                                    className={`flex ${comentario.rol === 'cliente' ? 'justify-end' : ''}`}
                                                >
                                                    <div
                                                        className={`max-w-md rounded-lg p-3 ${
                                                            comentario.rol === 'cliente'
                                                                ? 'bg-blue-100 text-blue-800'
                                                                : comentario.rol === 'sistema'
                                                                    ? 'bg-gray-100 text-gray-700 italic w-full text-center'
                                                                    : 'bg-green-100 text-green-800'
                                                        }`}
                                                    >
                                                        {comentario.rol !== 'sistema' && (
                                                            <div className="flex items-center mb-1">
                                                                <span className="font-medium">{comentario.usuario}</span>
                                                                <span className="text-xs ml-2 text-gray-500">
                                                                    {formatearFecha(comentario.fecha)}
                                                                </span>
                                                            </div>
                                                        )}
                                                        <p className={comentario.rol === 'sistema' ? 'text-sm' : ''}>{comentario.mensaje}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Formulario para nuevo comentario */}
                                        {solicitud.estado !== 'completada' && solicitud.estado !== 'cancelada' && (
                                            <form onSubmit={handleSubmitComentario} className="mt-4">
                                                <div className="flex items-start">
                                                    <div className="min-w-0 flex-1">
                                                        <textarea
                                                            id="nuevoComentario"
                                                            name="nuevoComentario"
                                                            placeholder="Escribe un mensaje..."
                                                            rows="3"
                                                            value={nuevoComentario}
                                                            onChange={(e) => setNuevoComentario(e.target.value)}
                                                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                                            required
                                                        ></textarea>
                                                    </div>
                                                    <div className="ml-3">
                                                        <button
                                                            type="submit"
                                                            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                        >
                                                            Enviar
                                                        </button>
                                                    </div>
                                                </div>
                                            </form>
                                        )}
                                    </div>
                                </div>

                                {/* Información del departamento */}
                                <div className="lg:col-span-1">
                                    <div className="bg-gray-50 p-4 rounded-md sticky top-6">
                                        <h3 className="text-lg font-medium text-gray-900 mb-3">Departamento</h3>
                                        <div className="bg-white rounded-md overflow-hidden border border-gray-200">
                                            <div className="h-48 overflow-hidden">
                                                <img
                                                    src={solicitud.departamento.imagen}
                                                    alt={solicitud.departamento.nombre}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="p-4">
                                                <h4 className="text-lg font-semibold text-gray-900 mb-1">
                                                    {solicitud.departamento.nombre}
                                                </h4>
                                                <p className="text-sm text-gray-600 mb-2">
                                                    {solicitud.departamento.ubicacion}
                                                </p>
                                                <p className="text-xl font-bold text-gray-900 mb-4">
                                                    {formatearPrecio(solicitud.departamento.precio)}
                                                </p>
                                                <Link
                                                    href={`/cliente/departamentos/${solicitud.departamento.id}`}
                                                    className="block w-full bg-blue-600 text-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                >
                                                    Ver detalles
                                                </Link>
                                            </div>
                                        </div>

                                        {solicitud.estado !== 'completada' && solicitud.estado !== 'cancelada' && (
                                            <div className="mt-4">
                                                <button
                                                    type="button"
                                                    className="block w-full border border-red-600 text-red-600 text-center py-2 px-4 rounded-md shadow-sm text-sm font-medium hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                                    onClick={() => {
                                                        if (confirm("¿Estás seguro de que deseas cancelar esta solicitud?")) {
                                                            // Aquí iría la lógica para cancelar
                                                            console.log('Cancelar solicitud:', solicitud.id);
                                                        }
                                                    }}
                                                >
                                                    Cancelar solicitud
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
