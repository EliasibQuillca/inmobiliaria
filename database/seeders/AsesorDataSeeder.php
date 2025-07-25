<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Asesor;
use App\Models\Cliente;
use App\Models\Departamento;
use App\Models\Cotizacion;
use App\Models\Reserva;
use App\Models\Venta;
use Illuminate\Support\Facades\Hash;

class AsesorDataSeeder extends Seeder
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
        }

        // Crear algunos departamentos de prueba
        $departamentos = [];
        for ($i = 1; $i <= 5; $i++) {
            $departamentos[] = Departamento::create([
                'nombre' => "Apartamento Premium $i",
                'descripcion' => "Moderno apartamento de $i dormitorios con acabados de lujo",
                'precio' => 150000000 + ($i * 20000000),
                'habitaciones' => $i <= 3 ? $i + 1 : 3,
                'baños' => $i <= 3 ? $i : 2,
                'area' => 80 + ($i * 20),
                'ubicacion' => "Torre $i, Zona Norte",
                'disponible' => true,
                'estado' => 'disponible',
                'propietario_id' => 1, // Asumiendo que existe
            ]);
        }

        // Crear clientes de prueba
        $clientes = [];
        for ($i = 1; $i <= 10; $i++) {
            $email = "cliente$i@email.com";

            // Verificar si ya existe el usuario cliente
            $userCliente = User::where('email', $email)->first();

            if (!$userCliente) {
                $userCliente = User::create([
                    'name' => "Cliente $i",
                    'email' => $email,
                    'password' => Hash::make('123456'),
                    'role' => 'cliente',
                    'telefono' => "+57 310 000 000$i",
                    'estado' => 'activo',
                ]);
            }

            // Verificar si ya existe el cliente
            $cliente = Cliente::where('user_id', $userCliente->id)->first();

            if (!$cliente) {
                $clientes[] = Cliente::create([
                    'user_id' => $userCliente->id,
                    'asesor_id' => $asesor->id,
                    'nombre' => "Cliente Número $i",
                    'telefono' => "+57 310 000 000$i",
                    'email' => $email,
                    'departamento_interes' => $departamentos[($i - 1) % 5]->id,
                    'notas_contacto' => "Cliente interesado contactado vía WhatsApp",
                    'medio_contacto' => ['whatsapp', 'telefono', 'presencial'][($i - 1) % 3],
                    'estado' => ['contactado', 'interesado', 'sin_interes'][($i - 1) % 3],
                    'notas_seguimiento' => "Seguimiento realizado el " . now()->subDays($i)->format('Y-m-d'),
                ]);
            } else {
                $clientes[] = $cliente;
            }
        }

        // Limpiar datos existentes del asesor para evitar duplicados
        Venta::whereHas('reserva', function($query) use ($asesor) {
            $query->where('asesor_id', $asesor->id);
        })->delete();

        Reserva::where('asesor_id', $asesor->id)->delete();
        Cotizacion::where('asesor_id', $asesor->id)->delete();

        // Crear cotizaciones de prueba
        $cotizaciones = [];
        for ($i = 1; $i <= 8; $i++) {
            $departamento = $departamentos[($i - 1) % 5];
            $cliente = $clientes[($i - 1) % 10];

            $cotizaciones[] = Cotizacion::create([
                'asesor_id' => $asesor->id,
                'cliente_id' => $cliente->id,
                'departamento_id' => $departamento->id,
                'fecha' => now()->subDays($i * 2),
                'monto' => $departamento->precio,
                'descuento' => $i % 3 == 0 ? 2000000 : 0,
                'fecha_validez' => now()->addDays(30 - $i),
                'estado' => ['pendiente', 'aceptada', 'rechazada'][($i - 1) % 3],
                'notas' => "Cotización para apartamento de {$departamento->habitaciones} habitaciones",
                'condiciones' => 'Financiación disponible hasta 20 años. Se requiere cuota inicial del 30%.',
            ]);
        }

        // Crear reservas de prueba (solo para cotizaciones aceptadas)
        $reservas = [];
        $cotizacionesAceptadas = array_filter($cotizaciones, fn($c) => $c->estado === 'aceptada');

        foreach (array_slice($cotizacionesAceptadas, 0, 4) as $i => $cotizacion) {
            $reservas[] = Reserva::create([
                'cotizacion_id' => $cotizacion->id,
                'cliente_id' => $cotizacion->cliente_id,
                'asesor_id' => $asesor->id,
                'departamento_id' => $cotizacion->departamento_id,
                'fecha_reserva' => now()->subDays($i * 3),
                'fecha_inicio' => now()->addDays(30),
                'fecha_fin' => now()->addDays(60),
                'monto_reserva' => $cotizacion->monto * 0.1, // 10% de reserva
                'monto_total' => $cotizacion->monto - $cotizacion->descuento,
                'estado' => ['pendiente', 'confirmada'][($i) % 2],
                'notas' => "Reserva confirmada para entrega en 60 días",
            ]);
        }

        // Crear ventas de prueba (solo para reservas confirmadas)
        $reservasConfirmadas = array_filter($reservas, fn($r) => $r->estado === 'confirmada');

        foreach (array_slice($reservasConfirmadas, 0, 2) as $i => $reserva) {
            Venta::create([
                'reserva_id' => $reserva->id,
                'fecha_venta' => now()->subDays($i * 7),
                'monto_final' => $reserva->monto_total,
                'documentos_entregados' => $i == 0, // Solo la primera tiene documentos entregados
                'observaciones' => $i == 0
                    ? 'Venta finalizada exitosamente. Cliente muy satisfecho.'
                    : 'Venta completada. Pendiente entrega de documentos físicos.',
            ]);
        }

        // Actualizar estado de departamentos vendidos
        if (isset($reservasConfirmadas[0])) {
            $departamentoVendido = Departamento::find($reservasConfirmadas[0]->departamento_id);
            if ($departamentoVendido) {
                $departamentoVendido->update([
                    'estado' => 'vendido',
                    'disponible' => false
                ]);
            }
        }

        $this->command->info('✅ Datos de prueba del asesor creados exitosamente:');
        $this->command->info("   - 1 Usuario asesor: {$userAsesor->email} / 123456");
        $this->command->info("   - 10 Clientes con diferentes estados");
        $this->command->info("   - 5 Departamentos disponibles");
        $this->command->info("   - 8 Cotizaciones (pendientes, aceptadas, rechazadas)");
        $this->command->info("   - 4 Reservas (pendientes y confirmadas)");
        $this->command->info("   - 2 Ventas (1 con documentos entregados)");
    }
}
