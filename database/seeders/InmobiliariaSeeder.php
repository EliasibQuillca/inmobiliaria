<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Asesor;
use App\Models\Cliente;
use App\Models\Propietario;
use App\Models\Departamento;
use App\Models\Atributo;
use Illuminate\Support\Facades\Hash;

class InmobiliariaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Crear usuario administrador
        $admin = User::create([
            'nombre' => 'Administrador Sistema',
            'email' => 'admin@inmobiliaria.com',
            'telefono' => '+51987654321',
            'clave_hash' => Hash::make('admin123'),
            'rol' => 'administrador',
        ]);

        // Crear usuario asesor
        $userAsesor = User::create([
            'nombre' => 'Juan Carlos Mendoza',
            'email' => 'asesor@inmobiliaria.com',
            'telefono' => '+51987654322',
            'clave_hash' => Hash::make('asesor123'),
            'rol' => 'asesor',
        ]);

        // Crear perfil de asesor
        $asesor = Asesor::create([
            'usuario_id' => $userAsesor->id,
            'fecha_contrato' => '2023-01-15',
        ]);

        // Crear usuario cliente
        $userCliente = User::create([
            'nombre' => 'María Elena Quispe',
            'email' => 'cliente@email.com',
            'telefono' => '+51987654323',
            'clave_hash' => Hash::make('cliente123'),
            'rol' => 'cliente',
        ]);

        // Crear perfil de cliente
        $cliente = Cliente::create([
            'usuario_id' => $userCliente->id,
            'dni' => '70123456',
            'direccion' => 'Av. El Sol 123, Cusco',
            'fecha_registro' => now(),
        ]);

        // Crear propietarios
        $propietario1 = Propietario::create([
            'nombre' => 'Constructora Cusco SAC',
            'dni' => '20123456789',
            'tipo' => 'juridico',
            'contacto' => 'gerencia@constructora.com',
            'direccion' => 'Av. La Cultura 456, Cusco',
            'registrado_sunarp' => true,
        ]);

        $propietario2 = Propietario::create([
            'nombre' => 'Carlos Alberto Huamán',
            'dni' => '70987654',
            'tipo' => 'natural',
            'contacto' => '+51987123456',
            'direccion' => 'Calle Plateros 789, Cusco',
            'registrado_sunarp' => true,
        ]);

        // Crear atributos
        $atributos = [
            ['nombre' => 'Área (m²)', 'tipo' => 'number'],
            ['nombre' => 'Número de dormitorios', 'tipo' => 'number'],
            ['nombre' => 'Número de baños', 'tipo' => 'number'],
            ['nombre' => 'Tiene balcón', 'tipo' => 'boolean'],
            ['nombre' => 'Tiene estacionamiento', 'tipo' => 'boolean'],
            ['nombre' => 'Piso', 'tipo' => 'number'],
            ['nombre' => 'Amoblado', 'tipo' => 'boolean'],
            ['nombre' => 'Fecha de construcción', 'tipo' => 'date'],
        ];

        foreach ($atributos as $atributo) {
            Atributo::create($atributo);
        }

        // Crear departamentos
        $departamento1 = Departamento::create([
            'codigo' => 'DEPT-001',
            'direccion' => 'Av. El Sol 250, Departamento 3A, Cusco',
            'precio' => 280000.00,
            'estado' => 'disponible',
            'propietario_id' => $propietario1->id,
        ]);

        $departamento2 = Departamento::create([
            'codigo' => 'DEPT-002',
            'direccion' => 'Calle Saphi 180, Departamento 2B, Cusco',
            'precio' => 350000.00,
            'estado' => 'disponible',
            'propietario_id' => $propietario1->id,
        ]);

        $departamento3 = Departamento::create([
            'codigo' => 'DEPT-003',
            'direccion' => 'Av. La Cultura 320, Departamento 1C, Cusco',
            'precio' => 420000.00,
            'estado' => 'disponible',
            'propietario_id' => $propietario2->id,
        ]);

        // Asignar atributos a departamentos
        $atributosModels = Atributo::all();

        // Departamento 1 - Económico
        $departamento1->atributos()->attach($atributosModels[0]->id, ['valor' => '65']);  // Área
        $departamento1->atributos()->attach($atributosModels[1]->id, ['valor' => '2']);   // Dormitorios
        $departamento1->atributos()->attach($atributosModels[2]->id, ['valor' => '1']);   // Baños
        $departamento1->atributos()->attach($atributosModels[3]->id, ['valor' => 'true']); // Balcón
        $departamento1->atributos()->attach($atributosModels[4]->id, ['valor' => 'false']); // Estacionamiento
        $departamento1->atributos()->attach($atributosModels[5]->id, ['valor' => '3']);   // Piso

        // Departamento 2 - Medio
        $departamento2->atributos()->attach($atributosModels[0]->id, ['valor' => '85']);  // Área
        $departamento2->atributos()->attach($atributosModels[1]->id, ['valor' => '3']);   // Dormitorios
        $departamento2->atributos()->attach($atributosModels[2]->id, ['valor' => '2']);   // Baños
        $departamento2->atributos()->attach($atributosModels[3]->id, ['valor' => 'true']); // Balcón
        $departamento2->atributos()->attach($atributosModels[4]->id, ['valor' => 'true']); // Estacionamiento
        $departamento2->atributos()->attach($atributosModels[5]->id, ['valor' => '2']);   // Piso

        // Departamento 3 - Premium
        $departamento3->atributos()->attach($atributosModels[0]->id, ['valor' => '120']); // Área
        $departamento3->atributos()->attach($atributosModels[1]->id, ['valor' => '4']);   // Dormitorios
        $departamento3->atributos()->attach($atributosModels[2]->id, ['valor' => '3']);   // Baños
        $departamento3->atributos()->attach($atributosModels[3]->id, ['valor' => 'true']); // Balcón
        $departamento3->atributos()->attach($atributosModels[4]->id, ['valor' => 'true']); // Estacionamiento
        $departamento3->atributos()->attach($atributosModels[5]->id, ['valor' => '1']);   // Piso
        $departamento3->atributos()->attach($atributosModels[6]->id, ['valor' => 'true']); // Amoblado

        echo "Seeder completado exitosamente!\n";
        echo "Usuarios creados:\n";
        echo "- Administrador: admin@inmobiliaria.com / admin123\n";
        echo "- Asesor: asesor@inmobiliaria.com / asesor123\n";
        echo "- Cliente: cliente@email.com / cliente123\n";
        echo "Departamentos creados: 3\n";
        echo "Propietarios creados: 2\n";
        echo "Atributos creados: 8\n";
    }
}
