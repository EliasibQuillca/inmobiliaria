<?php

namespace App\Http\Controllers\Asesor;

use App\Http\Controllers\Controller;
use App\Models\Cotizacion;
use App\Models\Cliente;
use App\Models\Departamento;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CotizacionController extends Controller
{
    /**
     * Muestra las cotizaciones del asesor
     */
    public function index()
    {
        $asesor = Auth::user()->asesor;

        $cotizaciones = Cotizacion::with(['cliente.usuario', 'departamento'])
            ->where('asesor_id', $asesor->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Asesor/Cotizaciones', [
            'cotizaciones' => $cotizaciones
        ]);
    }

    /**
     * Mostrar formulario para crear cotización
     */
    public function create(Request $request)
    {
        $asesor = Auth::user()->asesor;

        // Si viene un cliente_id específico, obtenerlo con sus preferencias
        $clienteSeleccionado = null;
        if ($request->has('cliente_id')) {
            $clienteSeleccionado = Cliente::where('asesor_id', $asesor->id)
                ->where('id', $request->cliente_id)
                ->first();
        }

        // Obtener solo clientes del asesor actual
        $clientes = Cliente::where('asesor_id', $asesor->id)
            ->orderBy('nombre')
            ->get();

        // Obtener departamentos disponibles
        $departamentosQuery = Departamento::where('estado', 'disponible');
        
        // Si hay cliente seleccionado con preferencias específicas, aplicar filtros
        $departamentosFiltrados = [];
        if ($clienteSeleccionado) {
            $queryFiltrada = clone $departamentosQuery;
            $hayFiltros = false;
            
            // Filtrar por preferencias del cliente si existen
            if ($clienteSeleccionado->habitaciones_deseadas) {
                $queryFiltrada->where('dormitorios', $clienteSeleccionado->habitaciones_deseadas);
                $hayFiltros = true;
            }
            if ($clienteSeleccionado->presupuesto_min && $clienteSeleccionado->presupuesto_max) {
                $queryFiltrada->whereBetween('precio', [
                    $clienteSeleccionado->presupuesto_min,
                    $clienteSeleccionado->presupuesto_max
                ]);
                $hayFiltros = true;
            }
            
            // Si se aplicaron filtros, obtener los departamentos filtrados
            if ($hayFiltros) {
                $departamentosFiltrados = $queryFiltrada->get();
            }
        }

        // Obtener todos los departamentos disponibles
        $departamentos = $departamentosQuery->get();

        return Inertia::render('Asesor/Cotizaciones/Crear', [
            'clientes' => $clientes,
            'departamentos' => $departamentos,
            'departamentosFiltrados' => $departamentosFiltrados,
            'clienteSeleccionado' => $clienteSeleccionado,
        ]);
    }

    /**
     * Crear nueva cotización
     */
    public function store(Request $request)
    {
        $asesor = Auth::user()->asesor;

        $validated = $request->validate([
            'cliente_id' => 'required|exists:clientes,id',
            'departamento_id' => 'required|exists:departamentos,id',
            'monto' => 'required|numeric|min:0',
            'descuento' => 'nullable|numeric|min:0',
            'fecha_validez' => 'required|date|after:today',
            'notas' => 'nullable|string|max:1000',
            'condiciones' => 'nullable|string|max:2000',
        ]);

        $cotizacion = Cotizacion::create([
            'asesor_id' => $asesor->id,
            'cliente_id' => $validated['cliente_id'],
            'departamento_id' => $validated['departamento_id'],
            'fecha' => now(),
            'monto' => $validated['monto'],
            'descuento' => $validated['descuento'] ?? 0,
            'fecha_validez' => $validated['fecha_validez'],
            'estado' => 'pendiente',
            'notas' => $validated['notas'],
            'condiciones' => $validated['condiciones'],
        ]);

        return redirect()->route('asesor.cotizaciones')
            ->with('success', 'Cotización creada exitosamente');
    }

    /**
     * Mostrar detalles de una cotización
     */
    public function show($id)
    {
        $asesor = Auth::user()->asesor;

        $cotizacion = Cotizacion::with(['cliente.usuario', 'departamento', 'comentarios'])
            ->where('asesor_id', $asesor->id)
            ->findOrFail($id);

        return Inertia::render('Asesor/Cotizaciones/Detalle', [
            'cotizacion' => $cotizacion
        ]);
    }

    /**
     * Actualizar estado de cotización
     */
    public function updateEstado(Request $request, $id)
    {
        $asesor = Auth::user()->asesor;

        $validated = $request->validate([
            'estado' => 'required|in:pendiente,aceptada,rechazada,expirada',
            'notas' => 'nullable|string|max:1000',
        ]);

        $cotizacion = Cotizacion::where('asesor_id', $asesor->id)
            ->findOrFail($id);

        $cotizacion->update([
            'estado' => $validated['estado'],
            'notas' => $validated['notas'] ?? $cotizacion->notas,
        ]);

        return redirect()->back()->with('success', 'Estado de cotización actualizado');
    }

    /**
     * Editar cotización existente
     */
    public function edit($id)
    {
        $asesor = Auth::user()->asesor;

        $cotizacion = Cotizacion::with(['cliente.usuario', 'departamento'])
            ->where('asesor_id', $asesor->id)
            ->findOrFail($id);

        $clientes = Cliente::with('usuario')->get();
        $departamentos = Departamento::where('estado', 'disponible')->get();

        return Inertia::render('Asesor/Cotizaciones/Editar', [
            'cotizacion' => $cotizacion,
            'clientes' => $clientes,
            'departamentos' => $departamentos
        ]);
    }

    /**
     * Actualizar cotización
     */
    public function update(Request $request, $id)
    {
        $asesor = Auth::user()->asesor;

        $validated = $request->validate([
            'monto' => 'required|numeric|min:0',
            'descuento' => 'nullable|numeric|min:0',
            'fecha_validez' => 'required|date|after:today',
            'notas' => 'nullable|string|max:1000',
            'condiciones' => 'nullable|string|max:2000',
        ]);

        $cotizacion = Cotizacion::where('asesor_id', $asesor->id)
            ->findOrFail($id);

        $cotizacion->update($validated);

        return redirect()->route('asesor.cotizaciones')
            ->with('success', 'Cotización actualizada exitosamente');
    }
}
