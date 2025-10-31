import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function AdminConfiguracion({ auth }) {
    return (
        <AdminLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                            Configuración del Sistema
                        </h2>
                        <p className="text-sm text-gray-600">
                            Configuraciones generales del sistema inmobiliario
                        </p>
                    </div>
                </div>
            }
        >
            <Head title="Configuración - Administrador" />

            <div className="py-12 bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                        {/* Configuración General */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-900">Configuración General</h3>
                                <p className="text-sm text-gray-600">Configuraciones básicas del sistema</p>
                            </div>
                            <div className="p-6 space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Nombre de la empresa
                                    </label>
                                    <input
                                        type="text"
                                        defaultValue="Inmobiliaria Premium"
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email de contacto
                                    </label>
                                    <input
                                        type="email"
                                        defaultValue="contacto@inmobiliaria.com"
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Teléfono de contacto
                                    </label>
                                    <input
                                        type="tel"
                                        defaultValue="+51 984 123 456"
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Configuración de Propiedades */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-900">Configuración de Propiedades</h3>
                                <p className="text-sm text-gray-600">Configuraciones para el catálogo</p>
                            </div>
                            <div className="p-6 space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Máximo de imágenes por propiedad
                                    </label>
                                    <select className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                                        <option value="5">5 imágenes</option>
                                        <option value="10" selected>10 imágenes</option>
                                        <option value="15">15 imágenes</option>
                                        <option value="20">20 imágenes</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Comisión por defecto (%)
                                    </label>
                                    <input
                                        type="number"
                                        defaultValue="3"
                                        min="0"
                                        max="100"
                                        step="0.5"
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    />
                                </div>

                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="auto_approval"
                                        defaultChecked
                                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="auto_approval" className="ml-2 block text-sm text-gray-900">
                                        Aprobación automática de propiedades
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Configuración de Notificaciones */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-900">Notificaciones</h3>
                                <p className="text-sm text-gray-600">Configurar alertas y notificaciones</p>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Nuevos usuarios</p>
                                        <p className="text-sm text-gray-500">Notificar cuando se registre un nuevo usuario</p>
                                    </div>
                                    <button
                                        type="button"
                                        className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-indigo-600 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                    >
                                        <span className="translate-x-5 pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
                                    </button>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Nuevas propiedades</p>
                                        <p className="text-sm text-gray-500">Notificar cuando se agregue una nueva propiedad</p>
                                    </div>
                                    <button
                                        type="button"
                                        className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-indigo-600 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                    >
                                        <span className="translate-x-5 pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
                                    </button>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Ventas completadas</p>
                                        <p className="text-sm text-gray-500">Notificar cuando se complete una venta</p>
                                    </div>
                                    <button
                                        type="button"
                                        className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                    >
                                        <span className="translate-x-0 pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Configuración de Seguridad */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-900">Seguridad</h3>
                                <p className="text-sm text-gray-600">Configuraciones de seguridad del sistema</p>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Autenticación de dos factores</p>
                                        <p className="text-sm text-gray-500">Requiere verificación adicional para administradores</p>
                                    </div>
                                    <button
                                        type="button"
                                        className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                    >
                                        <span className="translate-x-0 pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
                                    </button>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Tiempo de sesión (minutos)
                                    </label>
                                    <select className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                                        <option value="30">30 minutos</option>
                                        <option value="60">1 hora</option>
                                        <option value="120" selected>2 horas</option>
                                        <option value="480">8 horas</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Botón para guardar configuraciones */}
                    <div className="mt-8 flex justify-end">
                        <button
                            type="button"
                            className="inline-flex items-center px-6 py-3 bg-indigo-600 border border-transparent rounded-md font-semibold text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                            </svg>
                            Guardar Configuración
                        </button>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
