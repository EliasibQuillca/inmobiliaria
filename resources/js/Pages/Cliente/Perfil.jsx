import { Head, Link, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';

export default function Perfil({ auth }) {
    // Estado para controlar si estamos en modo edición
    const [editMode, setEditMode] = useState(false);

    // Estado para los datos del cliente
    const [clienteData, setClienteData] = useState({
        id: 1,
        nombre: auth.user.name,
        email: auth.user.email,
        telefono: '+51 912 345 678',
        direccion: 'Av. Las Palmeras 123, Lima',
        dni: '45678912',
        fecha_registro: '2025-01-15'
    });

    // Configuración del formulario con Inertia
    const { data, setData, patch, processing, errors, reset } = useForm({
        nombre: clienteData.nombre,
        email: clienteData.email,
        telefono: clienteData.telefono,
        direccion: clienteData.direccion,
        dni: clienteData.dni,
    });

    // Actualizar el formulario cuando cambian los datos del cliente
    useEffect(() => {
        setData({
            nombre: clienteData.nombre,
            email: clienteData.email,
            telefono: clienteData.telefono,
            direccion: clienteData.direccion,
            dni: clienteData.dni,
        });
    }, [clienteData]);

    // Manejar cambios en los inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setData(data => ({
            ...data,
            [name]: value,
        }));
    };

    // Manejar envío del formulario
    const handleSubmit = (e) => {
        e.preventDefault();

        // En un caso real, enviaríamos la actualización al servidor
        patch(route('cliente.perfil.update'), {
            onSuccess: () => {
                // Actualizar los datos del cliente con los nuevos valores
                setClienteData({
                    ...clienteData,
                    nombre: data.nombre,
                    email: data.email,
                    telefono: data.telefono,
                    direccion: data.direccion,
                    dni: data.dni
                });
                setEditMode(false);
            }
        });
    };

    // Cancelar edición
    const handleCancel = () => {
        reset();
        setEditMode(false);
    };

    // Formatear fecha
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('es-ES', options);
    };

    return (
        <Layout auth={auth}>
            <Head title="Mi Perfil - Inmobiliaria" />

            <div className="py-12 bg-gray-100 min-h-screen">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm rounded-lg">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">
                                    Mi Perfil
                                </h2>
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

                            <div className="bg-gray-50 p-6 rounded-lg mb-6">
                                <div className="flex items-center">
                                    <div className="h-20 w-20 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xl">
                                        {clienteData.nombre.charAt(0)}
                                    </div>
                                    <div className="ml-6">
                                        <h3 className="text-xl font-semibold text-gray-900">{clienteData.nombre}</h3>
                                        <p className="text-gray-600">{clienteData.email}</p>
                                        <p className="text-sm text-gray-500 mt-1">
                                            Cliente desde {formatDate(clienteData.fecha_registro)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {!editMode ? (
                                <>
                                    <div className="mb-6">
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">Información Personal</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <p className="text-sm text-gray-500">Nombre completo</p>
                                                <p className="font-medium text-gray-900">{clienteData.nombre}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Correo electrónico</p>
                                                <p className="font-medium text-gray-900">{clienteData.email}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Teléfono</p>
                                                <p className="font-medium text-gray-900">{clienteData.telefono}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">DNI</p>
                                                <p className="font-medium text-gray-900">{clienteData.dni}</p>
                                            </div>
                                            <div className="md:col-span-2">
                                                <p className="text-sm text-gray-500">Dirección</p>
                                                <p className="font-medium text-gray-900">{clienteData.direccion}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-end">
                                        <button
                                            type="button"
                                            onClick={() => setEditMode(true)}
                                            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                            </svg>
                                            Editar perfil
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-6">
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">Editar Información Personal</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
                                                    Nombre completo *
                                                </label>
                                                <input
                                                    type="text"
                                                    id="nombre"
                                                    name="nombre"
                                                    value={data.nombre}
                                                    onChange={handleChange}
                                                    className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${errors.nombre ? 'border-red-500' : ''}`}
                                                    required
                                                />
                                                {errors.nombre && (
                                                    <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>
                                                )}
                                            </div>
                                            <div>
                                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                                    Correo electrónico *
                                                </label>
                                                <input
                                                    type="email"
                                                    id="email"
                                                    name="email"
                                                    value={data.email}
                                                    onChange={handleChange}
                                                    className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${errors.email ? 'border-red-500' : ''}`}
                                                    required
                                                />
                                                {errors.email && (
                                                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                                                )}
                                            </div>
                                            <div>
                                                <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-1">
                                                    Teléfono *
                                                </label>
                                                <input
                                                    type="tel"
                                                    id="telefono"
                                                    name="telefono"
                                                    value={data.telefono}
                                                    onChange={handleChange}
                                                    className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${errors.telefono ? 'border-red-500' : ''}`}
                                                    required
                                                />
                                                {errors.telefono && (
                                                    <p className="mt-1 text-sm text-red-600">{errors.telefono}</p>
                                                )}
                                            </div>
                                            <div>
                                                <label htmlFor="dni" className="block text-sm font-medium text-gray-700 mb-1">
                                                    DNI
                                                </label>
                                                <input
                                                    type="text"
                                                    id="dni"
                                                    name="dni"
                                                    value={data.dni}
                                                    onChange={handleChange}
                                                    className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${errors.dni ? 'border-red-500' : ''}`}
                                                />
                                                {errors.dni && (
                                                    <p className="mt-1 text-sm text-red-600">{errors.dni}</p>
                                                )}
                                            </div>
                                            <div className="md:col-span-2">
                                                <label htmlFor="direccion" className="block text-sm font-medium text-gray-700 mb-1">
                                                    Dirección
                                                </label>
                                                <input
                                                    type="text"
                                                    id="direccion"
                                                    name="direccion"
                                                    value={data.direccion}
                                                    onChange={handleChange}
                                                    className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${errors.direccion ? 'border-red-500' : ''}`}
                                                />
                                                {errors.direccion && (
                                                    <p className="mt-1 text-sm text-red-600">{errors.direccion}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-end space-x-3">
                                        <button
                                            type="button"
                                            onClick={handleCancel}
                                            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                        >
                                            {processing ? 'Guardando...' : 'Guardar cambios'}
                                        </button>
                                    </div>
                                </form>
                            )}

                            <div className="mt-8 pt-8 border-t border-gray-200">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Cambiar contraseña</h3>
                                <p className="text-sm text-gray-500 mb-4">
                                    Si deseas cambiar tu contraseña, haz clic en el botón de abajo.
                                </p>
                                <Link
                                    href="/reset-password"
                                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                                >
                                    Cambiar contraseña
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
