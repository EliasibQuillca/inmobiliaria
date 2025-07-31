<?php

namespace App\Http\Controllers\Cliente;

use App\Http\Controllers\Controller;
use App\Models\Cotizacion;
use App\Models\Departamento;
use App\Models\Cliente;
use App\Models\Asesor;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class SolicitudController extends Controller
{
    /**
     * Mostrar la lista de solicitudes del cliente autenticado.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        // En una implementación real, obtendríamos las solicitudes del cliente
        // autenticado desde la base de datos

        return Inertia::render('Cliente/Solicitudes');
    }

    /**
     * Mostrar el formulario para crear una nueva solicitud.
     *
     * @return \Inertia\Response
     */
    public function create(Request $request)
    {
        // Si se proporciona un ID de departamento, lo pasamos a la vista
        $departamentoId = $request->input('departamento_id');

        return Inertia::render('Cliente/CrearSolicitud', [
            'departamentoId' => $departamentoId,
        ]);
    }

    /**
     * Almacenar una nueva solicitud en la base de datos.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request)
    {
        // Validación de datos
        $validated = $request->validate([
            'departamento_id' => 'required|exists:departamentos,id',
            'tipo_consulta' => 'required|in:informacion,visita,financiamiento,cotizacion',
            'mensaje' => 'required|string|min:10|max:1000',
        ], [
            'departamento_id.required' => 'Debe seleccionar un departamento.',
            'departamento_id.exists' => 'El departamento seleccionado no existe.',
            'tipo_consulta.required' => 'Debe seleccionar un tipo de consulta.',
            'tipo_consulta.in' => 'El tipo de consulta seleccionado no es válido.',
            'mensaje.required' => 'El mensaje es obligatorio.',
            'mensaje.min' => 'El mensaje debe tener al menos 10 caracteres.',
            'mensaje.max' => 'El mensaje no puede exceder los 1000 caracteres.',
        ]);

        // Obtener el usuario autenticado
        $user = Auth::user();
        
        // Buscar el cliente asociado al usuario
        $cliente = Cliente::where('usuario_id', $user->id)->first();
        
        // Si no existe el cliente, crear uno básico
        if (!$cliente) {
            $cliente = Cliente::create([
                'usuario_id' => $user->id,
                'dni' => '00000000', // DNI temporal
                'telefono' => '000000000', // Teléfono temporal
                'direccion' => 'Por actualizar', // Dirección temporal
            ]);
        }

        // Asignar un asesor disponible antes de crear la solicitud
        $asesor = Asesor::inRandomOrder()->first();
        
        // Si no hay asesores disponibles, usar un valor por defecto o crear uno
        if (!$asesor) {
            // En caso de emergencia, podríamos crear un asesor temporal o usar el primero disponible
            // Por ahora, arrojamos una excepción
            return redirect()->back()->with('error', 'No hay asesores disponibles en este momento. Intente más tarde.');
        }

        // Crear la solicitud con asesor asignado desde el inicio
        $solicitud = Cotizacion::create([
            'cliente_id' => $cliente->id,
            'departamento_id' => $validated['departamento_id'],
            'asesor_id' => $asesor->id, // Incluir asesor desde el inicio
            'tipo_solicitud' => $validated['tipo_consulta'],
            'mensaje_solicitud' => $validated['mensaje'],
            'monto' => 0, // Monto inicial
            'estado' => 'pendiente',
        ]);

        return redirect()->route('cliente.solicitudes')->with('success', 'Solicitud enviada correctamente. El asesor ' . $asesor->nombre . ' se pondrá en contacto contigo pronto.');
    }

    /**
     * Mostrar el detalle de una solicitud específica.
     *
     * @param  int  $id
     * @return \Inertia\Response
     */
    public function show($id)
    {
        // En una implementación real, buscaríamos la solicitud por ID
        // y verificaríamos que pertenezca al cliente autenticado

        return Inertia::render('Cliente/DetalleSolicitud', [
            'solicitudId' => $id,
        ]);
    }

    /**
     * Actualizar el estado de una solicitud (por ejemplo, cancelarla).
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request, $id)
    {
        // Validación de datos
        $validated = $request->validate([
            'estado' => 'required|in:cancelada',
        ]);

        // En una implementación real, actualizaríamos la solicitud
        // Ejemplo:
        // $solicitud = Cotizacion::findOrFail($id);
        //
        // // Verificar que la solicitud pertenezca al cliente autenticado
        // if ($solicitud->cliente_id !== Auth::user()->getKey()) {
        //     abort(403, 'No autorizado');
        // }
        //
        // $solicitud->update([
        //     'estado' => $validated['estado'],
        // ]);

        // Redireccionar con mensaje de éxito
        return redirect()->route('cliente.solicitudes.show', $id)
            ->with('success', 'Solicitud actualizada exitosamente.');
    }

    /**
     * Agregar un comentario a una solicitud.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function addComment(Request $request, $id)
    {
        // Validación de datos
        $validated = $request->validate([
            'mensaje' => 'required|string',
        ]);

        // En una implementación real, agregaríamos el comentario
        // Ejemplo:
        // $solicitud = Cotizacion::findOrFail($id);
        //
        // // Verificar que la solicitud pertenezca al cliente autenticado
        // if ($solicitud->cliente_id !== Auth::user()->getKey()) {
        //     abort(403, 'No autorizado');
        // }
        //
        // $solicitud->comentarios()->create([
        //     'usuario_id' => Auth::id(),
        //     'mensaje' => $validated['mensaje'],
        //     'rol' => 'cliente',
        // ]);

        // Redireccionar con mensaje de éxito
        return redirect()->route('cliente.solicitudes.show', $id)
            ->with('success', 'Comentario agregado exitosamente.');
    }
}
