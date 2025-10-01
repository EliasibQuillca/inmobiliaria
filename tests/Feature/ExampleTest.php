<?php

namespace Tests\Feature;

// use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ExampleTest extends TestCase
{
    /**
     * A basic test example.
     */
    public function test_the_application_returns_a_successful_response(): void
    {
        $response = $this->get('/');

        $response->assertRedirect('/catalogo');
    }

    /**
     * Test catalogo page loads correctly.
     */
    public function test_catalogo_page_loads_successfully(): void
    {
        $response = $this->get('/catalogo');

        $response->assertStatus(200);
    }
}
