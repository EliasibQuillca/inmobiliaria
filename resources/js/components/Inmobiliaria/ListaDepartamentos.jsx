import React, { useState, useEffect } from 'react';
import { departamentoService } from '../../services/api';
import { ESTADO_DEPARTAMENTO } from '../../constants';
import PrimaryButton from '../PrimaryButton';
import SecondaryButton from '../SecondaryButton';
import TextInput from '../TextInput';
import InputLabel from '../InputLabel';

const ListaDepartamentos = ({ onSeleccionarDepartamento }) => {
    const [departamentos, setDepartamentos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filtros, setFiltros] = useState({
        precio_min: '',
        precio_max: '',
        direccion: '',
    });

    useEffect(() => {
        cargarDepartamentos();
    }, []);

    const cargarDepartamentos = async () => {
        try {
            setLoading(true);
            const response = await departamentoService.listar(filtros);
            setDepartamentos(response.data.departamentos);
        } catch (err) {
            console.error("Error al cargar departamentos:", err);
            setError('Hubo un error al cargar los departamentos. Intente nuevamente.');
        } finally {
            setLoading(false);
        }
    };

    const handleFiltroChange = (e) => {
        const { name, value } = e.target;
        setFiltros(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const aplicarFiltros = (e) => {
        e.preventDefault();
        cargarDepartamentos();
    };

    const resetearFiltros = () => {
        setFiltros({
            precio_min: '',
            precio_max: '',
            direccion: '',
        });
        // Cargar datos sin filtros
        departamentoService.listar()
            .then(response => setDepartamentos(response.data.departamentos))
            .catch(err => setError('Error al restablecer filtros'));
    };

    if (loading && !departamentos.length) return <div className="p-4 text-center">Cargando departamentos...</div>;

    if (error) return <div className="p-4 text-center text-red-600">{error}</div>;

    return (
        <div className="space-y-6">
            {/* Filtros */}
            <form onSubmit={aplicarFiltros} className="bg-white p-4 rounded-lg shadow space-y-4">
                <h3 className="text-lg font-medium">Filtros de búsqueda</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <InputLabel htmlFor="precio_min" value="Precio mínimo" />
                        <TextInput
                            id="precio_min"
                            name="precio_min"
                            type="number"
                            value={filtros.precio_min}
                            onChange={handleFiltroChange}
                            className="mt-1 block w-full"
                            placeholder="Precio mínimo"
                        />
                    </div>

                    <div>
                        <InputLabel htmlFor="precio_max" value="Precio máximo" />
                        <TextInput
                            id="precio_max"
                            name="precio_max"
                            type="number"
                            value={filtros.precio_max}
                            onChange={handleFiltroChange}
                            className="mt-1 block w-full"
                            placeholder="Precio máximo"
                        />
                    </div>

                    <div>
                        <InputLabel htmlFor="direccion" value="Dirección" />
                        <TextInput
                            id="direccion"
                            name="direccion"
                            type="text"
                            value={filtros.direccion}
                            onChange={handleFiltroChange}
                            className="mt-1 block w-full"
                            placeholder="Buscar por dirección"
                        />
                    </div>
                </div>

                <div className="flex justify-end space-x-2">
                    <SecondaryButton type="button" onClick={resetearFiltros}>
                        Restablecer
                    </SecondaryButton>
                    <PrimaryButton type="submit">
                        Aplicar filtros
                    </PrimaryButton>
                </div>
            </form>

            {/* Lista de departamentos */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {departamentos.length === 0 ? (
                    <div className="col-span-full text-center py-8">
                        No se encontraron departamentos con los filtros seleccionados.
                    </div>
                ) : (
                    departamentos.map((departamento) => (
                        <div
                            key={departamento.id}
                            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                            onClick={() => onSeleccionarDepartamento(departamento)}
                        >
                            {/* Imagen del departamento si existe */}
                            <div className="h-48 bg-gray-200">
                                {departamento.imagen_principal ? (
                                    <img
                                        src={departamento.imagen_principal.url}
                                        alt={departamento.titulo}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                        <span className="text-gray-400">Sin imagen</span>
                                    </div>
                                )}
                            </div>

                            <div className="p-4">
                                <div className="flex justify-between items-start">
                                    <h3 className="text-lg font-bold">{departamento.titulo}</h3>
                                    <span className="text-green-600 font-medium">
                                        S/ {parseFloat(departamento.precio).toLocaleString('es-PE')}
                                    </span>
                                </div>

                                <p className="text-gray-600 text-sm mt-1">{departamento.direccion}</p>

                                <div className="flex items-center mt-2 text-sm text-gray-500 space-x-4">
                                    <div>{departamento.dormitorios} Dorm.</div>
                                    <div>{departamento.banos} Baños</div>
                                    <div>{departamento.area_total} m²</div>
                                </div>

                                <div className="mt-3 flex justify-between items-center">
                                    <span
                                        className={`px-2 py-1 text-xs rounded-full ${
                                            departamento.estado === ESTADO_DEPARTAMENTO.DISPONIBLE
                                                ? 'bg-green-100 text-green-800'
                                                : departamento.estado === ESTADO_DEPARTAMENTO.RESERVADO
                                                ? 'bg-yellow-100 text-yellow-800'
                                                : 'bg-red-100 text-red-800'
                                        }`}
                                    >
                                        {departamento.estado === ESTADO_DEPARTAMENTO.DISPONIBLE
                                            ? 'Disponible'
                                            : departamento.estado === ESTADO_DEPARTAMENTO.RESERVADO
                                            ? 'Reservado'
                                            : 'Vendido'}
                                    </span>

                                    <button
                                        className="text-sm text-blue-600 hover:text-blue-800"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onSeleccionarDepartamento(departamento);
                                        }}
                                    >
                                        Ver detalles
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ListaDepartamentos;
