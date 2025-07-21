<?php

namespace App\Http\Controllers\Cliente;

use App\Http\Controllers\Controller;
use App\Models\Cotizacion;
use App\Models\Departamento;
use App\Models\Cliente;
use App\Models\Asesor;
use App\Models\User;
use Illuminate\Http\Request;
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
            'tipo_solicitud' => 'required|in:informacion,visita,financiamiento,cotizacion',
            'mensaje' => 'required|string|min:10',
            'telefono' => 'required|string',
            'disponibilidad' => 'required|array|min:1',
            'preferencia_contacto' => 'required|in:email,telefono,whatsapp',
        ]);

        // Buscar o crear un registro de cliente para el usuario autenticado si no existe
        if (auth()->check()) {
            $user = auth()->user();

            // Buscar si ya existe un cliente asociado al usuario
            $cliente = Cliente::where('usuario_id', $user->id)->first();

            // Si no existe, crear un nuevo cliente
            if (!$cliente) {
                $cliente = new Cliente();
                $cliente->usuario_id = $user->id;
                $cliente->dni = $request->input('dni', '00000000'); // Asumiendo un valor por defecto
                $cliente->direccion = $request->input('direccion');
                // No necesitamos asignar fecha_registro explícitamente
                // ya que el campo tiene un default en la migración
                $cliente->save();
            }            // Creamos la solicitud vinculada al cliente
            $solicitud = new Cotizacion([
                'cliente_id' => $cliente->getKey(), // Usar getKey() en lugar de id directo
                'departamento_id' => $validated['departamento_id'],
                'tipo' => $validated['tipo_solicitud'],
                'mensaje' => $validated['mensaje'],
                'telefono' => $validated['telefono'],
                'disponibilidad' => json_encode($validated['disponibilidad']),
                'preferencia_contacto' => $validated['preferencia_contacto'],
                'estado' => 'pendiente',
                'monto' => 0,
            ]);
            $solicitud->save();

            // Asignar automáticamente un asesor disponible
            $asesor = Asesor::inRandomOrder()->first();

            if ($asesor) {
                $solicitud->asesor_id = $asesor->id;
                $solicitud->estado = 'en_proceso';
                $solicitud->save();

                // Aquí podríamos crear un comentario automático en la solicitud
                // si tenemos un modelo para comentarios
                /*
                $solicitud->comentarios()->create([
                    'usuario_id' => $asesor->usuario_id,
                    'mensaje' => 'Su solicitud ha sido asignada a un asesor. Pronto me pondré en contacto con usted.',
                    'rol' => 'asesor',
                ]);
                */
            }
        } else {
            // En caso de que el usuario no esté autenticado
            // aquí podríamos manejar la creación de solicitudes para usuarios no autenticados
            // o redirigir al login
        }

        // Redireccionar a la lista de solicitudes con mensaje de éxito
        return redirect()->route('cliente.solicitudes.index')
            ->with('success', 'Solicitud creada exitosamente. Un asesor se pondrá en contacto contigo pronto.');
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
        // if ($solicitud->cliente_id !== auth()->user()->id) {
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
        // if ($solicitud->cliente_id !== auth()->user()->id) {
        //     abort(403, 'No autorizado');
        // }
        //
        // $solicitud->comentarios()->create([
        //     'usuario_id' => auth()->user()->id,
        //     'mensaje' => $validated['mensaje'],
        //     'rol' => 'cliente',
        // ]);

        // Redireccionar con mensaje de éxito
        return redirect()->route('cliente.solicitudes.show', $id)
            ->with('success', 'Comentario agregado exitosamente.');
    }
}
