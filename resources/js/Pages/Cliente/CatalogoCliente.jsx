import React, { useState } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import PublicLayout from '../../Layouts/PublicLayout';

export default function CatalogoCliente({
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
        router.get('/cliente/catalogo', filtrosLocales, {
            preserveState: true,
            preserveScroll: false, // Mejorar UX: scroll al inicio después de filtrar
            onStart: () => {
                // Opcional: mostrar indicador de carga
            },
            onFinish: () => {
                // Scroll suave al inicio de los resultados
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
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
        router.get('/cliente/catalogo', filtrosVacios, {
            preserveScroll: false,
            onFinish: () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    };

    // Función para aplicar filtros al presionar Enter
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            aplicarFiltros();
        }
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
        post('/cliente/catalogo/contacto', {
            onSuccess: () => {
                setMostrarModalContacto(false);
                reset();
            }
        });
    };

    return (
        <PublicLayout auth={auth}>
            <Head title="Catálogo de Propiedades" />

            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
                {/* Hero Section */}
                <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-black opacity-10"></div>
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl -mr-48 -mt-48"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl -ml-48 -mb-48"></div>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
                        <div className="text-center">
                            <h1 className="text-5xl font-bold mb-4 tracking-tight">
                                Encuentra tu Hogar Ideal
                            </h1>
                            <p className="text-xl text-blue-50 mb-8 max-w-2xl mx-auto">
                                Explora nuestra selección de propiedades disponibles con las mejores opciones para ti
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                                <div className="bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20 rounded-2xl p-6 hover:bg-opacity-15 transition-all shadow-xl">
                                    <div className="text-4xl font-bold mb-2">{estadisticas.total_disponibles || 0}</div>
                                    <div className="text-blue-50 text-sm font-medium">Propiedades Disponibles</div>
                                </div>
                                <div className="bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20 rounded-2xl p-6 hover:bg-opacity-15 transition-all shadow-xl">
                                    <div className="text-4xl font-bold mb-2">{estadisticas.precio_min ? formatCurrency(estadisticas.precio_min) : 'N/A'}</div>
                                    <div className="text-blue-50 text-sm font-medium">Precio Desde</div>
                                </div>
                                <div className="bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20 rounded-2xl p-6 hover:bg-opacity-15 transition-all shadow-xl">
                                    <div className="text-4xl font-bold mb-2">{estadisticas.precio_max ? formatCurrency(estadisticas.precio_max) : 'N/A'}</div>
                                    <div className="text-blue-50 text-sm font-medium">Precio Hasta</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    {/* Encabezado con resultados */}
                    <div className="mb-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">
                                    {departamentos.data.length > 0 ? (
                                        <>Propiedades Disponibles <span className="text-blue-600">({departamentos.total || departamentos.data.length})</span></>
                                    ) : (
                                        'Buscar Propiedades'
                                    )}
                                </h2>
                                <p className="mt-1 text-sm text-gray-600">
                                    {departamentos.data.length > 0
                                        ? 'Filtra y encuentra tu hogar ideal'
                                        : 'Ajusta los filtros para ver propiedades disponibles'
                                    }
                                </p>
                            </div>
                            {auth.user && auth.user.role === 'cliente' && departamentos.data.length > 0 && (
                                <div className="mt-4 sm:mt-0 flex gap-2">
                                    <Link
                                        href="/cliente/dashboard"
                                        className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                        </svg>
                                        Mi Panel
                                    </Link>
                                    <Link
                                        href="/cliente/favoritos"
                                        className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                                    >
                                        <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                        </svg>
                                        Favoritos
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Filtros */}
                    <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-8 mb-8">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-slate-900 flex items-center">
                                <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg mr-3">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                                    </svg>
                                </div>
                                Filtros de Búsqueda
                            </h3>
                            <button
                                onClick={limpiarFiltros}
                                className="text-sm text-blue-600 hover:text-blue-700 font-semibold flex items-center px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
                            >
                                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                Limpiar filtros
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {/* Tipo de Propiedad */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Tipo</label>
                                <select
                                    value={filtrosLocales.tipo_propiedad}
                                    onChange={(e) => setFiltrosLocales(prev => ({ ...prev, tipo_propiedad: e.target.value }))}
                                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm hover:border-blue-400 transition-colors"
                                >
                                    <option value="">Todos los tipos</option>
                                    {Object.entries(tiposPropiedad || {}).map(([key, label]) => (
                                        <option key={key} value={key}>{label}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Habitaciones */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Habitaciones</label>
                                <select
                                    value={filtrosLocales.habitaciones}
                                    onChange={(e) => setFiltrosLocales(prev => ({ ...prev, habitaciones: e.target.value }))}
                                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm hover:border-blue-400 transition-colors"
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
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Ordenar por</label>
                                <select
                                    value={filtrosLocales.orden}
                                    onChange={(e) => setFiltrosLocales(prev => ({ ...prev, orden: e.target.value }))}
                                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm hover:border-blue-400 transition-colors"
                                >
                                    <option value="recientes">Más recientes</option>
                                    <option value="precio_asc">Precio: menor a mayor</option>
                                    <option value="precio_desc">Precio: mayor a menor</option>
                                    <option value="habitaciones">Más habitaciones</option>
                                </select>
                            </div>

                            {/* Búsqueda */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Buscar</label>
                                <input
                                    type="text"
                                    value={filtrosLocales.busqueda}
                                    onChange={(e) => setFiltrosLocales(prev => ({ ...prev, busqueda: e.target.value }))}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Código, ubicación..."
                                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm hover:border-blue-400 transition-colors"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={aplicarFiltros}
                                className="inline-flex items-center px-8 py-3 text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                Aplicar Filtros
                            </button>
                        </div>
                    </div>

                    {/* Grid de Departamentos */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {departamentos.data.map((departamento) => (
                            <div key={departamento.id} className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border border-blue-100 transform hover:-translate-y-1">
                                {/* Imagen con overlay */}
                                <div className="relative aspect-w-16 aspect-h-9 bg-gray-200 overflow-hidden">
                                    {departamento.imagenes && departamento.imagenes.length > 0 ? (
                                        <img
                                            src={departamento.imagenes[0].url.startsWith('http') ? departamento.imagenes[0].url : `/storage/${departamento.imagenes[0].url}`}
                                            alt={departamento.titulo || departamento.codigo}
                                            className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-300"
                                        />
                                    ) : (
                                        <div className="w-full h-56 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                                            <svg className="w-16 h-16 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                            </svg>
                                        </div>
                                    )}

                                    {/* Badge de estado */}
                                    <div className="absolute top-4 left-4">
                                        <span className={`px-4 py-1.5 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm ${
                                            departamento.estado === 'disponible' ? 'bg-emerald-500 text-white ring-2 ring-white' :
                                            departamento.estado === 'reservado' ? 'bg-amber-500 text-white ring-2 ring-white' :
                                            'bg-slate-500 text-white ring-2 ring-white'
                                        }`}>
                                            {departamento.estado === 'disponible' ? '✅ Disponible' :
                                             departamento.estado === 'reservado' ? '⏳ Reservado' :
                                             '❌ No disponible'}
                                        </span>
                                    </div>

                                    {/* Código */}
                                    {departamento.codigo && (
                                        <div className="absolute top-4 right-4">
                                            <span className="px-4 py-1.5 bg-white/95 backdrop-blur-sm rounded-full text-xs font-bold text-slate-700 shadow-lg ring-2 ring-white">
                                                {departamento.codigo}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Contenido */}
                                <div className="p-6">
                                    {/* Título y ubicación */}
                                    <div className="mb-4">
                                        <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
                                            {departamento.titulo || departamento.codigo}
                                        </h3>
                                        {departamento.ubicacion && (
                                            <p className="text-sm text-slate-600 flex items-center">
                                                <svg className="w-4 h-4 mr-1.5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                {departamento.ubicacion}
                                            </p>
                                        )}
                                    </div>

                                    {/* Características en grid */}
                                    <div className="grid grid-cols-3 gap-4 mb-5 pb-5 border-b-2 border-slate-100">
                                        {departamento.habitaciones && (
                                            <div className="text-center">
                                                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl mb-2 shadow-sm">
                                                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                                    </svg>
                                                </div>
                                                <p className="text-xs text-slate-500 font-medium mb-0.5">Habitaciones</p>
                                                <p className="text-base font-bold text-slate-900">{departamento.habitaciones}</p>
                                            </div>
                                        )}
                                        {departamento.banos && (
                                            <div className="text-center">
                                                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-xl mb-2 shadow-sm">
                                                    <svg className="w-6 h-6 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                                                    </svg>
                                                </div>
                                                <p className="text-xs text-slate-500 font-medium mb-0.5">Baños</p>
                                                <p className="text-base font-bold text-slate-900">{departamento.banos}</p>
                                            </div>
                                        )}
                                        {departamento.area_total && (
                                            <div className="text-center">
                                                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl mb-2 shadow-sm">
                                                    <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                                                    </svg>
                                                </div>
                                                <p className="text-xs text-slate-500 font-medium mb-0.5">Área</p>
                                                <p className="text-base font-bold text-slate-900">{departamento.area_total}m²</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Precio destacado */}
                                    <div className="mb-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4">
                                        <p className="text-xs text-slate-600 font-semibold mb-1 uppercase tracking-wide">Precio</p>
                                        <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                            {formatCurrency(departamento.precio)}
                                        </p>
                                    </div>

                                    {/* Información del Asesor - Compacta */}
                                    {departamento.asesor && (
                                        <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl p-4 mb-5 border border-blue-100">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-md ring-2 ring-white">
                                                    <span className="text-white font-bold text-sm">
                                                        {departamento.asesor.nombre?.charAt(0) || 'A'}
                                                    </span>
                                                </div>
                                                <div className="ml-3 flex-1 min-w-0">
                                                    <p className="text-xs text-slate-500 font-medium mb-0.5">Asesor</p>
                                                    <p className="text-sm font-bold text-slate-900 truncate">
                                                        {departamento.asesor.nombre}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Acciones */}
                                    <div className="flex gap-3">
                                        <Link
                                            href={`/catalogo/${departamento.id}`}
                                            className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-3 rounded-lg text-sm font-bold text-center transition-all hover:shadow-md border border-slate-200"
                                        >
                                            Ver Detalles
                                        </Link>

                                        {/* Botón de favoritos */}
                                        {auth.user && auth.user.role === 'cliente' ? (
                                            // Cliente autenticado: puede agregar a favoritos
                                            <button
                                                onClick={() => toggleFavorito(departamento.id)}
                                                className={`px-4 py-3 rounded-lg text-sm font-bold border-2 transition-all hover:shadow-md ${
                                                    departamento.es_favorito 
                                                        ? 'bg-rose-50 border-rose-300 hover:bg-rose-100' 
                                                        : 'bg-white border-slate-200 hover:border-indigo-300 hover:bg-indigo-50'
                                                }`}
                                                title={departamento.es_favorito ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                                            >
                                                <svg
                                                    className={`w-6 h-6 ${departamento.es_favorito ? 'text-rose-500 fill-current' : 'text-slate-400'}`}
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
                                                className="px-4 py-3 rounded-lg text-sm font-bold border-2 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all hover:shadow-md group"
                                                title="Regístrate para guardar favoritos"
                                            >
                                                <svg
                                                    className="w-6 h-6 text-slate-400 group-hover:text-indigo-500 transition-colors"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                                </svg>
                                            </Link>
                                        )}

                                        {/* Botón "Solicitar Información" */}
                                        {auth.user && auth.user.role === 'cliente' ? (
                                            // Cliente autenticado: redirige al formulario completo
                                            <Link
                                                href={`/cliente/solicitudes/crear?departamento_id=${departamento.id}`}
                                                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-3 rounded-lg text-sm font-bold transition-all flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                                <span>Solicitar Info</span>
                                            </Link>
                                        ) : (
                                            // Visitante no autenticado: debe registrarse
                                            <Link
                                                href="/register"
                                                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-3 rounded-lg text-sm font-bold transition-all flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                </svg>
                                                <span>Regístrate</span>
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
                        <div className="text-center py-16 bg-white rounded-2xl shadow-lg border border-blue-100">
                            <div className="mx-auto w-28 h-28 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full flex items-center justify-center mb-6 shadow-md">
                                <svg className="w-14 h-14 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-3">🔍 No se encontraron propiedades</h3>
                            <p className="text-slate-600 mb-8 max-w-md mx-auto">
                                Intenta ajustar los filtros o limpia la búsqueda para ver más resultados.
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
