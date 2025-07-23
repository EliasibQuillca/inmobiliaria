import React, { useState, useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import axios from 'axios';

export default function FormularioUsuario({ auth, userId = null, modo = 'crear' }) {
    const esEdicion = modo === 'editar';
    const titulo = esEdicion ? 'Editar Usuario' : 'Crear Nuevo Usuario';

    const [error, setError] = useState(null);
    const [cargando, setCargando] = useState(esEdicion);
    const [enviando, setEnviando] = useState(false);
    const [mostrarPassword, setMostrarPassword] = useState(false);

    // Estado para el formulario
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'cliente',
        telefono: '',
        documento_identidad: '',
        direccion: '',
        codigo_asesor: '',
        comision: 0,
    });

    // Cargar datos del usuario si estamos en modo edición
    useEffect(() => {
        if (esEdicion && userId) {
            const cargarUsuario = async () => {
                try {
                    setCargando(true);
                    const response = await axios.get(`/api/v1/admin/usuarios/${userId}`);
                    const usuario = response.data.data;

                    setFormData({
                        name: usuario.name || '',
                        email: usuario.email || '',
                        password: '',
                        confirmPassword: '',
                        role: usuario.role || 'cliente',
                        telefono: usuario.telefono || '',
                        documento_identidad: usuario.cliente?.documento_identidad || '',
                        direccion: usuario.cliente?.direccion || '',
                        codigo_asesor: usuario.asesor?.codigo || '',
                        comision: usuario.asesor?.comision || 0,
                    });
                } catch (err) {
                    console.error('Error al cargar usuario:', err);
                    setError('No se pudo cargar la información del usuario');
                } finally {
                    setCargando(false);
                }
            };

            cargarUsuario();
        }
    }, [esEdicion, userId]);

    // Manejar cambios en el formulario
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Validación del formulario
    const validarFormulario = () => {
        if (!formData.name.trim()) {
            setError('El nombre es obligatorio');
            return false;
        }

        if (!formData.email.trim()) {
            setError('El correo electrónico es obligatorio');
            return false;
        }

        if (!esEdicion && !formData.password) {
            setError('La contraseña es obligatoria para nuevos usuarios');
            return false;
        }

        if (formData.password && formData.password !== formData.confirmPassword) {
            setError('Las contraseñas no coinciden');
            return false;
        }

        if (formData.role === 'cliente' && !formData.documento_identidad) {
            setError('El documento de identidad es obligatorio para clientes');
            return false;
        }

        if (formData.role === 'asesor' && !formData.codigo_asesor) {
            setError('El código de asesor es obligatorio');
            return false;
        }

        return true;
    };

    // Enviar el formulario
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validarFormulario()) {
            return;
        }

        setEnviando(true);
        setError(null);

        try {
            // Preparar datos para enviar
            const datos = {
                name: formData.name,
                email: formData.email,
                role: formData.role,
                telefono: formData.telefono,
            };

            // Solo incluir password si se ha proporcionado
            if (formData.password) {
                datos.password = formData.password;
            }

            // Añadir datos específicos según el rol
            if (formData.role === 'cliente') {
                datos.documento_identidad = formData.documento_identidad;
                datos.direccion = formData.direccion;
            } else if (formData.role === 'asesor') {
                datos.codigo_asesor = formData.codigo_asesor;
                datos.comision = parseFloat(formData.comision) || 0;
            }

            if (esEdicion) {
                await axios.put(`/api/v1/admin/usuarios/${userId}`, datos);
                window.location.href = '/admin/usuarios';
            } else {
                await axios.post('/api/v1/admin/usuarios', datos);
                window.location.href = '/admin/usuarios';
            }
        } catch (err) {
            console.error('Error al guardar usuario:', err);
            setError(err.response?.data?.message || 'Error al guardar usuario. Por favor, inténtelo de nuevo.');
        } finally {
            setEnviando(false);
        }
    };

    return (
        <AdminLayout auth={auth} title={titulo}>
            <Head title={`${titulo} - Inmobiliaria`} />
            <div className="py-12 bg-gray-100">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">{titulo}</h2>
                                <p className="mt-1 text-gray-600">
                                    {esEdicion ? 'Modifique los datos del usuario' : 'Complete el formulario para crear un nuevo usuario'}
                                </p>
                            </div>

                            {cargando ? (
                                <div className="flex justify-center items-center py-10">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
                                    <p className="ml-3 text-gray-600">Cargando información del usuario...</p>
                                </div>
                            ) : (
                                <>
                                    {error && (
                                        <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
                                            <p>{error}</p>
                                        </div>
                                    )}

                                    <form onSubmit={handleSubmit}>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                            {/* Nombre */}
                                            <div>
                                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                                    Nombre Completo *
                                                </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                        />
                                    </div>

                                    {/* Email */}
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
                                            required
                                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                        />
                                    </div>

                                    {/* Contraseña */}
                                    <div>
                                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                            Contraseña {!esEdicion && '*'}
                                            {esEdicion && <span className="text-gray-500 text-xs ml-1">(Dejar vacío para mantener la actual)</span>}
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={mostrarPassword ? "text" : "password"}
                                                id="password"
                                                name="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                                required={!esEdicion}
                                            />
                                            <button
                                                type="button"
                                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                                onClick={() => setMostrarPassword(!mostrarPassword)}
                                            >
                                                {mostrarPassword ? (
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                                    </svg>
                                                ) : (
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                                                        <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                                                    </svg>
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Confirmar Contraseña */}
                                    <div>
                                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                            Confirmar Contraseña {!esEdicion && '*'}
                                        </label>
                                        <input
                                            type="password"
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                            required={!esEdicion}
                                        />
                                    </div>

                                    {/* Rol */}
                                    <div>
                                        <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                                            Rol *
                                        </label>
                                        <select
                                            id="role"
                                            name="role"
                                            value={formData.role}
                                            onChange={handleChange}
                                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                        >
                                            <option value="cliente">Cliente</option>
                                            <option value="asesor">Asesor</option>
                                            <option value="administrador">Administrador</option>
                                        </select>
                                    </div>

                                    {/* Teléfono */}
                                    <div>
                                        <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-1">
                                            Teléfono
                                        </label>
                                        <input
                                            type="tel"
                                            id="telefono"
                                            name="telefono"
                                            value={formData.telefono}
                                            onChange={handleChange}
                                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                        />
                                    </div>

                                    {/* Campos específicos según el rol */}
                                    {formData.role === 'cliente' && (
                                        <>
                                            <div>
                                                <label htmlFor="documento_identidad" className="block text-sm font-medium text-gray-700 mb-1">
                                                    Documento de Identidad *
                                                </label>
                                                <input
                                                    type="text"
                                                    id="documento_identidad"
                                                    name="documento_identidad"
                                                    value={formData.documento_identidad}
                                                    onChange={handleChange}
                                                    required
                                                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                                />
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
                                        </>
                                    )}

                                    {formData.role === 'asesor' && (
                                        <>
                                            <div>
                                                <label htmlFor="codigo_asesor" className="block text-sm font-medium text-gray-700 mb-1">
                                                    Código de Asesor *
                                                </label>
                                                <input
                                                    type="text"
                                                    id="codigo_asesor"
                                                    name="codigo_asesor"
                                                    value={formData.codigo_asesor}
                                                    onChange={handleChange}
                                                    required
                                                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                                />
                                            </div>

                                            <div>
                                                <label htmlFor="comision" className="block text-sm font-medium text-gray-700 mb-1">
                                                    Comisión (%)
                                                </label>
                                                <input
                                                    type="number"
                                                    id="comision"
                                                    name="comision"
                                                    value={formData.comision}
                                                    onChange={handleChange}
                                                    min="0"
                                                    max="100"
                                                    step="0.01"
                                                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                                />
                                            </div>
                                        </>
                                    )}
                                </div>

                                <div className="flex justify-end space-x-3 mt-8">
                                    <a
                                        href="/admin/usuarios"
                                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        Cancelar
                                    </a>
                                    <button
                                        type="submit"
                                        disabled={enviando}
                                        className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                                            enviando ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'
                                        } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                                    >
                                        {enviando ? (
                                            <>
                                                <span className="inline-block mr-2 animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                                                Guardando...
                                            </>
                                        ) : (
                                            'Guardar Usuario'
                                        )}
                                    </button>
                                </div>
                            </form>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
