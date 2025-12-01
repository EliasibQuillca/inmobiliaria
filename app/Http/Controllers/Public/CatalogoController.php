<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Departamento;
use App\Models\Asesor;
use App\Models\Cliente;
use App\Models\Cotizacion;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Inertia\Inertia;

class CatalogoController extends Controller
{
    /**
     * Muestra el catálogo público de departamentos
     */
    public function index(Request $request)
    {
        // Construcción de la consulta base - incluyendo todos los campos necesarios
        $query = Departamento::with(['imagenes', 'propietario', 'atributos'])
            ->where('estado', 'disponible');

        // Obtener estadísticas básicas para los filtros
        $estadisticas = [
            'total' => Departamento::where('estado', 'disponible')->count(),
            'precio_min' => Departamento::where('estado', 'disponible')->min('precio'),
            'precio_max' => Departamento::where('estado', 'disponible')->max('precio'),
            'ubicaciones' => Departamento::where('estado', 'disponible')
                ->distinct()
                ->pluck('ubicacion')
                ->toArray()
        ];

        // Filtros básicos - ahora usando todas las columnas disponibles
        if ($request->filled('ubicacion')) {
            $query->where('ubicacion', $request->ubicacion);
        }

        if ($request->filled('busqueda')) {
            $busqueda = $request->busqueda;
            $query->where(function($q) use ($busqueda) {
                $q->where('titulo', 'like', "%{$busqueda}%")
                  ->orWhere('descripcion', 'like', "%{$busqueda}%")
                  ->orWhere('ubicacion', 'like', "%{$busqueda}%");
            });
        }

        // Ordenar siempre primero por destacados y luego por otros criterios
        $query->orderBy('destacado', 'desc');

        // Ordenamiento adicional
        $ordenamiento = $request->get('orden', 'recientes');
        switch ($ordenamiento) {
            case 'precio_asc':
                $query->orderBy('precio', 'asc');
                break;
            case 'precio_desc':
                $query->orderBy('precio', 'desc');
                break;
            default:
                $query->orderBy('created_at', 'desc');
        }

        $departamentos = $query->paginate(12);

        // Para clientes autenticados, agregar información de favoritos
        if (Auth::check() && Auth::user()->role === 'cliente') {
            $cliente = Auth::user()->cliente;
            if ($cliente) {
                $favoritosIds = $cliente->favoritos()->pluck('departamento_id')->toArray();

                foreach ($departamentos as $departamento) {
                    $departamento->es_favorito = in_array($departamento->id, $favoritosIds);
                }
            }
        }

        // Obtener estadísticas generales
        $estadisticas = [
            'total_disponibles' => Departamento::where('estado', 'disponible')->count(),
            'precio_min' => Departamento::where('estado', 'disponible')->min('precio'),
            'precio_max' => Departamento::where('estado', 'disponible')->max('precio'),
        ];

        $tiposPropiedad = [
            'departamento' => 'Departamento',
            'casa' => 'Casa',
            'oficina' => 'Oficina',
            'local_comercial' => 'Local Comercial',
            'terreno' => 'Terreno',
            'otros' => 'Otros'
        ];

        return Inertia::render('Public/Catalogo', [
            'departamentos' => $departamentos,
            'estadisticas' => $estadisticas,
            'filtros' => array_merge([
                'tipo_propiedad' => '',
                'habitaciones' => '',
                'busqueda' => '',
                'orden' => 'recientes'
            ], $request->all()),
            'tiposPropiedad' => $tiposPropiedad,
            'auth' => [
                'user' => Auth::user()
            ]
        ]);
    }

    /**
     * Muestra el detalle de un departamento específico
     */
    public function show(Departamento $departamento)
    {
        // Cargar las relaciones necesarias
        $departamento->load(['imagenes', 'atributos', 'propietario']);

        // Si el departamento no está disponible, redireccionar al catálogo
        if ($departamento->estado !== 'disponible') {
            return redirect()->route('catalogo.index')
                ->with('error', 'El departamento no está disponible actualmente.');
        }

        // Obtener departamentos similares basados en precio y ubicación
        $departamentosSimilares = Departamento::with(['imagenes'])
            ->where('id', '!=', $departamento->id)
            ->where('estado', 'disponible')
            ->where(function($query) use ($departamento) {
                $query->where('ubicacion', $departamento->ubicacion)
                    ->orWhereBetween('precio', [
                        $departamento->precio * 0.8,
                        $departamento->precio * 1.2
                    ]);
            })
            ->limit(4)
            ->get();

        return Inertia::render('Public/DetalleDepartamento', [
            'departamento' => $departamento,
            'departamentosSimilares' => $departamentosSimilares,
            'tiposPropiedad' => [
                'departamento' => 'Departamento',
                'casa' => 'Casa',
                'oficina' => 'Oficina',
                'local_comercial' => 'Local Comercial',
                'terreno' => 'Terreno',
                'otros' => 'Otros'
            ]
        ]);
    }

    /**
     * Procesa la solicitud de contacto desde el catálogo público
     */
    public function solicitudContacto(Request $request)
    {
        $validated = $request->validate([
            'departamento_id' => 'required|exists:departamentos,id',
            'nombre' => 'required|string|max:255',
            'telefono' => 'required|string|max:20',
            'email' => 'nullable|email|max:255',
            'mensaje' => 'nullable|string|max:1000',
            'crear_cuenta' => 'boolean',
        ]);

        $departamento = Departamento::findOrFail($validated['departamento_id']);

        // Obtener un asesor disponible (el primero disponible por simplicidad)
        $asesor = Asesor::whereHas('usuario', function($query) {
            $query->where('estado', 'activo');
        })->first();

        // Si no hay asesores disponibles, crear un error
        if (!$asesor) {
            return back()->withErrors(['error' => 'No hay asesores disponibles en este momento. Inténtalo más tarde.']);
        }

        // Si el usuario está autenticado, usar sus datos
        if (Auth::check()) {
            $usuario = Auth::user();
            $validated['nombre'] = $usuario->name;
            $validated['email'] = $usuario->email;
            $validated['telefono'] = $usuario->telefono ?? $validated['telefono'];
        }

        // Verificar si ya existe un cliente con este teléfono para este asesor
        $clienteExistente = Cliente::where('asesor_id', $asesor->id)
            ->where(function($query) use ($validated) {
                $query->where('telefono', $validated['telefono']);
                if ($validated['email']) {
                    $query->orWhere('email', $validated['email']);
                }
            })
            ->first();

        if (!$clienteExistente) {
            // Crear cuenta de usuario si se solicitó y no está autenticado
            $usuario = null;
            $passwordTemporal = null;

            if ($validated['crear_cuenta'] && !Auth::check() && $validated['email']) {
                $usuarioExistente = User::where('email', $validated['email'])->first();

                if (!$usuarioExistente) {
                    // Generar password temporal aleatorio y seguro
                    $passwordTemporal = Str::random(10) . rand(100, 999);

                    $usuario = User::create([
                        'name' => $validated['nombre'],
                        'email' => $validated['email'],
                        'password' => Hash::make($passwordTemporal),
                        'role' => 'cliente',
                        'telefono' => $validated['telefono'],
                        'estado' => 'activo',
                    ]);

                    // TODO: Enviar email con credenciales al cliente
                    // Mail::to($usuario->email)->send(new WelcomeClient($passwordTemporal));

                    // Log temporal para desarrollo
                    \Log::info('Cliente registrado desde catálogo con password temporal', [
                        'cliente_id' => $usuario->id,
                        'email' => $usuario->email,
                        'password_temporal' => $passwordTemporal
                    ]);
                }
            }

            // Crear cliente para el asesor
            $cliente = Cliente::create([
                'usuario_id' => $usuario ? $usuario->id : (Auth::check() ? Auth::id() : null),
                'asesor_id' => $asesor->id,
                'nombre' => $validated['nombre'],
                'dni' => 'TEMP-' . time() . '-' . rand(1000, 9999), // DNI temporal único
                'telefono' => $validated['telefono'],
                'email' => $validated['email'],
                'medio_contacto' => 'web',
                'notas_contacto' => $validated['mensaje'],
                'estado' => 'contactado',
                'departamento_interes' => $departamento->codigo,
                'fecha_registro' => now(),
            ]);
        } else {
            // Actualizar notas del cliente existente
            $clienteExistente->update([
                'notas_contacto' => ($clienteExistente->notas_contacto ?? '') . "\n\n" .
                                   "Interés en {$departamento->codigo}: " . ($validated['mensaje'] ?? 'Sin mensaje adicional'),
                'departamento_interes' => $departamento->codigo,
            ]);
            $cliente = $clienteExistente;
        }

        // ✅ CREAR LA SOLICITUD/COTIZACIÓN EN EL SISTEMA
        $solicitud = Cotizacion::create([
            'cliente_id' => $cliente->id,
            'asesor_id' => $asesor->id,
            'departamento_id' => $departamento->id,
            'tipo_solicitud' => 'cotizacion',
            'mensaje_solicitud' => $validated['mensaje'] ?? 'Solicitud de información sobre el departamento ' . $departamento->titulo,
            'estado' => 'pendiente',
            'monto' => 0, // Se llenará cuando el asesor responda
            'descuento' => 0,
            'notas' => '',
            'condiciones' => '',
            'fecha_validez' => now()->addDays(30),
        ]);

        // Respuesta diferente según si se creó cuenta o no
        $mensaje = 'Tu solicitud ha sido enviada exitosamente. El asesor se pondrá en contacto contigo pronto.';

        if ($validated['crear_cuenta'] && $usuario && $passwordTemporal) {
            $mensaje .= ' Se ha creado tu cuenta con email: ' . $usuario->email . '. Recibirás un correo con tus credenciales de acceso. Te recomendamos cambiar tu contraseña al iniciar sesión.';

            // En un entorno de producción, aquí se debería enviar el email
            // Por ahora, solo guardamos en log
            \Log::info('Password temporal generado para nuevo cliente', [
                'email' => $usuario->email,
                'password' => $passwordTemporal
            ]);
        }

        return redirect()->back()->with('success', $mensaje);
    }

    /**
     * Registro rápido para clientes desde el catálogo
     */
    public function registroRapido(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'telefono' => 'required|string|max:20',
            'password' => 'required|string|min:6|confirmed',
        ]);

        $usuario = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'telefono' => $validated['telefono'],
            'password' => Hash::make($validated['password']),
            'role' => 'cliente',
            'estado' => 'activo',
        ]);

        // Login automático
        Auth::login($usuario);

        return redirect()->back()->with('success', '¡Cuenta creada exitosamente! Ahora puedes enviar solicitudes más fácilmente.');
    }
}
