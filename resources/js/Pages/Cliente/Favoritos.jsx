import { Head, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';

export default function Favoritos({ auth }) {
    // Estado para departamentos favoritos
    const [favoritos, setFavoritos] = useState([]);

    // Estado para carga
    const [loading, setLoading] = useState(true);

    // Cargar favoritos (simulado)
    useEffect(() => {
        // En un caso real, cargaríamos desde una API
        setTimeout(() => {
            setFavoritos([
                {
                    id: 1,
                    nombre: 'Departamento Magisterio 101',
                    ubicacion: 'Calle Magisterio 123, Sector A',
                    precio: 120000,
                    area: 75,
                    habitaciones: 2,
                    banos: 1,
                    estacionamientos: 1,
                    descripcion: 'Hermoso departamento con acabados de lujo, amplia sala-comedor, cocina equipada, 2 habitaciones, 1 baño completo, área de servicio y 1 estacionamiento.',
                    imagen: '/img/depto1.jpg',
                    estado: 'Disponible'
                },
                {
                    id: 3,
                    nombre: 'Departamento Lima 305',
                    ubicacion: 'Av. Lima 305, Sector B',
                    precio: 180000,
                    area: 95,
                    habitaciones: 3,
                    banos: 2,
                    estacionamientos: 1,
                    descripcion: 'Exclusivo departamento con excelente distribución, sala-comedor amplio, cocina con isla, 3 habitaciones, 2 baños completos, cuarto de servicio y 1 estacionamiento.',
                    imagen: '/img/depto3.jpg',
                    estado: 'Disponible'
                },
                {
                    id: 5,
                    nombre: 'Departamento Cusco 205',
                    ubicacion: 'Calle Cusco 205, Sector D',
                    precio: 165000,
                    area: 85,
                    habitaciones: 3,
                    banos: 2,
                    estacionamientos: 1,
                    descripcion: 'Moderno departamento con acabados de primera, amplia sala-comedor, cocina equipada, 3 habitaciones, 2 baños completos y 1 estacionamiento.',
                    imagen: '/img/depto5.jpg',
                    estado: 'Disponible'
                },
                {
                    id: 7,
                    nombre: 'Departamento Arequipa 401',
                    ubicacion: 'Av. Arequipa 401, Sector C',
                    precio: 130000,
                    area: 68,
                    habitaciones: 2,
                    banos: 1,
                    estacionamientos: 1,
                    descripcion: 'Acogedor departamento con vista panorámica, sala-comedor, cocina americana, 2 habitaciones, 1 baño completo y 1 estacionamiento.',
                    imagen: '/img/depto7.jpg',
                    estado: 'Disponible'
                }
            ]);
            setLoading(false);
        }, 800);
    }, []);

    // Formatear precio
    const formatPrecio = (precio) => {
        return precio.toLocaleString('es-ES', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        });
    };

    // Remover de favoritos (simulado)
    const handleRemoveFavorito = (id) => {
        if (confirm('¿Estás seguro de que deseas eliminar este departamento de tus favoritos?')) {
            // En un caso real, enviaríamos la solicitud a la API
            setFavoritos(favoritos.filter(favorito => favorito.id !== id));
        }
    };

    return (
        <Layout auth={auth}>
            <Head title="Mis Favoritos - Inmobiliaria" />

            <div className="py-12 bg-gray-100 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-8 flex justify-between items-center">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900">
                                Mis Favoritos
                            </h2>
                            <p className="mt-1 text-lg text-gray-600">
                                Departamentos que has guardado como favoritos
                            </p>
                        </div>
                        <Link
                            href="/cliente/dashboard"
                            className="text-blue-600 hover:text-blue-800 flex items-center"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                            </svg>
                            Volver al dashboard
                        </Link>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                    ) : favoritos.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {favoritos.map((favorito) => (
                                <div key={favorito.id} className="bg-white overflow-hidden shadow-md rounded-lg">
                                    <div className="relative h-48 overflow-hidden">
                                        <img
                                            src={favorito.imagen}
                                            alt={favorito.nombre}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute top-0 right-0 m-2">
                                            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                                {favorito.estado}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                            {favorito.nombre}
                                        </h3>
                                        <p className="text-sm text-gray-600 mb-3">
                                            {favorito.ubicacion}
                                        </p>
                                        <p className="text-xl font-bold text-gray-900 mb-4">
                                            {formatPrecio(favorito.precio)}
                                        </p>

                                        <div className="flex justify-between text-sm text-gray-500 mb-4">
                                            <div className="flex items-center">
                                                <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                                                </svg>
                                                <span>{favorito.area} m²</span>
                                            </div>
                                            <div className="flex items-center">
                                                <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                                </svg>
                                                <span>{favorito.habitaciones} hab.</span>
                                            </div>
                                            <div className="flex items-center">
                                                <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                                </svg>
                                                <span>{favorito.banos} baños</span>
                                            </div>
                                        </div>

                                        <div className="mt-4 flex space-x-2">
                                            <Link
                                                href={`/cliente/departamentos/${favorito.id}`}
                                                className="flex-1 bg-blue-600 text-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                            >
                                                Ver detalles
                                            </Link>
                                            <button
                                                onClick={() => handleRemoveFavorito(favorito.id)}
                                                className="p-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                            >
                                                <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white overflow-hidden shadow-md rounded-lg p-8 text-center">
                            <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No hay favoritos</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                Aún no has guardado ningún departamento como favorito.
                            </p>
                            <div className="mt-6">
                                <Link
                                    href="/cliente/catalogo"
                                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Explorar departamentos
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}
