<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LoginInactiveUserTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test que un usuario inactivo NO puede iniciar sesión
     */
    public function test_inactive_user_cannot_login(): void
    {
        // Crear un usuario inactivo
        $user = User::factory()->create([
            'email' => 'inactive@test.com',
            'password' => bcrypt('password123'),
            'estado' => 'inactivo',
            'role' => 'cliente',
        ]);

        // Intentar iniciar sesión
        $response = $this->post('/login', [
            'email' => 'inactive@test.com',
            'password' => 'password123',
        ]);

        // Verificar que NO fue autenticado
        $this->assertGuest();
        
        // Verificar que recibe mensaje de error
        $response->assertSessionHasErrors(['email']);
        
        // Verificar el mensaje específico
        $errors = session('errors');
        $this->assertStringContainsString(
            'desactivada',
            $errors->get('email')[0]
        );
    }

    /**
     * Test que un usuario activo SÍ puede iniciar sesión
     */
    public function test_active_user_can_login(): void
    {
        // Crear un usuario activo
        $user = User::factory()->create([
            'email' => 'active@test.com',
            'password' => bcrypt('password123'),
            'estado' => 'activo',
            'role' => 'cliente',
        ]);

        // Intentar iniciar sesión
        $response = $this->post('/login', [
            'email' => 'active@test.com',
            'password' => 'password123',
        ]);

        // Verificar que FUE autenticado
        $this->assertAuthenticated();
        
        // Verificar redirección según el rol
        $response->assertRedirect(route('catalogo.index'));
    }

    /**
     * Test que un usuario desactivado pierde la sesión
     */
    public function test_user_deactivated_after_login_loses_session(): void
    {
        // Crear un usuario activo
        $user = User::factory()->create([
            'email' => 'user@test.com',
            'password' => bcrypt('password123'),
            'estado' => 'activo',
            'role' => 'cliente',
        ]);

        // Iniciar sesión
        $this->post('/login', [
            'email' => 'user@test.com',
            'password' => 'password123',
        ]);

        $this->assertAuthenticated();

        // Simular que un admin desactiva al usuario
        $user->update(['estado' => 'inactivo']);

        // Intentar hacer logout y login nuevamente
        $this->post('/logout');
        
        $response = $this->post('/login', [
            'email' => 'user@test.com',
            'password' => 'password123',
        ]);

        // Verificar que NO puede volver a iniciar sesión
        $this->assertGuest();
        $response->assertSessionHasErrors(['email']);
    }

    /**
     * Test que un usuario activo pierde sesión al ser desactivado mientras navega
     */
    public function test_active_session_is_terminated_when_user_is_deactivated(): void
    {
        // Crear un usuario activo con role cliente
        $user = User::factory()->create([
            'email' => 'session@test.com',
            'password' => bcrypt('password123'),
            'estado' => 'activo',
            'role' => 'cliente',
        ]);

        // Iniciar sesión como ese usuario
        $this->actingAs($user);
        
        // Verificar que está autenticado
        $this->assertAuthenticated();

        // Acceder a una ruta protegida (debe funcionar)
        $response = $this->get('/catalogo');
        $response->assertOk();

        // Simular que un admin lo desactiva
        $user->estado = 'inactivo';
        $user->save();

        // Refrescar el modelo para obtener los cambios
        $user->refresh();

        // Intentar acceder a una ruta protegida nuevamente
        $response = $this->get('/cliente/favoritos');
        
        // Debería ser redirigido al login
        $response->assertRedirect(route('login'));
        
        // Y tener un mensaje de error
        $response->assertSessionHasErrors(['email']);
    }
}
