import React, { useState } from 'react';
import { Head, useForm, usePage, Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';

export default function Perfil({ auth, cliente }) {
    const [activeTab, setActiveTab] = useState('datos-personales');
    const { flash } = usePage().props;

    // Formulario de datos personales
    const { data, setData, put, processing, errors, reset } = useForm({
        nombres: cliente.nombres || '',
        apellidos: cliente.apellidos || '',
        dni: cliente.dni || '',
        telefono: cliente.telefono || '',
        email: cliente.email || '',
        direccion: cliente.direccion || '',
        ciudad: cliente.ciudad || '',
        fecha_nacimiento: cliente.fecha_nacimiento || '',
        ocupacion: cliente.ocupacion || '',
        estado_civil: cliente.estado_civil || 'soltero',
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
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Nombres */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Nombres *
                                        </label>
                                        <input
                                            type="text"
                                            value={data.nombres}
                                            onChange={(e) => setData('nombres', e.target.value)}
                                            className={`w-full px-4 py-2 border ${
                                                errors.nombres ? 'border-red-500' : 'border-gray-300'
                                            } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                            required
                                        />
                                        {errors.nombres && (
                                            <p className="mt-1 text-sm text-red-600">{errors.nombres}</p>
                                        )}
                                    </div>

                                    {/* Apellidos */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Apellidos *
                                        </label>
                                        <input
                                            type="text"
                                            value={data.apellidos}
                                            onChange={(e) => setData('apellidos', e.target.value)}
                                            className={`w-full px-4 py-2 border ${
                                                errors.apellidos ? 'border-red-500' : 'border-gray-300'
                                            } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                            required
                                        />
                                        {errors.apellidos && (
                                            <p className="mt-1 text-sm text-red-600">{errors.apellidos}</p>
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

                                    {/* Teléfono */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Teléfono *
                                        </label>
                                        <input
                                            type="tel"
                                            value={data.telefono}
                                            onChange={(e) => setData('telefono', e.target.value)}
                                            className={`w-full px-4 py-2 border ${
                                                errors.telefono ? 'border-red-500' : 'border-gray-300'
                                            } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                            required
                                        />
                                        {errors.telefono && (
                                            <p className="mt-1 text-sm text-red-600">{errors.telefono}</p>
                                        )}
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
                                            className={`w-full px-4 py-2 border ${
                                                errors.email ? 'border-red-500' : 'border-gray-300'
                                            } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                            required
                                        />
                                        {errors.email && (
                                            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                                        )}
                                    </div>

                                    {/* Fecha de Nacimiento */}
                                    <div>
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

                                    {/* Dirección */}
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Dirección
                                        </label>
                                        <input
                                            type="text"
                                            value={data.direccion}
                                            onChange={(e) => setData('direccion', e.target.value)}
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
                                            <option value="soltero">Soltero/a</option>
                                            <option value="casado">Casado/a</option>
                                            <option value="divorciado">Divorciado/a</option>
                                            <option value="viudo">Viudo/a</option>
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
                                            step="0.01"
                                            min="0"
                                            value={data.ingresos_mensuales}
                                            onChange={(e) => setData('ingresos_mensuales', e.target.value)}
                                            className={`w-full px-4 py-2 border ${
                                                errors.ingresos_mensuales ? 'border-red-500' : 'border-gray-300'
                                            } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                        />
                                        {errors.ingresos_mensuales && (
                                            <p className="mt-1 text-sm text-red-600">{errors.ingresos_mensuales}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Botón de Guardar */}
                                <div className="mt-8 flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className={`px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors ${
                                            processing ? 'opacity-50 cursor-not-allowed' : ''
                                        }`}
                                    >
                                        {processing ? 'Guardando...' : 'Guardar Cambios'}
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
