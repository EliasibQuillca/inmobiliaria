<?php

namespace Database\Factories;

use App\Models\Venta;
use App\Models\Cliente;
use App\Models\Asesor;
use App\Models\Departamento;
use App\Models\Reserva;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Venta>
 */
class VentaFactory extends Factory
{
    protected $model = Venta::class;

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
            'reserva_id' => null, // Opcional
            'precio_final' => $this->faker->randomFloat(2, 50000, 400000),
            'comision_asesor' => function (array $attributes) {
                return $attributes['precio_final'] * 0.05; // 5% de comisión
            },
            'fecha_venta' => $this->faker->dateTimeBetween('-1 year', 'now'),
            'estado' => $this->faker->randomElement(['completada', 'pendiente', 'cancelada']),
            'metodo_pago' => $this->faker->randomElement(['efectivo', 'transferencia', 'credito', 'mixto']),
            'observaciones' => $this->faker->optional()->paragraph(),
        ];
    }

    /**
     * Indicate that the venta is completed.
     */
    public function completada(): static
    {
        return $this->state(fn (array $attributes) => [
            'estado' => 'completada',
        ]);
    }

    /**
     * Indicate that the venta is pending.
     */
    public function pendiente(): static
    {
        return $this->state(fn (array $attributes) => [
            'estado' => 'pendiente',
        ]);
    }

    /**
     * Indicate that the venta is cancelled.
     */
    public function cancelada(): static
    {
        return $this->state(fn (array $attributes) => [
            'estado' => 'cancelada',
        ]);
    }

    /**
     * Indicate that the venta has a reservation.
     */
    public function conReserva(): static
    {
        return $this->state(fn (array $attributes) => [
            'reserva_id' => Reserva::factory(),
        ]);
    }
}