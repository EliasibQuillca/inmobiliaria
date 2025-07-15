@extends('layouts.public')

@section('content')
<div class="bg-white">
    <!-- Hero Section -->
    <div class="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div class="text-center">
                <h1 class="text-4xl md:text-6xl font-bold mb-6">
                    Encuentra tu Hogar Ideal en Cusco
                </h1>
                <p class="text-xl md:text-2xl mb-8 text-blue-100">
                    Los mejores departamentos con las mejores ubicaciones
                </p>
                <div class="flex flex-col sm:flex-row gap-4 justify-center">
                    <a href="{{ route('catalogo') }}" class="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                        Ver Departamentos
                    </a>
                    <a href="#contacto" class="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
                        Contactar Asesor
                    </a>
                </div>
            </div>
        </div>

        <!-- Wave decoration -->
        <div class="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 120" class="w-full h-16 text-white">
                <path fill="currentColor" d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
            </svg>
        </div>
    </div>

    <!-- Stats Section -->
    <div class="py-16 bg-gray-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
                <div class="bg-white p-6 rounded-lg shadow-md">
                    <div class="text-3xl font-bold text-blue-600 mb-2">{{ $departamentosDestacados->count() }}+</div>
                    <div class="text-gray-600">Departamentos Disponibles</div>
                </div>
                <div class="bg-white p-6 rounded-lg shadow-md">
                    <div class="text-3xl font-bold text-green-600 mb-2">15+</div>
                    <div class="text-gray-600">Años de Experiencia</div>
                </div>
                <div class="bg-white p-6 rounded-lg shadow-md">
                    <div class="text-3xl font-bold text-purple-600 mb-2">500+</div>
                    <div class="text-gray-600">Familias Satisfechas</div>
                </div>
                <div class="bg-white p-6 rounded-lg shadow-md">
                    <div class="text-3xl font-bold text-orange-600 mb-2">100%</div>
                    <div class="text-gray-600">Compromiso</div>
                </div>
            </div>
        </div>
    </div>

    <!-- Featured Properties -->
    <div class="py-16">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-12">
                <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    Departamentos Destacados
                </h2>
                <p class="text-xl text-gray-600">
                    Descubre nuestras mejores opciones disponibles
                </p>
            </div>

            @if($departamentosDestacados->count() > 0)
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    @foreach($departamentosDestacados as $departamento)
                        <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
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
                                <div class="absolute top-4 left-4">
                                    <span class="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                                        Disponible
                                    </span>
                                </div>
                            </div>

                            <!-- Contenido -->
                            <div class="p-6">
                                <div class="flex justify-between items-start mb-2">
                                    <h3 class="text-lg font-semibold text-gray-900">
                                        {{ $departamento->codigo }}
                                    </h3>
                                    <span class="text-2xl font-bold text-blue-600">
                                        ${{ number_format($departamento->precio, 0) }}
                                    </span>
                                </div>

                                <p class="text-gray-600 mb-4 flex items-center">
                                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                    </svg>
                                    {{ $departamento->direccion }}
                                </p>

                                <div class="flex justify-between items-center">
                                    <a href="{{ route('departamento.detalle', $departamento->id) }}"
                                       class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                                        Ver Detalles
                                    </a>
                                    <button onclick="contactarAsesor({{ $departamento->id }})"
                                            class="text-blue-600 hover:text-blue-800 font-medium">
                                        Contactar
                                    </button>
                                </div>
                            </div>
                        </div>
                    @endforeach
                </div>

                <div class="text-center mt-12">
                    <a href="{{ route('catalogo') }}"
                       class="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                        Ver Todos los Departamentos
                    </a>
                </div>
            @else
                <div class="text-center py-12">
                    <div class="text-gray-500 text-lg">
                        Pronto tendremos departamentos disponibles
                    </div>
                </div>
            @endif
        </div>
    </div>

    <!-- Contact Section -->
    <div id="contacto" class="py-16 bg-gray-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-12">
                <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    ¿Interesado en algún departamento?
                </h2>
                <p class="text-xl text-gray-600">
                    Contáctanos y te ayudaremos a encontrar tu hogar ideal
                </p>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <!-- Formulario de contacto -->
                <div class="bg-white p-8 rounded-lg shadow-md">
                    <h3 class="text-2xl font-semibold mb-6">Envíanos un mensaje</h3>

                    @if(session('success'))
                        <div class="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
                            {{ session('success') }}
                        </div>
                    @endif

                    @if(session('error'))
                        <div class="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                            {{ session('error') }}
                        </div>
                    @endif

                    <form action="{{ route('contacto') }}" method="POST" class="space-y-4">
                        @csrf
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Nombre completo *</label>
                            <input type="text" name="nombre" required
                                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                   value="{{ old('nombre') }}">
                            @error('nombre')
                                <p class="text-red-500 text-sm mt-1">{{ $message }}</p>
                            @enderror
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Teléfono *</label>
                            <input type="tel" name="telefono" required
                                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                   value="{{ old('telefono') }}">
                            @error('telefono')
                                <p class="text-red-500 text-sm mt-1">{{ $message }}</p>
                            @enderror
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input type="email" name="email"
                                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                   value="{{ old('email') }}">
                            @error('email')
                                <p class="text-red-500 text-sm mt-1">{{ $message }}</p>
                            @enderror
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Mensaje *</label>
                            <textarea name="mensaje" rows="4" required
                                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                      placeholder="Cuéntanos en qué podemos ayudarte...">{{ old('mensaje') }}</textarea>
                            @error('mensaje')
                                <p class="text-red-500 text-sm mt-1">{{ $message }}</p>
                            @enderror
                        </div>

                        <button type="submit"
                                class="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition-colors font-semibold">
                            Enviar Mensaje
                        </button>
                    </form>
                </div>

                <!-- Información de contacto -->
                <div class="space-y-8">
                    <div class="bg-white p-6 rounded-lg shadow-md">
                        <h3 class="text-xl font-semibold mb-4">Información de Contacto</h3>
                        <div class="space-y-4">
                            <div class="flex items-center">
                                <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                                    <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                                    </svg>
                                </div>
                                <div>
                                    <div class="font-medium">WhatsApp</div>
                                    <div class="text-gray-600">+51 984 123 456</div>
                                </div>
                            </div>

                            <div class="flex items-center">
                                <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                                    <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                    </svg>
                                </div>
                                <div>
                                    <div class="font-medium">Email</div>
                                    <div class="text-gray-600">ventas@inmobiliariacusco.com</div>
                                </div>
                            </div>

                            <div class="flex items-center">
                                <div class="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                                    <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                    </svg>
                                </div>
                                <div>
                                    <div class="font-medium">Oficina</div>
                                    <div class="text-gray-600">Av. El Sol 123, Cusco</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="bg-blue-50 p-6 rounded-lg">
                        <h3 class="text-xl font-semibold mb-4 text-blue-900">Horarios de Atención</h3>
                        <div class="space-y-2 text-blue-800">
                            <div class="flex justify-between">
                                <span>Lunes - Viernes:</span>
                                <span>9:00 AM - 6:00 PM</span>
                            </div>
                            <div class="flex justify-between">
                                <span>Sábados:</span>
                                <span>9:00 AM - 2:00 PM</span>
                            </div>
                            <div class="flex justify-between">
                                <span>Domingos:</span>
                                <span>Cerrado</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<script>
function contactarAsesor(departamentoId) {
    // Scroll al formulario de contacto
    document.getElementById('contacto').scrollIntoView({ behavior: 'smooth' });

    // Pre-llenar el mensaje con referencia al departamento
    const mensajeField = document.querySelector('textarea[name="mensaje"]');
    if (mensajeField && departamentoId) {
        mensajeField.value = `Estoy interesado en el departamento con ID: ${departamentoId}. Me gustaría recibir más información.`;
    }
}
</script>
@endsection
