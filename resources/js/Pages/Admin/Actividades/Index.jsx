import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';

export default function Actividades({ auth }) {
    const [timeFilter, setTimeFilter] = useState('hoy');
    const [userFilter, setUserFilter] = useState('todos');

    // Datos de ejemplo de actividades del sistema
    const actividades = [
        {
            id: 1,
            usuario: 'Juan Pérez',
            accion: 'Creó un nuevo usuario',
            detalle: 'Usuario: María González (Cliente)',
            fecha: '2024-07-22 10:30:00',
            tipo: 'crear'
        },
        {
            id: 2,
            usuario: 'Ana López',
            accion: 'Editó una propiedad',
            detalle: 'Propiedad: Departamento en Miraflores',
            fecha: '2024-07-22 09:15:00',
            tipo: 'editar'
        },
        {
            id: 3,
            usuario: 'Pedro Sánchez',
            accion: 'Completó una venta',
            detalle: 'Venta #V-2024-003 por $280,000',
            fecha: '2024-07-22 08:45:00',
            tipo: 'venta'
        },
        {
            id: 4,
            usuario: 'Sistema',
            accion: 'Respaldo automático completado',
            detalle: 'Base de datos respaldada exitosamente',
            fecha: '2024-07-22 00:00:00',
            tipo: 'sistema'
        }
    ];

    const getActivityIcon = (tipo) => {
        switch (tipo) {
            case 'crear':
                return (
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                    </div>
                );
            case 'editar':
                return (
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                    </div>
                );
            case 'venta':
                return (
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                    </div>
                );
            default:
                return (
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                        </svg>
                    </div>
                );
        }
    };

    const formatTime = (fecha) => {
        const date = new Date(fecha);
        return date.toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <AdminLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Registro de Actividades
                </h2>
            }
        >
            <Head title="Actividades - Admin" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {/* Header with filters */}
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4 sm:mb-0">
                                    Actividades del Sistema
                                </h3>
                                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                                    <select
                                        value={timeFilter}
                                        onChange={(e) => setTimeFilter(e.target.value)}
                                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="hoy">Hoy</option>
                                        <option value="semana">Esta semana</option>
                                        <option value="mes">Este mes</option>
                                        <option value="todos">Todos</option>
                                    </select>
                                    <select
                                        value={userFilter}
                                        onChange={(e) => setUserFilter(e.target.value)}
                                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="todos">Todos los usuarios</option>
                                        <option value="administradores">Administradores</option>
                                        <option value="asesores">Asesores</option>
                                        <option value="sistema">Sistema</option>
                                    </select>
                                </div>
                            </div>

                            {/* Activity Timeline */}
                            <div className="flow-root">
                                <ul className="-mb-8">
                                    {actividades.map((actividad, index) => (
                                        <li key={actividad.id}>
                                            <div className="relative pb-8">
                                                {index !== actividades.length - 1 && (
                                                    <span
                                                        className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                                                        aria-hidden="true"
                                                    />
                                                )}
                                                <div className="relative flex space-x-3">
                                                    <div>{getActivityIcon(actividad.tipo)}</div>
                                                    <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                                        <div>
                                                            <p className="text-sm text-gray-900">
                                                                <span className="font-medium">{actividad.usuario}</span> {actividad.accion}
                                                            </p>
                                                            <p className="text-sm text-gray-500">{actividad.detalle}</p>
                                                        </div>
                                                        <div className="text-right text-sm whitespace-nowrap text-gray-500">
                                                            <time>{formatTime(actividad.fecha)}</time>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {actividades.length === 0 && (
                                <div className="text-center py-8">
                                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <h3 className="mt-2 text-sm font-medium text-gray-900">No hay actividades</h3>
                                    <p className="mt-1 text-sm text-gray-500">No se encontraron actividades para los filtros seleccionados.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
