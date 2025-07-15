import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CatalogoIndex = ({ onViewDetails }) => {
    const [departamentos, setDepartamentos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchDepartamentos();
    }, []);

    const fetchDepartamentos = async () => {
        try {
            const response = await axios.get('/api/v1/departamentos');
            setDepartamentos(response.data.data || response.data);
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

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
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
        );
    }

    return (
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
                                    onClick={() => onViewDetails(departamento.id)}
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
    );
};

export default CatalogoIndex;
