import React from 'react';
import AsesorLayout from '@/Layouts/AsesorLayout';
import { Head } from '@inertiajs/react';

export default function Configuracion() {
    return (
        <AsesorLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Configuración
                </h2>
            }
        >
            <Head title="Configuración - Asesor" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="space-y-6">
                        {/* Notificaciones */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Notificaciones</h3>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-900">Email de nuevos leads</h4>
                                            <p className="text-sm text-gray-500">Recibir notificaciones por email cuando lleguen nuevos clientes potenciales</p>
                                        </div>
                                        <input
                                            type="checkbox"
                                            className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                                            defaultChecked
                                        />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-900">Recordatorios de seguimiento</h4>
                                            <p className="text-sm text-gray-500">Notificaciones para recordar hacer seguimiento a clientes</p>
                                        </div>
                                        <input
                                            type="checkbox"
                                            className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                                            defaultChecked
                                        />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-900">Actualizaciones del sistema</h4>
                                            <p className="text-sm text-gray-500">Notificaciones sobre nuevas funcionalidades y actualizaciones</p>
                                        </div>
                                        <input
                                            type="checkbox"
                                            className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Preferencias */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Preferencias</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Zona horaria</label>
                                        <select className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-teal-500 focus:ring-teal-500">
                                            <option>GMT-5 (Lima, Perú)</option>
                                            <option>GMT-3 (Buenos Aires)</option>
                                            <option>GMT-6 (México)</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Idioma</label>
                                        <select className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-teal-500 focus:ring-teal-500">
                                            <option>Español</option>
                                            <option>English</option>
                                            <option>Português</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Moneda predeterminada</label>
                                        <select className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-teal-500 focus:ring-teal-500">
                                            <option>Soles (S/)</option>
                                            <option>Dólares (USD)</option>
                                            <option>Euros (EUR)</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Elementos por página</label>
                                        <select className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-teal-500 focus:ring-teal-500">
                                            <option>10</option>
                                            <option>25</option>
                                            <option>50</option>
                                            <option>100</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Seguridad */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Seguridad</h3>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Cambiar contraseña</label>
                                        <div className="mt-1 space-y-3">
                                            <input
                                                type="password"
                                                placeholder="Contraseña actual"
                                                className="block w-full border-gray-300 rounded-md shadow-sm focus:border-teal-500 focus:ring-teal-500"
                                            />
                                            <input
                                                type="password"
                                                placeholder="Nueva contraseña"
                                                className="block w-full border-gray-300 rounded-md shadow-sm focus:border-teal-500 focus:ring-teal-500"
                                            />
                                            <input
                                                type="password"
                                                placeholder="Confirmar nueva contraseña"
                                                className="block w-full border-gray-300 rounded-md shadow-sm focus:border-teal-500 focus:ring-teal-500"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-900">Autenticación de dos factores</h4>
                                            <p className="text-sm text-gray-500">Agregar una capa extra de seguridad a tu cuenta</p>
                                        </div>
                                        <button className="bg-teal-600 text-white px-3 py-1 rounded text-sm hover:bg-teal-700">
                                            Activar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <button className="bg-teal-600 text-white px-6 py-2 rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500">
                                Guardar Todas las Configuraciones
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AsesorLayout>
    );
}
