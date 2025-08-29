<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Cliente;
use App\Models\Asesor;
use App\Models\AuditoriaUsuario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Login de usuario
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Las credenciales son incorrectas.'],
            ]);
        }

        $token = $user->createToken('auth-token')->plainTextToken;

        // Registrar auditoría
        AuditoriaUsuario::registrarLogin($user->id);

        return response()->json([
            'message' => 'Login exitoso',
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'created_at' => $user->created_at,
            ],
        ]);
    }

    /**
     * Logout de usuario
     */
    public function logout(Request $request)
    {
        $user = $request->user();
        
        // Registrar auditoría antes de eliminar tokens
        AuditoriaUsuario::registrarLogout($user->id);
        
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logout exitoso',
        ]);
    }

    /**
     * Registro de cliente
     */
    public function registerCliente(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:100',
            'email' => 'required|email|unique:users,email',
            'telefono' => 'nullable|string|max:20',
            'password' => 'required|string|min:6',
            'dni' => 'required|string|max:20|unique:clientes,dni',
            'direccion' => 'nullable|string|max:200',
        ]);

        try {
            // Crear usuario
            $user = User::create([
                'nombre' => $request->nombre,
                'email' => $request->email,
                'telefono' => $request->telefono,
                'clave_hash' => Hash::make($request->password),
                'rol' => 'cliente',
            ]);

            // Crear perfil de cliente
            Cliente::create([
                'usuario_id' => $user->id,
                'dni' => $request->dni,
                'direccion' => $request->direccion,
                'fecha_registro' => now(),
            ]);

            $token = $user->createToken('auth-token')->plainTextToken;

            // Registrar auditoría
            AuditoriaUsuario::registrar($user->id, 'registro_cliente');

            return response()->json([
                'message' => 'Cliente registrado exitosamente',
                'token' => $token,
                'user' => [
                    'id' => $user->id,
                    'nombre' => $user->name,
                    'email' => $user->email,
                    'telefono' => $user->telefono,
                    'rol' => $user->role,
                ],
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al registrar cliente',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Obtener usuario autenticado
     */
    public function me(Request $request)
    {
        $user = $request->user();
        
        $userData = [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
        ];

        // Agregar información específica según el rol
        if ($user->role === 'cliente' && $user->cliente) {
            $userData['cliente'] = [
                'dni' => $user->cliente->dni,
                'direccion' => $user->cliente->direccion,
                'telefono' => $user->cliente->telefono,
            ];
        } elseif ($user->role === 'asesor' && $user->asesor) {
            $userData['asesor'] = [
                'fecha_contrato' => $user->asesor->fecha_contrato,
                'especialidad' => $user->asesor->especialidad,
            ];
        }

        return response()->json($userData);
    }
}
