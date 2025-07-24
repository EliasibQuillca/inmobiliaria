<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\User;
use App\Models\Cliente;
use App\Models\Asesor;
use App\Models\Departamento;
use App\Models\Cotizacion;
use App\Models\Reserva;
use App\Models\Venta;

class VentasAdminIntegrationTest extends TestCase
{
    use RefreshDatabase;

    protected $admin;
    protected $asesor;
    protected $cliente;
    protected $departamento;
    protected $venta;

    protected function setUp(): void
    {
        parent::setUp();

        // Crear datos de prueba
        $this->admin = User::factory()->create([
            'role' => 'administrador',
            'email' => 'admin@test.com'
        ]);

        $userAsesor = User::factory()->create([
            'role' => 'asesor',
            'email' => 'asesor@test.com'
        ]);

        $this->asesor = Asesor::create([
            'usuario_id' => $userAsesor->id,
            'nombre' => 'Test',
            'apellidos' => 'Asesor',
            'telefono' => '999999999',
            'estado' => 'activo',
            'comision_porcentaje' => 5.0,
        ]);

        $userCliente = User::factory()->create([
            'role' => 'cliente',
            'email' => 'cliente@test.com'
        ]);

        $this->cliente = Cliente::create([
            'usuario_id' => $userCliente->id,
            'asesor_id' => $this->asesor->id,
            'nombre' => 'Test Cliente',
            'telefono' => '888888888',
            'email' => 'cliente@test.com',
        ]);

        $this->departamento = Departamento::create([
            'titulo' => 'Departamento Test',
            'descripcion' => 'Departamento para testing',
            'ubicacion' => 'Test Location',
            'precio' => 100000.00,
            'habitaciones' => 2,
            'banos' => 1,
            'area' => 50.0,
            'disponible' => false,
            'estado' => 'reservado',
        ]);

        $cotizacion = Cotizacion::create([
            'cliente_id' => $this->cliente->id,
            'asesor_id' => $this->asesor->id,
            'departamento_id' => $this->departamento->id,
            'precio_ofertado' => 95000.00,
            'estado' => 'aceptada',
            'fecha_expiracion' => now()->addDays(30),
        ]);

        $reserva = Reserva::create([
            'cotizacion_id' => $cotizacion->id,
            'asesor_id' => $this->asesor->id,
            'departamento_id' => $this->departamento->id,
            'monto_reserva' => 9500.00,
            'fecha_vencimiento' => now()->addDays(15),
            'estado' => 'confirmada',
        ]);

        $this->venta = Venta::create([
            'reserva_id' => $reserva->id,
            'fecha_venta' => now(),
            'monto_final' => 95000.00,
            'documentos_entregados' => false,
            'observaciones' => 'Venta de prueba',
        ]);
    }

    /** @test */
    public function admin_puede_ver_lista_de_ventas()
    {
        $response = $this->actingAs($this->admin)
            ->get('/admin/ventas');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) =>
            $page->component('Admin/Ventas')
                 ->has('ventas.data')
                 ->has('estadisticas')
        );
    }

    /** @test */
    public function admin_puede_filtrar_ventas_por_busqueda()
    {
        $response = $this->actingAs($this->admin)
            ->get('/admin/ventas?busqueda=Test Cliente');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) =>
            $page->component('Admin/Ventas')
                 ->where('filtros.busqueda', 'Test Cliente')
        );
    }

    /** @test */
    public function admin_puede_ver_detalle_de_venta()
    {
        $response = $this->actingAs($this->admin)
            ->get("/admin/ventas/{$this->venta->id}");

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) =>
            $page->component('Admin/Ventas/Ver')
                 ->has('venta')
        );
    }

    /** @test */
    public function admin_puede_acceder_a_formulario_crear_venta()
    {
        $response = $this->actingAs($this->admin)
            ->get('/admin/ventas/crear');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) =>
            $page->component('Admin/Ventas/Crear')
                 ->has('reservasDisponibles')
        );
    }

    /** @test */
    public function admin_puede_generar_reporte_de_ventas()
    {
        $response = $this->actingAs($this->admin)
            ->post('/admin/ventas/reporte', [
                'fecha_desde' => now()->subDays(30)->format('Y-m-d'),
                'fecha_hasta' => now()->format('Y-m-d'),
                'tipo_reporte' => 'detallado',
            ]);

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'ventas',
            'estadisticas',
            'parametros',
            'mensaje'
        ]);
    }

    /** @test */
    public function estadisticas_se_calculan_correctamente()
    {
        $response = $this->actingAs($this->admin)
            ->get('/admin/ventas');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) =>
            $page->has('estadisticas.total_ventas')
                 ->has('estadisticas.numero_ventas')
                 ->has('estadisticas.venta_promedio')
                 ->has('estadisticas.ventas_mes_actual')
                 ->where('estadisticas.numero_ventas', 1)
        );
    }
}
