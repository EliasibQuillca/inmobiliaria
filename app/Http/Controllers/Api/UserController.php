<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Asesor;
use App\Models\Cliente;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    /**
     * Listar todos los usuarios (solo administradores)
     */
    public function index(Request $request)
    {
        $user = Auth::user();

        if (!$user || !$user->hasRole('administrador')) {
            return response()->json([
                'message' => 'No autorizado',
            ], 403);
        }

        $query = User::with(['cliente', 'asesor']);

        // Filtros
        if ($request->has('role')) {
            $query->where('role', $request->input('role'));
        }

        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // Ordenamiento
        $sort = $request->input('sort', 'created_at');
        $direction = $request->input('direction', 'desc');
        $query->orderBy($sort, $direction);

        $users = $query->paginate($request->input('per_page', 15));

        // Formatear los datos para la respuesta
        $formattedUsers = $users->getCollection()->map(function ($user) {
            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'telefono' => $user->telefono,
                'created_at' => $user->created_at,
                'updated_at' => $user->updated_at,
                'role_display' => $user->getRoleDisplayAttribute(),
                'can_delete' => $this->canDeleteUser($user),
                'asesor' => $user->asesor,
                'cliente' => $user->cliente,
            ];
        });

        return response()->json([
            'data' => $formattedUsers,
            'pagination' => [
                'current_page' => $users->currentPage(),
                'last_page' => $users->lastPage(),
                'per_page' => $users->perPage(),
                'total' => $users->total(),
            ],
        ]);
    }

    /**
     * Verificar si un usuario puede ser eliminado
     */
    private function canDeleteUser($user)
    {
        // El administrador principal no puede ser eliminado
        if ($user->email === 'admin@inmobiliaria.com') {
            return false;
        }

        // Si es cliente, verificar si tiene actividad comercial
        if ($user->esCliente() && $user->cliente) {
            $cliente = $user->cliente;

            // No se puede eliminar si tiene cotizaciones, reservas o ventas
            $tieneCotizaciones = $cliente->cotizaciones()->exists();
            $tieneReservas = $cliente->reservas()->exists();

            if ($tieneCotizaciones || $tieneReservas) {
                return false;
            }
        }

        // Si es asesor, verificar si tiene actividad comercial
        if ($user->esAsesor() && $user->asesor) {
            $asesor = $user->asesor;

            // No se puede eliminar si tiene cotizaciones, reservas o ventas activas
            $tieneCotizaciones = $asesor->cotizaciones()->exists();
            $tieneReservas = $asesor->reservas()->exists();

            if ($tieneCotizaciones || $tieneReservas) {
                return false;
            }
        }

        return true;
    }

    /**
     * Mostrar un usuario específico
     */
    public function show($id)
    {
        $user = Auth::user();

        if (!$user || !$user->hasRole('administrador')) {
            return response()->json([
                'message' => 'No autorizado',
            ], 403);
        }

        $targetUser = User::findOrFail($id);

        // Cargar información relacionada según el rol
        if ($targetUser->hasRole('cliente')) {
            $targetUser->load('cliente');
        } elseif ($targetUser->hasRole('asesor')) {
            $targetUser->load('asesor');
        }

        return response()->json([
            'data' => $targetUser
        ]);
    }

    /**
     * Crear un nuevo usuario (solo administradores)
     */
    public function store(Request $request)
    {
        $user = Auth::user();

        if (!$user || !$user->hasRole('administrador')) {
            return response()->json([
                'message' => 'No autorizado',
            ], 403);
        }

        $request->validate([
            'name' => 'required|string|max:100',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
            'role' => ['required', Rule::in(['cliente', 'asesor', 'administrador'])],
            'telefono' => 'nullable|string|max:20',
            // Campos para asesor
            'codigo_asesor' => 'required_if:role,asesor|nullable|string|max:20',
            'comision' => 'required_if:role,asesor|nullable|numeric|min:0|max:100',
            // Campos para cliente
            'documento_identidad' => 'required_if:role,cliente|nullable|string|max:20',
            'direccion' => 'required_if:role,cliente|nullable|string|max:200',
        ]);

        try {
            $newUser = User::create([
                'name' => $request->input('name'),
                'email' => $request->input('email'),
                'password' => Hash::make($request->input('password')),
                'role' => $request->input('role'),
                'telefono' => $request->input('telefono'),
            ]);

            // Crear perfil adicional según el rol
            if ($request->input('role') === 'asesor') {
                Asesor::create([
                    'usuario_id' => $newUser->getAttribute('id'),
                    'fecha_contrato' => now(),
                ]);
            } elseif ($request->input('role') === 'cliente') {
                Cliente::create([
                    'usuario_id' => $newUser->getAttribute('id'),
                    'dni' => $request->input('documento_identidad'),
                    'direccion' => $request->input('direccion'),
                    'fecha_registro' => now(),
                ]);
            }

            return response()->json([
                'message' => 'Usuario creado exitosamente',
                'data' => $newUser
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al crear el usuario',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Actualizar un usuario existente (solo administradores)
     */
    public function update(Request $request, $id)
    {
        $user = Auth::user();

        if (!$user || !$user->hasRole('administrador')) {
            return response()->json([
                'message' => 'No autorizado',
            ], 403);
        }

        $targetUser = User::findOrFail($id);

        $request->validate([
            'name' => 'sometimes|required|string|max:100',
            'email' => ['sometimes', 'required', 'email', Rule::unique('users')->ignore($id)],
            'password' => 'sometimes|nullable|string|min:8',
            'role' => ['sometimes', 'required', Rule::in(['cliente', 'asesor', 'administrador'])],
            'telefono' => 'sometimes|nullable|string|max:20',
            // Campos para asesor
            'codigo_asesor' => 'sometimes|nullable|string|max:20',
            'comision' => 'sometimes|nullable|numeric|min:0|max:100',
            // Campos para cliente
            'documento_identidad' => 'sometimes|nullable|string|max:20',
            'direccion' => 'sometimes|nullable|string|max:200',
        ]);

        try {
            // Actualizar usuario básico
            $userData = $request->only(['name', 'email', 'telefono', 'role']);

            if ($request->filled('password')) {
                $userData['password'] = Hash::make($request->input('password'));
            }

            $targetUser->update($userData);

            // Actualizar perfil adicional según el rol
            if ($request->has('role')) {
                // Si cambia a asesor y no lo era antes
                if ($request->input('role') === 'asesor' && !$targetUser->asesor) {
                    Asesor::create([
                        'usuario_id' => $targetUser->getAttribute('id'),
                        'fecha_contrato' => now(),
                    ]);
                }

                // Si cambia a cliente y no lo era antes
                if ($request->input('role') === 'cliente' && !$targetUser->cliente) {
                    Cliente::create([
                        'usuario_id' => $targetUser->getAttribute('id'),
                        'dni' => $request->input('documento_identidad', ''),
                        'direccion' => $request->input('direccion', ''),
                        'fecha_registro' => now(),
                    ]);
                }
                // Si es cliente y actualiza datos de cliente
                elseif ($request->input('role') === 'cliente' && $targetUser->cliente) {
                    $targetUser->cliente->update([
                        'dni' => $request->input('documento_identidad', $targetUser->cliente->getAttribute('dni')),
                        'direccion' => $request->input('direccion', $targetUser->cliente->getAttribute('direccion')),
                    ]);
                }
            }

            return response()->json([
                'message' => 'Usuario actualizado exitosamente',
                'data' => $targetUser->fresh()
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al actualizar el usuario',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Eliminar un usuario (con validaciones de seguridad)
     */
    public function destroy($id)
    {
        $user = Auth::user();

        if (!$user || !$user->hasRole('administrador')) {
            return response()->json([
                'message' => 'No autorizado',
            ], 403);
        }

        if ($user->getAttribute('id') == $id) {
            return response()->json([
                'message' => 'No puedes eliminar tu propio usuario',
            ], 400);
        }

        $targetUser = User::with(['cliente', 'asesor'])->findOrFail($id);

        // Verificar si el usuario puede ser eliminado
        if (!$this->canDeleteUser($targetUser)) {
            $reason = $this->getDeletionBlockReason($targetUser);
            return response()->json([
                'message' => 'No se puede eliminar este usuario',
                'reason' => $reason,
            ], 422);
        }

        try {
            // Eliminar registros relacionados primero
            if ($targetUser->cliente) {
                $targetUser->cliente->delete();
            }

            if ($targetUser->asesor) {
                $targetUser->asesor->delete();
            }

            // Eliminar el usuario
            $targetUser->delete();

            return response()->json([
                'message' => 'Usuario eliminado exitosamente',
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al eliminar el usuario',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtener la razón por la cual no se puede eliminar un usuario
     */
    private function getDeletionBlockReason($user)
    {
        if ($user->email === 'admin@inmobiliaria.com') {
            return 'No se puede eliminar el administrador principal del sistema.';
        }

        if ($user->esCliente() && $user->cliente) {
            $cliente = $user->cliente;

            if ($cliente->cotizaciones()->exists()) {
                return 'Este cliente tiene cotizaciones registradas. Para proteger la integridad de los datos comerciales, no se puede eliminar.';
            }

            if ($cliente->reservas()->exists()) {
                return 'Este cliente tiene reservas registradas. Para proteger la integridad de los datos comerciales, no se puede eliminar.';
            }
        }

        if ($user->esAsesor() && $user->asesor) {
            $asesor = $user->asesor;

            if ($asesor->cotizaciones()->exists()) {
                return 'Este asesor tiene cotizaciones registradas. Para proteger la integridad de los datos comerciales, no se puede eliminar.';
            }

            if ($asesor->reservas()->exists()) {
                return 'Este asesor tiene reservas registradas. Para proteger la integridad de los datos comerciales, no se puede eliminar.';
            }
        }

        return 'Usuario protegido por políticas de seguridad.';
    }
}
