import { Head, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';

export default function Welcome({ auth }) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isScrolled, setIsScrolled] = useState(false);

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

                {/* Featured Content */}
                <div className="py-16 bg-gray-50">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl font-bold text-center mb-12">Propiedades Destacadas</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {featuredProperties.map(property => (
                                <div key={property.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                                    <img
                                        src={property.image}
                                        alt={property.title}
                                        className="w-full h-48 object-cover"
                                    />
                                    <div className="p-6">
                                        <h3 className="font-bold text-xl mb-2">{property.title}</h3>
                                        <p className="text-gray-700 text-sm mb-2">{property.location}</p>
                                        <p className="text-indigo-600 font-bold text-xl mb-4">{property.price}</p>
                                        <div className="flex justify-between text-sm text-gray-500">
                                            <span>{property.beds} Dormitorios</span>
                                            <span>{property.baths} Baños</span>
                                            <span>{property.area}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
