import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import Layout from '@/Components/Layout/Layout';

export default function Contact({ auth }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });

    const [formStatus, setFormStatus] = useState({
        submitted: false,
        error: false,
        message: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Simulando el envío del formulario
        setFormStatus({
            submitted: true,
            error: false,
            message: '¡Gracias por contactarnos! Nos pondremos en contacto contigo muy pronto.'
        });

        // En un caso real, aquí se enviaría el formulario a través de una petición AJAX
        // O se usaría Inertia.js para enviar los datos al backend

        // Reinicio del formulario después de 5 segundos
        setTimeout(() => {
            setFormData({
                name: '',
                email: '',
                phone: '',
                subject: '',
                message: ''
            });
            setFormStatus({
                submitted: false,
                error: false,
                message: ''
            });
        }, 5000);
    };

    return (
        <Layout auth={auth}>
            <Head title="Contáctanos" />
            <div className="bg-white min-h-screen">
                {/* Contact Header Section */}
                <nav className="bg-white shadow-md py-4 mb-8">
                    <div className="container mx-auto px-4 md:px-8 flex justify-between items-center">
                        <Link href="/" className="flex items-center">
                            <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-indigo-700 to-blue-500 bg-clip-text text-transparent">
                                CUSCO PREMIUM
                            </span>
                        </Link>

                        <div className="hidden md:flex items-center space-x-8">
                            <Link href="/properties" className="text-gray-700 hover:text-indigo-600 font-medium">
                                Propiedades
                            </Link>
                            <Link href="/about" className="text-gray-700 hover:text-indigo-600 font-medium">
                                Nosotros
                            </Link>
                            <Link href="/services" className="text-gray-700 hover:text-indigo-600 font-medium">
                                Servicios
                            </Link>
                            <Link href="/contact" className="text-indigo-600 font-medium">
                                Contacto
                            </Link>

                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-all"
                                >
                                    Panel de Control
                                </Link>
                            ) : (
                                <div className="flex space-x-4">
                                    <Link
                                        href={route('login')}
                                        className="text-indigo-600 font-medium hover:text-indigo-800"
                                    >
                                        Iniciar Sesión
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-all"
                                    >
                                        Registrarse
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </nav>

                {/* Hero de Contacto */}
                <div className="relative mb-16">
                    <div className="h-80 bg-indigo-600">
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-700 to-blue-500 opacity-90"></div>
                        <img
                            src="https://images.unsplash.com/photo-1560520031-3a4dc4e9de0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1073&q=80"
                            alt="Contacto inmobiliaria"
                            className="w-full h-full object-cover mix-blend-overlay"
                        />
                        <div className="container mx-auto px-4 h-full flex flex-col justify-center items-center relative z-10">
                            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Contáctanos</h1>
                            <p className="text-xl text-white text-center max-w-2xl">
                                Estamos aquí para responder a todas tus consultas inmobiliarias
                            </p>
                        </div>
                    </div>
                </div>

                {/* Sección de contacto */}
                <section className="py-12 bg-white">
                    <div className="container mx-auto px-4 md:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            <div>
                                <h2 className="text-3xl font-bold text-gray-800 mb-6">Información de Contacto</h2>
                                <p className="text-gray-600 mb-8">
                                    ¿Tienes alguna pregunta sobre nuestras propiedades o servicios? Nuestro equipo está listo para ayudarte en cada paso del camino hacia tu nueva propiedad.
                                </p>

                                <div className="space-y-6 mb-8">
                                    <div className="flex items-start">
                                        <div className="bg-indigo-100 p-3 rounded-full mr-4">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-800">Dirección</h3>
                                            <p className="text-gray-600 mt-1">Av. El Sol 344, Cusco, Perú</p>
                                            <p className="text-gray-600">Plaza de Armas, Centro Histórico</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <div className="bg-indigo-100 p-3 rounded-full mr-4">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-800">Teléfono</h3>
                                            <p className="text-gray-600 mt-1">+51 984 123 456</p>
                                            <p className="text-gray-600">Lun - Vie: 9:00 AM - 6:00 PM</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <div className="bg-indigo-100 p-3 rounded-full mr-4">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-800">Email</h3>
                                            <p className="text-gray-600 mt-1">info@cuscopremium.com</p>
                                            <p className="text-gray-600">ventas@cuscopremium.com</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-xl font-semibold text-gray-800">Síguenos</h3>
                                    <div className="flex space-x-4">
                                        <a href="#" className="bg-indigo-100 p-3 rounded-full text-indigo-600 hover:bg-indigo-200 transition-colors">
                                            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                                <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                                            </svg>
                                        </a>
                                        <a href="#" className="bg-indigo-100 p-3 rounded-full text-indigo-600 hover:bg-indigo-200 transition-colors">
                                            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                                <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                                            </svg>
                                        </a>
                                        <a href="#" className="bg-indigo-100 p-3 rounded-full text-indigo-600 hover:bg-indigo-200 transition-colors">
                                            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                                            </svg>
                                        </a>
                                        <a href="#" className="bg-indigo-100 p-3 rounded-full text-indigo-600 hover:bg-indigo-200 transition-colors">
                                            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                                <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z" clipRule="evenodd" />
                                            </svg>
                                        </a>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <div className="bg-white rounded-lg shadow-xl p-8 border border-gray-200">
                                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Envíanos un mensaje</h2>

                                    {formStatus.submitted && (
                                        <div className={`p-4 mb-6 rounded-lg ${formStatus.error ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                            {formStatus.message}
                                        </div>
                                    )}

                                    <form onSubmit={handleSubmit}>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                            <div>
                                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
                                                <input
                                                    type="text"
                                                    id="name"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleInputChange}
                                                    placeholder="Ingresa tu nombre"
                                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
                                                <input
                                                    type="email"
                                                    id="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    placeholder="tu@email.com"
                                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                            <div>
                                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                                                <input
                                                    type="tel"
                                                    id="phone"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleInputChange}
                                                    placeholder="+51 900 123 456"
                                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Asunto</label>
                                                <select
                                                    id="subject"
                                                    name="subject"
                                                    value={formData.subject}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                                    required
                                                >
                                                    <option value="">Selecciona un asunto</option>
                                                    <option value="Compra de propiedad">Compra de propiedad</option>
                                                    <option value="Venta de propiedad">Venta de propiedad</option>
                                                    <option value="Consulta sobre inversión">Consulta sobre inversión</option>
                                                    <option value="Asesoría legal">Asesoría legal</option>
                                                    <option value="Otro">Otro</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="mb-6">
                                            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Mensaje</label>
                                            <textarea
                                                id="message"
                                                name="message"
                                                value={formData.message}
                                                onChange={handleInputChange}
                                                rows="5"
                                                placeholder="¿Cómo podemos ayudarte?"
                                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                                required
                                            ></textarea>
                                        </div>

                                        <button
                                            type="submit"
                                            className="w-full bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center"
                                        >
                                            Enviar Mensaje
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Mapa de ubicación */}
                <section className="py-12 bg-gray-50">
                    <div className="container mx-auto px-4 md:px-8">
                        <div className="max-w-3xl mx-auto text-center mb-12">
                            <h2 className="text-3xl font-bold text-gray-800 mb-4">Nuestra Ubicación</h2>
                            <p className="text-gray-600">
                                Visítanos en nuestras oficinas en el centro histórico de Cusco, a pocos pasos de la Plaza de Armas.
                            </p>
                        </div>

                        <div className="h-96 rounded-xl overflow-hidden shadow-xl">
                            {/* En un caso real, aquí se integraría un mapa de Google Maps o similar */}
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3879.1688239602606!2d-71.9800894856647!3d-13.516768826745783!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x916dd6739cd7f175%3A0x27c9a5052c394b40!2sPlaza%20de%20Armas%20de%20Cusco!5e0!3m2!1ses-419!2spe!4v1626547995307!5m2!1ses-419!2spe"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                title="Ubicación Cusco Premium"
                            ></iframe>
                        </div>
                    </div>
                </section>

                {/* FAQ */}
                <section className="py-12 bg-white">
                    <div className="container mx-auto px-4 md:px-8">
                        <div className="max-w-3xl mx-auto text-center mb-12">
                            <h2 className="text-3xl font-bold text-gray-800 mb-4">Preguntas Frecuentes</h2>
                            <p className="text-gray-600">
                                Encuentra respuestas a las preguntas más comunes sobre nuestros servicios
                            </p>
                        </div>

                        <div className="max-w-3xl mx-auto space-y-6">
                            <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">¿Cómo puedo programar una visita a una propiedad?</h3>
                                <p className="text-gray-600">
                                    Puedes programar una visita a cualquiera de nuestras propiedades directamente desde nuestra página web, llamando a nuestro número de contacto o enviándonos un mensaje a través del formulario de contacto.
                                </p>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">¿Qué documentos necesito para comprar una propiedad?</h3>
                                <p className="text-gray-600">
                                    Para comprar una propiedad generalmente necesitarás: documento de identidad, comprobantes de ingresos, declaraciones de impuestos y, en caso de financiamiento, una pre-aprobación bancaria. Nuestro equipo legal te guiará en todo el proceso.
                                </p>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">¿Ofrecen asesoría para extranjeros que quieren invertir en Cusco?</h3>
                                <p className="text-gray-600">
                                    Sí, contamos con un equipo especializado en asesorar a inversionistas extranjeros, ayudándoles a navegar los requisitos legales y tributarios específicos para no residentes interesados en el mercado inmobiliario peruano.
                                </p>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">¿Cuánto tiempo toma el proceso de compra de una propiedad?</h3>
                                <p className="text-gray-600">
                                    El proceso de compra puede variar dependiendo de varios factores, pero generalmente toma entre 1 y 3 meses desde la oferta inicial hasta la firma de la escritura. Trabajamos para hacer este proceso lo más eficiente posible.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="bg-gray-900 text-white py-12">
                    <div className="container mx-auto px-4 md:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            <div>
                                <div className="mb-4">
                                    <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-indigo-400 to-blue-300 bg-clip-text text-transparent">
                                        CUSCO PREMIUM
                                    </span>
                                </div>
                                <p className="text-gray-400 mb-6">
                                    Inmobiliaria especializada en departamentos de alta gama en Cusco.
                                </p>
                                <div className="flex space-x-4">
                                    <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                            <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                                        </svg>
                                    </a>
                                    <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                            <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                                        </svg>
                                    </a>
                                    <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                            <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                                        </svg>
                                    </a>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold mb-4">Enlaces Rápidos</h3>
                                <ul className="space-y-2">
                                    <li><Link href="/" className="text-gray-400 hover:text-white transition-colors">Inicio</Link></li>
                                    <li><Link href="/properties" className="text-gray-400 hover:text-white transition-colors">Propiedades</Link></li>
                                    <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors">Nosotros</Link></li>
                                    <li><Link href="/services" className="text-gray-400 hover:text-white transition-colors">Servicios</Link></li>
                                    <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors">Contacto</Link></li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold mb-4">Servicios</h3>
                                <ul className="space-y-2">
                                    <li><Link href="/services" className="text-gray-400 hover:text-white transition-colors">Venta de Departamentos</Link></li>
                                    <li><Link href="/services" className="text-gray-400 hover:text-white transition-colors">Asesoría Financiera</Link></li>
                                    <li><Link href="/services" className="text-gray-400 hover:text-white transition-colors">Inversiones Inmobiliarias</Link></li>
                                    <li><Link href="/services" className="text-gray-400 hover:text-white transition-colors">Visitas Guiadas</Link></li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold mb-4">Legal</h3>
                                <ul className="space-y-2">
                                    <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Términos y Condiciones</a></li>
                                    <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Política de Privacidad</a></li>
                                    <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Política de Cookies</a></li>
                                </ul>
                            </div>
                        </div>

                        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
                            <p>&copy; {new Date().getFullYear()} Cusco Premium. Todos los derechos reservados.</p>
                        </div>
                    </div>
                </footer>
            </div>
        </Layout>
    );
}
