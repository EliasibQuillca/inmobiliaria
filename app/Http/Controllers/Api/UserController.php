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

        $query = User::query();

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

        return response()->json([
            'data' => $users->items(),
            'pagination' => [
                'current_page' => $users->currentPage(),
                'last_page' => $users->lastPage(),
                'per_page' => $users->perPage(),
                'total' => $users->total(),
            ],
        ]);
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
     * Eliminar un usuario (desactivar)
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

        $targetUser = User::findOrFail($id);

        try {
            // En lugar de eliminar, podríamos marcar como inactivo
            // o mover a una tabla de usuarios eliminados

            // Si realmente queremos eliminarlo
            $targetUser->delete();

            return response()->json([
                'message' => 'Usuario eliminado exitosamente',
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al desactivar el usuario',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
