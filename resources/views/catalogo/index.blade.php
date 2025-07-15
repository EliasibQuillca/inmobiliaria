@extends('layouts.public')

@section('content')
<div class="bg-white min-h-screen">
    <!-- Header del catálogo -->
    <div class="bg-gray-50 border-b">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 class="text-3xl font-bold text-gray-900 mb-2">Catálogo de Departamentos</h1>
            <p class="text-gray-600">Encuentra el departamento perfecto para ti</p>
        </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="flex flex-col lg:flex-row gap-8">
            <!-- Sidebar con filtros -->
            <div class="lg:w-1/4">
                <div class="bg-white border border-gray-200 rounded-lg p-6 sticky top-8">
                    <h2 class="text-lg font-semibold mb-4">Filtros</h2>

                    <form method="GET" action="{{ route('catalogo') }}" class="space-y-6">
                        <!-- Búsqueda por texto -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Buscar</label>
                            <input type="text"
                                   name="buscar"
                                   value="{{ request('buscar') }}"
                                   placeholder="Código o dirección..."
                                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        </div>

                        <!-- Rango de precios -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Rango de Precios</label>
                            <div class="grid grid-cols-2 gap-2">
                                <input type="number"
                                       name="precio_min"
                                       value="{{ request('precio_min') }}"
                                       placeholder="Mín. ${{ number_format($precioMin ?? 0, 0) }}"
                                       class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <input type="number"
                                       name="precio_max"
                                       value="{{ request('precio_max') }}"
                                       placeholder="Máx. ${{ number_format($precioMax ?? 999999, 0) }}"
                                       class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                            </div>
                        </div>

                        <!-- Ordenamiento -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Ordenar por</label>
                            <select name="orden" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="created_at" {{ request('orden') == 'created_at' ? 'selected' : '' }}>
                                    Más recientes
                                </option>
                                <option value="precio_asc" {{ request('orden') == 'precio_asc' ? 'selected' : '' }}>
                                    Precio: menor a mayor
                                </option>
                                <option value="precio_desc" {{ request('orden') == 'precio_desc' ? 'selected' : '' }}>
                                    Precio: mayor a menor
                                </option>
                            </select>
                        </div>

                        <div class="space-y-2">
                            <button type="submit"
                                    class="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors">
                                Aplicar Filtros
                            </button>
                            <a href="{{ route('catalogo') }}"
                               class="w-full block text-center border border-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-50 transition-colors">
                                Limpiar Filtros
                            </a>
                        </div>
                    </form>
                </div>
            </div>

            <!-- Contenido principal -->
            <div class="lg:w-3/4">
                <!-- Información de resultados -->
                <div class="flex justify-between items-center mb-6">
                    <div class="text-gray-600">
                        Mostrando {{ $departamentos->firstItem() ?? 0 }} - {{ $departamentos->lastItem() ?? 0 }}
                        de {{ $departamentos->total() }} departamentos
                    </div>

                    @if(request()->hasAny(['buscar', 'precio_min', 'precio_max', 'orden']))
                        <div class="text-sm text-blue-600">
                            <a href="{{ route('catalogo') }}" class="hover:underline">
                                ← Limpiar todos los filtros
                            </a>
                        </div>
                    @endif
                </div>

                <!-- Grid de departamentos -->
                @if($departamentos->count() > 0)
                    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        @foreach($departamentos as $departamento)
                            <div class="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                                <!-- Imagen -->
                                <div class="relative h-48">
                                    @if($departamento->imagenPrincipal)
                                        <img src="{{ $departamento->imagenPrincipal->url }}"
                                             alt="{{ $departamento->codigo }}"
                                             class="w-full h-full object-cover">
                                    @else
                                        <div class="w-full h-full bg-gray-200 flex items-center justify-center">
                                            <svg class="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                            </svg>
                                        </div>
                                    @endif

                                    <!-- Badge de estado -->
                                    <div class="absolute top-3 left-3">
                                        <span class="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                                            {{ ucfirst($departamento->estado) }}
                                        </span>
                                    </div>

                                    <!-- Precio destacado -->
                                    <div class="absolute top-3 right-3">
                                        <span class="bg-black bg-opacity-75 text-white px-3 py-1 rounded-full text-sm font-bold">
                                            ${{ number_format($departamento->precio, 0) }}
                                        </span>
                                    </div>
                                </div>

                                <!-- Contenido -->
                                <div class="p-4">
                                    <div class="mb-2">
                                        <h3 class="text-lg font-semibold text-gray-900">
                                            {{ $departamento->codigo }}
                                        </h3>
                                        <p class="text-gray-600 text-sm flex items-center">
                                            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                            </svg>
                                            {{ $departamento->direccion }}
                                        </p>
                                    </div>

                                    @if($departamento->propietario)
                                        <div class="text-xs text-gray-500 mb-3">
                                            Propietario: {{ $departamento->propietario->nombre }}
                                        </div>
                                    @endif

                                    <div class="flex justify-between items-center">
                                        <a href="{{ route('departamento.detalle', $departamento->id) }}"
                                           class="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition-colors">
                                            Ver Detalles
                                        </a>
                                        <button onclick="contactarAsesor({{ $departamento->id }}, '{{ $departamento->codigo }}')"
                                                class="text-blue-600 hover:text-blue-800 text-sm font-medium">
                                            Contactar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        @endforeach
                    </div>

                    <!-- Paginación -->
                    <div class="mt-8">
                        {{ $departamentos->appends(request()->query())->links() }}
                    </div>
                @else
                    <!-- Estado vacío -->
                    <div class="text-center py-12">
                        <svg class="mx-auto h-24 w-24 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                        </svg>
                        <h3 class="text-lg font-medium text-gray-900 mb-2">No se encontraron departamentos</h3>
                        <p class="text-gray-500 mb-4">
                            @if(request()->hasAny(['buscar', 'precio_min', 'precio_max']))
                                Intenta ajustar los filtros de búsqueda
                            @else
                                Actualmente no hay departamentos disponibles
                            @endif
                        </p>
                        @if(request()->hasAny(['buscar', 'precio_min', 'precio_max']))
                            <a href="{{ route('catalogo') }}"
                               class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                                Limpiar Filtros
                            </a>
                        @endif
                    </div>
                @endif
            </div>
        </div>
    </div>
</div>

<!-- Modal de contacto rápido -->
<div id="modalContacto" class="fixed inset-0 bg-black bg-opacity-50 hidden z-50" onclick="cerrarModal()">
    <div class="flex items-center justify-center min-h-screen p-4">
        <div class="bg-white rounded-lg max-w-md w-full p-6" onclick="event.stopPropagation()">
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-lg font-semibold">Contactar Asesor</h3>
                <button onclick="cerrarModal()" class="text-gray-400 hover:text-gray-600">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>

            <div class="space-y-4">
                <p class="text-gray-600" id="mensajeContacto">
                    ¿Interesado en este departamento? Contáctanos por WhatsApp
                </p>

                <div class="space-y-2">
                    <a href="#" id="whatsappLink"
                       class="w-full bg-green-500 text-white py-3 rounded-md hover:bg-green-600 transition-colors flex items-center justify-center">
                        <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.886 3.488"></path>
                        </svg>
                        Contactar por WhatsApp
                    </a>

                    <button onclick="llamarTelefono()"
                            class="w-full border border-gray-300 text-gray-700 py-3 rounded-md hover:bg-gray-50 transition-colors flex items-center justify-center">
                        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                        </svg>
                        Llamar: +51 984 123 456
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>

<script>
function contactarAsesor(departamentoId, codigo) {
    const mensaje = `Hola! Estoy interesado en el departamento ${codigo} (ID: ${departamentoId}). ¿Podrían darme más información?`;
    const whatsappUrl = `https://wa.me/51984123456?text=${encodeURIComponent(mensaje)}`;

    document.getElementById('mensajeContacto').textContent = `¿Interesado en el departamento ${codigo}?`;
    document.getElementById('whatsappLink').href = whatsappUrl;
    document.getElementById('modalContacto').classList.remove('hidden');
}

function cerrarModal() {
    document.getElementById('modalContacto').classList.add('hidden');
}

function llamarTelefono() {
    window.location.href = 'tel:+51984123456';
}

// Cerrar modal con Escape
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        cerrarModal();
    }
});
</script>
@endsection
