@extends('layouts.public')

@section('title', $departamento->titulo . ' - Inmobiliaria Cusco')

@section('content')
<div class="container mx-auto px-4 py-8">
    <!-- Breadcrumb -->
    <nav class="text-sm mb-8">
        <ol class="list-none p-0 inline-flex">
            <li class="flex items-center">
                <a href="{{ route('home') }}" class="text-blue-600 hover:text-blue-500">Inicio</a>
                <i class="fas fa-chevron-right mx-2 text-gray-400"></i>
            </li>
            <li class="flex items-center">
                <a href="{{ route('catalogo') }}" class="text-blue-600 hover:text-blue-500">Catálogo</a>
                <i class="fas fa-chevron-right mx-2 text-gray-400"></i>
            </li>
            <li class="text-gray-500">{{ $departamento->titulo }}</li>
        </ol>
    </nav>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Image Gallery -->
        <div class="lg:col-span-2">
            @if($departamento->imagenes->count() > 0)
                <div x-data="{ activeImage: 0, images: {{ $departamento->imagenes->pluck('url')->toJson() }} }">
                    <!-- Main Image -->
                    <div class="aspect-video bg-gray-200 rounded-lg overflow-hidden mb-4">
                        <img :src="images[activeImage]"
                             alt="{{ $departamento->titulo }}"
                             class="w-full h-full object-cover">
                    </div>

                    <!-- Thumbnail Gallery -->
                    @if($departamento->imagenes->count() > 1)
                        <div class="grid grid-cols-4 md:grid-cols-6 gap-2">
                            @foreach($departamento->imagenes as $index => $imagen)
                                <button @click="activeImage = {{ $index }}"
                                        class="aspect-square bg-gray-200 rounded-lg overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        :class="{ 'ring-2 ring-blue-500': activeImage === {{ $index }} }">
                                    <img src="{{ $imagen->url }}"
                                         alt="Vista {{ $index + 1 }}"
                                         class="w-full h-full object-cover">
                                </button>
                            @endforeach
                        </div>
                    @endif
                </div>
            @else
                <div class="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                    <div class="text-center">
                        <i class="fas fa-image text-4xl text-gray-400 mb-2"></i>
                        <p class="text-gray-500">Sin imágenes disponibles</p>
                    </div>
                </div>
            @endif
        </div>

        <!-- Property Details -->
        <div class="space-y-6">
            <!-- Price and Title -->
            <div>
                <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ $departamento->titulo }}</h1>
                <div class="flex items-center space-x-2 mb-4">
                    <i class="fas fa-map-marker-alt text-gray-400"></i>
                    <span class="text-gray-600">{{ $departamento->ubicacion }}</span>
                </div>
                <div class="text-3xl font-bold text-blue-600">
                    S/ {{ number_format($departamento->precio, 2) }}
                </div>
                @if($departamento->precio_anterior)
                    <div class="text-lg text-gray-500 line-through">
                        S/ {{ number_format($departamento->precio_anterior, 2) }}
                    </div>
                @endif
            </div>

            <!-- Basic Info -->
            <div class="bg-gray-50 rounded-lg p-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">Información Básica</h3>
                <div class="grid grid-cols-2 gap-4">
                    @if($departamento->dormitorios)
                        <div class="flex items-center space-x-2">
                            <i class="fas fa-bed text-blue-600"></i>
                            <span>{{ $departamento->dormitorios }} dormitorios</span>
                        </div>
                    @endif

                    @if($departamento->banos)
                        <div class="flex items-center space-x-2">
                            <i class="fas fa-bath text-blue-600"></i>
                            <span>{{ $departamento->banos }} baños</span>
                        </div>
                    @endif

                    @if($departamento->area_total)
                        <div class="flex items-center space-x-2">
                            <i class="fas fa-ruler-combined text-blue-600"></i>
                            <span>{{ $departamento->area_total }} m²</span>
                        </div>
                    @endif

                    @if($departamento->estacionamientos)
                        <div class="flex items-center space-x-2">
                            <i class="fas fa-car text-blue-600"></i>
                            <span>{{ $departamento->estacionamientos }} estacionamientos</span>
                        </div>
                    @endif
                </div>
            </div>

            <!-- Contact Form -->
            <div class="bg-blue-50 rounded-lg p-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">¿Interesado en esta propiedad?</h3>
                <form action="{{ route('contacto.post') }}" method="POST" class="space-y-4">
                    @csrf
                    <input type="hidden" name="departamento_id" value="{{ $departamento->id }}">
                    <input type="hidden" name="asunto" value="Consulta sobre: {{ $departamento->titulo }}">

                    <div>
                        <label for="nombre" class="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
                        <input type="text" id="nombre" name="nombre" required
                               class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    </div>

                    <div>
                        <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
                        <input type="email" id="email" name="email" required
                               class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    </div>

                    <div>
                        <label for="telefono" class="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                        <input type="tel" id="telefono" name="telefono"
                               class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    </div>

                    <div>
                        <label for="mensaje" class="block text-sm font-medium text-gray-700 mb-1">Mensaje</label>
                        <textarea id="mensaje" name="mensaje" rows="3"
                                  placeholder="Me interesa esta propiedad, quisiera más información..."
                                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                    </div>

                    <button type="submit"
                            class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200">
                        <i class="fas fa-paper-plane mr-2"></i>
                        Enviar Consulta
                    </button>
                </form>
            </div>

            <!-- Share Options -->
            <div class="border-t pt-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">Compartir</h3>
                <div class="flex space-x-3">
                    <a href="https://wa.me/?text={{ urlencode('Mira esta propiedad: ' . $departamento->titulo . ' - ' . request()->url()) }}"
                       target="_blank"
                       class="flex items-center justify-center w-10 h-10 bg-green-600 text-white rounded-full hover:bg-green-700 transition duration-200">
                        <i class="fab fa-whatsapp"></i>
                    </a>
                    <a href="https://www.facebook.com/sharer/sharer.php?u={{ urlencode(request()->url()) }}"
                       target="_blank"
                       class="flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition duration-200">
                        <i class="fab fa-facebook-f"></i>
                    </a>
                    <button onclick="copyToClipboard('{{ request()->url() }}')"
                            class="flex items-center justify-center w-10 h-10 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition duration-200">
                        <i class="fas fa-link"></i>
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- Description -->
    @if($departamento->descripcion)
        <div class="mt-12">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">Descripción</h2>
            <div class="prose prose-lg max-w-none">
                <p class="text-gray-700 leading-relaxed">{{ $departamento->descripcion }}</p>
            </div>
        </div>
    @endif

    <!-- Attributes -->
    @if($departamento->atributos->count() > 0)
        <div class="mt-12">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">Características</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                @foreach($departamento->atributos as $atributo)
                    <div class="flex items-center space-x-3 bg-white p-4 rounded-lg border">
                        <i class="fas fa-check-circle text-green-600"></i>
                        <span class="text-gray-700">{{ $atributo->nombre }}</span>
                    </div>
                @endforeach
            </div>
        </div>
    @endif

    <!-- Similar Properties -->
    @if(isset($propiedades_similares) && $propiedades_similares->count() > 0)
        <div class="mt-12">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">Propiedades Similares</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                @foreach($propiedades_similares as $similar)
                    <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                        <div class="aspect-video bg-gray-200">
                            @if($similar->imagen_principal)
                                <img src="{{ $similar->imagen_principal->url }}"
                                     alt="{{ $similar->titulo }}"
                                     class="w-full h-full object-cover">
                            @else
                                <div class="w-full h-full flex items-center justify-center">
                                    <i class="fas fa-image text-gray-400 text-3xl"></i>
                                </div>
                            @endif
                        </div>
                        <div class="p-6">
                            <h3 class="text-xl font-semibold text-gray-900 mb-2">{{ $similar->titulo }}</h3>
                            <p class="text-gray-600 mb-4">{{ $similar->ubicacion }}</p>
                            <div class="flex justify-between items-center">
                                <span class="text-2xl font-bold text-blue-600">
                                    S/ {{ number_format($similar->precio, 2) }}
                                </span>
                                <a href="{{ route('propiedad.show', $similar) }}"
                                   class="text-blue-600 hover:text-blue-500 font-medium">
                                    Ver detalles
                                </a>
                            </div>
                        </div>
                    </div>
                @endforeach
            </div>
        </div>
    @endif
</div>

<script>
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(function() {
        alert('Link copiado al portapapeles');
    });
}
</script>
@endsection
