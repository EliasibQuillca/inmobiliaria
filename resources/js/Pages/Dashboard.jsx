import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';

export default function Dashboard() {
    // Mock data - in a real application, this would come from the backend
    const stats = [
        { id: 1, name: 'Propiedades Activas', stat: '42', icon: 'M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25', change: '+8%' },
        { id: 2, name: 'Visitas Programadas', stat: '12', icon: 'M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5', change: '+2%' },
        { id: 3, name: 'Ventas del Mes', stat: '3', icon: 'M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 01-.75.75h-.75m0-1.5h.75a.75.75 0 01.75.75v.75m0 0H18.75m.75.75v-.75a.75.75 0 00-.75-.75H18.75m.75.75H18a.75.75 0 01-.75-.75v-.75m.75.75v.75', change: '+48%' },
        { id: 4, name: 'Clientes Nuevos', stat: '9', icon: 'M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z', change: '+12%' },
    ];

    // Upcoming appointments
    const appointments = [
        { id: 1, clientName: 'Ana García', property: 'Apartamento 301 Torre Norte', date: '2023-06-30', time: '10:00', status: 'confirmed' },
        { id: 2, clientName: 'Carlos Martínez', property: 'Casa Campestre Las Palmas', date: '2023-06-30', time: '14:30', status: 'pending' },
        { id: 3, clientName: 'María López', property: 'Oficina 401 Edificio Centro', date: '2023-07-01', time: '09:00', status: 'confirmed' },
    ];

    // Recent activities
    const activities = [
        { id: 1, type: 'property_added', user: 'Juliana Torres', description: 'Agregó una nueva propiedad: Apartamento 502 Torre Sur', time: '2 horas' },
        { id: 2, type: 'client_contact', user: 'Roberto Silva', description: 'Contactó a cliente: Diego Ramírez por Casa Campestre', time: '5 horas' },
        { id: 3, type: 'sale_completed', user: 'Camila Ruiz', description: 'Completó venta: Apartamento 301 a Juan Pérez', time: '1 día' },
        { id: 4, type: 'property_visit', user: 'Andrés Gómez', description: 'Programó visita: Casa Colonial con María López', time: '1 día' },
    ];

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Stats */}
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {stats.map((item) => (
                            <div
                                key={item.id}
                                className="rounded-lg bg-white p-6 shadow-sm transition-all hover:shadow-md"
                            >
                                <div className="flex items-center">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-100 text-teal-600">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                                        </svg>
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-lg font-semibold text-gray-900">{item.stat}</h3>
                                        <p className="text-sm text-gray-500">{item.name}</p>
                                    </div>
                                </div>
                                <div className="mt-2 text-right">
                                    <span className="text-sm font-medium text-teal-600">{item.change}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Main content */}
                    <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
                        {/* Properties Quick Access */}
                        <div className="col-span-2 rounded-lg bg-white p-6 shadow-sm">
                            <div className="mb-4 flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-900">Propiedades Destacadas</h3>
                                <button className="rounded-md bg-teal-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-teal-700">
                                    Ver Todas
                                </button>
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {[1, 2, 3].map((item) => (
                                    <div key={item} className="overflow-hidden rounded-lg border border-gray-200 bg-white">
                                        <div className="relative h-36 bg-gray-200">
                                            <div className="absolute left-2 top-2 rounded-md bg-teal-600 px-2 py-1 text-xs font-medium text-white">
                                                Destacada
                                            </div>
                                        </div>
                                        <div className="p-4">
                                            <h4 className="mb-1 font-medium text-gray-900">Apartamento {item}01</h4>
                                            <p className="mb-2 text-sm text-gray-500">Sector Norte, 3 hab, 2 baños</p>
                                            <div className="font-semibold text-teal-600">$320,000,000</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Upcoming Appointments */}
                        <div className="rounded-lg bg-white p-6 shadow-sm">
                            <h3 className="mb-4 text-lg font-semibold text-gray-900">Próximas Citas</h3>
                            <div className="space-y-4">
                                {appointments.map((appointment) => (
                                    <div key={appointment.id} className="rounded-md border border-gray-200 p-3">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h4 className="font-medium text-gray-900">{appointment.clientName}</h4>
                                                <p className="text-sm text-gray-500">{appointment.property}</p>
                                                <div className="mt-1 flex items-center text-xs text-gray-500">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="mr-1 h-4 w-4">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                                                    </svg>
                                                    {appointment.date} a las {appointment.time}
                                                </div>
                                            </div>
                                            <span className={`rounded-full px-2 py-1 text-xs font-medium ${
                                                appointment.status === 'confirmed'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {appointment.status === 'confirmed' ? 'Confirmada' : 'Pendiente'}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                                <button className="mt-2 w-full rounded-md border border-gray-300 bg-white py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">
                                    Ver Todas las Citas
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="mt-8 rounded-lg bg-white p-6 shadow-sm">
                        <h3 className="mb-4 text-lg font-semibold text-gray-900">Actividad Reciente</h3>
                        <div className="space-y-4">
                            {activities.map((activity) => (
                                <div key={activity.id} className="flex items-start space-x-3">
                                    <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${
                                        activity.type === 'property_added'
                                            ? 'bg-blue-100 text-blue-600'
                                            : activity.type === 'client_contact'
                                            ? 'bg-purple-100 text-purple-600'
                                            : activity.type === 'sale_completed'
                                            ? 'bg-green-100 text-green-600'
                                            : 'bg-amber-100 text-amber-600'
                                    }`}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d={
                                                activity.type === 'property_added'
                                                    ? 'M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25'
                                                    : activity.type === 'client_contact'
                                                    ? 'M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z'
                                                    : activity.type === 'sale_completed'
                                                    ? 'M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 01-.75.75h-.75m0-1.5h.75a.75.75 0 01.75.75v.75m0 0H18.75m.75.75v-.75a.75.75 0 00-.75-.75H18.75m.75.75H18a.75.75 0 01-.75-.75v-.75m.75.75v.75'
                                                    : 'M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5'
                                            } />
                                        </svg>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <p className="font-medium text-gray-900">{activity.user}</p>
                                            <span className="text-xs text-gray-500">hace {activity.time}</span>
                                        </div>
                                        <p className="text-sm text-gray-600">{activity.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
