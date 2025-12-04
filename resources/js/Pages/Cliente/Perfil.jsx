import React, { useState } from 'react';
import { Head, useForm, usePage, Link, router } from '@inertiajs/react';
import ClienteLayout from '@/Layouts/ClienteLayout';
import Card from '@/Components/DS/Card';
import Button from '@/Components/DS/Button';
import Input from '@/Components/DS/Input';

export default function Perfil({ auth, cliente }) {
    const [activeTab, setActiveTab] = useState('datos-personales');
    const [showPreferences, setShowPreferences] = useState(false);
    const [showAdditional, setShowAdditional] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const { flash } = usePage().props;

    // Formulario de datos personales
    const { data, setData, put, processing, errors, reset } = useForm({
        // Información personal
        nombre: cliente.nombre || '',
        dni: cliente.dni || '',
        telefono: cliente.telefono || '',
        email: cliente.email || '',
        fecha_nacimiento: cliente.fecha_nacimiento ? cliente.fecha_nacimiento.split('T')[0] : '',

        // Preferencias de búsqueda (dejar vacío si no hay valor)
        tipo_propiedad: cliente.tipo_propiedad || '',
        habitaciones_deseadas: cliente.habitaciones_deseadas || '',
        presupuesto_min: cliente.presupuesto_min || '',
        presupuesto_max: cliente.presupuesto_max || '',
        zona_preferida: cliente.zona_preferida || '',

        // Información adicional (opcional)
        direccion: cliente.direccion || '',
        ciudad: cliente.ciudad || '',
        ocupacion: cliente.ocupacion || '',
        estado_civil: cliente.estado_civil || '',
        ingresos_mensuales: cliente.ingresos_mensuales || '',
        
        // Contraseña para confirmar cambios
        current_password: '',
    });

    // Formulario de cambio de contraseña
    const passwordForm = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        reset();
        setIsEditing(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setShowPasswordModal(true);
    };

    const confirmUpdate = (e) => {
        e.preventDefault();
        
        // Verificar que la contraseña no esté vacía
        const password = passwordForm.data.current_password;
        if (!password || password.trim() === '') {
            console.error('La contraseña está vacía');
            return;
        }
        
        // Preparar datos manualmente
        const submitData = {};
        Object.keys(data).forEach(key => {
            // Convertir strings vacíos a null
            submitData[key] = data[key] === '' ? null : data[key];
        });
        
        // Agregar la contraseña
        submitData.current_password = password;
        
        console.log('📤 Datos a enviar:', submitData);
        console.log('🔑 Contraseña incluida:', submitData.current_password ? 'SÍ' : 'NO');
        console.log('🏠 tipo_propiedad valor:', submitData.tipo_propiedad, 'tipo:', typeof submitData.tipo_propiedad);
        
        // Usar router.put directamente con datos preparados
        router.put('/cliente/perfil', submitData, {
            preserveScroll: false,
            onSuccess: () => {
                console.log('✅ Actualización exitosa');
                setShowPasswordModal(false);
                setIsEditing(false);
                passwordForm.reset();
                // No hacer redirect manual, dejar que Inertia maneje la respuesta
            },
            onError: (errors) => {
                console.error('❌ Errores de validación:', errors);
            },
            onFinish: () => {
                console.log('✔️ Petición finalizada');
            }
        });
    };

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        passwordForm.put('/cliente/perfil/password', {
            preserveScroll: true,
            onSuccess: () => {
                passwordForm.reset();
            },
        });
    };

    return (
        <ClienteLayout>
            <Head title="Mi Perfil" />

            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Mi Perfil</h1>
                                <p className="mt-1 text-sm text-gray-600">
                                    Gestiona tu información personal
                                </p>
                            </div>
                            <Button
                                href={route('cliente.dashboard')}
                                variant="secondary"
                            >
                                <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Volver al Panel
                            </Button>
                        </div>
                    </div>

                    {/* Mensajes Flash */}
                    {flash?.success && (
                        <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                            {flash.success}
                        </div>
                    )}
                    {flash?.error && (
                        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                            {flash.error}
                        </div>
                    )}

                    {/* Tabs */}
                    <Card className="overflow-hidden">
                        <div className="border-b border-gray-200">
                            <nav className="-mb-px flex">
                                <button
                                    onClick={() => setActiveTab('datos-personales')}
                                    className={`${
                                        activeTab === 'datos-personales'
                                            ? 'border-primary-500 text-primary-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm`}
                                >
                                    <svg className="inline-block mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    Datos Personales
                                </button>
                                <button
                                    onClick={() => setActiveTab('seguridad')}
                                    className={`${
                                        activeTab === 'seguridad'
                                            ? 'border-primary-500 text-primary-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm ml-8`}
                                >
                                    <svg className="inline-block mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                    Seguridad
                                </button>
                            </nav>
                        </div>

                        {/* Contenido de Datos Personales */}
                        {activeTab === 'datos-personales' && (
                            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                                {/* Sección: Información Personal */}
                                <div>
                                    <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center">
                                        <svg className="mr-2 h-5 w-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        Información Personal
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Nombre Completo */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                Nombre Completo *
                                            </label>
                                            <Input
                                                type="text"
                                                value={data.nombre}
                                                onChange={(e) => setData('nombre', e.target.value)}
                                                placeholder="Ej: Juan Pérez García"
                                                disabled={!isEditing}
                                                className={`w-full ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                                                error={errors.nombre}
                                                required
                                            />
                                            {errors.nombre && (
                                                <p className="mt-1 text-xs text-red-600">{errors.nombre}</p>
                                            )}
                                        </div>

                                        {/* DNI */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                DNI *
                                            </label>
                                            <Input
                                                type="text"
                                                value={data.dni}
                                                onChange={(e) => setData('dni', e.target.value)}
                                                maxLength="8"
                                                placeholder="11111111"
                                                disabled={!isEditing}
                                                className={`w-full ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                                                error={errors.dni}
                                                required
                                            />
                                            {errors.dni && (
                                                <p className="mt-1 text-xs text-red-600">{errors.dni}</p>
                                            )}
                                            <p className="mt-0.5 text-xs text-gray-500">8 dígitos</p>
                                        </div>

                                        {/* Teléfono */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                Teléfono <span className="text-gray-400 text-xs">(Opcional)</span>
                                            </label>
                                            <Input
                                                type="tel"
                                                value={data.telefono}
                                                onChange={(e) => setData('telefono', e.target.value)}
                                                placeholder="987654321"
                                                disabled={!isEditing}
                                                className={`w-full ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                                                error={errors.telefono}
                                            />
                                            {errors.telefono && (
                                                <p className="mt-1 text-xs text-red-600">{errors.telefono}</p>
                                            )}
                                        </div>

                                        {/* Fecha de Nacimiento */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                Fecha de Nacimiento *
                                            </label>
                                            <Input
                                                type="date"
                                                value={data.fecha_nacimiento}
                                                onChange={(e) => setData('fecha_nacimiento', e.target.value)}
                                                max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
                                                disabled={!isEditing}
                                                className={`w-full ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                                                error={errors.fecha_nacimiento}
                                                required
                                            />
                                            {errors.fecha_nacimiento && (
                                                <p className="mt-1 text-xs text-red-600">{errors.fecha_nacimiento}</p>
                                            )}
                                            <p className="mt-0.5 text-xs text-gray-500">Debes ser mayor de 18 años</p>
                                        </div>

                                        {/* Edad (calculada automáticamente) */}
                                        {cliente.edad && (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                    Edad
                                                </label>
                                                <div className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-600">
                                                    {cliente.edad} años
                                                </div>
                                                <p className="mt-0.5 text-xs text-gray-500">Calculada automáticamente</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Sección: Preferencias de Búsqueda - Colapsable */}
                                <div className="border border-gray-200 rounded-lg">
                                    <button
                                        type="button"
                                        onClick={() => setShowPreferences(!showPreferences)}
                                        className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50 transition-colors rounded-lg"
                                    >
                                        <div className="flex items-center">
                                            <svg className="mr-2 h-5 w-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                            </svg>
                                            <div>
                                                <h3 className="text-base font-semibold text-gray-900">
                                                    Preferencias de Búsqueda
                                                    <span className="ml-2 text-sm text-gray-500 font-normal">(Opcional)</span>
                                                </h3>
                                                <p className="text-xs text-gray-600 mt-0.5">
                                                    Recibe mejores recomendaciones personalizadas
                                                </p>
                                            </div>
                                        </div>
                                        <svg 
                                            className={`h-5 w-5 text-gray-400 transition-transform ${showPreferences ? 'rotate-180' : ''}`} 
                                            fill="none" 
                                            stroke="currentColor" 
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    
                                    {showPreferences && (
                                        <div className="px-4 pb-4 pt-2 border-t border-gray-200">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {/* Tipo de Propiedad */}
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                        Tipo de Propiedad
                                                    </label>
                                                    <select
                                                        value={data.tipo_propiedad}
                                                        onChange={(e) => setData('tipo_propiedad', e.target.value)}
                                                        disabled={!isEditing}
                                                        className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm ${
                                                            !isEditing ? 'bg-gray-50 cursor-not-allowed' : ''
                                                        }`}
                                                    >
                                                        <option value="">Seleccionar...</option>
                                                        <option value="departamento">Departamento</option>
                                                        <option value="casa">Casa</option>
                                                        <option value="oficina">Oficina</option>
                                                        <option value="local_comercial">Local Comercial</option>
                                                        <option value="terreno">Terreno</option>
                                                    </select>
                                                </div>

                                                {/* Habitaciones Deseadas */}
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                        N° Habitaciones
                                                    </label>
                                                    <select
                                                        value={data.habitaciones_deseadas}
                                                        onChange={(e) => setData('habitaciones_deseadas', e.target.value)}
                                                        disabled={!isEditing}
                                                        className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm ${
                                                            !isEditing ? 'bg-gray-50 cursor-not-allowed' : ''
                                                        }`}
                                                    >
                                                        <option value="">Seleccionar...</option>
                                                        <option value="1">1</option>
                                                        <option value="2">2</option>
                                                        <option value="3">3</option>
                                                        <option value="4">4</option>
                                                        <option value="5+">5+</option>
                                                    </select>
                                                </div>

                                                {/* Presupuesto Mínimo */}
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                        Presupuesto Mín. (S/)
                                                    </label>
                                                    <Input
                                                        type="number"
                                                        value={data.presupuesto_min}
                                                        onChange={(e) => setData('presupuesto_min', e.target.value)}
                                                        placeholder="150000"
                                                        step="1000"
                                                        disabled={!isEditing}
                                                        className={`w-full ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                                                    />
                                                </div>

                                                {/* Presupuesto Máximo */}
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                        Presupuesto Máx. (S/)
                                                    </label>
                                                    <Input
                                                        type="number"
                                                        value={data.presupuesto_max}
                                                        onChange={(e) => setData('presupuesto_max', e.target.value)}
                                                        placeholder="300000"
                                                        step="1000"
                                                        disabled={!isEditing}
                                                        className={`w-full ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                                                    />
                                                </div>

                                                {/* Zona Preferida */}
                                                <div className="md:col-span-2">
                                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                        Zona Preferida
                                                    </label>
                                                    <Input
                                                        type="text"
                                                        value={data.zona_preferida}
                                                        onChange={(e) => setData('zona_preferida', e.target.value)}
                                                        placeholder="Ej: Miraflores, San Isidro, Surco..."
                                                        disabled={!isEditing}
                                                        className={`w-full ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Sección: Información Adicional - Colapsable */}
                                <div className="border border-gray-200 rounded-lg">
                                    <button
                                        type="button"
                                        onClick={() => setShowAdditional(!showAdditional)}
                                        className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50 transition-colors rounded-lg"
                                    >
                                        <div className="flex items-center">
                                            <svg className="mr-2 h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <div>
                                                <h3 className="text-base font-semibold text-gray-900">
                                                    Información Adicional
                                                    <span className="ml-2 text-sm text-gray-500 font-normal">(Opcional)</span>
                                                </h3>
                                                <p className="text-xs text-gray-600 mt-0.5">
                                                    Ayuda a evaluar capacidad crediticia
                                                </p>
                                            </div>
                                        </div>
                                        <svg 
                                            className={`h-5 w-5 text-gray-400 transition-transform ${showAdditional ? 'rotate-180' : ''}`} 
                                            fill="none" 
                                            stroke="currentColor" 
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    
                                    {showAdditional && (
                                        <div className="px-4 pb-4 pt-2 border-t border-gray-200">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {/* Dirección */}
                                                <div className="md:col-span-2">
                                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                        Dirección Actual
                                                    </label>
                                                    <Input
                                                        type="text"
                                                        value={data.direccion}
                                                        onChange={(e) => setData('direccion', e.target.value)}
                                                        placeholder="Av. Principal 123, Dpto 101"
                                                        disabled={!isEditing}
                                                        className={`w-full ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                                                    />
                                                </div>

                                                {/* Ciudad */}
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                        Ciudad
                                                    </label>
                                                    <Input
                                                        type="text"
                                                        value={data.ciudad}
                                                        onChange={(e) => setData('ciudad', e.target.value)}
                                                        placeholder="Lima"
                                                        disabled={!isEditing}
                                                        className={`w-full ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                                                    />
                                                </div>

                                                {/* Ocupación */}
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                        Ocupación
                                                    </label>
                                                    <Input
                                                        type="text"
                                                        value={data.ocupacion}
                                                        onChange={(e) => setData('ocupacion', e.target.value)}
                                                        placeholder="Ej: Ingeniero"
                                                        disabled={!isEditing}
                                                        className={`w-full ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                                                    />
                                                </div>

                                                {/* Estado Civil */}
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                        Estado Civil
                                                    </label>
                                                    <select
                                                        value={data.estado_civil}
                                                        onChange={(e) => setData('estado_civil', e.target.value)}
                                                        disabled={!isEditing}
                                                        className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm ${
                                                            !isEditing ? 'bg-gray-50 cursor-not-allowed' : ''
                                                        }`}
                                                    >
                                                        <option value="">Seleccionar...</option>
                                                        <option value="soltero">Soltero/a</option>
                                                        <option value="casado">Casado/a</option>
                                                        <option value="divorciado">Divorciado/a</option>
                                                        <option value="viudo">Viudo/a</option>
                                                        <option value="conviviente">Conviviente</option>
                                                    </select>
                                                </div>

                                                {/* Ingresos Mensuales */}
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                        Ingresos Mensuales (S/)
                                                    </label>
                                                    <Input
                                                        type="number"
                                                        value={data.ingresos_mensuales}
                                                        onChange={(e) => setData('ingresos_mensuales', e.target.value)}
                                                        placeholder="5000"
                                                        step="100"
                                                        disabled={!isEditing}
                                                        className={`w-full ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                                                    />
                                                    <p className="mt-0.5 text-xs text-gray-500">Información confidencial</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Botones de acción */}
                                <div className="flex justify-end gap-3 pt-4">
                                    {!isEditing ? (
                                        <Button
                                            type="button"
                                            onClick={handleEditClick}
                                            variant="primary"
                                        >
                                            <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                            Editar Perfil
                                        </Button>
                                    ) : (
                                        <>
                                            <Button
                                                type="button"
                                                onClick={handleCancelEdit}
                                                variant="secondary"
                                            >
                                                <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                                Cancelar
                                            </Button>
                                            <Button
                                                type="submit"
                                                disabled={processing}
                                                variant="primary"
                                            >
                                                {processing ? (
                                                    <>
                                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                        Guardando...
                                                    </>
                                                ) : (
                                                    <>
                                                        <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                        Guardar Cambios
                                                    </>
                                                )}
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </form>
                        )}

                        {/* Contenido de Seguridad */}
                        {activeTab === 'seguridad' && (
                            <div className="p-6 space-y-8">
                                {/* Sección: Datos de Cuenta */}
                                <div className="max-w-xl">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                                        <svg className="mr-2 h-5 w-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        Datos de Cuenta
                                    </h3>
                                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                        <div className="space-y-4">
                                            {/* Email */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Email de Acceso *
                                                </label>
                                                <Input
                                                    type="email"
                                                    value={data.email}
                                                    onChange={(e) => setData('email', e.target.value)}
                                                    placeholder="correo@ejemplo.com"
                                                    disabled={!isEditing}
                                                    className={`w-full ${!isEditing ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
                                                    error={errors.email}
                                                    required
                                                />
                                                {errors.email && (
                                                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                                                )}
                                                <p className="mt-1 text-xs text-gray-500">Este correo se usa para iniciar sesión</p>
                                            </div>
                                            
                                            {/* Botones de acción para datos de cuenta */}
                                            <div className="flex justify-end gap-3 pt-2">
                                                {!isEditing ? (
                                                    <Button
                                                        type="button"
                                                        onClick={handleEditClick}
                                                        variant="primary"
                                                    >
                                                        <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                        Editar Email
                                                    </Button>
                                                ) : (
                                                    <>
                                                        <Button
                                                            type="button"
                                                            onClick={handleCancelEdit}
                                                            variant="secondary"
                                                        >
                                                            <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                            </svg>
                                                            Cancelar
                                                        </Button>
                                                        <Button
                                                            type="button"
                                                            onClick={handleSubmit}
                                                            disabled={processing}
                                                            variant="primary"
                                                        >
                                                            {processing ? (
                                                                <>
                                                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                                    </svg>
                                                                    Guardando...
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                                    </svg>
                                                                    Guardar Cambios
                                                                </>
                                                            )}
                                                        </Button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Sección: Cambiar Contraseña */}
                                <form onSubmit={handlePasswordSubmit} className="max-w-xl">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                                        <svg className="mr-2 h-5 w-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                        Cambiar Contraseña
                                    </h3>

                                    <div className="space-y-6">
                                        {/* Contraseña Actual */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Contraseña Actual *
                                            </label>
                                            <Input
                                                type="password"
                                                value={passwordForm.data.current_password}
                                                onChange={(e) => passwordForm.setData('current_password', e.target.value)}
                                                className="w-full"
                                                error={passwordForm.errors.current_password}
                                                required
                                            />
                                            {passwordForm.errors.current_password && (
                                                <p className="mt-1 text-sm text-red-600">{passwordForm.errors.current_password}</p>
                                            )}
                                        </div>

                                        {/* Nueva Contraseña */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Nueva Contraseña *
                                            </label>
                                            <Input
                                                type="password"
                                                value={passwordForm.data.password}
                                                onChange={(e) => passwordForm.setData('password', e.target.value)}
                                                minLength="8"
                                                className="w-full"
                                                error={passwordForm.errors.password}
                                                required
                                            />
                                            {passwordForm.errors.password && (
                                                <p className="mt-1 text-sm text-red-600">{passwordForm.errors.password}</p>
                                            )}
                                            <p className="mt-1 text-xs text-gray-500">Mínimo 8 caracteres</p>
                                        </div>

                                        {/* Confirmar Contraseña */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Confirmar Nueva Contraseña *
                                            </label>
                                            <Input
                                                type="password"
                                                value={passwordForm.data.password_confirmation}
                                                onChange={(e) => passwordForm.setData('password_confirmation', e.target.value)}
                                                minLength="8"
                                                className="w-full"
                                                error={passwordForm.errors.password_confirmation}
                                                required
                                            />
                                            {passwordForm.errors.password_confirmation && (
                                                <p className="mt-1 text-sm text-red-600">{passwordForm.errors.password_confirmation}</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Botón de Cambiar Contraseña */}
                                    <div className="mt-6">
                                        <Button
                                            type="submit"
                                            disabled={passwordForm.processing}
                                            variant="primary"
                                        >
                                            {passwordForm.processing ? 'Cambiando...' : 'Cambiar Contraseña'}
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </Card>
                </div>
            </div>

            {/* Modal de Confirmación de Contraseña */}
            {showPasswordModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <Card className="max-w-md w-full p-6">
                        <div className="flex items-center mb-4">
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                                <svg className="h-6 w-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <h3 className="ml-3 text-lg font-medium text-gray-900">
                                Confirmar Cambios
                            </h3>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-4">
                            Por seguridad, ingresa tu contraseña actual para confirmar los cambios en tu perfil.
                        </p>

                        <form onSubmit={confirmUpdate}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Contraseña Actual *
                                </label>
                                <Input
                                    type="password"
                                    value={passwordForm.data.current_password}
                                    onChange={(e) => passwordForm.setData('current_password', e.target.value)}
                                    className="w-full"
                                    placeholder="••••••••"
                                    required
                                    autoFocus
                                    error={errors.current_password}
                                />
                                {errors.current_password && (
                                    <p className="mt-1 text-sm text-red-600 font-medium">{errors.current_password}</p>
                                )}
                            </div>

                            <div className="flex gap-3 justify-end">
                                <Button
                                    type="button"
                                    onClick={() => {
                                        setShowPasswordModal(false);
                                        passwordForm.reset('current_password');
                                    }}
                                    disabled={processing}
                                    variant="secondary"
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    variant="primary"
                                >
                                    {processing ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Confirmando...
                                        </>
                                    ) : (
                                        'Confirmar'
                                    )}
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>
            )}
        </ClienteLayout>
    );
}
