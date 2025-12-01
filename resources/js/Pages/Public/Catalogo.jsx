import React, { useState } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import PublicLayout from '../../Layouts/PublicLayout';

export default function Catalogo({
    departamentos = { data: [], links: [] },
    estadisticas = {},
    filtros = {},
    tiposPropiedad = {},
    auth
}) {
    const [filtrosLocales, setFiltrosLocales] = useState({
        tipo_propiedad: (filtros && filtros.tipo_propiedad) || '',
        habitaciones: (filtros && filtros.habitaciones) || '',
        busqueda: (filtros && filtros.busqueda) || '',
        orden: (filtros && filtros.orden) || 'recientes',
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
        router.get('/catalogo', filtrosLocales, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const limpiarFiltros = () => {
        const filtrosVacios = {
            tipo_propiedad: '',
            habitaciones: '',
            busqueda: '',
            orden: 'recientes',
        };
        setFiltrosLocales(filtrosVacios);
        router.get('/catalogo', filtrosVacios);
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('es-PE', {
            style: 'currency',
            currency: 'PEN',
        }).format(amount);
    };    const toggleFavorito = async (departamentoId) => {
        if (!auth.user || auth.user.role !== 'cliente') {
            return;
        }

        try {
            await router.post('/cliente/favoritos/toggle', {
                departamento_id: departamentoId
            }, {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    // Actualizar el estado local del departamento
                    const departamentosActualizados = departamentos.data.map(dept => {
                        if (dept.id === departamentoId) {
                            return { ...dept, es_favorito: !dept.es_favorito };
                        }
                        return dept;
                    });
                    // No podemos actualizar directamente el estado porque viene de props
                    // La actualización se manejará con preserveState
                }
            });
        } catch (error) {
            console.error('Error al actualizar favorito:', error);
        }
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
        post('/catalogo/contacto', {
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
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
                        <div className="text-center">
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
                                Encuentra tu Hogar Ideal
                            </h1>
                            <p className="text-lg sm:text-xl text-blue-100 mb-6 sm:mb-8">
                                Explora nuestra selección de propiedades disponibles
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-6 sm:mt-8">
                                <div className="bg-blue-700 bg-opacity-50 rounded-lg p-4">
                                    <div className="text-3xl font-bold">{estadisticas.total_disponibles || 0}</div>
                                    <div className="text-blue-100">Propiedades Disponibles</div>
                                </div>
                                <div className="bg-blue-700 bg-opacity-50 rounded-lg p-4">
                                    <div className="text-3xl font-bold">{estadisticas.precio_min ? formatCurrency(estadisticas.precio_min) : 'N/A'}</div>
                                    <div className="text-blue-100">Desde</div>
                                </div>
                                <div className="bg-blue-700 bg-opacity-50 rounded-lg p-4">
                                    <div className="text-3xl font-bold">{estadisticas.precio_max ? formatCurrency(estadisticas.precio_max) : 'N/A'}</div>
                                    <div className="text-blue-100">Hasta</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    {/* Filtros */}
                    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6 sm:mb-8">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 sm:hidden">Filtrar Propiedades</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                            {/* Tipo de Propiedad */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
                                <select
                                    value={filtrosLocales.tipo_propiedad}
                                    onChange={(e) => setFiltrosLocales(prev => ({ ...prev, tipo_propiedad: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Todos los tipos</option>
                                    {Object.entries(tiposPropiedad || {}).map(([key, label]) => (
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                        {departamentos.data.map((departamento) => (
                            <div key={departamento.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                                {/* Imagen */}
                                <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                                    {departamento.imagenes && departamento.imagenes.length > 0 ? (
                                        <img
                                            src={departamento.imagenes[0].url.startsWith('http') ? departamento.imagenes[0].url : `/storage/${departamento.imagenes[0].url}`}
                                            alt={departamento.titulo || departamento.codigo}
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
                                <div className="p-4 sm:p-6">
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-4">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                {departamento.titulo || departamento.codigo}
                                            </h3>
                                            {departamento.ubicacion && (
                                                <p className="text-sm text-gray-600">{departamento.ubicacion}</p>
                                            )}
                                        </div>
                                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                                            {departamento.estado === 'disponible' ? 'Disponible' :
                                             departamento.estado === 'reservado' ? 'Reservado' :
                                             departamento.estado === 'vendido' ? 'Vendido' : 'No disponible'}
                                        </span>
                                    </div>

                                    <div className="space-y-2 mb-4">
                                        <p className="text-sm text-gray-600">
                                            <span className="font-medium">Tipo:</span> Departamento
                                        </p>
                                        {departamento.habitaciones && (
                                            <p className="text-sm text-gray-600">
                                                <span className="font-medium">Habitaciones:</span> {departamento.habitaciones}
                                            </p>
                                        )}
                                        {departamento.banos && (
                                            <p className="text-sm text-gray-600">
                                                <span className="font-medium">Baños:</span> {departamento.banos}
                                            </p>
                                        )}
                                        {departamento.area && (
                                            <p className="text-sm text-gray-600">
                                                <span className="font-medium">Área:</span> {departamento.area} m²
                                            </p>
                                        )}
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
                                    <div className="flex flex-col sm:flex-row gap-2 sm:space-x-2">
                                        <div className="flex gap-2">
                                            <Link
                                                href={`/catalogo/${departamento.id}`}
                                                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium text-center transition-colors"
                                            >
                                                Ver Detalles
                                            </Link>

                                        {/* Botón de favoritos */}
                                        {auth.user && auth.user.role === 'cliente' ? (
                                            // Cliente autenticado: puede agregar a favoritos
                                            <button
                                                onClick={() => toggleFavorito(departamento.id)}
                                                className="px-3 py-2 rounded-lg text-sm font-medium border transition-colors hover:bg-gray-50"
                                                title={departamento.es_favorito ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                                            >
                                                <svg
                                                    className={`w-5 h-5 ${departamento.es_favorito ? 'text-red-500 fill-current' : 'text-gray-400'}`}
                                                    fill={departamento.es_favorito ? 'currentColor' : 'none'}
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                                </svg>
                                            </button>
                                        ) : (
                                            // Visitante: mostrar tooltip invitando a registrarse
                                            <Link
                                                href="/register"
                                                className="px-3 py-2 rounded-lg text-sm font-medium border border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-colors group"
                                                title="Regístrate para guardar favoritos"
                                            >
                                                <svg
                                                    className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                                </svg>
                                            </Link>
                                        )}
                                        </div>

                                        {/* Botón "Solicitar Información" */}
                                        {auth.user && auth.user.role === 'cliente' ? (
                                            // Cliente autenticado: redirige al formulario completo
                                            <Link
                                                href={`/cliente/solicitudes/crear?departamento_id=${departamento.id}`}
                                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-1"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                                <span>Solicitar Info</span>
                                            </Link>
                                        ) : (
                                            // Visitante no autenticado: debe registrarse
                                            <Link
                                                href="/register"
                                                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center space-x-1"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                </svg>
                                                <span>Regístrate para contactar</span>
                                            </Link>
                                        )}
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
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                                <button
                                    onClick={limpiarFiltros}
                                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                                >
                                    Limpiar Filtros
                                </button>

                                {/* Opciones adicionales para clientes autenticados */}
                                {auth.user && auth.user.role === 'cliente' && (
                                    <>
                                        <Link
                                            href="/cliente/solicitudes"
                                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100"
                                        >
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                            </svg>
                                            Crear Solicitud
                                        </Link>
                                        <Link
                                            href="/cliente/asesores"
                                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-green-600 bg-green-50 border border-green-200 rounded-md hover:bg-green-100"
                                        >
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                            Ver Asesores
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Modal de Contacto */}
                {mostrarModalContacto && (
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
                        <div className="relative mx-auto p-4 sm:p-6 border w-full max-w-2xl shadow-lg rounded-lg bg-white max-h-[90vh] overflow-y-auto">
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
