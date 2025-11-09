<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;

class PageController extends Controller
{
    /**
     * Muestra la página "Sobre Nosotros"
     */
    public function sobreNosotros()
    {
        return Inertia::render('Public/SobreNosotros');
    }

    /**
     * Muestra la página de contacto
     */
    public function contacto()
    {
        return Inertia::render('Public/Contacto');
    }

    /**
     * Procesa el formulario de contacto
     */
    public function enviarContacto(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nombre' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'telefono' => 'nullable|string|max:20',
            'asunto' => 'required|string|max:255',
            'mensaje' => 'required|string|max:1000',
        ], [
            'nombre.required' => 'El nombre es obligatorio',
            'email.required' => 'El email es obligatorio',
            'email.email' => 'El email debe ser válido',
            'asunto.required' => 'El asunto es obligatorio',
            'mensaje.required' => 'El mensaje es obligatorio',
            'mensaje.max' => 'El mensaje no puede exceder 1000 caracteres',
        ]);

        if ($validator->fails()) {
            return redirect()->back()
                ->withErrors($validator)
                ->withInput();
        }

        try {
            // Aquí puedes enviar el email o guardar en base de datos
            // Por ahora solo retornamos éxito

            // Ejemplo de envío de email (descomentar si tienes configurado Mail)
            /*
            Mail::send('emails.contacto', $request->all(), function ($message) use ($request) {
                $message->to('info@inmobiliaria.com')
                    ->subject('Nuevo mensaje de contacto: ' . $request->asunto);
                $message->from($request->email, $request->nombre);
            });
            */

            return redirect()->back()->with('success', '¡Gracias por contactarnos! Nos pondremos en contacto contigo pronto.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Hubo un error al enviar el mensaje. Por favor, intenta nuevamente.');
        }
    }
}
