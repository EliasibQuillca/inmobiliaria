import React, { useState } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import PublicLayout from '../../Layouts/PublicLayout';

export default function Catalogo({
    departamentos,
    estadisticas,
    filtros,
    tiposPropiedad,
    auth
}) {
    const [filtrosLocales, setFiltrosLocales] = useState({
        tipo_propiedad: filtros.tipo_propiedad || '',
        habitaciones: filtros.habitaciones || '',
        precio_min: filtros.precio_min || '',
        precio_max: filtros.precio_max || '',
        busqueda: filtros.busqueda || '',
        orden: filtros.orden || 'recientes',
    });

    const [mostrarModalContacto, setMostrarModalContacto] = useState(false);
    const [departamentoSeleccionado, setDepartamentoSeleccionado] = useState(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        departamento_id: '',
        nombre: auth.user ? auth.user.name : '',
        telefono: auth.user ? auth.user.telefono : '',
        email: auth.user ? auth.user.email : '',
        mensaje: '',
        crear_cuenta: false,
    });

    const aplicarFiltros = () => {
        router.get(route('catalogo.index'), filtrosLocales, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const limpiarFiltros = () => {
        const filtrosVacios = {
            tipo_propiedad: '',
            habitaciones: '',
            precio_min: '',
            precio_max: '',
            busqueda: '',
            orden: 'recientes',
        };
        setFiltrosLocales(filtrosVacios);
        router.get(route('catalogo.index'), filtrosVacios);
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const abrirModalContacto = (departamento) => {
        setDepartamentoSeleccionado(departamento);
        setData(prev => ({
            ...prev,
            departamento_id: departamento.id,
            nombre: auth.user ? auth.user.name : '',
            telefono: auth.user ? auth.user.telefono : '',
            email: auth.user ? auth.user.email : '',
        }));
        setMostrarModalContacto(true);
    };

    const enviarSolicitud = (e) => {
        e.preventDefault();
        post(route('catalogo.contacto'), {
            onSuccess: () => {
                setMostrarModalContacto(false);
                reset();
            }
        });
    };

    return (
        <PublicLayout auth={auth}>
            <Head title="Catálogo de Propiedades" />

            <div className="min-h-screen bg-gray-50">
                {/* Hero Section */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                        <div className="text-center">
                            <h1 className="text-4xl font-bold mb-4">
                                Encuentra tu Hogar Ideal
                            </h1>
                            <p className="text-xl text-blue-100 mb-8">
                                Explora nuestra selección de propiedades disponibles
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                                <div className="bg-blue-700 bg-opacity-50 rounded-lg p-4">
                                    <div className="text-3xl font-bold">{estadisticas.total_disponibles}</div>
                                    <div className="text-blue-100">Propiedades Disponibles</div>
                                </div>
                                <div className="bg-blue-700 bg-opacity-50 rounded-lg p-4">
                                    <div className="text-3xl font-bold">{formatCurrency(estadisticas.precio_min)}</div>
                                    <div className="text-blue-100">Desde</div>
                                </div>
                                <div className="bg-blue-700 bg-opacity-50 rounded-lg p-4">
                                    <div className="text-3xl font-bold">{formatCurrency(estadisticas.precio_max)}</div>
                                    <div className="text-blue-100">Hasta</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    {/* Filtros */}
                    <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                            {/* Tipo de Propiedad */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
                                <select
                                    value={filtrosLocales.tipo_propiedad}
                                    onChange={(e) => setFiltrosLocales(prev => ({ ...prev, tipo_propiedad: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Todos los tipos</option>
                                    {Object.entries(tiposPropiedad).map(([key, label]) => (
                                        <option key={key} value={key}>{label}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Habitaciones */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Habitaciones</label>
                                <select
                                    value={filtrosLocales.habitaciones}
                                    onChange={(e) => setFiltrosLocales(prev => ({ ...prev, habitaciones: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Cualquier cantidad</option>
                                    <option value="1">1 habitación</option>
                                    <option value="2">2 habitaciones</option>
                                    <option value="3">3 habitaciones</option>
                                    <option value="4">4+ habitaciones</option>
                                </select>
                            </div>

                            {/* Precio Mínimo */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Precio Mín.</label>
                                <input
                                    type="number"
                                    value={filtrosLocales.precio_min}
                                    onChange={(e) => setFiltrosLocales(prev => ({ ...prev, precio_min: e.target.value }))}
                                    placeholder="Desde..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {/* Precio Máximo */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Precio Máx.</label>
                                <input
                                    type="number"
                                    value={filtrosLocales.precio_max}
                                    onChange={(e) => setFiltrosLocales(prev => ({ ...prev, precio_max: e.target.value }))}
                                    placeholder="Hasta..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {/* Ordenamiento */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Ordenar por</label>
                                <select
                                    value={filtrosLocales.orden}
                                    onChange={(e) => setFiltrosLocales(prev => ({ ...prev, orden: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="recientes">Más recientes</option>
                                    <option value="precio_asc">Precio: menor a mayor</option>
                                    <option value="precio_desc">Precio: mayor a menor</option>
                                    <option value="habitaciones">Más habitaciones</option>
                                </select>
                            </div>

                            {/* Búsqueda */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Buscar</label>
                                <input
                                    type="text"
                                    value={filtrosLocales.busqueda}
                                    onChange={(e) => setFiltrosLocales(prev => ({ ...prev, busqueda: e.target.value }))}
                                    placeholder="Código, ubicación..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end space-x-3 mt-6">
                            <button
                                onClick={limpiarFiltros}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                            >
                                Limpiar Filtros
                            </button>
                            <button
                                onClick={aplicarFiltros}
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                            >
                                Aplicar Filtros
                            </button>
                        </div>
                    </div>

                    {/* Grid de Departamentos */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {departamentos.data.map((departamento) => (
                            <div key={departamento.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                                {/* Imagen */}
                                <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                                    {departamento.imagenes && departamento.imagenes.length > 0 ? (
                                        <img
                                            src={`/storage/${departamento.imagenes[0].ruta}`}
                                            alt={departamento.codigo}
                                            className="w-full h-48 object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-48 bg-gray-300 flex items-center justify-center">
                                            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                    )}
                                </div>

                                {/* Contenido */}
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            {departamento.codigo}
                                        </h3>
                                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                                            Disponible
                                        </span>
                                    </div>

                                    <div className="space-y-2 mb-4">
                                        <p className="text-sm text-gray-600">
                                            <span className="font-medium">Tipo:</span> {tiposPropiedad[departamento.tipo_propiedad] || departamento.tipo_propiedad}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            <span className="font-medium">Habitaciones:</span> {departamento.habitaciones}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            <span className="font-medium">Baños:</span> {departamento.banos}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            <span className="font-medium">Área:</span> {departamento.area_construida} m²
                                        </p>
                                        <p className="text-lg font-bold text-blue-600">
                                            {formatCurrency(departamento.precio)}
                                        </p>
                                    </div>

                                    {/* Información del Asesor */}
                                    {departamento.asesor && (
                                        <div className="border-t pt-4 mb-4">
                                            <p className="text-sm text-gray-600">
                                                <span className="font-medium">Asesor:</span> {departamento.asesor.nombre}
                                            </p>
                                            {departamento.asesor.usuario && (
                                                <p className="text-sm text-gray-600">
                                                    <span className="font-medium">Contacto:</span> {departamento.asesor.usuario.telefono || departamento.asesor.telefono}
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    {/* Acciones */}
                                    <div className="flex space-x-2">
                                        <Link
                                            href={route('catalogo.show', departamento.id)}
                                            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium text-center"
                                        >
                                            Ver Detalles
                                        </Link>
                                        <button
                                            onClick={() => abrirModalContacto(departamento)}
                                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium"
                                        >
                                            Me Interesa
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Paginación */}
                    {departamentos.links && departamentos.links.length > 3 && (
                        <div className="mt-8 flex justify-center">
                            <nav className="flex space-x-2">
                                {departamentos.links.map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.url || '#'}
                                        className={`px-3 py-2 text-sm rounded-md ${
                                            link.active
                                                ? 'bg-blue-600 text-white'
                                                : link.url
                                                    ? 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </nav>
                        </div>
                    )}

                    {/* Mensaje cuando no hay departamentos */}
                    {departamentos.data.length === 0 && (
                        <div className="text-center py-12">
                            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron propiedades</h3>
                            <p className="text-gray-500 mb-6">
                                Intenta ajustar los filtros para ver más resultados.
                            </p>
                            <button
                                onClick={limpiarFiltros}
                                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                            >
                                Limpiar Filtros
                            </button>
                        </div>
                    )}
                </div>

                {/* Modal de Contacto */}
                {mostrarModalContacto && (
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                        <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
                            <div className="mt-3">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-medium text-gray-900">
                                        Solicitar Información - {departamentoSeleccionado?.codigo}
                                    </h3>
                                    <button
                                        onClick={() => setMostrarModalContacto(false)}
                                        className="text-gray-400 hover:text-gray-600"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                <form onSubmit={enviarSolicitud} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Nombre Completo *
                                            </label>
                                            <input
                                                type="text"
                                                value={data.nombre}
                                                onChange={(e) => setData('nombre', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                required
                                                disabled={auth.user}
                                            />
                                            {errors.nombre && <p className="text-red-600 text-sm mt-1">{errors.nombre}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Teléfono *
                                            </label>
                                            <input
                                                type="tel"
                                                value={data.telefono}
                                                onChange={(e) => setData('telefono', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                required
                                            />
                                            {errors.telefono && <p className="text-red-600 text-sm mt-1">{errors.telefono}</p>}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email (Opcional)
                                        </label>
                                        <input
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            disabled={auth.user}
                                        />
                                        {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Mensaje (Opcional)
                                        </label>
                                        <textarea
                                            value={data.mensaje}
                                            onChange={(e) => setData('mensaje', e.target.value)}
                                            rows={3}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Cuéntanos sobre tus necesidades o preguntas..."
                                        />
                                        {errors.mensaje && <p className="text-red-600 text-sm mt-1">{errors.mensaje}</p>}
                                    </div>

                                    {!auth.user && data.email && (
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                id="crear_cuenta"
                                                checked={data.crear_cuenta}
                                                onChange={(e) => setData('crear_cuenta', e.target.checked)}
                                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                            />
                                            <label htmlFor="crear_cuenta" className="ml-2 block text-sm text-gray-700">
                                                Crear cuenta para futuras consultas (Password: 123456)
                                            </label>
                                        </div>
                                    )}

                                    <div className="flex justify-end space-x-3 mt-6">
                                        <button
                                            type="button"
                                            onClick={() => setMostrarModalContacto(false)}
                                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
                                        >
                                            {processing ? 'Enviando...' : 'Enviar Solicitud'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </PublicLayout>
    );
}
