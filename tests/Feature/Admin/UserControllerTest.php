<?php

namespace Tests\Feature\Admin;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Inertia\Testing\AssertableInertia as Assert;

class UserControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_puede_ver_formulario_edicion()
    {
        // Crear un usuario administrador
        $admin = User::factory()->create([
            'role' => 'administrador'
        ]);

        // Crear un usuario para editar
        $user = User::factory()->create();

        // Actuar como administrador
        $response = $this->actingAs($admin)
            ->get(route('admin.usuarios.edit', $user->id));

        // Verificar respuesta
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Admin/Usuarios/Editar')
            ->has('usuario')
            ->where('usuario.id', $user->id)
        );
    }

    public function test_admin_puede_actualizar_usuario()
    {
        // Crear un usuario administrador
        $admin = User::factory()->create([
            'role' => 'administrador'
        ]);

        // Crear un usuario para editar
        $user = User::factory()->create([
            'name' => 'Nombre Original',
            'email' => 'original@email.com'
        ]);

        // Datos actualizados
        $updatedData = [
            'name' => 'Nombre Actualizado',
            'email' => 'actualizado@email.com'
        ];

        // Actuar como administrador
        $response = $this->actingAs($admin)
            ->put(route('admin.usuarios.update', $user->id), $updatedData);

        // Verificar redirección
        $response->assertRedirect(route('admin.usuarios.index'));

        // Verificar que los datos se actualizaron
        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'name' => 'Nombre Actualizado',
            'email' => 'actualizado@email.com'
        ]);
    }

    public function test_usuario_no_admin_no_puede_editar()
    {
        // Crear un usuario administrador
        $admin = User::factory()->create([
            'role' => 'administrador'
        ]);

        // Crear un usuario normal
        $user = User::factory()->create([
            'role' => 'cliente'
        ]);

        // Intentar actualizar sin ser admin
        $response = $this->actingAs($user)
            ->put(route('admin.usuarios.update', $admin->id), [
                'name' => 'Nuevo Nombre',
                'email' => 'nuevo@email.com',
                'role' => 'asesor'
            ]);

        // Verificar que no está autorizado
        $response->assertStatus(403);
    }

    public function test_admin_puede_crear_usuario()
    {
        // Crear un usuario administrador
        $admin = User::factory()->create([
            'role' => 'administrador'
        ]);

        // Datos del nuevo usuario
        $userData = [
            'name' => 'Nuevo Usuario',
            'email' => 'nuevo@test.com', 
            'password' => 'password123',
            'role' => 'cliente',
            'documento_identidad' => '12345678',
            'estado' => true
        ];

        // Intentar crear usuario como admin
        $response = $this->actingAs($admin)
            ->post(route('admin.usuarios.store'), $userData);

        // Verificar redirección
        $response->assertRedirect(route('admin.usuarios.index'));

        // Verificar que el usuario fue creado
        $this->assertDatabaseHas('users', [
            'name' => 'Nuevo Usuario',
            'email' => 'nuevo@test.com',
            'role' => 'cliente'
        ]);
    }

    public function test_admin_puede_cambiar_estado_usuario()
    {
        // Crear un usuario administrador
        $admin = User::factory()->create([
            'role' => 'administrador'
        ]);

        // Crear un usuario activo
        $user = User::factory()->create([
            'estado' => 'activo'
        ]);

        // Cambiar estado a inactivo
        $response = $this->actingAs($admin)
            ->patch(route('admin.usuarios.cambiar-estado', $user->id), [
                'estado' => 0 // false = inactivo
            ]);

        // Verificar redirección
        $response->assertRedirect();

        // Verificar que el estado cambió
        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'estado' => 'inactivo'
        ]);
    }

    public function test_admin_puede_eliminar_usuario()
    {
        // Crear un usuario administrador
        $admin = User::factory()->create([
            'role' => 'administrador'
        ]);

        // Crear un usuario para eliminar
        $user = User::factory()->create();

        // Eliminar usuario
        $response = $this->actingAs($admin)
            ->delete(route('admin.usuarios.destroy', $user->id));

        // Verificar redirección
        $response->assertRedirect();

        // Verificar que el usuario fue eliminado
        $this->assertDatabaseMissing('users', [
            'id' => $user->id
        ]);
    }
}