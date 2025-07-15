<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Propietario;
use App\Models\Cliente;
use App\Models\Asesor;
use App\Models\Departamento;
use App\Models\Atributo;
use App\Models\Imagen;

class DemoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Crear usuarios de ejemplo
        $admin = User::firstOrCreate(
            ['email' => 'admin@inmobiliaria.com'],
            [
                'name' => 'Administrador',
                'password' => Hash::make('password'),
                'role' => 'administrador',
                'telefono' => '+51 984 123 456',
            ]
        );

        $asesor = User::firstOrCreate(
            ['email' => 'asesor@inmobiliaria.com'],
            [
                'name' => 'Carlos Mendoza',
                'password' => Hash::make('password'),
                'role' => 'asesor',
                'telefono' => '+51 984 123 457',
            ]
        );

        $cliente = User::firstOrCreate(
            ['email' => 'cliente@inmobiliaria.com'],
            [
                'name' => 'María González',
                'password' => Hash::make('password'),
                'role' => 'cliente',
                'telefono' => '+51 984 123 458',
            ]
        );

        // Crear perfiles relacionados (si no existen)
        Asesor::firstOrCreate(
            ['usuario_id' => $asesor->id],
            ['fecha_contrato' => now()->subYear()]
        );

        Cliente::firstOrCreate(
            ['usuario_id' => $cliente->id],
            [
                'dni' => '12345678',
                'direccion' => 'Av. El Sol 123, Cusco',
                'fecha_registro' => now(),
            ]
        );

        // Crear propietarios (si no existen)
        $propietario1 = Propietario::firstOrCreate(
            ['dni' => '12345678'],
            [
                'nombre' => 'Juan Pérez',
                'tipo' => 'natural',
                'contacto' => '+51 984 111 222',
                'direccion' => 'Av. Cultura 456, Cusco',
                'registrado_sunarp' => true,
            ]
        );

        $propietario2 = Propietario::firstOrCreate(
            ['dni' => '87654321'],
            [
                'nombre' => 'Ana Rodríguez',
                'tipo' => 'natural',
                'contacto' => '+51 984 333 444',
                'direccion' => 'Jr. Saphy 789, Cusco',
                'registrado_sunarp' => true,
            ]
        );

        // Crear atributos
        $atributos = [
            ['nombre' => 'Aire acondicionado', 'tipo' => 'boolean'],
            ['nombre' => 'Calefacción', 'tipo' => 'boolean'],
            ['nombre' => 'Balcón', 'tipo' => 'boolean'],
            ['nombre' => 'Terraza', 'tipo' => 'boolean'],
            ['nombre' => 'Ascensor', 'tipo' => 'boolean'],
            ['nombre' => 'Seguridad 24h', 'tipo' => 'boolean'],
            ['nombre' => 'Piscina', 'tipo' => 'boolean'],
            ['nombre' => 'Gimnasio', 'tipo' => 'boolean'],
            ['nombre' => 'Sala de reuniones', 'tipo' => 'boolean'],
            ['nombre' => 'Internet incluido', 'tipo' => 'boolean'],
            ['nombre' => 'Cable incluido', 'tipo' => 'boolean'],
            ['nombre' => 'Mascotas permitidas', 'tipo' => 'boolean'],
        ];

        foreach ($atributos as $atributoData) {
            Atributo::firstOrCreate(
                ['nombre' => $atributoData['nombre']],
                ['tipo' => $atributoData['tipo']]
            );
        }        // Crear departamentos de ejemplo
        $departamentos = [
            [
                'codigo' => 'DEPT-001',
                'titulo' => 'Moderno Departamento en San Blas',
                'descripcion' => 'Hermoso departamento completamente amueblado en el corazón del barrio de San Blas. Cuenta con una vista espectacular de la ciudad y fácil acceso a restaurantes y sitios turísticos.',
                'ubicacion' => 'San Blas, Cusco',
                'direccion' => 'Calle Hatunrumiyoc 123, San Blas',
                'precio' => 350000,
                'precio_anterior' => 380000,
                'dormitorios' => 2,
                'banos' => 2,
                'area_total' => 85.5,
                'estacionamientos' => 1,
                'estado' => 'disponible',
                'disponible' => true,
                'propietario_id' => $propietario1->id,
            ],
            [
                'codigo' => 'DEPT-002',
                'titulo' => 'Departamento Familiar en Wanchaq',
                'descripcion' => 'Amplio departamento ideal para familias. Ubicado en una zona tranquila con excelente conectividad. Incluye espacios verdes y área de juegos para niños.',
                'ubicacion' => 'Wanchaq, Cusco',
                'direccion' => 'Av. Tomasa Tito Condemayta 456, Wanchaq',
                'precio' => 280000,
                'dormitorios' => 3,
                'banos' => 2,
                'area_total' => 110.0,
                'estacionamientos' => 2,
                'estado' => 'disponible',
                'disponible' => true,
                'propietario_id' => $propietario1->id,
            ],
            [
                'codigo' => 'DEPT-003',
                'titulo' => 'Loft Moderno en Centro Histórico',
                'descripcion' => 'Elegante loft en pleno centro histórico de Cusco. Diseño contemporáneo que respeta la arquitectura colonial. Perfecto para profesionales jóvenes.',
                'ubicacion' => 'Centro Histórico, Cusco',
                'direccion' => 'Jr. Ayacucho 789, Centro Histórico',
                'precio' => 420000,
                'dormitorios' => 1,
                'banos' => 1,
                'area_total' => 65.0,
                'estacionamientos' => 0,
                'estado' => 'disponible',
                'disponible' => true,
                'propietario_id' => $propietario2->id,
            ],
            [
                'codigo' => 'DEPT-004',
                'titulo' => 'Penthouse con Vista Panorámica',
                'descripcion' => 'Exclusivo penthouse con vista panorámica de 360° de la ciudad del Cusco y las montañas circundantes. Acabados de lujo y terraza privada.',
                'ubicacion' => 'San Jerónimo, Cusco',
                'direccion' => 'Av. Huayruropata 321, San Jerónimo',
                'precio' => 850000,
                'dormitorios' => 4,
                'banos' => 3,
                'area_total' => 180.0,
                'estacionamientos' => 2,
                'estado' => 'disponible',
                'disponible' => true,
                'propietario_id' => $propietario2->id,
            ],
            [
                'codigo' => 'DEPT-005',
                'titulo' => 'Acogedor Departamento en Santiago',
                'descripcion' => 'Departamento acogedor en el distrito de Santiago. Ideal para parejas jóvenes que buscan su primer hogar. Zona en crecimiento con buena proyección.',
                'ubicacion' => 'Santiago, Cusco',
                'direccion' => 'Calle Mateo Pumacahua 654, Santiago',
                'precio' => 195000,
                'dormitorios' => 2,
                'banos' => 1,
                'area_total' => 75.0,
                'estacionamientos' => 1,
                'estado' => 'disponible',
                'disponible' => true,
                'propietario_id' => $propietario1->id,
            ],
        ];

        foreach ($departamentos as $deptoData) {
            $departamento = Departamento::firstOrCreate(
                ['codigo' => $deptoData['codigo']],
                $deptoData
            );

            // Agregar algunos atributos aleatorios solo si es un nuevo departamento
            if ($departamento->wasRecentlyCreated) {
                $atributosAleatorios = Atributo::inRandomOrder()->take(rand(3, 6))->pluck('id');
                $departamento->atributos()->attach($atributosAleatorios);
            }
        }

        // Crear imágenes de ejemplo para los departamentos
        $imagenesUrl = [
            'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
            'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
            'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
            'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800',
            'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800',
            'https://images.unsplash.com/photo-1505873242700-f289a29e1e0f?w=800',
            'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800',
            'https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=800',
            'https://images.unsplash.com/photo-1501183638710-841dd1904471?w=800',
        ];

        $departamentosCreados = Departamento::all();

        foreach ($departamentosCreados as $departamento) {
            // Crear entre 3 y 6 imágenes por departamento
            $numImagenes = rand(3, 6);

            for ($i = 0; $i < $numImagenes; $i++) {
                Imagen::create([
                    'departamento_id' => $departamento->id,
                    'url' => $imagenesUrl[array_rand($imagenesUrl)],
                    'titulo' => $i === 0 ? 'Imagen Principal' : "Vista {$i}",
                    'descripcion' => $i === 0 ? 'Imagen principal del departamento' : "Vista número {$i} del departamento",
                    'tipo' => $i === 0 ? 'principal' : 'galeria',
                    'orden' => $i + 1,
                    'activa' => true,
                ]);
            }
        }

        $this->command->info('Datos de demostración creados exitosamente!');
        $this->command->info('Usuario Admin: admin@inmobiliaria.com / password');
        $this->command->info('Usuario Asesor: asesor@inmobiliaria.com / password');
        $this->command->info('Usuario Cliente: cliente@inmobiliaria.com / password');
    }
}
