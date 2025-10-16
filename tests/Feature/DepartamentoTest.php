<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Departamento;
use App\Models\Propietario;
use Inertia\Testing\AssertableInertia as Assert;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Auth;
use PHPUnit\Framework\Attributes\Test;

class DepartamentoTest extends TestCase
{
    use RefreshDatabase;

    protected $admin;
    protected $departamento;
    protected $propietario;

    protected function setUp(): void
    {
        parent::setUp();

        // Crear propietario de prueba
        $this->propietario = Propietario::factory()->create([
            'nombre' => 'Juan Pérez',
            'dni' => '12345678',
            'tipo' => 'natural',
            'contacto' => '999888777',
            'direccion' => 'Av. Test 123',
            'registrado_sunarp' => true
        ]);

        // Crear administrador
        $this->admin = User::factory()->create([
            'name' => 'Admin Test',
            'email' => 'admin.test@example.com',
            'password' => bcrypt('password'),
            'role' => 'administrador'
        ]);

        // Crear departamento de prueba
        $this->departamento = Departamento::create([
            'codigo' => 'DEPT-TEST-001',
            'titulo' => 'Departamento Original',
            'descripcion' => 'Descripción original',
            'ubicacion' => 'Ubicación original',
            'direccion' => 'Dirección original',
            'precio' => 100000.00,
            'habitaciones' => 2,
            'banos' => 1,
            'area' => 75.00,
            'piso' => 5,
            'estacionamientos' => 1,
            'estado' => 'disponible',
            'año_construccion' => 2020,
            'propietario_id' => $this->propietario->id
        ]);
    }

    #[Test]
    public function un_administrador_puede_editar_un_departamento()
    {
        $this->actingAs($this->admin);

        $datosActualizados = [
            'titulo' => 'Departamento Actualizado',
            'descripcion' => 'Nueva descripción',
            'ubicacion' => 'Nueva ubicación',
            'precio' => 120000.00,
            'habitaciones' => 3,
            'banos' => 2,
            'area' => 85.00,
            'piso' => 6,
            'año_construccion' => 2021,
            'estacionamientos' => 1,
            'estado' => 'disponible',
            'propietario_id' => $this->propietario->id,
            'imagen_principal' => 'https://ejemplo.com/imagen1.jpg'
        ];

        // Hacer la petición de actualización
        $response = $this->patch("/admin/departamentos/{$this->departamento->id}", $datosActualizados);

        // Verificar redirección exitosa
        $response->assertStatus(302);
        $response->assertSessionHas('success', 'Departamento actualizado correctamente');

        // Verificar que los datos se actualizaron en la base de datos
        $this->assertDatabaseHas('departamentos', [
            'id' => $this->departamento->id,
            'titulo' => 'Departamento Actualizado',
            'descripcion' => 'Nueva descripción',
            'ubicacion' => 'Nueva ubicación',
            'precio' => 120000.00,
            'habitaciones' => 3,
            'banos' => 2,
            'area' => 85.00
        ]);

        // Verificar que los datos se actualizaron en la base de datos
        $departamentoActualizado = Departamento::find($this->departamento->id);
        $this->assertEquals('Nueva ubicación', $departamentoActualizado->ubicacion);
        
        // Verificar que la página se carga correctamente
        $responseVer = $this->get("/admin/departamentos");
        $responseVer->assertStatus(200);
    }

    #[Test]
    public function verifica_que_los_cambios_se_muestran_en_la_interfaz()
    {
        $this->actingAs($this->admin);

        // Datos de prueba
        $datosActualizados = [
            'titulo' => 'Departamento Test Vista',
            'descripcion' => 'Descripción para probar la vista',
            'ubicacion' => 'Ubicación de prueba',
            'precio' => 150000.00,
            'habitaciones' => 4,
            'banos' => 2,
            'area' => 100.00,
            'piso' => 7,
            'año_construccion' => 2022,
            'estacionamientos' => 2,
            'estado' => 'disponible',
            'propietario_id' => $this->propietario->id,
            'imagen_principal' => 'https://ejemplo.com/nueva-imagen.jpg'
        ];

        // Actualizar el departamento
        $response = $this->patch("/admin/departamentos/{$this->departamento->id}", $datosActualizados);
        
        // Verificar redirección
        $response->assertStatus(302);

        // Obtener la vista actualizada usando Inertia
        $responseVista = $this->get("/admin/departamentos");
        
        // Verificar la respuesta de Inertia
        $responseVista->assertInertia(fn (Assert $page) => $page
            ->component('Admin/Departamentos')
            ->has('departamentos.data', 1)
            ->where('departamentos.data.0.titulo', 'Departamento Test Vista')
            ->where('departamentos.data.0.precio', '150000.00')
            ->where('departamentos.data.0.ubicacion', 'Ubicación de prueba')
        );
        
        // Verificar detalles específicos
        $departamentoActualizado = Departamento::find($this->departamento->id);
        $this->assertEquals('Departamento Test Vista', $departamentoActualizado->titulo);
        $this->assertEquals(150000.00, $departamentoActualizado->precio);
        $this->assertEquals(4, $departamentoActualizado->habitaciones);
    }

    #[Test]
    public function verifica_validacion_de_campos_requeridos()
    {
        $this->actingAs($this->admin);

        // Intentar actualizar con campos faltantes
        $datosIncompletos = [
            'titulo' => '',
            'precio' => '',
            'ubicacion' => ''
        ];

        $response = $this->patch("/admin/departamentos/{$this->departamento->id}", $datosIncompletos);
        
        // Verificar que la validación falla
        $response->assertStatus(302);
        $response->assertSessionHasErrors(['titulo', 'precio', 'ubicacion']);

        // Verificar que los datos originales no cambiaron
        $this->assertDatabaseHas('departamentos', [
            'id' => $this->departamento->id,
            'titulo' => 'Departamento Original'
        ]);
    }
}