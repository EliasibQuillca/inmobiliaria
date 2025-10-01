<?php

namespace Database\Factories;

use App\Models\Cliente;
use App\Models\User;
use App\Models\Asesor;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Cliente>
 */
class ClienteFactory extends Factory
{
    protected $model = Cliente::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'usuario_id' => User::factory()->cliente(),
            'asesor_id' => Asesor::factory(),
            'nombre' => $this->faker->name(),
            'telefono' => $this->faker->phoneNumber(),
            'email' => $this->faker->unique()->safeEmail(),
            'documento' => $this->faker->numerify('########'),
            'fecha_nacimiento' => $this->faker->dateTimeBetween('-60 years', '-18 years'),
            'ocupacion' => $this->faker->jobTitle(),
            'estado_civil' => $this->faker->randomElement(['soltero', 'casado', 'divorciado', 'viudo']),
            'ingresos_mensuales' => $this->faker->randomFloat(2, 1000, 10000),
            'preferencias' => json_encode([
                'precio_min' => $this->faker->numberBetween(50000, 100000),
                'precio_max' => $this->faker->numberBetween(100000, 500000),
                'habitaciones' => $this->faker->numberBetween(1, 4),
                'ubicacion_preferida' => $this->faker->city(),
            ]),
        ];
    }

    /**
     * Indicate that the cliente has no asesor assigned.
     */
    public function sinAsesor(): static
    {
        return $this->state(fn (array $attributes) => [
            'asesor_id' => null,
        ]);
    }
}