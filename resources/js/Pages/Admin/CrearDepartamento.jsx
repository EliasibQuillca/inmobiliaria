import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import axios from 'axios';

export default function CrearDepartamento({ auth }) {
    // Estados para el formulario
    const [formData, setFormData] = useState({
        codigo: '',
        titulo: '',
        descripcion: '',
        direccion: '',
        ubicacion: '',
        precio: '',
        habitaciones: 0,
        banos: 0,
        area_total: '',
        estacionamientos: 0,
        propietario_id: '',
        estado: 'disponible',
        destacado: false
    });

    // Estado para propietarios (para el select)
    const [propietarios, setPropietarios] = useState([]);

    // Estados para manejo de errores y carga
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [generalError, setGeneralError] = useState(null);

    // Estado para imágenes
    const [imagenes, setImagenes] = useState([]);
    const [previewImages, setPreviewImages] = useState([]);

    // Cargar los propietarios al montar el componente
    useEffect(() => {
        const cargarPropietarios = async () => {
            try {
                setLoading(true);
                const response = await axios.get('/api/v1/admin/propietarios');
                if (response.data && response.data.data) {
                    setPropietarios(response.data.data);
                }
            } catch (err) {
                console.error('Error al cargar propietarios:', err);
                setGeneralError('No se pudieron cargar los propietarios. Por favor, inténtelo de nuevo.');
            } finally {
                setLoading(false);
            }
        };

        cargarPropietarios();
    }, []);

    // Manejar cambios en los campos del formulario
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        // Manejo especial para checkboxes
        const newValue = type === 'checkbox' ? checked : value;

        setFormData({
            ...formData,
            [name]: newValue
        });

        // Limpiar el error cuando el usuario corrige
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: null
            });
        }
    };

    // Manejar la carga de imágenes
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);

        if (files.length > 0) {
            // Actualizar el estado de las imágenes
            setImagenes([...imagenes, ...files]);

            // Generar previsualizaciones
            const newPreviewImages = files.map(file => URL.createObjectURL(file));
            setPreviewImages([...previewImages, ...newPreviewImages]);
        }
    };

    // Eliminar una imagen de la lista
    const handleRemoveImage = (index) => {
        const newImages = [...imagenes];
        const newPreviews = [...previewImages];

        // Liberar el objeto URL para evitar pérdidas de memoria
        URL.revokeObjectURL(newPreviews[index]);

        newImages.splice(index, 1);
        newPreviews.splice(index, 1);

        setImagenes(newImages);
        setPreviewImages(newPreviews);
    };

    // Validar el formulario antes de enviar
    const validateForm = () => {
        const newErrors = {};

        if (!formData.codigo) newErrors.codigo = 'El código es obligatorio';
        if (!formData.titulo) newErrors.titulo = 'El título es obligatorio';
        if (!formData.descripcion) newErrors.descripcion = 'La descripción es obligatoria';
        if (!formData.direccion) newErrors.direccion = 'La dirección es obligatoria';
        if (!formData.ubicacion) newErrors.ubicacion = 'La ubicación es obligatoria';

        // Validación de campos numéricos
        if (!formData.precio) {
            newErrors.precio = 'El precio es obligatorio';
        } else if (isNaN(formData.precio) || parseFloat(formData.precio) <= 0) {
            newErrors.precio = 'El precio debe ser un número positivo';
        }

        if (isNaN(formData.habitaciones) || parseInt(formData.habitaciones) < 0) {
            newErrors.habitaciones = 'El número de habitaciones debe ser un número no negativo';
        }

        if (isNaN(formData.banos) || parseInt(formData.banos) < 0) {
            newErrors.banos = 'El número de baños debe ser un número no negativo';
        }

        if (!formData.area_total) {
            newErrors.area_total = 'El área total es obligatoria';
        } else if (isNaN(formData.area_total) || parseFloat(formData.area_total) <= 0) {
            newErrors.area_total = 'El área total debe ser un número positivo';
        }

        if (isNaN(formData.estacionamientos) || parseInt(formData.estacionamientos) < 0) {
            newErrors.estacionamientos = 'El número de estacionamientos debe ser un número no negativo';
        }

        if (!formData.propietario_id) newErrors.propietario_id = 'Debe seleccionar un propietario';

        // Validar que haya al menos una imagen
        if (imagenes.length === 0) {
            newErrors.imagenes = 'Debe cargar al menos una imagen';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Enviar el formulario
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            // Desplazarse al primer error
            const firstError = document.querySelector('.error-message');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }

        setSubmitLoading(true);
        setSuccess(false);
        setGeneralError(null);

        try {
            // Crear el formulario para enviar los datos incluyendo las imágenes
            const formPayload = new FormData();

            // Agregar los datos del departamento
            Object.keys(formData).forEach(key => {
                formPayload.append(key, formData[key]);
            });

            // Agregar las imágenes
            imagenes.forEach((imagen, index) => {
                formPayload.append(`imagenes[${index}]`, imagen);

                // La primera imagen será la principal
                if (index === 0) {
                    formPayload.append(`imagenes_tipo[${index}]`, 'principal');
                } else {
                    formPayload.append(`imagenes_tipo[${index}]`, 'galeria');
                }
            });

            // Enviar los datos al servidor
            const response = await axios.post('/api/v1/admin/departamentos', formPayload, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            // Resetear el formulario en caso de éxito
            setFormData({
                codigo: '',
                titulo: '',
                descripcion: '',
                direccion: '',
                ubicacion: '',
                precio: '',
                habitaciones: 0,
                banos: 0,
                area_total: '',
                estacionamientos: 0,
                propietario_id: '',
                estado: 'disponible',
                destacado: false
            });

            setImagenes([]);
            setPreviewImages([]);
            setSuccess(true);

            // Desplazarse al mensaje de éxito
            window.scrollTo({ top: 0, behavior: 'smooth' });

            // Redireccionar después de 2 segundos
            setTimeout(() => {
                window.location.href = '/admin/departamentos';
            }, 2000);

        } catch (err) {
            console.error('Error al crear departamento:', err);

            if (err.response && err.response.data && err.response.data.errors) {
                // Errores de validación del servidor
                setErrors(err.response.data.errors);
            } else {
                // Error general
                setGeneralError('No se pudo crear el departamento. Por favor, inténtelo de nuevo.');
            }

            // Desplazarse al mensaje de error
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } finally {
            setSubmitLoading(false);
        }
    };

    return (
        <AdminLayout auth={auth} title="Crear Departamento">
            <Head title="Crear Departamento - Inmobiliaria" />

            <div className="py-12 bg-gray-100">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {/* Encabezado */}
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">
                                    Crear Nuevo Departamento
                                </h2>
                            </div>

                            {/* Mensajes de estado */}
                            {success && (
                                <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700">
                                    <p>Departamento creado exitosamente. Redireccionando...</p>
                                </div>
                            )}

                            {generalError && (
                                <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
                                    <p>{generalError}</p>
                                </div>
                            )}

                            {/* Formulario */}
                            <form onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    {/* Información básica */}
                                    <div className="md:col-span-2">
                                        <h3 className="text-lg font-medium text-gray-900 mb-3">Información Básica</h3>
                                    </div>

                                    {/* Código */}
                                    <div>
                                        <label htmlFor="codigo" className="block text-sm font-medium text-gray-700 mb-1">
                                            Código <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="codigo"
                                            name="codigo"
                                            value={formData.codigo}
                                            onChange={handleChange}
                                            className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                                                errors.codigo ? 'border-red-300' : ''
                                            }`}
                                        />
                                        {errors.codigo && (
                                            <p className="mt-1 text-sm text-red-600 error-message">
                                                {errors.codigo}
                                            </p>
                                        )}
                                    </div>

                                    {/* Título */}
                                    <div>
                                        <label htmlFor="titulo" className="block text-sm font-medium text-gray-700 mb-1">
                                            Título <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="titulo"
                                            name="titulo"
                                            value={formData.titulo}
                                            onChange={handleChange}
                                            className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                                                errors.titulo ? 'border-red-300' : ''
                                            }`}
                                        />
                                        {errors.titulo && (
                                            <p className="mt-1 text-sm text-red-600 error-message">
                                                {errors.titulo}
                                            </p>
                                        )}
                                    </div>

                                    {/* Descripción */}
                                    <div className="md:col-span-2">
                                        <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-1">
                                            Descripción <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            id="descripcion"
                                            name="descripcion"
                                            rows="4"
                                            value={formData.descripcion}
                                            onChange={handleChange}
                                            className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                                                errors.descripcion ? 'border-red-300' : ''
                                            }`}
                                        ></textarea>
                                        {errors.descripcion && (
                                            <p className="mt-1 text-sm text-red-600 error-message">
                                                {errors.descripcion}
                                            </p>
                                        )}
                                    </div>

                                    {/* Ubicación */}
                                    <div className="md:col-span-2">
                                        <h3 className="text-lg font-medium text-gray-900 mb-3">Ubicación</h3>
                                    </div>

                                    {/* Dirección */}
                                    <div>
                                        <label htmlFor="direccion" className="block text-sm font-medium text-gray-700 mb-1">
                                            Dirección <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="direccion"
                                            name="direccion"
                                            value={formData.direccion}
                                            onChange={handleChange}
                                            className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                                                errors.direccion ? 'border-red-300' : ''
                                            }`}
                                        />
                                        {errors.direccion && (
                                            <p className="mt-1 text-sm text-red-600 error-message">
                                                {errors.direccion}
                                            </p>
                                        )}
                                    </div>

                                    {/* Ubicación */}
                                    <div>
                                        <label htmlFor="ubicacion" className="block text-sm font-medium text-gray-700 mb-1">
                                            Ubicación (zona/distrito) <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="ubicacion"
                                            name="ubicacion"
                                            value={formData.ubicacion}
                                            onChange={handleChange}
                                            className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                                                errors.ubicacion ? 'border-red-300' : ''
                                            }`}
                                        />
                                        {errors.ubicacion && (
                                            <p className="mt-1 text-sm text-red-600 error-message">
                                                {errors.ubicacion}
                                            </p>
                                        )}
                                    </div>

                                    {/* Características */}
                                    <div className="md:col-span-2">
                                        <h3 className="text-lg font-medium text-gray-900 mb-3">Características</h3>
                                    </div>

                                    {/* Precio */}
                                    <div>
                                        <label htmlFor="precio" className="block text-sm font-medium text-gray-700 mb-1">
                                            Precio (S/.) <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            id="precio"
                                            name="precio"
                                            value={formData.precio}
                                            onChange={handleChange}
                                            min="0"
                                            step="0.01"
                                            className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                                                errors.precio ? 'border-red-300' : ''
                                            }`}
                                        />
                                        {errors.precio && (
                                            <p className="mt-1 text-sm text-red-600 error-message">
                                                {errors.precio}
                                            </p>
                                        )}
                                    </div>

                                    {/* Área total */}
                                    <div>
                                        <label htmlFor="area_total" className="block text-sm font-medium text-gray-700 mb-1">
                                            Área Total (m²) <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            id="area_total"
                                            name="area_total"
                                            value={formData.area_total}
                                            onChange={handleChange}
                                            min="0"
                                            step="0.01"
                                            className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                                                errors.area_total ? 'border-red-300' : ''
                                            }`}
                                        />
                                        {errors.area_total && (
                                            <p className="mt-1 text-sm text-red-600 error-message">
                                                {errors.area_total}
                                            </p>
                                        )}
                                    </div>

                                    {/* Habitaciones */}
                                    <div>
                                        <label htmlFor="habitaciones" className="block text-sm font-medium text-gray-700 mb-1">
                                            Habitaciones
                                        </label>
                                        <input
                                            type="number"
                                            id="habitaciones"
                                            name="habitaciones"
                                            value={formData.habitaciones}
                                            onChange={handleChange}
                                            min="0"
                                            className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                                                errors.habitaciones ? 'border-red-300' : ''
                                            }`}
                                        />
                                        {errors.habitaciones && (
                                            <p className="mt-1 text-sm text-red-600 error-message">
                                                {errors.habitaciones}
                                            </p>
                                        )}
                                    </div>

                                    {/* Baños */}
                                    <div>
                                        <label htmlFor="banos" className="block text-sm font-medium text-gray-700 mb-1">
                                            Baños
                                        </label>
                                        <input
                                            type="number"
                                            id="banos"
                                            name="banos"
                                            value={formData.banos}
                                            onChange={handleChange}
                                            min="0"
                                            className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                                                errors.banos ? 'border-red-300' : ''
                                            }`}
                                        />
                                        {errors.banos && (
                                            <p className="mt-1 text-sm text-red-600 error-message">
                                                {errors.banos}
                                            </p>
                                        )}
                                    </div>

                                    {/* Estacionamientos */}
                                    <div>
                                        <label htmlFor="estacionamientos" className="block text-sm font-medium text-gray-700 mb-1">
                                            Estacionamientos
                                        </label>
                                        <input
                                            type="number"
                                            id="estacionamientos"
                                            name="estacionamientos"
                                            value={formData.estacionamientos}
                                            onChange={handleChange}
                                            min="0"
                                            className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                                                errors.estacionamientos ? 'border-red-300' : ''
                                            }`}
                                        />
                                        {errors.estacionamientos && (
                                            <p className="mt-1 text-sm text-red-600 error-message">
                                                {errors.estacionamientos}
                                            </p>
                                        )}
                                    </div>

                                    {/* Propietario */}
                                    <div>
                                        <label htmlFor="propietario_id" className="block text-sm font-medium text-gray-700 mb-1">
                                            Propietario <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            id="propietario_id"
                                            name="propietario_id"
                                            value={formData.propietario_id}
                                            onChange={handleChange}
                                            className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                                                errors.propietario_id ? 'border-red-300' : ''
                                            }`}
                                            disabled={loading}
                                        >
                                            <option value="">Seleccione un propietario</option>
                                            {propietarios.map((propietario) => (
                                                <option key={propietario.id} value={propietario.id}>
                                                    {propietario.nombre} {propietario.apellido} - {propietario.documento}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.propietario_id && (
                                            <p className="mt-1 text-sm text-red-600 error-message">
                                                {errors.propietario_id}
                                            </p>
                                        )}
                                    </div>

                                    {/* Estado */}
                                    <div>
                                        <label htmlFor="estado" className="block text-sm font-medium text-gray-700 mb-1">
                                            Estado
                                        </label>
                                        <select
                                            id="estado"
                                            name="estado"
                                            value={formData.estado}
                                            onChange={handleChange}
                                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                        >
                                            <option value="disponible">Disponible</option>
                                            <option value="reservado">Reservado</option>
                                            <option value="vendido">Vendido</option>
                                            <option value="inactivo">Inactivo</option>
                                        </select>
                                    </div>

                                    {/* Destacado */}
                                    <div className="flex items-center">
                                        <input
                                            id="destacado"
                                            name="destacado"
                                            type="checkbox"
                                            checked={formData.destacado}
                                            onChange={handleChange}
                                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                        />
                                        <label htmlFor="destacado" className="ml-2 block text-sm text-gray-900">
                                            Marcar como destacado
                                        </label>
                                    </div>

                                    {/* Imágenes */}
                                    <div className="md:col-span-2">
                                        <h3 className="text-lg font-medium text-gray-900 mb-3">Imágenes</h3>
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Cargar imágenes <span className="text-red-500">*</span>
                                        </label>
                                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                            <div className="space-y-1 text-center">
                                                <svg
                                                    className="mx-auto h-12 w-12 text-gray-400"
                                                    stroke="currentColor"
                                                    fill="none"
                                                    viewBox="0 0 48 48"
                                                    aria-hidden="true"
                                                >
                                                    <path
                                                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                                        strokeWidth={2}
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                                <div className="flex text-sm text-gray-600">
                                                    <label
                                                        htmlFor="imagenes"
                                                        className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                                                    >
                                                        <span>Cargar archivos</span>
                                                        <input
                                                            id="imagenes"
                                                            name="imagenes"
                                                            type="file"
                                                            multiple
                                                            accept="image/*"
                                                            className="sr-only"
                                                            onChange={handleImageChange}
                                                        />
                                                    </label>
                                                    <p className="pl-1">o arrastre y suelte</p>
                                                </div>
                                                <p className="text-xs text-gray-500">
                                                    PNG, JPG, GIF hasta 10MB
                                                </p>
                                            </div>
                                        </div>
                                        {errors.imagenes && (
                                            <p className="mt-1 text-sm text-red-600 error-message">
                                                {errors.imagenes}
                                            </p>
                                        )}

                                        {/* Vista previa de imágenes */}
                                        {previewImages.length > 0 && (
                                            <div className="mt-4">
                                                <h4 className="text-sm font-medium text-gray-700 mb-2">
                                                    Vista previa de imágenes
                                                </h4>
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                    {previewImages.map((preview, index) => (
                                                        <div key={index} className="relative">
                                                            <img
                                                                src={preview}
                                                                alt={`Vista previa ${index + 1}`}
                                                                className="h-24 w-full object-cover rounded-md"
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => handleRemoveImage(index)}
                                                                className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 shadow-sm hover:bg-red-600 focus:outline-none"
                                                            >
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                                </svg>
                                                            </button>
                                                            {index === 0 && (
                                                                <span className="absolute bottom-0 left-0 bg-blue-500 text-white text-xs px-2 py-1 rounded-tr-md rounded-bl-md">
                                                                    Principal
                                                                </span>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                                <p className="mt-2 text-sm text-gray-500">
                                                    La primera imagen será la imagen principal del departamento.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Botones de acción */}
                                <div className="flex justify-end space-x-3">
                                    <a
                                        href="/admin/departamentos"
                                        className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        Cancelar
                                    </a>
                                    <button
                                        type="submit"
                                        disabled={submitLoading}
                                        className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                                            submitLoading ? 'opacity-75 cursor-not-allowed' : ''
                                        }`}
                                    >
                                        {submitLoading ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Creando...
                                            </>
                                        ) : (
                                            'Crear Departamento'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
