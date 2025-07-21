import { Head, Link } from '@inertiajs/react';
import Layout from '@/Components/Layout/Layout';

export default function About({ auth }) {
    return (
        <Layout auth={auth}>
            <Head title="Nosotros - Inmobiliaria Cusco" />
            <div className="min-h-screen bg-white">
                {/* Navbar importado de Welcome.jsx - se debe refactorizar en un componente separado */}
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
                            <Link href="/about" className="text-indigo-600 font-medium">
                                Nosotros
                            </Link>
                            <Link href="/services" className="text-gray-700 hover:text-indigo-600 font-medium">
                                Servicios
                            </Link>
                            <Link href="/contact" className="text-gray-700 hover:text-indigo-600 font-medium">
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

                {/* Hero de Nosotros */}
                <div className="relative mb-16">
                    <div className="h-80 bg-indigo-600">
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-700 to-blue-500 opacity-90"></div>
                        <img
                            src="https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80"
                            alt="Equipo de trabajo"
                            className="w-full h-full object-cover mix-blend-overlay"
                        />
                        <div className="container mx-auto px-4 h-full flex flex-col justify-center items-center relative z-10">
                            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Sobre Nosotros</h1>
                            <p className="text-xl text-white text-center max-w-2xl">
                                Conoce nuestra historia, misión y el equipo detrás de Cusco Premium
                            </p>
                        </div>
                    </div>
                </div>

                {/* Nuestra Historia */}
                <section className="py-16 bg-white">
                    <div className="container mx-auto px-4 md:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            <div>
                                <h2 className="text-3xl font-bold text-gray-800 mb-6">Nuestra Historia</h2>
                                <div className="w-20 h-1 bg-indigo-600 mb-6"></div>
                                <p className="text-gray-600 mb-6">
                                    Fundada en 2015, Cusco Premium nació con la visión de transformar el mercado
                                    inmobiliario de Cusco, ofreciendo propiedades de alta gama que combinan la
                                    arquitectura tradicional cusqueña con toques modernos y amenidades de lujo.
                                </p>
                                <p className="text-gray-600 mb-6">
                                    Con más de una década de experiencia en el sector, nuestro equipo de asesores
                                    profesionales ha ayudado a cientos de clientes a encontrar el hogar de sus sueños
                                    o realizar inversiones inmobiliarias rentables en la región.
                                </p>
                                <p className="text-gray-600">
                                    Hoy, somos reconocidos como líderes en el mercado de propiedades premium,
                                    gracias a nuestro compromiso con la calidad, la transparencia y el servicio
                                    personalizado que ofrecemos a cada uno de nuestros clientes.
                                </p>
                            </div>
                            <div className="relative">
                                <img
                                    src="https://images.unsplash.com/photo-1626178793926-22b28830aa30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
                                    alt="Historia de nuestra empresa"
                                    className="rounded-lg shadow-xl w-full"
                                />
                                <div className="absolute -bottom-6 -left-6 bg-indigo-600 text-white p-6 rounded-lg shadow-lg">
                                    <p className="text-2xl font-bold">2015</p>
                                    <p className="text-sm">Año de fundación</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Misión y Visión */}
                <section className="py-16 bg-gray-50">
                    <div className="container mx-auto px-4 md:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold text-gray-800 mb-4">Misión y Visión</h2>
                            <p className="text-gray-600 max-w-2xl mx-auto">
                                Nuestros valores fundamentales guían cada acción que tomamos
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all">
                                <div className="rounded-full bg-indigo-100 p-4 w-16 h-16 flex items-center justify-center mb-6">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold mb-4 text-gray-800">Nuestra Misión</h3>
                                <p className="text-gray-600">
                                    Proporcionar soluciones inmobiliarias excepcionales que mejoren la calidad de vida de nuestros
                                    clientes, ofreciendo propiedades de alta calidad en las mejores ubicaciones de Cusco, con
                                    un servicio personalizado y profesional que supere sus expectativas.
                                </p>
                                <div className="mt-6 border-t border-gray-100 pt-6">
                                    <ul className="space-y-3">
                                        <li className="flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            <span>Excelencia en el servicio</span>
                                        </li>
                                        <li className="flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            <span>Asesoramiento personalizado</span>
                                        </li>
                                        <li className="flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            <span>Transparencia y honestidad</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all">
                                <div className="rounded-full bg-indigo-100 p-4 w-16 h-16 flex items-center justify-center mb-6">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold mb-4 text-gray-800">Nuestra Visión</h3>
                                <p className="text-gray-600">
                                    Ser reconocidos como la inmobiliaria líder en el segmento premium de Cusco,
                                    destacando por nuestra innovación, calidad y compromiso con el desarrollo sostenible,
                                    contribuyendo a la preservación del patrimonio cultural de la ciudad mientras
                                    ofrecemos espacios modernos y confortables.
                                </p>
                                <div className="mt-6 border-t border-gray-100 pt-6">
                                    <ul className="space-y-3">
                                        <li className="flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            <span>Liderazgo en el mercado</span>
                                        </li>
                                        <li className="flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            <span>Innovación constante</span>
                                        </li>
                                        <li className="flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            <span>Compromiso con la sostenibilidad</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Equipo */}
                <section className="py-16 bg-white">
                    <div className="container mx-auto px-4 md:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold text-gray-800 mb-4">Nuestro Equipo</h2>
                            <p className="text-gray-600 max-w-2xl mx-auto">
                                Profesionales comprometidos con la excelencia y el servicio al cliente
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {[
                                {
                                    id: 1,
                                    name: 'Carlos Mendoza',
                                    role: 'Director General',
                                    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
                                },
                                {
                                    id: 2,
                                    name: 'Ana Fernández',
                                    role: 'Asesora Senior',
                                    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=688&q=80',
                                },
                                {
                                    id: 3,
                                    name: 'Roberto Sánchez',
                                    role: 'Gerente Comercial',
                                    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
                                },
                                {
                                    id: 4,
                                    name: 'Lucía Torres',
                                    role: 'Asesora Financiera',
                                    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=761&q=80',
                                }
                            ].map((member) => (
                                <div key={member.id} className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all text-center">
                                    <div className="h-64 overflow-hidden">
                                        <img
                                            src={member.image}
                                            alt={member.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="p-6">
                                        <h3 className="text-xl font-semibold text-gray-800">{member.name}</h3>
                                        <p className="text-indigo-600">{member.role}</p>
                                        <div className="mt-4 flex justify-center space-x-3">
                                            <a href="#" className="text-gray-400 hover:text-indigo-600">
                                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                                                </svg>
                                            </a>
                                            <a href="#" className="text-gray-400 hover:text-indigo-600">
                                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                                                </svg>
                                            </a>
                                            <a href="#" className="text-gray-400 hover:text-indigo-600">
                                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                                    <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                                                </svg>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Testimonios */}
                <section className="py-16 bg-gray-50">
                    <div className="container mx-auto px-4 md:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold text-gray-800 mb-4">Lo que Dicen Nuestros Clientes</h2>
                            <p className="text-gray-600 max-w-2xl mx-auto">
                                Historias de éxito y experiencias con Cusco Premium
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                {
                                    id: 1,
                                    name: 'Miguel Paredes',
                                    role: 'Empresario',
                                    text: 'El asesoramiento de Cusco Premium fue impecable. Me ayudaron a encontrar una propiedad que no solo cumplió con mis expectativas, sino que también ha resultado ser una excelente inversión.',
                                    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
                                },
                                {
                                    id: 2,
                                    name: 'Sofía Ramírez',
                                    role: 'Arquitecta',
                                    text: 'Como profesional del sector, valoro enormemente la calidad de las propiedades que ofrece Cusco Premium. Su atención al detalle y el conocimiento del mercado local son incomparables.',
                                    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
                                },
                                {
                                    id: 3,
                                    name: 'Javier López',
                                    role: 'Inversionista',
                                    text: 'He trabajado con varias inmobiliarias en Cusco, pero ninguna se compara con el nivel de profesionalismo y dedicación que he recibido de Cusco Premium. Sin duda, mi primera opción para futuras inversiones.',
                                    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
                                },
                            ].map((testimonial) => (
                                <div key={testimonial.id} className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all">
                                    <div className="flex items-center mb-4">
                                        <img
                                            src={testimonial.image}
                                            alt={testimonial.name}
                                            className="w-16 h-16 rounded-full object-cover mr-4"
                                        />
                                        <div>
                                            <h4 className="font-bold text-gray-800">{testimonial.name}</h4>
                                            <p className="text-gray-600 text-sm">{testimonial.role}</p>
                                        </div>
                                    </div>
                                    <p className="text-gray-600 italic">{testimonial.text}</p>
                                    <div className="mt-4 flex">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <svg key={star} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                    </div>
                                </div>
                            ))}
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
