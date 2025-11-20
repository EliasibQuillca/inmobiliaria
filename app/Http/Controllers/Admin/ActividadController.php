<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditoriaAdmin;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ActividadController extends Controller
{
    /**
     * Mostrar lista de actividades administrativas
     */
    public function index(Request $request)
    {
        $query = AuditoriaAdmin::with('usuario')
            ->orderBy('created_at', 'desc');

        // Filtros
        if ($request->filled('usuario_id')) {
            $query->where('usuario_id', $request->usuario_id);
        }

        if ($request->filled('accion')) {
            $query->where('accion', $request->accion);
        }

        if ($request->filled('modelo')) {
            $query->where('modelo', $request->modelo);
        }

        if ($request->filled('fecha_desde')) {
            $query->whereDate('created_at', '>=', $request->fecha_desde);
        }

        if ($request->filled('fecha_hasta')) {
            $query->whereDate('created_at', '<=', $request->fecha_hasta);
        }

        $actividades = $query->paginate(20)->withQueryString();

        // Estadísticas
        $estadisticas = [
            'total_actividades' => AuditoriaAdmin::count(),
            'actividades_hoy' => AuditoriaAdmin::whereDate('created_at', today())->count(),
            'acciones_criticas' => AuditoriaAdmin::whereIn('accion', ['eliminar', 'desactivar'])->count(),
        ];

        return Inertia::render('Admin/Actividades/Index', [
            'actividades' => $actividades,
            'estadisticas' => $estadisticas,
            'filtros' => $request->only(['usuario_id', 'accion', 'modelo', 'fecha_desde', 'fecha_hasta']),
        ]);
    }
}
