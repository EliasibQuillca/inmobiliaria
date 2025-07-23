import React from 'react';
import AsesorLayout from '@/Layouts/AsesorLayout';
import { Head } from '@inertiajs/react';

export default function Perfil() {
    return (
        <AsesorLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Mi Perfil
                </h2>
            }
        >
            <Head title="Perfil - Asesor" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h3 className="text-lg font-medium mb-4">Información del Asesor</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Nombre Completo</label>
                                    <input
                                        type="text"
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-teal-500 focus:ring-teal-500"
                                        defaultValue="Asesor de Prueba"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Email</label>
                                    <input
                                        type="email"
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-teal-500 focus:ring-teal-500"
                                        defaultValue="asesor@inmobiliaria.com"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Teléfono</label>
                                    <input
                                        type="tel"
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-teal-500 focus:ring-teal-500"
                                        defaultValue="+51 987 654 321"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Especialidad</label>
                                    <select className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-teal-500 focus:ring-teal-500">
                                        <option>Departamentos</option>
                                        <option>Casas</option>
                                        <option>Oficinas</option>
                                        <option>Locales Comerciales</option>
                                    </select>
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end">
                                <button className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500">
                                    Guardar Cambios
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AsesorLayout>
    );
}
