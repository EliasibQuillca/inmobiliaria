import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AsesorLayout from '../../Layouts/AsesorLayout';

export default function Perfil({ auth, asesor, estadisticas }) {
    // Formatear fecha para input type="date" (solo YYYY-MM-DD)
    const formatearFecha = (fecha) => {
        if (!fecha) return '';
        // Si viene en formato ISO, extraer solo la fecha
        return fecha.split('T')[0];
    };

    const { data, setData, patch, processing, errors } = useForm({
        nombre: asesor?.nombre || auth.user.name || '',
        email: auth.user.email || '',
        telefono: asesor?.telefono || auth.user.telefono || '',
        ci: asesor?.documento || '',
        direccion: asesor?.direccion || '',
        fecha_nacimiento: formatearFecha(asesor?.fecha_nacimiento) || '',
        especialidad: asesor?.especialidad || '',
        experiencia: asesor?.experiencia || 0,
        descripcion: asesor?.biografia || ''
    });

    const [editMode, setEditMode] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        patch(route('asesor.perfil'), {
            onSuccess: () => {
                setEditMode(false);
            }
        });
    };

    return (
        <AsesorLayout user={auth.user}>
            <Head title="Mi Perfil" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                                        Mi Perfil Profesional
                                    </h1>
                                    <p className="text-gray-600">
                                        Gestiona tu información personal y profesional
                                    </p>
                                </div>
                                <button
                                    onClick={() => setEditMode(!editMode)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium ${editMode
                                            ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                            : 'bg-blue-600 text-white hover:bg-blue-700'
                                        }`}
                                >
                                    {editMode ? 'Cancelar' : 'Editar Perfil'}
                                </button>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={submit}>
                        <div className="space-y-6">
                            {/* Información Personal */}
                            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                                <div className="p-6">
                                    <h3 className="text-lg font-medium text-gray-900 mb-6">Información Personal</h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Nombre Completo
                                            </label>
                                            <input
                                                type="text"
                                                value={data.nombre}
                                                onChange={(e) => setData('nombre', e.target.value)}
                                                disabled={!editMode}
                                                className={`w-full px-3 py-2 border rounded-md ${editMode
                                                        ? 'border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500'
                                                        : 'border-gray-200 bg-gray-50'
                                                    }`}
                                            />
                                            {errors.nombre && <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                value={data.email}
                                                onChange={(e) => setData('email', e.target.value)}
                                                disabled={!editMode}
                                                className={`w-full px-3 py-2 border rounded-md ${editMode
                                                        ? 'border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500'
                                                        : 'border-gray-200 bg-gray-50'
                                                    }`}
                                            />
                                            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Teléfono
                                            </label>
                                            <input
                                                type="text"
                                                value={data.telefono}
                                                onChange={(e) => setData('telefono', e.target.value)}
                                                disabled={!editMode}
                                                className={`w-full px-3 py-2 border rounded-md ${editMode
                                                        ? 'border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500'
                                                        : 'border-gray-200 bg-gray-50'
                                                    }`}
                                            />
                                            {errors.telefono && <p className="mt-1 text-sm text-red-600">{errors.telefono}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                DNI
                                            </label>
                                            <input
                                                type="text"
                                                value={data.ci}
                                                onChange={(e) => {
                                                    const value = e.target.value.replace(/\D/g, '');
                                                    if (value.length <= 8) {
                                                        setData('ci', value);
                                                    }
                                                }}
                                                disabled={!editMode}
                                                placeholder="12345678"
                                                maxLength={8}
                                                pattern="[0-9]{8}"
                                                className={`w-full px-3 py-2 border rounded-md ${editMode
                                                        ? 'border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500'
                                                        : 'border-gray-200 bg-gray-50'
                                                    }`}
                                            />
                                            {errors.ci && <p className="mt-1 text-sm text-red-600">{errors.ci}</p>}
                                            {editMode && !errors.ci && (
                                                <p className="mt-1 text-xs text-gray-500">
                                                    Debe contener exactamente 8 dígitos numéricos
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Fecha de Nacimiento
                                            </label>
                                            <input
                                                type="date"
                                                value={data.fecha_nacimiento}
                                                onChange={(e) => setData('fecha_nacimiento', e.target.value)}
                                                disabled={!editMode}
                                                max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
                                                className={`w-full px-3 py-2 border rounded-md ${editMode
                                                        ? 'border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500'
                                                        : 'border-gray-200 bg-gray-50'
                                                    }`}
                                            />
                                            {errors.fecha_nacimiento && <p className="mt-1 text-sm text-red-600">{errors.fecha_nacimiento}</p>}
                                            {editMode && !errors.fecha_nacimiento && (
                                                <p className="mt-1 text-xs text-gray-500">
                                                    Debes ser mayor de 18 años
                                                </p>
                                            )}
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Dirección
                                            </label>
                                            <textarea
                                                value={data.direccion}
                                                onChange={(e) => setData('direccion', e.target.value)}
                                                disabled={!editMode}
                                                rows={3}
                                                className={`w-full px-3 py-2 border rounded-md ${editMode
                                                        ? 'border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500'
                                                        : 'border-gray-200 bg-gray-50'
                                                    }`}
                                            />
                                            {errors.direccion && <p className="mt-1 text-sm text-red-600">{errors.direccion}</p>}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Información Profesional */}
                            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                                <div className="p-6">
                                    <h3 className="text-lg font-medium text-gray-900 mb-6">Información Profesional</h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Especialidad
                                            </label>
                                            <select
                                                value={data.especialidad}
                                                onChange={(e) => setData('especialidad', e.target.value)}
                                                disabled={!editMode}
                                                className={`w-full px-3 py-2 border rounded-md ${editMode
                                                        ? 'border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500'
                                                        : 'border-gray-200 bg-gray-50'
                                                    }`}
                                            >
                                                <option value="">Seleccionar</option>
                                                <option value="departamentos">Departamentos</option>
                                                <option value="casas">Casas</option>
                                                <option value="oficinas">Oficinas</option>
                                                <option value="terrenos">Terrenos</option>
                                                <option value="comercial">Propiedades Comerciales</option>
                                            </select>
                                            {errors.especialidad && <p className="mt-1 text-sm text-red-600">{errors.especialidad}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Años de Experiencia
                                            </label>
                                            <input
                                                type="number"
                                                value={data.experiencia}
                                                onChange={(e) => {
                                                    const value = parseInt(e.target.value);
                                                    if (value >= 0 && value <= 50) {
                                                        setData('experiencia', e.target.value);
                                                    } else if (e.target.value === '') {
                                                        setData('experiencia', 0);
                                                    }
                                                }}
                                                disabled={!editMode}
                                                min="0"
                                                max="50"
                                                className={`w-full px-3 py-2 border rounded-md ${editMode
                                                        ? 'border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500'
                                                        : 'border-gray-200 bg-gray-50'
                                                    }`}
                                            />
                                            {errors.experiencia && <p className="mt-1 text-sm text-red-600">{errors.experiencia}</p>}
                                            {editMode && !errors.experiencia && (
                                                <p className="mt-1 text-xs text-gray-500">
                                                    Máximo 50 años de experiencia
                                                </p>
                                            )}
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Descripción Profesional
                                            </label>
                                            <textarea
                                                value={data.descripcion}
                                                onChange={(e) => setData('descripcion', e.target.value)}
                                                disabled={!editMode}
                                                rows={4}
                                                placeholder="Describe tu experiencia, logros y enfoque profesional..."
                                                className={`w-full px-3 py-2 border rounded-md ${editMode
                                                        ? 'border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500'
                                                        : 'border-gray-200 bg-gray-50'
                                                    }`}
                                            />
                                            {errors.descripcion && <p className="mt-1 text-sm text-red-600">{errors.descripcion}</p>}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Estadísticas */}
                            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                                <div className="p-6">
                                    <h3 className="text-lg font-medium text-gray-900 mb-6">Estadísticas de Rendimiento</h3>

                                    <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                                        <div className="text-center">
                                            <div className="text-3xl font-bold text-blue-600">
                                                {estadisticas?.ventas_totales || 0}
                                            </div>
                                            <div className="text-sm text-gray-600">Ventas Totales</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-3xl font-bold text-green-600">
                                                {estadisticas?.ventas_este_mes || 0}
                                            </div>
                                            <div className="text-sm text-gray-600">Este Mes</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-3xl font-bold text-yellow-600">
                                                {estadisticas?.reservas_activas || 0}
                                            </div>
                                            <div className="text-sm text-gray-600">Reservas Activas</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-3xl font-bold text-purple-600">
                                                {estadisticas?.clientes_activos || 0}
                                            </div>
                                            <div className="text-sm text-gray-600">Clientes</div>
                                        </div>
                                        <div className="bg-indigo-50 p-4 rounded-lg text-center">
                                            <div className="text-3xl font-bold text-indigo-600">
                                                {asesor?.experiencia || 0}
                                            </div>
                                            <div className="text-sm text-gray-600">Años Experiencia</div>
                                        </div>
                                    </div>

                                    {/* Información adicional */}
                                    {asesor && (
                                        <div className="mt-6 pt-6 border-t border-gray-200">
                                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600">
                                                <div>
                                                    <strong>Fecha de contrato:</strong> {' '}
                                                    {asesor.fecha_contrato ? new Date(asesor.fecha_contrato).toLocaleDateString('es-PE') : 'No registrada'}
                                                </div>
                                                <div>
                                                    <strong>Tiempo Laboral:</strong> {' '}
                                                    <span className="text-blue-600 font-medium">
                                                        {estadisticas?.tiempo_laboral || '0 días'}
                                                    </span>
                                                </div>
                                                <div>
                                                    <strong>Comisión:</strong> {asesor.comision_porcentaje || 5}%
                                                </div>
                                                <div>
                                                    <strong>Estado:</strong> {' '}
                                                    <span className={`px-2 py-1 rounded-full text-xs ${
                                                        asesor.estado === 'activo'
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-red-100 text-red-800'
                                                    }`}>
                                                        {asesor.estado || 'Activo'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Botones de acción */}
                            {editMode && (
                                <div className="flex justify-end space-x-4">
                                    <button
                                        type="button"
                                        onClick={() => setEditMode(false)}
                                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                                    >
                                        {processing ? 'Guardando...' : 'Guardar Cambios'}
                                    </button>
                                </div>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </AsesorLayout>
    );
}
