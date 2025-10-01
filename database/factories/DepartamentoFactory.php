<?php

namespace Database\Factories;

use App\Models\Departamento;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Departamento>
 */
class DepartamentoFactory extends Factory
{
    protected $model = Departamento::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'titulo' => $this->faker->sentence(4),
            'descripcion' => $this->faker->paragraph(3),
            'ubicacion' => $this->faker->address(),
            'precio' => $this->faker->randomFloat(2, 50000, 500000),
            'habitaciones' => $this->faker->numberBetween(1, 5),
            'banos' => $this->faker->numberBetween(1, 3),
            'area' => $this->faker->randomFloat(2, 30, 200),
            'disponible' => $this->faker->boolean(80), // 80% disponibles
            'estado' => $this->faker->randomElement(['disponible', 'reservado', 'vendido']),
            'piso' => $this->faker->numberBetween(1, 20),
            'garage' => $this->faker->boolean(60),
            'balcon' => $this->faker->boolean(70),
            'amueblado' => $this->faker->boolean(40),
            'mascotas_permitidas' => $this->faker->boolean(50),
            'gastos_comunes' => $this->faker->randomFloat(2, 50, 300),
            'año_construccion' => $this->faker->numberBetween(1990, 2024),
            'destacado' => $this->faker->boolean(20), // 20% destacados
        ];
    }

    /**
     * Indicate that the departamento is available.
     */
    public function disponible(): static
    {
        return $this->state(fn (array $attributes) => [
            'disponible' => true,
            'estado' => 'disponible',
        ]);
    }

    /**
     * Indicate that the departamento is reserved.
     */
    public function reservado(): static
    {
        return $this->state(fn (array $attributes) => [
            'disponible' => false,
            'estado' => 'reservado',
        ]);
    }

    /**
     * Indicate that the departamento is sold.
     */
    public function vendido(): static
    {
        return $this->state(fn (array $attributes) => [
            'disponible' => false,
            'estado' => 'vendido',
        ]);
    }

    /**
     * Indicate that the departamento is featured.
     */
    public function destacado(): static
    {
        return $this->state(fn (array $attributes) => [
            'destacado' => true,
        ]);
    }
}