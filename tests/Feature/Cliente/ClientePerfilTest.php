<?php

namespace Tests\Feature\Cliente;

use Tests\TestCase;
use App\Models\User;
use App\Models\Cliente;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Carbon\Carbon;

class ClientePerfilTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected $cliente;
    protected $user;

    protected function setUp(): void
    {
        parent::setUp();

        // Crear usuario de tipo cliente
        $this->user = User::factory()->create([
            'name' => 'Cliente Test',
            'email' => 'cliente@test.com',
            'password' => bcrypt('password'),
            'role' => 'cliente',
            'estado' => 'activo',
            'telefono' => '987654321',
        ]);

        // Crear registro de cliente asociado
        $this->cliente = Cliente::factory()->create([
            'usuario_id' => $this->user->id,
            'dni' => '12345678',
            'nombre' => 'Cliente Test',
            'telefono' => '987654321',
            'direccion' => 'Av. Test 123',
            'fecha_nacimiento' => '1990-05-15',
            'ciudad' => 'Cusco',
            'ocupacion' => 'Ingeniero',
            'estado_civil' => 'soltero',
            'ingresos_mensuales' => 5000.00,
        ]);
    }

    /** @test */
    public function cliente_puede_ver_pagina_de_perfil()
    {
        $response = $this->actingAs($this->user)
            ->get(route('cliente.perfil.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) =>
            $page->component('Cliente/Perfil')
                ->has('cliente')
        );
    }

    /** @test */
    public function cliente_puede_actualizar_datos_personales()
    {
        $datosActualizados = [
            'nombre' => 'Cliente Actualizado',
            'email' => 'clientenuevo@test.com',
            'current_password' => 'password',
            'telefono' => '999888777',
            'cedula' => '87654321',
            'direccion' => 'Calle Nueva 456', 
            'fecha_nacimiento' => '1995-03-20',
            'ciudad' => 'Lima',
            'ocupacion' => 'Arquitecto',
            'estado_civil' => 'casado',
            'ingresos_mensuales' => 6500.00,
        ];

        $response = $this->actingAs($this->user)
            ->patch(route('cliente.perfil.update'), $datosActualizados);

        $response->assertRedirect();
        $response->assertSessionHas('message', 'Perfil actualizado exitosamente.');

        // Verificar que el usuario se actualizó
        $this->user->refresh();
        $this->assertEquals('Cliente Actualizado', $this->user->name);
        $this->assertEquals('clientenuevo@test.com', $this->user->email);
        $this->assertEquals('999888777', $this->user->telefono);

        // Verificar que el cliente se actualizó
        $this->cliente->refresh();
        $this->assertEquals('87654321', $this->cliente->dni);
        $this->assertEquals('Calle Nueva 456', $this->cliente->direccion);
        $this->assertEquals('1995-03-20', $this->cliente->fecha_nacimiento->format('Y-m-d'));
        $this->assertEquals('Lima', $this->cliente->ciudad);
        $this->assertEquals('Arquitecto', $this->cliente->ocupacion);
        $this->assertEquals('casado', $this->cliente->estado_civil);
        $this->assertEquals(6500.00, $this->cliente->ingresos_mensuales);
    }

    /** @test */
    public function validacion_dni_debe_tener_8_digitos()
    {
        $datosInvalidos = [
            'nombre' => 'Cliente Test',
            'email' => 'cliente@test.com',
            'telefono' => '987654321',
            'cedula' => '123456', // Solo 6 dígitos
            'direccion' => 'Av. Test 123',
            'fecha_nacimiento' => '1990-05-15',
        ];

        $response = $this->actingAs($this->user)
            ->patch(route('cliente.perfil.update'), $datosInvalidos);

        $response->assertSessionHasErrors(['cedula']);
    }

    /** @test */
    public function validacion_dni_solo_numeros()
    {
        $datosInvalidos = [
            'nombre' => 'Cliente Test',
            'email' => 'cliente@test.com',
            'telefono' => '987654321',
            'cedula' => 'ABC12345', // Contiene letras
            'direccion' => 'Av. Test 123',
            'fecha_nacimiento' => '1990-05-15',
        ];

        $response = $this->actingAs($this->user)
            ->patch(route('cliente.perfil.update'), $datosInvalidos);

        $response->assertSessionHasErrors(['cedula']);
    }

    /** @test */
    public function validacion_edad_minima_18_anos()
    {
        // Fecha de nacimiento de hace 17 años
        $fechaMenor = Carbon::now()->subYears(17)->format('Y-m-d');

        $datosInvalidos = [
            'nombre' => 'Cliente Test',
            'email' => 'cliente@test.com',
            'telefono' => '987654321',
            'cedula' => '12345678',
            'direccion' => 'Av. Test 123',
            'fecha_nacimiento' => $fechaMenor,
        ];

        $response = $this->actingAs($this->user)
            ->patch(route('cliente.perfil.update'), $datosInvalidos);

        $response->assertSessionHasErrors(['fecha_nacimiento']);
    }

    /** @test */
    public function validacion_edad_exactamente_18_anos_es_valida()
    {
        // Fecha de nacimiento de hace exactamente 18 años
        $fechaValida = Carbon::now()->subYears(18)->format('Y-m-d');

        $datosValidos = [
            'nombre' => 'Cliente Test',
            'email' => 'cliente@test.com',
            'current_password' => 'password',
            'telefono' => '987654321',
            'cedula' => '12345678',
            'direccion' => 'Av. Test 123',
            'fecha_nacimiento' => $fechaValida,
        ];

        $response = $this->actingAs($this->user)
            ->patch(route('cliente.perfil.update'), $datosValidos);

        $response->assertRedirect();
        $response->assertSessionHasNoErrors();
    }

    /** @test */
    public function campos_opcionales_pueden_ser_nulos()
    {
        $datosSoloObligatorios = [
            'nombre' => 'Cliente Test',
            'email' => 'cliente@test.com',
            'current_password' => 'password',
            'telefono' => '987654321',
            'cedula' => '12345678',
            'direccion' => 'Av. Test 123',
            'fecha_nacimiento' => '1990-05-15',
            'ciudad' => null,
            'ocupacion' => null,
            'estado_civil' => null,
            'ingresos_mensuales' => null,
        ];

        $response = $this->actingAs($this->user)
            ->patch(route('cliente.perfil.update'), $datosSoloObligatorios);

        $response->assertRedirect();
        $response->assertSessionHasNoErrors();
    }

    /** @test */
    public function validacion_estado_civil_valores_permitidos()
    {
        $valoresPermitidos = ['soltero', 'casado', 'divorciado', 'viudo'];

        foreach ($valoresPermitidos as $estadoCivil) {
            $datos = [
                'nombre' => 'Cliente Test',
                'email' => 'cliente@test.com',
                'current_password' => 'password',
                'telefono' => '987654321',
                'cedula' => '12345678',
                'direccion' => 'Av. Test 123',
                'fecha_nacimiento' => '1990-05-15',
                'estado_civil' => $estadoCivil,
            ];

            $response = $this->actingAs($this->user)
                ->patch(route('cliente.perfil.update'), $datos);

            $response->assertRedirect();
            $response->assertSessionHasNoErrors();
        }
    }

    /** @test */
    public function validacion_estado_civil_valor_invalido()
    {
        $datosInvalidos = [
            'nombre' => 'Cliente Test',
            'email' => 'cliente@test.com',
            'telefono' => '987654321',
            'cedula' => '12345678',
            'direccion' => 'Av. Test 123',
            'fecha_nacimiento' => '1990-05-15',
            'estado_civil' => 'comprometido', // No está en los valores permitidos
        ];

        $response = $this->actingAs($this->user)
            ->patch(route('cliente.perfil.update'), $datosInvalidos);

        $response->assertSessionHasErrors(['estado_civil']);
    }

    /** @test */
    public function validacion_ingresos_mensuales_positivos()
    {
        $datosInvalidos = [
            'nombre' => 'Cliente Test',
            'email' => 'cliente@test.com',
            'telefono' => '987654321',
            'cedula' => '12345678',
            'direccion' => 'Av. Test 123',
            'fecha_nacimiento' => '1990-05-15',
            'ingresos_mensuales' => -1000, // Negativo
        ];

        $response = $this->actingAs($this->user)
            ->patch(route('cliente.perfil.update'), $datosInvalidos);

        $response->assertSessionHasErrors(['ingresos_mensuales']);
    }

    /** @test */
    public function usuario_no_autenticado_no_puede_acceder()
    {
        $response = $this->get(route('cliente.perfil.index'));
        $response->assertRedirect(route('login'));
    }

    /** @test */
    public function usuario_con_rol_diferente_no_puede_acceder()
    {
        // Crear un usuario asesor activo
        $asesor = User::factory()->create([
            'role' => 'asesor',
            'estado' => 'activo',
        ]);

        // Crear el registro de asesor asociado
        $asesorModel = \App\Models\Asesor::factory()->create([
            'usuario_id' => $asesor->id,
        ]);

        // Un asesor intentando acceder al perfil de cliente no debería poder acceder
        $response = $this->actingAs($asesor)
            ->get(route('cliente.perfil.index'));

        // El middleware CheckRole debería denegar el acceso (puede ser 403 o redirect)
        $this->assertTrue(
            $response->status() === 403 || $response->status() === 302,
            'El usuario con rol diferente no puede acceder al perfil de cliente'
        );
    }
}
