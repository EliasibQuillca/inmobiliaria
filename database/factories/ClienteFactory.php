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
        $presupuestoMin = $this->faker->numberBetween(80000, 150000);
        
        return [
            'usuario_id' => User::factory()->cliente(),
            'asesor_id' => Asesor::factory(),
            'nombre' => $this->faker->name(),
            'telefono' => $this->faker->phoneNumber(),
            'email' => $this->faker->unique()->safeEmail(),
            'dni' => $this->faker->unique()->numerify('########'),
            'direccion' => $this->faker->address(),
            'fecha_registro' => now(),
            'medio_contacto' => $this->faker->randomElement(['whatsapp', 'telefono', 'presencial']),
            'estado' => $this->faker->randomElement(['contactado', 'interesado', 'cita_agendada']),
            'notas_contacto' => $this->faker->optional()->sentence(),
            'notas_seguimiento' => $this->faker->optional()->paragraph(),
            'tipo_propiedad' => $this->faker->randomElement(['apartamento', 'casa', 'penthouse', 'estudio', 'duplex']),
            'habitaciones_deseadas' => $this->faker->numberBetween(1, 5),
            'presupuesto_min' => $presupuestoMin,
            'presupuesto_max' => $this->faker->numberBetween($presupuestoMin + 50000, 500000),
            'zona_preferida' => $this->faker->randomElement([
                'San Isidro', 
                'Miraflores', 
                'Surco', 
                'La Molina', 
                'San Borja',
                'Jesús María',
                'Pueblo Libre',
                'Magdalena'
            ]),
        ];
    }

    /**
     * Cliente sin usuario asociado (solo prospecto)
     */
    public function sinUsuario(): static
    {
        return $this->state(fn (array $attributes) => [
            'usuario_id' => null,
        ]);
    }

    /**
     * Cliente con cita agendada
     */
    public function conCita(): static
    {
        return $this->state(fn (array $attributes) => [
            'estado' => 'cita_agendada',
            'fecha_cita' => $this->faker->dateTimeBetween('now', '+7 days'),
            'tipo_cita' => $this->faker->randomElement(['presencial', 'virtual', 'telefonica']),
            'ubicacion_cita' => $this->faker->randomElement([
                'Oficina Central',
                'Zoom Meeting',
                'Departamento modelo',
                'Cafetería'
            ]),
            'notas_cita' => $this->faker->optional()->sentence(),
        ]);
    }

    /**
     * Cliente interesado activamente
     */
    public function interesado(): static
    {
        return $this->state(fn (array $attributes) => [
            'estado' => 'interesado',
            'notas_seguimiento' => 'Cliente muy interesado. ' . $this->faker->sentence(),
        ]);
    }

    /**
     * Cliente sin interés actual
     */
    public function sinInteres(): static
    {
        return $this->state(fn (array $attributes) => [
            'estado' => 'sin_interes',
            'notas_seguimiento' => 'Cliente no interesado por el momento. ' . $this->faker->sentence(),
        ]);
    }
}