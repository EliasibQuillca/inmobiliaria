import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import PublicLayout from '../../Layouts/PublicLayout';
import Button from '@/Components/DS/Button';
import Input from '@/Components/DS/Input';
import Badge from '@/Components/DS/Badge';

export default function DetalleDepartamento({
    departamento,
    relacionados,
    auth,
    tiposPropiedad
}) {
    const [imagenActual, setImagenActual] = useState(0);
    const [mostrarModalContacto, setMostrarModalContacto] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        departamento_id: departamento.id,
        nombre: auth.user ? (auth.user.name || '') : '',
        telefono: auth.user ? (auth.user.telefono || '') : '',
        email: auth.user ? (auth.user.email || '') : '',
        mensaje: '',
        crear_cuenta: false,
    });

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('es-PE', {
            style: 'currency',
            currency: 'PEN',
        }).format(amount);
    };

    const siguienteImagen = () => {
        if (departamento.imagenes && departamento.imagenes.length > 0) {
            setImagenActual((prev) => (prev + 1) % departamento.imagenes.length);
        }
    };

    const anteriorImagen = () => {
        if (departamento.imagenes && departamento.imagenes.length > 0) {
            setImagenActual((prev) => (prev - 1 + departamento.imagenes.length) % departamento.imagenes.length);
        }
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
            <Head title={`${departamento.codigo} - Detalle de Propiedad`} />

            <div className="min-h-screen bg-gray-50">
                {/* Breadcrumb */}
                <div className="bg-white border-b">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
                        <nav className="flex" aria-label="Breadcrumb">
                            <ol className="flex items-center space-x-4">
                                <li>
                                    <Link
                                        href="/catalogo"
                                        className="text-gray-400 hover:text-gray-500"
                                    >
                                        Catálogo
                                    </Link>
                                </li>
                                <li className="flex items-center">
                                    <svg className="flex-shrink-0 h-5 w-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                    </svg>
                                    <span className="ml-4 text-gray-500 font-medium">
                                        {departamento.titulo || departamento.codigo}
                                    </span>
                                </li>
                            </ol>
                        </nav>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                        {/* Galería de Imágenes */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                                <div className="relative">
                                    {departamento.imagenes && departamento.imagenes.length > 0 ? (
                                        <>
                                            <div className="aspect-w-16 aspect-h-9">
                                                <img
                                                    src={departamento.imagenes[imagenActual].url.startsWith('http') ?
                                                        departamento.imagenes[imagenActual].url :
                                                        `/storage/${departamento.imagenes[imagenActual].url}`}
                                                    alt={`${departamento.titulo || departamento.codigo} - Imagen ${imagenActual + 1}`}
                                                    className="w-full h-64 sm:h-80 md:h-96 object-cover"
                                                />
                                            </div>

                                            {departamento.imagenes.length > 1 && (
                                                <>
                                                    <button
                                                        onClick={anteriorImagen}
                                                        className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-1.5 sm:p-2 rounded-full transition-all"
                                                    >
                                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={siguienteImagen}
                                                        className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-1.5 sm:p-2 rounded-full transition-all"
                                                    >
                                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                        </svg>
                                                    </button>

                                                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                                                        {departamento.imagenes.map((_, index) => (
                                                            <button
                                                                key={index}
                                                                onClick={() => setImagenActual(index)}
                                                                className={`w-3 h-3 rounded-full ${
                                                                    index === imagenActual ? 'bg-white' : 'bg-white bg-opacity-50'
                                                                }`}
                                                            />
                                                        ))}
                                                    </div>
                                                </>
                                            )}
                                        </>
                                    ) : (
                                        <div className="w-full h-96 bg-gray-300 flex items-center justify-center">
                                            <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                    )}
                                </div>

                                {/* Miniaturas */}
                                {departamento.imagenes && departamento.imagenes.length > 1 && (
                                    <div className="p-4 bg-gray-50">
                                        <div className="flex space-x-2 overflow-x-auto">
                                            {departamento.imagenes.map((imagen, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => setImagenActual(index)}
                                                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                                                        index === imagenActual ? 'border-blue-500' : 'border-gray-200'
                                                    }`}
                                                >
                                                    <img
                                                        src={imagen.url.startsWith('http') ?
                                                            imagen.url :
                                                            `/storage/${imagen.url}`}
                                                        alt={`Miniatura ${index + 1}`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Descripción Detallada */}
                            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mt-4 sm:mt-6">
                                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Descripción</h2>
                                {departamento.descripcion ? (
                                    <p className="text-gray-700 leading-relaxed">
                                        {departamento.descripcion}
                                    </p>
                                ) : (
                                    <p className="text-gray-500 italic">
                                        No hay descripción disponible para esta propiedad.
                                    </p>
                                )}
                            </div>

                            {/* Características Detalladas */}
                            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mt-4 sm:mt-6">
                                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Características</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Código:</span>
                                            <span className="font-medium">{departamento.codigo}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Tipo de Propiedad:</span>
                                            <span className="font-medium">{(tiposPropiedad && tiposPropiedad[departamento.tipo_propiedad]) || departamento.tipo_propiedad}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Habitaciones:</span>
                                            <span className="font-medium">{departamento.habitaciones}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Baños:</span>
                                            <span className="font-medium">{departamento.banos}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Estado:</span>
                                            <Badge variant={
                                                departamento.estado === 'disponible' ? 'success' :
                                                departamento.estado === 'reservado' ? 'warning' :
                                                departamento.estado === 'vendido' ? 'danger' : 'secondary'
                                            }>
                                                {departamento.estado === 'disponible' ? 'Disponible' : departamento.estado}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Área Total:</span>
                                            <span className="font-medium">{departamento.area} m²</span>
                                        </div>
                                        {departamento.estrato && (
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Estrato:</span>
                                                <span className="font-medium">{departamento.estrato}</span>
                                            </div>
                                        )}
                                        {departamento.piso && (
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Piso:</span>
                                                <span className="font-medium">{departamento.piso}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Precio:</span>
                                            <span className="text-xl font-bold text-primary-600">{formatCurrency(departamento.precio)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Ubicación */}
                            {departamento.ubicacion && (
                                <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mt-4 sm:mt-6">
                                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Ubicación</h2>
                                    <p className="text-gray-700">
                                        {departamento.ubicacion}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Sidebar - Información de Contacto */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 sticky top-4 lg:top-8">
                                <div className="text-center mb-6">
                                    <div className="text-3xl font-bold text-primary-600 mb-2">
                                        {formatCurrency(departamento.precio)}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        Código: {departamento.codigo}
                                    </div>
                                </div>

                                {/* Información del Asesor */}
                                {departamento.asesor && (
                                    <div className="border-t border-b py-6 mb-6">
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">Tu Asesor</h3>
                                        <div className="flex items-center space-x-4">
                                            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                                                <span className="text-primary-600 font-medium">
                                                    {departamento.asesor.nombre.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900">
                                                    {departamento.asesor.nombre}
                                                </div>
                                                {departamento.asesor.usuario && (
                                                    <div className="text-sm text-gray-500">
                                                        📞 {departamento.asesor.usuario.telefono || departamento.asesor.telefono}
                                                    </div>
                                                )}
                                                {departamento.asesor.usuario && departamento.asesor.usuario.email && (
                                                    <div className="text-sm text-gray-500">
                                                        ✉️ {departamento.asesor.usuario.email}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Botones de Acción */}
                                <div className="space-y-3">
                                    {auth.user ? (
                                        // Usuario autenticado - redirige a crear solicitud
                                        <Button
                                            href={`/cliente/solicitudes/crear?departamento_id=${departamento.id}`}
                                            variant="primary"
                                            className="w-full justify-center py-3"
                                        >
                                            Me Interesa Esta Propiedad
                                        </Button>
                                    ) : (
                                        // Usuario no autenticado - muestra modal de contacto
                                        <Button
                                            onClick={() => setMostrarModalContacto(true)}
                                            variant="primary"
                                            className="w-full justify-center py-3"
                                        >
                                            Me Interesa Esta Propiedad
                                        </Button>
                                    )}

                                    {departamento.asesor && departamento.asesor.usuario && departamento.asesor.usuario.telefono && (
                                        <a
                                            href={`https://wa.me/57${departamento.asesor.usuario.telefono.replace(/\D/g, '')}?text=Hola, me interesa la propiedad ${departamento.codigo}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg text-center block"
                                        >
                                            💬 WhatsApp
                                        </a>
                                    )}

                                    {departamento.asesor && departamento.asesor.usuario && departamento.asesor.usuario.telefono && (
                                        <a
                                            href={`tel:${departamento.asesor.usuario.telefono}`}
                                            className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-4 rounded-lg text-center block"
                                        >
                                            📞 Llamar Ahora
                                        </a>
                                    )}
                                </div>

                                {/* Resumen Rápido */}
                                <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t">
                                    <h4 className="font-medium text-gray-900 mb-2 sm:mb-3">Resumen</h4>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">🏠 Habitaciones:</span>
                                            <span>{departamento.habitaciones}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">🚿 Baños:</span>
                                            <span>{departamento.banos}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">📐 Área:</span>
                                            <span>{departamento.area} m²</span>
                                        </div>
                                        {departamento.estrato && (
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">🏢 Estrato:</span>
                                                <span>{departamento.estrato}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Propiedades Relacionadas */}
                    {relacionados && relacionados.length > 0 && (
                        <div className="mt-8 sm:mt-12">
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8">Propiedades Similares</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                                {relacionados.map((relacionado) => (
                                    <div key={relacionado.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                                        <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                                            {relacionado.imagenes && relacionado.imagenes.length > 0 ? (
                                                <img
                                                    src={`/storage/${relacionado.imagenes[0].ruta}`}
                                                    alt={relacionado.codigo}
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

                                        <div className="p-4 sm:p-6">
                                            <div className="flex justify-between items-start mb-4">
                                                <h3 className="text-lg font-semibold text-gray-900">
                                                    {relacionado.codigo}
                                                </h3>
                                                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                                                    Disponible
                                                </span>
                                            </div>

                                            <div className="space-y-2 mb-4">
                                                <p className="text-sm text-gray-600">
                                                    <span className="font-medium">Habitaciones:</span> {relacionado.habitaciones}
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    <span className="font-medium">Área:</span> {relacionado.area} m²
                                                </p>
                                                <p className="text-lg font-bold text-primary-600">
                                                    {formatCurrency(relacionado.precio)}
                                                </p>
                                            </div>

                                            <Button
                                                href={`/catalogo/${relacionado.id}`}
                                                variant="secondary"
                                                className="w-full justify-center"
                                            >
                                                Ver Detalles
                                            </Button>
                                        </div>
                                    </div>
                                ))}
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
                                        Solicitar Información - {departamento.codigo}
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
                                            <Input
                                                type="text"
                                                value={data.nombre}
                                                onChange={(e) => setData('nombre', e.target.value)}
                                                className="w-full"
                                                required
                                                disabled={auth.user}
                                            />
                                            {errors.nombre && <p className="text-red-600 text-sm mt-1">{errors.nombre}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Teléfono *
                                            </label>
                                            <Input
                                                type="tel"
                                                value={data.telefono}
                                                onChange={(e) => setData('telefono', e.target.value)}
                                                className="w-full"
                                                required
                                            />
                                            {errors.telefono && <p className="text-red-600 text-sm mt-1">{errors.telefono}</p>}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email (Opcional)
                                        </label>
                                        <Input
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            className="w-full"
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
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
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
                                                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                                            />
                                            <label htmlFor="crear_cuenta" className="ml-2 block text-sm text-gray-700">
                                                Crear cuenta para futuras consultas (Password: 123456)
                                            </label>
                                        </div>
                                    )}

                                    <div className="flex justify-end space-x-3 mt-6">
                                        <Button
                                            variant="secondary"
                                            onClick={() => setMostrarModalContacto(false)}
                                        >
                                            Cancelar
                                        </Button>
                                        <Button
                                            type="submit"
                                            variant="primary"
                                            disabled={processing}
                                        >
                                            {processing ? 'Enviando...' : 'Enviar Solicitud'}
                                        </Button>
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
