import { Head, Link, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import ClienteLayout from '@/Layouts/ClienteLayout';
import Card from '@/Components/DS/Card';
import Button from '@/Components/DS/Button';
import Badge from '@/Components/DS/Badge';
import Input from '@/Components/DS/Input';

export default function CrearSolicitud({ auth, departamentoId, departamentos, asesores }) {
    const [departamento, setDepartamento] = useState(null);
    const [loading, setLoading] = useState(true);
    const [mostrarAsesores, setMostrarAsesores] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        departamento_id: departamentoId || '',
        tipo_consulta: 'informacion',
        telefono: '',
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

    // Cargar departamento cuando se selecciona del dropdown
    const handleSelectDepartamento = (deptId) => {
        if (!deptId) {
            setData('departamento_id', '');
            setDepartamento(null);
            return;
        }

        setData('departamento_id', deptId);

        // Cargar información completa del departamento
        fetch(`/api/v1/catalogo/departamentos/${deptId}`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        })
            .then(res => res.json())
            .then(data => {
                setDepartamento(data.data || data.departamento || data);
            })
            .catch((error) => {
                console.error('Error al cargar departamento:', error);
            });
    };

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
        <ClienteLayout>
            <Head title="Nueva Solicitud - Inmobiliaria Imperial Cusco" />

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
                                <Card className="rounded-xl shadow-lg overflow-hidden sticky top-6">
                                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
                                        <h2 className="text-lg font-semibold text-white">
                                            Propiedad Seleccionada
                                        </h2>
                                    </div>
                                    <div className="p-6">
                                        {departamento.imagenes && departamento.imagenes.length > 0 && (
                                            <img
                                                src={departamento.imagenes[0].url.startsWith('http')
                                                    ? departamento.imagenes[0].url
                                                    : `/storage/${departamento.imagenes[0].url}`
                                                }
                                                alt={departamento.titulo}
                                                className="w-full h-40 object-cover rounded-lg mb-4"
                                            />
                                        )}
                                        <h3 className="font-bold text-xl text-gray-900 mb-2">
                                            {departamento.titulo}
                                        </h3>
                                        <p className="text-sm text-gray-600 mb-3">
                                            📍 {departamento.ubicacion}
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
                                                <p className="font-bold text-gray-900">{departamento.habitaciones}</p>
                                            </div>
                                            <div className="bg-gray-50 rounded-lg p-3">
                                                <p className="text-xs text-gray-600">Baños</p>
                                                <p className="font-bold text-gray-900">{departamento.banos}</p>
                                            </div>
                                            <div className="bg-gray-50 rounded-lg p-3">
                                                <p className="text-xs text-gray-600">m²</p>
                                                <p className="font-bold text-gray-900">{departamento.area}</p>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        )}

                        {/* Formulario de Solicitud */}
                        <div className={departamento ? "lg:col-span-2" : "lg:col-span-3"}>
                            <Card className="rounded-xl shadow-lg p-8">
                                <form onSubmit={submit} className="space-y-6">
                                    {/* Selector de Departamento (solo si NO viene pre-seleccionado) */}
                                    {!departamentoId && (
                                        <div>
                                            <Input
                                                label="Selecciona el Departamento"
                                                as="select"
                                                value={data.departamento_id}
                                                onChange={(e) => handleSelectDepartamento(e.target.value)}
                                                required
                                                error={errors.departamento_id}
                                            >
                                                <option value="">-- Selecciona un departamento --</option>
                                                {departamentos?.map((dept) => (
                                                    <option key={dept.id} value={dept.id}>
                                                        {dept.codigo} - {dept.titulo}
                                                    </option>
                                                ))}
                                            </Input>

                                            {/* Vista previa del departamento seleccionado */}
                                            {data.departamento_id && departamentos && (
                                                <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-l-4 border-blue-600 rounded-lg shadow-sm">
                                                    {(() => {
                                                        const deptSeleccionado = departamentos.find(d => d.id == data.departamento_id);
                                                        return deptSeleccionado ? (
                                                            <div>
                                                                <div className="flex items-start justify-between mb-3">
                                                                    <div className="flex-1">
                                                                        <h4 className="text-lg font-bold text-gray-900">
                                                                            {deptSeleccionado.codigo}
                                                                        </h4>
                                                                        <p className="text-sm text-gray-700 mt-1">
                                                                            {deptSeleccionado.titulo}
                                                                        </p>
                                                                        <p className="text-sm text-gray-600 mt-1 flex items-center">
                                                                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                                                            </svg>
                                                                            {deptSeleccionado.ubicacion}
                                                                        </p>
                                                                    </div>
                                                                    <div className="text-right ml-4">
                                                                        <p className="text-2xl font-bold text-blue-600">
                                                                            {formatPrecio(deptSeleccionado.precio)}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                                <div className="grid grid-cols-3 gap-3 pt-3 border-t border-blue-200">
                                                                    <div className="text-center bg-white rounded-lg p-2">
                                                                        <p className="text-xs text-gray-600">Dormitorios</p>
                                                                        <p className="text-lg font-bold text-gray-900">{deptSeleccionado.habitaciones}</p>
                                                                    </div>
                                                                    <div className="text-center bg-white rounded-lg p-2">
                                                                        <p className="text-xs text-gray-600">Baños</p>
                                                                        <p className="text-lg font-bold text-gray-900">{deptSeleccionado.banos}</p>
                                                                    </div>
                                                                    <div className="text-center bg-white rounded-lg p-2">
                                                                        <p className="text-xs text-gray-600">Área</p>
                                                                        <p className="text-lg font-bold text-gray-900">{deptSeleccionado.area}m²</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ) : null;
                                                    })()}
                                                </div>
                                            )}
                                        </div>
                                    )}

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
                                            Mensaje (Opcional)
                                        </label>
                                        <textarea
                                            id="mensaje"
                                            rows="4"
                                            value={data.mensaje}
                                            onChange={(e) => setData('mensaje', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Describe brevemente tu consulta o necesidades... (opcional)"
                                        ></textarea>
                                        <p className="mt-1 text-xs text-gray-500">
                                            Máximo 1000 caracteres
                                        </p>
                                        {errors.mensaje && (
                                            <p className="mt-2 text-sm text-red-600">{errors.mensaje}</p>
                                        )}
                                    </div>

                                    {/* Número de Teléfono */}
                                    <div>
                                        <Input
                                            label="Número de Celular"
                                            type="tel"
                                            id="telefono"
                                            value={data.telefono}
                                            onChange={(e) => setData('telefono', e.target.value)}
                                            placeholder="Ej: 987654321"
                                            maxLength="15"
                                            required
                                            error={errors.telefono}
                                        />
                                        <p className="mt-1 text-xs text-gray-500">
                                            Ingresa tu número de celular para que el asesor pueda contactarte
                                        </p>
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
                                                                <Badge
                                                                    variant={
                                                                        asesor.disponibilidad === 'alta' ? 'success' :
                                                                        asesor.disponibilidad === 'media' ? 'warning' :
                                                                        'danger'
                                                                    }
                                                                >
                                                                    {asesor.disponibilidad === 'alta' ? '✓ Disponible' :
                                                                     asesor.disponibilidad === 'media' ? '⏳ Ocupado' :
                                                                     '⚠️ Muy ocupado'}
                                                                </Badge>
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
                                        <Button
                                            as={Link}
                                            href="/cliente/dashboard"
                                            variant="secondary"
                                            className="flex-1 justify-center"
                                        >
                                            Cancelar
                                        </Button>
                                        <Button
                                            type="submit"
                                            disabled={processing}
                                            variant="primary"
                                            className="flex-1 justify-center"
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
                                        </Button>
                                    </div>
                                </form>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </ClienteLayout>
    );
}
