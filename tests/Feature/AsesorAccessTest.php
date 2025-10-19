<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Asesor;
use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

class AsesorAccessTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Prueba que un usuario con rol de asesor puede acceder al dashboard de asesor.
     */
    public function test_asesor_can_access_dashboard()
    {
        // Crear un usuario con rol de asesor
        $user = User::factory()->create([
            'role' => 'asesor',
            'estado' => 'activo'
        ]);
        
        // Crear registro de asesor asociado al usuario
        $asesor = Asesor::factory()->create([
            'usuario_id' => $user->id,
            'experiencia' => 2, // Valor numérico para experiencia
            'estado' => 'activo'
        ]);

        // Autenticar al usuario
        $response = $this->actingAs($user)->get('/dashboard');

        // Verificar redirección al dashboard de asesor
        $response->assertRedirect('/asesor/dashboard');
        
        // Verificar que puede acceder directamente al dashboard de asesor
        $dashboardResponse = $this->actingAs($user)->get('/asesor/dashboard');
        $dashboardResponse->assertStatus(200);
    }
    
    /**
     * Prueba que un usuario con rol de asesor puede acceder a la sección de clientes.
     */
    public function test_asesor_can_access_clientes()
    {
        // Crear un usuario con rol de asesor
        $user = User::factory()->create([
            'role' => 'asesor',
            'estado' => 'activo'
        ]);
        
        // Crear registro de asesor asociado al usuario
        $asesor = Asesor::factory()->create([
            'usuario_id' => $user->id,
            'experiencia' => 3, // Valor numérico para experiencia
            'estado' => 'activo'
        ]);

        // Verificar acceso a la sección de clientes
        $response = $this->actingAs($user)->get('/asesor/clientes');
        $response->assertStatus(200);
    }
    
    /**
     * Prueba que un usuario con rol de asesor puede acceder a la sección de cotizaciones.
     */
    public function test_asesor_can_access_cotizaciones()
    {
        // Crear un usuario con rol de asesor
        $user = User::factory()->create([
            'role' => 'asesor',
            'estado' => 'activo'
        ]);
        
        // Crear registro de asesor asociado al usuario
        $asesor = Asesor::factory()->create([
            'usuario_id' => $user->id,
            'experiencia' => 5, // Valor numérico para experiencia
            'estado' => 'activo'
        ]);

        // Verificar acceso a la sección de cotizaciones
        $response = $this->actingAs($user)->get('/asesor/cotizaciones');
        $response->assertStatus(200);
    }
    
    /**
     * Prueba que un usuario con rol de asesor puede acceder a la sección de solicitudes.
     */
    public function test_asesor_can_access_solicitudes()
    {
        // Crear un usuario con rol de asesor
        $user = User::factory()->create([
            'role' => 'asesor',
            'estado' => 'activo'
        ]);
        
        // Crear registro de asesor asociado al usuario
        $asesor = Asesor::factory()->create([
            'usuario_id' => $user->id,
            'experiencia' => 1, // Valor numérico para experiencia
            'estado' => 'activo'
        ]);

        // Verificar acceso a la sección de solicitudes
        $response = $this->actingAs($user)->get('/asesor/solicitudes');
        $response->assertStatus(200);
    }
    
    /**
     * Prueba que un usuario con otro rol no puede acceder al dashboard de asesor.
     */
    public function test_non_asesor_cannot_access_asesor_dashboard()
    {
        // Crear un usuario con rol de cliente
        $user = User::factory()->create([
            'role' => 'cliente',
            'estado' => 'activo'
        ]);

        // Intentar acceder al dashboard de asesor
        $response = $this->actingAs($user)->get('/asesor/dashboard');
        
        // Verificar que se deniega el acceso
        $response->assertStatus(403);
    }
}