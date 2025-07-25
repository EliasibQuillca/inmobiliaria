<?php

namespace App\Http\Controllers\Asesor;

use App\Http\Controllers\Controller;
use App\Models\Departamento;
use App\Models\Cotizacion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PropiedadController extends Controller
{
    /**
     * Muestra el catálogo de propiedades para el asesor
     */
    public function index(Request $request)
    {
        $asesor = Auth::user()->asesor;

        // Construcción de la consulta base
        $query = Departamento::with(['imagenes'])
            ->select([
                'id', 'codigo', 'tipo_propiedad', 'habitaciones', 'banos',
                'area_construida', 'precio', 'estado', 'descripcion',
                'direccion', 'piso', 'numero', 'vista', 'amoblado'
            ]);

        // Filtros
        if ($request->filled('estado')) {
            $query->where('estado', $request->estado);
        } else {
            // Por defecto mostrar solo disponibles
            $query->where('estado', 'disponible');
        }

        if ($request->filled('tipo_propiedad')) {
            $query->where('tipo_propiedad', $request->tipo_propiedad);
        }

        if ($request->filled('habitaciones')) {
            $query->where('habitaciones', $request->habitaciones);
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
                $q->where('codigo', 'like', "%{$busqueda}%")
                  ->orWhere('descripcion', 'like', "%{$busqueda}%")
                  ->orWhere('direccion', 'like', "%{$busqueda}%");
            });
        }

        // Ordenamiento
        $query->orderBy('created_at', 'desc');

        $propiedades = $query->paginate(12);

        // Obtener estadísticas para el dashboard
        $estadisticas = [
            'total' => Departamento::count(),
            'disponibles' => Departamento::where('estado', 'disponible')->count(),
            'reservados' => Departamento::where('estado', 'reservado')->count(),
            'vendidos' => Departamento::where('estado', 'vendido')->count(),
        ];

        // Obtener cotizaciones del asesor para mostrar cuáles ha cotizado
        $cotizacionesAsesor = Cotizacion::where('asesor_id', $asesor->id)
            ->pluck('departamento_id')
            ->toArray();

        return Inertia::render('Asesor/Propiedades', [
            'propiedades' => $propiedades,
            'estadisticas' => $estadisticas,
            'filtros' => $request->only(['estado', 'tipo_propiedad', 'habitaciones', 'precio_min', 'precio_max', 'busqueda']),
            'cotizacionesAsesor' => $cotizacionesAsesor,
            'tiposPropiedad' => [
                'apartamento' => 'Apartamento',
                'casa' => 'Casa',
                'penthouse' => 'Penthouse',
                'estudio' => 'Estudio',
                'duplex' => 'Dúplex'
            ]
        ]);
    }

    /**
     * Muestra el detalle de una propiedad específica
     */
    public function show(Departamento $departamento)
    {
        $asesor = Auth::user()->asesor;

        // Cargar la propiedad con todas sus relaciones
        $departamento->load(['imagenes', 'atributos']);

        // Verificar si el asesor ha cotizado esta propiedad
        $haCotizado = Cotizacion::where('asesor_id', $asesor->id)
            ->where('departamento_id', $departamento->id)
            ->exists();

        // Obtener cotizaciones del asesor para esta propiedad
        $cotizacionesAsesor = Cotizacion::with('cliente')
            ->where('asesor_id', $asesor->id)
            ->where('departamento_id', $departamento->id)
            ->orderBy('created_at', 'desc')
            ->get();

        // Obtener propiedades similares
        $propiedadesSimilares = Departamento::with('imagenes')
            ->where('id', '!=', $departamento->id)
            ->where('tipo_propiedad', $departamento->tipo_propiedad)
            ->where('habitaciones', $departamento->habitaciones)
            ->where('estado', 'disponible')
            ->whereBetween('precio', [
                $departamento->precio * 0.8,
                $departamento->precio * 1.2
            ])
            ->limit(6)
            ->get();

        return Inertia::render('Asesor/Propiedades/Detalle', [
            'propiedad' => $departamento,
            'haCotizado' => $haCotizado,
            'cotizacionesAsesor' => $cotizacionesAsesor,
            'propiedadesSimilares' => $propiedadesSimilares
        ]);
    }

    /**
     * Buscar propiedades para cotización rápida
     */
    public function buscar(Request $request)
    {
        $query = Departamento::query()
            ->where('estado', 'disponible')
            ->select('id', 'codigo', 'tipo_propiedad', 'habitaciones', 'precio');

        if ($request->filled('q')) {
            $q = $request->q;
            $query->where(function($query) use ($q) {
                $query->where('codigo', 'like', "%{$q}%")
                      ->orWhere('tipo_propiedad', 'like', "%{$q}%");
            });
        }

        $propiedades = $query->limit(10)->get();

        return response()->json($propiedades);
    }
}
