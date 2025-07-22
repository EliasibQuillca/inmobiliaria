<?php

namespace App\Http\Controllers;

use App\Models\Asesor;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class AsesorController extends Controller
{
    /**
     * Muestra la lista de asesores para el administrador.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        $asesores = Asesor::with('usuario')->paginate(10);

        return Inertia::render('Admin/Asesores', [
            'asesores' => $asesores,
            'filters' => request()->all('search', 'estado'),
        ]);
    }

    /**
     * Muestra el formulario para crear un nuevo asesor.
     *
     * @return \Inertia\Response
     */
    public function create()
    {
        return Inertia::render('Admin/CrearAsesor');
    }

    /**
     * Almacena un nuevo asesor en la base de datos.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'apellidos' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'telefono' => 'required|string|max:20',
            'documento' => 'required|string|max:20|unique:asesores',
            'direccion' => 'required|string|max:255',
            'fecha_nacimiento' => 'required|date',
            'especialidad' => 'nullable|string|max:100',
            'experiencia' => 'nullable|numeric',
            'biografia' => 'nullable|string',
            'estado' => 'required|in:activo,inactivo',
            'comision_porcentaje' => 'required|numeric|min:0|max:100',
        ]);

        // Crear el usuario primero
        $user = User::create([
            'name' => $validated['nombre'] . ' ' . $validated['apellidos'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => 'asesor',
        ]);

        // Crear el asesor asociado al usuario
        $asesor = Asesor::create([
            'usuario_id' => $user->id,
            'nombre' => $validated['nombre'],
            'apellidos' => $validated['apellidos'],
            'telefono' => $validated['telefono'],
            'documento' => $validated['documento'],
            'direccion' => $validated['direccion'],
            'fecha_nacimiento' => $validated['fecha_nacimiento'],
            'especialidad' => $validated['especialidad'],
            'experiencia' => $validated['experiencia'],
            'biografia' => $validated['biografia'],
            'estado' => $validated['estado'],
            'comision_porcentaje' => $validated['comision_porcentaje'],
            'fecha_contrato' => now(),
        ]);

        return redirect()->route('admin.asesores.index')
            ->with('success', 'Asesor creado correctamente.');
    }

    /**
     * Muestra los detalles de un asesor específico.
     *
     * @param  int  $id
     * @return \Inertia\Response
     */
    public function show($id)
    {
        $asesor = Asesor::with('usuario', 'clientes', 'cotizaciones', 'reservas')->findOrFail($id);

        return Inertia::render('Admin/DetalleAsesor', [
            'asesor' => $asesor,
        ]);
    }

    /**
     * Muestra el formulario para editar un asesor.
     *
     * @param  int  $id
     * @return \Inertia\Response
     */
    public function edit($id)
    {
        $asesor = Asesor::with('usuario')->findOrFail($id);

        return Inertia::render('Admin/EditarAsesor', [
            'asesor' => $asesor,
        ]);
    }

    /**
     * Actualiza un asesor específico en la base de datos.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request, $id)
    {
        $asesor = Asesor::findOrFail($id);

        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'apellidos' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $asesor->usuario_id,
            'telefono' => 'required|string|max:20',
            'documento' => 'required|string|max:20|unique:asesores,documento,' . $id,
            'direccion' => 'required|string|max:255',
            'fecha_nacimiento' => 'required|date',
            'especialidad' => 'nullable|string|max:100',
            'experiencia' => 'nullable|numeric',
            'biografia' => 'nullable|string',
            'estado' => 'required|in:activo,inactivo',
            'comision_porcentaje' => 'required|numeric|min:0|max:100',
        ]);

        // Actualizar el usuario asociado
        $usuario = User::findOrFail($asesor->usuario_id);
        $usuario->update([
            'name' => $validated['nombre'] . ' ' . $validated['apellidos'],
            'email' => $validated['email'],
        ]);

        // Actualizar la contraseña solo si se proporciona
        if ($request->filled('password')) {
            $request->validate([
                'password' => 'string|min:8',
            ]);

            $usuario->update([
                'password' => Hash::make($request->input('password')),
            ]);
        }

        // Actualizar el asesor
        $asesor->update([
            'nombre' => $validated['nombre'],
            'apellidos' => $validated['apellidos'],
            'telefono' => $validated['telefono'],
            'documento' => $validated['documento'],
            'direccion' => $validated['direccion'],
            'fecha_nacimiento' => $validated['fecha_nacimiento'],
            'especialidad' => $validated['especialidad'],
            'experiencia' => $validated['experiencia'],
            'biografia' => $validated['biografia'],
            'estado' => $validated['estado'],
            'comision_porcentaje' => $validated['comision_porcentaje'],
        ]);

        return redirect()->route('admin.asesores.index')
            ->with('success', 'Asesor actualizado correctamente.');
    }

    /**
     * Elimina un asesor específico de la base de datos.
     *
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy($id)
    {
        $asesor = Asesor::findOrFail($id);

        // Verificar si el asesor tiene clientes, cotizaciones o reservas asociadas
        if ($asesor->clientes()->count() > 0 || $asesor->cotizaciones()->count() > 0 || $asesor->reservas()->count() > 0) {
            return back()->with('error', 'No se puede eliminar el asesor porque tiene registros asociados.');
        }

        // Eliminar el usuario asociado
        $usuario = User::findOrFail($asesor->usuario_id);
        $asesor->delete();
        $usuario->delete();

        return redirect()->route('admin.asesores.index')
            ->with('success', 'Asesor eliminado correctamente.');
    }
}
