import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Head, usePage } from '@inertiajs/react';
import Layout from '@/components/layout/Layout';

const CatalogoIndex = ({ auth }) => {
    const [departamentos, setDepartamentos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedDepartamento, setSelectedDepartamento] = useState(null);
    const { url } = usePage();
    const urlParams = new URLSearchParams(window.location.search);

    // Extraer parámetros de búsqueda de la URL
    const searchParams = {
        location: urlParams.get('location') || '',
        type: urlParams.get('type') || 'all',
        bedrooms: urlParams.get('bedrooms') || 'any',
        priceRange: urlParams.get('priceRange') || 'any'
    };

    useEffect(() => {
        fetchDepartamentos();
    }, []);

    const fetchDepartamentos = async () => {
        try {
            // Construir la URL con los parámetros de búsqueda
            let apiUrl = '/api/v1/departamentos';
            const queryParams = [];

            if (searchParams.location) queryParams.push(`location=${encodeURIComponent(searchParams.location)}`);
            if (searchParams.type !== 'all') queryParams.push(`type=${encodeURIComponent(searchParams.type)}`);
            if (searchParams.bedrooms !== 'any') queryParams.push(`bedrooms=${encodeURIComponent(searchParams.bedrooms)}`);
            if (searchParams.priceRange !== 'any') queryParams.push(`priceRange=${encodeURIComponent(searchParams.priceRange)}`);

            if (queryParams.length > 0) {
                apiUrl += `?${queryParams.join('&')}`;
            }

            const response = await axios.get(apiUrl);
            setDepartamentos(response.data.data || response.data);
            console.log('Departamentos cargados:', response.data);
        } catch (error) {
            console.error('Error al cargar departamentos:', error);
            setError('Error al cargar el catálogo de departamentos');
        } finally {
            setLoading(false);
        }
    };

    const formatPrecio = (precio) => {
        return new Intl.NumberFormat('es-PE', {
            style: 'currency',
            currency: 'PEN'
        }).format(precio);
    };

    const handleViewDetails = (id) => {
        setSelectedDepartamento(id);
    };

    const handleBack = () => {
        setSelectedDepartamento(null);
    };

    if (selectedDepartamento) {
        return (
            <Layout auth={auth}>
                <Head title="Detalle de Departamento" />
                <CatalogoShow departamentoId={selectedDepartamento} onBack={handleBack} />
            </Layout>
        );
    }

    if (loading) {
        return (
            <Layout auth={auth}>
                <Head title="Catálogo de Departamentos" />
                <div className="min-h-screen flex items-center justify-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
                </div>
            </Layout>
        );
    }

    if (error) {
        return (
            <Layout auth={auth}>
                <Head title="Catálogo de Departamentos" />
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <div className="text-red-500 text-xl mb-4">❌ {error}</div>
                        <button
                            onClick={fetchDepartamentos}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Reintentar
                        </button>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout auth={auth}>
            <Head title="Catálogo de Departamentos" />
            <div className="container mx-auto px-4 py-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        🏠 Catálogo de Departamentos
                    </h1>
                    <p className="text-gray-600">
                        Encuentra tu departamento ideal
                    </p>
                </div>

                {departamentos.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-gray-500 text-xl mb-4">
                            📭 No hay departamentos disponibles
                        </div>
                        <p className="text-gray-400">
                            Vuelve pronto para ver nuevas propiedades
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {departamentos.map((departamento) => (
                            <div key={departamento.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                                {/* Imagen principal */}
                                <div className="h-48 bg-gray-200 relative">
                                    {departamento.imagen_principal ? (
                                        <img
                                            src={departamento.imagen_principal}
                                            alt={`Departamento ${departamento.codigo}`}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                            <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                    )}
                                    <div className="absolute top-2 right-2">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            departamento.estado === 'disponible'
                                                ? 'bg-green-100 text-green-800'
                                                : departamento.estado === 'reservado'
                                                ? 'bg-yellow-100 text-yellow-800'
                                                : 'bg-red-100 text-red-800'
                                        }`}>
                                            {departamento.estado}
                                        </span>
                                    </div>
                                </div>

                                {/* Contenido */}
                                <div className="p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            Depto {departamento.codigo}
                                        </h3>
                                        <span className="text-lg font-bold text-blue-600">
                                            {formatPrecio(departamento.precio)}
                                        </span>
                                    </div>

                                    <div className="text-sm text-gray-600 mb-3">
                                        <div className="flex items-center mb-1">
                                            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            {departamento.direccion}
                                        </div>
                                        <div className="flex items-center space-x-4 text-xs">
                                            <span>🛏️ {departamento.habitaciones} hab.</span>
                                            <span>🚿 {departamento.banos} baños</span>
                                            <span>📐 {departamento.area_m2} m²</span>
                                        </div>
                                    </div>

                                    {departamento.descripcion && (
                                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                            {departamento.descripcion}
                                        </p>
                                    )}

                                    <button
                                        onClick={() => handleViewDetails(departamento.id)}
                                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition-colors"
                                    >
                                        Ver Detalles
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    );
};

// Componente interno para mostrar detalles
const CatalogoShow = ({ departamentoId, onBack }) => {
    const [departamento, setDepartamento] = useState(null);
    const [imagenes, setImagenes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [imagenActual, setImagenActual] = useState(0);
    const [mostrarCotizacion, setMostrarCotizacion] = useState(false);

    useEffect(() => {
        if (departamentoId) {
            fetchDepartamento();
            fetchImagenes();
        }
    }, [departamentoId]);

    const fetchDepartamento = async () => {
        try {
            const response = await axios.get(`/api/v1/departamentos/${departamentoId}`);
            setDepartamento(response.data);
        } catch (error) {
            console.error('Error al cargar departamento:', error);
            setError('Error al cargar los detalles del departamento');
        }
    };

    const fetchImagenes = async () => {
        try {
            const response = await axios.get(`/api/v1/imagenes?departamento_id=${departamentoId}`);
            setImagenes(response.data.data || response.data);
        } catch (error) {
            console.error('Error al cargar imágenes:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatPrecio = (precio) => {
        return new Intl.NumberFormat('es-PE', {
            style: 'currency',
            currency: 'PEN'
        }).format(precio);
    };

    const handleCotizar = () => {
        // Verificar autenticación - esto debería usar el contexto de autenticación real
        const isAuthenticated = false; // Reemplazar con lógica real
        const isCliente = false; // Reemplazar con lógica real

        if (!isAuthenticated) {
            alert('Debes iniciar sesión para solicitar una cotización');
            return;
        }
        setMostrarCotizacion(true);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error || !departamento) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-500 text-xl mb-4">❌ {error || 'Departamento no encontrado'}</div>
                    <button
                        onClick={onBack}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Volver al Catálogo
                    </button>
                </div>
            </div>
        );
    }

    const imagenPrincipal = imagenes.find(img => img.tipo === 'principal');
    const galeria = imagenes.filter(img => img.tipo === 'galeria');
    const todasImagenes = imagenPrincipal ? [imagenPrincipal, ...galeria] : galeria;

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Botón volver */}
            <button
                onClick={onBack}
                className="mb-6 flex items-center text-blue-600 hover:text-blue-800"
            >
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Volver al Catálogo
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Galería de imágenes */}
                <div className="space-y-4">
                    {todasImagenes.length > 0 ? (
                        <>
                            {/* Imagen principal */}
                            <div className="relative h-96 bg-gray-200 rounded-lg overflow-hidden">
                                <img
                                    src={todasImagenes[imagenActual]?.url}
                                    alt={todasImagenes[imagenActual]?.titulo || `Departamento ${departamento.codigo}`}
                                    className="w-full h-full object-cover"
                                />
                                {todasImagenes.length > 1 && (
                                    <>
                                        <button
                                            onClick={() => setImagenActual(imagenActual === 0 ? todasImagenes.length - 1 : imagenActual - 1)}
                                            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
                                        >
                                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => setImagenActual(imagenActual === todasImagenes.length - 1 ? 0 : imagenActual + 1)}
                                            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
                                        >
                                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </button>
                                    </>
                                )}
                            </div>

                            {/* Miniaturas */}
                            {todasImagenes.length > 1 && (
                                <div className="grid grid-cols-4 gap-2">
                                    {todasImagenes.map((imagen, index) => (
                                        <button
                                            key={imagen.id || index}
                                            onClick={() => setImagenActual(index)}
                                            className={`h-20 rounded-lg overflow-hidden border-2 ${
                                                index === imagenActual ? 'border-blue-500' : 'border-gray-200'
                                            }`}
                                        >
                                            <img
                                                src={imagen.url}
                                                alt={imagen.titulo || `Imagen ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                            <div className="text-center text-gray-400">
                                <svg className="mx-auto h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <p>No hay imágenes disponibles</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Detalles del departamento */}
                <div className="space-y-6">
                    <div>
                        <div className="flex justify-between items-start mb-4">
                            <h1 className="text-3xl font-bold text-gray-900">
                                Departamento {departamento.codigo}
                            </h1>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                departamento.estado === 'disponible'
                                    ? 'bg-green-100 text-green-800'
                                    : departamento.estado === 'reservado'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-red-100 text-red-800'
                            }`}>
                                {departamento.estado}
                            </span>
                        </div>

                        <div className="text-3xl font-bold text-blue-600 mb-4">
                            {formatPrecio(departamento.precio)}
                        </div>

                        <div className="flex items-center text-gray-600 mb-4">
                            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {departamento.direccion}
                        </div>
                    </div>

                    {/* Características */}
                    <div className="bg-gray-50 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Características</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center">
                                <span className="text-2xl mr-2">🛏️</span>
                                <div>
                                    <div className="font-medium">{departamento.habitaciones}</div>
                                    <div className="text-sm text-gray-500">Habitaciones</div>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <span className="text-2xl mr-2">🚿</span>
                                <div>
                                    <div className="font-medium">{departamento.banos}</div>
                                    <div className="text-sm text-gray-500">Baños</div>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <span className="text-2xl mr-2">📐</span>
                                <div>
                                    <div className="font-medium">{departamento.area_m2} m²</div>
                                    <div className="text-sm text-gray-500">Área</div>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <span className="text-2xl mr-2">🏢</span>
                                <div>
                                    <div className="font-medium">Piso {departamento.piso}</div>
                                    <div className="text-sm text-gray-500">Ubicación</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Descripción */}
                    {departamento.descripcion && (
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">Descripción</h3>
                            <p className="text-gray-600 leading-relaxed">
                                {departamento.descripcion}
                            </p>
                        </div>
                    )}

                    {/* Botones de acción */}
                    {departamento.estado === 'disponible' && (
                        <div className="space-y-3">
                            <button
                                onClick={handleCotizar}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                            >
                                Solicitar Cotización
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal de cotización */}
            {mostrarCotizacion && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <h3 className="text-lg font-semibold mb-4">Solicitar Cotización</h3>
                        <p className="text-gray-600 mb-4">
                            Funcionalidad de cotización en desarrollo...
                        </p>
                        <div className="flex space-x-3">
                            <button
                                onClick={() => setMostrarCotizacion(false)}
                                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={() => setMostrarCotizacion(false)}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
                            >
                                Solicitar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CatalogoIndex;
