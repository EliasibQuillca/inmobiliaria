import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function CrearDepartamento({ auth, propietarios }) {
    const [formData, setFormData] = useState({
        titulo: '',
        descripcion: '',
        ubicacion: '',
        direccion: '',
        precio: '',
        habitaciones: 1, // Cambiado de dormitorios a habitaciones
        banos: 1,
        area: '', // Cambiado de area_total a area
        piso: 1, // Campo requerido agregado
        año_construccion: new Date().getFullYear(), // Campo requerido agregado
        estacionamientos: 0,
        propietario_id: '',
        estado: 'disponible',
        destacado: false
    });

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        // Limpiar error específico cuando el usuario empiece a escribir
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: undefined
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        // Utilizamos objeto JSON en lugar de FormData ya que no enviamos archivos
        router.post('/admin/departamentos', formData, {
            preserveState: false,
            onSuccess: (page) => {
                // Usamos router.get para forzar una recarga completa de la página de departamentos
                // Esto asegura que los datos se actualicen correctamente desde el servidor
                router.get('/admin/departamentos', {}, {
                    preserveScroll: false,
                    preserveState: false,
                });
            },
            onError: (validationErrors) => {
                setErrors(validationErrors);
                console.error('Errores de validación:', validationErrors);
            },
            onFinish: () => {
                setLoading(false);
            }
        });
    };

    const cancelar = () => {
        router.visit('/admin/departamentos');
    };

    return (
        <AdminLayout
            auth={auth}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Crear Nueva Propiedad
                </h2>
            }
        >
            <Head title="Crear Propiedad - Inmobiliaria" />

            <div className="py-12 bg-gray-100">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-medium text-gray-900">
                                    Nueva Propiedad
                                </h3>
                                <button
                                    onClick={cancelar}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Título */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Título *</label>
                                    <input
                                        type="text"
                                        name="titulo"
                                        value={formData.titulo}
                                        onChange={handleChange}
                                        className={`mt-1 block w-full border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${errors.titulo ? 'border-red-300' : 'border-gray-300'
                                            }`}
                                        required
                                    />
                                    {errors.titulo && <p className="mt-1 text-sm text-red-600">{errors.titulo}</p>}
                                </div>

                                {/* Ubicación */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Ubicación *</label>
                                    <input
                                        type="text"
                                        name="ubicacion"
                                        value={formData.ubicacion}
                                        onChange={handleChange}
                                        className={`mt-1 block w-full border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${errors.ubicacion ? 'border-red-300' : 'border-gray-300'
                                            }`}
                                        required
                                    />
                                    {errors.ubicacion && <p className="mt-1 text-sm text-red-600">{errors.ubicacion}</p>}
                                </div>

                                {/* Dirección */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700">Dirección</label>
                                    <input
                                        type="text"
                                        name="direccion"
                                        value={formData.direccion}
                                        onChange={handleChange}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    {errors.direccion && <p className="mt-1 text-sm text-red-600">{errors.direccion}</p>}
                                </div>

                                {/* Descripción */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700">Descripción</label>
                                    <textarea
                                        name="descripcion"
                                        value={formData.descripcion}
                                        onChange={handleChange}
                                        rows={3}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    {errors.descripcion && <p className="mt-1 text-sm text-red-600">{errors.descripcion}</p>}
                                </div>

                                {/* Precio */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Precio (S/) *</label>
                                    <input
                                        type="number"
                                        name="precio"
                                        value={formData.precio}
                                        onChange={handleChange}
                                        step="0.01"
                                        className={`mt-1 block w-full border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${errors.precio ? 'border-red-300' : 'border-gray-300'
                                            }`}
                                        required
                                    />
                                    {errors.precio && <p className="mt-1 text-sm text-red-600">{errors.precio}</p>}
                                </div>

                                {/* Área */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Área (m²) *</label>
                                    <input
                                        type="number"
                                        name="area"
                                        value={formData.area}
                                        onChange={handleChange}
                                        step="0.01"
                                        className={`mt-1 block w-full border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${errors.area ? 'border-red-300' : 'border-gray-300'
                                            }`}
                                        required
                                    />
                                    {errors.area && <p className="mt-1 text-sm text-red-600">{errors.area}</p>}
                                </div>

                                {/* Habitaciones */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Habitaciones</label>
                                    <select
                                        name="habitaciones"
                                        value={formData.habitaciones}
                                        onChange={handleChange}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        {[1, 2, 3, 4, 5, 6].map(num => (
                                            <option key={num} value={num}>{num}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Baños */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Baños</label>
                                    <select
                                        name="banos"
                                        value={formData.banos}
                                        onChange={handleChange}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        {[1, 2, 3, 4, 5, 6].map(num => (
                                            <option key={num} value={num}>{num}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Estacionamientos */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Estacionamientos</label>
                                    <select
                                        name="estacionamientos"
                                        value={formData.estacionamientos}
                                        onChange={handleChange}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        {[0, 1, 2, 3, 4].map(num => (
                                            <option key={num} value={num}>{num}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Propietario */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Propietario *</label>
                                    <select
                                        name="propietario_id"
                                        value={formData.propietario_id}
                                        onChange={handleChange}
                                        className={`mt-1 block w-full border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${errors.propietario_id ? 'border-red-300' : 'border-gray-300'
                                            }`}
                                        required
                                    >
                                        <option value="">Seleccionar propietario...</option>
                                        {propietarios?.map(propietario => (
                                            <option key={propietario.id} value={propietario.id}>
                                                {propietario.identificacion}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.propietario_id && <p className="mt-1 text-sm text-red-600">{errors.propietario_id}</p>}
                                </div>

                                {/* Estado */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Estado</label>
                                    <select
                                        name="estado"
                                        value={formData.estado}
                                        onChange={handleChange}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="disponible">Disponible</option>
                                        <option value="reservado">Reservado</option>
                                        <option value="vendido">Vendido</option>
                                        <option value="inactivo">Inactivo</option>
                                    </select>
                                </div>

                                {/* Destacado */}
                                <div className="md:col-span-2">
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            name="destacado"
                                            checked={formData.destacado}
                                            onChange={handleChange}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        />
                                        <span className="ml-2 text-sm text-gray-700">Destacar esta propiedad</span>
                                    </label>
                                </div>

                                {/* Piso */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Piso *</label>
                                    <input
                                        type="number"
                                        name="piso"
                                        value={formData.piso}
                                        onChange={handleChange}
                                        className={`mt-1 block w-full border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${errors.piso ? 'border-red-300' : 'border-gray-300'}`}
                                        required
                                        min="0"
                                    />
                                    {errors.piso && <p className="mt-1 text-sm text-red-600">{errors.piso}</p>}
                                </div>

                                {/* Año Construcción */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Año de Construcción *</label>
                                    <input
                                        type="number"
                                        name="año_construccion"
                                        value={formData.año_construccion}
                                        onChange={handleChange}
                                        className={`mt-1 block w-full border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${errors.año_construccion ? 'border-red-300' : 'border-gray-300'}`}
                                        required
                                        min="1900"
                                        max={new Date().getFullYear()}
                                    />
                                    {errors.año_construccion && <p className="mt-1 text-sm text-red-600">{errors.año_construccion}</p>}
                                </div>
                            </div>

                            {/* Botones */}
                            <div className="mt-8 flex justify-between">
                                <div className="text-sm text-gray-500">
                                    * Las imágenes podrán ser agregadas después de crear la propiedad, en la vista de edición.
                                </div>
                                <div className="flex space-x-3">
                                    <button
                                        type="button"
                                        onClick={cancelar}
                                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                                        disabled={loading}
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                                        disabled={loading}
                                    >
                                        {loading ? 'Creando...' : 'Crear Propiedad'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
