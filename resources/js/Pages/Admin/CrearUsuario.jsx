import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import Layout from '@/components/layout/Layout';

export default function CrearUsuario({ auth }) {
    // Estado para el formulario de usuario
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        email: '',
        password: '',
        password_confirmation: '',
        rol: 'Asesor',
        telefono: '',
        direccion: '',
        biografia: '',
    });

    // Estado para errores
    const [errors, setErrors] = useState({});

    // Manejar cambios en los campos del formulario
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });

        // Limpiar error cuando el usuario corrige
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: null,
            });
        }
    };

    // Manejar envío del formulario
    const handleSubmit = (e) => {
        e.preventDefault();

        // Validación simple
        const newErrors = {};

        if (!formData.nombre.trim()) {
            newErrors.nombre = 'El nombre es obligatorio';
        }

        if (!formData.apellido.trim()) {
            newErrors.apellido = 'El apellido es obligatorio';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'El correo electrónico es obligatorio';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Correo electrónico inválido';
        }

        if (!formData.password) {
            newErrors.password = 'La contraseña es obligatoria';
        } else if (formData.password.length < 8) {
            newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
        }

        if (formData.password !== formData.password_confirmation) {
            newErrors.password_confirmation = 'Las contraseñas no coinciden';
        }

        if (!formData.telefono.trim()) {
            newErrors.telefono = 'El teléfono es obligatorio';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // Aquí iría la lógica para enviar los datos al servidor
        console.log('Enviando datos:', formData);

        // Simulación de respuesta exitosa
        alert('Usuario creado con éxito!');
        // En un caso real, se redirigiría al listado de usuarios tras la creación exitosa
    };

    return (
        <Layout auth={auth}>
            <Head title="Crear Usuario - Inmobiliaria" />

            <div className="py-12 bg-gray-100">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">
                                    Crear Nuevo Usuario
                                </h2>
                                <Link
                                    href="/admin/usuarios"
                                    className="px-4 py-2 bg-gray-200 border border-transparent rounded-md font-semibold text-gray-700 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                                >
                                    Volver a Usuarios
                                </Link>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Información Personal */}
                                <div className="bg-gray-50 p-4 rounded-md mb-6">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Información Personal</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
                                                Nombre *
                                            </label>
                                            <input
                                                type="text"
                                                id="nombre"
                                                name="nombre"
                                                value={formData.nombre}
                                                onChange={handleChange}
                                                className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${errors.nombre ? 'border-red-500' : ''}`}
                                            />
                                            {errors.nombre && (
                                                <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label htmlFor="apellido" className="block text-sm font-medium text-gray-700 mb-1">
                                                Apellido *
                                            </label>
                                            <input
                                                type="text"
                                                id="apellido"
                                                name="apellido"
                                                value={formData.apellido}
                                                onChange={handleChange}
                                                className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${errors.apellido ? 'border-red-500' : ''}`}
                                            />
                                            {errors.apellido && (
                                                <p className="mt-1 text-sm text-red-600">{errors.apellido}</p>
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
                                                value={formData.telefono}
                                                onChange={handleChange}
                                                className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${errors.telefono ? 'border-red-500' : ''}`}
                                            />
                                            {errors.telefono && (
                                                <p className="mt-1 text-sm text-red-600">{errors.telefono}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label htmlFor="direccion" className="block text-sm font-medium text-gray-700 mb-1">
                                                Dirección
                                            </label>
                                            <input
                                                type="text"
                                                id="direccion"
                                                name="direccion"
                                                value={formData.direccion}
                                                onChange={handleChange}
                                                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-6">
                                        <label htmlFor="biografia" className="block text-sm font-medium text-gray-700 mb-1">
                                            Biografía
                                        </label>
                                        <textarea
                                            id="biografia"
                                            name="biografia"
                                            rows="4"
                                            value={formData.biografia}
                                            onChange={handleChange}
                                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                            placeholder="Breve descripción del usuario"
                                        ></textarea>
                                    </div>
                                </div>

                                {/* Cuenta y Seguridad */}
                                <div className="bg-gray-50 p-4 rounded-md mb-6">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Cuenta y Seguridad</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                                Correo Electrónico *
                                            </label>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${errors.email ? 'border-red-500' : ''}`}
                                            />
                                            {errors.email && (
                                                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label htmlFor="rol" className="block text-sm font-medium text-gray-700 mb-1">
                                                Rol *
                                            </label>
                                            <select
                                                id="rol"
                                                name="rol"
                                                value={formData.rol}
                                                onChange={handleChange}
                                                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                            >
                                                <option value="Administrador">Administrador</option>
                                                <option value="Asesor">Asesor</option>
                                                <option value="Cliente">Cliente</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                                Contraseña *
                                            </label>
                                            <input
                                                type="password"
                                                id="password"
                                                name="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${errors.password ? 'border-red-500' : ''}`}
                                            />
                                            {errors.password && (
                                                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 mb-1">
                                                Confirmar Contraseña *
                                            </label>
                                            <input
                                                type="password"
                                                id="password_confirmation"
                                                name="password_confirmation"
                                                value={formData.password_confirmation}
                                                onChange={handleChange}
                                                className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${errors.password_confirmation ? 'border-red-500' : ''}`}
                                            />
                                            {errors.password_confirmation && (
                                                <p className="mt-1 text-sm text-red-600">{errors.password_confirmation}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-end space-x-3">
                                    <button
                                        type="button"
                                        onClick={() => window.history.back()}
                                        className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        Crear Usuario
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
