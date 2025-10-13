<?php

namespace Database\Factories;

use App\Models\Imagen;
use App\Models\Departamento;
use Illuminate\Database\Eloquent\Factories\Factory;

class ImagenFactory extends Factory
{
    protected $model = Imagen::class;

    public function definition()
    {
        return [
            'departamento_id' => Departamento::factory(),
            'url' => 'storage/departamentos/default.jpg',
            'titulo' => $this->faker->sentence(3),
            'tipo' => 'galeria',
            'activa' => true,
            'orden' => $this->faker->numberBetween(1, 10),
        ];
    }

    public function principal()
    {
        return $this->state(function (array $attributes) {
            return [
                'tipo' => 'principal',
                'orden' => 1,
            ];
        });
    }

    public function inactiva()
    {
        return $this->state(function (array $attributes) {
            return [
                'activa' => false,
            ];
        });
    }
}