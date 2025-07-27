import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function ClienteAsesores({ auth }) {
    // Datos de prueba para asesores asignados
    const [asesores] = useState([
        {
            id: 1,
            nombre: 'María González',
            email: 'maria.gonzalez@inmobiliaria.com',
            telefono: '+51 987 654 321',
            especializacion: 'Departamentos Residenciales',
            experiencia: '5 años',
            rating: 4.8,
            total_ventas: 45,
            imagen: null,
            bio: 'Especialista en departamentos residenciales con amplia experiencia en el sector inmobiliario. Comprometida con brindar el mejor servicio a mis clientes.',
            horario_atencion: 'Lunes a Viernes: 9:00 AM - 6:00 PM',
            idiomas: ['Español', 'Inglés'],
            zona_trabajo: ['Sector A', 'Sector B', 'Centro'],
            solicitudes_activas: 2,
            ultima_actividad: '2025-07-25'
        },
        {
            id: 2,
            nombre: 'Carlos Ruiz',
            email: 'carlos.ruiz@inmobiliaria.com',
            telefono: '+51 987 123 456',
            especializacion: 'Propiedades Premium',
            experiencia: '8 años',
            rating: 4.9,
            total_ventas: 67,
            imagen: null,
            bio: 'Asesor senior especializado en propiedades de alto valor. Más de 8 años ayudando a familias a encontrar su hogar ideal.',
            horario_atencion: 'Lunes a Sábado: 8:00 AM - 7:00 PM',
            idiomas: ['Español', 'Inglés', 'Portugués'],
            zona_trabajo: ['Sector B', 'Sector C', 'Zona Premium'],
            solicitudes_activas: 1,
            ultima_actividad: '2025-07-24'
        },
        {
            id: 3,
            nombre: 'Ana Torres',
            email: 'ana.torres@inmobiliaria.com',
            telefono: '+51 987 789 123',
            especializacion: 'Inversiones Inmobiliarias',
            experiencia: '6 años',
            rating: 4.7,
            total_ventas: 38,
            imagen: null,
            bio: 'Experta en inversiones inmobiliarias y asesoramiento financiero. Te ayudo a tomar las mejores decisiones de inversión.',
            horario_atencion: 'Lunes a Viernes: 10:00 AM - 8:00 PM',
            idiomas: ['Español', 'Inglés'],
            zona_trabajo: ['Sector C', 'Sector D', 'Zona Comercial'],
            solicitudes_activas: 3,
            ultima_actividad: '2025-07-26'
        }
    ]);

    // Estadísticas del cliente con asesores
    const [stats] = useState({
        asesores_asignados: 3,
        solicitudes_activas: 6,
        cotizaciones_recibidas: 4,
        promedio_respuesta: '2.5 horas'
    });

    // Formato de rating con estrellas
    const formatRating = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;

        for (let i = 0; i < fullStars; i++) {
            stars.push(
                <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 24 24">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                </svg>
            );
        }

        if (hasHalfStar) {
            stars.push(
                <svg key="half" className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 24 24">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2v15.27z"/>
                </svg>
            );
        }

        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            stars.push(
                <svg key={`empty-${i}`} className="w-4 h-4 text-gray-300 fill-current" viewBox="0 0 24 24">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                </svg>
            );
        }

        return stars;
    };

    // Formato de fecha
    const formatFecha = (fecha) => {
        return new Date(fecha).toLocaleDateString('es-PE', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Mis Asesores</h2>}
        >
            <Head title="Mis Asesores - Inmobiliaria" />

            <div className="py-12 bg-gray-100 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header Section */}
                    <div className="mb-8">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                            <div className="mb-4 sm:mb-0">
                                <h1 className="text-3xl font-bold text-gray-900">
                                    Mis Asesores Inmobiliarios
                                </h1>
                                <p className="mt-1 text-lg text-gray-600">
                                    Conoce a tu equipo de asesores especializados
                                </p>
                            </div>
                            <Link
                                href="/cliente/solicitudes/crear"
                                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Nueva Solicitud
                            </Link>
                        </div>
                    </div>

                    {/* Estadísticas */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white overflow-hidden shadow-sm rounded-lg border-l-4 border-blue-500">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                                        <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                        </svg>
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-500">Asesores Asignados</p>
                                        <p className="text-2xl font-bold text-gray-900">{stats.asesores_asignados}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow-sm rounded-lg border-l-4 border-green-500">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                                        <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-2m-4-1v8m0 0l3-3m-3 3L9 8m-5 5h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293h3.172a1 1 0 00.707-.293l2.414-2.414a1 1 0 01.707-.293H20" />
                                        </svg>
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-500">Solicitudes Activas</p>
                                        <p className="text-2xl font-bold text-gray-900">{stats.solicitudes_activas}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow-sm rounded-lg border-l-4 border-yellow-500">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 bg-yellow-100 rounded-md p-3">
                                        <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                        </svg>
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-500">Cotizaciones Recibidas</p>
                                        <p className="text-2xl font-bold text-gray-900">{stats.cotizaciones_recibidas}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow-sm rounded-lg border-l-4 border-purple-500">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 bg-purple-100 rounded-md p-3">
                                        <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-500">Tiempo Promedio de Respuesta</p>
                                        <p className="text-2xl font-bold text-gray-900">{stats.promedio_respuesta}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Lista de Asesores */}
                    <div className="bg-white shadow-md rounded-lg overflow-hidden">
                        <div className="px-6 py-5 border-b border-gray-200">
                            <h3 className="text-lg leading-6 font-semibold text-gray-900">
                                Tu Equipo de Asesores
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">
                                Asesores especializados asignados según tus necesidades e intereses
                            </p>
                        </div>

                        <div className="divide-y divide-gray-200">
                            {asesores.map((asesor) => (
                                <div key={asesor.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                                    <div className="flex items-start space-x-6">
                                        {/* Avatar del asesor */}
                                        <div className="flex-shrink-0">
                                            {asesor.imagen ? (
                                                <img
                                                    src={asesor.imagen}
                                                    alt={asesor.nombre}
                                                    className="h-16 w-16 rounded-full object-cover border-2 border-gray-200"
                                                />
                                            ) : (
                                                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center border-2 border-gray-200">
                                                    <span className="text-xl font-bold text-white">
                                                        {asesor.nombre.split(' ').map(n => n[0]).join('')}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Información del asesor */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center space-x-3">
                                                        <h4 className="text-xl font-semibold text-gray-900">
                                                            {asesor.nombre}
                                                        </h4>
                                                        <div className="flex items-center space-x-1">
                                                            {formatRating(asesor.rating)}
                                                            <span className="ml-1 text-sm text-gray-600">
                                                                ({asesor.rating})
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <p className="text-base text-blue-600 font-medium">
                                                        {asesor.especializacion}
                                                    </p>

                                                    <p className="mt-2 text-gray-600">
                                                        {asesor.bio}
                                                    </p>

                                                    {/* Información de contacto */}
                                                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                                        <div className="space-y-2">
                                                            <div className="flex items-center text-gray-600">
                                                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                                </svg>
                                                                {asesor.email}
                                                            </div>
                                                            <div className="flex items-center text-gray-600">
                                                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                                </svg>
                                                                {asesor.telefono}
                                                            </div>
                                                            <div className="flex items-center text-gray-600">
                                                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                </svg>
                                                                {asesor.horario_atencion}
                                                            </div>
                                                        </div>

                                                        <div className="space-y-2">
                                                            <div className="flex items-center text-gray-600">
                                                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 01-2 2H10a2 2 0 01-2-2V6" />
                                                                </svg>
                                                                {asesor.experiencia} de experiencia
                                                            </div>
                                                            <div className="flex items-center text-gray-600">
                                                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                                                </svg>
                                                                {asesor.total_ventas} ventas exitosas
                                                            </div>
                                                            <div className="flex items-center text-gray-600">
                                                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                </svg>
                                                                {asesor.zona_trabajo.join(', ')}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Tags de idiomas */}
                                                    <div className="mt-4">
                                                        <div className="flex flex-wrap gap-2">
                                                            {asesor.idiomas.map((idioma) => (
                                                                <span
                                                                    key={idioma}
                                                                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                                                >
                                                                    {idioma}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Estado y acciones */}
                                                <div className="ml-6 flex flex-col items-end space-y-3">
                                                    <div className="text-right">
                                                        <div className="flex items-center space-x-2">
                                                            <div className="h-2 w-2 bg-green-400 rounded-full"></div>
                                                            <span className="text-sm text-gray-600">Activo</span>
                                                        </div>
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            Última actividad: {formatFecha(asesor.ultima_actividad)}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            {asesor.solicitudes_activas} solicitudes activas
                                                        </p>
                                                    </div>

                                                    <div className="flex flex-col space-y-2">
                                                        <a
                                                            href={`mailto:${asesor.email}`}
                                                            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
                                                        >
                                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                            </svg>
                                                            Enviar Email
                                                        </a>

                                                        <a
                                                            href={`tel:${asesor.telefono}`}
                                                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
                                                        >
                                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                            </svg>
                                                            Llamar
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Enlaces de acciones adicionales */}
                    <div className="mt-8 bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="px-6 py-5 border-b border-gray-200">
                            <h3 className="text-lg leading-6 font-semibold text-gray-900">
                                Acciones Rápidas
                            </h3>
                        </div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Link
                                href="/cliente/solicitudes"
                                className="group flex items-center p-4 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 hover:from-blue-100 hover:to-blue-200 transition-all duration-200"
                            >
                                <div className="flex-shrink-0 bg-blue-600 rounded-md p-3 group-hover:bg-blue-700 transition-colors duration-200">
                                    <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-2m-4-1v8m0 0l3-3m-3 3L9 8m-5 5h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293h3.172a1 1 0 00.707-.293l2.414-2.414a1 1 0 01.707-.293H20" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <h4 className="text-base font-semibold text-gray-900">Ver Mis Solicitudes</h4>
                                    <p className="mt-1 text-sm text-gray-600">Revisa tus solicitudes activas</p>
                                </div>
                            </Link>

                            <Link
                                href="/cliente/dashboard"
                                className="group flex items-center p-4 rounded-lg bg-gradient-to-br from-green-50 to-green-100 border border-green-200 hover:from-green-100 hover:to-green-200 transition-all duration-200"
                            >
                                <div className="flex-shrink-0 bg-green-600 rounded-md p-3 group-hover:bg-green-700 transition-colors duration-200">
                                    <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <h4 className="text-base font-semibold text-gray-900">Mi Dashboard</h4>
                                    <p className="mt-1 text-sm text-gray-600">Resumen de tu actividad</p>
                                </div>
                            </Link>

                            <Link
                                href="/cliente/favoritos"
                                className="group flex items-center p-4 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 hover:from-purple-100 hover:to-purple-200 transition-all duration-200"
                            >
                                <div className="flex-shrink-0 bg-purple-600 rounded-md p-3 group-hover:bg-purple-700 transition-colors duration-200">
                                    <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <h4 className="text-base font-semibold text-gray-900">Mis Favoritos</h4>
                                    <p className="mt-1 text-sm text-gray-600">Departamentos guardados</p>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
