<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Departamento;
use App\Models\Asesor;
use App\Models\Cliente;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class CatalogoController extends Controller
{
    /**
     * Muestra el catálogo público de departamentos
     */
    public function index(Request $request)
    {
        // Construcción de la consulta base - usando solo las columnas que existen
        $query = Departamento::with(['imagenes'])
            ->where('estado', 'disponible')
            ->select([
                'id', 'codigo', 'direccion', 'precio', 'estado', 
                'propietario_id', 'created_at', 'updated_at'
            ]);

                // Filtros básicos - solo usando columnas que existen
        if ($request->filled('precio_min')) {
            $query->where('precio', '>=', $request->precio_min);
        }

        if ($request->filled('precio_max')) {
            $query->where('precio', '<=', $request->precio_max);
        }

        if ($request->filled('busqueda')) {
            $busqueda = $request->busqueda;
            $query->where(function($q) use ($busqueda) {
                $q->where('codigo', 'like', "%{$busqueda}%")
                  ->orWhere('direccion', 'like', "%{$busqueda}%");
            });
        }

        // Ordenamiento básico
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

        return Inertia::render('Public/Catalogo', [
            'departamentos' => $departamentos,
            'estadisticas' => $estadisticas,
            'filtros' => $request->only(['precio_min', 'precio_max', 'busqueda', 'orden']),
        ]);
    }

    /**
     * Muestra el detalle de un departamento específico
     */
    public function show(Departamento $departamento)
    {
        // Solo mostrar si está disponible
        if ($departamento->estado !== 'disponible') {
            abort(404, 'Departamento no disponible');
        }

        // Cargar relaciones necesarias
        $departamento->load(['imagenes', 'atributos', 'propietario']);

        // Obtener departamentos similares basados solo en precio
        $departamentosSimilares = Departamento::with('imagenes')
            ->where('id', '!=', $departamento->id)
            ->where('estado', 'disponible')
            ->whereBetween('precio', [
                $departamento->precio * 0.8,
                $departamento->precio * 1.2
            ])
            ->limit(6)
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
            if ($validated['crear_cuenta'] && !Auth::check() && $validated['email']) {
                $usuarioExistente = User::where('email', $validated['email'])->first();

                if (!$usuarioExistente) {
                    $usuario = User::create([
                        'name' => $validated['nombre'],
                        'email' => $validated['email'],
                        'password' => Hash::make('123456'), // Password temporal
                        'role' => 'cliente',
                        'telefono' => $validated['telefono'],
                        'estado' => 'activo',
                    ]);

                    // Enviar email con credenciales (implementar después)
                }
            }

            // Crear cliente para el asesor
            $cliente = Cliente::create([
                'usuario_id' => $usuario ? $usuario->id : (Auth::check() ? Auth::id() : null),
                'asesor_id' => $asesor->id,
                'nombre' => $validated['nombre'],
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

        // Respuesta diferente según si se creó cuenta o no
        $mensaje = 'Tu solicitud ha sido enviada exitosamente. El asesor se pondrá en contacto contigo pronto.';

        if ($validated['crear_cuenta'] && $usuario) {
            $mensaje .= ' Se ha creado tu cuenta con email: ' . $usuario->email . ' y password temporal: 123456. Te recomendamos cambiar tu contraseña al iniciar sesión.';
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
