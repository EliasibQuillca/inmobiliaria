<?php

namespace Tests\Feature\Public;

use Tests\TestCase;
use App\Models\User;
use App\Models\Propietario;
use Illuminate\Foundation\Testing\RefreshDatabase;

class DepartamentoValidationTest extends TestCase
{
    use RefreshDatabase;
    
    protected $admin;
    protected $propietario;
    protected $departamento;

    protected function setUp(): void
    {
        parent::setUp();
        $this->withoutExceptionHandling();
        
        // Crear un usuario administrador
        $this->admin = User::factory()->create([
            'role' => 'administrador'
        ]);

        // Crear un propietario para asociar al departamento
        $this->propietario = Propietario::factory()->create();

        // Crear un departamento de prueba
        $this->departamento = \App\Models\Departamento::factory()->create([
            'propietario_id' => $this->propietario->id
        ]);
    }    public function test_required_fields_validation()
    {
        $response = $this->actingAs($this->admin, 'sanctum')
            ->putJson('/api/v1/admin/departamentos/' . $this->departamento->id, [
                'titulo' => 'Departamento Test',
                'descripcion' => 'Descripción de prueba',
                'ubicacion' => 'Ubicación de prueba',
                'precio' => 100000,
                'habitaciones' => 2,
                'banos' => 1,
                'propietario_id' => $this->propietario->id,
                'estado' => 'disponible'
                // Intencionalmente omitiendo area, piso y año_construccion
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['area', 'piso', 'año_construccion']);

        // Ahora probamos con todos los campos requeridos
        $response = $this->actingAs($this->admin, 'sanctum')
            ->putJson('/api/v1/admin/departamentos/' . $this->departamento->id, [
                'titulo' => 'Departamento Test',
                'descripcion' => 'Descripción de prueba',
                'ubicacion' => 'Ubicación de prueba',
                'precio' => 100000,
                'habitaciones' => 2,
                'banos' => 1,
                'area' => 75,
                'piso' => 3,
                'año_construccion' => 2020,
                'propietario_id' => $this->propietario->id,
                'estado' => 'disponible'
            ]);

        $response->assertStatus(200); // La validación pasa y el departamento existe
    }

    public function test_numeric_validation()
    {
        $response = $this->actingAs($this->admin, 'sanctum')
            ->putJson('/api/v1/admin/departamentos/' . $this->departamento->id, [
                'titulo' => 'Departamento Test',
                'descripcion' => 'Descripción de prueba',
                'ubicacion' => 'Ubicación de prueba',
                'precio' => 100000,
                'habitaciones' => 2,
                'banos' => 1,
                'area' => 'no-numerico', // Valor inválido
                'piso' => 'planta-baja', // Valor inválido
                'año_construccion' => 'antiguo', // Valor inválido
                'propietario_id' => $this->propietario->id,
                'estado' => 'disponible'
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors([
                'area' => 'validation.numeric',
                'piso' => 'validation.integer',
                'año_construccion' => ['validation.integer', 'validation.min.numeric']
            ]);
    }
}