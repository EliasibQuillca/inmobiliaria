  import { Head, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import DepartamentosDestacados from '@/components/DepartamentosDestacados';

export default function Welcome({ auth }) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isScrolled, setIsScrolled] = useState(false);
    const [searchParams, setSearchParams] = useState({
        location: '',
        type: 'all',
        bedrooms: 'any',
        priceRange: 'any'
    });

    const handleSearchChange = (e) => {
        const { name, value } = e.target;
        setSearchParams(prev => ({ ...prev, [name]: value }));
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        // En una implementación real, esto redirigiría a la página de resultados con los filtros aplicados
        console.log('Search params:', searchParams);
        // Usar Inertia.visit para navegación en SPA
        const url = `/catalogo?location=${encodeURIComponent(searchParams.location)}&type=${encodeURIComponent(searchParams.type)}&bedrooms=${encodeURIComponent(searchParams.bedrooms)}&priceRange=${encodeURIComponent(searchParams.priceRange)}`;
        window.location.href = url;
    };

    const featuredProperties = [
        {
            id: 1,
            title: "Apartamento de Lujo en Cusco Centro",
            price: "S/ 850,000",
            location: "Centro Histórico, Cusco",
            image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
            beds: 3,
            baths: 2,
            area: "120m²",
            featured: true
        },
        {
            id: 2,
            title: "Penthouse con Vista a la Montaña",
            price: "S/ 1,250,000",
            location: "San Blas, Cusco",
            image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
            beds: 4,
            baths: 3,
            area: "180m²",
            featured: true
        },
        {
            id: 3,
            title: "Moderno Departamento con Terraza",
            price: "S/ 650,000",
            location: "Wanchaq, Cusco",
            image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
            beds: 2,
            baths: 2,
            area: "95m²",
            featured: true
        },
    ];

    const testimonials = [
        {
            id: 1,
            name: "María García",
            role: "Propietaria",
            image: "https://randomuser.me/api/portraits/women/12.jpg",
            quote: "Encontrar mi departamento ideal fue muy sencillo gracias al equipo de profesionales. El proceso de compra fue rápido y transparente."
        },
        {
            id: 2,
            name: "Carlos Rodríguez",
            role: "Inversionista",
            image: "https://randomuser.me/api/portraits/men/32.jpg",
            quote: "He realizado varias inversiones inmobiliarias con esta empresa y siempre he obtenido excelentes rendimientos. Su asesoramiento es invaluable."
        },
        {
            id: 3,
            name: "Ana Mendoza",
            role: "Compradora",
            image: "https://randomuser.me/api/portraits/women/68.jpg",
            quote: "Nos encantó el servicio personalizado. Nuestro asesor entendió perfectamente lo que buscábamos y nos mostró opciones que realmente se ajustaban a nuestras necesidades."
        }
    ];

    const features = [
        {
            id: 1,
            title: "Propiedades Premium",
            description: "Seleccionamos cuidadosamente cada propiedad para garantizar la mejor calidad y ubicación.",
            icon: (
                <svg className="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
            )
        },
        {
            id: 2,
            title: "Asesoría Personalizada",
            description: "Nuestro equipo de expertos te guiará en cada paso del proceso de compra o venta.",
            icon: (
                <svg className="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            )
        },
        {
            id: 3,
            title: "Financiamiento Flexible",
            description: "Contamos con alianzas estratégicas con entidades financieras para ofrecerte las mejores opciones de crédito.",
            icon: (
                <svg className="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            )
        }
    ];

    const stats = [
        { id: 1, value: "350+", label: "Propiedades vendidas" },
        { id: 2, value: "98%", label: "Clientes satisfechos" },
        { id: 3, value: "15+", label: "Años de experiencia" },
        { id: 4, value: "24/7", label: "Soporte al cliente" }
    ];

    const heroSlides = [
        {
            id: 1,
            title: "Encuentra tu hogar perfecto en Cusco",
            subtitle: "Departamentos exclusivos con la mejor ubicación",
            image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80",
            cta: "Ver Propiedades"
        },
        {
            id: 2,
            title: "Inversiones inmobiliarias seguras",
            subtitle: "La mejor rentabilidad en el corazón de los Andes",
            image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
            cta: "Contactar Asesor"
        },
        {
            id: 3,
            title: "Vive la experiencia Cusco Premium",
            subtitle: "Departamentos diseñados para un estilo de vida excepcional",
            image: "https://images.unsplash.com/photo-1600047509807-f8261a3f7538?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
            cta: "Agendar Visita"
        }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prevSlide) => (prevSlide + 1) % heroSlides.length);
        }, 6000);

        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            clearInterval(interval);
            window.removeEventListener('scroll', handleScroll);
        };
    }, [heroSlides.length]);

    return (
        <Layout auth={auth}>
            <Head title="Inmobiliaria Cusco - Propiedades de Lujo en Cusco" />
            <div className="min-h-screen bg-white">
                {/* Hero Section with Slider */}
                <div className="relative h-screen">
                    {/* Slides */}
                    {heroSlides.map((slide, index) => (
                        <div
                            key={slide.id}
                            className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
                        >
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
                            <img
                                src={slide.image}
                                className="h-full w-full object-cover"
                                alt={slide.title}
                            />
                            <div className="absolute inset-0 flex flex-col justify-center px-4 md:px-16 lg:px-32">
                                <div className="max-w-xl">
                                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">{slide.title}</h1>
                                    <p className="text-xl md:text-2xl text-white mb-8">{slide.subtitle}</p>
                                    <Link href={slide.id === 1 ? "/catalogo" : slide.id === 2 ? "/contact" : "/contact"} className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-indigo-700 transition-all">
                                        {slide.cta}
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Slider Navigation */}
                    <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2">
                        {heroSlides.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentSlide(index)}
                                className={`w-3 h-3 rounded-full transition-all ${index === currentSlide ? 'bg-white scale-125' : 'bg-white/50'}`}
                                aria-label={`Go to slide ${index + 1}`}
                            ></button>
                        ))}
                    </div>
                </div>

                {/* Search Section */}
                <div className="py-16 bg-white">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6 -mt-32 relative z-10">
                            <h2 className="text-2xl font-bold text-center mb-6">Encuentra tu propiedad ideal</h2>
                            <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div>
                                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Ubicación</label>
                                    <input
                                        type="text"
                                        id="location"
                                        name="location"
                                        value={searchParams.location}
                                        onChange={handleSearchChange}
                                        placeholder="Distrito, zona o ciudad"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                                    <select
                                        id="type"
                                        name="type"
                                        value={searchParams.type}
                                        onChange={handleSearchChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                    >
                                        <option value="all">Todos</option>
                                        <option value="apartment">Departamento</option>
                                        <option value="house">Casa</option>
                                        <option value="land">Terreno</option>
                                        <option value="commercial">Comercial</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700 mb-1">Dormitorios</label>
                                    <select
                                        id="bedrooms"
                                        name="bedrooms"
                                        value={searchParams.bedrooms}
                                        onChange={handleSearchChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                    >
                                        <option value="any">Cualquiera</option>
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                        <option value="4+">4+</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="priceRange" className="block text-sm font-medium text-gray-700 mb-1">Rango de Precio</label>
                                    <select
                                        id="priceRange"
                                        name="priceRange"
                                        value={searchParams.priceRange}
                                        onChange={handleSearchChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                    >
                                        <option value="any">Cualquier precio</option>
                                        <option value="0-100000">Hasta S/ 100,000</option>
                                        <option value="100000-300000">S/ 100,000 - S/ 300,000</option>
                                        <option value="300000-600000">S/ 300,000 - S/ 600,000</option>
                                        <option value="600000-1000000">S/ 600,000 - S/ 1,000,000</option>
                                        <option value="1000000+">Más de S/ 1,000,000</option>
                                    </select>
                                </div>
                                <div className="md:col-span-2 lg:col-span-4 mt-2">
                                    <button type="submit" className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors">
                                        Buscar Propiedades
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Featured Content */}
                <DepartamentosDestacados />

                {/* Why Choose Us Section */}
                <div className="py-16 bg-white">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold mb-4">¿Por qué elegirnos?</h2>
                            <p className="text-gray-600 max-w-2xl mx-auto">Somos la inmobiliaria líder en Cusco con años de experiencia ofreciendo las mejores propiedades y un servicio excepcional a nuestros clientes.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {features.map(feature => (
                                <div key={feature.id} className="p-6 bg-gray-50 rounded-lg">
                                    <div className="mb-4">{feature.icon}</div>
                                    <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                                    <p className="text-gray-600">{feature.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Testimonials Section */}
                <div className="py-16 bg-gray-50">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl font-bold text-center mb-12">Lo que dicen nuestros clientes</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {testimonials.map(testimonial => (
                                <div key={testimonial.id} className="bg-white p-6 rounded-lg shadow-md">
                                    <div className="flex items-center mb-4">
                                        <img src={testimonial.image} alt={testimonial.name} className="w-12 h-12 rounded-full mr-4" />
                                        <div>
                                            <h3 className="font-bold">{testimonial.name}</h3>
                                            <p className="text-gray-600 text-sm">{testimonial.role}</p>
                                        </div>
                                    </div>
                                    <p className="text-gray-600 italic">{testimonial.quote}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Stats Section */}
                <div className="py-16 bg-indigo-700 text-white">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                            {stats.map(stat => (
                                <div key={stat.id}>
                                    <div className="text-4xl font-bold mb-2">{stat.value}</div>
                                    <div className="text-indigo-200">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="py-20 bg-white">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-3xl font-bold mb-6">¿Listo para encontrar tu hogar ideal?</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto mb-8">Nuestro equipo de asesores inmobiliarios está disponible para ayudarte a encontrar la propiedad perfecta que se ajuste a tus necesidades y presupuesto.</p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <Link href="/catalogo" className="bg-indigo-600 text-white py-3 px-8 rounded-lg hover:bg-indigo-700 transition-colors">
                                Explorar propiedades
                            </Link>
                            <Link href="/contact" className="bg-white text-indigo-600 border border-indigo-600 py-3 px-8 rounded-lg hover:bg-indigo-50 transition-colors">
                                Contactar un asesor
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
