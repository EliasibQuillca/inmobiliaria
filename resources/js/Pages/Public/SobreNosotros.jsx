import React from 'react';
import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';

export default function SobreNosotros({ auth }) {
    return (
        <PublicLayout auth={auth}>
            <Head title="Sobre Nosotros" />

            <div className="min-h-screen bg-gray-50">
                {/* Hero Section */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">Sobre Nosotros</h1>
                        <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                            Más de 10 años ayudando a familias a encontrar su hogar ideal
                        </p>
                    </div>
                </div>

                {/* Nuestra Historia */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">Nuestra Historia</h2>
                            <div className="space-y-4 text-gray-600">
                                <p>
                                    Fundada en 2015, nuestra inmobiliaria nació con la visión de transformar
                                    la experiencia de compra y venta de propiedades. Comenzamos como un pequeño
                                    equipo de profesionales apasionados por el sector inmobiliario.
                                </p>
                                <p>
                                    A lo largo de los años, hemos crecido hasta convertirnos en una de las
                                    inmobiliarias más confiables de la región, ayudando a más de 1,000 familias
                                    a encontrar su hogar perfecto.
                                </p>
                                <p>
                                    Nuestro compromiso es brindar un servicio personalizado, transparente y
                                    profesional en cada transacción, garantizando la satisfacción total de
                                    nuestros clientes.
                                </p>
                            </div>
                        </div>
                        <div className="bg-blue-50 rounded-lg p-8">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="text-center">
                                    <div className="text-4xl font-bold text-blue-600 mb-2">10+</div>
                                    <div className="text-sm text-gray-600">Años de Experiencia</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-4xl font-bold text-blue-600 mb-2">1000+</div>
                                    <div className="text-sm text-gray-600">Clientes Satisfechos</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-4xl font-bold text-blue-600 mb-2">500+</div>
                                    <div className="text-sm text-gray-600">Propiedades Vendidas</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-4xl font-bold text-blue-600 mb-2">98%</div>
                                    <div className="text-sm text-gray-600">Satisfacción</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Misión y Visión */}
                <div className="bg-white py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Misión */}
                            <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-xl shadow-sm border border-blue-100">
                                <div className="flex items-center mb-4">
                                    <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    </div>
                                    <h3 className="ml-4 text-2xl font-bold text-gray-900">Nuestra Misión</h3>
                                </div>
                                <p className="text-gray-600">
                                    Facilitar el proceso de compra, venta y alquiler de propiedades, ofreciendo
                                    un servicio integral, profesional y personalizado que supere las expectativas
                                    de nuestros clientes, contribuyendo a la realización de sus proyectos de vida
                                    y bienestar familiar.
                                </p>
                            </div>

                            {/* Visión */}
                            <div className="bg-gradient-to-br from-green-50 to-white p-8 rounded-xl shadow-sm border border-green-100">
                                <div className="flex items-center mb-4">
                                    <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    </div>
                                    <h3 className="ml-4 text-2xl font-bold text-gray-900">Nuestra Visión</h3>
                                </div>
                                <p className="text-gray-600">
                                    Ser la inmobiliaria líder y referente en el mercado nacional, reconocida por
                                    nuestra excelencia en el servicio, innovación tecnológica, ética profesional
                                    y compromiso con el desarrollo sostenible de las comunidades donde operamos.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Valores */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Nuestros Valores</h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Principios que guían cada una de nuestras acciones
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Valor 1 */}
                        <div className="text-center">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Confianza</h3>
                            <p className="text-gray-600">
                                Construimos relaciones duraderas basadas en la honestidad y transparencia
                            </p>
                        </div>

                        {/* Valor 2 */}
                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Compromiso</h3>
                            <p className="text-gray-600">
                                Dedicación total para lograr los objetivos de nuestros clientes
                            </p>
                        </div>

                        {/* Valor 3 */}
                        <div className="text-center">
                            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Innovación</h3>
                            <p className="text-gray-600">
                                Tecnología y procesos modernos para un servicio de excelencia
                            </p>
                        </div>

                        {/* Valor 4 */}
                        <div className="text-center">
                            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Profesionalismo</h3>
                            <p className="text-gray-600">
                                Equipo altamente capacitado con años de experiencia en el sector
                            </p>
                        </div>

                        {/* Valor 5 */}
                        <div className="text-center">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Pasión</h3>
                            <p className="text-gray-600">
                                Amor por lo que hacemos se refleja en cada proyecto que emprendemos
                            </p>
                        </div>

                        {/* Valor 6 */}
                        <div className="text-center">
                            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Trabajo en Equipo</h3>
                            <p className="text-gray-600">
                                Colaboración y sinergia para alcanzar los mejores resultados
                            </p>
                        </div>
                    </div>
                </div>

                {/* Call to Action */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-3xl font-bold text-white mb-4">
                            ¿Listo para encontrar tu hogar ideal?
                        </h2>
                        <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                            Nuestro equipo de expertos está listo para ayudarte en cada paso del camino
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/catalogo"
                                className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50"
                            >
                                Ver Propiedades
                            </Link>
                            <Link
                                href="/contacto"
                                className="inline-flex items-center justify-center px-8 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-blue-700"
                            >
                                Contáctanos
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
