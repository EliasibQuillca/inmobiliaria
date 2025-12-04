import ClienteLayout from '@/Layouts/ClienteLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import Card from '@/Components/DS/Card';
import Button from '@/Components/DS/Button';
import Badge from '@/Components/DS/Badge';

export default function Asesores({ auth, asesores }) {
    const [asesorSeleccionado, setAsesorSeleccionado] = useState(null);
    const [mostrarModal, setMostrarModal] = useState(false);

    const handleAsignarAsesor = (asesor) => {
        if (confirm(`¿Deseas que ${asesor.nombre} sea tu asesor asignado?`)) {
            router.post(`/cliente/asesores/${asesor.id}/asignar`, {
                _token: document.querySelector('meta[name="csrf-token"]')?.content
            }, {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    setMostrarModal(false);
                },
                onError: (errors) => {
                    console.error('Error al asignar asesor:', errors);
                    alert('Hubo un error al asignar el asesor. Por favor, intenta nuevamente.');
                }
            });
        }
    };

    const handleSolicitarAsesoria = (asesor) => {
        setAsesorSeleccionado(asesor);
        // Redirigir a crear solicitud con el asesor pre-seleccionado
        router.visit(`/cliente/solicitudes/crear?asesor_id=${asesor.id}`);
    };

    return (
        <ClienteLayout>
            <Head title="Nuestros Asesores" />

            {/* Hero Section */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-5xl font-bold mb-4">Nuestros Asesores</h1>
                    <p className="text-xl text-blue-100">
                        Expertos inmobiliarios listos para ayudarte a encontrar tu hogar ideal
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {/* Mensaje de información */}
                <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-12 rounded-r-lg">
                    <div className="flex items-start">
                        <svg className="w-6 h-6 text-blue-500 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                            <h3 className="text-lg font-semibold text-blue-900 mb-1">¿Cómo funciona?</h3>
                            <p className="text-blue-800">
                                Puedes elegir un asesor específico o dejar que el sistema asigne uno automáticamente al crear tu solicitud. 
                                Cada asesor tiene experiencia verificada y está disponible para atenderte.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Grid de Asesores */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {asesores.map((asesor) => (
                        <Card key={asesor.id} className="rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden border border-gray-100">
                            {/* Header con estado */}
                            <div className="relative">
                                <div className="h-32 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
                                <div className="absolute top-4 right-4">
                                    {asesor.es_mi_asesor ? (
                                        <Badge variant="success" className="shadow-lg ring-2 ring-white">
                                            <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            ✓ Asignado
                                        </Badge>
                                    ) : asesor.disponible ? (
                                        <Badge variant="success" className="animate-pulse">
                                            <span className="w-2 h-2 bg-white rounded-full mr-2"></span>
                                            Disponible
                                        </Badge>
                                    ) : (
                                        <Badge variant="secondary">
                                            No disponible
                                        </Badge>
                                    )}
                                </div>
                                {/* Avatar */}
                                <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
                                    <div className="w-24 h-24 rounded-full border-4 border-white bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center shadow-lg">
                                        <span className="text-3xl font-bold text-white">
                                            {asesor.nombre.split(' ').map(n => n[0]).join('').substring(0, 2)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Contenido */}
                            <div className="pt-16 px-6 pb-6">
                                {/* Nombre y Especialidad */}
                                <div className="text-center mb-4">
                                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                                        {asesor.nombre}
                                    </h3>
                                    <p className="text-sm text-indigo-600 font-medium">
                                        {asesor.especialidad}
                                    </p>
                                    {/* Calificación */}
                                    <div className="flex items-center justify-center mt-2">
                                        {[...Array(5)].map((_, i) => (
                                            <svg
                                                key={i}
                                                className={`w-4 h-4 ${i < Math.floor(asesor.calificacion) ? 'text-yellow-400' : 'text-gray-300'}`}
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                        <span className="ml-2 text-sm text-gray-600">
                                            {asesor.calificacion.toFixed(1)}
                                        </span>
                                    </div>
                                </div>

                                {/* Estadísticas */}
                                <div className="grid grid-cols-3 gap-2 mb-6 bg-gray-50 rounded-lg p-4">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-blue-600">
                                            {asesor.total_clientes}
                                        </div>
                                        <div className="text-xs text-gray-600 mt-1">Clientes</div>
                                    </div>
                                    <div className="text-center border-x border-gray-200">
                                        <div className="text-2xl font-bold text-green-600">
                                            {asesor.total_ventas}
                                        </div>
                                        <div className="text-xs text-gray-600 mt-1">Ventas</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-orange-600">
                                            {asesor.anos_experiencia}
                                        </div>
                                        <div className="text-xs text-gray-600 mt-1">Años Exp.</div>
                                    </div>
                                </div>

                                {/* Información de contacto */}
                                <div className="space-y-2 mb-6 text-sm">
                                    <div className="flex items-center text-gray-600">
                                        <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                        <span className="truncate">{asesor.email}</span>
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                        <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                        <span>{asesor.telefono || 'No disponible'}</span>
                                    </div>
                                    {asesor.licencia !== 'N/A' && (
                                        <div className="flex items-center text-gray-600">
                                            <svg className="w-4 h-4 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                            </svg>
                                            <span className="text-xs">Licencia: {asesor.licencia}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Botones de acción */}
                                <div className="space-y-2">
                                    <Button
                                        onClick={() => handleSolicitarAsesoria(asesor)}
                                        variant="primary"
                                        className="w-full justify-center shadow-md hover:shadow-lg"
                                    >
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                        </svg>
                                        Solicitar Asesoría
                                    </Button>
                                    {asesor.es_mi_asesor ? (
                                        <div className="w-full border-2 border-emerald-500 bg-emerald-50 text-emerald-700 font-semibold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2">
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            Tu Asesor Asignado
                                        </div>
                                    ) : (
                                        <Button
                                            onClick={() => handleAsignarAsesor(asesor)}
                                            variant="secondary"
                                            className="w-full justify-center border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50"
                                        >
                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            Asignar como mi asesor
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Sección de ayuda */}
                <div className="mt-16 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 text-center border border-blue-100">
                    <div className="max-w-2xl mx-auto">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">
                            ¿No sabes cuál elegir?
                        </h3>
                        <p className="text-gray-700 mb-6">
                            No te preocupes, puedes crear una solicitud sin elegir asesor y nuestro sistema 
                            asignará automáticamente al mejor asesor disponible según tu consulta.
                        </p>
                        <Button
                            as={Link}
                            href="/cliente/solicitudes/crear"
                            variant="danger"
                            className="inline-flex items-center px-8 py-3 shadow-lg hover:shadow-xl"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                            </svg>
                            Crear Solicitud Ahora
                        </Button>
                    </div>
                </div>
            </div>
        </ClienteLayout>
    );
}
