import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AsesorLayout from '../../../Layouts/AsesorLayout';

export default function CrearCliente({ auth }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        nombre: '',
        telefono: '',
        email: '',
        dni: '',
        direccion: '',
        medio_contacto: 'whatsapp',
        notas_contacto: '',
        departamento_interes: '',
        presupuesto_min: '',
        presupuesto_max: '',
        tipo_propiedad: 'apartamento',
        habitaciones_deseadas: '',
        zona_preferida: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/asesor/clientes', {
            onSuccess: () => {
                reset();
            }
        });
    };

    return (
        <AsesorLayout user={auth.user}>
            <Head title="Registrar Nuevo Cliente" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="md:flex md:items-center md:justify-between">
                            <div className="flex-1 min-w-0">
                                <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                                    Registrar Nuevo Cliente
                                </h2>
                                <p className="mt-1 text-sm text-gray-500">
                                    Completa la información del cliente para iniciar el proceso de venta
                                </p>
                            </div>
                            <div className="mt-4 flex md:mt-0 md:ml-4">
                                <Link
                                    href="/asesor/clientes"
                                    className="ml-3 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    ← Volver a Clientes
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Formulario */}
                    <div className="bg-white shadow rounded-lg">
                        <form onSubmit={handleSubmit}>
                            <div className="px-6 py-8 space-y-6">
                                {/* Información Personal */}
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                                        Información Personal
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
                                                Nombre Completo *
                                            </label>
                                            <input
                                                type="text"
                                                id="nombre"
                                                value={data.nombre}
                                                onChange={(e) => setData('nombre', e.target.value)}
                                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                                required
                                            />
                                            {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>}
                                        </div>

                                        <div>
                                            <label htmlFor="dni" className="block text-sm font-medium text-gray-700">
                                                Documento de Identidad *
                                            </label>
                                            <input
                                                type="text"
                                                id="dni"
                                                value={data.dni}
                                                onChange={(e) => setData('dni', e.target.value)}
                                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                                required
                                            />
                                            {errors.dni && <p className="text-red-500 text-xs mt-1">{errors.dni}</p>}
                                        </div>

                                        <div>
                                            <label htmlFor="telefono" className="block text-sm font-medium text-gray-700">
                                                Teléfono *
                                            </label>
                                            <input
                                                type="tel"
                                                id="telefono"
                                                value={data.telefono}
                                                onChange={(e) => setData('telefono', e.target.value)}
                                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                                required
                                            />
                                            {errors.telefono && <p className="text-red-500 text-xs mt-1">{errors.telefono}</p>}
                                        </div>

                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                                Email (opcional)
                                            </label>
                                            <input
                                                type="email"
                                                id="email"
                                                value={data.email}
                                                onChange={(e) => setData('email', e.target.value)}
                                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                            />
                                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                                        </div>

                                        <div className="md:col-span-2">
                                            <label htmlFor="direccion" className="block text-sm font-medium text-gray-700">
                                                Dirección Actual
                                            </label>
                                            <textarea
                                                id="direccion"
                                                value={data.direccion}
                                                onChange={(e) => setData('direccion', e.target.value)}
                                                rows={2}
                                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                            />
                                            {errors.direccion && <p className="text-red-500 text-xs mt-1">{errors.direccion}</p>}
                                        </div>
                                    </div>
                                </div>

                                {/* Información de Contacto */}
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                                        Información de Contacto
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="medio_contacto" className="block text-sm font-medium text-gray-700">
                                                Medio de Contacto Inicial *
                                            </label>
                                            <select
                                                id="medio_contacto"
                                                value={data.medio_contacto}
                                                onChange={(e) => setData('medio_contacto', e.target.value)}
                                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                            >
                                                <option value="whatsapp">WhatsApp</option>
                                                <option value="telefono">Llamada Telefónica</option>
                                                <option value="presencial">Visita Presencial</option>
                                                <option value="email">Email</option>
                                                <option value="referido">Referido</option>
                                            </select>
                                        </div>

                                        <div className="md:col-span-2">
                                            <label htmlFor="notas_contacto" className="block text-sm font-medium text-gray-700">
                                                Notas del Primer Contacto
                                            </label>
                                            <textarea
                                                id="notas_contacto"
                                                value={data.notas_contacto}
                                                onChange={(e) => setData('notas_contacto', e.target.value)}
                                                rows={3}
                                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="Describe cómo fue el primer contacto, qué mencionó el cliente, sus inquietudes iniciales..."
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Preferencias de Propiedad */}
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                                        Preferencias de Propiedad
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="tipo_propiedad" className="block text-sm font-medium text-gray-700">
                                                Tipo de Propiedad
                                            </label>
                                            <select
                                                id="tipo_propiedad"
                                                value={data.tipo_propiedad}
                                                onChange={(e) => setData('tipo_propiedad', e.target.value)}
                                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                            >
                                                <option value="apartamento">Apartamento</option>
                                                <option value="casa">Casa</option>
                                                <option value="penthouse">Penthouse</option>
                                                <option value="estudio">Estudio</option>
                                                <option value="duplex">Dúplex</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label htmlFor="habitaciones_deseadas" className="block text-sm font-medium text-gray-700">
                                                Número de Habitaciones
                                            </label>
                                            <select
                                                id="habitaciones_deseadas"
                                                value={data.habitaciones_deseadas}
                                                onChange={(e) => setData('habitaciones_deseadas', e.target.value)}
                                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                            >
                                                <option value="">Sin preferencia</option>
                                                <option value="1">1 habitación</option>
                                                <option value="2">2 habitaciones</option>
                                                <option value="3">3 habitaciones</option>
                                                <option value="4">4+ habitaciones</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label htmlFor="presupuesto_min" className="block text-sm font-medium text-gray-700">
                                                Presupuesto Mínimo (COP)
                                            </label>
                                            <input
                                                type="number"
                                                id="presupuesto_min"
                                                value={data.presupuesto_min}
                                                onChange={(e) => setData('presupuesto_min', e.target.value)}
                                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="80000000"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="presupuesto_max" className="block text-sm font-medium text-gray-700">
                                                Presupuesto Máximo (COP)
                                            </label>
                                            <input
                                                type="number"
                                                id="presupuesto_max"
                                                value={data.presupuesto_max}
                                                onChange={(e) => setData('presupuesto_max', e.target.value)}
                                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="150000000"
                                            />
                                        </div>

                                        <div className="md:col-span-2">
                                            <label htmlFor="zona_preferida" className="block text-sm font-medium text-gray-700">
                                                Zonas de Preferencia
                                            </label>
                                            <input
                                                type="text"
                                                id="zona_preferida"
                                                value={data.zona_preferida}
                                                onChange={(e) => setData('zona_preferida', e.target.value)}
                                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="Ej: Zona Norte, Centro, Chapinero..."
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Botones */}
                            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
                                <Link
                                    href="/asesor/clientes"
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Cancelar
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                                >
                                    {processing ? 'Registrando...' : 'Registrar Cliente'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AsesorLayout>
    );
}
