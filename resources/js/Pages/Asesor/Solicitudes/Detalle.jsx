import React from 'react';
import AsesorLayout from '@/Layouts/AsesorLayout';
import { Head, Link } from '@inertiajs/react';

export default function DetalleSolicitud({ auth, solicitudId }) {
    return (
        <AsesorLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Detalle de Solicitud #{solicitudId}
                </h2>
            }
        >
            <Head title={`Solicitud #${solicitudId} - Asesor`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-medium text-gray-900">Detalle de Solicitud</h3>
                                <Link
                                    href="/asesor/solicitudes"
                                    className="inline-flex items-center px-4 py-2 bg-gray-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 focus:bg-gray-700 active:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                >
                                    Volver
                                </Link>
                            </div>

                            <div className="text-center py-12">
                                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                <h3 className="mt-2 text-sm font-medium text-gray-900">Vista de Detalle</h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    Esta página está en desarrollo. Aquí se mostrará el detalle completo de la solicitud #{solicitudId}.
                                </p>
                                <div className="mt-6">
                                    <Link
                                        href="/asesor/solicitudes"
                                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                        Volver a Solicitudes
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AsesorLayout>
    );
}
