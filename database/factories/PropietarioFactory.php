<?php

namespace Database\Factories;

use App\Models\Propietario;
use Illuminate\Database\Eloquent\Factories\Factory;

class PropietarioFactory extends Factory
{
    protected $model = Propietario::class;

    public function definition()
    {
        return [
            'nombre' => $this->faker->name,
            'dni' => $this->faker->unique()->numerify('########'),
            'tipo' => $this->faker->randomElement(['natural', 'juridico']),
            'contacto' => $this->faker->phoneNumber,
            'direccion' => $this->faker->address,
            'registrado_sunarp' => $this->faker->boolean(70),
        ];
    }
}