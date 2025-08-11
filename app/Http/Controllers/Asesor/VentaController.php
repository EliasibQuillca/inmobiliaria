<?php

namespace App\Http\Controllers\Asesor;

use App\Http\Controllers\Controller;
use App\Models\Venta;
use App\Models\Reserva;
use App\Models\Departamento;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class VentaController extends Controller
{
    /**
     * Muestra las ventas del asesor
     */
    public function index()
    {
        $asesor = Auth::user()->asesor;

        $ventas = Venta::with(['reserva.cotizacion.cliente.usuario', 'reserva.cotizacion.departamento'])
            ->whereHas('reserva', function($query) use ($asesor) {
                $query->where('asesor_id', $asesor->id);
            })
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Asesor/Ventas', [
            'ventas' => $ventas
        ]);
    }

    /**
     * Registrar nueva venta presencial
     */
    public function store(Request $request)
    {
        $asesor = Auth::user()->asesor;

        $validated = $request->validate([
            'reserva_id' => 'required|exists:reservas,id',
            'fecha_venta' => 'required|date|before_or_equal:today',
            'monto_final' => 'required|numeric|min:0',
            'documentos_entregados' => 'required|boolean',
            'observaciones' => 'nullable|string|max:1000',
        ]);

        // Verificar que la reserva pertenece al asesor y está confirmada
        $reserva = Reserva::where('asesor_id', $asesor->id)
            ->where('estado', 'confirmada')
            ->findOrFail($validated['reserva_id']);

        // Verificar que no existe ya una venta para esta reserva
        if (Venta::where('reserva_id', $reserva->id)->exists()) {
            return redirect()->back()
                ->withErrors(['reserva_id' => 'Ya existe una venta registrada para esta reserva']);
        }

        $venta = Venta::create([
            'reserva_id' => $reserva->id,
            'fecha_venta' => $validated['fecha_venta'],
            'monto_final' => $validated['monto_final'],
            'documentos_entregados' => $validated['documentos_entregados'],
            'observaciones' => $validated['observaciones'],
        ]);

        // Si los documentos fueron entregados, marcar departamento como vendido
        if ($validated['documentos_entregados']) {
            $departamento = Departamento::find($reserva->departamento_id);
            if ($departamento) {
                $departamento->update([
                    'estado' => 'vendido',
                    'disponible' => false
                ]);
            }
        }

        return redirect()->route('asesor.ventas')
            ->with('success', 'Venta registrada exitosamente');
    }

    /**
     * Mostrar formulario para registrar venta
     */
    public function create(Request $request)
    {
        $asesor = Auth::user()->asesor;

        // Obtener reservas confirmadas que no tienen venta registrada
        $reservas = Reserva::with(['cotizacion.cliente.usuario', 'cotizacion.departamento'])
            ->where('asesor_id', $asesor->id)
            ->where('estado', 'confirmada')
            ->whereDoesntHave('venta')
            ->get();

        // Si viene una reserva específica, pre-seleccionarla
        $reservaSeleccionada = null;
        if ($request->has('reserva_id')) {
            $reservaSeleccionada = $reservas->where('id', $request->reserva_id)->first();
        }

        return Inertia::render('Asesor/Ventas/Crear', [
            'reservas' => $reservas,
            'reservaSeleccionada' => $reservaSeleccionada,
            'auth' => [
                'user' => Auth::user()
            ]
        ]);
    }

    /**
     * Mostrar detalles de una venta
     */
    public function show($id)
    {
        $asesor = Auth::user()->asesor;

        $venta = Venta::with(['reserva.cotizacion.cliente.usuario', 'reserva.cotizacion.departamento'])
            ->whereHas('reserva', function($query) use ($asesor) {
                $query->where('asesor_id', $asesor->id);
            })
            ->findOrFail($id);

        return Inertia::render('Asesor/Ventas/Detalle', [
            'venta' => $venta,
            'auth' => [
                'user' => Auth::user()
            ]
        ]);
    }

    /**
     * Actualizar entrega de documentos
     */
    public function actualizarDocumentos(Request $request, $id)
    {
        $asesor = Auth::user()->asesor;

        $validated = $request->validate([
            'documentos_entregados' => 'required|boolean',
            'observaciones' => 'nullable|string|max:1000',
        ]);

        $venta = Venta::whereHas('reserva', function($query) use ($asesor) {
                $query->where('asesor_id', $asesor->id);
            })
            ->findOrFail($id);

        $venta->update($validated);

        // Si se confirma la entrega de documentos, marcar departamento como vendido
        if ($validated['documentos_entregados']) {
            $departamento = Departamento::find($venta->reserva->departamento_id);
            if ($departamento) {
                $departamento->update([
                    'estado' => 'vendido',
                    'disponible' => false
                ]);
            }
        }

        return redirect()->back()
            ->with('success', 'Estado de documentos actualizado exitosamente');
    }

    /**
     * Editar venta existente
     */
    public function edit($id)
    {
        $asesor = Auth::user()->asesor;

        $venta = Venta::with(['reserva.cotizacion.cliente.usuario', 'reserva.cotizacion.departamento'])
            ->whereHas('reserva', function($query) use ($asesor) {
                $query->where('asesor_id', $asesor->id);
            })
            ->findOrFail($id);

        return Inertia::render('Asesor/Ventas/Editar', [
            'venta' => $venta,
            'auth' => [
                'user' => Auth::user()
            ]
        ]);
    }

    /**
     * Actualizar venta
     */
    public function update(Request $request, $id)
    {
        $asesor = Auth::user()->asesor;

        $validated = $request->validate([
            'fecha_venta' => 'required|date|before_or_equal:today',
            'monto_final' => 'required|numeric|min:0',
            'observaciones' => 'nullable|string|max:1000',
        ]);

        $venta = Venta::whereHas('reserva', function($query) use ($asesor) {
                $query->where('asesor_id', $asesor->id);
            })
            ->findOrFail($id);

        $venta->update($validated);

        return redirect()->route('asesor.ventas')
            ->with('success', 'Venta actualizada exitosamente');
    }
}
