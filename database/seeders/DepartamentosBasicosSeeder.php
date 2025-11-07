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
                'codigo' => 'DPTO-AND-501',
                'titulo' => 'Departamento Los Andes 501',
                'descripcion' => 'Hermoso departamento con vista panorámica en zona residencial.',
                'ubicacion' => 'Los Olivos',
                'precio' => 250000.00,
                'habitaciones' => 3,
                'banos' => 2,
                'area' => 120.50,
                'estado' => 'disponible',
                'piso' => 5,
                'garage' => true,
                'balcon' => true,
                'amueblado' => false,
                'mascotas_permitidas' => true,
                'gastos_comunes' => 350.00,
                'año_construccion' => 2020,
                'destacado' => true,
                'propietario_id' => $propietario1->id,
            ],
            [
                'codigo' => 'DPTO-LIM-302',
                'titulo' => 'Departamento Lima 302',
                'descripcion' => 'Acogedor departamento en el centro de la ciudad.',
                'ubicacion' => 'Lima Centro',
                'precio' => 180000.00,
                'habitaciones' => 2,
                'banos' => 1,
                'area' => 85.75,
                'estado' => 'disponible',
                'piso' => 3,
                'garage' => false,
                'balcon' => true,
                'amueblado' => true,
                'mascotas_permitidas' => false,
                'gastos_comunes' => 250.00,
                'año_construccion' => 2018,
                'destacado' => false,
                'propietario_id' => $propietario1->id,
            ],
            [
                'codigo' => 'DPTO-CEN-204',
                'titulo' => 'Departamento Central 204',
                'descripcion' => 'Exclusivo departamento con acabados de lujo.',
                'ubicacion' => 'San Isidro',
                'precio' => 320000.00,
                'habitaciones' => 4,
                'banos' => 3,
                'area' => 150.25,
                'estado' => 'disponible',
                'piso' => 2,
                'garage' => true,
                'balcon' => true,
                'amueblado' => true,
                'mascotas_permitidas' => true,
                'gastos_comunes' => 450.00,
                'año_construccion' => 2022,
                'destacado' => true,
                'propietario_id' => $propietario2->id,
            ],
            [
                'codigo' => 'DPTO-FLO-101',
                'titulo' => 'Departamento Las Flores 101',
                'descripcion' => 'Cómodo departamento para familias jóvenes.',
                'ubicacion' => 'Miraflores',
                'precio' => 150000.00,
                'habitaciones' => 2,
                'banos' => 1,
                'area' => 75.00,
                'estado' => 'reservado',
                'piso' => 1,
                'garage' => false,
                'balcon' => false,
                'amueblado' => false,
                'mascotas_permitidas' => true,
                'gastos_comunes' => 200.00,
                'año_construccion' => 2015,
                'destacado' => false,
                'propietario_id' => $propietario2->id,
            ],
            [
                'codigo' => 'DPTO-UNI-601',
                'titulo' => 'Departamento Universitaria 601',
                'descripcion' => 'Moderno departamento cerca a universidades.',
                'ubicacion' => 'San Miguel',
                'precio' => 280000.00,
                'habitaciones' => 3,
                'banos' => 2,
                'area' => 110.80,
                'estado' => 'disponible',
                'piso' => 6,
                'garage' => true,
                'balcon' => true,
                'amueblado' => false,
                'mascotas_permitidas' => true,
                'gastos_comunes' => 300.00,
                'año_construccion' => 2019,
                'destacado' => false,
                'propietario_id' => $propietario1->id,
            ],
        ];

        foreach ($departamentos as $dept) {
            Departamento::create($dept);
            echo "✅ Departamento creado - {$dept['titulo']} - S/ " . number_format($dept['precio'], 2) . "\n";
        }

        echo "\n✅ 5 departamentos de prueba creados exitosamente!\n";
        echo "📊 Estados: 4 disponibles, 1 reservado\n\n";
    }
}
