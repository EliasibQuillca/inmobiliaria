<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

class PublicPagesTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test 1: La página de inicio redirige al catálogo
     */
    public function test_home_redirects_to_catalogo()
    {
        $response = $this->get('/');
        $response->assertRedirect('/catalogo');
    }

    /**
     * Test 2: La página del catálogo público es accesible
     */
    public function test_catalogo_publico_es_accesible()
    {
        $response = $this->get('/catalogo');
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) =>
            $page->component('Public/Catalogo')
        );
    }

    /**
     * Test 3: La página "Sobre Nosotros" es accesible
     */
    public function test_sobre_nosotros_es_accesible()
    {
        $response = $this->get('/sobre-nosotros');
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) =>
            $page->component('Public/SobreNosotros')
        );
    }

    /**
     * Test 4: La página de contacto es accesible
     */
    public function test_contacto_es_accesible()
    {
        $response = $this->get('/contacto');
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) =>
            $page->component('Public/Contacto')
        );
    }

    /**
     * Test 5: Formulario de contacto requiere autenticación
     */
    public function test_formulario_contacto_requiere_autenticacion()
    {
        $response = $this->post('/contacto/enviar', [
            'nombre' => 'Juan Pérez',
            'email' => 'juan@ejemplo.com',
            'asunto' => 'Consulta',
            'mensaje' => 'Mensaje de prueba',
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('error', 'Debes iniciar sesión para enviar un mensaje de contacto.');
    }

    /**
     * Test 6: Usuario autenticado puede validar formulario de contacto
     */
    public function test_formulario_contacto_valida_email_usuario_autenticado()
    {
        $user = \App\Models\User::factory()->create(['role' => 'cliente']);

        $response = $this->actingAs($user)->post('/contacto/enviar', [
            'nombre' => 'Juan Pérez',
            'email' => 'email-invalido',
            'asunto' => 'Consulta',
            'mensaje' => 'Mensaje de prueba',
        ]);

        $response->assertSessionHasErrors(['email']);
    }

    /**
     * Test 7: Usuario autenticado puede enviar formulario de contacto con datos válidos
     */
    public function test_formulario_contacto_funciona_con_datos_validos_usuario_autenticado()
    {
        $user = \App\Models\User::factory()->create(['role' => 'cliente']);

        $response = $this->actingAs($user)->post('/contacto/enviar', [
            'nombre' => 'Juan Pérez',
            'email' => 'juan@ejemplo.com',
            'telefono' => '+51 987654321',
            'asunto' => 'Consulta sobre departamento',
            'mensaje' => 'Estoy interesado en conocer más sobre sus propiedades disponibles.',
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('success');
    }

    /**
     * Test 8: Usuario autenticado - formulario de contacto valida longitud del mensaje
     */
    public function test_formulario_contacto_valida_longitud_mensaje_usuario_autenticado()
    {
        $user = \App\Models\User::factory()->create(['role' => 'cliente']);

        $response = $this->actingAs($user)->post('/contacto/enviar', [
            'nombre' => 'Juan Pérez',
            'email' => 'juan@ejemplo.com',
            'asunto' => 'Consulta',
            'mensaje' => str_repeat('A', 1001), // 1001 caracteres
        ]);

        $response->assertSessionHasErrors(['mensaje']);
    }

    /**
     * Test 9: Todas las páginas públicas son accesibles sin autenticación
     */
    public function test_paginas_publicas_accesibles_sin_autenticacion()
    {
        $pages = [
            '/catalogo',
            '/sobre-nosotros',
            '/contacto',
        ];

        foreach ($pages as $page) {
            $response = $this->get($page);
            $response->assertStatus(200);
        }
    }
}
