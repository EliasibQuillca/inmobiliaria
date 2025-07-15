<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Departamento;
use Illuminate\Http\Request;

class CatalogoController extends Controller
{
    /**
     * Página de inicio con catálogo destacado
     */
    public function home()
    {
        $departamentosDestacados = Departamento::with(['imagenPrincipal', 'propietario'])
            ->disponibles()
            ->latest()
            ->take(6)
            ->get();

        return view('home', compact('departamentosDestacados'));
    }

    /**
     * Catálogo completo de departamentos
     */
    public function index(Request $request)
    {
        $query = Departamento::with(['imagenPrincipal', 'propietario'])
            ->disponibles();

        // Filtros
        if ($request->filled('precio_min')) {
            $query->where('precio', '>=', $request->precio_min);
        }

        if ($request->filled('precio_max')) {
            $query->where('precio', '<=', $request->precio_max);
        }

        if ($request->filled('buscar')) {
            $query->where(function($q) use ($request) {
                $q->where('direccion', 'like', '%' . $request->buscar . '%')
                  ->orWhere('codigo', 'like', '%' . $request->buscar . '%');
            });
        }

        // Ordenamiento
        $orderBy = $request->get('orden', 'created_at');
        $orderDirection = $request->get('direccion', 'desc');

        switch ($orderBy) {
            case 'precio_asc':
                $query->orderBy('precio', 'asc');
                break;
            case 'precio_desc':
                $query->orderBy('precio', 'desc');
                break;
            default:
                $query->orderBy('created_at', 'desc');
                break;
        }

        $departamentos = $query->paginate(12);

        // Rangos de precios para el filtro
        $precioMin = Departamento::disponibles()->min('precio');
        $precioMax = Departamento::disponibles()->max('precio');

        return view('catalogo.index', compact('departamentos', 'precioMin', 'precioMax'));
    }

    /**
     * Detalle de un departamento específico
     */
    public function show($id)
    {
        $departamento = Departamento::with([
            'propietario',
            'imagenesActivas',
            'imagenPrincipal',
            'galeriaImagenes',
            'atributos'
        ])->findOrFail($id);

        // Verificar que el departamento esté disponible para el público
        if (!$departamento->estaDisponible()) {
            abort(404, 'Departamento no disponible');
        }

        // Departamentos similares
        $similares = Departamento::with(['imagenPrincipal'])
            ->disponibles()
            ->where('id', '!=', $id)
            ->whereBetween('precio', [
                $departamento->precio * 0.8, // -20%
                $departamento->precio * 1.2  // +20%
            ])
            ->take(4)
            ->get();

        return view('catalogo.detalle', compact('departamento', 'similares'));
    }

    /**
     * Procesar formulario de contacto
     */
    public function contacto(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:100',
            'telefono' => 'required|string|max:20',
            'email' => 'nullable|email|max:100',
            'mensaje' => 'required|string|max:500',
            'departamento_id' => 'nullable|exists:departamentos,id'
        ]);

        try {
            // Aquí podrías enviar un email, guardar en BD, etc.
            // Por ahora solo simularemos el envío

            // Si hay un departamento específico, incluir la referencia
            $departamento = null;
            if ($request->departamento_id) {
                $departamento = Departamento::find($request->departamento_id);
            }

            // Aquí implementarías el envío real (email, WhatsApp API, etc.)
            // Por ahora solo devolvemos éxito

            return back()->with('success', '¡Mensaje enviado exitosamente! Nos pondremos en contacto contigo pronto.');

        } catch (\Exception $e) {
            return back()->with('error', 'Hubo un problema al enviar tu mensaje. Por favor intenta de nuevo.');
        }
    }
}
