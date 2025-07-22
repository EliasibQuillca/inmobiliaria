import { Head, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';

export default function AdminDashboard({ auth }) {
    // Estado para las diferentes secciones del dashboard
    const [stats, setStats] = useState({
        usuariosTotal: 0,
        asesoresActivos: 0,
        departamentosActivos: 0,
        ventasCompletadas: 0
    });

    // Datos simulados para demostración
    const [actividadesRecientes, setActividadesRecientes] = useState([
        {
            id: 1,
            tipo: 'usuario',
            descripcion: 'Usuario creado: Juan Pérez (Asesor)',
            fecha: '2025-07-20',
            usuario: 'admin@example.com'
        },
        {
            id: 2,
            tipo: 'departamento',
            descripcion: 'Departamento actualizado: Lima 305',
            fecha: '2025-07-19',
            usuario: 'admin@example.com'
        },
        {
            id: 3,
            tipo: 'venta',
            descripcion: 'Venta finalizada: Departamento Magisterio 405',
            fecha: '2025-07-18',
            usuario: 'asesor1@example.com'
        },
        {
            id: 4,
            tipo: 'reporte',
            descripcion: 'Reporte generado: Ventas del mes de Julio',
            fecha: '2025-07-18',
            usuario: 'admin@example.com'
        },
        {
            id: 5,
            tipo: 'usuario',
            descripcion: 'Usuario actualizado: María López (Administrador)',
            fecha: '2025-07-17',
            usuario: 'admin@example.com'
        }
    ]);

    // Función para actualizar estadísticas
    useEffect(() => {
        // En una implementación real, estos datos vendrían de una API
        setStats({
            usuariosTotal: 15,
            asesoresActivos: 8,
            departamentosActivos: 24,
            ventasCompletadas: 35
        });
    }, []);

    return (
        <AdminLayout auth={auth} title="Panel de Administrador">
            <Head title="Panel de Administrador - Inmobiliaria" />

            <div className="py-12 bg-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-gray-900">
                            Panel de Administrador
                        </h2>
                        <p className="mt-1 text-lg text-gray-600">
                            Administre usuarios, propiedades y supervise todas las operaciones
                        </p>
                    </div>

                    {/* Tarjetas de estadísticas */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white overflow-hidden shadow-sm rounded-lg border-l-4 border-indigo-500">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 bg-indigo-100 rounded-md p-3">
                                        <svg className="h-6 w-6 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                        </svg>
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-500 truncate">
                                            Total de Usuarios
                                        </p>
                                        <p className="text-2xl font-semibold text-gray-900">
                                            {stats.usuariosTotal}
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <Link href="/admin/usuarios" className="text-sm text-indigo-600 hover:text-indigo-800">
                                        Gestionar usuarios
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow-sm rounded-lg border-l-4 border-green-500">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                                        <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-500 truncate">
                                            Departamentos Activos
                                        </p>
                                        <p className="text-2xl font-semibold text-gray-900">
                                            {stats.departamentosActivos}
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <Link href="/admin/departamentos" className="text-sm text-green-600 hover:text-green-800">
                                        Gestionar departamentos
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow-sm rounded-lg border-l-4 border-yellow-500">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 bg-yellow-100 rounded-md p-3">
                                        <svg className="h-6 w-6 text-yellow-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-500 truncate">
                                            Asesores Activos
                                        </p>
                                        <p className="text-2xl font-semibold text-gray-900">
                                            {stats.asesoresActivos}
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <Link href="/admin/usuarios?rol=asesor" className="text-sm text-yellow-600 hover:text-yellow-800">
                                        Ver asesores
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow-sm rounded-lg border-l-4 border-blue-500">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                                        <svg className="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-500 truncate">
                                            Ventas Finalizadas
                                        </p>
                                        <p className="text-2xl font-semibold text-gray-900">
                                            {stats.ventasCompletadas}
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <Link href="/admin/reportes" className="text-sm text-blue-600 hover:text-blue-800">
                                        Ver reportes
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Acciones rápidas */}
                    <div className="bg-white overflow-hidden shadow-md rounded-lg mb-8">
                        <div className="px-6 py-5 border-b border-gray-200">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">
                                Acciones Rápidas
                            </h3>
                        </div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <Link href="/admin/usuarios/crear" className="flex items-center p-5 rounded-lg bg-white border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors">
                                <div className="flex-shrink-0 bg-indigo-100 rounded-md p-3">
                                    <svg className="h-6 w-6 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <h4 className="text-base font-medium text-gray-900">Crear Usuario</h4>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Añadir un nuevo usuario al sistema
                                    </p>
                                </div>
                            </Link>

                            <Link href="/admin/departamentos/crear" className="flex items-center p-5 rounded-lg bg-white border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors">
                                <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                                    <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <h4 className="text-base font-medium text-gray-900">Crear Departamento</h4>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Agregar un nuevo departamento al catálogo
                                    </p>
                                </div>
                            </Link>

                            <Link href="/admin/reportes/generar" className="flex items-center p-5 rounded-lg bg-white border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors">
                                <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                                    <svg className="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <h4 className="text-base font-medium text-gray-900">Generar Reporte</h4>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Crear un nuevo reporte de ventas o actividad
                                    </p>
                                </div>
                            </Link>

                            <Link href="/admin/configuracion" className="flex items-center p-5 rounded-lg bg-white border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors">
                                <div className="flex-shrink-0 bg-gray-100 rounded-md p-3">
                                    <svg className="h-6 w-6 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <h4 className="text-base font-medium text-gray-900">Configuración</h4>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Administrar configuraciones del sistema
                                    </p>
                                </div>
                            </Link>
                        </div>
                    </div>

                    {/* Actividades recientes */}
                    <div className="bg-white overflow-hidden shadow-md rounded-lg mb-8">
                        <div className="px-6 py-5 border-b border-gray-200">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">
                                Actividades Recientes
                            </h3>
                        </div>
                        <div className="bg-white overflow-hidden">
                            <ul className="divide-y divide-gray-200">
                                {actividadesRecientes.map((actividad) => (
                                    <li key={actividad.id} className="px-6 py-4">
                                        <div className="flex items-start">
                                            <div className={`flex-shrink-0 rounded-md p-2 ${
                                                actividad.tipo === 'usuario'
                                                ? 'bg-indigo-100 text-indigo-600'
                                                : actividad.tipo === 'departamento'
                                                ? 'bg-green-100 text-green-600'
                                                : actividad.tipo === 'venta'
                                                ? 'bg-yellow-100 text-yellow-600'
                                                : 'bg-blue-100 text-blue-600'
                                            }`}>
                                                {actividad.tipo === 'usuario' && (
                                                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                    </svg>
                                                )}
                                                {actividad.tipo === 'departamento' && (
                                                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                                    </svg>
                                                )}
                                                {actividad.tipo === 'venta' && (
                                                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                )}
                                                {actividad.tipo === 'reporte' && (
                                                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                    </svg>
                                                )}
                                            </div>
                                            <div className="ml-4 flex-1">
                                                <div className="flex items-center justify-between">
                                                    <p className="text-sm font-medium text-gray-900">
                                                        {actividad.descripcion}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        {actividad.fecha}
                                                    </p>
                                                </div>
                                                <div className="mt-1 text-sm text-gray-500">
                                                    Por: {actividad.usuario}
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                            <Link href="/admin/actividades" className="text-sm text-indigo-600 hover:text-indigo-800">
                                Ver todas las actividades →
                            </Link>
                        </div>
                    </div>

                    {/* Panel de rendimiento */}
                    <div className="bg-white overflow-hidden shadow-md rounded-lg">
                        <div className="px-6 py-5 border-b border-gray-200">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">
                                Rendimiento del Sistema
                            </h3>
                        </div>
                        <div className="p-6">
                            <div className="mb-6">
                                <h4 className="text-base font-medium text-gray-700 mb-2">Ventas Mensuales</h4>
                                <div className="h-16 bg-gray-200 rounded-md flex items-end overflow-hidden">
                                    <div className="h-8 w-1/5 bg-indigo-500" title="Enero"></div>
                                    <div className="h-10 w-1/5 bg-indigo-600" title="Febrero"></div>
                                    <div className="h-12 w-1/5 bg-indigo-700" title="Marzo"></div>
                                    <div className="h-14 w-1/5 bg-indigo-800" title="Abril"></div>
                                    <div className="h-16 w-1/5 bg-indigo-900" title="Mayo"></div>
                                </div>
                                <div className="flex justify-between mt-2 text-xs text-gray-500">
                                    <span>Marzo</span>
                                    <span>Abril</span>
                                    <span>Mayo</span>
                                    <span>Junio</span>
                                    <span>Julio</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="text-base font-medium text-gray-700 mb-2">Usuarios por Rol</h4>
                                    <div className="relative pt-1">
                                        <div className="flex mb-2 items-center justify-between">
                                            <div>
                                                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-indigo-600 bg-indigo-200">
                                                    Administradores
                                                </span>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-xs font-semibold inline-block text-indigo-600">
                                                    3
                                                </span>
                                            </div>
                                        </div>
                                        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-indigo-200">
                                            <div style={{ width: "20%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500"></div>
                                        </div>
                                    </div>
                                    <div className="relative pt-1">
                                        <div className="flex mb-2 items-center justify-between">
                                            <div>
                                                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-yellow-600 bg-yellow-200">
                                                    Asesores
                                                </span>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-xs font-semibold inline-block text-yellow-600">
                                                    8
                                                </span>
                                            </div>
                                        </div>
                                        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-yellow-200">
                                            <div style={{ width: "53%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-yellow-500"></div>
                                        </div>
                                    </div>
                                    <div className="relative pt-1">
                                        <div className="flex mb-2 items-center justify-between">
                                            <div>
                                                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-green-600 bg-green-200">
                                                    Clientes
                                                </span>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-xs font-semibold inline-block text-green-600">
                                                    4
                                                </span>
                                            </div>
                                        </div>
                                        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-green-200">
                                            <div style={{ width: "27%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"></div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-base font-medium text-gray-700 mb-2">Estado de Departamentos</h4>
                                    <div className="relative pt-1">
                                        <div className="flex mb-2 items-center justify-between">
                                            <div>
                                                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-green-600 bg-green-200">
                                                    Disponibles
                                                </span>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-xs font-semibold inline-block text-green-600">
                                                    15
                                                </span>
                                            </div>
                                        </div>
                                        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-green-200">
                                            <div style={{ width: "63%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"></div>
                                        </div>
                                    </div>
                                    <div className="relative pt-1">
                                        <div className="flex mb-2 items-center justify-between">
                                            <div>
                                                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-yellow-600 bg-yellow-200">
                                                    Reservados
                                                </span>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-xs font-semibold inline-block text-yellow-600">
                                                    5
                                                </span>
                                            </div>
                                        </div>
                                        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-yellow-200">
                                            <div style={{ width: "21%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-yellow-500"></div>
                                        </div>
                                    </div>
                                    <div className="relative pt-1">
                                        <div className="flex mb-2 items-center justify-between">
                                            <div>
                                                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                                                    Vendidos
                                                </span>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-xs font-semibold inline-block text-blue-600">
                                                    4
                                                </span>
                                            </div>
                                        </div>
                                        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                                            <div style={{ width: "16%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
