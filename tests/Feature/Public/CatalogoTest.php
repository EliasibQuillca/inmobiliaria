<?php

namespace Tests\Feature\Public;

use App\Models\Departamento;
use App\Models\Imagen;
use App\Models\Propietario;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;
use Inertia\Testing\AssertableInertia as Assert;
use PHPUnit\Framework\Attributes\Test;

class CatalogoTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected function setUp(): void
    {
        parent::setUp();
        Storage::fake('public');
    }

    #[Test]
    public function puede_ver_catalogo_de_departamentos()
    {
        // Arrange
        $propietario = Propietario::factory()->create();
        $departamentos = Departamento::factory()->count(5)->create([
            'propietario_id' => $propietario->id,
            'estado' => 'disponible'
        ]);

        // Crear imágenes para cada departamento
        foreach ($departamentos as $departamento) {
            Imagen::factory()->create([
                'departamento_id' => $departamento->id,
                'tipo' => 'principal',
                'url' => 'storage/departamentos/imagen_principal.jpg'
            ]);

            Imagen::factory()->count(2)->create([
                'departamento_id' => $departamento->id,
                'tipo' => 'galeria',
                'url' => 'storage/departamentos/imagen_galeria.jpg'
            ]);
        }

        // Act
        $response = $this->get(route('catalogo.index'));

        // Assert
        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Public/Catalogo')
            ->has('departamentos.data', 5)
            ->has('departamentos.data.0.imagenes')
        );
    }

    #[Test]
    public function puede_filtrar_departamentos_por_ubicacion()
    {
        // Arrange
        $propietario = Propietario::factory()->create();
        
        // Crear departamentos en diferentes ubicaciones
        Departamento::factory()->create([
            'propietario_id' => $propietario->id,
            'ubicacion' => 'Los Olivos',
            'estado' => 'disponible'
        ]);
        
        Departamento::factory()->create([
            'propietario_id' => $propietario->id,
            'ubicacion' => 'San Borja',
            'estado' => 'disponible'
        ]);

        // Act
        $response = $this->get(route('catalogo.index', ['ubicacion' => 'Los Olivos']));

        // Assert
        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Public/Catalogo')
            ->has('departamentos.data', 1)
            ->where('departamentos.data.0.ubicacion', 'Los Olivos')
        );
    }

    #[Test]
    public function puede_ver_detalle_de_departamento()
    {
        // Arrange
        $propietario = Propietario::factory()->create();
        $departamento = Departamento::factory()->create([
            'propietario_id' => $propietario->id,
            'estado' => 'disponible'
        ]);

        // Crear imágenes para el departamento
        $imagenPrincipal = Imagen::factory()->create([
            'departamento_id' => $departamento->id,
            'tipo' => 'principal',
            'url' => 'storage/departamentos/principal.jpg'
        ]);

        $imagenesGaleria = Imagen::factory()->count(3)->create([
            'departamento_id' => $departamento->id,
            'tipo' => 'galeria',
            'url' => 'storage/departamentos/galeria.jpg'
        ]);

        // Act
        $response = $this->get(route('catalogo.show', $departamento->id));

        // Assert
        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Public/DetalleDepartamento')
            ->has('departamento')
            ->has('departamento.imagenes', 4)
            ->where('departamento.id', $departamento->id)
        );
    }

    #[Test]
    public function muestra_departamentos_similares()
    {
        // Arrange
        $propietario = Propietario::factory()->create();
        
        // Crear departamento principal
        $departamento = Departamento::factory()->create([
            'propietario_id' => $propietario->id,
            'ubicacion' => 'Los Olivos',
            'precio' => 100000,
            'estado' => 'disponible'
        ]);

        // Crear departamentos similares
        $similares = Departamento::factory()->count(4)->create([
            'propietario_id' => $propietario->id,
            'ubicacion' => 'Los Olivos',
            'precio' => 110000, // Precio similar
            'estado' => 'disponible'
        ]);

        // Crear departamento no similar
        Departamento::factory()->create([
            'propietario_id' => $propietario->id,
            'ubicacion' => 'Miraflores',
            'precio' => 300000, // Precio muy diferente
            'estado' => 'disponible'
        ]);

        // Act
        $response = $this->get(route('catalogo.show', $departamento->id));

        // Assert
        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Public/DetalleDepartamento')
            ->has('departamentosSimilares', 4)
        );
    }

    #[Test]
    public function no_muestra_departamentos_no_disponibles()
    {
        // Arrange
        $propietario = Propietario::factory()->create();
        
        // Crear departamento no disponible
        Departamento::factory()->create([
            'propietario_id' => $propietario->id,
            'estado' => 'vendido'
        ]);

        // Crear departamento disponible
        Departamento::factory()->create([
            'propietario_id' => $propietario->id,
            'estado' => 'disponible'
        ]);

        // Act
        $response = $this->get(route('catalogo.index'));

        // Assert
        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Public/Catalogo')
            ->has('departamentos.data', 1)
            ->where('departamentos.data.0.estado', 'disponible')
        );
    }

    #[Test]
    public function ordena_departamentos_destacados_primero()
    {
        // Arrange
        $propietario = Propietario::factory()->create();
        
        // Crear departamento no destacado
        $noDest = Departamento::factory()->create([
            'propietario_id' => $propietario->id,
            'destacado' => false,
            'estado' => 'disponible'
        ]);

        // Crear departamento destacado
        $dest = Departamento::factory()->create([
            'propietario_id' => $propietario->id,
            'destacado' => true,
            'estado' => 'disponible'
        ]);

        // Act
        $response = $this->get(route('catalogo.index'));

        // Assert
        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Public/Catalogo')
            ->has('departamentos.data', 2)
            ->where('departamentos.data.0.destacado', true)
        );
    }
}