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
            ->component('Admin/Usuarios/Edit')
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
        // Crear un usuario normal
        $normalUser = User::factory()->create([
            'role' => 'cliente'
        ]);

        // Crear un usuario para intentar editar
        $user = User::factory()->create();

        // Intentar acceder como usuario normal
        $response = $this->actingAs($normalUser)
            ->get(route('admin.usuarios.edit', $user->id));

        // Verificar que se deniega el acceso
        $response->assertStatus(403);
    }
}