import { Head, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';

export default function Asesores({ auth }) {
    // Estado para asesores
    const [asesores, setAsesores] = useState([]);

    // Estado para carga
    const [loading, setLoading] = useState(true);

    // Filtros
    const [filtros, setFiltros] = useState({
        especialidad: '',
        experiencia: '',
        busqueda: ''
    });

    // Cargar asesores (simulado)
    useEffect(() => {
        // En un caso real, cargaríamos desde una API
        setTimeout(() => {
            setAsesores([
                {
                    id: 1,
                    nombre: 'Carlos Rodríguez',
                    especialidad: 'Departamentos',
                    experiencia: 5,
                    valoracion: 4.8,
                    telefono: '+51 987 654 321',
                    whatsapp: '+51987654321',
                    email: 'carlos.rodriguez@inmobiliaria.com',
                    foto: '/img/asesor1.jpg',
                    descripcion: 'Especialista en departamentos exclusivos con más de 5 años de experiencia en el sector inmobiliario.'
                },
                {
                    id: 2,
                    nombre: 'Ana María López',
                    especialidad: 'Casas',
                    experiencia: 7,
                    valoracion: 4.9,
                    telefono: '+51 987 654 322',
                    whatsapp: '+51987654322',
                    email: 'ana.lopez@inmobiliaria.com',
                    foto: '/img/asesor2.jpg',
                    descripcion: 'Experta en bienes raíces residenciales con un historial comprobado de ventas exitosas.'
                },
                {
                    id: 3,
                    nombre: 'Juan Mendoza',
                    especialidad: 'Departamentos',
                    experiencia: 3,
                    valoracion: 4.5,
                    telefono: '+51 987 654 323',
                    whatsapp: '+51987654323',
                    email: 'juan.mendoza@inmobiliaria.com',
                    foto: '/img/asesor3.jpg',
                    descripcion: 'Asesor dedicado a encontrar el departamento perfecto para cada cliente, con atención personalizada.'
                },
                {
                    id: 4,
                    nombre: 'María Fernández',
                    especialidad: 'Oficinas',
                    experiencia: 8,
                    valoracion: 4.7,
                    telefono: '+51 987 654 324',
                    whatsapp: '+51987654324',
                    email: 'maria.fernandez@inmobiliaria.com',
                    foto: '/img/asesor4.jpg',
                    descripcion: 'Especialista en propiedades comerciales y oficinas con amplio conocimiento del mercado empresarial.'
                },
                {
                    id: 5,
                    nombre: 'Pedro Sánchez',
                    especialidad: 'Terrenos',
                    experiencia: 6,
                    valoracion: 4.6,
                    telefono: '+51 987 654 325',
                    whatsapp: '+51987654325',
                    email: 'pedro.sanchez@inmobiliaria.com',
                    foto: '/img/asesor5.jpg',
                    descripcion: 'Experto en valoración y comercialización de terrenos urbanos y rurales.'
                },
                {
                    id: 6,
                    nombre: 'Lucía Gutiérrez',
                    especialidad: 'Departamentos',
                    experiencia: 4,
                    valoracion: 4.7,
                    telefono: '+51 987 654 326',
                    whatsapp: '+51987654326',
                    email: 'lucia.gutierrez@inmobiliaria.com',
                    foto: '/img/asesor6.jpg',
                    descripcion: 'Asesora comprometida con la satisfacción del cliente, especializada en propiedades residenciales.'
                }
            ]);
            setLoading(false);
        }, 800);
    }, []);

    // Manejar cambios en filtros
    const handleFiltroChange = (e) => {
        const { name, value } = e.target;
        setFiltros(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Filtrar asesores
    const asesoresFiltrados = asesores.filter(asesor => {
        // Filtro por especialidad
        if (filtros.especialidad && asesor.especialidad !== filtros.especialidad) {
            return false;
        }

        // Filtro por experiencia
        if (filtros.experiencia) {
            const experienciaNum = parseInt(filtros.experiencia);
            if (experienciaNum === 5 && asesor.experiencia < 5) {
                return false;
            } else if (experienciaNum === 10 && (asesor.experiencia < 5 || asesor.experiencia >= 10)) {
                return false;
            } else if (experienciaNum === 15 && asesor.experiencia < 10) {
                return false;
            }
        }

        // Filtro por búsqueda
        if (filtros.busqueda) {
            const busquedaLower = filtros.busqueda.toLowerCase();
            return (
                asesor.nombre.toLowerCase().includes(busquedaLower) ||
                asesor.especialidad.toLowerCase().includes(busquedaLower) ||
                asesor.descripcion.toLowerCase().includes(busquedaLower)
            );
        }

        return true;
    });

    // Formatear número para WhatsApp
    const formatWhatsAppNumber = (number) => {
        return number.replace(/\s+/g, '');
    };

    // Generar enlace de WhatsApp
    const getWhatsAppLink = (number, asesor) => {
        const mensaje = encodeURIComponent(`Hola ${asesor}, estoy interesado en conocer más sobre las propiedades disponibles. ¿Podría brindarme información?`);
        return `https://wa.me/${formatWhatsAppNumber(number)}?text=${mensaje}`;
    };

    return (
        <Layout auth={auth}>
            <Head title="Nuestros Asesores - Inmobiliaria" />

            <div className="py-12 bg-gray-100 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-8 flex justify-between items-center">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900">
                                Nuestros Asesores Inmobiliarios
                            </h2>
                            <p className="mt-1 text-lg text-gray-600">
                                Profesionales capacitados para asesorarte en la búsqueda de tu propiedad ideal
                            </p>
                        </div>
                        <Link
                            href="/cliente/dashboard"
                            className="text-blue-600 hover:text-blue-800 flex items-center"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                            </svg>
                            Volver al dashboard
                        </Link>
                    </div>

                    {/* Filtros */}
                    <div className="bg-white shadow-md rounded-lg p-6 mb-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label htmlFor="busqueda" className="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
                                <input
                                    type="text"
                                    id="busqueda"
                                    name="busqueda"
                                    value={filtros.busqueda}
                                    onChange={handleFiltroChange}
                                    placeholder="Nombre, especialidad..."
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label htmlFor="especialidad" className="block text-sm font-medium text-gray-700 mb-1">Especialidad</label>
                                <select
                                    id="especialidad"
                                    name="especialidad"
                                    value={filtros.especialidad}
                                    onChange={handleFiltroChange}
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                >
                                    <option value="">Todas las especialidades</option>
                                    <option value="Departamentos">Departamentos</option>
                                    <option value="Casas">Casas</option>
                                    <option value="Oficinas">Oficinas</option>
                                    <option value="Terrenos">Terrenos</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="experiencia" className="block text-sm font-medium text-gray-700 mb-1">Experiencia</label>
                                <select
                                    id="experiencia"
                                    name="experiencia"
                                    value={filtros.experiencia}
                                    onChange={handleFiltroChange}
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                >
                                    <option value="">Cualquier experiencia</option>
                                    <option value="5">Menos de 5 años</option>
                                    <option value="10">Entre 5 y 10 años</option>
                                    <option value="15">Más de 10 años</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                    ) : asesoresFiltrados.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {asesoresFiltrados.map((asesor) => (
                                <div key={asesor.id} className="bg-white overflow-hidden shadow-md rounded-lg flex flex-col">
                                    <div className="p-6">
                                        <div className="flex items-center mb-4">
                                            <div className="h-16 w-16 rounded-full overflow-hidden mr-4 bg-gray-200 flex-shrink-0">
                                                <img
                                                    src={asesor.foto}
                                                    alt={asesor.nombre}
                                                    className="h-full w-full object-cover"
                                                    onError={(e) => {
                                                        e.target.src = 'https://via.placeholder.com/150';
                                                    }}
                                                />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900">
                                                    {asesor.nombre}
                                                </h3>
                                                <div className="flex items-center">
                                                    <span className="text-sm text-gray-600 mr-3">
                                                        {asesor.especialidad}
                                                    </span>
                                                    <div className="flex items-center">
                                                        <svg className="h-4 w-4 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                        </svg>
                                                        <span className="text-sm text-gray-600 ml-1">
                                                            {asesor.valoracion}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <p className="text-sm text-gray-600 mb-4">
                                            <span className="font-medium">Experiencia: </span>
                                            {asesor.experiencia} años
                                        </p>

                                        <p className="text-sm text-gray-700 mb-6">
                                            {asesor.descripcion}
                                        </p>

                                        <div className="mt-auto">
                                            <div className="grid grid-cols-2 gap-3">
                                                <a
                                                    href={`tel:${asesor.telefono}`}
                                                    className="flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                >
                                                    <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                    </svg>
                                                    Llamar
                                                </a>
                                                <a
                                                    href={getWhatsAppLink(asesor.whatsapp, asesor.nombre)}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                                >
                                                    <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor">
                                                        <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
                                                    </svg>
                                                    WhatsApp
                                                </a>
                                            </div>
                                            <a
                                                href={`mailto:${asesor.email}`}
                                                className="mt-2 flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                            >
                                                <svg className="h-5 w-5 mr-2 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                </svg>
                                                Enviar email
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white overflow-hidden shadow-md rounded-lg p-8 text-center">
                            <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No se encontraron asesores</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                No hay asesores que coincidan con los criterios de búsqueda.
                            </p>
                            <div className="mt-6">
                                <button
                                    onClick={() => setFiltros({ especialidad: '', experiencia: '', busqueda: '' })}
                                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Limpiar filtros
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}
