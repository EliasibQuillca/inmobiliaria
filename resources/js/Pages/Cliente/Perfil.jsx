import { Head, useForm, Link } from '@inertiajs/react';
import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function ClientePerfil({ auth, flash = {} }) {
    const [activeTab, setActiveTab] = useState('datos');

    // Safe access to user data with defaults
    const user = auth.user || {};

    // Formulario para datos personales
    const { data: datosPersonales, setData: setDatosPersonales, patch: patchDatos, processing: processingDatos, errors: erroresDatos, reset: resetDatos } = useForm({
        nombre: user.name || '',
        email: user.email || '',
        telefono: user.telefono || '',
        cedula: user.cedula || '',
        fecha_nacimiento: user.fecha_nacimiento || '',
        direccion: user.direccion || '',
        ciudad: user.ciudad || '',
        ocupacion: user.ocupacion || '',
        estado_civil: user.estado_civil || 'soltero',
        ingresos_mensuales: user.ingresos_mensuales || '',
    });    // Formulario para cambiar contraseña
    const { data: passwordData, setData: setPasswordData, patch: patchPassword, processing: processingPassword, errors: erroresPassword, reset: resetPassword } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    // Formulario para preferencias
    const { data: preferencias, setData: setPreferencias, patch: patchPreferencias, processing: processingPreferencias, errors: erroresPreferencias } = useForm({
        tipo_propiedad: user.preferencias?.tipo_propiedad || 'departamento',
        rango_precio_min: user.preferencias?.rango_precio_min || '',
        rango_precio_max: user.preferencias?.rango_precio_max || '',
        ubicaciones_preferidas: user.preferencias?.ubicaciones_preferidas || [],
        habitaciones_min: user.preferencias?.habitaciones_min || 1,
        banos_min: user.preferencias?.banos_min || 1,
        area_min: user.preferencias?.area_min || '',
        caracteristicas_especiales: user.preferencias?.caracteristicas_especiales || [],
        notificaciones_email: user.preferencias?.notificaciones_email ?? true,
        notificaciones_sms: user.preferencias?.notificaciones_sms ?? false,
        frecuencia_notificaciones: user.preferencias?.frecuencia_notificaciones || 'semanal',
    });

    const handleDatosSubmit = (e) => {
        e.preventDefault();
        patchDatos('/cliente/perfil', {
            onSuccess: () => {
                // Success is handled by flash message
            },
        });
    };

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        patchPassword('/cliente/perfil/password', {
            onSuccess: () => resetPassword(),
        });
    };

    const handlePreferenciasSubmit = (e) => {
        e.preventDefault();
        patchPreferencias('/cliente/perfil/preferencias', {
            onSuccess: () => {
                // Success is handled by flash message
            },
        });
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('es-PE', {
            style: 'currency',
            currency: 'PEN',
            minimumFractionDigits: 0,
        }).format(value);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Mi Perfil</h2>}
        >
            <Head title="Mi Perfil - Inmobiliaria" />

            <div className="py-12 bg-gray-100 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header Section */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">
                            Mi Perfil
                        </h1>
                        <p className="mt-1 text-lg text-gray-600">
                            Gestiona tu información personal y preferencias
                        </p>
                    </div>

                    {/* Flash Messages */}
                    {flash.success && (
                        <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium">{flash.success}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {flash.error && (
                        <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium">{flash.error}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                        {/* Tabs Navigation */}
                        <div className="border-b border-gray-200">
                            <nav className="flex space-x-8 px-6" aria-label="Tabs">
                                <button
                                    onClick={() => setActiveTab('datos')}
                                    className={`${
                                        activeTab === 'datos'
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200`}
                                >
                                    <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    Datos Personales
                                </button>
                                <button
                                    onClick={() => setActiveTab('seguridad')}
                                    className={`${
                                        activeTab === 'seguridad'
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200`}
                                >
                                    <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                    Seguridad
                                </button>
                                <button
                                    onClick={() => setActiveTab('preferencias')}
                                    className={`${
                                        activeTab === 'preferencias'
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200`}
                                >
                                    <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    Preferencias
                                </button>
                            </nav>
                        </div>

                        {/* Tab Content */}
                        <div className="p-6">
                            {/* Datos Personales Tab */}
                            {activeTab === 'datos' && (
                                <form onSubmit={handleDatosSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
                                                Nombre Completo *
                                            </label>
                                            <input
                                                type="text"
                                                id="nombre"
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                value={datosPersonales.nombre}
                                                onChange={(e) => setDatosPersonales('nombre', e.target.value)}
                                                required
                                            />
                                            {erroresDatos.nombre && <p className="mt-2 text-sm text-red-600">{erroresDatos.nombre}</p>}
                                        </div>

                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                                Email *
                                            </label>
                                            <input
                                                type="email"
                                                id="email"
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                value={datosPersonales.email}
                                                onChange={(e) => setDatosPersonales('email', e.target.value)}
                                                required
                                            />
                                            {erroresDatos.email && <p className="mt-2 text-sm text-red-600">{erroresDatos.email}</p>}
                                        </div>

                                        <div>
                                            <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-2">
                                                Teléfono
                                            </label>
                                            <input
                                                type="tel"
                                                id="telefono"
                                                placeholder="+51 987 654 321"
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                value={datosPersonales.telefono}
                                                onChange={(e) => setDatosPersonales('telefono', e.target.value)}
                                            />
                                            {erroresDatos.telefono && <p className="mt-2 text-sm text-red-600">{erroresDatos.telefono}</p>}
                                        </div>

                                        <div>
                                            <label htmlFor="cedula" className="block text-sm font-medium text-gray-700 mb-2">
                                                Cédula/DNI
                                            </label>
                                            <input
                                                type="text"
                                                id="cedula"
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                value={datosPersonales.cedula}
                                                onChange={(e) => setDatosPersonales('cedula', e.target.value)}
                                            />
                                            {erroresDatos.cedula && <p className="mt-2 text-sm text-red-600">{erroresDatos.cedula}</p>}
                                        </div>

                                        <div>
                                            <label htmlFor="fecha_nacimiento" className="block text-sm font-medium text-gray-700 mb-2">
                                                Fecha de Nacimiento
                                            </label>
                                            <input
                                                type="date"
                                                id="fecha_nacimiento"
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                value={datosPersonales.fecha_nacimiento}
                                                onChange={(e) => setDatosPersonales('fecha_nacimiento', e.target.value)}
                                            />
                                            {erroresDatos.fecha_nacimiento && <p className="mt-2 text-sm text-red-600">{erroresDatos.fecha_nacimiento}</p>}
                                        </div>

                                        <div>
                                            <label htmlFor="estado_civil" className="block text-sm font-medium text-gray-700 mb-2">
                                                Estado Civil
                                            </label>
                                            <select
                                                id="estado_civil"
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                value={datosPersonales.estado_civil}
                                                onChange={(e) => setDatosPersonales('estado_civil', e.target.value)}
                                            >
                                                <option value="soltero">Soltero/a</option>
                                                <option value="casado">Casado/a</option>
                                                <option value="divorciado">Divorciado/a</option>
                                                <option value="viudo">Viudo/a</option>
                                                <option value="union_libre">Unión Libre</option>
                                            </select>
                                            {erroresDatos.estado_civil && <p className="mt-2 text-sm text-red-600">{erroresDatos.estado_civil}</p>}
                                        </div>

                                        <div>
                                            <label htmlFor="ocupacion" className="block text-sm font-medium text-gray-700 mb-2">
                                                Ocupación
                                            </label>
                                            <input
                                                type="text"
                                                id="ocupacion"
                                                placeholder="Ej: Ingeniero, Médico, Empresario"
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                value={datosPersonales.ocupacion}
                                                onChange={(e) => setDatosPersonales('ocupacion', e.target.value)}
                                            />
                                            {erroresDatos.ocupacion && <p className="mt-2 text-sm text-red-600">{erroresDatos.ocupacion}</p>}
                                        </div>

                                        <div>
                                            <label htmlFor="ingresos_mensuales" className="block text-sm font-medium text-gray-700 mb-2">
                                                Ingresos Mensuales (Opcional)
                                            </label>
                                            <input
                                                type="number"
                                                id="ingresos_mensuales"
                                                placeholder="0"
                                                min="0"
                                                step="100"
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                value={datosPersonales.ingresos_mensuales}
                                                onChange={(e) => setDatosPersonales('ingresos_mensuales', e.target.value)}
                                            />
                                            {erroresDatos.ingresos_mensuales && <p className="mt-2 text-sm text-red-600">{erroresDatos.ingresos_mensuales}</p>}
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="direccion" className="block text-sm font-medium text-gray-700 mb-2">
                                            Dirección
                                        </label>
                                        <textarea
                                            id="direccion"
                                            rows={3}
                                            placeholder="Ingresa tu dirección completa"
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            value={datosPersonales.direccion}
                                            onChange={(e) => setDatosPersonales('direccion', e.target.value)}
                                        />
                                        {erroresDatos.direccion && <p className="mt-2 text-sm text-red-600">{erroresDatos.direccion}</p>}
                                    </div>

                                    <div className="flex justify-end">
                                        <button
                                            type="submit"
                                            disabled={processingDatos}
                                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                                        >
                                            {processingDatos ? (
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                            ) : (
                                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                            {processingDatos ? 'Guardando...' : 'Guardar Cambios'}
                                        </button>
                                    </div>
                                </form>
                            )}

                            {/* Seguridad Tab */}
                            {activeTab === 'seguridad' && (
                                <form onSubmit={handlePasswordSubmit} className="space-y-6">
                                    <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                                        <div className="flex">
                                            <div className="flex-shrink-0">
                                                <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <div className="ml-3">
                                                <h3 className="text-sm font-medium text-yellow-800">
                                                    Cambio de Contraseña
                                                </h3>
                                                <div className="mt-2 text-sm text-yellow-700">
                                                    <p>Asegúrate de usar una contraseña segura con al menos 8 caracteres, incluyendo mayúsculas, minúsculas y números.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-6 max-w-md">
                                        <div>
                                            <label htmlFor="current_password" className="block text-sm font-medium text-gray-700 mb-2">
                                                Contraseña Actual *
                                            </label>
                                            <input
                                                type="password"
                                                id="current_password"
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                value={passwordData.current_password}
                                                onChange={(e) => setPasswordData('current_password', e.target.value)}
                                                required
                                            />
                                            {erroresPassword.current_password && <p className="mt-2 text-sm text-red-600">{erroresPassword.current_password}</p>}
                                        </div>

                                        <div>
                                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                                Nueva Contraseña *
                                            </label>
                                            <input
                                                type="password"
                                                id="password"
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                value={passwordData.password}
                                                onChange={(e) => setPasswordData('password', e.target.value)}
                                                required
                                            />
                                            {erroresPassword.password && <p className="mt-2 text-sm text-red-600">{erroresPassword.password}</p>}
                                        </div>

                                        <div>
                                            <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 mb-2">
                                                Confirmar Nueva Contraseña *
                                            </label>
                                            <input
                                                type="password"
                                                id="password_confirmation"
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                value={passwordData.password_confirmation}
                                                onChange={(e) => setPasswordData('password_confirmation', e.target.value)}
                                                required
                                            />
                                            {erroresPassword.password_confirmation && <p className="mt-2 text-sm text-red-600">{erroresPassword.password_confirmation}</p>}
                                        </div>
                                    </div>

                                    <div className="flex justify-end">
                                        <button
                                            type="submit"
                                            disabled={processingPassword}
                                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                                        >
                                            {processingPassword ? (
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                            ) : (
                                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                </svg>
                                            )}
                                            {processingPassword ? 'Cambiando...' : 'Cambiar Contraseña'}
                                        </button>
                                    </div>
                                </form>
                            )}

                            {/* Preferencias Tab */}
                            {activeTab === 'preferencias' && (
                                <form onSubmit={handlePreferenciasSubmit} className="space-y-8">
                                    {/* Preferencias de Búsqueda */}
                                    <div>
                                        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                                            Preferencias de Búsqueda
                                        </h3>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label htmlFor="tipo_propiedad" className="block text-sm font-medium text-gray-700 mb-2">
                                                    Tipo de Propiedad
                                                </label>
                                                <select
                                                    id="tipo_propiedad"
                                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                    value={preferencias.tipo_propiedad}
                                                    onChange={(e) => setPreferencias('tipo_propiedad', e.target.value)}
                                                >
                                                    <option value="departamento">Departamento</option>
                                                    <option value="casa">Casa</option>
                                                    <option value="oficina">Oficina</option>
                                                    <option value="local_comercial">Local Comercial</option>
                                                    <option value="terreno">Terreno</option>
                                                </select>
                                            </div>

                                            <div>
                                                <label htmlFor="habitaciones_min" className="block text-sm font-medium text-gray-700 mb-2">
                                                    Habitaciones Mínimas
                                                </label>
                                                <select
                                                    id="habitaciones_min"
                                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                    value={preferencias.habitaciones_min}
                                                    onChange={(e) => setPreferencias('habitaciones_min', parseInt(e.target.value))}
                                                >
                                                    <option value={1}>1</option>
                                                    <option value={2}>2</option>
                                                    <option value={3}>3</option>
                                                    <option value={4}>4</option>
                                                    <option value={5}>5+</option>
                                                </select>
                                            </div>

                                            <div>
                                                <label htmlFor="rango_precio_min" className="block text-sm font-medium text-gray-700 mb-2">
                                                    Precio Mínimo (PEN)
                                                </label>
                                                <input
                                                    type="number"
                                                    id="rango_precio_min"
                                                    min="0"
                                                    step="1000"
                                                    placeholder="100000"
                                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                    value={preferencias.rango_precio_min}
                                                    onChange={(e) => setPreferencias('rango_precio_min', e.target.value)}
                                                />
                                            </div>

                                            <div>
                                                <label htmlFor="rango_precio_max" className="block text-sm font-medium text-gray-700 mb-2">
                                                    Precio Máximo (PEN)
                                                </label>
                                                <input
                                                    type="number"
                                                    id="rango_precio_max"
                                                    min="0"
                                                    step="1000"
                                                    placeholder="500000"
                                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                    value={preferencias.rango_precio_max}
                                                    onChange={(e) => setPreferencias('rango_precio_max', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Notificaciones */}
                                    <div>
                                        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                                            Notificaciones
                                        </h3>

                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex flex-col">
                                                    <label htmlFor="notificaciones_email" className="text-sm font-medium text-gray-700">
                                                        Notificaciones por Email
                                                    </label>
                                                    <p className="text-sm text-gray-500">Recibe notificaciones sobre nuevas propiedades y actualizaciones</p>
                                                </div>
                                                <button
                                                    type="button"
                                                    className={`${
                                                        preferencias.notificaciones_email ? 'bg-blue-600' : 'bg-gray-200'
                                                    } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                                                    onClick={() => setPreferencias('notificaciones_email', !preferencias.notificaciones_email)}
                                                >
                                                    <span
                                                        className={`${
                                                            preferencias.notificaciones_email ? 'translate-x-5' : 'translate-x-0'
                                                        } pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
                                                    />
                                                </button>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div className="flex flex-col">
                                                    <label htmlFor="notificaciones_sms" className="text-sm font-medium text-gray-700">
                                                        Notificaciones por SMS
                                                    </label>
                                                    <p className="text-sm text-gray-500">Recibe mensajes de texto para notificaciones importantes</p>
                                                </div>
                                                <button
                                                    type="button"
                                                    className={`${
                                                        preferencias.notificaciones_sms ? 'bg-blue-600' : 'bg-gray-200'
                                                    } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                                                    onClick={() => setPreferencias('notificaciones_sms', !preferencias.notificaciones_sms)}
                                                >
                                                    <span
                                                        className={`${
                                                            preferencias.notificaciones_sms ? 'translate-x-5' : 'translate-x-0'
                                                        } pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
                                                    />
                                                </button>
                                            </div>

                                            <div>
                                                <label htmlFor="frecuencia_notificaciones" className="block text-sm font-medium text-gray-700 mb-2">
                                                    Frecuencia de Notificaciones
                                                </label>
                                                <select
                                                    id="frecuencia_notificaciones"
                                                    className="mt-1 block w-full max-w-xs border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                    value={preferencias.frecuencia_notificaciones}
                                                    onChange={(e) => setPreferencias('frecuencia_notificaciones', e.target.value)}
                                                >
                                                    <option value="inmediata">Inmediatamente</option>
                                                    <option value="diaria">Diariamente</option>
                                                    <option value="semanal">Semanalmente</option>
                                                    <option value="mensual">Mensualmente</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-end">
                                        <button
                                            type="submit"
                                            disabled={processingPreferencias}
                                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                                        >
                                            {processingPreferencias ? (
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                            ) : (
                                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                            {processingPreferencias ? 'Guardando...' : 'Guardar Preferencias'}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="mt-8 bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="px-6 py-5 border-b border-gray-200">
                            <h3 className="text-lg leading-6 font-semibold text-gray-900">
                                Acciones Rápidas
                            </h3>
                        </div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                            <a
                                href="/cliente/dashboard"
                                className="group flex items-center p-4 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 hover:from-blue-100 hover:to-blue-200 transition-all duration-200"
                            >
                                <div className="flex-shrink-0 bg-blue-600 rounded-md p-3 group-hover:bg-blue-700 transition-colors duration-200">
                                    <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <h4 className="text-base font-semibold text-gray-900">Mi Dashboard</h4>
                                    <p className="mt-1 text-sm text-gray-600">Volver al panel principal</p>
                                </div>
                            </a>

                            <a
                                href="/cliente/solicitudes"
                                className="group flex items-center p-4 rounded-lg bg-gradient-to-br from-green-50 to-green-100 border border-green-200 hover:from-green-100 hover:to-green-200 transition-all duration-200"
                            >
                                <div className="flex-shrink-0 bg-green-600 rounded-md p-3 group-hover:bg-green-700 transition-colors duration-200">
                                    <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-2m-4-1v8m0 0l3-3m-3 3L9 8m-5 5h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293h3.172a1 1 0 00.707-.293l2.414-2.414a1 1 0 01.707-.293H20" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <h4 className="text-base font-semibold text-gray-900">Mis Solicitudes</h4>
                                    <p className="mt-1 text-sm text-gray-600">Revisar mis solicitudes</p>
                                </div>
                            </a>

                            <a
                                href="/cliente/asesores"
                                className="group flex items-center p-4 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 hover:from-purple-100 hover:to-purple-200 transition-all duration-200"
                            >
                                <div className="flex-shrink-0 bg-purple-600 rounded-md p-3 group-hover:bg-purple-700 transition-colors duration-200">
                                    <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <h4 className="text-base font-semibold text-gray-900">Mis Asesores</h4>
                                    <p className="mt-1 text-sm text-gray-600">Contactar mis asesores</p>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
