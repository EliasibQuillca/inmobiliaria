import React, { useState, useEffect } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { usePage } from '@inertiajs/react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Componente de alerta para mensajes flash
const FlashMessage = ({ message, type }) => {
    if (!message) return null;

    const bgColor = type === 'success' ? 'bg-green-100 border-green-500 text-green-700'
        : type === 'error' ? 'bg-red-100 border-red-500 text-red-700'
            : 'bg-blue-100 border-blue-500 text-blue-700';

    return (
        <div className={`p-4 mb-4 rounded-lg border ${bgColor}`}>
            {message}
        </div>
    );
};

// Componente para edición rápida en modal
const FormularioEdicionRapida = ({ departamento, propietarios, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        titulo: departamento.titulo || '',
        descripcion: departamento.descripcion || '',
        ubicacion: departamento.ubicacion || '',
        direccion: departamento.direccion || '',
        precio: departamento.precio || '',
        habitaciones: departamento.habitaciones || 1,
        banos: departamento.banos || 1,
        area: departamento.area || '',
        piso: departamento.piso || 1,
        año_construccion: departamento.año_construccion || new Date().getFullYear(),
        estacionamientos: departamento.estacionamientos || 0,
        propietario_id: departamento.propietario_id || '',
        estado: departamento.estado || 'disponible',
        destacado: departamento.destacado || false,
        // Campos opcionales con valor por defecto
        garage: departamento.garage || false,
        balcon: departamento.balcon || false,
        amueblado: departamento.amueblado || false,
        mascotas_permitidas: departamento.mascotas_permitidas || false,
        gastos_comunes: departamento.gastos_comunes || 0,
        // Campos de imágenes
        imagen_principal: '',
        imagen_galeria_1: '',
        imagen_galeria_2: '',
        imagen_galeria_3: '',
        imagen_galeria_4: '',
        imagen_galeria_5: ''
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Título y Ubicación */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Título</label>
                    <input
                        type="text"
                        name="titulo"
                        value={formData.titulo}
                        onChange={handleChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Ubicación</label>
                    <input
                        type="text"
                        name="ubicacion"
                        value={formData.ubicacion}
                        onChange={handleChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Descripción</label>
                    <textarea
                        name="descripcion"
                        value={formData.descripcion}
                        onChange={handleChange}
                        rows={3}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Precio (S/)</label>
                    <input
                        type="number"
                        name="precio"
                        value={formData.precio}
                        onChange={handleChange}
                        step="0.01"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Área Total (m²)</label>
                    <input
                        type="number"
                        name="area"
                        value={formData.area}
                        onChange={handleChange}
                        step="0.01"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Habitaciones</label>
                    <select
                        name="habitaciones"
                        value={formData.habitaciones}
                        onChange={handleChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                        {[1, 2, 3, 4, 5, 6].map(num => (
                            <option key={num} value={num}>{num}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Baños</label>
                    <select
                        name="banos"
                        value={formData.banos}
                        onChange={handleChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                        {[1, 2, 3, 4, 5, 6].map(num => (
                            <option key={num} value={num}>{num}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Piso</label>
                    <select
                        name="piso"
                        value={formData.piso}
                        onChange={handleChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        required
                    >
                        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map(num => (
                            <option key={num} value={num}>{num === 0 ? 'Planta baja' : num}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Año de Construcción</label>
                    <input
                        type="number"
                        name="año_construccion"
                        value={formData.año_construccion}
                        onChange={handleChange}
                        min="1900"
                        max="2100"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Estacionamientos</label>
                    <select
                        name="estacionamientos"
                        value={formData.estacionamientos}
                        onChange={handleChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                        {[0, 1, 2, 3, 4].map(num => (
                            <option key={num} value={num}>{num}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Estado</label>
                    <select
                        name="estado"
                        value={formData.estado}
                        onChange={handleChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="disponible">Disponible</option>
                        <option value="reservado">Reservado</option>
                        <option value="vendido">Vendido</option>
                        <option value="inactivo">Inactivo</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Propietario</label>
                    <select
                        name="propietario_id"
                        value={formData.propietario_id}
                        onChange={handleChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        required
                    >
                        <option value="">Seleccionar propietario...</option>
                        {propietarios.map(propietario => (
                            <option key={propietario.id} value={propietario.id}>
                                {propietario.nombre} - {propietario.dni || propietario.telefono}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="md:col-span-2">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Características</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                name="garage"
                                checked={formData.garage}
                                onChange={handleChange}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label className="ml-2 block text-sm text-gray-900">Garage</label>
                        </div>
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                name="balcon"
                                checked={formData.balcon}
                                onChange={handleChange}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label className="ml-2 block text-sm text-gray-900">Balcón</label>
                        </div>
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                name="amueblado"
                                checked={formData.amueblado}
                                onChange={handleChange}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label className="ml-2 block text-sm text-gray-900">Amueblado</label>
                        </div>
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                name="mascotas_permitidas"
                                checked={formData.mascotas_permitidas}
                                onChange={handleChange}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label className="ml-2 block text-sm text-gray-900">Mascotas permitidas</label>
                        </div>
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                name="destacado"
                                checked={formData.destacado}
                                onChange={handleChange}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label className="ml-2 block text-sm text-gray-900">Destacado</label>
                        </div>
                        <div className="col-span-1 md:col-span-3">
                            <label className="block text-sm font-medium text-gray-700">Gastos Comunes (S/)</label>
                            <input
                                type="number"
                                name="gastos_comunes"
                                value={formData.gastos_comunes}
                                onChange={handleChange}
                                step="0.01"
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>
                </div>

                <div className="md:col-span-2">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Imágenes del Departamento</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Imagen Principal (URL)</label>
                            <input
                                type="url"
                                name="imagen_principal"
                                value={formData.imagen_principal}
                                onChange={handleChange}
                                placeholder="https://ejemplo.com/imagen-principal.jpg"
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                            {formData.imagen_principal && (
                                <img
                                    src={formData.imagen_principal}
                                    alt="Imagen principal"
                                    className="mt-2 w-full h-24 object-cover rounded border"
                                    onError={(e) => e.target.style.display = "none"}
                                />
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Galería Imagen 1 (URL)</label>
                            <input
                                type="url"
                                name="imagen_galeria_1"
                                value={formData.imagen_galeria_1}
                                onChange={handleChange}
                                placeholder="https://ejemplo.com/galeria-1.jpg"
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                            {formData.imagen_galeria_1 && (
                                <img
                                    src={formData.imagen_galeria_1}
                                    alt="Galería 1"
                                    className="mt-2 w-full h-24 object-cover rounded border"
                                    onError={(e) => e.target.style.display = "none"}
                                />
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Galería Imagen 2 (URL)</label>
                            <input
                                type="url"
                                name="imagen_galeria_2"
                                value={formData.imagen_galeria_2}
                                onChange={handleChange}
                                placeholder="https://ejemplo.com/galeria-2.jpg"
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                            {formData.imagen_galeria_2 && (
                                <img
                                    src={formData.imagen_galeria_2}
                                    alt="Galería 2"
                                    className="mt-2 w-full h-24 object-cover rounded border"
                                    onError={(e) => e.target.style.display = "none"}
                                />
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Galería Imagen 3 (URL)</label>
                            <input
                                type="url"
                                name="imagen_galeria_3"
                                value={formData.imagen_galeria_3}
                                onChange={handleChange}
                                placeholder="https://ejemplo.com/galeria-3.jpg"
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                            {formData.imagen_galeria_3 && (
                                <img
                                    src={formData.imagen_galeria_3}
                                    alt="Galería 3"
                                    className="mt-2 w-full h-24 object-cover rounded border"
                                    onError={(e) => e.target.style.display = "none"}
                                />
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Galería Imagen 4 (URL)</label>
                            <input
                                type="url"
                                name="imagen_galeria_4"
                                value={formData.imagen_galeria_4}
                                onChange={handleChange}
                                placeholder="https://ejemplo.com/galeria-4.jpg"
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                            {formData.imagen_galeria_4 && (
                                <img
                                    src={formData.imagen_galeria_4}
                                    alt="Galería 4"
                                    className="mt-2 w-full h-24 object-cover rounded border"
                                    onError={(e) => e.target.style.display = "none"}
                                />
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Galería Imagen 5 (URL)</label>
                            <input
                                type="url"
                                name="imagen_galeria_5"
                                value={formData.imagen_galeria_5}
                                onChange={handleChange}
                                placeholder="https://ejemplo.com/galeria-5.jpg"
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                            {formData.imagen_galeria_5 && (
                                <img
                                    src={formData.imagen_galeria_5}
                                    alt="Galería 5"
                                    className="mt-2 w-full h-24 object-cover rounded border"
                                    onError={(e) => e.target.style.display = "none"}
                                />
                            )}
                        </div>
                    </div>
                </div>

                <div className="md:col-span-2">
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            name="destacado"
                            checked={formData.destacado}
                            onChange={handleChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">Destacar este departamento</span>
                    </label>
                </div>
            </div>

            <div className="flex justify-end space-x-3">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Guardar Cambios
                </button>
            </div>

            {/* Opción para destacar departamento */}
            <div className="mt-4">
                <label className="flex items-center">
                    <input
                        type="checkbox"
                        name="destacar_este_departamento"
                        checked={formData.destacado}
                        onChange={(e) => setFormData(prev => ({ ...prev, destacado: e.target.checked }))}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Destacar este departamento</span>
                </label>
            </div>
        </form>
    );
};

export default function Departamentos({ auth, departamentos, pagination, filters, error, propietarios, flash }) {
    const { flash: pageFlash, csrf_token } = usePage().props;
    // Combinar flash messages del prop y de usePage
    const activeFlash = flash || pageFlash;

    // Sincronizar token CSRF
    useEffect(() => {
        if (csrf_token) {
            const metaTag = document.head.querySelector('meta[name="csrf-token"]');
            if (metaTag) {
                metaTag.content = csrf_token;
            }
        }
    }, [csrf_token]);

    // Estado para los filtros
    const [filtros, setFiltros] = useState(filters || {
        busqueda: '',
        estado: '',
        ubicacion: '',
        destacado: '',
        page: 1,
        per_page: 10,
        sort_by: 'created_at',
        sort_direction: 'desc'
    });

    const [loading, setLoading] = useState(false);

    // Datos de departamentos que vienen del servidor
    const listaDepartamentos = departamentos?.data || [];
    const paginacion = pagination || { current_page: 1, last_page: 1, per_page: 10, total: 0 };

    // Estado para selección múltiple
    const [departamentosSeleccionados, setDepartamentosSeleccionados] = useState([]);
    const [showAccionesMasivas, setShowAccionesMasivas] = useState(false);

    // Estados para modales
    const [showVerModal, setShowVerModal] = useState(false);
    const [showEditarModal, setShowEditarModal] = useState(false);
    const [departamentoSeleccionado, setDepartamentoSeleccionado] = useState(null);
    const [loadingVisualizacion, setLoadingVisualizacion] = useState(false);
    const [imagenCargando, setImagenCargando] = useState({});

    // Función para verificar si una imagen existe
    const verificarImagen = (url) => {
        if (!url) return false;
        return true;
    };

    // Lista de propietarios que viene del backend
    const listaPropietarios = propietarios || [];

    // Función para manejar cambios en los filtros
    const handleFiltroChange = (e) => {
        const { name, value } = e.target;
        const nuevosFiltros = {
            ...filtros,
            [name]: value,
            page: 1, // Resetear la página al cambiar filtros
        };
        setFiltros(nuevosFiltros);

        // Para búsqueda, usar debounce
        if (name === 'busqueda') {
            clearTimeout(window.searchTimeout);
            window.searchTimeout = setTimeout(() => {
                router.get('/admin/departamentos', nuevosFiltros, {
                    preserveState: true,
                    preserveScroll: true,
                });
            }, 500);
        } else {
            router.get('/admin/departamentos', nuevosFiltros, {
                preserveState: true,
                preserveScroll: true,
            });
        }
    };

    // Cambiar de página
    const cambiarPagina = (nuevaPagina) => {
        if (nuevaPagina > 0 && nuevaPagina <= paginacion.last_page) {
            const nuevosFiltros = {
                ...filtros,
                page: nuevaPagina,
            };
            router.get('/admin/departamentos', nuevosFiltros, {
                preserveState: true,
                preserveScroll: true,
            });
        }
    };

    // Manejar cambio de ordenamiento
    const cambiarOrdenamiento = (campo) => {
        const nuevaDireccion = (filtros.sort_by === campo && filtros.sort_direction === 'asc') ? 'desc' : 'asc';
        const nuevosFiltros = {
            ...filtros,
            sort_by: campo,
            sort_direction: nuevaDireccion,
            page: 1
        };

        router.get('/admin/departamentos', nuevosFiltros, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    // Eliminar departamento (simplificado con más debug)
    const eliminarDepartamento = (departamento) => {
        // Mostrar diálogo de confirmación más informativo
        const confirmacion = confirm(`¿Está seguro de que desea eliminar permanentemente la propiedad ${departamento.codigo}?\n\nTítulo: ${departamento.titulo}\nUbicación: ${departamento.ubicacion}\n\nEsta acción no se puede deshacer.`);

        if (!confirmacion) {
            return; // Usuario canceló la eliminación
        }

        // Verificar token CSRF
        if (!csrf_token) {
            console.error('CSRF token not found');
            window.location.reload();
            return;
        }

        // Activar indicador de carga
        setLoading(true);

        // Realizar solicitud de eliminación
        router.delete(`/admin/departamentos/${departamento.id}`, {
            preserveState: true, // Mantener el estado para evitar parpadeos
            preserveScroll: true, // Mantener la posición del scroll
            replace: true,
            headers: {
                'X-CSRF-TOKEN': csrf_token,
            },
            onSuccess: (page) => {
                // Mostrar notificación de éxito
                alert('El departamento ha sido eliminado correctamente');

                // Simplemente recargar la página para obtener los datos actualizados
                router.reload();
            },
            onError: (errors) => {
                // Extraer mensaje de error y mostrarlo
                let mensajeError = 'Ocurrió un error al eliminar el departamento';

                if (typeof errors === 'object') {
                    if (errors.message) {
                        mensajeError = errors.message;
                    } else if (errors[0]) {
                        mensajeError = errors[0];
                    }
                }

                // Mostrar error al usuario
                alert(`No se pudo eliminar el departamento: ${mensajeError}`);
                console.error('Error al eliminar departamento:', errors);
            },
            onFinish: () => {
                setLoading(false);
            }
        });
    };    // Cambiar estado del departamento (activar/desactivar)
    const cambiarEstadoDepartamento = (departamento) => {
        const nuevoEstado = departamento.estado === 'inactivo' ? 'disponible' : 'inactivo';
        const accion = nuevoEstado === 'inactivo' ? 'desactivar' : 'activar';

        if (confirm(`¿Está seguro de que desea ${accion} la propiedad ${departamento.codigo}?`)) {
            if (!csrf_token) {
                console.error('CSRF token not found');
                window.location.reload();
                return;
            }

            setLoading(true);
            router.patch(`/admin/departamentos/${departamento.id}/estado`, {
                estado: nuevoEstado
            }, {
                preserveState: true,
                headers: {
                    'X-CSRF-TOKEN': csrf_token,
                },
                onError: (errors) => {
                    console.error('Error al cambiar estado:', errors);
                },
                onFinish: () => {
                    setLoading(false);
                }
            });
        }
    };

    // Cambiar destacado del departamento
    const toggleDestacado = (departamento) => {
        const accion = departamento.destacado ? 'quitar de destacados' : 'marcar como destacado';

        if (confirm(`¿Está seguro de que desea ${accion} la propiedad ${departamento.codigo}?`)) {
            if (!csrf_token) {
                console.error('CSRF token not found');
                window.location.reload();
                return;
            }

            setLoading(true);
            router.patch(`/admin/departamentos/${departamento.id}/destacado`, {
                destacado: !departamento.destacado
            }, {
                preserveState: true,
                headers: {
                    'X-CSRF-TOKEN': csrf_token,
                },
                onError: (errors) => {
                    console.error('Error al cambiar destacado:', errors);
                },
                onFinish: () => {
                    setLoading(false);
                }
            });
        }
    };

    // Función para ver departamento
    const verDepartamento = async (departamento) => {
        try {
            setLoadingVisualizacion(true);
            setDepartamentoSeleccionado(null); // Limpiamos el estado anterior

            // Pre-cargar imágenes si es posible
            const imagenesPrecargar = [
                departamento.imagen_principal,
                departamento.imagen_galeria_1,
                departamento.imagen_galeria_2,
                departamento.imagen_galeria_3,
                departamento.imagen_galeria_4,
                departamento.imagen_galeria_5
            ].filter(url => url); // Filtrar URLs vacías

            // Tiempo corto de carga para mejor experiencia visual
            await new Promise(resolve => setTimeout(resolve, 200));

            setDepartamentoSeleccionado(departamento);
            setShowVerModal(true);
            // Dejamos el estado de carga un poco más para que la animación se vea bien
            setTimeout(() => setLoadingVisualizacion(false), 300);
        } catch (error) {
            console.error('Error al mostrar departamento:', error);
        }
    };

    // Función para editar departamento
    const editarDepartamento = async (departamento) => {
        try {
            setDepartamentoSeleccionado(null); // Limpiamos el estado anterior
            await new Promise(resolve => setTimeout(resolve, 0)); // Micropause para el estado
            setDepartamentoSeleccionado(departamento);
            setShowEditarModal(true);
        } catch (error) {
            console.error('Error al editar departamento:', error);
        }
    };

    // Función para cerrar modales
    const cerrarModales = async () => {
        try {
            setShowVerModal(false);
            setShowEditarModal(false);
            await new Promise(resolve => setTimeout(resolve, 100)); // Dar tiempo para la animación
            setDepartamentoSeleccionado(null);
        } catch (error) {
            console.error('Error al cerrar modales:', error);
        }
    };

    // Funciones para selección múltiple
    const toggleSeleccionDepartamento = (departamentoId) => {
        setDepartamentosSeleccionados(prev => {
            if (prev.includes(departamentoId)) {
                return prev.filter(id => id !== departamentoId);
            } else {
                return [...prev, departamentoId];
            }
        });
    };

    const seleccionarTodos = () => {
        if (departamentosSeleccionados.length === listaDepartamentos.length) {
            setDepartamentosSeleccionados([]);
        } else {
            setDepartamentosSeleccionados(listaDepartamentos.map(d => d.id));
        }
    };

    const ejecutarAccionMasiva = (accion) => {
        if (departamentosSeleccionados.length === 0) {
            alert('Debe seleccionar al menos un departamento');
            return;
        }

        const confirmMessage = `¿Está seguro de que desea ${accion} ${departamentosSeleccionados.length} departamento(s)?`;
        if (confirm(confirmMessage)) {
            if (!csrf_token) {
                console.error('CSRF token not found');
                window.location.reload();
                return;
            }

            setLoading(true);

            const promesas = departamentosSeleccionados.map(id => {
                const options = {
                    preserveState: true,
                    headers: {
                        'X-CSRF-TOKEN': csrf_token,
                    }
                };

                if (accion === 'activar') {
                    return router.patch(`/admin/departamentos/${id}/estado`, { estado: 'disponible' }, options);
                } else if (accion === 'desactivar') {
                    return router.patch(`/admin/departamentos/${id}/estado`, { estado: 'inactivo' }, options);
                } else if (accion === 'destacar') {
                    return router.patch(`/admin/departamentos/${id}/destacado`, { destacado: true }, options);
                } else if (accion === 'no_destacar') {
                    return router.patch(`/admin/departamentos/${id}/destacado`, { destacado: false }, options);
                }
            });

            Promise.all(promesas).finally(() => {
                setLoading(false);
                setDepartamentosSeleccionados([]);
                router.reload();
            });
        }
    };

    // Formatear precio
    const formatearPrecio = (precio) => {
        return new Intl.NumberFormat('es-PE', {
            style: 'currency',
            currency: 'PEN'
        }).format(precio);
    };

    // Exportar datos
    const exportarDatos = (formato) => {
        const params = new URLSearchParams({
            ...filtros,
            formato: formato,
            export: true
        });

        window.open(`/admin/departamentos/exportar?${params.toString()}`, '_blank');
    };

    // Obtener color del estado
    const getEstadoColor = (estado) => {
        switch (estado) {
            case 'disponible':
                return 'bg-green-100 text-green-800';
            case 'vendido':
                return 'bg-red-100 text-red-800';
            case 'reservado':
                return 'bg-yellow-100 text-yellow-800';
            case 'inactivo':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Calcular estadísticas
    const getEstadisticas = () => {
        const total = listaDepartamentos.length;
        const disponibles = listaDepartamentos.filter(d => d.estado === 'disponible').length;
        const vendidos = listaDepartamentos.filter(d => d.estado === 'vendido').length;
        const reservados = listaDepartamentos.filter(d => d.estado === 'reservado').length;
        const inactivos = listaDepartamentos.filter(d => d.estado === 'inactivo').length;
        const destacados = listaDepartamentos.filter(d => d.destacado).length;

        return { total, disponibles, vendidos, reservados, inactivos, destacados };
    };

    const estadisticas = getEstadisticas();

    // Obtener texto del estado
    const getEstadoTexto = (estado) => {
        switch (estado) {
            case 'disponible':
                return 'Disponible';
            case 'vendido':
                return 'Vendido';
            case 'reservado':
                return 'Reservado';
            case 'inactivo':
                return 'Inactivo';
            default:
                return estado;
        }
    };

    return (
        <AdminLayout
            auth={auth}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Gestión de Propiedades
                </h2>
            }
        >
            <Head title="Gestión de Propiedades - Inmobiliaria" />
            <ToastContainer />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {activeFlash?.message && (
                        <FlashMessage message={activeFlash.message} type={activeFlash.error ? 'error' : 'success'} />
                    )}
                </div>
            </div>

            <div className="py-12 bg-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900">
                                Lista de Propiedades
                            </h2>
                            <p className="mt-1 text-lg text-gray-600">
                                Administre las propiedades del sistema
                            </p>
                        </div>
                        <div className="flex space-x-3">
                            <button
                                onClick={() => exportarDatos('excel')}
                                className="px-4 py-2 bg-green-600 border border-transparent rounded-md font-semibold text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            >
                                📊 Exportar Excel
                            </button>
                            <button
                                onClick={() => router.visit('/admin/departamentos/crear')}
                                className="px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                ➕ NUEVA PROPIEDAD
                            </button>
                        </div>
                    </div>

                    {/* Panel de Estadísticas */}
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
                        <div className="bg-white rounded-lg shadow-md p-4 text-center">
                            <div className="text-2xl font-bold text-blue-600">{estadisticas.total}</div>
                            <div className="text-sm text-gray-600">Total</div>
                        </div>
                        <div className="bg-white rounded-lg shadow-md p-4 text-center">
                            <div className="text-2xl font-bold text-green-600">{estadisticas.disponibles}</div>
                            <div className="text-sm text-gray-600">Disponibles</div>
                        </div>
                        <div className="bg-white rounded-lg shadow-md p-4 text-center">
                            <div className="text-2xl font-bold text-red-600">{estadisticas.vendidos}</div>
                            <div className="text-sm text-gray-600">Vendidos</div>
                        </div>
                        <div className="bg-white rounded-lg shadow-md p-4 text-center">
                            <div className="text-2xl font-bold text-yellow-600">{estadisticas.reservados}</div>
                            <div className="text-sm text-gray-600">Reservados</div>
                        </div>
                        <div className="bg-white rounded-lg shadow-md p-4 text-center">
                            <div className="text-2xl font-bold text-gray-600">{estadisticas.inactivos}</div>
                            <div className="text-sm text-gray-600">Inactivos</div>
                        </div>
                        <div className="bg-white rounded-lg shadow-md p-4 text-center">
                            <div className="text-2xl font-bold text-purple-600">{estadisticas.destacados}</div>
                            <div className="text-sm text-gray-600">Destacados</div>
                        </div>
                    </div>

                    {/* Mostrar error si existe */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                            {error}
                        </div>
                    )}

                    {/* Filtros */}
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <label htmlFor="busqueda" className="block text-sm font-medium text-gray-700 mb-1">
                                    Buscar
                                </label>
                                <input
                                    type="text"
                                    id="busqueda"
                                    name="busqueda"
                                    value={filtros.busqueda}
                                    onChange={handleFiltroChange}
                                    placeholder="Buscar propiedades..."
                                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                />
                            </div>

                            <div>
                                <label htmlFor="estado" className="block text-sm font-medium text-gray-700 mb-1">
                                    Estado
                                </label>
                                <select
                                    id="estado"
                                    name="estado"
                                    value={filtros.estado}
                                    onChange={handleFiltroChange}
                                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                >
                                    <option value="">Todos los estados</option>
                                    <option value="disponible">Disponible</option>
                                    <option value="vendido">Vendido</option>
                                    <option value="reservado">Reservado</option>
                                    <option value="inactivo">Inactivo</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="ubicacion" className="block text-sm font-medium text-gray-700 mb-1">
                                    Ubicación
                                </label>
                                <input
                                    type="text"
                                    id="ubicacion"
                                    name="ubicacion"
                                    value={filtros.ubicacion}
                                    onChange={handleFiltroChange}
                                    placeholder="Filtrar por ubicación"
                                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                />
                            </div>

                            <div>
                                <label htmlFor="destacado" className="block text-sm font-medium text-gray-700 mb-1">
                                    Destacado
                                </label>
                                <select
                                    id="destacado"
                                    name="destacado"
                                    value={filtros.destacado}
                                    onChange={handleFiltroChange}
                                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                >
                                    <option value="">Todos</option>
                                    <option value="1">Destacados</option>
                                    <option value="0">No destacados</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Panel de Acciones Masivas */}
                    {departamentosSeleccionados.length > 0 && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <span className="text-blue-800 font-medium">
                                        {departamentosSeleccionados.length} propiedades seleccionadas
                                    </span>
                                    <button
                                        onClick={() => setDepartamentosSeleccionados([])}
                                        className="text-blue-600 hover:text-blue-800 text-sm"
                                    >
                                        Limpiar selección
                                    </button>
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => ejecutarAccionMasiva('activar')}
                                        className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                                    >
                                        Activar
                                    </button>
                                    <button
                                        onClick={() => ejecutarAccionMasiva('desactivar')}
                                        className="px-3 py-1 bg-orange-600 text-white rounded text-sm hover:bg-orange-700"
                                    >
                                        Desactivar
                                    </button>
                                    <button
                                        onClick={() => ejecutarAccionMasiva('destacar')}
                                        className="px-3 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700"
                                    >
                                        Destacar
                                    </button>
                                    <button
                                        onClick={() => ejecutarAccionMasiva('no_destacar')}
                                        className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
                                    >
                                        No Destacar
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Tabla de departamentos */}
                    <div className="bg-white shadow-md rounded-lg overflow-hidden">
                        {loading ? (
                            <div className="py-10 text-center">
                                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
                                <p className="text-gray-600">Cargando propiedades...</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                <input
                                                    type="checkbox"
                                                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:ring-blue-500"
                                                    checked={departamentosSeleccionados.length === listaDepartamentos.length && listaDepartamentos.length > 0}
                                                    onChange={seleccionarTodos}
                                                />
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                                onClick={() => cambiarOrdenamiento('codigo')}
                                            >
                                                Propiedad
                                                {filtros.sort_by === 'codigo' && (
                                                    <span className="ml-1">
                                                        {filtros.sort_direction === 'asc' ? '↑' : '↓'}
                                                    </span>
                                                )}
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Tipo
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                                onClick={() => cambiarOrdenamiento('precio')}
                                            >
                                                Precio
                                                {filtros.sort_by === 'precio' && (
                                                    <span className="ml-1">
                                                        {filtros.sort_direction === 'asc' ? '↑' : '↓'}
                                                    </span>
                                                )}
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Área
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
                                        {listaDepartamentos.length > 0 ? (
                                            listaDepartamentos.map((departamento) => (
                                                <tr key={departamento.id} className={`hover:bg-gray-50 ${departamentosSeleccionados.includes(departamento.id) ? 'bg-blue-50' : ''}`}>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <input
                                                            type="checkbox"
                                                            className="rounded border-gray-300 text-blue-600 shadow-sm focus:ring-blue-500"
                                                            checked={departamentosSeleccionados.includes(departamento.id)}
                                                            onChange={() => toggleSeleccionDepartamento(departamento.id)}
                                                        />
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div>
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {departamento.titulo || `${departamento.codigo}`}
                                                                {departamento.destacado && <span className="ml-2 text-yellow-500">⭐</span>}
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                {departamento.ubicacion}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900">Departamento</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {formatearPrecio(departamento.precio)}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {departamento.habitaciones} hab, {departamento.banos} baños
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900">
                                                            {departamento.area_total} m²
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {departamento.habitaciones} hab, {departamento.banos} baños
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getEstadoColor(departamento.estado)}`}>
                                                            {getEstadoTexto(departamento.estado)}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <div className="flex space-x-2 justify-end">
                                                            <button
                                                                onClick={() => verDepartamento(departamento)}
                                                                className="text-blue-600 hover:text-blue-900 font-medium"
                                                            >
                                                                Ver
                                                            </button>
                                                            <button
                                                                onClick={() => editarDepartamento(departamento)}
                                                                className="text-indigo-600 hover:text-indigo-900 font-medium"
                                                            >
                                                                Editar
                                                            </button>
                                                            <button
                                                                onClick={() => cambiarEstadoDepartamento(departamento)}
                                                                className={`font-medium ${departamento.estado === 'inactivo'
                                                                    ? 'text-green-600 hover:text-green-900'
                                                                    : 'text-orange-600 hover:text-orange-900'
                                                                    }`}
                                                            >
                                                                {departamento.estado === 'inactivo' ? 'Activar' : 'Desactivar'}
                                                            </button>
                                                            <button
                                                                onClick={() => toggleDestacado(departamento)}
                                                                className={`font-medium ${departamento.destacado
                                                                    ? 'text-yellow-600 hover:text-yellow-900'
                                                                    : 'text-purple-600 hover:text-purple-900'
                                                                    }`}
                                                            >
                                                                {departamento.destacado ? '⭐ Destacado' : '☆ Destacar'}
                                                            </button>
                                                            <button
                                                                onClick={() => eliminarDepartamento(departamento)}
                                                                className="text-red-600 hover:text-red-900 font-medium"
                                                                disabled={loading}
                                                            >
                                                                {loading ? 'Eliminando...' : 'Eliminar'}
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                                                    No se encontraron propiedades.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* Paginación */}
                    {paginacion.total > 0 && (
                        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-4 rounded-lg shadow-md">
                            <div className="flex-1 flex justify-between sm:hidden">
                                <button
                                    onClick={() => cambiarPagina(paginacion.current_page - 1)}
                                    disabled={paginacion.current_page === 1}
                                    className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${paginacion.current_page === 1
                                        ? 'text-gray-400 bg-gray-100'
                                        : 'text-gray-700 bg-white hover:bg-gray-50'
                                        }`}
                                >
                                    Anterior
                                </button>
                                <button
                                    onClick={() => cambiarPagina(paginacion.current_page + 1)}
                                    disabled={paginacion.current_page === paginacion.last_page}
                                    className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${paginacion.current_page === paginacion.last_page
                                        ? 'text-gray-400 bg-gray-100'
                                        : 'text-gray-700 bg-white hover:bg-gray-50'
                                        }`}
                                >
                                    Siguiente
                                </button>
                            </div>
                            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm text-gray-700">
                                        Mostrando <span className="font-medium">{(paginacion.current_page - 1) * paginacion.per_page + 1}</span> a <span className="font-medium">
                                            {Math.min(paginacion.current_page * paginacion.per_page, paginacion.total)}
                                        </span> de <span className="font-medium">{paginacion.total}</span> resultados
                                    </p>
                                </div>
                                <div>
                                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                        <button
                                            onClick={() => cambiarPagina(paginacion.current_page - 1)}
                                            disabled={paginacion.current_page === 1}
                                            className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 ${paginacion.current_page === 1
                                                ? 'text-gray-400 bg-gray-100'
                                                : 'bg-white text-gray-500 hover:bg-gray-50'
                                                }`}
                                        >
                                            <span className="sr-only">Anterior</span>
                                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </button>

                                        {/* Páginas */}
                                        {Array.from({ length: paginacion.last_page }, (_, i) => i + 1)
                                            .filter(page =>
                                                page === 1 ||
                                                page === paginacion.last_page ||
                                                (page >= paginacion.current_page - 1 && page <= paginacion.current_page + 1)
                                            )
                                            .map((page, i, array) => {
                                                const showEllipsisBefore = i > 0 && array[i - 1] !== page - 1;
                                                const showEllipsisAfter = i < array.length - 1 && array[i + 1] !== page + 1;

                                                return (
                                                    <React.Fragment key={page}>
                                                        {showEllipsisBefore && (
                                                            <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                                                                ...
                                                            </span>
                                                        )}
                                                        <button
                                                            onClick={() => cambiarPagina(page)}
                                                            className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium ${page === paginacion.current_page
                                                                ? 'bg-blue-50 text-blue-600'
                                                                : 'bg-white text-gray-700 hover:bg-gray-50'
                                                                }`}
                                                        >
                                                            {page}
                                                        </button>
                                                        {showEllipsisAfter && (
                                                            <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                                                                ...
                                                            </span>
                                                        )}
                                                    </React.Fragment>
                                                );
                                            })
                                        }

                                        <button
                                            onClick={() => cambiarPagina(paginacion.current_page + 1)}
                                            disabled={paginacion.current_page === paginacion.last_page}
                                            className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 ${paginacion.current_page === paginacion.last_page
                                                ? 'text-gray-400 bg-gray-100'
                                                : 'bg-white text-gray-500 hover:bg-gray-50'
                                                }`}
                                        >
                                            <span className="sr-only">Siguiente</span>
                                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal Ver Departamento - Mejorado con animación */}
            {showVerModal && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 animate-fade-in">
                    <div className={`bg-white rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-xl transform transition-all duration-300 ${departamentoSeleccionado && !loadingVisualizacion ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
                        {loadingVisualizacion ? (
                            <div className="flex flex-col items-center justify-center p-12">
                                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                                <p className="text-lg text-gray-600 font-medium">Cargando información del departamento...</p>
                            </div>
                        ) : departamentoSeleccionado && (
                            <>
                                <div className="border-b border-gray-200">
                                    <div className="p-4 flex justify-between items-center bg-gray-50 rounded-t-lg">
                                        <div className="flex items-center">
                                            <svg className="w-6 h-6 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                                            </svg>
                                            <h2 className="text-xl font-bold text-gray-800">
                                                Ver Departamento: <span className="text-blue-600">{departamentoSeleccionado.codigo}</span>
                                            </h2>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${departamentoSeleccionado.estado === 'disponible' ? 'bg-green-100 text-green-800' :
                                                    departamentoSeleccionado.estado === 'reservado' ? 'bg-yellow-100 text-yellow-800' :
                                                        departamentoSeleccionado.estado === 'vendido' ? 'bg-red-100 text-red-800' :
                                                            'bg-gray-100 text-gray-800'
                                                }`}>
                                                {getEstadoTexto(departamentoSeleccionado.estado)}
                                            </span>
                                            <button
                                                onClick={cerrarModales}
                                                className="text-gray-400 hover:text-gray-600 transition-colors"
                                                aria-label="Cerrar"
                                            >
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6">
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                                        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                                            <div className="flex items-center mb-4">
                                                <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                </svg>
                                                <h3 className="text-lg font-semibold text-gray-800">Información General</h3>
                                            </div>
                                            <div className="space-y-4">
                                                <div className="grid grid-cols-3 border-b border-gray-100 pb-2">
                                                    <label className="text-sm font-medium text-gray-500">Código</label>
                                                    <p className="text-sm font-semibold text-gray-800 col-span-2">{departamentoSeleccionado.codigo}</p>
                                                </div>
                                                <div className="grid grid-cols-3 border-b border-gray-100 pb-2">
                                                    <label className="text-sm font-medium text-gray-500">Título</label>
                                                    <p className="text-sm font-semibold text-gray-800 col-span-2">{departamentoSeleccionado.titulo}</p>
                                                </div>
                                                <div className="grid grid-cols-3 border-b border-gray-100 pb-2">
                                                    <label className="text-sm font-medium text-gray-500">Descripción</label>
                                                    <p className="text-sm text-gray-800 col-span-2">{departamentoSeleccionado.descripcion || 'Sin descripción'}</p>
                                                </div>
                                                <div className="grid grid-cols-3 border-b border-gray-100 pb-2">
                                                    <label className="text-sm font-medium text-gray-500">Ubicación</label>
                                                    <p className="text-sm text-gray-800 col-span-2">{departamentoSeleccionado.ubicacion}</p>
                                                </div>
                                                <div className="grid grid-cols-3">
                                                    <label className="text-sm font-medium text-gray-500">Dirección</label>
                                                    <p className="text-sm text-gray-800 col-span-2">{departamentoSeleccionado.direccion || 'No especificada'}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                                            <div className="flex items-center mb-4">
                                                <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path>
                                                </svg>
                                                <h3 className="text-lg font-semibold text-gray-800">Detalles</h3>
                                            </div>
                                            <div className="space-y-4">
                                                <div className="grid grid-cols-3 border-b border-gray-100 pb-2">
                                                    <label className="text-sm font-medium text-gray-500">Precio</label>
                                                    <p className="text-sm font-bold text-blue-700 col-span-2">S/ {parseFloat(departamentoSeleccionado.precio).toLocaleString('es-PE', { minimumFractionDigits: 2 })}</p>
                                                </div>
                                                <div className="grid grid-cols-3 gap-2">
                                                    <div className="bg-blue-50 p-2 rounded-lg flex flex-col items-center justify-center">
                                                        <span className="text-sm font-medium text-gray-500">Habitaciones</span>
                                                        <p className="text-lg font-bold text-blue-700">{departamentoSeleccionado.habitaciones}</p>
                                                    </div>
                                                    <div className="bg-blue-50 p-2 rounded-lg flex flex-col items-center justify-center">
                                                        <span className="text-sm font-medium text-gray-500">Baños</span>
                                                        <p className="text-lg font-bold text-blue-700">{departamentoSeleccionado.banos}</p>
                                                    </div>
                                                    <div className="bg-blue-50 p-2 rounded-lg flex flex-col items-center justify-center">
                                                        <span className="text-sm font-medium text-gray-500">Estacionam.</span>
                                                        <p className="text-lg font-bold text-blue-700">{departamentoSeleccionado.estacionamientos || 0}</p>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-3 border-b border-gray-100 py-2">
                                                    <label className="text-sm font-medium text-gray-500">Área Total</label>
                                                    <p className="text-sm font-semibold text-gray-800 col-span-2">{departamentoSeleccionado.area_total} m²</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Galería de Imágenes - Más compacta */}
                                    {(departamentoSeleccionado.imagen_principal ||
                                        departamentoSeleccionado.imagen_galeria_1 ||
                                        departamentoSeleccionado.imagen_galeria_2 ||
                                        departamentoSeleccionado.imagen_galeria_3 ||
                                        departamentoSeleccionado.imagen_galeria_4 ||
                                        departamentoSeleccionado.imagen_galeria_5) && (
                                            <div className="mt-6">
                                                <div className="flex items-center mb-2">
                                                    <svg className="w-4 h-4 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                                    </svg>
                                                    <h3 className="text-md font-semibold">Imágenes del Departamento</h3>
                                                </div>

                                                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 max-w-3xl mx-auto">
                                                    {/* Imagen Principal - Más compacta */}
                                                    {departamentoSeleccionado.imagen_principal && (
                                                        <div className="mb-4 animate-slide-up">
                                                            <div className="flex justify-between items-center mb-2">
                                                                <p className="text-sm font-semibold text-gray-700">Imagen Principal</p>
                                                                <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">Principal</span>
                                                            </div>
                                                            <div className="rounded-lg overflow-hidden border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300 bg-white max-w-md mx-auto">
                                                                <div className="relative" style={{ height: '180px' }}>
                                                                    <img
                                                                        src={departamentoSeleccionado.imagen_principal}
                                                                        alt="Imagen principal del departamento"
                                                                        className="absolute inset-0 w-full h-full object-contain animate-fade-in"
                                                                        onClick={() => window.open(departamentoSeleccionado.imagen_principal, '_blank')}
                                                                        onError={(e) => {
                                                                            e.target.src = 'https://via.placeholder.com/150?text=Imagen+no+disponible';
                                                                            e.target.onerror = null;
                                                                        }}
                                                                    />
                                                                </div>
                                                                <div className="p-2 bg-white flex justify-end">
                                                                    <button
                                                                        onClick={() => window.open(departamentoSeleccionado.imagen_principal, '_blank')}
                                                                        className="text-blue-600 hover:text-blue-800 text-xs flex items-center"
                                                                    >
                                                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                                                        </svg>
                                                                        Ver a tamaño completo
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Galería de imágenes secundarias - Más compacta */}
                                                    <div className="flex flex-wrap justify-center gap-2">
                                                        {[
                                                            { key: 'imagen_galeria_1', title: 'Galería 1' },
                                                            { key: 'imagen_galeria_2', title: 'Galería 2' },
                                                            { key: 'imagen_galeria_3', title: 'Galería 3' },
                                                            { key: 'imagen_galeria_4', title: 'Galería 4' },
                                                            { key: 'imagen_galeria_5', title: 'Galería 5' }
                                                        ].filter(img => departamentoSeleccionado[img.key]).map((img, index) => (
                                                            <div
                                                                key={img.key}
                                                                className="bg-white rounded overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 animate-slide-up w-[130px]"
                                                                style={{ animationDelay: `${index * 100}ms` }}
                                                            >
                                                                <div className="relative" style={{ height: '100px' }}>
                                                                    <img
                                                                        src={departamentoSeleccionado[img.key]}
                                                                        alt={`Imagen ${index + 1} del departamento`}
                                                                        className="absolute inset-0 w-full h-full object-cover animate-fade-in"
                                                                        style={{ animationDelay: `${(index * 100) + 200}ms` }}
                                                                        onClick={() => window.open(departamentoSeleccionado[img.key], '_blank')}
                                                                        onError={(e) => {
                                                                            e.target.src = 'https://via.placeholder.com/100x100?text=No+disponible';
                                                                            e.target.onerror = null;
                                                                        }}
                                                                    />
                                                                </div>
                                                                <div className="p-1 flex justify-between items-center bg-white">
                                                                    <p className="text-xs font-medium text-gray-600">{`Imagen ${index + 1}`}</p>
                                                                    <button
                                                                        onClick={() => window.open(departamentoSeleccionado[img.key], '_blank')}
                                                                        className="text-blue-600 hover:text-blue-800"
                                                                        aria-label="Ver imagen"
                                                                    >
                                                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                                                        </svg>
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                    <div className="mt-8 flex justify-end border-t border-gray-200 pt-4">
                                        <button
                                            onClick={cerrarModales}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 flex items-center"
                                        >
                                            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                            Cerrar
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* Modal Editar Departamento */}
            {showEditarModal && departamentoSeleccionado && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold text-gray-900">
                                    Editar Departamento: {departamentoSeleccionado.codigo}
                                </h2>
                                <button
                                    onClick={cerrarModales}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <FormularioEdicionRapida
                                departamento={departamentoSeleccionado}
                                propietarios={listaPropietarios}
                                onSave={(datos) => {
                                    // Actualizar departamento
                                    setLoading(true);

                                    if (!csrf_token) {
                                        console.error('CSRF token not found');
                                        toast.error('Error de seguridad. Recarga la página.', {
                                            position: "top-right",
                                            autoClose: 3000
                                        });
                                        return;
                                    }

                                    router.patch(`/admin/departamentos/${departamentoSeleccionado.id}`, datos, {
                                        preserveState: false,
                                        headers: {
                                            'X-CSRF-TOKEN': csrf_token,
                                        },
                                        onSuccess: () => {
                                            // Mostrar mensaje de éxito
                                            toast.success('¡Departamento actualizado correctamente!', {
                                                position: "top-right",
                                                autoClose: 3000
                                            });
                                            cerrarModales();
                                            router.reload();
                                        },
                                        onError: (errors) => {
                                            console.error('Error al actualizar:', errors);
                                            // Mostrar mensaje de error más amigable
                                            toast.error('Hay errores en el formulario. Verifica los campos requeridos.', {
                                                position: "top-right",
                                                autoClose: 4000
                                            });
                                        },
                                        onFinish: () => {
                                            setLoading(false);
                                        }
                                    });
                                }}
                                onCancel={cerrarModales}
                            />
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
