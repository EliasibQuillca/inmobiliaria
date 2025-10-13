<?php

namespace Tests\Unit;

use App\Models\Departamento;
use App\Models\Imagen;
use App\Models\Propietario;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use PHPUnit\Framework\Attributes\Test;

class DepartamentoTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function puede_obtener_imagen_principal()
    {
        // Arrange
        $propietario = Propietario::factory()->create();
        $departamento = Departamento::factory()->create([
            'propietario_id' => $propietario->id
        ]);

        $imagenPrincipal = Imagen::factory()->create([
            'departamento_id' => $departamento->id,
            'tipo' => 'principal',
            'url' => 'storage/departamentos/principal.jpg'
        ]);

        $imagenGaleria = Imagen::factory()->create([
            'departamento_id' => $departamento->id,
            'tipo' => 'galeria',
            'url' => 'storage/departamentos/galeria.jpg'
        ]);

        // Act
        $resultado = $departamento->imagenPrincipal;

        // Assert
        $this->assertEquals($imagenPrincipal->id, $resultado->id);
        $this->assertEquals('principal', $resultado->tipo);
    }

    #[Test]
    public function usa_primera_imagen_como_principal_si_no_hay_principal()
    {
        // Arrange
        $propietario = Propietario::factory()->create();
        $departamento = Departamento::factory()->create([
            'propietario_id' => $propietario->id
        ]);

        $imagen = Imagen::factory()->create([
            'departamento_id' => $departamento->id,
            'tipo' => 'galeria',
            'url' => 'storage/departamentos/galeria.jpg'
        ]);

        // Act
        $resultado = $departamento->imagenPrincipal;

        // Assert
        $this->assertEquals($imagen->id, $resultado->id);
    }

    #[Test]
    public function ordena_imagenes_correctamente()
    {
        // Arrange
        $propietario = Propietario::factory()->create();
        $departamento = Departamento::factory()->create([
            'propietario_id' => $propietario->id
        ]);

        // Crear imágenes en orden aleatorio
        $imagenGaleria2 = Imagen::factory()->create([
            'departamento_id' => $departamento->id,
            'tipo' => 'galeria',
            'orden' => 2
        ]);

        $imagenPrincipal = Imagen::factory()->create([
            'departamento_id' => $departamento->id,
            'tipo' => 'principal',
            'orden' => 1
        ]);

        $imagenGaleria1 = Imagen::factory()->create([
            'departamento_id' => $departamento->id,
            'tipo' => 'galeria',
            'orden' => 1
        ]);

        // Act
        $imagenes = $departamento->imagenes;

        // Assert
        $this->assertEquals($imagenPrincipal->id, $imagenes[0]->id);
        $this->assertEquals($imagenGaleria1->id, $imagenes[1]->id);
        $this->assertEquals($imagenGaleria2->id, $imagenes[2]->id);
    }

    #[Test]
    public function calcula_precio_por_metro_cuadrado()
    {
        // Arrange
        $propietario = Propietario::factory()->create();
        $departamento = Departamento::factory()->create([
            'propietario_id' => $propietario->id,
            'precio' => 100000,
            'area' => 50
        ]);

        // Act
        $precioPorMetro = $departamento->precio_por_metro;

        // Assert
        $this->assertEquals(2000, $precioPorMetro);
    }

    #[Test]
    public function verifica_si_departamento_esta_disponible()
    {
        // Arrange
        $propietario = Propietario::factory()->create();
        $departamento = Departamento::factory()->create([
            'propietario_id' => $propietario->id,
            'estado' => 'disponible'
        ]);

        // Act & Assert
        $this->assertTrue($departamento->estaDisponible());

        $departamento->estado = 'vendido';
        $departamento->save();

        $this->assertFalse($departamento->estaDisponible());
    }
}