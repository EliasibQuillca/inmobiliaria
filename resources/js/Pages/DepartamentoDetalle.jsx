import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import Layout from '@/components/layout/Layout';

export default function DepartamentoDetalle({ auth, departamento }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [activeImage, setActiveImage] = useState(0);
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        telefono: '',
        mensaje: `Estoy interesado en el departamento "${departamento.titulo}". Por favor contáctenme.`
    });
    const [enviando, setEnviando] = useState(false);
    const [mensajeEnviado, setMensajeEnviado] = useState(false);

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        try {
            setEnviando(true);
            const response = await axios.post('/api/v1/contactar', {
                ...formData,
                departamento_id: departamento.id
            });

            setMensajeEnviado(true);
            setFormData({
                nombre: '',
                email: '',
                telefono: '',
                mensaje: `Estoy interesado en el departamento "${departamento.titulo}". Por favor contáctenme.`
            });
        } catch (err) {
            console.error('Error al enviar formulario:', err);
            setError('Hubo un error al enviar el mensaje. Por favor, inténtelo de nuevo.');
        } finally {
            setEnviando(false);
        }
    };

    // Preparar características para mostrar
    const caracteristicas = [
        { icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6", label: "Área Total", value: `${departamento.area_total} m²` },
        { icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6", label: "Área Construida", value: `${departamento.area_construida} m²` },
        { icon: "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z", label: "Habitaciones", value: departamento.habitaciones },
        { icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z", label: "Baños", value: departamento.banos },
        { icon: "M5 13l4 4L19 7", label: "Antigüedad", value: `${departamento.antiguedad} años` },
        { icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4", label: "Piso", value: departamento.piso },
    ];

    return (
        <Layout auth={auth}>
            <Head title={`${departamento.titulo} - Inmobiliaria Cusco`} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Breadcrumbs */}
                <nav className="flex mb-8" aria-label="Breadcrumb">
                    <ol className="inline-flex items-center space-x-1 md:space-x-3">
                        <li className="inline-flex items-center">
                            <a href="/" className="text-gray-700 hover:text-indigo-600">
                                <svg className="w-5 h-5 mr-2.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                                </svg>
                                Inicio
                            </a>
                        </li>
                        <li>
                            <div className="flex items-center">
                                <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                                </svg>
                                <a href="/catalogo" className="ml-1 text-gray-700 hover:text-indigo-600 md:ml-2">Catálogo</a>
                            </div>
                        </li>
                        <li aria-current="page">
                            <div className="flex items-center">
                                <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                                </svg>
                                <span className="ml-1 text-gray-500 md:ml-2 truncate">{departamento.titulo}</span>
                            </div>
                        </li>
                    </ol>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Left Column - Images */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-md overflow-hidden">
                            {/* Main Image */}
                            <div className="relative h-96">
                                {departamento.imagenes && departamento.imagenes.length > 0 ? (
                                    <img
                                        src={departamento.imagenes[activeImage].url}
                                        alt={departamento.titulo}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                )}
                                {departamento.destacado && (
                                    <div className="absolute top-0 right-0 bg-yellow-500 text-white px-4 py-2 m-4 rounded-full text-sm font-bold">
                                        Destacado
                                    </div>
                                )}
                            </div>

                            {/* Thumbnails */}
                            {departamento.imagenes && departamento.imagenes.length > 1 && (
                                <div className="flex p-4 gap-2 overflow-x-auto">
                                    {departamento.imagenes.map((imagen, index) => (
                                        <button
                                            key={imagen.id}
                                            onClick={() => setActiveImage(index)}
                                            className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 ${index === activeImage ? 'border-indigo-600' : 'border-transparent'}`}
                                        >
                                            <img
                                                src={imagen.url}
                                                alt={`Imagen ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Property Details */}
                        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">{departamento.titulo}</h1>
                            <p className="text-gray-600 mb-4">{departamento.direccion}</p>
                            <div className="flex items-center mb-6">
                                <span className="text-2xl font-bold text-indigo-600">S/. {departamento.precio.toLocaleString()}</span>
                                {departamento.precio_anterior && (
                                    <span className="ml-3 text-lg text-gray-500 line-through">
                                        S/. {departamento.precio_anterior.toLocaleString()}
                                    </span>
                                )}
                            </div>

                            {/* Características */}
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                                {caracteristicas.map((caract, index) => (
                                    <div key={index} className="flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={caract.icon} />
                                        </svg>
                                        <div>
                                            <p className="text-xs text-gray-500">{caract.label}</p>
                                            <p className="font-semibold">{caract.value}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <h2 className="text-xl font-bold mb-4">Descripción</h2>
                            <p className="text-gray-700 mb-6 whitespace-pre-line">{departamento.descripcion}</p>

                            {/* Atributos */}
                            {departamento.atributos && departamento.atributos.length > 0 && (
                                <>
                                    <h2 className="text-xl font-bold mb-4">Características Adicionales</h2>
                                    <div className="grid grid-cols-2 gap-2 mb-6">
                                        {departamento.atributos.map(atributo => (
                                            <div key={atributo.id} className="flex items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span>{atributo.nombre}</span>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}

                            {/* Ubicación */}
                            <h2 className="text-xl font-bold mb-4">Ubicación</h2>
                            <div className="h-64 bg-gray-200 rounded-lg mb-6">
                                {/* Aquí se puede integrar un mapa de Google Maps o similar */}
                                <div className="w-full h-full flex items-center justify-center">
                                    <p className="text-gray-500">Mapa no disponible</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Contact Form */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                            <h2 className="text-xl font-bold mb-6">¿Te interesa esta propiedad?</h2>

                            {mensajeEnviado ? (
                                <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm text-green-700">
                                                ¡Mensaje enviado con éxito! Nos pondremos en contacto contigo lo antes posible.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <form onSubmit={handleFormSubmit}>
                                    {error && (
                                        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                                            <div className="flex">
                                                <div className="flex-shrink-0">
                                                    <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                                <div className="ml-3">
                                                    <p className="text-sm text-red-700">{error}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="mb-4">
                                        <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
                                            Nombre completo *
                                        </label>
                                        <input
                                            type="text"
                                            id="nombre"
                                            name="nombre"
                                            value={formData.nombre}
                                            onChange={handleFormChange}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                            Email *
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleFormChange}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-1">
                                            Teléfono *
                                        </label>
                                        <input
                                            type="tel"
                                            id="telefono"
                                            name="telefono"
                                            value={formData.telefono}
                                            onChange={handleFormChange}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                    </div>

                                    <div className="mb-6">
                                        <label htmlFor="mensaje" className="block text-sm font-medium text-gray-700 mb-1">
                                            Mensaje *
                                        </label>
                                        <textarea
                                            id="mensaje"
                                            name="mensaje"
                                            value={formData.mensaje}
                                            onChange={handleFormChange}
                                            required
                                            rows={4}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        ></textarea>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={enviando}
                                        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-50"
                                    >
                                        {enviando ? 'Enviando...' : 'Contactar Asesor'}
                                    </button>

                                    <p className="text-xs text-gray-500 mt-2">
                                        * Campos requeridos. Al enviar este formulario, aceptas nuestra política de privacidad.
                                    </p>
                                </form>
                            )}

                            <div className="mt-8">
                                <div className="flex items-center mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    <span className="font-medium">984 123 456</span>
                                </div>

                                <div className="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    <span className="font-medium">info@inmobiliaria.com</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
