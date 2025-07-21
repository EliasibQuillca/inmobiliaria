import { Head, Link } from '@inertiajs/react';
import Layout from '@/components/layout/Layout';
import { useState } from 'react';

export default function Services({ auth }) {
    // Datos de servicios
    const services = [
        {
            id: 1,
            title: 'Venta de Departamentos',
            description: 'Ofrecemos una amplia selección de departamentos premium en las mejores ubicaciones de Cusco, desde apartamentos en el centro histórico hasta modernas unidades en zonas residenciales.',
            icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
            image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1073&q=80',
            features: [
                'Propiedades premium en ubicaciones estratégicas',
                'Asesoramiento personalizado en la búsqueda',
                'Visitas guiadas a las propiedades',
                'Negociación directa con propietarios'
            ]
        },
        {
            id: 2,
            title: 'Asesoría Financiera',
            description: 'Nuestro equipo de asesores financieros le ayudará a encontrar la mejor opción de financiamiento para su propiedad, trabajando con entidades bancarias de confianza para obtener las mejores tasas del mercado.',
            icon: 'M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z',
            image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1111&q=80',
            features: [
                'Evaluación de opciones de financiamiento',
                'Precalificación para préstamos hipotecarios',
                'Asesoramiento en tasas y plazos',
                'Acompañamiento en trámites bancarios'
            ]
        },
        {
            id: 3,
            title: 'Inversiones Inmobiliarias',
            description: 'Descubra oportunidades de inversión rentables en el mercado inmobiliario de Cusco. Analizamos el potencial de cada propiedad y le ofrecemos proyecciones realistas de retorno de inversión.',
            icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6',
            image: 'https://images.unsplash.com/photo-1434626881859-194d67b2b86f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1174&q=80',
            features: [
                'Análisis de rentabilidad',
                'Proyectos con alto potencial de plusvalía',
                'Estrategias de inversión a corto y largo plazo',
                'Administración de propiedades para inversionistas'
            ]
        },
        {
            id: 4,
            title: 'Asesoría Legal Inmobiliaria',
            description: 'Contamos con un equipo de abogados especializados en derecho inmobiliario que le brindarán asesoría completa en todos los aspectos legales relacionados con la compra, venta o alquiler de propiedades.',
            icon: 'M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3',
            image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
            features: [
                'Revisión de contratos y documentos',
                'Verificación de títulos de propiedad',
                'Asesoramiento en procesos de compraventa',
                'Representación legal en trámites inmobiliarios'
            ]
        },
        {
            id: 5,
            title: 'Administración de Propiedades',
            description: 'Ofrecemos servicios integrales de administración para propietarios e inversionistas que desean maximizar el rendimiento de sus propiedades sin las preocupaciones del día a día.',
            icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
            image: 'https://images.unsplash.com/photo-1521791055366-0d553872125f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80',
            features: [
                'Gestión de alquileres',
                'Mantenimiento preventivo y correctivo',
                'Selección y verificación de inquilinos',
                'Informes periódicos de rendimiento'
            ]
        },
        {
            id: 6,
            title: 'Proyectos Exclusivos',
            description: 'Participamos en el desarrollo de proyectos inmobiliarios exclusivos en Cusco, ofreciendo a nuestros clientes la oportunidad de invertir o adquirir propiedades desde planos con excelentes beneficios.',
            icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10',
            image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
            features: [
                'Proyectos arquitectónicos innovadores',
                'Ubicaciones privilegiadas en Cusco',
                'Precios preferenciales en preventa',
                'Personalización de acabados'
            ]
        }
    ];

    return (
        <Layout auth={auth}>
            <Head title="Servicios - Inmobiliaria Cusco" />
            <div className="bg-white">
                {/* Hero de Servicios */}
                <div className="relative mb-16 mt-8">
                    <div className="h-80 bg-gradient-to-r from-indigo-700 to-blue-500 relative rounded-xl overflow-hidden">
                        <img
                            src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
                            alt="Servicios inmobiliarios"
                            className="absolute inset-0 w-full h-full object-cover object-center mix-blend-overlay"
                        />
                        <div className="absolute inset-0 bg-indigo-900/70"></div>
                        <div className="container mx-auto px-4 h-full flex flex-col justify-center items-center relative z-10">
                            <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">Nuestros Servicios</h1>
                            <p className="text-xl text-white text-center max-w-2xl drop-shadow-md">
                                Soluciones inmobiliarias integrales adaptadas a sus necesidades
                            </p>
                        </div>
                    </div>
                </div>

                {/* Introducción */}
                <section className="py-12 bg-white">
                    <div className="container mx-auto px-4 md:px-8">
                        <div className="max-w-3xl mx-auto text-center">
                            <h2 className="text-3xl font-bold text-gray-800 mb-6">Experiencia Inmobiliaria Premium</h2>
                            <p className="text-lg text-gray-600 mb-8">
                                En Cusco Premium, entendemos que cada cliente tiene necesidades únicas. Por eso, ofrecemos una amplia gama de servicios inmobiliarios diseñados para satisfacer los requerimientos más exigentes del mercado cusqueño.
                            </p>
                            <div className="flex justify-center">
                                <div className="w-20 h-1 bg-indigo-600"></div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Listado de Servicios */}
                <section className="py-12 bg-gray-50">
                    <div className="container mx-auto px-4 md:px-8">
                        <div className="space-y-24">
                            {services.map((service, index) => (
                                <div key={service.id} className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 items-center`}>
                                    <div className="lg:w-1/2">
                                        <div className="relative">
                                            <div className="absolute -inset-4 bg-indigo-600 rounded-xl opacity-10 blur-lg"></div>
                                            <img
                                                src={service.image}
                                                alt={service.title}
                                                className="relative rounded-lg shadow-xl w-full object-cover h-72 lg:h-96"
                                            />
                                        </div>
                                    </div>
                                    <div className="lg:w-1/2">
                                        <div className="rounded-full bg-indigo-100 p-4 w-16 h-16 flex items-center justify-center mb-6">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={service.icon} />
                                            </svg>
                                        </div>
                                        <h3 className="text-2xl font-bold mb-4 text-gray-800">{service.title}</h3>
                                        <p className="text-gray-600 mb-6">
                                            {service.description}
                                        </p>
                                        <ul className="space-y-3 mb-8">
                                            {service.features.map((feature, fIndex) => (
                                                <li key={fIndex} className="flex items-start">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600 mr-2 mt-1" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                    </svg>
                                                    <span>{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                        <button className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-all inline-flex items-center">
                                            Solicitar Información
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="py-16 bg-white">
                    <div className="container mx-auto px-4 md:px-8">
                        <div className="bg-gradient-to-r from-indigo-700 to-blue-500 rounded-xl p-10 md:p-16 shadow-xl text-center">
                            <h2 className="text-3xl font-bold text-white mb-6">¿Listo para dar el siguiente paso?</h2>
                            <p className="text-xl text-white mb-8 max-w-2xl mx-auto">
                                Nuestros asesores inmobiliarios están preparados para ayudarte a encontrar la propiedad perfecta o brindarte la asesoría que necesitas.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link href="/contact" className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                                    Contactar Ahora
                                </Link>
                                <Link href="/properties" className="bg-transparent text-white border border-white px-8 py-3 rounded-lg font-medium hover:bg-white/10 transition-colors">
                                    Ver Propiedades
                                </Link>
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
