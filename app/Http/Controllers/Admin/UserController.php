<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{

    /**
     * Mostrar la página de gestión de usuarios
     */
    public function index(Request $request)
    {
        try {
            $query = User::query()
                ->with(['cliente', 'asesor'])
                ->when($request->filled('search'), function ($query) use ($request) {
                    $search = $request->search;
                    $query->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                })
                ->when($request->filled('role'), function ($query) use ($request) {
                    $query->where('role', $request->role);
                })
                ->when($request->filled('estado'), function ($query) use ($request) {
                    $query->where('estado', $request->estado);
                });

            $usuarios = $query->paginate(10)->withQueryString();

            return Inertia::render('Admin/Usuarios/Index', [
                'usuarios' => $usuarios,
                'filters' => [
                    'search' => $request->get('search', ''),
                    'role' => $request->get('role', ''),
                    'estado' => $request->get('estado', ''),
                ]
            ]);
        } catch (\Throwable $e) {
            return Inertia::render('Admin/Usuarios/Index', [
                'usuarios' => [
                    'data' => [],
                    'links' => [],
                    'meta' => []
                ],
                'filters' => [
                    'search' => '',
                    'role' => '',
                    'estado' => ''
                ],
            ])->with('error', 'Error al cargar usuarios: ' . $e->getMessage());
        }
    }

    /**
     * Mostrar el formulario para crear un nuevo usuario
     */
    public function create()
    {
        return Inertia::render('Admin/Usuarios/Crear');
    }

    /**
     * Mostrar el formulario para editar un usuario
     */
    public function edit($id)
    {
        try {
            $usuario = User::findOrFail($id);

            return Inertia::render('Admin/Usuarios/Editar', [
                'usuario' => $usuario
            ]);
        } catch (\Exception $e) {
            return redirect()->route('admin.usuarios.index')->with('error', 'Error al cargar usuario');
        }
    }

    /**
     * Almacenar un nuevo usuario
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|email|unique:users,email',
                'password' => 'required|min:8',
                'role' => 'required|string|in:admin,asesor,cliente',
                'estado' => 'required|boolean'
            ]);

            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'role' => $validated['role'],
                'estado' => $validated['estado']
            ]);

            return redirect()->route('admin.usuarios.index')
                ->with('success', 'Usuario creado correctamente');
        } catch (\Illuminate\Validation\ValidationException $e) {
            return redirect()->back()
                ->withErrors($e->errors())
                ->withInput();
        } catch (\Exception $e) {
            return redirect()->back()
                ->withInput()
                ->with('error', 'Error al crear usuario: ' . $e->getMessage());
        }
    }

    /**
     * Actualizar un usuario existente
     */
    public function update(Request $request, $id)
    {
        try {
            $usuario = User::findOrFail($id);

            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|email|unique:users,email,' . $id,
                'role' => 'sometimes|required|string'
            ]);

            $usuario->update($validated);

            return redirect()->route('admin.usuarios.index')
                ->with('success', 'Usuario actualizado correctamente');
        } catch (\Exception $e) {
            return redirect()->back()
                ->withInput()
                ->with('error', 'Error al actualizar usuario: ' . $e->getMessage());
        }
    }

    /**
     * Cambiar el estado de un usuario
     */
    public function cambiarEstado(Request $request, $id)
    {
        try {
            $usuario = User::findOrFail($id);

            $validated = $request->validate([
                'estado' => 'required|boolean'
            ]);

            $usuario->update([
                'estado' => $validated['estado']
            ]);

            return redirect()->back()
                ->with('success', 'Estado del usuario actualizado correctamente');
        } catch (\Illuminate\Validation\ValidationException $e) {
            return redirect()->back()
                ->withErrors($e->errors());
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Error al cambiar estado: ' . $e->getMessage());
        }
    }

    /**
     * Eliminar un usuario
     */
    public function destroy($id)
    {
        try {
            $usuario = User::findOrFail($id);
            $usuario->delete();

            return redirect()->back()
                ->with('success', 'Usuario eliminado correctamente');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Error al eliminar usuario: ' . $e->getMessage());
        }
    }
}
