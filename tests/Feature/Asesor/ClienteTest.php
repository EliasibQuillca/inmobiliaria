<?php

namespace Tests\Feature\Asesor;

use App\Models\User;
use App\Models\Asesor;
use App\Models\Cliente;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ClienteTest extends TestCase
{
    use RefreshDatabase;

    protected $asesor;
    protected $usuarioAsesor;

    protected function setUp(): void
    {
        parent::setUp();

        // Crear usuario asesor activo
        $this->usuarioAsesor = User::factory()->create([
            'email' => 'asesor@test.com',
            'role' => 'asesor',
            'estado' => 'activo',
        ]);

        // Crear registro de asesor
        $this->asesor = Asesor::factory()->create([
            'usuario_id' => $this->usuarioAsesor->id,
            'especialidad' => 'Ventas residenciales',
            'comision_porcentaje' => 3.5,
        ]);
    }

    /** @test */
    public function asesor_puede_acceder_a_lista_de_clientes()
    {
        $response = $this->actingAs($this->usuarioAsesor)
            ->get('/asesor/clientes');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('Asesor/Clientes'));
    }

    /** @test */
    public function asesor_puede_acceder_al_formulario_de_crear_cliente()
    {
        $response = $this->actingAs($this->usuarioAsesor)
            ->get('/asesor/clientes/crear');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('Asesor/Clientes/Crear'));
    }

    /** @test */
    public function asesor_puede_crear_un_cliente_con_datos_validos()
    {
        $datosCliente = [
            'nombre' => 'Juan Pérez',
            'dni' => '12345678',
            'email' => 'juan.perez@example.com',
            'telefono' => '987654321',
            'direccion' => 'Av. Principal 123, Cusco',
            'medio_contacto' => 'whatsapp',
            'tipo_propiedad' => 'apartamento',
            'presupuesto_min' => 150000,
            'presupuesto_max' => 250000,
            'habitaciones_deseadas' => 3,
            'zona_preferida' => 'Centro Histórico',
            'notas_contacto' => 'Cliente interesado en departamentos con vista',
        ];

        $response = $this->actingAs($this->usuarioAsesor)
            ->post('/asesor/clientes', $datosCliente);

        $response->assertRedirect('/asesor/clientes');
        $response->assertSessionHas('success');

        // Verificar que el cliente fue creado en la base de datos
        $this->assertDatabaseHas('clientes', [
            'nombre' => 'Juan Pérez',
            'dni' => '12345678',
            'email' => 'juan.perez@example.com',
            'telefono' => '987654321',
            'asesor_id' => $this->asesor->id,
        ]);
    }

    /** @test */
    public function asesor_puede_crear_cliente_con_datos_minimos_requeridos()
    {
        $datosMinimos = [
            'nombre' => 'María López',
            'dni' => '87654321',
            'email' => 'maria.lopez@example.com',
            'telefono' => '912345678',
            'medio_contacto' => 'telefono',
            'tipo_propiedad' => 'casa',
        ];

        $response = $this->actingAs($this->usuarioAsesor)
            ->post('/asesor/clientes', $datosMinimos);

        $response->assertRedirect('/asesor/clientes');

        $this->assertDatabaseHas('clientes', [
            'nombre' => 'María López',
            'dni' => '87654321',
            'email' => 'maria.lopez@example.com',
            'asesor_id' => $this->asesor->id,
        ]);
    }

    /** @test */
    public function crear_cliente_requiere_nombre()
    {
        $datos = [
            'email' => 'test@example.com',
            'telefono' => '987654321',
        ];

        $response = $this->actingAs($this->usuarioAsesor)
            ->post('/asesor/clientes', $datos);

        $response->assertSessionHasErrors('nombre');
        $this->assertEquals(0, Cliente::count());
    }

    /** @test */
    public function crear_cliente_requiere_email_valido()
    {
        $datos = [
            'nombre' => 'Test Cliente',
            'email' => 'email-invalido',
            'telefono' => '987654321',
        ];

        $response = $this->actingAs($this->usuarioAsesor)
            ->post('/asesor/clientes', $datos);

        $response->assertSessionHasErrors('email');
        $this->assertEquals(0, Cliente::count());
    }

    /** @test */
    public function crear_cliente_requiere_telefono()
    {
        $datos = [
            'nombre' => 'Test Cliente',
            'email' => 'test@example.com',
        ];

        $response = $this->actingAs($this->usuarioAsesor)
            ->post('/asesor/clientes', $datos);

        $response->assertSessionHasErrors('telefono');
        $this->assertEquals(0, Cliente::count());
    }

    /** @test */
    public function email_del_cliente_debe_ser_unico()
    {
        // Crear usuario con el email primero
        $usuario = User::factory()->create([
            'email' => 'existente@example.com',
            'role' => 'cliente',
        ]);

        // Crear primer cliente con ese usuario
        Cliente::factory()->create([
            'usuario_id' => $usuario->id,
            'email' => 'existente@example.com',
            'asesor_id' => $this->asesor->id,
        ]);

        // Intentar crear otro cliente con el mismo email
        $datos = [
            'nombre' => 'Otro Cliente',
            'dni' => '66666666',
            'email' => 'existente@example.com',
            'telefono' => '987654321',
            'medio_contacto' => 'email',
            'tipo_propiedad' => 'casa',
        ];

        $response = $this->actingAs($this->usuarioAsesor)
            ->post('/asesor/clientes', $datos);

        $response->assertSessionHasErrors('email');
        $this->assertEquals(1, Cliente::count());
    }

    /** @test */
    public function presupuesto_minimo_debe_ser_menor_que_maximo()
    {
        $datos = [
            'nombre' => 'Test Cliente',
            'dni' => '11111111',
            'email' => 'test@example.com',
            'telefono' => '987654321',
            'medio_contacto' => 'email',
            'tipo_propiedad' => 'penthouse',
            'presupuesto_min' => 300000,
            'presupuesto_max' => 200000, // Menor que el mínimo
        ];

        $response = $this->actingAs($this->usuarioAsesor)
            ->post('/asesor/clientes', $datos);

        $response->assertSessionHasErrors('presupuesto_max');
    }

    /** @test */
    public function cliente_creado_se_asocia_automaticamente_al_asesor()
    {
        $datos = [
            'nombre' => 'Cliente Asociado',
            'dni' => '99999999',
            'email' => 'asociado@example.com',
            'telefono' => '987654321',
            'medio_contacto' => 'presencial',
            'tipo_propiedad' => 'estudio',
        ];

        $this->actingAs($this->usuarioAsesor)
            ->post('/asesor/clientes', $datos);

        $cliente = Cliente::where('email', 'asociado@example.com')->first();

        $this->assertNotNull($cliente);
        $this->assertEquals($this->asesor->id, $cliente->asesor_id);
    }

    /** @test */
    public function cliente_no_puede_ser_creado_por_usuario_no_autenticado()
    {
        $datos = [
            'nombre' => 'Test Cliente',
            'dni' => '22222222',
            'email' => 'test@example.com',
            'telefono' => '987654321',
            'medio_contacto' => 'email',
            'tipo_propiedad' => 'apartamento',
        ];

        $response = $this->post('/asesor/clientes', $datos);

        $response->assertRedirect('/login');
        $this->assertEquals(0, Cliente::count());
    }

    /** @test */
    public function cliente_no_puede_ser_creado_por_usuario_con_rol_cliente()
    {
        $cliente = User::factory()->create([
            'role' => 'cliente',
            'estado' => 'activo',
        ]);

        $datos = [
            'nombre' => 'Test Cliente',
            'dni' => '33333333',
            'email' => 'test@example.com',
            'telefono' => '987654321',
            'medio_contacto' => 'telefono',
            'tipo_propiedad' => 'duplex',
        ];

        $response = $this->actingAs($cliente)
            ->post('/asesor/clientes', $datos);

        $response->assertStatus(403);
    }

    /** @test */
    public function asesor_puede_ver_detalles_de_su_cliente()
    {
        $cliente = Cliente::factory()->create([
            'asesor_id' => $this->asesor->id,
            'nombre' => 'Cliente de Prueba',
        ]);

        $response = $this->actingAs($this->usuarioAsesor)
            ->get("/asesor/clientes/{$cliente->id}");

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) =>
            $page->component('Asesor/Clientes/Detalle')
                ->has('cliente')
        );
    }

    /** @test */
    public function asesor_no_puede_ver_clientes_de_otros_asesores()
    {
        // Crear otro asesor
        $otroUsuario = User::factory()->create([
            'role' => 'asesor',
            'estado' => 'activo',
        ]);
        $otroAsesor = Asesor::factory()->create([
            'usuario_id' => $otroUsuario->id,
        ]);

        // Cliente del otro asesor
        $clienteAjeno = Cliente::factory()->create([
            'asesor_id' => $otroAsesor->id,
        ]);

        $response = $this->actingAs($this->usuarioAsesor)
            ->get("/asesor/clientes/{$clienteAjeno->id}");

        $response->assertStatus(404);
    }

    /** @test */
    public function telefono_debe_tener_formato_valido()
    {
        // El teléfono acepta cualquier formato string, solo verifica que sea requerido
        // y que no exceda 20 caracteres
        $datos = [
            'nombre' => 'Test Cliente',
            'dni' => '44444444',
            'email' => 'test@example.com',
            'telefono' => str_repeat('1', 21), // Más de 20 caracteres
            'medio_contacto' => 'telefono',
            'tipo_propiedad' => 'casa',
        ];

        $response = $this->actingAs($this->usuarioAsesor)
            ->post('/asesor/clientes', $datos);

        $response->assertSessionHasErrors('telefono');
    }

    /** @test */
    public function habitaciones_deseadas_debe_ser_numero_positivo()
    {
        $datos = [
            'nombre' => 'Test Cliente',
            'dni' => '55555555',
            'email' => 'test@example.com',
            'telefono' => '987654321',
            'medio_contacto' => 'whatsapp',
            'tipo_propiedad' => 'apartamento',
            'habitaciones_deseadas' => -1,
        ];

        $response = $this->actingAs($this->usuarioAsesor)
            ->post('/asesor/clientes', $datos);

        $response->assertSessionHasErrors('habitaciones_deseadas');
    }
}
