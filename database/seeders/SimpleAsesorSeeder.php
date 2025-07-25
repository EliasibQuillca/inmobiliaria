<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Asesor;
use Illuminate\Support\Facades\Hash;

class SimpleAsesorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Verificar si ya existe el usuario asesor
        $userAsesor = User::where('email', 'asesor@inmobiliaria.com')->first();

        if (!$userAsesor) {
            // Crear usuario asesor de prueba
            $userAsesor = User::create([
                'name' => 'Juan Carlos Pérez',
                'email' => 'asesor@inmobiliaria.com',
                'password' => Hash::make('123456'),
                'role' => 'asesor',
                'telefono' => '+57 300 123 4567',
                'estado' => 'activo',
            ]);

            $this->command->info('✅ Usuario asesor creado: asesor@inmobiliaria.com / 123456');
        } else {
            $this->command->info('ℹ️ Usuario asesor ya existe: asesor@inmobiliaria.com');
        }

        // Verificar si ya existe el perfil de asesor
        $asesor = Asesor::where('usuario_id', $userAsesor->id)->first();

        if (!$asesor) {
            // Crear perfil de asesor
            $asesor = Asesor::create([
                'usuario_id' => $userAsesor->id,
                'nombre' => 'Juan Carlos',
                'apellido' => 'Pérez García',
                'telefono' => '+57 300 123 4567',
                'documento' => '12345678',
                'fecha_nacimiento' => '1985-05-15',
                'direccion' => 'Calle 123 #45-67, Bogotá',
                'especialidad' => 'Apartamentos y Condominios',
                'experiencia' => 8,
                'biografia' => 'Asesor inmobiliario con más de 8 años de experiencia en la venta de apartamentos y condominios. Especializado en propiedades de alta calidad y atención personalizada.',
                'fecha_contrato' => '2020-01-15',
                'comision_porcentaje' => 3.0,
                'estado' => 'activo',
            ]);

            $this->command->info('✅ Perfil de asesor creado exitosamente');
        } else {
            $this->command->info('ℹ️ Perfil de asesor ya existe');
        }

        // Crear algunos clientes de prueba para el asesor
        $this->createSampleClients($asesor);

        $this->command->info('🎉 Configuración del asesor completada. Puedes iniciar sesión con:');
        $this->command->info('   Email: asesor@inmobiliaria.com');
        $this->command->info('   Password: 123456');
    }

    private function createSampleClients($asesor)
    {
        $sampleClients = [
            [
                'nombre' => 'María García',
                'telefono' => '+57 310 111 2222',
                'email' => 'maria.garcia@email.com',
                'dni' => '12345678',
                'medio_contacto' => 'whatsapp',
                'estado' => 'contactado',
                'notas_contacto' => 'Interesada en apartamento de 3 habitaciones'
            ],
            [
                'nombre' => 'Carlos Rodríguez',
                'telefono' => '+57 320 333 4444',
                'email' => 'carlos.rodriguez@email.com',
                'dni' => '23456789',
                'medio_contacto' => 'telefono',
                'estado' => 'interesado',
                'notas_contacto' => 'Busca apartamento para inversión'
            ],
            [
                'nombre' => 'Ana López',
                'telefono' => '+57 315 555 6666',
                'email' => null,
                'dni' => '34567890',
                'medio_contacto' => 'presencial',
                'estado' => 'contactado',
                'notas_contacto' => 'Visitó oficina presencialmente'
            ]
        ];

        foreach ($sampleClients as $clientData) {
            // Verificar si ya existe por teléfono o DNI
            $existingClient = \App\Models\Cliente::where('telefono', $clientData['telefono'])
                ->orWhere('dni', $clientData['dni'])
                ->first();

            if (!$existingClient) {
                \App\Models\Cliente::create([
                    'asesor_id' => $asesor->id,
                    'usuario_id' => null, // Sin usuario registrado aún
                    'dni' => $clientData['dni'],
                    'nombre' => $clientData['nombre'],
                    'telefono' => $clientData['telefono'],
                    'email' => $clientData['email'],
                    'medio_contacto' => $clientData['medio_contacto'],
                    'estado' => $clientData['estado'],
                    'notas_contacto' => $clientData['notas_contacto'],
                    'fecha_registro' => now(),
                ]);
            }
        }

        $this->command->info('✅ 3 clientes de prueba creados para el asesor');
    }
}
