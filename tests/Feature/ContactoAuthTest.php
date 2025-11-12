<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ContactoAuthTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test que usuario no autenticado no puede enviar mensaje de contacto
     */
    public function test_guest_cannot_submit_contact_form(): void
    {
        $response = $this->post(route('contacto.enviar'), [
            'nombre' => 'Usuario Test',
            'email' => 'test@example.com',
            'telefono' => '123456789',
            'asunto' => 'Consulta',
            'mensaje' => 'Este es un mensaje de prueba',
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('error', 'Debes iniciar sesión para enviar un mensaje de contacto.');
    }

    /**
     * Test que usuario autenticado puede enviar mensaje de contacto
     */
    public function test_authenticated_user_can_submit_contact_form(): void
    {
        $user = User::factory()->create([
            'role' => 'cliente'
        ]);

        $response = $this->actingAs($user)->post(route('contacto.enviar'), [
            'nombre' => $user->name,
            'email' => $user->email,
            'telefono' => '123456789',
            'asunto' => 'Consulta sobre propiedades',
            'mensaje' => 'Me interesa conocer más sobre las propiedades disponibles',
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('success');
    }

    /**
     * Test que la validación del formulario funciona
     */
    public function test_contact_form_validation(): void
    {
        $user = User::factory()->create([
            'role' => 'cliente'
        ]);

        // Test sin nombre
        $response = $this->actingAs($user)->post(route('contacto.enviar'), [
            'nombre' => '',
            'email' => 'test@example.com',
            'asunto' => 'Test',
            'mensaje' => 'Mensaje de prueba',
        ]);
        $response->assertSessionHasErrors('nombre');

        // Test sin email
        $response = $this->actingAs($user)->post(route('contacto.enviar'), [
            'nombre' => 'Test User',
            'email' => '',
            'asunto' => 'Test',
            'mensaje' => 'Mensaje de prueba',
        ]);
        $response->assertSessionHasErrors('email');

        // Test email inválido
        $response = $this->actingAs($user)->post(route('contacto.enviar'), [
            'nombre' => 'Test User',
            'email' => 'email-invalido',
            'asunto' => 'Test',
            'mensaje' => 'Mensaje de prueba',
        ]);
        $response->assertSessionHasErrors('email');

        // Test sin asunto
        $response = $this->actingAs($user)->post(route('contacto.enviar'), [
            'nombre' => 'Test User',
            'email' => 'test@example.com',
            'asunto' => '',
            'mensaje' => 'Mensaje de prueba',
        ]);
        $response->assertSessionHasErrors('asunto');

        // Test sin mensaje
        $response = $this->actingAs($user)->post(route('contacto.enviar'), [
            'nombre' => 'Test User',
            'email' => 'test@example.com',
            'asunto' => 'Test',
            'mensaje' => '',
        ]);
        $response->assertSessionHasErrors('mensaje');

        // Test mensaje muy largo (más de 1000 caracteres)
        $response = $this->actingAs($user)->post(route('contacto.enviar'), [
            'nombre' => 'Test User',
            'email' => 'test@example.com',
            'asunto' => 'Test',
            'mensaje' => str_repeat('a', 1001),
        ]);
        $response->assertSessionHasErrors('mensaje');
    }

    /**
     * Test que página de contacto es accesible
     */
    public function test_contact_page_is_accessible(): void
    {
        $response = $this->get(route('contacto'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page->component('Public/Contacto'));
    }
}
