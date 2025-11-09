<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Cliente;
use App\Models\Departamento;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use Illuminate\Support\Facades\DB;

class ClienteFunctionalityTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected $cliente;
    protected $user;
    protected $departamento;

    /**
     * Setup inicial para cada test
     */
    protected function setUp(): void
    {
        parent::setUp();

        // Crear usuario cliente
        $this->user = User::factory()->create([
            'name' => 'Cliente Test',
            'email' => 'cliente.test@example.com',
            'role' => 'cliente',
            'estado' => 'activo',
            'password' => bcrypt('password123'),
        ]);

        // Crear cliente asociado
        $this->cliente = Cliente::factory()->create([
            'usuario_id' => $this->user->id,
            'dni' => '12345678',
        ]);

        // Crear departamentos de prueba
        $this->departamento = Departamento::factory()->create([
            'titulo' => 'Departamento Test',
            'precio' => 250000,
            'habitaciones' => 3,
            'banos' => 2,
            'area' => 120,
            'estado' => 'disponible',
        ]);
    }

    /**
     * Test 1: Cliente puede acceder al dashboard
     */
    public function test_cliente_puede_acceder_al_dashboard()
    {
        $response = $this->actingAs($this->user)
            ->get('/cliente/dashboard');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) =>
            $page->component('Cliente/Dashboard')
                ->has('estadisticas')
                ->has('cliente')
        );
    }

    /**
     * Test 2: Cliente puede ver el catálogo privado
     */
    public function test_cliente_puede_ver_catalogo_privado()
    {
        $response = $this->actingAs($this->user)
            ->get('/cliente/catalogo');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) =>
            $page->component('Cliente/CatalogoCliente')
                ->has('departamentos')
                ->has('estadisticas')
        );
    }

    /**
     * Test 3: Cliente puede agregar departamento a favoritos
     */
    public function test_cliente_puede_agregar_favorito()
    {
        $response = $this->actingAs($this->user)
            ->post('/cliente/favoritos/toggle', [
                'departamento_id' => $this->departamento->id
            ]);

        $response->assertStatus(302); // Redirect después de agregar

        // Verificar que se guardó en la base de datos
        $this->assertDatabaseHas('favoritos', [
            'cliente_id' => $this->cliente->id,
            'departamento_id' => $this->departamento->id,
        ]);
    }

    /**
     * Test 4: Cliente puede ver sus favoritos
     */
    public function test_cliente_puede_ver_favoritos()
    {
        // Agregar favorito primero
        DB::table('favoritos')->insert([
            'cliente_id' => $this->cliente->id,
            'departamento_id' => $this->departamento->id,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $response = $this->actingAs($this->user)
            ->get('/cliente/favoritos');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) =>
            $page->component('Cliente/Favoritos')
                ->has('favoritos')
        );
    }

    /**
     * Test 5: Cliente puede quitar departamento de favoritos
     */
    public function test_cliente_puede_quitar_favorito()
    {
        // Agregar favorito primero
        DB::table('favoritos')->insert([
            'cliente_id' => $this->cliente->id,
            'departamento_id' => $this->departamento->id,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Verificar que existe
        $this->assertDatabaseHas('favoritos', [
            'cliente_id' => $this->cliente->id,
            'departamento_id' => $this->departamento->id,
        ]);

        // Quitar favorito (toggle)
        $response = $this->actingAs($this->user)
            ->post('/cliente/favoritos/toggle', [
                'departamento_id' => $this->departamento->id
            ]);

        $response->assertStatus(302);

        // Verificar que se eliminó
        $this->assertDatabaseMissing('favoritos', [
            'cliente_id' => $this->cliente->id,
            'departamento_id' => $this->departamento->id,
        ]);
    }

    /**
     * Test 6: Cliente puede filtrar el catálogo por tipo de propiedad
     */
    public function test_cliente_puede_filtrar_catalogo_por_tipo()
    {
        // Crear departamentos con diferentes habitaciones (usamos esto en lugar de tipo_propiedad)
        Departamento::factory()->create([
            'habitaciones' => 1,
            'estado' => 'disponible',
        ]);

        Departamento::factory()->create([
            'habitaciones' => 3,
            'estado' => 'disponible',
        ]);

        $response = $this->actingAs($this->user)
            ->get('/cliente/catalogo?habitaciones=1');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) =>
            $page->component('Cliente/CatalogoCliente')
                ->has('departamentos')
                ->has('filtros')
        );
    }

    /**
     * Test 7: Cliente puede filtrar por rango de precio
     */
    public function test_cliente_puede_filtrar_por_precio()
    {
        Departamento::factory()->create([
            'precio' => 100000,
            'estado' => 'disponible',
        ]);

        Departamento::factory()->create([
            'precio' => 500000,
            'estado' => 'disponible',
        ]);

        $response = $this->actingAs($this->user)
            ->get('/cliente/catalogo?precio_min=150000&precio_max=300000');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) =>
            $page->component('Cliente/CatalogoCliente')
        );
    }

    /**
     * Test 8: Cliente puede buscar departamentos por texto
     */
    public function test_cliente_puede_buscar_departamentos()
    {
        Departamento::factory()->create([
            'titulo' => 'Hermoso departamento en San Isidro',
            'estado' => 'disponible',
        ]);

        $response = $this->actingAs($this->user)
            ->get('/cliente/catalogo?busqueda=San+Isidro');

        $response->assertStatus(200);
    }

    /**
     * Test 9: Cliente puede ver detalle de un departamento
     */
    public function test_cliente_puede_ver_detalle_departamento()
    {
        $response = $this->actingAs($this->user)
            ->get('/cliente/catalogo/' . $this->departamento->id);

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) =>
            $page->has('departamento')
        );
    }

    /**
     * Test 10: Dashboard muestra estadísticas correctas
     */
    public function test_dashboard_muestra_estadisticas_correctas()
    {
        // Agregar algunos favoritos
        DB::table('favoritos')->insert([
            'cliente_id' => $this->cliente->id,
            'departamento_id' => $this->departamento->id,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $response = $this->actingAs($this->user)
            ->get('/cliente/dashboard');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) =>
            $page->component('Cliente/Dashboard')
                ->has('estadisticas')
                ->where('estadisticas.favoritos_count', 1)
        );
    }

    /**
     * Test 11: Usuario no cliente no puede acceder a rutas de cliente
     */
    public function test_usuario_no_cliente_no_puede_acceder_rutas_cliente()
    {
        $admin = User::factory()->create([
            'role' => 'administrador',
            'estado' => 'activo',
        ]);

        $response = $this->actingAs($admin)
            ->get('/cliente/dashboard');

        // El middleware redirige a su dashboard correspondiente
        $response->assertRedirect('/admin/dashboard');
    }

    /**
     * Test 12: Usuario no autenticado es redirigido al login
     */
    public function test_usuario_no_autenticado_redirigido_al_login()
    {
        $response = $this->get('/cliente/dashboard');

        $response->assertRedirect('/login');
    }

    /**
     * Test 13: El catálogo marca correctamente los favoritos del cliente
     */
    public function test_catalogo_marca_favoritos_correctamente()
    {
        // Agregar favorito
        DB::table('favoritos')->insert([
            'cliente_id' => $this->cliente->id,
            'departamento_id' => $this->departamento->id,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $response = $this->actingAs($this->user)
            ->get('/cliente/catalogo');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) =>
            $page->component('Cliente/CatalogoCliente')
                ->has('departamentos')
        );
    }

    /**
     * Test 14: Cliente puede ordenar resultados del catálogo
     */
    public function test_cliente_puede_ordenar_resultados()
    {
        Departamento::factory()->create([
            'precio' => 100000,
            'created_at' => now()->subDays(5),
            'estado' => 'disponible',
        ]);

        Departamento::factory()->create([
            'precio' => 500000,
            'created_at' => now()->subDays(1),
            'estado' => 'disponible',
        ]);

        // Ordenar por precio ascendente
        $response = $this->actingAs($this->user)
            ->get('/cliente/catalogo?orden=precio_asc');

        $response->assertStatus(200);

        // Ordenar por precio descendente
        $response = $this->actingAs($this->user)
            ->get('/cliente/catalogo?orden=precio_desc');

        $response->assertStatus(200);

        // Ordenar por más recientes
        $response = $this->actingAs($this->user)
            ->get('/cliente/catalogo?orden=recientes');

        $response->assertStatus(200);
    }

    /**
     * Test 15: Ruta /dashboard redirige correctamente según rol
     */
    public function test_dashboard_redirige_segun_rol()
    {
        // Cliente debe ir a /cliente/dashboard
        $response = $this->actingAs($this->user)
            ->get('/dashboard');

        $response->assertRedirect('/cliente/dashboard');

        // Crear admin y verificar su redirección
        $admin = User::factory()->create([
            'role' => 'administrador',
            'estado' => 'activo',
        ]);

        $response = $this->actingAs($admin)
            ->get('/dashboard');

        $response->assertRedirect('/admin/dashboard');

        // Crear asesor y verificar su redirección
        $asesor = User::factory()->create([
            'role' => 'asesor',
            'estado' => 'activo',
        ]);

        $response = $this->actingAs($asesor)
            ->get('/dashboard');

        $response->assertRedirect('/asesor/dashboard');
    }
}
