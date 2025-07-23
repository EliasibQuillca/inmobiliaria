<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Imagen;
use App\Models\Departamento;
use Illuminate\Support\Facades\DB;

class ImagenSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::beginTransaction();

        try {
            $this->command->info('Iniciando seeder de imágenes...');

            // URLs de imágenes de ejemplo (usando Unsplash como fuente gratuita)
            $imagenesEjemplo = $this->obtenerImagenesEjemplo();

            // Obtener todos los departamentos
            $departamentos = Departamento::all();

            if ($departamentos->count() === 0) {
                $this->command->warn('No hay departamentos disponibles. Ejecute primero otros seeders.');
                return;
            }

            $this->crearImagenesParaDepartamentos($departamentos, $imagenesEjemplo);

            DB::commit();
            $this->mostrarEstadisticas($departamentos->count());

        } catch (\Exception $e) {
            DB::rollback();
            $this->command->error('Error en seeder de imágenes: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * @return array<string, array<int, string>>
     */
    private function obtenerImagenesEjemplo(): array
    {
        return [
            'apartamentos' => [
                'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
                'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80',
                'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80',
                'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
                'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80',
            ],
            'cocinas' => [
                'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80',
                'https://images.unsplash.com/photo-1556909114-4e8e5a4c6e0c?w=800&q=80',
                'https://images.unsplash.com/photo-1556909114-ddf8c6deda8b?w=800&q=80',
            ],
            'baños' => [
                'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=800&q=80',
                'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&q=80',
                'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80',
            ],
            'dormitorios' => [
                'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80',
                'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&q=80',
                'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&q=80',
            ],
            'vistas' => [
                'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80',
                'https://images.unsplash.com/photo-1534008757030-27299c4371b6?w=800&q=80',
                'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
            ]
        ];
    }

    /**
     * @param \Illuminate\Database\Eloquent\Collection<int, Departamento> $departamentos
     * @param array<string, array<int, string>> $imagenesEjemplo
     */
    private function crearImagenesParaDepartamentos($departamentos, array $imagenesEjemplo): void
    {
        $totalImagenes = 0;

        foreach ($departamentos as $departamento) {
            $orden = 1;

            // Agregar imagen principal
            Imagen::create([
                'departamento_id' => $departamento->getKey(),
                'url' => $imagenesEjemplo['apartamentos'][array_rand($imagenesEjemplo['apartamentos'])],
                'titulo' => 'Vista principal del departamento',
                'descripcion' => 'Imagen principal que muestra la fachada y características principales del departamento',
                'tipo' => 'principal',
                'orden' => $orden++,
                'activa' => true,
            ]);
            $totalImagenes++;

            // Agregar imágenes de galería (2-4 imágenes por departamento)
            $cantidadImagenes = rand(2, 4);
            $tiposUsados = [];

            for ($i = 0; $i < $cantidadImagenes; $i++) {
                // Seleccionar un tipo de imagen que no se haya usado
                $tiposDisponibles = array_diff(array_keys($imagenesEjemplo), $tiposUsados);
                if (empty($tiposDisponibles)) {
                    $tiposDisponibles = array_keys($imagenesEjemplo);
                }

                $tipoSeleccionado = $tiposDisponibles[array_rand($tiposDisponibles)];
                $tiposUsados[] = $tipoSeleccionado;

                $titulosDescripciones = $this->obtenerTitulosDescripciones();

                Imagen::create([
                    'departamento_id' => $departamento->getKey(),
                    'url' => $imagenesEjemplo[$tipoSeleccionado][array_rand($imagenesEjemplo[$tipoSeleccionado])],
                    'titulo' => $titulosDescripciones[$tipoSeleccionado][0],
                    'descripcion' => $titulosDescripciones[$tipoSeleccionado][1],
                    'tipo' => 'galeria',
                    'orden' => $orden++,
                    'activa' => true,
                ]);
                $totalImagenes++;
            }

            // Agregar un plano (1 de cada 3 departamentos)
            if (rand(1, 3) === 1) {
                Imagen::create([
                    'departamento_id' => $departamento->getKey(),
                    'url' => 'https://images.unsplash.com/photo-1562832135-14a35d25edef?w=800&q=80',
                    'titulo' => 'Plano del departamento',
                    'descripcion' => 'Distribución y medidas exactas del departamento',
                    'tipo' => 'plano',
                    'orden' => $orden++,
                    'activa' => true,
                ]);
                $totalImagenes++;
            }
        }

        $this->command->info("Total de imágenes creadas: {$totalImagenes}");
    }

    /**
     * @return array<string, array<int, string>>
     */
    private function obtenerTitulosDescripciones(): array
    {
        return [
            'apartamentos' => ['Sala de estar', 'Área de estar con excelente iluminación natural'],
            'cocinas' => ['Cocina equipada', 'Cocina moderna completamente equipada con electrodomésticos'],
            'baños' => ['Baño principal', 'Baño con acabados de primera calidad'],
            'dormitorios' => ['Dormitorio principal', 'Amplio dormitorio con closet incorporado'],
            'vistas' => ['Vista desde la terraza', 'Hermosa vista desde la ventana principal']
        ];
    }

    private function mostrarEstadisticas(int $cantidadDepartamentos): void
    {
        $this->command->info('=== ESTADÍSTICAS IMÁGENES ===');
        $this->command->info('✅ Imágenes de ejemplo creadas exitosamente');
        $this->command->info("📸 Se han agregado imágenes para {$cantidadDepartamentos} departamentos");
        $this->command->info('Total imágenes: ' . Imagen::count());
        $this->command->info('=============================');
    }
}
