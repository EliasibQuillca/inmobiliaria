import { Head, Link, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import PublicLayout from '@/Layouts/PublicLayout';

export default function CrearSolicitud({ auth, departamentoId, asesores }) {
    const [departamento, setDepartamento] = useState(null);
    const [loading, setLoading] = useState(true);
    const [mostrarAsesores, setMostrarAsesores] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        departamento_id: departamentoId || '',
        tipo_consulta: 'informacion',
        mensaje: '',
        asesor_id: '', // null = auto-asignar
    });

    // Cargar información del departamento si se proporciona ID
    useEffect(() => {
        if (departamentoId) {
            fetch(`/api/v1/catalogo/departamentos/${departamentoId}`, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            })
                .then(res => {
                    if (!res.ok) throw new Error('No se pudo cargar el departamento');
                    return res.json();
                })
                .then(data => {
                    setDepartamento(data.data || data.departamento || data);
                    setLoading(false);
                })
                .catch((error) => {
                    console.error('Error al cargar departamento:', error);
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, [departamentoId]);

    const submit = (e) => {
        e.preventDefault();
        post('/cliente/solicitudes', {
            preserveScroll: true,
            onSuccess: () => {
                reset();
            },
            onError: (errors) => {
                console.error('Errores de validación:', errors);
            }
        });
    };

    const formatPrecio = (precio) => {
        return new Intl.NumberFormat('es-PE', {
            style: 'currency',
            currency: 'PEN',
            minimumFractionDigits: 0,
        }).format(precio);
    };

    return (
        <PublicLayout user={auth.user}>
            <Head title="Nueva Solicitud - Inmobiliaria" />

            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Encabezado */}
                    <div className="mb-8">
                        <Link
                            href="/cliente/dashboard"
                            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Volver
                        </Link>
                        <h1 className="text-4xl font-bold text-gray-900">
                            Solicitar Información
                        </h1>
                        <p className="mt-2 text-gray-600">
                            Completa el formulario y un asesor se pondrá en contacto contigo
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Información del Departamento */}
                        {departamento && (
                            <div className="lg:col-span-1">
                                <div className="bg-white rounded-xl shadow-lg overflow-hidden sticky top-6">
                                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
                                        <h2 className="text-lg font-semibold text-white">
                                            Propiedad Seleccionada
                                        </h2>
                                    </div>
                                    <div className="p-6">
                                        {departamento.imagenes && departamento.imagenes.length > 0 && (
                                            <img
                                                src={`/storage/${departamento.imagenes[0].ruta_imagen}`}
                                                alt={departamento.titulo}
                                                className="w-full h-40 object-cover rounded-lg mb-4"
                                            />
                                        )}
                                        <h3 className="font-bold text-xl text-gray-900 mb-2">
                                            {departamento.titulo}
                                        </h3>
                                        <p className="text-sm text-gray-600 mb-3">
                                            📍 {departamento.direccion}
                                        </p>
                                        <div className="bg-blue-50 rounded-lg p-4">
                                            <p className="text-sm text-gray-600 mb-1">Precio</p>
                                            <p className="text-2xl font-bold text-blue-600">
                                                {formatPrecio(departamento.precio)}
                                            </p>
                                        </div>
                                        <div className="grid grid-cols-3 gap-3 mt-4 text-center">
                                            <div className="bg-gray-50 rounded-lg p-3">
                                                <p className="text-xs text-gray-600">Dorm.</p>
                                                <p className="font-bold text-gray-900">{departamento.num_habitaciones}</p>
                                            </div>
                                            <div className="bg-gray-50 rounded-lg p-3">
                                                <p className="text-xs text-gray-600">Baños</p>
                                                <p className="font-bold text-gray-900">{departamento.num_banos}</p>
                                            </div>
                                            <div className="bg-gray-50 rounded-lg p-3">
                                                <p className="text-xs text-gray-600">m²</p>
                                                <p className="font-bold text-gray-900">{departamento.area}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Formulario de Solicitud */}
                        <div className={departamento ? "lg:col-span-2" : "lg:col-span-3"}>
                            <div className="bg-white rounded-xl shadow-lg p-8">
                                <form onSubmit={submit} className="space-y-6">
                                    {/* Tipo de Consulta */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-3">
                                            ¿Qué tipo de información necesitas? <span className="text-red-500">*</span>
                                        </label>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {[
                                                { value: 'informacion', label: 'Información General', icon: '📋', desc: 'Detalles sobre la propiedad' },
                                                { value: 'visita', label: 'Agendar Visita', icon: '🏠', desc: 'Conocer la propiedad' },
                                                { value: 'financiamiento', label: 'Financiamiento', icon: '💰', desc: 'Opciones de pago' },
                                                { value: 'cotizacion', label: 'Cotización', icon: '📊', desc: 'Presupuesto detallado' },
                                            ].map((tipo) => (
                                                <label
                                                    key={tipo.value}
                                                    className={`relative flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${
                                                        data.tipo_consulta === tipo.value
                                                            ? 'border-blue-600 bg-blue-50'
                                                            : 'border-gray-200 hover:border-blue-300'
                                                    }`}
                                                >
                                                    <input
                                                        type="radio"
                                                        name="tipo_consulta"
                                                        value={tipo.value}
                                                        checked={data.tipo_consulta === tipo.value}
                                                        onChange={(e) => setData('tipo_consulta', e.target.value)}
                                                        className="sr-only"
                                                    />
                                                    <div className="flex-1">
                                                        <div className="flex items-center mb-1">
                                                            <span className="text-2xl mr-2">{tipo.icon}</span>
                                                            <span className="font-semibold text-gray-900">{tipo.label}</span>
                                                        </div>
                                                        <p className="text-xs text-gray-600">{tipo.desc}</p>
                                                    </div>
                                                    {data.tipo_consulta === tipo.value && (
                                                        <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                        </svg>
                                                    )}
                                                </label>
                                            ))}
                                        </div>
                                        {errors.tipo_consulta && (
                                            <p className="mt-2 text-sm text-red-600">{errors.tipo_consulta}</p>
                                        )}
                                    </div>

                                    {/* Mensaje */}
                                    <div>
                                        <label htmlFor="mensaje" className="block text-sm font-medium text-gray-700 mb-2">
                                            Mensaje <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            id="mensaje"
                                            rows="6"
                                            value={data.mensaje}
                                            onChange={(e) => setData('mensaje', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Describe brevemente tu consulta o necesidades..."
                                        ></textarea>
                                        <p className="mt-1 text-xs text-gray-500">
                                            Mínimo 10 caracteres, máximo 1000
                                        </p>
                                        {errors.mensaje && (
                                            <p className="mt-2 text-sm text-red-600">{errors.mensaje}</p>
                                        )}
                                    </div>

                                    {/* Selección de Asesor */}
                                    <div>
                                        <div className="flex items-center justify-between mb-3">
                                            <label className="block text-sm font-medium text-gray-700">
                                                ¿Conoces a un asesor específico?
                                            </label>
                                            <button
                                                type="button"
                                                onClick={() => setMostrarAsesores(!mostrarAsesores)}
                                                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                                            >
                                                {mostrarAsesores ? '✕ Ocultar asesores' : '👥 Ver asesores disponibles'}
                                            </button>
                                        </div>

                                        {mostrarAsesores && asesores && asesores.length > 0 && (
                                            <div className="space-y-3 max-h-96 overflow-y-auto border border-gray-200 rounded-lg p-4 bg-gray-50">
                                                {/* Opción: Auto-asignar */}
                                                <label
                                                    className={`relative flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${
                                                        !data.asesor_id
                                                            ? 'border-purple-600 bg-purple-50'
                                                            : 'border-gray-200 hover:border-purple-300 bg-white'
                                                    }`}
                                                >
                                                    <input
                                                        type="radio"
                                                        name="asesor_id"
                                                        value=""
                                                        checked={!data.asesor_id}
                                                        onChange={() => setData('asesor_id', '')}
                                                        className="sr-only"
                                                    />
                                                    <div className="flex-1">
                                                        <div className="flex items-center mb-1">
                                                            <div className="flex-shrink-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold mr-3">
                                                                🤖
                                                            </div>
                                                            <div>
                                                                <span className="font-bold text-gray-900 text-lg">Auto-asignar</span>
                                                                <p className="text-xs text-gray-600">Sistema inteligente</p>
                                                            </div>
                                                        </div>
                                                        <p className="text-sm text-gray-700 ml-15">
                                                            El sistema asignará automáticamente al asesor con menor carga de trabajo para atenderte más rápido
                                                        </p>
                                                    </div>
                                                    {!data.asesor_id && (
                                                        <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                        </svg>
                                                    )}
                                                </label>

                                                {/* Lista de asesores */}
                                                {asesores.map((asesor) => (
                                                    <label
                                                        key={asesor.id}
                                                        className={`relative flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${
                                                            data.asesor_id === asesor.id
                                                                ? 'border-blue-600 bg-blue-50'
                                                                : 'border-gray-200 hover:border-blue-300 bg-white'
                                                        }`}
                                                    >
                                                        <input
                                                            type="radio"
                                                            name="asesor_id"
                                                            value={asesor.id}
                                                            checked={data.asesor_id === asesor.id}
                                                            onChange={() => setData('asesor_id', asesor.id)}
                                                            className="sr-only"
                                                        />
                                                        <div className="flex-1">
                                                            <div className="flex items-center mb-2">
                                                                <div className="flex-shrink-0 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg mr-3">
                                                                    {asesor.nombre?.charAt(0)}{asesor.apellidos?.charAt(0)}
                                                                </div>
                                                                <div className="flex-1">
                                                                    <span className="font-bold text-gray-900 text-lg">{asesor.nombre_completo}</span>
                                                                    {asesor.especialidad && (
                                                                        <p className="text-xs text-gray-600">🎯 {asesor.especialidad}</p>
                                                                    )}
                                                                </div>
                                                                {/* Badge de disponibilidad */}
                                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                                                    asesor.disponibilidad === 'alta' ? 'bg-green-100 text-green-800' :
                                                                    asesor.disponibilidad === 'media' ? 'bg-yellow-100 text-yellow-800' :
                                                                    'bg-red-100 text-red-800'
                                                                }`}>
                                                                    {asesor.disponibilidad === 'alta' ? '✓ Disponible' :
                                                                     asesor.disponibilidad === 'media' ? '⏳ Ocupado' :
                                                                     '⚠️ Muy ocupado'}
                                                                </span>
                                                            </div>
                                                            <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 ml-15">
                                                                {asesor.email && (
                                                                    <div className="flex items-center">
                                                                        <span className="mr-1">📧</span>
                                                                        <span className="truncate">{asesor.email}</span>
                                                                    </div>
                                                                )}
                                                                {asesor.telefono && (
                                                                    <div className="flex items-center">
                                                                        <span className="mr-1">📱</span>
                                                                        <span>{asesor.telefono}</span>
                                                                    </div>
                                                                )}
                                                                {asesor.experiencia && (
                                                                    <div className="flex items-center col-span-2">
                                                                        <span className="mr-1">⭐</span>
                                                                        <span>{asesor.experiencia}</span>
                                                                    </div>
                                                                )}
                                                                <div className="flex items-center col-span-2">
                                                                    <span className="mr-1">📊</span>
                                                                    <span>{asesor.solicitudes_activas} solicitudes activas</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {data.asesor_id === asesor.id && (
                                                            <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                            </svg>
                                                        )}
                                                    </label>
                                                ))}
                                            </div>
                                        )}

                                        {!mostrarAsesores && (
                                            <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3 border border-gray-200">
                                                💡 <strong>Auto-asignación activada:</strong> El sistema elegirá automáticamente al asesor más disponible para atenderte
                                            </p>
                                        )}
                                    </div>

                                    {/* Información Adicional */}
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                        <div className="flex items-start">
                                            <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                            </svg>
                                            <div className="flex-1">
                                                <h4 className="text-sm font-semibold text-blue-900 mb-1">
                                                    ¿Qué sucede después?
                                                </h4>
                                                <ul className="text-sm text-blue-800 space-y-1">
                                                    <li>✓ Un asesor especializado recibirá tu solicitud</li>
                                                    <li>✓ Te contactaremos en menos de 24 horas</li>
                                                    <li>✓ Recibirás información personalizada</li>
                                                    <li>✓ Podrás hacer seguimiento desde tu panel</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Botones */}
                                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                        <Link
                                            href="/cliente/dashboard"
                                            className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200 text-center font-medium"
                                        >
                                            Cancelar
                                        </Link>
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {processing ? (
                                                <span className="flex items-center justify-center">
                                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Enviando...
                                                </span>
                                            ) : (
                                                '📩 Enviar Solicitud'
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
