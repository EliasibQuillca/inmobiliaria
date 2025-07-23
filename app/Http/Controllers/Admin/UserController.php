<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Api\UserController as ApiUserController;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    protected $apiController;

    public function __construct()
    {
        $this->apiController = new ApiUserController();
    }

    /**
     * Mostrar la página de gestión de usuarios
     */
    public function index(Request $request)
    {
        try {
            // Obtener los datos desde el API controller
            $response = $this->apiController->index($request);
            $data = json_decode($response->getContent(), true);

            if ($response->getStatusCode() === 200) {
                return Inertia::render('Admin/Usuarios', [
                    'usuarios' => $data,
                    'pagination' => $data['pagination'] ?? null,
                    'filters' => [
                        'search' => $request->get('search', ''),
                        'role' => $request->get('role', ''),
                        'estado' => $request->get('estado', ''),
                        'page' => $request->get('page', 1),
                    ]
                ]);
            } else {
                return Inertia::render('Admin/Usuarios', [
                    'usuarios' => ['data' => []],
                    'pagination' => ['total' => 0],
                    'filters' => [],
                    'error' => 'Error al cargar usuarios'
                ]);
            }
        } catch (\Exception $e) {
            return Inertia::render('Admin/Usuarios', [
                'usuarios' => ['data' => []],
                'pagination' => ['total' => 0],
                'filters' => [],
                'error' => 'Error al cargar usuarios: ' . $e->getMessage()
            ]);
        }
    }

    /**
     * Mostrar el formulario para crear un nuevo usuario
     */
    public function create()
    {
        return Inertia::render('Admin/CrearUsuario');
    }

    /**
     * Mostrar el formulario para editar un usuario
     */
    public function edit($id)
    {
        try {
            $response = $this->apiController->show($id);
            $data = json_decode($response->getContent(), true);

            if ($response->getStatusCode() === 200) {
                return Inertia::render('Admin/EditarUsuario', [
                    'usuario' => $data['data']
                ]);
            } else {
                return redirect()->route('admin.usuarios')->with('error', 'Usuario no encontrado');
            }
        } catch (\Exception $e) {
            return redirect()->route('admin.usuarios')->with('error', 'Error al cargar usuario');
        }
    }

    /**
     * Almacenar un nuevo usuario
     */
    public function store(Request $request)
    {
        try {
            $response = $this->apiController->store($request);
            $data = json_decode($response->getContent(), true);

            if ($response->getStatusCode() === 201) {
                return redirect()->route('admin.usuarios')->with('success', 'Usuario creado correctamente');
            } else {
                return redirect()->back()->withInput()->with('error', $data['message'] ?? 'Error al crear el usuario');
            }
        } catch (\Exception $e) {
            return redirect()->back()->withInput()->with('error', 'Error al crear usuario: ' . $e->getMessage());
        }
    }

    /**
     * Actualizar un usuario existente
     */
    public function update(Request $request, $id)
    {
        try {
            $response = $this->apiController->update($request, $id);
            $data = json_decode($response->getContent(), true);

            if ($response->getStatusCode() === 200) {
                return redirect()->route('admin.usuarios')->with('success', 'Usuario actualizado correctamente');
            } else {
                return redirect()->back()->withInput()->with('error', $data['message'] ?? 'Error al actualizar el usuario');
            }
        } catch (\Exception $e) {
            return redirect()->back()->withInput()->with('error', 'Error al actualizar usuario: ' . $e->getMessage());
        }
    }

    /**
     * Cambiar el estado de un usuario
     */
    public function cambiarEstado(Request $request, $id)
    {
        try {
            $response = $this->apiController->cambiarEstado($request, $id);
            $data = json_decode($response->getContent(), true);

            if ($response->getStatusCode() === 200) {
                return redirect()->back()->with('success', 'Estado del usuario actualizado correctamente');
            } else {
                return redirect()->back()->with('error', $data['message'] ?? 'Error al cambiar estado del usuario');
            }
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Error al cambiar estado: ' . $e->getMessage());
        }
    }

    /**
     * Eliminar un usuario
     */
    public function destroy($id)
    {
        try {
            $response = $this->apiController->destroy($id);
            $data = json_decode($response->getContent(), true);

            if ($response->getStatusCode() === 200) {
                return redirect()->back()->with('success', 'Usuario eliminado correctamente');
            } else {
                return redirect()->back()->with('error', $data['message'] ?? 'Error al eliminar el usuario');
            }
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Error al eliminar usuario: ' . $e->getMessage());
        }
    }
}
