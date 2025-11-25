<?php

namespace App\Http\Controllers\Asesor;

use App\Http\Controllers\Controller;
use App\Models\Cliente;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ClienteController extends Controller
{
    /**
     * Muestra la lista de clientes del asesor
     */
    public function index()
    {
        $asesor = Auth::user()->asesor;

        // Obtener clientes que pertenecen a este asesor
        $clientes = Cliente::with(['usuario', 'cotizaciones'])
            ->where('asesor_id', $asesor->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Asesor/Clientes', [
            'clientes' => $clientes
        ]);
    }

    /**
     * Mostrar formulario para crear nuevo cliente
     */
    public function create()
    {
        return Inertia::render('Asesor/Clientes/Crear');
    }

    /**
     * Crear un nuevo cliente (cuando llama por WhatsApp/teléfono)
     */
    public function store(Request $request)
    {
        $asesor = Auth::user()->asesor;

        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'dni' => 'required|string|max:20|unique:clientes,dni',
            'telefono' => 'required|string|max:20',
            'email' => 'nullable|email|unique:users,email',
            'direccion' => 'nullable|string|max:500',
            'medio_contacto' => 'required|in:whatsapp,telefono,presencial,email,referido',
            'notas_contacto' => 'nullable|string|max:1000',
            'tipo_propiedad' => 'required|in:apartamento,casa,penthouse,estudio,duplex',
            'habitaciones_deseadas' => 'nullable|integer|min:1|max:10',
            'presupuesto_min' => 'nullable|numeric|min:0|max:10000000',
            'presupuesto_max' => 'nullable|numeric|min:0|max:10000000|gte:presupuesto_min',
            'zona_preferida' => 'nullable|string|max:255',
        ], [
            'presupuesto_min.max' => 'El presupuesto mínimo no puede exceder S/ 10,000,000 (diez millones de soles)',
            'presupuesto_max.max' => 'El presupuesto máximo no puede exceder S/ 10,000,000 (diez millones de soles)',
            'presupuesto_max.gte' => 'El presupuesto máximo debe ser mayor o igual al presupuesto mínimo',
            'dni.unique' => 'Ya existe un cliente registrado con este DNI',
            'email.unique' => 'Este correo electrónico ya está registrado',
        ]);

        // Crear usuario solo si proporcionó email
        $usuario = null;
        $passwordTemporal = null;
        if ($validated['email']) {
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

            // TODO: Enviar email con la contraseña temporal al cliente
            // Mail::to($usuario->email)->send(new WelcomeClient($passwordTemporal));

            // Log para el asesor (en producción, esto debería enviarse por email al cliente)
            \Log::info('Cliente creado con password temporal', [
                'cliente_id' => $usuario->id,
                'email' => $usuario->email,
                'password_temporal' => $passwordTemporal // Solo para desarrollo
            ]);
        }

        // Crear cliente
        $cliente = Cliente::create([
            'usuario_id' => $usuario ? $usuario->id : null,
            'asesor_id' => $asesor->id,
            'dni' => $validated['dni'],
            'nombre' => $validated['nombre'],
            'telefono' => $validated['telefono'],
            'email' => $validated['email'] ?? null,
            'direccion' => $validated['direccion'] ?? null,
            'medio_contacto' => $validated['medio_contacto'],
            'notas_contacto' => $validated['notas_contacto'] ?? null,
            'estado' => 'contactado',
            'tipo_propiedad' => $validated['tipo_propiedad'],
            'habitaciones_deseadas' => $validated['habitaciones_deseadas'] ?? null,
            'presupuesto_min' => $validated['presupuesto_min'] ?? null,
            'presupuesto_max' => $validated['presupuesto_max'] ?? null,
            'zona_preferida' => $validated['zona_preferida'] ?? null,
            'fecha_registro' => now(),
        ]);

        return redirect()->route('asesor.clientes.index')
            ->with('success', 'Cliente registrado exitosamente. Ahora puedes crear una cotización para ' . $cliente->nombre);
    }

    /**
     * Mostrar detalles de un cliente específico
     */
    public function show($id)
    {
        $asesor = Auth::user()->asesor;

        $cliente = Cliente::with(['usuario', 'cotizaciones.departamento', 'reservas.venta'])
            ->where('asesor_id', $asesor->id)
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
