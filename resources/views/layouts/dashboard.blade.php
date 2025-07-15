<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title', 'Dashboard - Inmobiliaria Cusco')</title>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>
<body class="bg-gray-100">
    <!-- Sidebar -->
    <div x-data="{ sidebarOpen: false }" class="flex h-screen bg-gray-100">
        <!-- Mobile sidebar backdrop -->
        <div x-show="sidebarOpen" x-transition:enter="transition-opacity ease-linear duration-300" x-transition:enter-start="opacity-0" x-transition:enter-end="opacity-100" x-transition:leave="transition-opacity ease-linear duration-300" x-transition:leave-start="opacity-100" x-transition:leave-end="opacity-0" class="fixed inset-0 z-30 bg-gray-900 opacity-50 lg:hidden" @click="sidebarOpen = false"></div>

        <!-- Sidebar -->
        <div x-show="sidebarOpen" x-transition:enter="transition ease-in-out duration-300 transform" x-transition:enter-start="-translate-x-full" x-transition:enter-end="translate-x-0" x-transition:leave="transition ease-in-out duration-300 transform" x-transition:leave-start="translate-x-0" x-transition:leave-end="-translate-x-full" class="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg lg:static lg:translate-x-0 lg:inset-0">
            <div class="flex items-center justify-center h-16 bg-blue-600">
                <h2 class="text-xl font-bold text-white">Panel de Control</h2>
            </div>

            <nav class="mt-8">
                <div class="px-4">
                    <p class="text-xs font-semibold text-gray-600 uppercase tracking-wider">Menú Principal</p>
                </div>

                <div class="mt-4 space-y-1">
                    <a href="{{ route('dashboard') }}" class="flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 {{ request()->routeIs('dashboard') ? 'bg-gray-100 text-gray-900 border-r-2 border-blue-600' : '' }}">
                        <i class="fas fa-chart-line mr-3 text-gray-400"></i>
                        Dashboard
                    </a>

                    @if(auth()->user()->role === 'administrador')
                        <a href="{{ route('dashboard.users') }}" class="flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 {{ request()->routeIs('dashboard.users*') ? 'bg-gray-100 text-gray-900 border-r-2 border-blue-600' : '' }}">
                            <i class="fas fa-users mr-3 text-gray-400"></i>
                            Usuarios
                        </a>
                    @endif

                    <a href="{{ route('dashboard.propiedades') }}" class="flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 {{ request()->routeIs('dashboard.propiedades*') ? 'bg-gray-100 text-gray-900 border-r-2 border-blue-600' : '' }}">
                        <i class="fas fa-building mr-3 text-gray-400"></i>
                        Propiedades
                    </a>

                    <a href="{{ route('dashboard.imagenes') }}" class="flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 {{ request()->routeIs('dashboard.imagenes*') ? 'bg-gray-100 text-gray-900 border-r-2 border-blue-600' : '' }}">
                        <i class="fas fa-images mr-3 text-gray-400"></i>
                        Imágenes
                    </a>

                    @if(auth()->user()->role === 'asesor' || auth()->user()->role === 'administrador')
                        <a href="{{ route('dashboard.cotizaciones') }}" class="flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 {{ request()->routeIs('dashboard.cotizaciones*') ? 'bg-gray-100 text-gray-900 border-r-2 border-blue-600' : '' }}">
                            <i class="fas fa-calculator mr-3 text-gray-400"></i>
                            Cotizaciones
                        </a>
                    @endif
                </div>

                <div class="mt-8 px-4">
                    <p class="text-xs font-semibold text-gray-600 uppercase tracking-wider">Cuenta</p>
                </div>

                <div class="mt-4 space-y-1">
                    <a href="{{ route('dashboard.perfil') }}" class="flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900">
                        <i class="fas fa-user mr-3 text-gray-400"></i>
                        Mi Perfil
                    </a>

                    <form action="{{ route('logout') }}" method="POST" class="w-full">
                        @csrf
                        <button type="submit" class="flex items-center w-full px-4 py-2 text-sm font-medium text-left text-gray-700 hover:bg-gray-100 hover:text-gray-900">
                            <i class="fas fa-sign-out-alt mr-3 text-gray-400"></i>
                            Cerrar Sesión
                        </button>
                    </form>
                </div>
            </nav>
        </div>

        <!-- Main content -->
        <div class="flex-1 flex flex-col overflow-hidden">
            <!-- Top navigation -->
            <header class="bg-white shadow-sm">
                <div class="flex items-center justify-between px-6 py-4">
                    <div class="flex items-center">
                        <button @click="sidebarOpen = !sidebarOpen" class="text-gray-500 focus:outline-none lg:hidden">
                            <i class="fas fa-bars text-xl"></i>
                        </button>
                        <h1 class="ml-4 text-xl font-semibold text-gray-900 lg:ml-0">
                            @yield('page-title', 'Dashboard')
                        </h1>
                    </div>

                    <div class="flex items-center space-x-4">
                        <span class="text-sm text-gray-600">
                            Hola, {{ auth()->user()->name }}
                        </span>
                        <div class="flex items-center space-x-2">
                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                @if(auth()->user()->role === 'administrador') bg-red-100 text-red-800
                                @elseif(auth()->user()->role === 'asesor') bg-blue-100 text-blue-800
                                @else bg-gray-100 text-gray-800 @endif">
                                {{ ucfirst(auth()->user()->role) }}
                            </span>
                        </div>
                    </div>
                </div>
            </header>

            <!-- Page content -->
            <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
                <div class="px-6 py-8">
                    @if(session('success'))
                        <div class="mb-6 rounded-md bg-green-50 p-4">
                            <div class="flex">
                                <div class="flex-shrink-0">
                                    <i class="fas fa-check-circle text-green-400"></i>
                                </div>
                                <div class="ml-3">
                                    <p class="text-sm font-medium text-green-800">
                                        {{ session('success') }}
                                    </p>
                                </div>
                            </div>
                        </div>
                    @endif

                    @if(session('error'))
                        <div class="mb-6 rounded-md bg-red-50 p-4">
                            <div class="flex">
                                <div class="flex-shrink-0">
                                    <i class="fas fa-exclamation-circle text-red-400"></i>
                                </div>
                                <div class="ml-3">
                                    <p class="text-sm font-medium text-red-800">
                                        {{ session('error') }}
                                    </p>
                                </div>
                            </div>
                        </div>
                    @endif

                    @yield('content')
                </div>
            </main>
        </div>
    </div>
</body>
</html>
