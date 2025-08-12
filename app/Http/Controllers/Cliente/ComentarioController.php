<?php

namespace App\Http\Controllers\Cliente;

use App\Http\Controllers\Controller;
use App\Models\ComentarioSolicitud;
use App\Models\Cotizacion;
use App\Models\Cliente;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ComentarioController extends Controller
{
    /**
     * Mostrar los comentarios de una solicitud específica
     *
     * @param  int  $cotizacionId
     * @return \Inertia\Response
     */
    public function show($cotizacionId)
    {
        // Verificar que la cotización pertenece al cliente actual
        $cliente = Cliente::where('usuario_id', Auth::id())->first();
        
        if (!$cliente) {
            return redirect()->route('cliente.dashboard')->with('error', 'Cliente no encontrado.');
        }

        $cotizacion = Cotizacion::where('id', $cotizacionId)
                               ->where('cliente_id', $cliente->id)
                               ->with([
                                   'departamento',
                                   'asesor.usuario',
                                   'comentarios.usuario'
                               ])
                               ->first();

        if (!$cotizacion) {
            return redirect()->route('cliente.solicitudes')->with('error', 'Solicitud no encontrada.');
        }

        // Marcar comentarios del asesor como leídos
        $cotizacion->comentarios()
                   ->where('tipo', 'asesor')
                   ->where('leido', false)
                   ->update(['leido' => true]);

        return Inertia::render('Cliente/DetalleSolicitud', [
            'cotizacion' => $cotizacion,
            'cliente' => $cliente
        ]);
    }

    /**
     * Agregar un nuevo comentario a la solicitud
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $cotizacionId
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request, $cotizacionId)
    {
        // Validar datos
        $validated = $request->validate([
            'comentario' => 'required|string|min:5|max:1000',
        ], [
            'comentario.required' => 'El comentario es obligatorio.',
            'comentario.min' => 'El comentario debe tener al menos 5 caracteres.',
            'comentario.max' => 'El comentario no puede exceder los 1000 caracteres.',
        ]);

        // Verificar que la cotización pertenece al cliente actual
        $cliente = Cliente::where('usuario_id', Auth::id())->first();
        
        if (!$cliente) {
            return redirect()->back()->with('error', 'Cliente no encontrado.');
        }

        $cotizacion = Cotizacion::where('id', $cotizacionId)
                               ->where('cliente_id', $cliente->id)
                               ->first();

        if (!$cotizacion) {
            return redirect()->back()->with('error', 'Solicitud no encontrada.');
        }

        // Crear el comentario
        ComentarioSolicitud::create([
            'cotizacion_id' => $cotizacion->id,
            'usuario_id' => Auth::id(),
            'comentario' => $validated['comentario'],
            'tipo' => 'cliente',
            'leido' => false,
        ]);

        // Si la cotización estaba en estado 'pendiente', cambiarla a 'en_revision'
        if ($cotizacion->estado === 'pendiente') {
            $cotizacion->update(['estado' => 'en_revision']);
        }

        return redirect()->back()->with('success', 'Comentario agregado correctamente.');
    }

    /**
     * Contar comentarios no leídos para el cliente
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function contarNoLeidos()
    {
        $cliente = Cliente::where('usuario_id', Auth::id())->first();
        
        if (!$cliente) {
            return response()->json(['count' => 0]);
        }

        // Contar comentarios de asesores no leídos en solicitudes del cliente
        $count = ComentarioSolicitud::whereHas('cotizacion', function($query) use ($cliente) {
                    $query->where('cliente_id', $cliente->id);
                })
                ->where('tipo', 'asesor')
                ->where('leido', false)
                ->count();

        return response()->json(['count' => $count]);
    }

    /**
     * Marcar todos los comentarios como leídos
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function marcarTodosLeidos()
    {
        $cliente = Cliente::where('usuario_id', Auth::id())->first();
        
        if (!$cliente) {
            return response()->json(['success' => false]);
        }

        // Marcar comentarios de asesores como leídos
        ComentarioSolicitud::whereHas('cotizacion', function($query) use ($cliente) {
                    $query->where('cliente_id', $cliente->id);
                })
                ->where('tipo', 'asesor')
                ->where('leido', false)
                ->update(['leido' => true]);

        return response()->json(['success' => true]);
    }
}
