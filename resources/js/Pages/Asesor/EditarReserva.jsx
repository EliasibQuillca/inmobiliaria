import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import SelectInput from '@/Components/SelectInput';
import TextArea from '@/Components/TextArea';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { formatCurrency } from '@/utils';

export default function EditarReserva({ auth, reserva, asesores, clientes, departamentos }) {
    const { data, setData, errors, put, processing } = useForm({
        cliente_id: reserva.cliente_id || '',
        asesor_id: reserva.asesor_id || '',
        departamento_id: reserva.departamento_id || '',
        fecha_inicio: reserva.fecha_inicio || '',
        fecha_fin: reserva.fecha_fin || '',
        monto_reserva: reserva.monto_reserva || '',
        monto_total: reserva.monto_total || '',
        notas: reserva.notas || '',
        condiciones: reserva.condiciones || '',
        estado: reserva.estado || 'activa',
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('admin.reservas.update', reserva.id));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Editar Reserva</h2>}
        >
            <Head title="Editar Reserva" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <form onSubmit={submit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <InputLabel htmlFor="cliente_id" value="Cliente" />
                                        <SelectInput
                                            id="cliente_id"
                                            name="cliente_id"
                                            className="mt-1 block w-full"
                                            value={data.cliente_id}
                                            onChange={(e) => setData('cliente_id', e.target.value)}
                                        >
                                            <option value="">Seleccione un cliente</option>
                                            {clientes.map((cliente) => (
                                                <option key={cliente.id} value={cliente.id}>
                                                    {cliente.nombre} {cliente.apellido}
                                                </option>
                                            ))}
                                        </SelectInput>
                                        <InputError message={errors.cliente_id} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="asesor_id" value="Asesor" />
                                        <SelectInput
                                            id="asesor_id"
                                            name="asesor_id"
                                            className="mt-1 block w-full"
                                            value={data.asesor_id}
                                            onChange={(e) => setData('asesor_id', e.target.value)}
                                        >
                                            <option value="">Seleccione un asesor</option>
                                            {asesores.map((asesor) => (
                                                <option key={asesor.id} value={asesor.id}>
                                                    {asesor.nombre} {asesor.apellido}
                                                </option>
                                            ))}
                                        </SelectInput>
                                        <InputError message={errors.asesor_id} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="departamento_id" value="Departamento" />
                                        <SelectInput
                                            id="departamento_id"
                                            name="departamento_id"
                                            className="mt-1 block w-full"
                                            value={data.departamento_id}
                                            onChange={(e) => setData('departamento_id', e.target.value)}
                                        >
                                            <option value="">Seleccione un departamento</option>
                                            {departamentos.map((departamento) => (
                                                <option key={departamento.id} value={departamento.id}>
                                                    {departamento.nombre} - {formatCurrency(departamento.precio)}
                                                </option>
                                            ))}
                                        </SelectInput>
                                        <InputError message={errors.departamento_id} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="estado" value="Estado" />
                                        <SelectInput
                                            id="estado"
                                            name="estado"
                                            className="mt-1 block w-full"
                                            value={data.estado}
                                            onChange={(e) => setData('estado', e.target.value)}
                                        >
                                            <option value="activa">Activa</option>
                                            <option value="cancelada">Cancelada</option>
                                            <option value="completada">Completada</option>
                                        </SelectInput>
                                        <InputError message={errors.estado} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="fecha_inicio" value="Fecha de Inicio" />
                                        <TextInput
                                            id="fecha_inicio"
                                            type="date"
                                            name="fecha_inicio"
                                            value={data.fecha_inicio}
                                            className="mt-1 block w-full"
                                            onChange={(e) => setData('fecha_inicio', e.target.value)}
                                        />
                                        <InputError message={errors.fecha_inicio} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="fecha_fin" value="Fecha de Fin" />
                                        <TextInput
                                            id="fecha_fin"
                                            type="date"
                                            name="fecha_fin"
                                            value={data.fecha_fin}
                                            className="mt-1 block w-full"
                                            onChange={(e) => setData('fecha_fin', e.target.value)}
                                        />
                                        <InputError message={errors.fecha_fin} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="monto_reserva" value="Monto de Reserva" />
                                        <TextInput
                                            id="monto_reserva"
                                            type="number"
                                            name="monto_reserva"
                                            value={data.monto_reserva}
                                            className="mt-1 block w-full"
                                            onChange={(e) => setData('monto_reserva', e.target.value)}
                                        />
                                        <InputError message={errors.monto_reserva} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="monto_total" value="Monto Total" />
                                        <TextInput
                                            id="monto_total"
                                            type="number"
                                            name="monto_total"
                                            value={data.monto_total}
                                            className="mt-1 block w-full"
                                            onChange={(e) => setData('monto_total', e.target.value)}
                                        />
                                        <InputError message={errors.monto_total} className="mt-2" />
                                    </div>
                                </div>

                                <div>
                                    <InputLabel htmlFor="notas" value="Notas" />
                                    <TextArea
                                        id="notas"
                                        name="notas"
                                        value={data.notas}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData('notas', e.target.value)}
                                    />
                                    <InputError message={errors.notas} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="condiciones" value="Condiciones" />
                                    <TextArea
                                        id="condiciones"
                                        name="condiciones"
                                        value={data.condiciones}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData('condiciones', e.target.value)}
                                    />
                                    <InputError message={errors.condiciones} className="mt-2" />
                                </div>

                                <div className="flex items-center justify-end mt-4">
                                    <SecondaryButton
                                        href={route('admin.reservas.index')}
                                        className="mr-4"
                                    >
                                        Cancelar
                                    </SecondaryButton>
                                    <PrimaryButton className="ml-4" disabled={processing}>
                                        Guardar Cambios
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
