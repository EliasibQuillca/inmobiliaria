import { Head, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import Layout from '@/Components/Layout/Layout';

export default function Welcome({ auth }) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

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
                {/* Navbar */}
                <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'}`}>
                    <div className="container mx-auto px-4 md:px-8 flex justify-between items-center">
                        <Link href="/" className="flex items-center">
                            <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-indigo-700 to-blue-500 bg-clip-text text-transparent">
                                CUSCO PREMIUM
                            </span>
                        </Link>

                        {/* Mobile menu button */}
                        <div className="md:hidden">
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="text-gray-700 hover:text-indigo-600 focus:outline-none"
                            >
                                {isMenuOpen ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                )}
                            </button>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-8">
                            <Link href="#propiedades" className="text-gray-700 hover:text-indigo-600 font-medium">
                                Propiedades
                            </Link>
                            <Link href="#nosotros" className="text-gray-700 hover:text-indigo-600 font-medium">
                                Nosotros
                            </Link>
                            <Link href="#servicios" className="text-gray-700 hover:text-indigo-600 font-medium">
                                Servicios
                            </Link>
                            <Link href="#contacto" className="text-gray-700 hover:text-indigo-600 font-medium">
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

                    {/* Mobile Navigation */}
                    <div className={`md:hidden transition-all duration-300 overflow-hidden ${isMenuOpen ? 'max-h-96 py-4' : 'max-h-0'}`}>
                        <div className="container mx-auto px-4 flex flex-col space-y-4">
                            <Link href="#propiedades" className="text-gray-700 hover:text-indigo-600 font-medium">
                                Propiedades
                            </Link>
                            <Link href="#nosotros" className="text-gray-700 hover:text-indigo-600 font-medium">
                                Nosotros
                            </Link>
                            <Link href="#servicios" className="text-gray-700 hover:text-indigo-600 font-medium">
                                Servicios
                            </Link>
                            <Link href="#contacto" className="text-gray-700 hover:text-indigo-600 font-medium">
                                Contacto
                            </Link>

                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-all text-center"
                                >
                                    Panel de Control
                                </Link>
                            ) : (
                                <div className="flex flex-col space-y-4">
                                    <Link
                                        href={route('login')}
                                        className="text-indigo-600 font-medium hover:text-indigo-800 text-center"
                                    >
                                        Iniciar Sesión
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-all text-center"
                                    >
                                        Registrarse
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </nav>

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
                                    <button className="bg-indigo-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-indigo-700 transition-all">
                                        {slide.cta}
                                    </button>
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

                {/* Search Bar */}
                <div className="relative bg-white py-6">
                    <div className="container mx-auto px-4 md:px-8 -mt-20 relative z-10">
                        <div className="bg-white rounded-xl shadow-xl p-6">
                            <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Encuentra tu departamento ideal</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Ubicación</label>
                                    <select className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                                        <option>Todas las zonas</option>
                                        <option>Centro Histórico</option>
                                        <option>San Blas</option>
                                        <option>Wanchaq</option>
                                        <option>San Sebastián</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Presupuesto</label>
                                    <select className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                                        <option>Cualquier precio</option>
                                        <option>Hasta S/ 500,000</option>
                                        <option>S/ 500,000 - S/ 800,000</option>
                                        <option>S/ 800,000 - S/ 1,200,000</option>
                                        <option>Más de S/ 1,200,000</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Dormitorios</label>
                                    <select className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                                        <option>Cualquiera</option>
                                        <option>1+</option>
                                        <option>2+</option>
                                        <option>3+</option>
                                        <option>4+</option>
                                    </select>
                                </div>
                                <div className="flex items-end">
                                    <button className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition-all">
                                        Buscar Propiedades
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Featured Properties */}
                <section id="propiedades" className="py-16 bg-gray-50">
                    <div className="container mx-auto px-4 md:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-gray-800 mb-4">Departamentos Destacados</h2>
                            <p className="text-gray-600 max-w-2xl mx-auto">
                                Descubre nuestras mejores propiedades seleccionadas por ubicación privilegiada, diseño exclusivo y excelente oportunidad de inversión.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {featuredProperties.map((property) => (
                                <div key={property.id} className="bg-white rounded-xl overflow-hidden shadow-lg transition-all hover:shadow-xl hover:-translate-y-1">
                                    <div className="relative">
                                        <img
                                            src={property.image}
                                            alt={property.title}
                                            className="w-full h-64 object-cover"
                                        />
                                        <div className="absolute top-4 right-4 bg-indigo-600 text-white text-sm font-semibold px-3 py-1 rounded-full">
                                            Destacado
                                        </div>
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
                                        <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg transition-colors">
                                            Ver Detalles
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="text-center mt-12">
                            <Link href="/propiedades" className="inline-block bg-white border border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-colors px-8 py-3 rounded-lg font-medium">
                                Ver Todas las Propiedades
                            </Link>
                        </div>
                    </div>
                </section>

                {/* About Us Section */}
                <section id="nosotros" className="py-16 bg-white">
                    <div className="container mx-auto px-4 md:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            <div>
                                <h2 className="text-3xl font-bold text-gray-800 mb-6">Sobre Nosotros</h2>
                                <div className="w-20 h-1 bg-indigo-600 mb-6"></div>
                                <p className="text-gray-600 mb-6">
                                    Somos una inmobiliaria especializada en departamentos de alta gama en Cusco,
                                    enfocados en brindar experiencias excepcionales tanto para inversores como para
                                    propietarios que buscan un hogar con estilo.
                                </p>
                                <p className="text-gray-600 mb-6">
                                    Con más de 10 años de experiencia en el mercado inmobiliario de Cusco,
                                    nuestro equipo de asesores profesionales está preparado para encontrar la propiedad
                                    perfecta que se adapte a sus necesidades y estilo de vida.
                                </p>
                                <div className="flex flex-wrap gap-4 mt-8">
                                    <div className="flex items-center">
                                        <div className="rounded-full bg-indigo-100 p-3 mr-4">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <span className="font-medium">Asesoramiento Personalizado</span>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="rounded-full bg-indigo-100 p-3 mr-4">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <span className="font-medium">Propiedades Exclusivas</span>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="rounded-full bg-indigo-100 p-3 mr-4">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <span className="font-medium">Inversiones Seguras</span>
                                    </div>
                                </div>
                            </div>
                            <div className="relative">
                                <img
                                    src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1073&q=80"
                                    alt="Nuestro equipo"
                                    className="rounded-lg shadow-xl w-full"
                                />
                                <div className="absolute -bottom-6 -left-6 bg-indigo-600 text-white p-6 rounded-lg shadow-lg">
                                    <p className="text-2xl font-bold">+500</p>
                                    <p className="text-sm">Clientes Satisfechos</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Services Section */}
                <section id="servicios" className="py-16 bg-gray-50">
                    <div className="container mx-auto px-4 md:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-gray-800 mb-4">Nuestros Servicios</h2>
                            <p className="text-gray-600 max-w-2xl mx-auto">
                                Ofrecemos soluciones completas para satisfacer todas sus necesidades inmobiliarias
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                                <div className="rounded-full bg-indigo-100 p-4 w-16 h-16 flex items-center justify-center mb-6">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold mb-4 text-gray-800">Venta de Departamentos</h3>
                                <p className="text-gray-600 mb-6">
                                    Encuentre el departamento de sus sueños con nuestra selección exclusiva de propiedades en las mejores zonas de Cusco.
                                </p>
                                <a href="#" className="text-indigo-600 font-medium hover:text-indigo-800 flex items-center">
                                    Ver Propiedades
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </a>
                            </div>

                            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                                <div className="rounded-full bg-indigo-100 p-4 w-16 h-16 flex items-center justify-center mb-6">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold mb-4 text-gray-800">Asesoría Financiera</h3>
                                <p className="text-gray-600 mb-6">
                                    Le ayudamos a encontrar la mejor opción de financiamiento y a realizar todos los trámites necesarios para adquirir su propiedad.
                                </p>
                                <a href="#" className="text-indigo-600 font-medium hover:text-indigo-800 flex items-center">
                                    Cotizar Ahora
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </a>
                            </div>

                            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                                <div className="rounded-full bg-indigo-100 p-4 w-16 h-16 flex items-center justify-center mb-6">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold mb-4 text-gray-800">Inversiones Inmobiliarias</h3>
                                <p className="text-gray-600 mb-6">
                                    Descubra oportunidades de inversión rentables en el mercado inmobiliario de Cusco con nuestro asesoramiento especializado.
                                </p>
                                <a href="#" className="text-indigo-600 font-medium hover:text-indigo-800 flex items-center">
                                    Explorar Opciones
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Contact Section */}
                <section id="contacto" className="py-16 bg-white">
                    <div className="container mx-auto px-4 md:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            <div>
                                <h2 className="text-3xl font-bold text-gray-800 mb-6">Contáctenos</h2>
                                <div className="w-20 h-1 bg-indigo-600 mb-6"></div>
                                <p className="text-gray-600 mb-8">
                                    Estamos aquí para responder cualquier consulta que tenga sobre nuestras propiedades.
                                    Complete el formulario y nos pondremos en contacto a la brevedad.
                                </p>

                                <div className="flex items-start mb-6">
                                    <div className="rounded-full bg-indigo-100 p-3 mr-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-800">Dirección</h3>
                                        <p className="text-gray-600">Av. Sol 345, Centro Histórico, Cusco</p>
                                    </div>
                                </div>

                                <div className="flex items-start mb-6">
                                    <div className="rounded-full bg-indigo-100 p-3 mr-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-800">Teléfono</h3>
                                        <p className="text-gray-600">+51 984 123 456</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="rounded-full bg-indigo-100 p-3 mr-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-800">Email</h3>
                                        <p className="text-gray-600">info@cuscopremium.com</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-lg p-8">
                                <form>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                                            <input type="text" className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                            <input type="email" className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                                        </div>
                                    </div>
                                    <div className="mb-6">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                                        <input type="tel" className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                                    </div>
                                    <div className="mb-6">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Mensaje</label>
                                        <textarea rows="4" className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"></textarea>
                                    </div>
                                    <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-all">
                                        Enviar Mensaje
                                    </button>
                                </form>
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
                                    <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Inicio</a></li>
                                    <li><a href="#propiedades" className="text-gray-400 hover:text-white transition-colors">Propiedades</a></li>
                                    <li><a href="#nosotros" className="text-gray-400 hover:text-white transition-colors">Nosotros</a></li>
                                    <li><a href="#servicios" className="text-gray-400 hover:text-white transition-colors">Servicios</a></li>
                                    <li><a href="#contacto" className="text-gray-400 hover:text-white transition-colors">Contacto</a></li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold mb-4">Servicios</h3>
                                <ul className="space-y-2">
                                    <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Venta de Departamentos</a></li>
                                    <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Asesoría Financiera</a></li>
                                    <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Inversiones Inmobiliarias</a></li>
                                    <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Visitas Guiadas</a></li>
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
