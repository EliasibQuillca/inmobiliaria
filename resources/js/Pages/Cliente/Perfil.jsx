import React, { useState } from 'react';
import { Head, useForm, usePage, Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';

export default function Perfil({ auth, cliente }) {
    const [activeTab, setActiveTab] = useState('datos-personales');
    const { flash } = usePage().props;

    // Formulario de datos personales
    const { data, setData, put, processing, errors, reset } = useForm({
        // Información personal
        nombre: cliente.nombre || '',
        dni: cliente.dni || '',
        telefono: cliente.telefono || '',
        email: cliente.email || '',
        fecha_nacimiento: cliente.fecha_nacimiento || '',

        // Preferencias de búsqueda
        tipo_propiedad: cliente.tipo_propiedad || 'departamento',
        habitaciones_deseadas: cliente.habitaciones_deseadas || '',
        presupuesto_min: cliente.presupuesto_min || '',
        presupuesto_max: cliente.presupuesto_max || '',
        zona_preferida: cliente.zona_preferida || '',

        // Información adicional (opcional)
        direccion: cliente.direccion || '',
        ciudad: cliente.ciudad || '',
        ocupacion: cliente.ocupacion || '',
        estado_civil: cliente.estado_civil || '',
        ingresos_mensuales: cliente.ingresos_mensuales || '',
    });

    // Formulario de cambio de contraseña
    const passwordForm = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put('/cliente/perfil', {
            preserveScroll: true,
            onSuccess: () => {
                // Mensaje de éxito ya viene en flash
            },
        });
    };

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        passwordForm.put('/cliente/perfil/password', {
            preserveScroll: true,
            onSuccess: () => {
                passwordForm.reset();
            },
        });
    };

    return (
        <PublicLayout auth={auth} user={auth.user}>
            <Head title="Mi Perfil" />

            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">Mi Perfil</h1>
                                <p className="mt-2 text-sm text-gray-600">
                                    Gestiona tu información personal y configuración de cuenta
                                </p>
                            </div>
                            <Link
                                href={route('cliente.dashboard')}
                                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                            >
                                <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Volver al Panel
                            </Link>
                        </div>
                    </div>

                    {/* Mensajes Flash */}
                    {flash?.success && (
                        <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                            {flash.success}
                        </div>
                    )}
                    {flash?.error && (
                        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                            {flash.error}
                        </div>
                    )}

                    {/* Tabs */}
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <div className="border-b border-gray-200">
                            <nav className="-mb-px flex">
                                <button
                                    onClick={() => setActiveTab('datos-personales')}
                                    className={`${
                                        activeTab === 'datos-personales'
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm`}
                                >
                                    <svg className="inline-block mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                                    } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm ml-8`}
                                >
                                    <svg className="inline-block mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                    Seguridad
                                </button>
                            </nav>
                        </div>

                        {/* Contenido de Datos Personales */}
                        {activeTab === 'datos-personales' && (
                            <form onSubmit={handleSubmit} className="p-6">
                                {/* Sección: Información Personal */}
                                <div className="mb-8">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                        <svg className="mr-2 h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        Información Personal
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Nombre Completo */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Nombre Completo *
                                            </label>
                                            <input
                                                type="text"
                                                value={data.nombre}
                                                onChange={(e) => setData('nombre', e.target.value)}
                                                placeholder="Ej: Juan Pérez García"
                                                className={`w-full px-4 py-2 border ${
                                                    errors.nombre ? 'border-red-500' : 'border-gray-300'
                                                } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                                required
                                            />
                                            {errors.nombre && (
                                                <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>
                                            )}
                                        </div>

                                        {/* DNI */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                DNI *
                                            </label>
                                            <input
                                                type="text"
                                                value={data.dni}
                                                onChange={(e) => setData('dni', e.target.value)}
                                                maxLength="8"
                                                pattern="[0-9]{8}"
                                                placeholder="12345678"
                                                className={`w-full px-4 py-2 border ${
                                                    errors.dni ? 'border-red-500' : 'border-gray-300'
                                                } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                                required
                                            />
                                            {errors.dni && (
                                                <p className="mt-1 text-sm text-red-600">{errors.dni}</p>
                                            )}
                                            <p className="mt-1 text-xs text-gray-500">8 dígitos</p>
                                        </div>

                                        {/* Email */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Email *
                                            </label>
                                            <input
                                                type="email"
                                                value={data.email}
                                                onChange={(e) => setData('email', e.target.value)}
                                                placeholder="correo@ejemplo.com"
                                                className={`w-full px-4 py-2 border ${
                                                    errors.email ? 'border-red-500' : 'border-gray-300'
                                                } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                                required
                                            />
                                            {errors.email && (
                                                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                                            )}
                                        </div>

                                        {/* Teléfono */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Teléfono <span className="text-gray-400 text-xs">(Opcional)</span>
                                            </label>
                                            <input
                                                type="tel"
                                                value={data.telefono}
                                                onChange={(e) => setData('telefono', e.target.value)}
                                                placeholder="987654321"
                                                className={`w-full px-4 py-2 border ${
                                                    errors.telefono ? 'border-red-500' : 'border-gray-300'
                                                } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                            />
                                            {errors.telefono && (
                                                <p className="mt-1 text-sm text-red-600">{errors.telefono}</p>
                                            )}
                                        </div>

                                        {/* Fecha de Nacimiento */}
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Fecha de Nacimiento *
                                            </label>
                                            <input
                                                type="date"
                                                value={data.fecha_nacimiento}
                                                onChange={(e) => setData('fecha_nacimiento', e.target.value)}
                                                max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
                                                className={`w-full px-4 py-2 border ${
                                                    errors.fecha_nacimiento ? 'border-red-500' : 'border-gray-300'
                                                } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                                required
                                            />
                                            {errors.fecha_nacimiento && (
                                                <p className="mt-1 text-sm text-red-600">{errors.fecha_nacimiento}</p>
                                            )}
                                            <p className="mt-1 text-xs text-gray-500">Debes ser mayor de 18 años</p>
                                        </div>
                                    </div>
                                </div>

                                <hr className="my-8 border-gray-200" />

                                {/* Sección: Preferencias de Búsqueda */}
                                <div className="mb-8">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                                        <svg className="mr-2 h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                        </svg>
                                        ¿Qué tipo de propiedad buscas?
                                        <span className="ml-2 text-sm text-gray-500 font-normal">(Opcional)</span>
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-4">
                                        Completa tus preferencias para recibir mejores recomendaciones personalizadas
                                    </p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Tipo de Propiedad */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Tipo de Propiedad <span className="text-gray-400 text-xs">(Opcional)</span>
                                            </label>
                                            <select
                                                value={data.tipo_propiedad}
                                                onChange={(e) => setData('tipo_propiedad', e.target.value)}
                                                className={`w-full px-4 py-2 border ${
                                                    errors.tipo_propiedad ? 'border-red-500' : 'border-gray-300'
                                                } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                            >
                                                <option value="">Seleccionar...</option>
                                                <option value="departamento">Departamento</option>
                                                <option value="casa">Casa</option>
                                                <option value="oficina">Oficina</option>
                                                <option value="local_comercial">Local Comercial</option>
                                                <option value="terreno">Terreno</option>
                                            </select>
                                            {errors.tipo_propiedad && (
                                                <p className="mt-1 text-sm text-red-600">{errors.tipo_propiedad}</p>
                                            )}
                                        </div>

                                        {/* Habitaciones Deseadas */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Número de Habitaciones <span className="text-gray-400 text-xs">(Opcional)</span>
                                            </label>
                                            <select
                                                value={data.habitaciones_deseadas}
                                                onChange={(e) => setData('habitaciones_deseadas', e.target.value)}
                                                className={`w-full px-4 py-2 border ${
                                                    errors.habitaciones_deseadas ? 'border-red-500' : 'border-gray-300'
                                                } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                            >
                                                <option value="">Seleccionar...</option>
                                                <option value="1">1 dormitorio</option>
                                                <option value="2">2 dormitorios</option>
                                                <option value="3">3 dormitorios</option>
                                                <option value="4">4 dormitorios</option>
                                                <option value="5+">5+ dormitorios</option>
                                            </select>
                                            {errors.habitaciones_deseadas && (
                                                <p className="mt-1 text-sm text-red-600">{errors.habitaciones_deseadas}</p>
                                            )}
                                        </div>

                                        {/* Presupuesto Mínimo */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Presupuesto Mínimo (S/) <span className="text-gray-400 text-xs">(Opcional)</span>
                                            </label>
                                            <input
                                                type="number"
                                                value={data.presupuesto_min}
                                                onChange={(e) => setData('presupuesto_min', e.target.value)}
                                                placeholder="Ej: 150000"
                                                step="1000"
                                                min="0"
                                                className={`w-full px-4 py-2 border ${
                                                    errors.presupuesto_min ? 'border-red-500' : 'border-gray-300'
                                                } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                            />
                                            {errors.presupuesto_min && (
                                                <p className="mt-1 text-sm text-red-600">{errors.presupuesto_min}</p>
                                            )}
                                        </div>

                                        {/* Presupuesto Máximo */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Presupuesto Máximo (S/) <span className="text-gray-400 text-xs">(Opcional)</span>
                                            </label>
                                            <input
                                                type="number"
                                                value={data.presupuesto_max}
                                                onChange={(e) => setData('presupuesto_max', e.target.value)}
                                                placeholder="Ej: 300000"
                                                step="1000"
                                                min="0"
                                                className={`w-full px-4 py-2 border ${
                                                    errors.presupuesto_max ? 'border-red-500' : 'border-gray-300'
                                                } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                            />
                                            {errors.presupuesto_max && (
                                                <p className="mt-1 text-sm text-red-600">{errors.presupuesto_max}</p>
                                            )}
                                        </div>

                                        {/* Zona Preferida */}
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Zona Preferida <span className="text-gray-400 text-xs">(Opcional)</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={data.zona_preferida}
                                                onChange={(e) => setData('zona_preferida', e.target.value)}
                                                placeholder="Ej: Miraflores, San Isidro, Surco..."
                                                className={`w-full px-4 py-2 border ${
                                                    errors.zona_preferida ? 'border-red-500' : 'border-gray-300'
                                                } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                            />
                                            {errors.zona_preferida && (
                                                <p className="mt-1 text-sm text-red-600">{errors.zona_preferida}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <hr className="my-8 border-gray-200" />

                                {/* Sección: Información Adicional */}
                                <div className="mb-8">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                                        <svg className="mr-2 h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Información Adicional
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-4">Opcional - Ayuda a evaluar tu capacidad crediticia</p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Dirección */}
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Dirección Actual
                                            </label>
                                            <input
                                                type="text"
                                                value={data.direccion}
                                                onChange={(e) => setData('direccion', e.target.value)}
                                                placeholder="Av. Principal 123, Dpto 101"
                                                className={`w-full px-4 py-2 border ${
                                                    errors.direccion ? 'border-red-500' : 'border-gray-300'
                                                } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                            />
                                            {errors.direccion && (
                                                <p className="mt-1 text-sm text-red-600">{errors.direccion}</p>
                                            )}
                                        </div>

                                        {/* Ciudad */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Ciudad
                                            </label>
                                            <input
                                                type="text"
                                                value={data.ciudad}
                                                onChange={(e) => setData('ciudad', e.target.value)}
                                                placeholder="Lima"
                                                className={`w-full px-4 py-2 border ${
                                                    errors.ciudad ? 'border-red-500' : 'border-gray-300'
                                                } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                            />
                                            {errors.ciudad && (
                                                <p className="mt-1 text-sm text-red-600">{errors.ciudad}</p>
                                            )}
                                        </div>

                                        {/* Ocupación */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Ocupación
                                            </label>
                                            <input
                                                type="text"
                                                value={data.ocupacion}
                                                onChange={(e) => setData('ocupacion', e.target.value)}
                                                placeholder="Ej: Ingeniero, Médico, Empresario..."
                                                className={`w-full px-4 py-2 border ${
                                                    errors.ocupacion ? 'border-red-500' : 'border-gray-300'
                                                } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                            />
                                            {errors.ocupacion && (
                                                <p className="mt-1 text-sm text-red-600">{errors.ocupacion}</p>
                                            )}
                                        </div>

                                        {/* Estado Civil */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Estado Civil
                                            </label>
                                            <select
                                                value={data.estado_civil}
                                                onChange={(e) => setData('estado_civil', e.target.value)}
                                                className={`w-full px-4 py-2 border ${
                                                    errors.estado_civil ? 'border-red-500' : 'border-gray-300'
                                                } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                            >
                                                <option value="">Seleccionar...</option>
                                                <option value="soltero">Soltero/a</option>
                                                <option value="casado">Casado/a</option>
                                                <option value="divorciado">Divorciado/a</option>
                                                <option value="viudo">Viudo/a</option>
                                                <option value="conviviente">Conviviente</option>
                                            </select>
                                            {errors.estado_civil && (
                                                <p className="mt-1 text-sm text-red-600">{errors.estado_civil}</p>
                                            )}
                                        </div>

                                        {/* Ingresos Mensuales */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Ingresos Mensuales (S/)
                                            </label>
                                            <input
                                                type="number"
                                                value={data.ingresos_mensuales}
                                                onChange={(e) => setData('ingresos_mensuales', e.target.value)}
                                                placeholder="Ej: 5000"
                                                step="100"
                                                min="0"
                                                className={`w-full px-4 py-2 border ${
                                                    errors.ingresos_mensuales ? 'border-red-500' : 'border-gray-300'
                                                } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                            />
                                            {errors.ingresos_mensuales && (
                                                <p className="mt-1 text-sm text-red-600">{errors.ingresos_mensuales}</p>
                                            )}
                                            <p className="mt-1 text-xs text-gray-500">Esta información es confidencial</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Botón Guardar */}
                                <div className="flex justify-end pt-6 border-t">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {processing ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Guardando...
                                            </>
                                        ) : (
                                            <>
                                                <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                Guardar Cambios
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* Contenido de Seguridad */}
                        {activeTab === 'seguridad' && (
                            <form onSubmit={handlePasswordSubmit} className="p-6">
                                <div className="max-w-xl">
                                    <h3 className="text-lg font-medium text-gray-900 mb-6">
                                        Cambiar Contraseña
                                    </h3>

                                    <div className="space-y-6">
                                        {/* Contraseña Actual */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Contraseña Actual *
                                            </label>
                                            <input
                                                type="password"
                                                value={passwordForm.data.current_password}
                                                onChange={(e) => passwordForm.setData('current_password', e.target.value)}
                                                className={`w-full px-4 py-2 border ${
                                                    passwordForm.errors.current_password ? 'border-red-500' : 'border-gray-300'
                                                } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                                required
                                            />
                                            {passwordForm.errors.current_password && (
                                                <p className="mt-1 text-sm text-red-600">{passwordForm.errors.current_password}</p>
                                            )}
                                        </div>

                                        {/* Nueva Contraseña */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Nueva Contraseña *
                                            </label>
                                            <input
                                                type="password"
                                                value={passwordForm.data.password}
                                                onChange={(e) => passwordForm.setData('password', e.target.value)}
                                                minLength="8"
                                                className={`w-full px-4 py-2 border ${
                                                    passwordForm.errors.password ? 'border-red-500' : 'border-gray-300'
                                                } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                                required
                                            />
                                            {passwordForm.errors.password && (
                                                <p className="mt-1 text-sm text-red-600">{passwordForm.errors.password}</p>
                                            )}
                                            <p className="mt-1 text-xs text-gray-500">Mínimo 8 caracteres</p>
                                        </div>

                                        {/* Confirmar Contraseña */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Confirmar Nueva Contraseña *
                                            </label>
                                            <input
                                                type="password"
                                                value={passwordForm.data.password_confirmation}
                                                onChange={(e) => passwordForm.setData('password_confirmation', e.target.value)}
                                                minLength="8"
                                                className={`w-full px-4 py-2 border ${
                                                    passwordForm.errors.password_confirmation ? 'border-red-500' : 'border-gray-300'
                                                } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                                required
                                            />
                                            {passwordForm.errors.password_confirmation && (
                                                <p className="mt-1 text-sm text-red-600">{passwordForm.errors.password_confirmation}</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Botón de Cambiar Contraseña */}
                                    <div className="mt-8">
                                        <button
                                            type="submit"
                                            disabled={passwordForm.processing}
                                            className={`px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors ${
                                                passwordForm.processing ? 'opacity-50 cursor-not-allowed' : ''
                                            }`}
                                        >
                                            {passwordForm.processing ? 'Cambiando...' : 'Cambiar Contraseña'}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
