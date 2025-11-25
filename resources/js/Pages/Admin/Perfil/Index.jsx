import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function AdminPerfil({ auth, flash }) {
    const { csrf_token } = usePage().props;

    // Asegurar que el token CSRF esté disponible
    useEffect(() => {
        if (csrf_token) {
            const metaTag = document.head.querySelector('meta[name="csrf-token"]');
            if (metaTag) {
                metaTag.content = csrf_token;
            }
        }
    }, [csrf_token]);

    const { data, setData, patch, processing, errors } = useForm({
        name: auth.user.name || '',
        email: auth.user.email || '',
        telefono: auth.user.telefono || '',
        current_password_profile: '',
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    // Detectar si el email ha cambiado
    const emailChanged = data.email !== auth.user.email;

    const updateProfile = (e) => {
        e.preventDefault();

        if (!csrf_token) {
            console.error('CSRF token not found');
            window.location.reload();
            return;
        }

        // Preparar datos: usar current_password_profile como current_password
        const profileData = {
            name: data.name,
            email: data.email,
            telefono: data.telefono,
            current_password: data.current_password_profile,
        };

        // Usar URL directa en lugar del helper route() que no funciona correctamente para rutas RESTful
        patch('/admin/perfil', {
            data: profileData,
            preserveScroll: true,
            preserveState: true,
            headers: {
                'X-CSRF-TOKEN': csrf_token,
            },
            onSuccess: () => {
                console.log('Perfil actualizado exitosamente');
                // Limpiar el campo de contraseña después del éxito
                setData('current_password_profile', '');
            },
            onError: (errors) => {
                console.error('Errores al actualizar perfil:', errors);
            }
        });
    };

    const updatePassword = (e) => {
        e.preventDefault();

        if (!csrf_token) {
            console.error('CSRF token not found');
            window.location.reload();
            return;
        }

        // Usar URL directa
        patch('/admin/perfil/password', {
            preserveScroll: true,
            headers: {
                'X-CSRF-TOKEN': csrf_token,
            },
            onSuccess: () => {
                console.log('Contraseña actualizada exitosamente');
                setData({
                    ...data,
                    current_password: '',
                    password: '',
                    password_confirmation: '',
                });
            },
            onError: (errors) => {
                console.error('Errores al actualizar contraseña:', errors);
            }
        });
    };

    return (
        <AdminLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                            Mi Perfil
                        </h2>
                        <p className="text-sm text-gray-600">
                            Gestiona tu información personal y configuración de cuenta
                        </p>
                    </div>
                </div>
            }
        >
            <Head title="Mi Perfil - Administrador" />

            <div className="py-12 bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Mensaje de éxito */}
                    {flash?.message && (
                        <div className="mb-6 rounded-lg bg-green-50 border border-green-200 p-4">
                            <div className="flex items-center">
                                <svg className="h-5 w-5 text-green-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-sm font-medium text-green-800">{flash.message}</p>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">

                        {/* Información del perfil */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                                <div className="text-center">
                                    <div className="h-24 w-24 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center mx-auto mb-4">
                                        <span className="text-white font-bold text-2xl">
                                            {auth.user.name?.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900">{auth.user.name}</h3>
                                    <p className="text-sm text-gray-500">{auth.user.email}</p>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-2">
                                        Administrador
                                    </span>
                                </div>

                                <div className="mt-6 space-y-4">
                                    <div className="flex items-center text-sm text-gray-600">
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        Miembro desde: {new Date(auth.user.created_at).toLocaleDateString('es-ES')}
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Última conexión: Hoy
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Formularios de configuración */}
                        <div className="lg:col-span-2 space-y-8">

                            {/* Actualizar información del perfil */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                                <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
                                    <h3 className="text-lg font-semibold text-gray-900">Información Personal</h3>
                                    <p className="text-sm text-gray-600">Actualiza tu información básica</p>
                                </div>
                                <div className="p-4 sm:p-6">
                                    <form onSubmit={updateProfile} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                                    Nombre completo
                                                </label>
                                                <input
                                                    type="text"
                                                    id="name"
                                                    value={data.name}
                                                    onChange={(e) => setData('name', e.target.value)}
                                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                    required
                                                />
                                                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                                            </div>

                                            <div>
                                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                                    Correo electrónico
                                                </label>
                                                <input
                                                    type="email"
                                                    id="email"
                                                    value={data.email}
                                                    onChange={(e) => setData('email', e.target.value)}
                                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                    required
                                                />
                                                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                                            </div>

                                            <div>
                                                <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-1">
                                                    Teléfono
                                                </label>
                                                <input
                                                    type="tel"
                                                    id="telefono"
                                                    value={data.telefono}
                                                    onChange={(e) => setData('telefono', e.target.value)}
                                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                    placeholder="999888777"
                                                />
                                                {errors.telefono && <p className="mt-1 text-sm text-red-600">{errors.telefono}</p>}
                                            </div>
                                        </div>

                                        {/* Campo de contraseña cuando cambia el email */}
                                        {emailChanged && (
                                            <div className="border-l-4 border-yellow-400 bg-yellow-50 p-4">
                                                <div className="flex">
                                                    <div className="flex-shrink-0">
                                                        <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                        </svg>
                                                    </div>
                                                    <div className="ml-3 flex-1">
                                                        <p className="text-sm text-yellow-700 font-medium">
                                                            Por seguridad, confirma tu contraseña para cambiar el correo electrónico
                                                        </p>
                                                        <div className="mt-3">
                                                            <label htmlFor="current_password_profile" className="block text-sm font-medium text-gray-700 mb-1">
                                                                Contraseña actual <span className="text-red-500">*</span>
                                                            </label>
                                                            <input
                                                                type="password"
                                                                id="current_password_profile"
                                                                value={data.current_password_profile}
                                                                onChange={(e) => setData('current_password_profile', e.target.value)}
                                                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                                placeholder="Ingresa tu contraseña actual"
                                                                required={emailChanged}
                                                            />
                                                            {errors.current_password && <p className="mt-1 text-sm text-red-600">{errors.current_password}</p>}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex justify-end">
                                            <button
                                                type="submit"
                                                disabled={processing}
                                                className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                            >
                                                {processing ? 'Guardando...' : 'Guardar cambios'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>

                            {/* Cambiar contraseña */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                                <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
                                    <h3 className="text-lg font-semibold text-gray-900">Cambiar Contraseña</h3>
                                    <p className="text-sm text-gray-600">Actualiza tu contraseña para mantener tu cuenta segura</p>
                                </div>
                                <div className="p-4 sm:p-6">
                                    <form onSubmit={updatePassword} className="space-y-6">
                                        <div>
                                            <label htmlFor="current_password" className="block text-sm font-medium text-gray-700 mb-1">
                                                Contraseña actual
                                            </label>
                                            <input
                                                type="password"
                                                id="current_password"
                                                value={data.current_password}
                                                onChange={(e) => setData('current_password', e.target.value)}
                                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                required
                                            />
                                            {errors.current_password && <p className="mt-1 text-sm text-red-600">{errors.current_password}</p>}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                                    Nueva contraseña
                                                </label>
                                                <input
                                                    type="password"
                                                    id="password"
                                                    value={data.password}
                                                    onChange={(e) => setData('password', e.target.value)}
                                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                    required
                                                />
                                                {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                                            </div>

                                            <div>
                                                <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 mb-1">
                                                    Confirmar nueva contraseña
                                                </label>
                                                <input
                                                    type="password"
                                                    id="password_confirmation"
                                                    value={data.password_confirmation}
                                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                    required
                                                />
                                                {errors.password_confirmation && <p className="mt-1 text-sm text-red-600">{errors.password_confirmation}</p>}
                                            </div>
                                        </div>

                                        <div className="flex justify-end">
                                            <button
                                                type="submit"
                                                disabled={processing}
                                                className="inline-flex items-center px-4 py-2 bg-green-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-green-700 focus:bg-green-700 active:bg-green-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                            >
                                                {processing ? 'Actualizando...' : 'Actualizar contraseña'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
