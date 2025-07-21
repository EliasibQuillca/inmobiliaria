import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import Layout from '@/Components/Layout/Layout';

export default function Properties({ auth }) {
    // Mock data - en una aplicación real, esto vendría del backend
    const featuredProperties = [
        {
            id: 1,
            title: 'Departamento de Lujo en Centro Histórico',
            location: 'Centro Histórico, Cusco',
            price: 'S/ 850,000',
            image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
            beds: 3,
            baths: 2,
            area: '120 m²'
        },
        {
            id: 2,
            title: 'Penthouse con Vista a la Plaza',
            location: 'San Blas, Cusco',
            price: 'S/ 1,200,000',
            image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
            beds: 4,
            baths: 3,
            area: '180 m²'
        },
        {
            id: 3,
            title: 'Departamento Moderno en Zona Residencial',
            location: 'Wanchaq, Cusco',
            price: 'S/ 620,000',
            image: 'https://images.unsplash.com/photo-1460317442991-0ec209397118?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
            beds: 2,
            baths: 2,
            area: '85 m²'
        },
        {
            id: 4,
            title: 'Departamento con Jardín Privado',
            location: 'San Sebastián, Cusco',
            price: 'S/ 780,000',
            image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1174&q=80',
            beds: 3,
            baths: 2,
            area: '110 m²'
        },
        {
            id: 5,
            title: 'Ático con Terraza Panorámica',
            location: 'Centro Histórico, Cusco',
            price: 'S/ 950,000',
            image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
            beds: 3,
            baths: 3,
            area: '140 m²'
        },
        {
            id: 6,
            title: 'Departamento Familiar Amplio',
            location: 'Wanchaq, Cusco',
            price: 'S/ 720,000',
            image: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
            beds: 4,
            baths: 2,
            area: '130 m²'
        }
    ];

    // Estado para el filtro
    const [filters, setFilters] = useState({
        location: '',
        priceRange: '',
        bedrooms: '',
        propertyType: ''
    });

    // Manejadores para los filtros
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <Layout auth={auth}>
            <Head title="Propiedades - Inmobiliaria Cusco" />
            <div className="bg-white">
                {/* Hero de propiedades */}
                <div className="relative mb-12 mt-8">
                    <div className="h-80 bg-gradient-to-r from-indigo-700 to-blue-500 relative rounded-xl overflow-hidden">
                        <img
                            src="https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                            alt="Propiedades en Cusco"
                            className="absolute inset-0 w-full h-full object-cover object-center mix-blend-overlay"
                        />
                        <div className="absolute inset-0 bg-indigo-900/70"></div>
                        <div className="container mx-auto px-4 h-full flex flex-col justify-center items-center relative z-10">
                            <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">Encuentra tu Propiedad Ideal</h1>
                            <p className="text-xl text-white text-center max-w-2xl drop-shadow-md">
                                Descubre nuestra selección de propiedades premium en las mejores zonas de Cusco
                            </p>
                        </div>
                    </div>
                </div>

                {/* Filtros de búsqueda */}
                <div className="container mx-auto px-4 md:px-8 mb-12">
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Buscar Propiedades</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Ubicación</label>
                                <select
                                    name="location"
                                    value={filters.location}
                                    onChange={handleFilterChange}
                                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                >
                                    <option value="">Todas las zonas</option>
                                    <option value="centro">Centro Histórico</option>
                                    <option value="san-blas">San Blas</option>
                                    <option value="wanchaq">Wanchaq</option>
                                    <option value="san-sebastian">San Sebastián</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Presupuesto</label>
                                <select
                                    name="priceRange"
                                    value={filters.priceRange}
                                    onChange={handleFilterChange}
                                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                >
                                    <option value="">Cualquier precio</option>
                                    <option value="0-500000">Hasta S/ 500,000</option>
                                    <option value="500000-800000">S/ 500,000 - S/ 800,000</option>
                                    <option value="800000-1200000">S/ 800,000 - S/ 1,200,000</option>
                                    <option value="1200000-9999999">Más de S/ 1,200,000</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Dormitorios</label>
                                <select
                                    name="bedrooms"
                                    value={filters.bedrooms}
                                    onChange={handleFilterChange}
                                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                >
                                    <option value="">Cualquiera</option>
                                    <option value="1">1+</option>
                                    <option value="2">2+</option>
                                    <option value="3">3+</option>
                                    <option value="4">4+</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Propiedad</label>
                                <select
                                    name="propertyType"
                                    value={filters.propertyType}
                                    onChange={handleFilterChange}
                                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                >
                                    <option value="">Todos los tipos</option>
                                    <option value="apartment">Departamento</option>
                                    <option value="penthouse">Penthouse</option>
                                    <option value="duplex">Dúplex</option>
                                    <option value="studio">Estudio</option>
                                </select>
                            </div>
                        </div>
                        <div className="mt-6 flex justify-center">
                            <button className="bg-indigo-600 text-white py-3 px-8 rounded-lg hover:bg-indigo-700 transition-all">
                                Buscar Propiedades
                            </button>
                        </div>
                    </div>
                </div>

                {/* Lista de propiedades */}
                <section className="py-12 bg-gray-50">
                    <div className="container mx-auto px-4 md:px-8">
                        <h2 className="text-3xl font-bold text-gray-800 mb-6">Propiedades Disponibles</h2>
                        <p className="text-gray-600 max-w-2xl mb-10">
                            Explora nuestra selección de departamentos premium en las mejores ubicaciones de Cusco.
                            Todos nuestros inmuebles cumplen con los más altos estándares de calidad.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {featuredProperties.map((property) => (
                                <div key={property.id} className="bg-white rounded-xl overflow-hidden shadow-lg transition-all hover:shadow-xl hover:-translate-y-1">
                                    <div className="relative">
                                        <img
                                            src={property.image}
                                            alt={property.title}
                                            className="w-full h-64 object-cover"
                                        />
                                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white">
                                            <p className="text-2xl font-bold">{property.price}</p>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <h3 className="text-xl font-semibold mb-2 text-gray-800">{property.title}</h3>
                                        <p className="text-gray-600 flex items-center mb-4">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                            </svg>
                                            {property.location}
                                        </p>
                                        <div className="flex justify-between text-gray-600 border-t border-gray-100 pt-4">
                                            <div className="flex items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                                </svg>
                                                <span>{property.beds} Dorm.</span>
                                            </div>
                                            <div className="flex items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                <span>{property.baths} Baños</span>
                                            </div>
                                            <div className="flex items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                                                </svg>
                                                <span>{property.area}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="px-6 pb-6">
                                        <Link href={`/properties/${property.id}`} className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg transition-colors text-center">
                                            Ver Detalles
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-center mt-12">
                            <div className="inline-flex rounded-md shadow">
                                <button className="py-2 px-4 rounded-l-md bg-white text-indigo-600 border border-indigo-600 hover:bg-gray-50">Anterior</button>
                                <button className="py-2 px-4 bg-indigo-600 text-white hover:bg-indigo-700">1</button>
                                <button className="py-2 px-4 bg-white text-indigo-600 border border-indigo-600 hover:bg-gray-50">2</button>
                                <button className="py-2 px-4 bg-white text-indigo-600 border border-indigo-600 hover:bg-gray-50">3</button>
                                <button className="py-2 px-4 rounded-r-md bg-white text-indigo-600 border border-indigo-600 hover:bg-gray-50">Siguiente</button>
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
