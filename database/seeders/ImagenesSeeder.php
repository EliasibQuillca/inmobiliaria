<?php

namespace Database\Seeders;

use App\Models\Departamento;
use App\Models\Imagen;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ImagenesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        echo "🏠 Creando imágenes de ejemplo para departamentos...\n";

        $departamentos = Departamento::all();

        if ($departamentos->isEmpty()) {
            echo "⚠️ No hay departamentos disponibles. Ejecuta el seeder de departamentos primero.\n";
            return;
        }

        foreach ($departamentos as $departamento) {
            // Imagen principal
            Imagen::create([
                'departamento_id' => $departamento->id,
                'ruta' => 'images/departamentos/dept-' . $departamento->id . '-principal.jpg',
                'nombre' => 'Imagen Principal - ' . $departamento->codigo,
                'titulo' => 'Vista Principal',
                'descripcion' => 'Imagen principal del departamento ' . $departamento->codigo,
                'tipo' => 'principal',
                'orden' => 1,
                'activa' => true,
            ]);

            // Imágenes de galería
            for ($i = 1; $i <= 3; $i++) {
                Imagen::create([
                    'departamento_id' => $departamento->id,
                    'ruta' => 'images/departamentos/dept-' . $departamento->id . '-galeria-' . $i . '.jpg',
                    'nombre' => 'Galería ' . $i . ' - ' . $departamento->codigo,
                    'titulo' => 'Vista ' . $i,
                    'descripcion' => 'Imagen de galería ' . $i . ' del departamento ' . $departamento->codigo,
                    'tipo' => 'galeria',
                    'orden' => $i + 1,
                    'activa' => true,
                ]);
            }

            echo "✅ Imágenes creadas para departamento: {$departamento->codigo}\n";
        }

        echo "🎉 Proceso completado. Total imágenes creadas: " . Imagen::count() . "\n";
    }
}
