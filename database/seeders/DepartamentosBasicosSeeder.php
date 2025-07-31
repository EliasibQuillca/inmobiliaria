<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Departamento;
use App\Models\Propietario;

class DepartamentosBasicosSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        echo "\n=== CREANDO DEPARTAMENTOS DE PRUEBA ===\n\n";

        // Limpiar departamentos existentes (desactivar foreign key constraints)
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        Departamento::truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
        
        // Buscar o crear propietarios
        $propietario1 = Propietario::firstOrCreate([
            'dni' => '12345001'
        ], [
            'nombre' => 'Juan Pérez',
            'tipo' => 'natural',
            'contacto' => 'juan.perez@email.com / 987654321',
            'direccion' => 'Av. Principal 123',
            'registrado_sunarp' => true,
        ]);

        $propietario2 = Propietario::firstOrCreate([
            'dni' => '12345002'
        ], [
            'nombre' => 'María González',
            'tipo' => 'natural',
            'contacto' => 'maria.gonzalez@email.com / 976543210',
            'direccion' => 'Calle Secundaria 456',
            'registrado_sunarp' => true,
        ]);

        // Crear departamentos básicos
        $departamentos = [
            [
                'codigo' => 'DEPT-001',
                'titulo' => 'Departamento Los Andes 501',
                'descripcion' => 'Hermoso departamento con vista panorámica en zona residencial.',
                'ubicacion' => 'Los Olivos',
                'direccion' => 'Av. Los Andes 123, Dpto 501',
                'precio' => 250000.00,
                'dormitorios' => 3,
                'banos' => 2,
                'area_total' => 120.50,
                'estado' => 'disponible',
                'disponible' => true,
                'propietario_id' => $propietario1->id,
            ],
            [
                'codigo' => 'DEPT-002',
                'titulo' => 'Departamento Lima 302',
                'descripcion' => 'Acogedor departamento en el centro de la ciudad.',
                'ubicacion' => 'Lima Centro',
                'direccion' => 'Jr. Lima 456, Dpto 302',
                'precio' => 180000.00,
                'dormitorios' => 2,
                'banos' => 1,
                'area_total' => 85.75,
                'estado' => 'disponible',
                'disponible' => true,
                'propietario_id' => $propietario1->id,
            ],
            [
                'codigo' => 'DEPT-003',
                'titulo' => 'Departamento Central 204',
                'descripcion' => 'Exclusivo departamento con acabados de lujo.',
                'ubicacion' => 'San Isidro',
                'direccion' => 'Av. Central 789, Dpto 204',
                'precio' => 320000.00,
                'dormitorios' => 4,
                'banos' => 3,
                'area_total' => 150.25,
                'estado' => 'disponible',
                'disponible' => true,
                'propietario_id' => $propietario2->id,
            ],
            [
                'codigo' => 'DEPT-004',
                'titulo' => 'Departamento Las Flores 101',
                'descripcion' => 'Cómodo departamento para familias jóvenes.',
                'ubicacion' => 'Miraflores',
                'direccion' => 'Calle Las Flores 321, Dpto 101',
                'precio' => 150000.00,
                'dormitorios' => 2,
                'banos' => 1,
                'area_total' => 75.00,
                'estado' => 'reservado',
                'disponible' => false,
                'propietario_id' => $propietario2->id,
            ],
            [
                'codigo' => 'DEPT-005',
                'titulo' => 'Departamento Universitaria 601',
                'descripcion' => 'Moderno departamento cerca a universidades.',
                'ubicacion' => 'San Miguel',
                'direccion' => 'Av. Universitaria 654, Dpto 601',
                'precio' => 280000.00,
                'dormitorios' => 3,
                'banos' => 2,
                'area_total' => 110.80,
                'estado' => 'disponible',
                'disponible' => true,
                'propietario_id' => $propietario1->id,
            ],
        ];

        foreach ($departamentos as $dept) {
            Departamento::create($dept);
            echo "✅ Departamento {$dept['codigo']} creado - {$dept['direccion']} - S/ " . number_format($dept['precio'], 2) . "\n";
        }

        echo "\n✅ 5 departamentos de prueba creados exitosamente!\n";
        echo "📊 Estados: 4 disponibles, 1 reservado\n\n";
    }
}
