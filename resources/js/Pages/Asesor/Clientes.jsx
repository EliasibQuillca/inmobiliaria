import React from 'react';
import AsesorLayout from '@/Layouts/AsesorLayout';
import { Head } from '@inertiajs/react';

export default function Clientes() {
    const clientes = [
        {
            id: 1,
            nombre: 'María González',
            email: 'maria.gonzalez@email.com',
            telefono: '987654321',
            estado: 'activo'
        },
        {
            id: 2,
            nombre: 'Carlos Mendoza',
            email: 'carlos.mendoza@email.com',
            telefono: '987123456',
            estado: 'potencial'
        }
    ];

    return (
        <AsesorLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Gestión de Clientes
                </h2>
            }
        >
            <Head title="Clientes - Asesor" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-6">Lista de Clientes</h3>

                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                Cliente
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                Email
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                Teléfono
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                Estado
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {clientes.map((cliente) => (
                                            <tr key={cliente.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {cliente.nombre}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {cliente.email}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {cliente.telefono}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                        cliente.estado === 'activo' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                        {cliente.estado}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AsesorLayout>
    );
}

