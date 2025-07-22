import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/components/admin/AdminLayout';
import axios from 'axios';

export default function VerDepartamento({ auth, departamentoId }) {
    // Estado para almacenar los datos del departamento
    const [departamento, setDepartamento] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Estado para el manejo de la galería de imágenes
    const [imagenActual, setImagenActual] = useState(0);
    const [showModal, setShowModal] = useState(false);

    // Cargar los datos del departamento al montar el componente
    useEffect(() => {
        const cargarDepartamento = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`/api/v1/admin/departamentos/${departamentoId}`);

                if (response.data && response.data.data) {
                    setDepartamento(response.data.data);
                } else {
                    setError('No se encontraron datos del departamento');
                }
            } catch (err) {
                console.error('Error al cargar departamento:', err);
                setError('No se pudo cargar la información del departamento');
            } finally {
                setLoading(false);
            }
        };

        cargarDepartamento();
    }, [departamentoId]);

    // Manejar cambio de imagen
    const handleImageChange = (index) => {
        setImagenActual(index);
    };

    // Abrir modal de imagen
    const openImageModal = (index) => {
        setImagenActual(index);
        setShowModal(true);
    };

    // Cerrar modal de imagen
    const closeImageModal = () => {
        setShowModal(false);
    };

    // Navegar a la imagen anterior
    const prevImage = () => {
        if (!departamento || !departamento.imagenes) return;

        const newIndex = (imagenActual - 1 + departamento.imagenes.length) % departamento.imagenes.length;
        setImagenActual(newIndex);
    };

    // Navegar a la imagen siguiente
    const nextImage = () => {
        if (!departamento || !departamento.imagenes) return;

        const newIndex = (imagenActual + 1) % departamento.imagenes.length;
        setImagenActual(newIndex);
    };

    // Formatear valor de moneda
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('es-PE', {
            style: 'currency',
            currency: 'PEN',
            minimumFractionDigits: 2
        }).format(value);
    };

    // Formatear fecha
    const formatDate = (dateString) => {
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Date(dateString).toLocaleDateString('es-ES', options);
    };

    // Obtener el color de la etiqueta de estado
    const getEstadoColor = (estado) => {
        switch (estado) {
            case 'disponible':
                return 'bg-green-100 text-green-800';
            case 'reservado':
                return 'bg-yellow-100 text-yellow-800';
            case 'vendido':
                return 'bg-blue-100 text-blue-800';
            case 'inactivo':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Obtener el texto del estado en español
    const getEstadoText = (estado) => {
        switch (estado) {
            case 'disponible':
                return 'Disponible';
            case 'reservado':
                return 'Reservado';
            case 'vendido':
                return 'Vendido';
            case 'inactivo':
                return 'Inactivo';
            default:
                return estado;
        }
    };

    // Renderizar pantalla de carga
    if (loading) {
        return (
            <AdminLayout auth={auth} title="Detalles del Departamento">
                <Head title="Detalles del Departamento - Inmobiliaria" />
                <div className="py-12 bg-gray-100">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <div className="flex justify-center items-center py-10">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
                                    <p className="ml-3 text-gray-600">Cargando datos del departamento...</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    // Renderizar mensaje de error
    if (error || !departamento) {
        return (
            <AdminLayout auth={auth} title="Detalles del Departamento">
                <Head title="Detalles del Departamento - Inmobiliaria" />
                <div className="py-12 bg-gray-100">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <div className="flex flex-col items-center py-10">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500 mb-4" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    <p className="text-lg text-gray-800 font-medium mb-2">
                                        {error || 'No se encontró el departamento solicitado'}
                                    </p>
                                    <Link
                                        href="/admin/departamentos"
                                        className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        Volver a la lista
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout auth={auth} title={`Departamento: ${departamento.codigo}`}>
            <Head title={`Departamento ${departamento.codigo} - Inmobiliaria`} />

            <div className="py-12 bg-gray-100">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="mb-6 flex justify-between items-center">
                        <Link
                            href="/admin/departamentos"
                            className="flex items-center text-indigo-600 hover:text-indigo-900"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                            </svg>
                            Volver a la lista
                        </Link>

                        <div className="flex space-x-3">
                            <Link
                                href={`/admin/departamentos/${departamentoId}/editar`}
                                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                </svg>
                                Editar
                            </Link>
                        </div>
                    </div>

                    {/* Contenedor principal con dos secciones */}
                    <div className="md:grid md:grid-cols-3 md:gap-6">
                        {/* Sección de imágenes y detalles básicos */}
                        <div className="md:col-span-2">
                            <div className="bg-white overflow-hidden shadow sm:rounded-lg">
                                {/* Galería de imágenes */}
                                <div className="p-6 border-b border-gray-200">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Galería de imágenes</h3>

                                    {departamento.imagenes && departamento.imagenes.length > 0 ? (
                                        <>
                                            {/* Imagen principal */}
                                            <div className="mb-4 overflow-hidden rounded-lg">
                                                <img
                                                    src={departamento.imagenes[imagenActual].url}
                                                    alt={`${departamento.titulo} - Imagen ${imagenActual + 1}`}
                                                    className="w-full h-80 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                                                    onClick={() => openImageModal(imagenActual)}
                                                />
                                            </div>

                                            {/* Miniaturas */}
                                            <div className="grid grid-cols-6 gap-2">
                                                {departamento.imagenes.map((imagen, index) => (
                                                    <div
                                                        key={imagen.id}
                                                        className={`cursor-pointer rounded-md overflow-hidden border-2 ${
                                                            index === imagenActual ? 'border-indigo-500' : 'border-transparent'
                                                        }`}
                                                        onClick={() => handleImageChange(index)}
                                                    >
                                                        <img
                                                            src={imagen.url}
                                                            alt={`Miniatura ${index + 1}`}
                                                            className="w-full h-16 object-cover"
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    ) : (
                                        <div className="bg-gray-100 rounded-lg p-6 text-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <p className="text-gray-500">No hay imágenes disponibles</p>
                                        </div>
                                    )}
                                </div>

                                {/* Detalles básicos */}
                                <div className="p-6 border-b border-gray-200">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Detalles básicos</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <dl>
                                                <div className="py-2">
                                                    <dt className="text-sm font-medium text-gray-500">Código</dt>
                                                    <dd className="mt-1 text-sm text-gray-900">{departamento.codigo}</dd>
                                                </div>
                                                <div className="py-2">
                                                    <dt className="text-sm font-medium text-gray-500">Título</dt>
                                                    <dd className="mt-1 text-sm text-gray-900">{departamento.titulo}</dd>
                                                </div>
                                                <div className="py-2">
                                                    <dt className="text-sm font-medium text-gray-500">Precio</dt>
                                                    <dd className="mt-1 text-sm text-gray-900 font-semibold">
                                                        {formatCurrency(departamento.precio)}
                                                    </dd>
                                                </div>
                                                <div className="py-2">
                                                    <dt className="text-sm font-medium text-gray-500">Estado</dt>
                                                    <dd className="mt-1 text-sm">
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEstadoColor(departamento.estado)}`}>
                                                            {getEstadoText(departamento.estado)}
                                                        </span>
                                                    </dd>
                                                </div>
                                                <div className="py-2">
                                                    <dt className="text-sm font-medium text-gray-500">Destacado</dt>
                                                    <dd className="mt-1 text-sm">
                                                        {departamento.destacado ? (
                                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                                Destacado
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                                No destacado
                                                            </span>
                                                        )}
                                                    </dd>
                                                </div>
                                            </dl>
                                        </div>
                                        <div>
                                            <dl>
                                                <div className="py-2">
                                                    <dt className="text-sm font-medium text-gray-500">Dirección</dt>
                                                    <dd className="mt-1 text-sm text-gray-900">{departamento.direccion}</dd>
                                                </div>
                                                <div className="py-2">
                                                    <dt className="text-sm font-medium text-gray-500">Ubicación</dt>
                                                    <dd className="mt-1 text-sm text-gray-900">{departamento.ubicacion}</dd>
                                                </div>
                                                <div className="py-2">
                                                    <dt className="text-sm font-medium text-gray-500">Fecha de creación</dt>
                                                    <dd className="mt-1 text-sm text-gray-900">{formatDate(departamento.created_at)}</dd>
                                                </div>
                                                <div className="py-2">
                                                    <dt className="text-sm font-medium text-gray-500">Última actualización</dt>
                                                    <dd className="mt-1 text-sm text-gray-900">{formatDate(departamento.updated_at)}</dd>
                                                </div>
                                            </dl>
                                        </div>
                                    </div>
                                </div>

                                {/* Descripción */}
                                <div className="p-6">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Descripción</h3>
                                    <div className="prose prose-sm max-w-none text-gray-900">
                                        <p>{departamento.descripcion}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sección de características y datos del propietario */}
                        <div className="mt-6 md:mt-0">
                            {/* Características */}
                            <div className="bg-white overflow-hidden shadow sm:rounded-lg mb-6">
                                <div className="p-6">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Características</h3>
                                    <dl>
                                        <div className="py-2 flex justify-between">
                                            <dt className="text-sm font-medium text-gray-500">Área total</dt>
                                            <dd className="text-sm text-gray-900">{departamento.area_total} m²</dd>
                                        </div>
                                        <div className="py-2 flex justify-between border-t border-gray-100">
                                            <dt className="text-sm font-medium text-gray-500">Habitaciones</dt>
                                            <dd className="text-sm text-gray-900">{departamento.habitaciones}</dd>
                                        </div>
                                        <div className="py-2 flex justify-between border-t border-gray-100">
                                            <dt className="text-sm font-medium text-gray-500">Baños</dt>
                                            <dd className="text-sm text-gray-900">{departamento.banos}</dd>
                                        </div>
                                        <div className="py-2 flex justify-between border-t border-gray-100">
                                            <dt className="text-sm font-medium text-gray-500">Estacionamientos</dt>
                                            <dd className="text-sm text-gray-900">{departamento.estacionamientos}</dd>
                                        </div>
                                    </dl>
                                </div>
                            </div>

                            {/* Datos del propietario */}
                            {departamento.propietario && (
                                <div className="bg-white overflow-hidden shadow sm:rounded-lg mb-6">
                                    <div className="p-6">
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">Datos del propietario</h3>
                                        <dl>
                                            <div className="py-2">
                                                <dt className="text-sm font-medium text-gray-500">Nombre completo</dt>
                                                <dd className="mt-1 text-sm text-gray-900">
                                                    {departamento.propietario.nombre} {departamento.propietario.apellido}
                                                </dd>
                                            </div>
                                            <div className="py-2 border-t border-gray-100">
                                                <dt className="text-sm font-medium text-gray-500">Documento</dt>
                                                <dd className="mt-1 text-sm text-gray-900">{departamento.propietario.tipo_documento}: {departamento.propietario.documento}</dd>
                                            </div>
                                            <div className="py-2 border-t border-gray-100">
                                                <dt className="text-sm font-medium text-gray-500">Correo electrónico</dt>
                                                <dd className="mt-1 text-sm text-gray-900">{departamento.propietario.email}</dd>
                                            </div>
                                            <div className="py-2 border-t border-gray-100">
                                                <dt className="text-sm font-medium text-gray-500">Teléfono</dt>
                                                <dd className="mt-1 text-sm text-gray-900">{departamento.propietario.telefono}</dd>
                                            </div>
                                        </dl>
                                    </div>
                                </div>
                            )}

                            {/* Historial */}
                            <div className="bg-white overflow-hidden shadow sm:rounded-lg">
                                <div className="p-6">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Historial y estadísticas</h3>
                                    <dl>
                                        <div className="py-2">
                                            <dt className="text-sm font-medium text-gray-500">Visitas a la página</dt>
                                            <dd className="mt-1 text-sm text-gray-900">{departamento.visitas || 0}</dd>
                                        </div>
                                        <div className="py-2 border-t border-gray-100">
                                            <dt className="text-sm font-medium text-gray-500">Cotizaciones</dt>
                                            <dd className="mt-1 text-sm text-gray-900">{departamento.cotizaciones_count || 0}</dd>
                                        </div>
                                        <div className="py-2 border-t border-gray-100">
                                            <dt className="text-sm font-medium text-gray-500">Reservas</dt>
                                            <dd className="mt-1 text-sm text-gray-900">{departamento.reservas_count || 0}</dd>
                                        </div>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal de imagen a tamaño completo */}
            {showModal && departamento.imagenes && departamento.imagenes.length > 0 && (
                <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-75 flex items-center justify-center">
                    <div className="relative max-w-5xl w-full h-full flex flex-col items-center justify-center p-4">
                        {/* Botón para cerrar */}
                        <button
                            onClick={closeImageModal}
                            className="absolute top-4 right-4 text-white hover:text-gray-300 focus:outline-none z-10"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        {/* Imagen */}
                        <div className="relative w-full flex items-center justify-center">
                            <img
                                src={departamento.imagenes[imagenActual].url}
                                alt={`${departamento.titulo} - Imagen a tamaño completo`}
                                className="max-h-[80vh] max-w-full object-contain"
                            />
                        </div>

                        {/* Controles de navegación */}
                        <div className="w-full flex justify-between absolute top-1/2 transform -translate-y-1/2">
                            <button
                                onClick={prevImage}
                                className="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 focus:outline-none"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <button
                                onClick={nextImage}
                                className="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 focus:outline-none"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>

                        {/* Contador de imágenes */}
                        <div className="absolute bottom-6 left-0 right-0 text-center">
                            <span className="bg-black bg-opacity-50 text-white px-4 py-2 rounded-full text-sm">
                                {imagenActual + 1} / {departamento.imagenes.length}
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
