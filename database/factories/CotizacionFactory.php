<?php

namespace Database\Factories;

use App\Models\Cotizacion;
use App\Models\Cliente;
use App\Models\Asesor;
use App\Models\Departamento;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Cotizacion>
 */
class CotizacionFactory extends Factory
{
    protected $model = Cotizacion::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'cliente_id' => Cliente::factory(),
            'asesor_id' => Asesor::factory(),
            'departamento_id' => Departamento::factory(),
            'precio_ofertado' => $this->faker->randomFloat(2, 50000, 400000),
            'descuento' => $this->faker->randomFloat(2, 0, 10000),
            'precio_final' => function (array $attributes) {
                return $attributes['precio_ofertado'] - ($attributes['descuento'] ?? 0);
            },
            'estado' => $this->faker->randomElement(['pendiente', 'aceptada', 'rechazada', 'expirada']),
            'fecha_expiracion' => $this->faker->dateTimeBetween('+1 day', '+30 days'),
            'observaciones' => $this->faker->optional()->paragraph(),
            'solicitud_titulo' => $this->faker->sentence(4),
            'solicitud_descripcion' => $this->faker->paragraph(),
            'solicitud_precio_min' => $this->faker->randomFloat(2, 40000, 200000),
            'solicitud_precio_max' => $this->faker->randomFloat(2, 200000, 500000),
            'solicitud_habitaciones' => $this->faker->numberBetween(1, 4),
            'solicitud_ubicacion' => $this->faker->city(),
            'solicitud_fecha' => $this->faker->dateTimeBetween('-30 days', 'now'),
        ];
    }

    /**
     * Indicate that the cotizacion is pending.
     */
    public function pendiente(): static
    {
        return $this->state(fn (array $attributes) => [
            'estado' => 'pendiente',
        ]);
    }

    /**
     * Indicate that the cotizacion is accepted.
     */
    public function aceptada(): static
    {
        return $this->state(fn (array $attributes) => [
            'estado' => 'aceptada',
        ]);
    }

    /**
     * Indicate that the cotizacion is rejected.
     */
    public function rechazada(): static
    {
        return $this->state(fn (array $attributes) => [
            'estado' => 'rechazada',
        ]);
    }

    /**
     * Indicate that the cotizacion is expired.
     */
    public function expirada(): static
    {
        return $this->state(fn (array $attributes) => [
            'estado' => 'expirada',
            'fecha_expiracion' => $this->faker->dateTimeBetween('-30 days', '-1 day'),
        ]);
    }
}