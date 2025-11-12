import React, { useState } from 'react';
import { Head, useForm, usePage, Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';

export default function Contacto({ auth }) {
    const { flash } = usePage().props;
    const { data, setData, post, processing, errors, reset } = useForm({
        nombre: auth.user ? auth.user.name : '',
        email: auth.user ? auth.user.email : '',
        telefono: '',
        asunto: '',
        mensaje: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        // Verificar autenticación antes de enviar
        if (!auth.user) {
            return;
        }

        post(route('contacto.enviar'), {
            onSuccess: () => {
                reset('asunto', 'mensaje', 'telefono');
            },
        });
    };

    return (
        <PublicLayout auth={auth}>
            <Head title="Contáctanos" />

            <div className="min-h-screen bg-gray-50">
                {/* Hero Section */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">Contáctanos</h1>
                        <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                            Estamos aquí para ayudarte a encontrar tu hogar ideal
                        </p>
                    </div>
                </div>

                {/* Contenido Principal */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Información de Contacto */}
                        <div className="md:col-span-1 space-y-6">
                            {/* Dirección */}
                            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-1">Dirección</h3>
                                        <p className="text-gray-600">
                                            Av. Principal 123<br />
                                            San Isidro, Lima<br />
                                            Perú
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Teléfono */}
                            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-1">Teléfono</h3>
                                        <p className="text-gray-600">
                                            +51 1 234 5678<br />
                                            +51 987 654 321
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Email */}
                            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-1">Email</h3>
                                        <p className="text-gray-600">
                                            info@inmobiliaria.com<br />
                                            ventas@inmobiliaria.com
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Horario */}
                            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                                            <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-1">Horario</h3>
                                        <p className="text-gray-600">
                                            Lun - Vie: 9:00 AM - 6:00 PM<br />
                                            Sábados: 9:00 AM - 1:00 PM<br />
                                            Domingos: Cerrado
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Formulario de Contacto */}
                        <div className="md:col-span-2">
                            <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-200">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Envíanos un Mensaje</h2>

                                {/* Mensajes Flash */}
                                {flash?.success && (
                                    <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center">
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {flash.success}
                                    </div>
                                )}
                                {flash?.error && (
                                    <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {flash.error}
                                    </div>
                                )}

                                {/* Mensaje de Login Requerido */}
                                {!auth.user ? (
                                    <div className="text-center py-12">
                                        <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-6">
                                            <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                            Inicia Sesión para Contactarnos
                                        </h3>
                                        <p className="text-gray-600 mb-8 max-w-md mx-auto">
                                            Para proteger nuestro sistema de spam y brindarte un mejor servicio, necesitas iniciar sesión como cliente para enviar un mensaje.
                                        </p>
                                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                            <Link
                                                href="/login"
                                                className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200"
                                            >
                                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                                </svg>
                                                Iniciar Sesión
                                            </Link>
                                            <Link
                                                href="/register"
                                                className="inline-flex items-center justify-center px-6 py-3 bg-white hover:bg-gray-50 text-blue-600 font-semibold rounded-lg border-2 border-blue-600 transition-colors duration-200"
                                            >
                                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                                </svg>
                                                Crear Cuenta
                                            </Link>
                                        </div>
                                        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                                            <p className="text-sm text-blue-800">
                                                <strong>Beneficios de registrarte:</strong> Guarda propiedades favoritas, recibe notificaciones personalizadas, y accede a ofertas exclusivas.
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Nombre */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Nombre Completo *
                                        </label>
                                        <input
                                            type="text"
                                            value={data.nombre}
                                            onChange={(e) => setData('nombre', e.target.value)}
                                            className={`w-full px-4 py-3 border ${
                                                errors.nombre ? 'border-red-500' : 'border-gray-300'
                                            } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                            placeholder="Juan Pérez"
                                            required
                                        />
                                        {errors.nombre && (
                                            <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>
                                        )}
                                    </div>

                                    {/* Email y Teléfono */}
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Email *
                                            </label>
                                            <input
                                                type="email"
                                                value={data.email}
                                                onChange={(e) => setData('email', e.target.value)}
                                                className={`w-full px-4 py-3 border ${
                                                    errors.email ? 'border-red-500' : 'border-gray-300'
                                                } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                                placeholder="juan@ejemplo.com"
                                                required
                                            />
                                            {errors.email && (
                                                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Teléfono
                                            </label>
                                            <input
                                                type="tel"
                                                value={data.telefono}
                                                onChange={(e) => setData('telefono', e.target.value)}
                                                className={`w-full px-4 py-3 border ${
                                                    errors.telefono ? 'border-red-500' : 'border-gray-300'
                                                } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                                placeholder="+51 987 654 321"
                                            />
                                            {errors.telefono && (
                                                <p className="mt-1 text-sm text-red-600">{errors.telefono}</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Asunto */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Asunto *
                                        </label>
                                        <input
                                            type="text"
                                            value={data.asunto}
                                            onChange={(e) => setData('asunto', e.target.value)}
                                            className={`w-full px-4 py-3 border ${
                                                errors.asunto ? 'border-red-500' : 'border-gray-300'
                                            } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                            placeholder="Consulta sobre propiedades"
                                            required
                                        />
                                        {errors.asunto && (
                                            <p className="mt-1 text-sm text-red-600">{errors.asunto}</p>
                                        )}
                                    </div>

                                    {/* Mensaje */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Mensaje *
                                        </label>
                                        <textarea
                                            value={data.mensaje}
                                            onChange={(e) => setData('mensaje', e.target.value)}
                                            rows="6"
                                            className={`w-full px-4 py-3 border ${
                                                errors.mensaje ? 'border-red-500' : 'border-gray-300'
                                            } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none`}
                                            placeholder="Escribe tu mensaje aquí..."
                                            required
                                            maxLength="1000"
                                        />
                                        {errors.mensaje && (
                                            <p className="mt-1 text-sm text-red-600">{errors.mensaje}</p>
                                        )}
                                        <p className="mt-1 text-sm text-gray-500 text-right">
                                            {data.mensaje.length}/1000 caracteres
                                        </p>
                                    </div>

                                    {/* Botón de Enviar */}
                                    <div>
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className={`w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center ${
                                                processing ? 'opacity-50 cursor-not-allowed' : ''
                                            }`}
                                        >
                                            {processing ? (
                                                <>
                                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Enviando...
                                                </>
                                            ) : (
                                                <>
                                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                                    </svg>
                                                    Enviar Mensaje
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                                )}
                            </div>

                            {/* Mapa (Opcional - puedes agregar Google Maps aquí) */}
                            <div className="mt-8 bg-gray-200 rounded-lg h-64 flex items-center justify-center">
                                <p className="text-gray-500">
                                    <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                    </svg>
                                    Aquí puedes integrar Google Maps
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
