import { useState, useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import Layout from '@/components/layout/Layout';
import TextInput from '@/components/common/TextInput';
import InputLabel from '@/components/common/InputLabel';
import InputError from '@/components/common/InputError';
import SelectInput from '@/components/common/SelectInput';
import TextareaInput from '@/components/common/TextareaInput';

export default function CrearCotizacion({ auth, clientes, departamentos }) {
    // Estados para manejar el departamento seleccionado
    const [departamentoSeleccionado, setDepartamentoSeleccionado] = useState(null);

    // Formulario con Inertia
    const { data, setData, post, processing, errors } = useForm({
        cliente_id: '',
        departamento_id: '',
        precio_lista: '',
        descuento: '0',
        precio_final: '',
        validez_dias: '30',
        observaciones: '',
    });

    // Efecto para actualizar el precio final cuando cambia el precio de lista o el descuento
    useEffect(() => {
        if (data.precio_lista && data.descuento) {
            const precioFinal = parseFloat(data.precio_lista) - parseFloat(data.descuento);
            setData('precio_final', precioFinal.toString());
        }
    }, [data.precio_lista, data.descuento]);

    // Efecto para establecer el precio de lista cuando se selecciona un departamento
    useEffect(() => {
        if (data.departamento_id && departamentos) {
            const departamento = departamentos.find(d => d.id.toString() === data.departamento_id.toString());
            if (departamento) {
                setDepartamentoSeleccionado(departamento);
                setData('precio_lista', departamento.precio.toString());
            }
        }
    }, [data.departamento_id, departamentos]);

    // Función para enviar el formulario
    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('asesor.cotizaciones.store'));
    };

    return (
        <Layout auth={auth}>
            <Head title="Crear Cotización" />

            <div className="py-12 bg-gray-100">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Crear Nueva Cotización</h2>
                        <Link
                            href={route('asesor.cotizaciones.index')}
                            className="inline-flex items-center px-4 py-2 bg-gray-200 border border-transparent rounded-md font-semibold text-xs text-gray-800 uppercase tracking-widest hover:bg-gray-300 active:bg-gray-400 focus:outline-none focus:border-gray-500 focus:ring ring-gray-300 disabled:opacity-25 transition"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Volver
                        </Link>
                    </div>

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <form onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Sección de Cliente */}
                                    <div className="md:col-span-2 bg-gray-50 p-4 rounded-lg mb-6">
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">Información del Cliente</h3>
                                        <div className="mb-4">
                                            <InputLabel htmlFor="cliente_id" value="Cliente" />
                                            <SelectInput
                                                id="cliente_id"
                                                name="cliente_id"
                                                value={data.cliente_id}
                                                onChange={(e) => setData('cliente_id', e.target.value)}
                                                className="mt-1 block w-full"
                                                required
                                            >
                                                <option value="">Seleccione un cliente</option>
                                                {clientes && clientes.map((cliente) => (
                                                    <option key={cliente.id} value={cliente.id}>
                                                        {cliente.nombre} {cliente.apellidos} - {cliente.email}
                                                    </option>
                                                ))}
                                            </SelectInput>
                                            <InputError message={errors.cliente_id} className="mt-2" />
                                        </div>
                                    </div>

                                    {/* Sección de Propiedad */}
                                    <div className="md:col-span-2 bg-gray-50 p-4 rounded-lg mb-6">
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">Información de la Propiedad</h3>
                                        <div className="mb-4">
                                            <InputLabel htmlFor="departamento_id" value="Departamento" />
                                            <SelectInput
                                                id="departamento_id"
                                                name="departamento_id"
                                                value={data.departamento_id}
                                                onChange={(e) => setData('departamento_id', e.target.value)}
                                                className="mt-1 block w-full"
                                                required
                                            >
                                                <option value="">Seleccione un departamento</option>
                                                {departamentos && departamentos.map((departamento) => (
                                                    <option key={departamento.id} value={departamento.id}>
                                                        {departamento.nombre} - {departamento.ubicacion} - S/ {departamento.precio}
                                                    </option>
                                                ))}
                                            </SelectInput>
                                            <InputError message={errors.departamento_id} className="mt-2" />
                                        </div>

                                        {departamentoSeleccionado && (
                                            <div className="bg-blue-50 p-4 rounded-lg mt-4">
                                                <h4 className="font-medium text-blue-800 mb-2">Detalles del Departamento</h4>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <p className="text-sm text-gray-700"><span className="font-medium">Ubicación:</span> {departamentoSeleccionado.ubicacion}</p>
                                                        <p className="text-sm text-gray-700"><span className="font-medium">Área:</span> {departamentoSeleccionado.area} m²</p>
                                                        <p className="text-sm text-gray-700"><span className="font-medium">Habitaciones:</span> {departamentoSeleccionado.habitaciones}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-700"><span className="font-medium">Baños:</span> {departamentoSeleccionado.banos}</p>
                                                        <p className="text-sm text-gray-700"><span className="font-medium">Estacionamientos:</span> {departamentoSeleccionado.estacionamientos}</p>
                                                        <p className="text-sm text-gray-700"><span className="font-medium">Estado:</span> {departamentoSeleccionado.estado}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Sección de Precios */}
                                    <div className="md:col-span-2 bg-gray-50 p-4 rounded-lg mb-6">
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">Información de Precios</h3>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <InputLabel htmlFor="precio_lista" value="Precio de Lista (S/)" />
                                                <TextInput
                                                    id="precio_lista"
                                                    type="number"
                                                    name="precio_lista"
                                                    value={data.precio_lista}
                                                    className="mt-1 block w-full"
                                                    onChange={(e) => setData('precio_lista', e.target.value)}
                                                    required
                                                />
                                                <InputError message={errors.precio_lista} className="mt-2" />
                                            </div>

                                            <div>
                                                <InputLabel htmlFor="descuento" value="Descuento (S/)" />
                                                <TextInput
                                                    id="descuento"
                                                    type="number"
                                                    name="descuento"
                                                    value={data.descuento}
                                                    className="mt-1 block w-full"
                                                    onChange={(e) => setData('descuento', e.target.value)}
                                                />
                                                <InputError message={errors.descuento} className="mt-2" />
                                            </div>

                                            <div>
                                                <InputLabel htmlFor="precio_final" value="Precio Final (S/)" />
                                                <TextInput
                                                    id="precio_final"
                                                    type="number"
                                                    name="precio_final"
                                                    value={data.precio_final}
                                                    className="mt-1 block w-full bg-gray-100"
                                                    readOnly
                                                />
                                                <InputError message={errors.precio_final} className="mt-2" />
                                            </div>
                                        </div>

                                        <div className="mt-4">
                                            <InputLabel htmlFor="validez_dias" value="Validez de la Cotización (días)" />
                                            <TextInput
                                                id="validez_dias"
                                                type="number"
                                                name="validez_dias"
                                                value={data.validez_dias}
                                                className="mt-1 block w-full"
                                                onChange={(e) => setData('validez_dias', e.target.value)}
                                                required
                                            />
                                            <InputError message={errors.validez_dias} className="mt-2" />
                                        </div>
                                    </div>

                                    {/* Observaciones */}
                                    <div className="md:col-span-2">
                                        <InputLabel htmlFor="observaciones" value="Observaciones" />
                                        <TextareaInput
                                            id="observaciones"
                                            name="observaciones"
                                            value={data.observaciones}
                                            className="mt-1 block w-full"
                                            onChange={(e) => setData('observaciones', e.target.value)}
                                            rows={4}
                                        />
                                        <InputError message={errors.observaciones} className="mt-2" />
                                    </div>
                                </div>

                                <div className="flex items-center justify-end mt-6">
                                    <button
                                        type="submit"
                                        className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:border-indigo-900 focus:ring ring-indigo-300 disabled:opacity-25 transition"
                                        disabled={processing}
                                    >
                                        {processing ? 'Procesando...' : 'Crear Cotización'}
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
