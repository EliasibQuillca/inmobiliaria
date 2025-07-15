@extends('layouts.dashboard')

@section('title', 'Dashboard - Inmobiliaria Cusco')
@section('page-title', 'Dashboard')

@section('content')
<div class="space-y-6">
    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
                <div class="flex items-center">
                    <div class="flex-shrink-0">
                        <i class="fas fa-building text-2xl text-blue-600"></i>
                    </div>
                    <div class="ml-5 w-0 flex-1">
                        <dl>
                            <dt class="text-sm font-medium text-gray-500 truncate">
                                Propiedades Activas
                            </dt>
                            <dd class="text-lg font-medium text-gray-900">
                                {{ $stats['propiedades_activas'] ?? 0 }}
                            </dd>
                        </dl>
                    </div>
                </div>
            </div>
        </div>

        <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
                <div class="flex items-center">
                    <div class="flex-shrink-0">
                        <i class="fas fa-images text-2xl text-green-600"></i>
                    </div>
                    <div class="ml-5 w-0 flex-1">
                        <dl>
                            <dt class="text-sm font-medium text-gray-500 truncate">
                                Imágenes Subidas
                            </dt>
                            <dd class="text-lg font-medium text-gray-900">
                                {{ $stats['imagenes_total'] ?? 0 }}
                            </dd>
                        </dl>
                    </div>
                </div>
            </div>
        </div>

        @if(auth()->user()->role === 'asesor' || auth()->user()->role === 'administrador')
            <div class="bg-white overflow-hidden shadow rounded-lg">
                <div class="p-5">
                    <div class="flex items-center">
                        <div class="flex-shrink-0">
                            <i class="fas fa-calculator text-2xl text-yellow-600"></i>
                        </div>
                        <div class="ml-5 w-0 flex-1">
                            <dl>
                                <dt class="text-sm font-medium text-gray-500 truncate">
                                    Cotizaciones Pendientes
                                </dt>
                                <dd class="text-lg font-medium text-gray-900">
                                    {{ $stats['cotizaciones_pendientes'] ?? 0 }}
                                </dd>
                            </dl>
                        </div>
                    </div>
                </div>
            </div>
        @endif

        @if(auth()->user()->role === 'administrador')
            <div class="bg-white overflow-hidden shadow rounded-lg">
                <div class="p-5">
                    <div class="flex items-center">
                        <div class="flex-shrink-0">
                            <i class="fas fa-users text-2xl text-purple-600"></i>
                        </div>
                        <div class="ml-5 w-0 flex-1">
                            <dl>
                                <dt class="text-sm font-medium text-gray-500 truncate">
                                    Usuarios Registrados
                                </dt>
                                <dd class="text-lg font-medium text-gray-900">
                                    {{ $stats['usuarios_total'] ?? 0 }}
                                </dd>
                            </dl>
                        </div>
                    </div>
                </div>
            </div>
        @endif
    </div>

    <!-- Quick Actions -->
    <div class="bg-white shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
            <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
                Acciones Rápidas
            </h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <a href="{{ route('dashboard.propiedades.create') }}"
                   class="relative group bg-white p-6 rounded-lg border border-gray-300 hover:border-blue-500 hover:shadow-md transition-all duration-200">
                    <div>
                        <span class="rounded-lg inline-flex p-3 bg-blue-50 text-blue-600 group-hover:bg-blue-100">
                            <i class="fas fa-plus text-xl"></i>
                        </span>
                    </div>
                    <div class="mt-4">
                        <h3 class="text-lg font-medium text-gray-900">
                            Nueva Propiedad
                        </h3>
                        <p class="mt-2 text-sm text-gray-500">
                            Agregar una nueva propiedad al catálogo
                        </p>
                    </div>
                </a>

                <a href="{{ route('dashboard.imagenes.create') }}"
                   class="relative group bg-white p-6 rounded-lg border border-gray-300 hover:border-green-500 hover:shadow-md transition-all duration-200">
                    <div>
                        <span class="rounded-lg inline-flex p-3 bg-green-50 text-green-600 group-hover:bg-green-100">
                            <i class="fas fa-upload text-xl"></i>
                        </span>
                    </div>
                    <div class="mt-4">
                        <h3 class="text-lg font-medium text-gray-900">
                            Subir Imágenes
                        </h3>
                        <p class="mt-2 text-sm text-gray-500">
                            Agregar imágenes a las propiedades
                        </p>
                    </div>
                </a>

                @if(auth()->user()->role === 'administrador')
                    <a href="{{ route('dashboard.users.create') }}"
                       class="relative group bg-white p-6 rounded-lg border border-gray-300 hover:border-purple-500 hover:shadow-md transition-all duration-200">
                        <div>
                            <span class="rounded-lg inline-flex p-3 bg-purple-50 text-purple-600 group-hover:bg-purple-100">
                                <i class="fas fa-user-plus text-xl"></i>
                            </span>
                        </div>
                        <div class="mt-4">
                            <h3 class="text-lg font-medium text-gray-900">
                                Nuevo Usuario
                            </h3>
                            <p class="mt-2 text-sm text-gray-500">
                                Crear una nueva cuenta de usuario
                            </p>
                        </div>
                    </a>
                @endif
            </div>
        </div>
    </div>

    <!-- Recent Activity -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="bg-white shadow rounded-lg">
            <div class="px-4 py-5 sm:p-6">
                <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
                    Propiedades Recientes
                </h3>
                @if(isset($propiedades_recientes) && count($propiedades_recientes) > 0)
                    <div class="space-y-3">
                        @foreach($propiedades_recientes as $propiedad)
                            <div class="flex items-center space-x-3">
                                <div class="flex-shrink-0">
                                    <i class="fas fa-building text-blue-600"></i>
                                </div>
                                <div class="flex-1 min-w-0">
                                    <p class="text-sm font-medium text-gray-900 truncate">
                                        {{ $propiedad->titulo }}
                                    </p>
                                    <p class="text-sm text-gray-500">
                                        {{ $propiedad->precio_formateado }}
                                    </p>
                                </div>
                                <div class="flex-shrink-0">
                                    <a href="{{ route('dashboard.propiedades.show', $propiedad) }}"
                                       class="text-blue-600 hover:text-blue-500">
                                        <i class="fas fa-eye"></i>
                                    </a>
                                </div>
                            </div>
                        @endforeach
                    </div>
                @else
                    <p class="text-sm text-gray-500">No hay propiedades registradas aún.</p>
                @endif
            </div>
        </div>

        @if(auth()->user()->role === 'asesor' || auth()->user()->role === 'administrador')
            <div class="bg-white shadow rounded-lg">
                <div class="px-4 py-5 sm:p-6">
                    <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
                        Contactos Recientes
                    </h3>
                    @if(isset($contactos_recientes) && count($contactos_recientes) > 0)
                        <div class="space-y-3">
                            @foreach($contactos_recientes as $contacto)
                                <div class="flex items-center space-x-3">
                                    <div class="flex-shrink-0">
                                        <i class="fas fa-user text-green-600"></i>
                                    </div>
                                    <div class="flex-1 min-w-0">
                                        <p class="text-sm font-medium text-gray-900 truncate">
                                            {{ $contacto->nombre }}
                                        </p>
                                        <p class="text-sm text-gray-500">
                                            {{ $contacto->email }}
                                        </p>
                                    </div>
                                    <div class="flex-shrink-0">
                                        <span class="text-xs text-gray-400">
                                            {{ $contacto->created_at->diffForHumans() }}
                                        </span>
                                    </div>
                                </div>
                            @endforeach
                        </div>
                    @else
                        <p class="text-sm text-gray-500">No hay contactos recientes.</p>
                    @endif
                </div>
            </div>
        @endif
    </div>
</div>
@endsection
