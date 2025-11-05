<?php

namespace Database\Factories;

use App\Models\Asesor;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Asesor>
 */
class AsesorFactory extends Factory
{
    protected $model = Asesor::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'usuario_id' => User::factory(),
            'fecha_contrato' => $this->faker->dateTimeBetween('-2 years', 'now'),
            'nombre' => $this->faker->firstName(),
            'apellidos' => $this->faker->lastName() . ' ' . $this->faker->lastName(),
            'telefono' => $this->faker->phoneNumber(),
            'documento' => $this->faker->numerify('########'),
            'direccion' => $this->faker->address(),
            'fecha_nacimiento' => $this->faker->dateTimeBetween('-60 years', '-25 years'),
            'especialidad' => $this->faker->randomElement([
                'Ventas Residenciales',
                'Ventas Comerciales',
                'Alquileres',
                'Propiedades de Lujo',
                'Inversiones Inmobiliarias'
            ]),
            'experiencia' => $this->faker->numberBetween(0, 15),
            'biografia' => $this->faker->paragraph(3),
            'estado' => $this->faker->randomElement(['activo', 'inactivo']),
            'comision_porcentaje' => $this->faker->randomFloat(2, 3, 10),
        ];
    }

    /**
     * Indicate that the asesor is active.
     */
    public function activo(): static
    {
        return $this->state(fn (array $attributes) => [
            'estado' => 'activo',
        ]);
    }

    /**
     * Indicate that the asesor is inactive.
     */
    public function inactivo(): static
    {
        return $this->state(fn (array $attributes) => [
            'estado' => 'inactivo',
        ]);
    }
}
