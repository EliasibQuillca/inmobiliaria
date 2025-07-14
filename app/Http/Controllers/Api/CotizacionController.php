<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cotizacion;
use App\Models\Cliente;
use App\Models\Departamento;
use App\Models\AuditoriaUsuario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class CotizacionController extends Controller
{
    /**
     * Crear cotización (por asesor)
     */
    public function store(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        // Solo asesores pueden crear cotizaciones
        if (!$user->esAsesor()) {
            return response()->json([
                'message' => 'Solo los asesores pueden crear cotizaciones',
            ], 403);
        }

        $request->validate([
            'departamento_id' => 'required|exists:departamentos,id',
            'cliente_data' => 'required_without:cliente_id|array',
            'cliente_data.nombre' => 'required_without:cliente_id|string|max:100',
            'cliente_data.email' => 'required_without:cliente_id|email|unique:users,email',
            'cliente_data.telefono' => 'nullable|string|max:20',
            'cliente_data.dni' => 'required_without:cliente_id|string|max:20|unique:clientes,dni',
            'cliente_data.direccion' => 'nullable|string|max:200',
            'cliente_id' => 'required_without:cliente_data|exists:clientes,id',
            'monto' => 'required|numeric|min:0',
        ]);

        try {
            $clienteId = $request->cliente_id;

            // Si no hay cliente_id, crear nuevo cliente
            if (!$clienteId && $request->has('cliente_data')) {
                $clienteData = $request->cliente_data;
                
                // Crear usuario para el cliente
                $nuevoUser = \App\Models\User::create([
                    'nombre' => $clienteData['nombre'],
                    'email' => $clienteData['email'],
                    'telefono' => $clienteData['telefono'] ?? null,
                    'clave_hash' => Hash::make('temporal123'), // Password temporal
                    'rol' => 'cliente',
                ]);

                // Crear perfil de cliente
                $nuevoCliente = Cliente::create([
                    'usuario_id' => $nuevoUser->id,
                    'dni' => $clienteData['dni'],
                    'direccion' => $clienteData['direccion'] ?? null,
                    'fecha_registro' => now(),
                ]);

                $clienteId = $nuevoCliente->id;
            }

            // Verificar que el departamento esté disponible
            $departamento = Departamento::find($request->departamento_id);
            if (!$departamento->estaDisponible()) {
                return response()->json([
                    'message' => 'El departamento no está disponible para cotización',
                ], 422);
            }

            // Crear cotización
            $cotizacion = Cotizacion::create([
                'asesor_id' => $user->asesor->id,
                'departamento_id' => $request->departamento_id,
                'cliente_id' => $clienteId,
                'fecha' => now(),
                'monto' => $request->monto,
                'estado' => 'pendiente',
            ]);

            // Registrar auditoría
            AuditoriaUsuario::registrarCreacionCotizacion($user->id, $cotizacion->id);

            return response()->json([
                'message' => 'Cotización creada exitosamente',
                'cotizacion' => $cotizacion->load(['asesor.usuario', 'departamento', 'cliente.usuario']),
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al crear cotización',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Listar cotizaciones del asesor
     */
    public function index(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        if (!$user->esAsesor()) {
            return response()->json([
                'message' => 'Solo los asesores pueden ver sus cotizaciones',
            ], 403);
        }

        $query = Cotizacion::where('asesor_id', $user->asesor->id)
            ->with(['departamento', 'cliente.usuario']);

        // Filtros
        if ($request->has('estado')) {
            $query->where('estado', $request->estado);
        }

        if ($request->has('departamento_id')) {
            $query->where('departamento_id', $request->departamento_id);
        }

        $cotizaciones = $query->orderBy('created_at', 'desc')->paginate(10);

        return response()->json($cotizaciones);
    }

    /**
     * Mostrar cotización específica
     */
    public function show($id)
    {
        $cotizacion = Cotizacion::with([
            'asesor.usuario',
            'departamento.propietario',
            'cliente.usuario',
            'reserva'
        ])->find($id);

        if (!$cotizacion) {
            return response()->json([
                'message' => 'Cotización no encontrada',
            ], 404);
        }

        /** @var \App\Models\User $user */
        $user = Auth::user();

        // Verificar permisos
        if ($user->esAsesor() && $cotizacion->asesor_id !== $user->asesor->id) {
            return response()->json([
                'message' => 'No tiene permisos para ver esta cotización',
            ], 403);
        }

        if ($user->esCliente() && $cotizacion->cliente_id !== $user->cliente->id) {
            return response()->json([
                'message' => 'No tiene permisos para ver esta cotización',
            ], 403);
        }

        return response()->json($cotizacion);
    }

    /**
     * Aceptar cotización (cliente o asesor)
     */
    public function aceptar($id)
    {
        $cotizacion = Cotizacion::find($id);

        if (!$cotizacion) {
            return response()->json([
                'message' => 'Cotización no encontrada',
            ], 404);
        }

        if (!$cotizacion->estaPendiente()) {
            return response()->json([
                'message' => 'Solo se pueden aceptar cotizaciones pendientes',
            ], 422);
        }

        $cotizacion->aceptar();

        return response()->json([
            'message' => 'Cotización aceptada exitosamente',
            'cotizacion' => $cotizacion->fresh(),
        ]);
    }

    /**
     * Rechazar cotización
     */
    public function rechazar($id)
    {
        $cotizacion = Cotizacion::find($id);

        if (!$cotizacion) {
            return response()->json([
                'message' => 'Cotización no encontrada',
            ], 404);
        }

        if (!$cotizacion->estaPendiente()) {
            return response()->json([
                'message' => 'Solo se pueden rechazar cotizaciones pendientes',
            ], 422);
        }

        $cotizacion->rechazar();

        return response()->json([
            'message' => 'Cotización rechazada',
            'cotizacion' => $cotizacion->fresh(),
        ]);
    }

    /**
     * Listar todas las cotizaciones (administrador)
     */
    public function admin(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        if (!$user->esAdministrador()) {
            return response()->json([
                'message' => 'Solo los administradores pueden ver todas las cotizaciones',
            ], 403);
        }

        $query = Cotizacion::with(['asesor.usuario', 'departamento', 'cliente.usuario']);

        // Filtros
        if ($request->has('estado')) {
            $query->where('estado', $request->estado);
        }

        if ($request->has('asesor_id')) {
            $query->where('asesor_id', $request->asesor_id);
        }

        $cotizaciones = $query->orderBy('created_at', 'desc')->paginate(15);

        return response()->json($cotizaciones);
    }
}
