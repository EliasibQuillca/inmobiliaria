import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function CrearSolicitud({ auth, departamentoId = null }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        departamento_id: departamentoId || '',
        mensaje: '',
        tipo_consulta: 'informacion',
    });

    // Datos de ejemplo de departamentos disponibles
    const [departamentosDisponibles] = useState([
        {
            id: 1,
            codigo: 'DEPT-001',
            direccion: 'Av. Los Andes 123, Dpto 501',
            precio: 250000,
        },
        {
            id: 2,
            codigo: 'DEPT-002',
            direccion: 'Jr. Lima 456, Dpto 302',
            precio: 180000,
        },
        {
            id: 3,
            codigo: 'DEPT-003',
            direccion: 'Av. Central 789, Dpto 204',
            precio: 320000,
        },
    ]);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('cliente.solicitudes.store'), {
            onSuccess: () => {
                reset();
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
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Nueva Solicitud</h2>}
        >
            <Head title="Nueva Solicitud" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900">
                                        Crear Nueva Solicitud
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Solicita información o programa una visita a una propiedad
                                    </p>
                                </div>
                                <Link
                                    href="/cliente/solicitudes"
                                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                    </svg>
                                    Volver
                                </Link>
                            </div>

                            {/* Formulario */}
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Selección de Departamento */}
                                <div>
                                    <label htmlFor="departamento_id" className="block text-sm font-medium text-gray-700 mb-2">
                                        Departamento de Interés
                                    </label>
                                    <select
                                        id="departamento_id"
                                        name="departamento_id"
                                        value={data.departamento_id}
                                        onChange={(e) => setData('departamento_id', e.target.value)}
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    >
                                        <option value="">Seleccionar departamento...</option>
                                        {departamentosDisponibles.map((dept) => (
                                            <option key={dept.id} value={dept.id}>
                                                {dept.codigo} - {dept.direccion} - {formatCurrency(dept.precio)}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.departamento_id && (
                                        <p className="mt-1 text-sm text-red-600">{errors.departamento_id}</p>
                                    )}
                                </div>

                                {/* Tipo de Consulta */}
                                <div>
                                    <label htmlFor="tipo_consulta" className="block text-sm font-medium text-gray-700 mb-2">
                                        Tipo de Consulta
                                    </label>
                                    <select
                                        id="tipo_consulta"
                                        name="tipo_consulta"
                                        value={data.tipo_consulta}
                                        onChange={(e) => setData('tipo_consulta', e.target.value)}
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="informacion">Solicitar Información</option>
                                        <option value="visita">Programar Visita</option>
                                        <option value="cotizacion">Solicitar Cotización</option>
                                        <option value="financiamiento">Consulta de Financiamiento</option>
                                    </select>
                                    {errors.tipo_consulta && (
                                        <p className="mt-1 text-sm text-red-600">{errors.tipo_consulta}</p>
                                    )}
                                </div>

                                {/* Mensaje */}
                                <div>
                                    <label htmlFor="mensaje" className="block text-sm font-medium text-gray-700 mb-2">
                                        Mensaje
                                    </label>
                                    <textarea
                                        id="mensaje"
                                        name="mensaje"
                                        rows={6}
                                        value={data.mensaje}
                                        onChange={(e) => setData('mensaje', e.target.value)}
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Describe tu consulta o solicitud..."
                                        required
                                    />
                                    {errors.mensaje && (
                                        <p className="mt-1 text-sm text-red-600">{errors.mensaje}</p>
                                    )}
                                </div>

                                {/* Botones de Acción */}
                                <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                                    <Link
                                        href="/cliente/solicitudes"
                                        className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                                    >
                                        Cancelar
                                    </Link>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {processing ? (
                                            <>
                                                <svg className="w-4 h-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                </svg>
                                                Enviando...
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                                </svg>
                                                Enviar Solicitud
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>

                            {/* Información Adicional */}
                            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <h3 className="text-sm font-medium text-blue-800">
                                            Información sobre solicitudes
                                        </h3>
                                        <div className="mt-2 text-sm text-blue-700">
                                            <ul className="list-disc pl-5 space-y-1">
                                                <li>Tu solicitud será asignada automáticamente a un asesor especializado</li>
                                                <li>Recibirás una respuesta en un plazo máximo de 24 horas</li>
                                                <li>Puedes hacer seguimiento del estado de tu solicitud en tu dashboard</li>
                                                <li>Para consultas urgentes, puedes contactarnos directamente al teléfono</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
