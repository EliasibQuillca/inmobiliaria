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

        if (!$user || !Hash::check($request->password, $user->clave_hash)) {
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
                'nombre' => $user->nombre,
                'email' => $user->email,
                'telefono' => $user->telefono,
                'rol' => $user->rol,
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
                    'nombre' => $user->nombre,
                    'email' => $user->email,
                    'telefono' => $user->telefono,
                    'rol' => $user->rol,
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
            'nombre' => $user->nombre,
            'email' => $user->email,
            'telefono' => $user->telefono,
            'rol' => $user->rol,
        ];

        // Agregar información específica según el rol
        if ($user->esCliente() && $user->cliente) {
            $userData['cliente'] = [
                'dni' => $user->cliente->dni,
                'direccion' => $user->cliente->direccion,
                'fecha_registro' => $user->cliente->fecha_registro,
            ];
        } elseif ($user->esAsesor() && $user->asesor) {
            $userData['asesor'] = [
                'fecha_contrato' => $user->asesor->fecha_contrato,
            ];
        }

        return response()->json($userData);
    }
}
