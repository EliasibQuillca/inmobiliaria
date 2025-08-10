<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Asesor;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class AsesorController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $asesores = Asesor::with('usuario')->paginate(10);

        return Inertia::render('Admin/Asesores', [
            'asesores' => $asesores
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Admin/CrearAsesor');
    }

    /**
     * Store a newly created resource in storage.
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
        $usuario = User::create([
            'name' => $validated['nombre'] . ' ' . $validated['apellidos'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => 'asesor',
            'estado' => $validated['estado'],
        ]);

        // Crear el asesor
        Asesor::create([
            'usuario_id' => $usuario->id,
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

        return redirect()->route('admin.asesores')
            ->with('success', 'Asesor creado exitosamente');
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $asesor = Asesor::with(['usuario', 'clientes.usuario', 'cotizaciones.departamento'])
            ->findOrFail($id);

        return Inertia::render('Admin/DetalleAsesor', [
            'asesor' => $asesor,
            'id' => $id
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        $asesor = Asesor::with('usuario')->findOrFail($id);

        return Inertia::render('Admin/EditarAsesor', [
            'asesor' => $asesor
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $asesor = Asesor::with('usuario')->findOrFail($id);

        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'apellidos' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $asesor->usuario->id,
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

        // Actualizar usuario
        $asesor->usuario->update([
            'name' => $validated['nombre'] . ' ' . $validated['apellidos'],
            'email' => $validated['email'],
            'estado' => $validated['estado'],
        ]);

        // Actualizar asesor
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

        return redirect()->route('admin.asesores')
            ->with('success', 'Asesor actualizado exitosamente');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $asesor = Asesor::findOrFail($id);

        // No eliminar si tiene cotizaciones o ventas asociadas
        if ($asesor->cotizaciones()->exists() || $asesor->ventas()->exists()) {
            return redirect()->back()
                ->with('error', 'No se puede eliminar el asesor porque tiene cotizaciones o ventas asociadas');
        }

        $asesor->usuario->delete();
        $asesor->delete();

        return redirect()->route('admin.asesores')
            ->with('success', 'Asesor eliminado exitosamente');
    }

    /**
     * Cambiar estado del asesor
     */
    public function cambiarEstado(Request $request, $id)
    {
        $asesor = Asesor::with('usuario')->findOrFail($id);

        $validated = $request->validate([
            'estado' => 'required|in:activo,inactivo',
        ]);

        $asesor->update(['estado' => $validated['estado']]);
        $asesor->usuario->update(['estado' => $validated['estado']]);

        return redirect()->back()
            ->with('success', 'Estado del asesor actualizado exitosamente');
    }
}
