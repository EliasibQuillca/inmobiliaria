<?php

namespace Database\Factories;

use App\Models\Reserva;
use App\Models\Cliente;
use App\Models\Asesor;
use App\Models\Departamento;
use App\Models\Cotizacion;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Reserva>
 */
class ReservaFactory extends Factory
{
    protected $model = Reserva::class;

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
            'cotizacion_id' => Cotizacion::factory(),
            'monto_reserva' => $this->faker->randomFloat(2, 5000, 50000),
            'fecha_inicio' => $this->faker->dateTimeBetween('-30 days', 'now'),
            'fecha_vencimiento' => $this->faker->dateTimeBetween('now', '+60 days'),
            'estado' => $this->faker->randomElement(['pendiente', 'confirmada', 'cancelada', 'vencida']),
            'observaciones' => $this->faker->optional()->paragraph(),
        ];
    }

    /**
     * Indicate that the reserva is confirmed.
     */
    public function confirmada(): static
    {
        return $this->state(fn (array $attributes) => [
            'estado' => 'confirmada',
        ]);
    }

    /**
     * Indicate that the reserva is pending.
     */
    public function pendiente(): static
    {
        return $this->state(fn (array $attributes) => [
            'estado' => 'pendiente',
        ]);
    }

    /**
     * Indicate that the reserva is cancelled.
     */
    public function cancelada(): static
    {
        return $this->state(fn (array $attributes) => [
            'estado' => 'cancelada',
        ]);
    }

    /**
     * Indicate that the reserva is expired.
     */
    public function vencida(): static
    {
        return $this->state(fn (array $attributes) => [
            'estado' => 'vencida',
            'fecha_vencimiento' => $this->faker->dateTimeBetween('-30 days', '-1 day'),
        ]);
    }
}