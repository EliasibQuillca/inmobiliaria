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
        // Obtener el cliente actual
        $cliente = Cliente::where('usuario_id', Auth::id())->first();

        $solicitudes = collect();

        if ($cliente) {
            // Obtener todas las cotizaciones (solicitudes) del cliente
            $solicitudes = Cotizacion::where('cliente_id', $cliente->id)
                                   ->orderBy('created_at', 'desc')
                                   ->with([
                                       'departamento',
                                       'asesor.usuario',
                                       'comentarios' => function($query) {
                                           $query->orderBy('created_at', 'desc');
                                       }
                                   ])
                                   ->get();
        }

        return Inertia::render('Cliente/Solicitudes', [
            'solicitudes' => $solicitudes,
            'cliente' => $cliente
        ]);
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

        // Obtener departamentos disponibles para seleccionar
        $departamentos = Departamento::where('estado', 'disponible')
            ->with(['imagenes' => function($q) {
                $q->where('activa', true)->orderBy('orden')->limit(1);
            }])
            ->select('id', 'codigo', 'titulo', 'ubicacion', 'precio', 'habitaciones', 'banos', 'area')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function($dept) {
                return [
                    'id' => $dept->id,
                    'codigo' => $dept->codigo,
                    'titulo' => $dept->titulo,
                    'ubicacion' => $dept->ubicacion,
                    'precio' => $dept->precio,
                    'habitaciones' => $dept->habitaciones,
                    'banos' => $dept->banos,
                    'area' => $dept->area,
                    'imagen' => $dept->imagenes->first()?->url,
                ];
            });

        // Obtener asesores activos con su carga de trabajo actual
        $asesores = Asesor::where('estado', 'activo')
            ->withCount(['cotizaciones' => function($query) {
                $query->whereIn('estado', ['pendiente', 'en_proceso']);
            }])
            ->with('usuario:id,name,email')
            ->orderBy('nombre', 'asc')
            ->get()
            ->map(function($asesor) {
                return [
                    'id' => $asesor->id,
                    'nombre' => $asesor->nombre,
                    'apellidos' => $asesor->apellidos,
                    'nombre_completo' => $asesor->nombre . ' ' . $asesor->apellidos,
                    'email' => $asesor->usuario->email ?? null,
                    'telefono' => $asesor->telefono,
                    'especialidad' => $asesor->especialidad,
                    'experiencia' => $asesor->experiencia,
                    'solicitudes_activas' => $asesor->cotizaciones_count,
                    'disponibilidad' => $asesor->cotizaciones_count < 5 ? 'alta' : ($asesor->cotizaciones_count < 10 ? 'media' : 'baja'),
                ];
            });

        return Inertia::render('Cliente/CrearSolicitud', [
            'departamentoId' => $departamentoId,
            'departamentos' => $departamentos,
            'asesores' => $asesores,
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
            'asesor_id' => 'nullable|exists:asesores,id', // Opcional: el cliente puede elegir
        ], [
            'departamento_id.required' => 'Debe seleccionar un departamento.',
            'departamento_id.exists' => 'El departamento seleccionado no existe.',
            'tipo_consulta.required' => 'Debe seleccionar un tipo de consulta.',
            'tipo_consulta.in' => 'El tipo de consulta seleccionado no es válido.',
            'mensaje.required' => 'El mensaje es obligatorio.',
            'mensaje.min' => 'El mensaje debe tener al menos 10 caracteres.',
            'mensaje.max' => 'El mensaje no puede exceder los 1000 caracteres.',
            'asesor_id.exists' => 'El asesor seleccionado no existe.',
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

        // Determinar el asesor a asignar
        if ($request->filled('asesor_id')) {
            // Si el cliente seleccionó un asesor específico
            $asesor = Asesor::find($validated['asesor_id']);
        } else {
            // Auto-asignar al asesor con menos solicitudes pendientes (distribución equitativa)
            $asesor = Asesor::withCount(['cotizaciones' => function($query) {
                    $query->whereIn('estado', ['pendiente', 'en_proceso']);
                }])
                ->where('estado', 'activo') // Solo asesores activos
                ->orderBy('cotizaciones_count', 'asc') // El que tiene menos solicitudes
                ->first();
        }

        // Si no hay asesores disponibles
        if (!$asesor) {
            return redirect()->back()->withErrors([
                'mensaje' => 'No hay asesores disponibles en este momento. Por favor, intente más tarde o contacte al administrador.'
            ])->withInput();
        }

        // Crear la solicitud con asesor asignado automáticamente
        $solicitud = Cotizacion::create([
            'cliente_id' => $cliente->id,
            'departamento_id' => $validated['departamento_id'],
            'asesor_id' => $asesor->id,
            'tipo_solicitud' => $validated['tipo_consulta'],
            'mensaje_solicitud' => $validated['mensaje'],
            'monto' => 0, // Se calculará después
            'estado' => 'pendiente',
            'fecha_validez' => now()->addDays(30), // Válida por 30 días
        ]);

        return redirect()->route('cliente.solicitudes')->with('success', '¡Solicitud enviada! El asesor ' . $asesor->nombre . ' ' . $asesor->apellidos . ' se pondrá en contacto contigo pronto.');
    }

    /**
     * Mostrar el detalle de una solicitud específica.
     *
     * @param  int  $id
     * @return \Inertia\Response
     */
    public function show($id)
    {
        $user = Auth::user();
        $cliente = Cliente::where('usuario_id', $user->id)->first();

        if (!$cliente) {
            return redirect()->route('cliente.solicitudes')
                ->withErrors(['mensaje' => 'Cliente no encontrado']);
        }

        // Buscar la solicitud con sus relaciones
        $solicitud = Cotizacion::with([
            'departamento.propietario',
            'departamento.imagenes',
            'asesor.usuario',
            'comentarios.usuario'
        ])
        ->where('id', $id)
        ->where('cliente_id', $cliente->id) // Asegurar que la solicitud pertenece al cliente
        ->firstOrFail();

        return Inertia::render('Cliente/DetalleSolicitud', [
            'solicitud' => $solicitud,
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
        $user = Auth::user();
        $cliente = Cliente::where('usuario_id', $user->id)->first();

        if (!$cliente) {
            return redirect()->route('cliente.solicitudes')
                ->withErrors(['mensaje' => 'Cliente no encontrado']);
        }

        // Buscar la solicitud
        $solicitud = Cotizacion::where('id', $id)
            ->where('cliente_id', $cliente->id)
            ->firstOrFail();

        // Validación de datos
        $validated = $request->validate([
            'estado' => 'required|in:cancelada',
        ]);

        // Solo permitir cancelar si está pendiente o en proceso
        if (!in_array($solicitud->estado, ['pendiente', 'en_proceso'])) {
            return redirect()->back()
                ->withErrors(['mensaje' => 'No se puede cancelar esta solicitud en su estado actual.']);
        }

        // Actualizar el estado
        $solicitud->update([
            'estado' => $validated['estado'],
        ]);

        // Redireccionar a la lista de solicitudes con mensaje de éxito
        return redirect()->route('cliente.solicitudes')
            ->with('success', '✅ Solicitud cancelada exitosamente.');
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
