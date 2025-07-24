<?php

namespace App\Http\Controllers\Asesor;

use App\Http\Controllers\Controller;
use App\Models\Cliente;
use App\Models\Departamento;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Inertia\Inertia;

class SolicitudController extends Controller
{
    /**
     * Muestra las solicitudes e inquietudes de clientes
     */
    public function index()
    {
        $asesor = Auth::user()->asesor;

        // Clientes que han contactado pero aún no tienen cotización
        $clientesNuevos = Cliente::with(['usuario', 'cotizaciones'])
            ->where('asesor_id', $asesor->id)
            ->whereDoesntHave('cotizaciones')
            ->orderBy('created_at', 'desc')
            ->get();

        // Solicitudes de información de departamentos disponibles
        $departamentosInteres = Departamento::where('disponible', true)
            ->where('estado', 'disponible')
            ->orderBy('precio')
            ->get();

        return Inertia::render('Asesor/Solicitudes', [
            'clientesNuevos' => $clientesNuevos,
            'departamentosInteres' => $departamentosInteres
        ]);
    }

    /**
     * Registrar contacto de cliente por WhatsApp/teléfono
     */
    public function registrarContacto(Request $request)
    {
        $asesor = Auth::user()->asesor;

        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'telefono' => 'required|string|max:20|unique:clientes,telefono',
            'email' => 'nullable|email|unique:users,email',
            'departamento_interes' => 'nullable|exists:departamentos,id',
            'notas_contacto' => 'nullable|string|max:1000',
            'medio_contacto' => 'required|in:whatsapp,telefono,presencial',
        ]);

        // Crear usuario temporal si proporcionó email
        $usuario = null;
        if ($validated['email']) {
            $usuario = User::create([
                'name' => $validated['nombre'],
                'email' => $validated['email'],
                'password' => bcrypt(Str::random(10)), // Password temporal
                'role' => 'cliente',
            ]);
        }

        // Registrar cliente
        $cliente = Cliente::create([
            'user_id' => $usuario ? $usuario->id : null,
            'asesor_id' => $asesor->id,
            'nombre' => $validated['nombre'],
            'telefono' => $validated['telefono'],
            'email' => $validated['email'],
            'departamento_interes' => $validated['departamento_interes'],
            'notas_contacto' => $validated['notas_contacto'],
            'medio_contacto' => $validated['medio_contacto'],
            'estado' => 'contactado',
        ]);

        return redirect()->route('asesor.solicitudes')
            ->with('success', 'Contacto de cliente registrado exitosamente');
    }

    /**
     * Actualizar estado de seguimiento del cliente
     */
    public function actualizarSeguimiento(Request $request, $clienteId)
    {
        $asesor = Auth::user()->asesor;

        $validated = $request->validate([
            'estado' => 'required|in:contactado,interesado,sin_interes,perdido',
            'notas_seguimiento' => 'nullable|string|max:1000',
        ]);

        $cliente = Cliente::where('asesor_id', $asesor->id)
            ->findOrFail($clienteId);

        $cliente->update([
            'estado' => $validated['estado'],
            'notas_seguimiento' => $validated['notas_seguimiento'],
        ]);

        return redirect()->back()
            ->with('success', 'Estado de seguimiento actualizado');
    }

    /**
     * Mostrar historial de contactos del cliente
     */
    public function historialCliente($clienteId)
    {
        $asesor = Auth::user()->asesor;

        $cliente = Cliente::with(['usuario', 'cotizaciones.departamento', 'reservas.venta'])
            ->where('asesor_id', $asesor->id)
            ->findOrFail($clienteId);

        return Inertia::render('Asesor/Solicitudes/Historial', [
            'cliente' => $cliente
        ]);
    }

    /**
     * Agendar cita o reunión con cliente
     */
    public function agendarCita(Request $request, $clienteId)
    {
        $asesor = Auth::user()->asesor;

        $validated = $request->validate([
            'fecha_cita' => 'required|date|after:now',
            'tipo_cita' => 'required|in:presencial,virtual,telefonica',
            'ubicacion' => 'nullable|string|max:255',
            'notas_cita' => 'nullable|string|max:500',
        ]);

        $cliente = Cliente::where('asesor_id', $asesor->id)
            ->findOrFail($clienteId);

        $cliente->update([
            'fecha_cita' => $validated['fecha_cita'],
            'tipo_cita' => $validated['tipo_cita'],
            'ubicacion_cita' => $validated['ubicacion'],
            'notas_cita' => $validated['notas_cita'],
            'estado' => 'cita_agendada',
        ]);

        return redirect()->back()
            ->with('success', 'Cita agendada exitosamente');
    }

    /**
     * Buscar departamentos según criterios del cliente
     */
    public function buscarDepartamentos(Request $request)
    {
        $validated = $request->validate([
            'precio_min' => 'nullable|numeric|min:0',
            'precio_max' => 'nullable|numeric|min:0|gte:precio_min',
            'habitaciones' => 'nullable|integer|min:1',
            'baños' => 'nullable|numeric|min:0.5',
            'ubicacion' => 'nullable|string|max:255',
        ]);

        $query = Departamento::where('disponible', true)
            ->where('estado', 'disponible');

        if ($validated['precio_min']) {
            $query->where('precio', '>=', $validated['precio_min']);
        }

        if ($validated['precio_max']) {
            $query->where('precio', '<=', $validated['precio_max']);
        }

        if ($validated['habitaciones']) {
            $query->where('habitaciones', $validated['habitaciones']);
        }

        if ($validated['baños']) {
            $query->where('baños', $validated['baños']);
        }

        if ($validated['ubicacion']) {
            $query->where('ubicacion', 'like', '%' . $validated['ubicacion'] . '%');
        }

        $departamentos = $query->orderBy('precio')->get();

        return response()->json([
            'departamentos' => $departamentos
        ]);
    }
}
