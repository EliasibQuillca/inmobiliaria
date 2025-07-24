<?php

namespace App\Http\Controllers\Asesor;

use App\Http\Controllers\Controller;
use App\Models\Cliente;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class ClienteController extends Controller
{
    /**
     * Muestra la lista de clientes del asesor
     */
    public function index()
    {
        $asesor = Auth::user()->asesor;

        // Obtener clientes que tienen cotizaciones con este asesor
        $clientes = Cliente::with(['usuario', 'cotizaciones' => function($query) use ($asesor) {
            $query->where('asesor_id', $asesor->id);
        }])
        ->whereHas('cotizaciones', function($query) use ($asesor) {
            $query->where('asesor_id', $asesor->id);
        })
        ->get();

        return Inertia::render('Asesor/Clientes', [
            'clientes' => $clientes
        ]);
    }

    /**
     * Crear un nuevo cliente (cuando llama por WhatsApp/teléfono)
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'telefono' => 'required|string|max:20',
            'ci' => 'required|string|max:20|unique:clientes,dni',
            'direccion' => 'nullable|string|max:500',
        ]);

        // Crear usuario
        $usuario = User::create([
            'name' => $validated['nombre'],
            'email' => $validated['email'],
            'password' => Hash::make('123456'), // Password temporal
            'role' => 'cliente',
            'telefono' => $validated['telefono'],
            'estado' => 'activo',
        ]);

        // Crear cliente
        $cliente = Cliente::create([
            'usuario_id' => $usuario->id,
            'dni' => $validated['ci'],
            'direccion' => $validated['direccion'],
            'fecha_registro' => now(),
        ]);

        return redirect()->back()->with('success', 'Cliente registrado exitosamente');
    }

    /**
     * Mostrar detalles de un cliente específico
     */
    public function show($id)
    {
        $cliente = Cliente::with(['usuario', 'cotizaciones', 'reservas'])
            ->findOrFail($id);

        return Inertia::render('Asesor/Clientes/Detalle', [
            'cliente' => $cliente
        ]);
    }

    /**
     * Actualizar información del cliente
     */
    public function update(Request $request, $id)
    {
        $cliente = Cliente::findOrFail($id);

        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $cliente->usuario_id,
            'telefono' => 'required|string|max:20',
            'direccion' => 'nullable|string|max:500',
        ]);

        // Actualizar usuario
        $cliente->usuario->update([
            'name' => $validated['nombre'],
            'email' => $validated['email'],
            'telefono' => $validated['telefono'],
        ]);

        // Actualizar cliente
        $cliente->update([
            'direccion' => $validated['direccion'],
        ]);

        return redirect()->back()->with('success', 'Cliente actualizado exitosamente');
    }
}
