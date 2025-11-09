<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Models\Departamento;
use App\Models\Cliente;

class ClienteDepartamentoController extends Controller
{
    /**
     * Catálogo exclusivo del cliente autenticado
     * Muestra departamentos con estado de favoritos del cliente
     */
    public function catalogo(Request $request)
    {
        $user = Auth::user();
        $cliente = Cliente::where('usuario_id', $user->id)->first();

        if (!$cliente) {
            return redirect()->route('cliente.perfil.index')
                ->with('error', 'Por favor completa tu perfil primero');
        }

        // Construir query base
        $query = Departamento::with(['imagenes' => function($q) {
            $q->where('tipo', 'principal')->orWhere(function($sq) {
                $sq->whereNull('tipo')->orderBy('created_at', 'asc');
            });
        }])
        ->where('estado', 'disponible');

        // Aplicar filtros
        if ($request->filled('tipo_propiedad')) {
            $query->where('tipo_propiedad', $request->tipo_propiedad);
        }

        if ($request->filled('habitaciones')) {
            $query->where('habitaciones', '>=', $request->habitaciones);
        }

        if ($request->filled('precio_min')) {
            $query->where('precio', '>=', $request->precio_min);
        }

        if ($request->filled('precio_max')) {
            $query->where('precio', '<=', $request->precio_max);
        }

        if ($request->filled('busqueda')) {
            $busqueda = $request->busqueda;
            $query->where(function($q) use ($busqueda) {
                $q->where('titulo', 'like', "%{$busqueda}%")
                  ->orWhere('descripcion', 'like', "%{$busqueda}%")
                  ->orWhere('ubicacion', 'like', "%{$busqueda}%");
            });
        }

        // Ordenamiento
        $orden = $request->get('orden', 'recientes');
        switch ($orden) {
            case 'precio_asc':
                $query->orderBy('precio', 'asc');
                break;
            case 'precio_desc':
                $query->orderBy('precio', 'desc');
                break;
            case 'area_desc':
                $query->orderBy('area_total', 'desc');
                break;
            default:
                $query->orderBy('created_at', 'desc');
        }

        // Obtener departamentos paginados
        $departamentos = $query->paginate(12)->withQueryString();

        // Marcar favoritos del cliente
        $favoritosIds = DB::table('favoritos')
            ->where('cliente_id', $cliente->id)
            ->pluck('departamento_id')
            ->toArray();

        $departamentos->getCollection()->transform(function ($departamento) use ($favoritosIds) {
            $departamento->es_favorito = in_array($departamento->id, $favoritosIds);
            return $departamento;
        });

        // Estadísticas
        $estadisticas = [
            'total' => Departamento::where('estado', 'disponible')->count(),
            'precio_min' => Departamento::where('estado', 'disponible')->min('precio'),
            'precio_max' => Departamento::where('estado', 'disponible')->max('precio'),
            'favoritos_count' => count($favoritosIds),
        ];

        return inertia('Cliente/CatalogoCliente', [
            'departamentos' => $departamentos,
            'estadisticas' => $estadisticas,
            'filtros' => $request->only(['tipo_propiedad', 'habitaciones', 'precio_min', 'precio_max', 'busqueda', 'orden']),
            'tiposPropiedad' => [
                'departamento' => 'Departamento',
                'casa' => 'Casa',
                'oficina' => 'Oficina',
            ],
        ]);
    }

    /**
     * Detalle de un departamento (vista del cliente)
     */
    public function show(Departamento $departamento)
    {
        $user = Auth::user();
        $cliente = Cliente::where('usuario_id', $user->id)->first();

        $departamento->load(['imagenes', 'propietario']);

        // Verificar si es favorito
        $esFavorito = false;
        if ($cliente) {
            $esFavorito = DB::table('favoritos')
                ->where('cliente_id', $cliente->id)
                ->where('departamento_id', $departamento->id)
                ->exists();
        }

        $departamento->es_favorito = $esFavorito;

        // Departamentos relacionados (misma zona o precio similar)
        $relacionados = Departamento::with(['imagenes' => function($q) {
            $q->where('tipo', 'principal')->orWhere(function($sq) {
                $sq->whereNull('tipo')->orderBy('created_at', 'asc');
            });
        }])
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

        // Marcar favoritos en relacionados
        if ($cliente) {
            $favoritosIds = DB::table('favoritos')
                ->where('cliente_id', $cliente->id)
                ->pluck('departamento_id')
                ->toArray();

            $relacionados->transform(function ($dept) use ($favoritosIds) {
                $dept->es_favorito = in_array($dept->id, $favoritosIds);
                return $dept;
            });
        }

        return inertia('Cliente/DetalleDepartamento', [
            'departamento' => $departamento,
            'relacionados' => $relacionados,
        ]);
    }

    /**
     * Mis favoritos
     */
    public function favoritos()
    {
        $user = Auth::user();
        $cliente = Cliente::where('usuario_id', $user->id)->first();

        if (!$cliente) {
            return redirect()->route('cliente.perfil.index')
                ->with('error', 'Por favor completa tu perfil primero');
        }

        $favoritos = $cliente->favoritos()
            ->with(['imagenes' => function($q) {
                $q->where('tipo', 'principal')->orWhere(function($sq) {
                    $sq->whereNull('tipo')->orderBy('created_at', 'asc');
                });
            }])
            ->where('estado', 'disponible')
            ->orderBy('favoritos.created_at', 'desc')
            ->get();

        // Todos ya son favoritos, pero agregamos el flag por consistencia
        $favoritos->transform(function ($dept) {
            $dept->es_favorito = true;
            return $dept;
        });

        return inertia('Cliente/Favoritos', [
            'favoritos' => $favoritos,
        ]);
    }

    /**
     * Toggle favorito (agregar/quitar)
     */
    public function toggleFavorito(Request $request)
    {
        $request->validate([
            'departamento_id' => 'required|exists:departamentos,id'
        ]);

        $user = Auth::user();
        $cliente = Cliente::where('usuario_id', $user->id)->first();

        if (!$cliente) {
            return back()->with('error', 'Cliente no encontrado');
        }

        $departamentoId = $request->departamento_id;

        // Verificar si ya existe
        $existe = DB::table('favoritos')
            ->where('cliente_id', $cliente->id)
            ->where('departamento_id', $departamentoId)
            ->exists();

        if ($existe) {
            // Quitar de favoritos
            DB::table('favoritos')
                ->where('cliente_id', $cliente->id)
                ->where('departamento_id', $departamentoId)
                ->delete();

            return back()->with('success', 'Eliminado de favoritos');
        } else {
            // Agregar a favoritos
            DB::table('favoritos')->insert([
                'cliente_id' => $cliente->id,
                'departamento_id' => $departamentoId,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            return back()->with('success', 'Agregado a favoritos');
        }
    }

    /**
     * Agregar a favoritos
     */
    public function agregarFavorito($departamentoId)
    {
        $user = Auth::user();
        $cliente = Cliente::where('usuario_id', $user->id)->first();

        if (!$cliente) {
            return back()->with('error', 'Cliente no encontrado');
        }

        // Verificar que el departamento existe
        $departamento = Departamento::find($departamentoId);
        if (!$departamento) {
            return back()->with('error', 'Departamento no encontrado');
        }

        // Verificar si ya existe
        $existe = DB::table('favoritos')
            ->where('cliente_id', $cliente->id)
            ->where('departamento_id', $departamentoId)
            ->exists();

        if (!$existe) {
            DB::table('favoritos')->insert([
                'cliente_id' => $cliente->id,
                'departamento_id' => $departamentoId,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            return back()->with('success', 'Agregado a favoritos');
        }

        return back()->with('info', 'Ya está en favoritos');
    }

    /**
     * Eliminar de favoritos
     */
    public function eliminarFavorito($departamentoId)
    {
        $user = Auth::user();
        $cliente = Cliente::where('usuario_id', $user->id)->first();

        if (!$cliente) {
            return back()->with('error', 'Cliente no encontrado');
        }

        DB::table('favoritos')
            ->where('cliente_id', $cliente->id)
            ->where('departamento_id', $departamentoId)
            ->delete();

        return back()->with('success', 'Eliminado de favoritos');
    }
}
