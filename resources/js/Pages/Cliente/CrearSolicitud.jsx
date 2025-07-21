import { Head, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';

export default function CrearSolicitud({ auth, departamentoId = null }) {
    // Estado para el formulario
    const [formData, setFormData] = useState({
        departamento_id: departamentoId || '',
        tipo_solicitud: 'informacion',
        mensaje: '',
        telefono: auth?.user?.telefono || '',
        disponibilidad: [],
        preferencia_contacto: 'email',
    });

    // Estado para los departamentos
    const [departamentos, setDepartamentos] = useState([
        {
            id: 1,
            nombre: 'Departamento Magisterio 101',
            ubicacion: 'Calle Magisterio 123, Sector A',
            precio: 120000,
        },
        {
            id: 2,
            nombre: 'Departamento Magisterio 202',
            ubicacion: 'Calle Magisterio 123, Sector A',
            precio: 150000,
        },
        {
            id: 3,
            nombre: 'Departamento Lima 305',
            ubicacion: 'Av. Lima 305, Sector B',
            precio: 180000,
        },
        {
            id: 4,
            nombre: 'Departamento Arequipa 401',
            ubicacion: 'Av. Arequipa 401, Sector C',
            precio: 130000,
        },
        {
            id: 5,
            nombre: 'Departamento Cusco 205',
            ubicacion: 'Calle Cusco 205, Sector D',
            precio: 165000,
        },
    ]);

    // Estado para errores
    const [errors, setErrors] = useState({});

    // Estado para indicar si el formulario fue enviado
    const [formSubmitted, setFormSubmitted] = useState(false);

    // Manejar cambios en los campos del formulario
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });

        // Limpiar error cuando el usuario corrige
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: null,
            });
        }
    };

    // Manejar cambios en las casillas de verificación de disponibilidad
    const handleDisponibilidadChange = (e) => {
        const { value, checked } = e.target;

        if (checked) {
            setFormData({
                ...formData,
                disponibilidad: [...formData.disponibilidad, value],
            });
        } else {
            setFormData({
                ...formData,
                disponibilidad: formData.disponibilidad.filter(item => item !== value),
            });
        }
    };

    // Manejar envío del formulario
    const handleSubmit = (e) => {
        e.preventDefault();

        // Validación simple
        const newErrors = {};

        if (!formData.departamento_id) {
            newErrors.departamento_id = 'Debes seleccionar un departamento';
        }

        if (!formData.mensaje.trim()) {
            newErrors.mensaje = 'El mensaje es obligatorio';
        } else if (formData.mensaje.length < 10) {
            newErrors.mensaje = 'El mensaje debe tener al menos 10 caracteres';
        }

        if (!formData.telefono.trim()) {
            newErrors.telefono = 'El teléfono es obligatorio';
        }

        if (formData.disponibilidad.length === 0) {
            newErrors.disponibilidad = 'Selecciona al menos un horario de disponibilidad';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // Aquí iría la lógica para enviar los datos al servidor
        console.log('Enviando datos:', formData);

        // Simulación de respuesta exitosa
        setFormSubmitted(true);
    };

    // Formatear precio
    const formatPrecio = (precio) => {
        return precio.toLocaleString('es-ES', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        });
    };

    // Si el formulario fue enviado con éxito, mostrar mensaje de confirmación
    if (formSubmitted) {
        return (
            <Layout auth={auth}>
                <Head title="Solicitud Enviada - Inmobiliaria" />

                <div className="py-12 bg-gray-100">
                    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="bg-white shadow-md rounded-lg p-8 text-center">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                                <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="mt-4 text-lg font-medium text-gray-900">¡Solicitud enviada con éxito!</h3>
                            <p className="mt-2 text-sm text-gray-500">
                                Gracias por tu interés. Uno de nuestros asesores se pondrá en contacto contigo lo antes posible.
                            </p>
                            <div className="mt-6 flex justify-center space-x-4">
                                <Link
                                    href="/cliente/solicitudes"
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Ver mis solicitudes
                                </Link>
                                <Link
                                    href="/cliente/dashboard"
                                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Ir al dashboard
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout auth={auth}>
            <Head title="Nueva Solicitud - Inmobiliaria" />

            <div className="py-12 bg-gray-100">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">
                                    Nueva Solicitud de Información
                                </h2>
                                <Link
                                    href="/cliente/solicitudes"
                                    className="px-4 py-2 bg-gray-200 border border-transparent rounded-md font-semibold text-gray-700 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                                >
                                    Volver a Solicitudes
                                </Link>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Selección de Departamento */}
                                <div className="bg-gray-50 p-4 rounded-md mb-6">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Departamento de Interés</h3>
                                    <div>
                                        <label htmlFor="departamento_id" className="block text-sm font-medium text-gray-700 mb-1">
                                            Selecciona un departamento *
                                        </label>
                                        <select
                                            id="departamento_id"
                                            name="departamento_id"
                                            value={formData.departamento_id}
                                            onChange={handleChange}
                                            className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${errors.departamento_id ? 'border-red-500' : ''}`}
                                        >
                                            <option value="">-- Seleccionar departamento --</option>
                                            {departamentos.map(depto => (
                                                <option key={depto.id} value={depto.id}>
                                                    {depto.nombre} - {depto.ubicacion} ({formatPrecio(depto.precio)})
                                                </option>
                                            ))}
                                        </select>
                                        {errors.departamento_id && (
                                            <p className="mt-1 text-sm text-red-600">{errors.departamento_id}</p>
                                        )}
                                        <div className="mt-2 text-sm text-gray-500">
                                            <Link href="/properties" className="text-blue-600 hover:text-blue-800">
                                                Explorar catálogo de departamentos
                                            </Link>
                                        </div>
                                    </div>
                                </div>

                                {/* Tipo de Solicitud */}
                                <div>
                                    <label htmlFor="tipo_solicitud" className="block text-sm font-medium text-gray-700 mb-1">
                                        ¿Qué tipo de información necesitas? *
                                    </label>
                                    <select
                                        id="tipo_solicitud"
                                        name="tipo_solicitud"
                                        value={formData.tipo_solicitud}
                                        onChange={handleChange}
                                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                    >
                                        <option value="informacion">Información general</option>
                                        <option value="visita">Programar una visita</option>
                                        <option value="financiamiento">Opciones de financiamiento</option>
                                        <option value="cotizacion">Solicitar cotización</option>
                                    </select>
                                </div>

                                {/* Mensaje */}
                                <div>
                                    <label htmlFor="mensaje" className="block text-sm font-medium text-gray-700 mb-1">
                                        Mensaje *
                                    </label>
                                    <textarea
                                        id="mensaje"
                                        name="mensaje"
                                        rows="4"
                                        value={formData.mensaje}
                                        onChange={handleChange}
                                        placeholder="Describe lo que te interesa saber sobre este departamento..."
                                        className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${errors.mensaje ? 'border-red-500' : ''}`}
                                    ></textarea>
                                    {errors.mensaje && (
                                        <p className="mt-1 text-sm text-red-600">{errors.mensaje}</p>
                                    )}
                                </div>

                                {/* Información de Contacto */}
                                <div className="bg-gray-50 p-4 rounded-md">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Información de Contacto</h3>

                                    <div className="mb-4">
                                        <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-1">
                                            Teléfono de contacto *
                                        </label>
                                        <input
                                            type="tel"
                                            id="telefono"
                                            name="telefono"
                                            value={formData.telefono}
                                            onChange={handleChange}
                                            className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${errors.telefono ? 'border-red-500' : ''}`}
                                        />
                                        {errors.telefono && (
                                            <p className="mt-1 text-sm text-red-600">{errors.telefono}</p>
                                        )}
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Disponibilidad para contacto *
                                        </label>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="flex items-start">
                                                <div className="flex items-center h-5">
                                                    <input
                                                        id="manana"
                                                        name="disponibilidad"
                                                        type="checkbox"
                                                        value="manana"
                                                        checked={formData.disponibilidad.includes('manana')}
                                                        onChange={handleDisponibilidadChange}
                                                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                                                    />
                                                </div>
                                                <div className="ml-3 text-sm">
                                                    <label htmlFor="manana" className="font-medium text-gray-700">Mañana (8:00 - 12:00)</label>
                                                </div>
                                            </div>
                                            <div className="flex items-start">
                                                <div className="flex items-center h-5">
                                                    <input
                                                        id="tarde"
                                                        name="disponibilidad"
                                                        type="checkbox"
                                                        value="tarde"
                                                        checked={formData.disponibilidad.includes('tarde')}
                                                        onChange={handleDisponibilidadChange}
                                                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                                                    />
                                                </div>
                                                <div className="ml-3 text-sm">
                                                    <label htmlFor="tarde" className="font-medium text-gray-700">Tarde (12:00 - 18:00)</label>
                                                </div>
                                            </div>
                                            <div className="flex items-start">
                                                <div className="flex items-center h-5">
                                                    <input
                                                        id="noche"
                                                        name="disponibilidad"
                                                        type="checkbox"
                                                        value="noche"
                                                        checked={formData.disponibilidad.includes('noche')}
                                                        onChange={handleDisponibilidadChange}
                                                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                                                    />
                                                </div>
                                                <div className="ml-3 text-sm">
                                                    <label htmlFor="noche" className="font-medium text-gray-700">Noche (18:00 - 20:00)</label>
                                                </div>
                                            </div>
                                            <div className="flex items-start">
                                                <div className="flex items-center h-5">
                                                    <input
                                                        id="finde"
                                                        name="disponibilidad"
                                                        type="checkbox"
                                                        value="finde"
                                                        checked={formData.disponibilidad.includes('finde')}
                                                        onChange={handleDisponibilidadChange}
                                                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                                                    />
                                                </div>
                                                <div className="ml-3 text-sm">
                                                    <label htmlFor="finde" className="font-medium text-gray-700">Fin de semana</label>
                                                </div>
                                            </div>
                                        </div>
                                        {errors.disponibilidad && (
                                            <p className="mt-1 text-sm text-red-600">{errors.disponibilidad}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Preferencia de contacto
                                        </label>
                                        <div className="flex space-x-4">
                                            <div className="flex items-center">
                                                <input
                                                    id="email"
                                                    name="preferencia_contacto"
                                                    type="radio"
                                                    value="email"
                                                    checked={formData.preferencia_contacto === 'email'}
                                                    onChange={handleChange}
                                                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                                                />
                                                <label htmlFor="email" className="ml-2 block text-sm text-gray-700">
                                                    Email
                                                </label>
                                            </div>
                                            <div className="flex items-center">
                                                <input
                                                    id="telefono-pref"
                                                    name="preferencia_contacto"
                                                    type="radio"
                                                    value="telefono"
                                                    checked={formData.preferencia_contacto === 'telefono'}
                                                    onChange={handleChange}
                                                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                                                />
                                                <label htmlFor="telefono-pref" className="ml-2 block text-sm text-gray-700">
                                                    Teléfono
                                                </label>
                                            </div>
                                            <div className="flex items-center">
                                                <input
                                                    id="whatsapp"
                                                    name="preferencia_contacto"
                                                    type="radio"
                                                    value="whatsapp"
                                                    checked={formData.preferencia_contacto === 'whatsapp'}
                                                    onChange={handleChange}
                                                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                                                />
                                                <label htmlFor="whatsapp" className="ml-2 block text-sm text-gray-700">
                                                    WhatsApp
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-end space-x-3">
                                    <Link
                                        href="/cliente/dashboard"
                                        className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                        Cancelar
                                    </Link>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                        Enviar Solicitud
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
