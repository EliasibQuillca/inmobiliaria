import { Head, Link, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import axios from 'axios';

export default function AsesorCotizaciones({ auth }) {
    // Estado para el filtro
    const [filtro, setFiltro] = useState('todas');
    const [cotizaciones, setCotizaciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        lastPage: 1,
        total: 0,
        perPage: 10
    });

    useEffect(() => {
        fetchCotizaciones();
    }, [filtro]);

    const fetchCotizaciones = async (page = 1) => {
        setLoading(true);
        try {
            const response = await axios.get(`/api/v1/cotizaciones`, {
                params: {
                    page,
                    estado: filtro !== 'todas' ? filtro : undefined
                }
            });
            setCotizaciones(response.data.data);
            setPagination({
                currentPage: response.data.current_page,
                lastPage: response.data.last_page,
                total: response.data.total,
                perPage: response.data.per_page
            });
        } catch (err) {
            setError('Error al cargar las cotizaciones. Por favor, intente nuevamente.');
            console.error('Error fetching cotizaciones:', err);
        } finally {
            setLoading(false);
        }
    };

    const cambiarEstadoCotizacion = async (id, nuevoEstado) => {
        try {
            await axios.patch(`/api/v1/cotizaciones/${id}/estado`, {
                estado: nuevoEstado
            });
            // Actualizar la lista de cotizaciones
            fetchCotizaciones(pagination.currentPage);
        } catch (err) {
            setError('Error al cambiar el estado de la cotización.');
            console.error('Error changing cotizacion status:', err);
        }
    };

    // Función para formatear moneda
    const formatMoney = (amount) => {
        return new Intl.NumberFormat('es-PE', {
            style: 'currency',
            currency: 'PEN',
            minimumFractionDigits: 0
        }).format(amount);
    };

    // Función para mapear los estados del backend a etiquetas legibles
    const getEstadoLabel = (estado) => {
        const estadoMap = {
            'pendiente': 'Pendiente',
            'aprobada': 'Aprobada',
            'rechazada': 'Rechazada',
            'vencida': 'Vencida'
        };
        return estadoMap[estado] || 'Desconocido';
    };

    // Función para obtener las clases de estilo según el estado
    const getEstadoClasses = (estado) => {
        switch (estado) {
            case 'pendiente':
                return 'bg-blue-100 text-blue-800';
            case 'aprobada':
                return 'bg-green-100 text-green-800';
            case 'rechazada':
                return 'bg-red-100 text-red-800';
            case 'vencida':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <Layout auth={auth}>
            <Head title="Gestión de Cotizaciones - Asesor" />

            <div className="py-12 bg-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Cotizaciones</h2>
                            <p className="mt-1 text-sm text-gray-600">
                                Administre las cotizaciones enviadas a clientes
                            </p>
                        </div>
                        <div className="flex space-x-4">
                            <Link
                                href={route('asesor.cotizaciones.crear')}
                                className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:border-indigo-900 focus:ring ring-indigo-300"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                                </svg>
                                Nueva Cotización
                            </Link>
                            <Link
                                href={route('asesor.dashboard')}
                                className="inline-flex items-center px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm font-medium rounded-md"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Volver al Dashboard
                            </Link>
                        </div>
                    </div>

                    {/* Mensaje de error */}
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                            <p>{error}</p>
                        </div>
                    )}

                    {/* Filtros */}
                    <div className="bg-white shadow rounded-lg p-4 mb-6">
                        <div className="flex flex-wrap items-center gap-4">
                            <div className="font-medium text-gray-700">Filtrar por estado:</div>
                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={() => setFiltro('todas')}
                                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                                        filtro === 'todas'
                                            ? 'bg-indigo-600 text-white'
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                                >
                                    Todas
                                </button>
                                <button
                                    onClick={() => setFiltro('pendiente')}
                                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                                        filtro === 'pendiente'
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                    }`}
                                >
                                    Pendientes
                                </button>
                                <button
                                    onClick={() => setFiltro('aprobada')}
                                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                                        filtro === 'aprobada'
                                            ? 'bg-green-500 text-white'
                                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                                    }`}
                                >
                                    Aprobadas
                                </button>
                                <button
                                    onClick={() => setFiltro('rechazada')}
                                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                                        filtro === 'rechazada'
                                            ? 'bg-red-500 text-white'
                                            : 'bg-red-100 text-red-700 hover:bg-red-200'
                                    }`}
                                >
                                    Rechazadas
                                </button>
                                <button
                                    onClick={() => setFiltro('vencida')}
                                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                                        filtro === 'vencida'
                                            ? 'bg-gray-500 text-white'
                                            : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                                    }`}
                                >
                                    Vencidas
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Tabla de Cotizaciones */}
                    <div className="bg-white overflow-hidden shadow-md rounded-lg">
                        {loading ? (
                            <div className="p-6 text-center">
                                <svg className="animate-spin h-8 w-8 text-indigo-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <p className="mt-2 text-gray-600">Cargando cotizaciones...</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Cliente
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Propiedad
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Precio
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Fecha
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Estado
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Acciones
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {cotizaciones.map((cotizacion) => (
                                            <tr key={cotizacion.id}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {cotizacion.cliente ? cotizacion.cliente.nombre + ' ' + cotizacion.cliente.apellidos : 'Cliente no asignado'}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">
                                                        {cotizacion.departamento ? cotizacion.departamento.nombre : 'Propiedad no disponible'}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900 font-medium">{formatMoney(cotizacion.monto)}</div>
                                                    {cotizacion.descuento > 0 && (
                                                        <div className="text-xs text-green-600">
                                                            Descuento: {formatMoney(cotizacion.descuento)}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">{new Date(cotizacion.created_at).toLocaleDateString()}</div>
                                                    <div className="text-xs text-gray-500">
                                                        Válida hasta: {new Date(cotizacion.fecha_validez).toLocaleDateString()}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEstadoClasses(cotizacion.estado)}`}>
                                                        {getEstadoLabel(cotizacion.estado)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex justify-end space-x-3">
                                                        <Link
                                                            href={route('asesor.cotizaciones.show', cotizacion.id)}
                                                            className="text-indigo-600 hover:text-indigo-900"
                                                        >
                                                            <span className="sr-only">Ver cotización</span>
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                                                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                                            </svg>
                                                        </Link>

                                                        {cotizacion.estado === 'pendiente' && (
                                                            <>
                                                                <button
                                                                    onClick={() => cambiarEstadoCotizacion(cotizacion.id, 'aprobada')}
                                                                    className="text-green-600 hover:text-green-900"
                                                                >
                                                                    <span className="sr-only">Aprobar cotización</span>
                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                                    </svg>
                                                                </button>
                                                                <button
                                                                    onClick={() => cambiarEstadoCotizacion(cotizacion.id, 'rechazada')}
                                                                    className="text-red-600 hover:text-red-900"
                                                                >
                                                                    <span className="sr-only">Rechazar cotización</span>
                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                                    </svg>
                                                                </button>
                                                            </>
                                                        )}

                                                        {cotizacion.estado === 'aprobada' && (
                                                            <Link
                                                                href={route('asesor.reservas.crear', { cotizacion_id: cotizacion.id })}
                                                                className="text-green-600 hover:text-green-900"
                                                            >
                                                                <span className="sr-only">Crear reserva</span>
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                                                </svg>
                                                            </Link>
                                                        )}

                                                        {cotizacion.estado !== 'vencida' && (
                                                            <Link
                                                                href={route('asesor.cotizaciones.edit', cotizacion.id)}
                                                                className="text-yellow-600 hover:text-yellow-900"
                                                            >
                                                                <span className="sr-only">Editar cotización</span>
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                                    <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                                                                    <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                                                                </svg>
                                                            </Link>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {cotizaciones.length === 0 && !loading && (
                                    <div className="px-6 py-4 text-center text-gray-500">
                                        No hay cotizaciones que coincidan con el filtro seleccionado
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Paginación */}
                    {cotizaciones.length > 0 && (
                        <div className="mt-6 flex justify-between items-center">
                            <div className="text-sm text-gray-700">
                                Mostrando <span className="font-medium">{cotizaciones.length}</span> de <span className="font-medium">{pagination.total}</span> cotizaciones
                            </div>
                            <div className="flex justify-center">
                                <nav className="inline-flex rounded-md shadow">
                                    <button
                                        onClick={() => fetchCotizaciones(pagination.currentPage - 1)}
                                        disabled={pagination.currentPage === 1}
                                        className={`py-2 px-4 rounded-l-md border border-gray-300 ${
                                            pagination.currentPage === 1
                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                : 'bg-white text-gray-500 hover:bg-gray-50'
                                        }`}
                                    >
                                        Anterior
                                    </button>

                                    {/* Generamos botones para las páginas */}
                                    {[...Array(pagination.lastPage).keys()].map(page => (
                                        <button
                                            key={page + 1}
                                            onClick={() => fetchCotizaciones(page + 1)}
                                            className={`py-2 px-4 border-t border-b ${
                                                pagination.currentPage === page + 1
                                                    ? 'bg-indigo-600 text-white border-indigo-600'
                                                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                            }`}
                                        >
                                            {page + 1}
                                        </button>
                                    ))}

                                    <button
                                        onClick={() => fetchCotizaciones(pagination.currentPage + 1)}
                                        disabled={pagination.currentPage === pagination.lastPage}
                                        className={`py-2 px-4 rounded-r-md border border-gray-300 ${
                                            pagination.currentPage === pagination.lastPage
                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                : 'bg-white text-gray-500 hover:bg-gray-50'
                                        }`}
                                    >
                                        Siguiente
                                    </button>
                                </nav>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}
