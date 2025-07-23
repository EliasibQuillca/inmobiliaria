<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Cliente;
use App\Models\Asesor;
use App\Models\Propietario;
use App\Models\Departamento;
use App\Models\Cotizacion;
use App\Models\Reserva;
use App\Models\Venta;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class InmobiliariaSeeder extends Seeder
{
    public function run(): void
    {
        DB::beginTransaction();

        try {
            $this->command->info('Iniciando seeder de inmobiliaria...');

            // Crear datos mínimos para testing
            $admin = $this->crearAdmin();
            $asesores = $this->crearAsesoresMinimos();
            $clientes = $this->crearClientesMinimos();
            $propietarios = $this->crearPropietariosMinimos();
            $departamentos = $this->crearDepartamentosMinimos($propietarios);

            // Crear algunas transacciones básicas
            $this->crearTransaccionesMinimas($asesores, $clientes, $departamentos);

            DB::commit();
            $this->mostrarEstadisticas();

        } catch (\Exception $e) {
            DB::rollback();
            $this->command->error('Error en seeder simple: ' . $e->getMessage());
            throw $e;
        }
    }

    private function crearAdmin(): User
    {
        return User::firstOrCreate(
            ['email' => 'admin@inmobiliaria.com'],
            [
                'name' => 'Administrador Principal',
                'password' => bcrypt('admin123'),
                'role' => 'administrador',
                'telefono' => '555-0001'
            ]
        );
    }

    /**
     * @return array<int, Asesor>
     */
    private function crearAsesoresMinimos(): array
    {
        $asesores = [];

        for ($i = 1; $i <= 2; $i++) {
            $user = User::firstOrCreate(
                ['email' => "asesor{$i}@inmobiliaria.com"],
                [
                    'name' => "Asesor {$i}",
                    'password' => bcrypt('asesor123'),
                    'role' => 'asesor',
                    'telefono' => "555-010{$i}"
                ]
            );

            $asesor = Asesor::firstOrCreate(
                ['usuario_id' => $user->getKey()],
                [
                    'fecha_contrato' => Carbon::now()->subMonths(rand(6, 18)),
                    'nombre' => "Asesor {$i}",
                    'apellidos' => "Apellido {$i}",
                    'telefono' => "555-010{$i}",
                    'documento' => "7654321{$i}",
                    'direccion' => "Calle Asesor {$i}",
                    'fecha_nacimiento' => Carbon::now()->subYears(rand(28, 40)),
                    'especialidad' => ['residencial', 'comercial'][rand(0, 1)],
                    'experiencia' => rand(2, 8),
                    'biografia' => "Asesor simple con experiencia básica",
                    'estado' => 'activo',
                    'comision_porcentaje' => 5.0
                ]
            );

            $asesores[] = $asesor;
        }

        $this->command->info('Asesores mínimos creados: ' . count($asesores));
        return $asesores;
    }

    /**
     * @return array<int, Cliente>
     */
    private function crearClientesMinimos(): array
    {
        $clientes = [];

        for ($i = 1; $i <= 5; $i++) {
            $user = User::firstOrCreate(
                ['email' => "cliente{$i}@example.com"],
                [
                    'name' => "Cliente Simple {$i}",
                    'password' => bcrypt('cliente123'),
                    'role' => 'cliente',
                    'telefono' => "555-020{$i}"
                ]
            );

            $cliente = Cliente::firstOrCreate(
                ['usuario_id' => $user->getKey()],
                [
                    'dni' => "1234567{$i}",
                    'direccion' => "Dirección Cliente {$i}",
                    'fecha_registro' => Carbon::now()->subDays(rand(5, 60))
                ]
            );

            $clientes[] = $cliente;
        }

        $this->command->info('Clientes mínimos creados: ' . count($clientes));
        return $clientes;
    }

    /**
     * @return array<int, Propietario>
     */
    private function crearPropietariosMinimos(): array
    {
        $propietarios = [];

        for ($i = 1; $i <= 3; $i++) {
            $propietario = Propietario::firstOrCreate(
                ['dni' => "9876543{$i}"],
                [
                    'nombre' => "Propietario {$i} Apellido {$i}",
                    'dni' => "9876543{$i}",
                    'tipo' => 'natural',
                    'contacto' => "555-030{$i}",
                    'direccion' => "Dirección Propietario {$i}",
                    'registrado_sunarp' => true
                ]
            );

            $propietarios[] = $propietario;
        }

        $this->command->info('Propietarios mínimos creados: ' . count($propietarios));
        return $propietarios;
    }

    /**
     * @param array<int, Propietario> $propietarios
     * @return array<int, Departamento>
     */
    private function crearDepartamentosMinimos(array $propietarios): array
    {
        $departamentos = [];

        for ($i = 1; $i <= 5; $i++) {
            $precio = rand(200000, 400000);
            $propietario = $propietarios[rand(0, count($propietarios) - 1)];

            $departamento = Departamento::firstOrCreate(
                ['codigo' => "SIM-" . str_pad($i, 3, '0', STR_PAD_LEFT)],
                [
                    'titulo' => "Departamento Simple {$i}",
                    'descripcion' => "Departamento básico para testing {$i}",
                    'ubicacion' => "Zona Simple {$i}",
                    'direccion' => "Calle Simple {$i}",
                    'precio' => $precio,
                    'precio_anterior' => $precio + rand(5000, 15000),
                    'dormitorios' => rand(2, 3),
                    'banos' => rand(1, 2),
                    'area_total' => rand(70, 120),
                    'estacionamientos' => rand(1, 2),
                    'estado' => 'disponible',
                    'disponible' => true,
                    'propietario_id' => $propietario->getKey(),
                    'destacado' => false,
                ]
            );

            $departamentos[] = $departamento;
        }

        $this->command->info('Departamentos mínimos creados: ' . count($departamentos));
        return $departamentos;
    }

    /**
     * @param array<int, Asesor> $asesores
     * @param array<int, Cliente> $clientes
     * @param array<int, Departamento> $departamentos
     */
    private function crearTransaccionesMinimas(array $asesores, array $clientes, array $departamentos): void
    {
        if (count($asesores) === 0 || count($clientes) === 0 || count($departamentos) === 0) {
            $this->command->warn('No hay datos suficientes para crear transacciones');
            return;
        }

        $contadorTotal = 0;

        // Crear solo 3 transacciones completas para testing
        for ($i = 0; $i < 3; $i++) {
            $fechaCotizacion = Carbon::now()->subDays(rand(5, 30));
            $asesor = $asesores[rand(0, count($asesores) - 1)];
            $cliente = $clientes[rand(0, count($clientes) - 1)];
            $departamento = $departamentos[rand(0, count($departamentos) - 1)];

            $precioOriginal = (float) $departamento->getAttribute('precio');
            $descuento = rand(50, 999); // Ajustado para no exceder decimal(5,2)
            $precioFinal = $precioOriginal - $descuento;

            // Crear cotización
            $cotizacion = Cotizacion::create([
                'cliente_id' => $cliente->getKey(),
                'asesor_id' => $asesor->getKey(),
                'departamento_id' => $departamento->getKey(),
                'fecha' => $fechaCotizacion,
                'monto' => $precioFinal,
                'descuento' => $descuento,
                'fecha_validez' => $fechaCotizacion->copy()->addDays(30),
                'estado' => 'aprobada',
                'notas' => 'Cotización simple para testing',
                'condiciones' => 'Condiciones simples de testing'
            ]);

            // Crear reserva
            $fechaReserva = $fechaCotizacion->copy()->addDays(rand(2, 5));
            $reserva = Reserva::create([
                'cotizacion_id' => $cotizacion->getKey(),
                'cliente_id' => $cliente->getKey(),
                'asesor_id' => $asesor->getKey(),
                'departamento_id' => $departamento->getKey(),
                'fecha_reserva' => $fechaReserva,
                'fecha_inicio' => $fechaReserva->copy()->addDays(2),
                'fecha_fin' => $fechaReserva->copy()->addDays(30),
                'monto_reserva' => $precioFinal * 0.1,
                'monto_total' => $precioFinal,
                'estado' => 'activa',
                'notas' => 'Reserva simple',
                'condiciones' => 'Reserva básica'
            ]);

            // Crear venta (solo para el primer caso)
            if ($i === 0) {
                $fechaVenta = $fechaReserva->copy()->addDays(rand(15, 25));
                Venta::create([
                    'reserva_id' => $reserva->getKey(),
                    'fecha_venta' => $fechaVenta,
                    'monto_final' => $precioFinal,
                    'documentos_entregados' => true
                ]);
            }

            $contadorTotal++;
        }

        $this->command->info("Transacciones simples creadas: {$contadorTotal}");
    }

    private function mostrarEstadisticas(): void
    {
        $this->command->info('=== ESTADÍSTICAS SEEDER SIMPLE ===');
        $this->command->info('Usuarios: ' . User::count());
        $this->command->info('Asesores: ' . Asesor::count());
        $this->command->info('Clientes: ' . Cliente::count());
        $this->command->info('Departamentos: ' . Departamento::count());
        $this->command->info('Cotizaciones: ' . Cotizacion::count());
        $this->command->info('Reservas: ' . Reserva::count());
        $this->command->info('Ventas: ' . Venta::count());
        $this->command->info('==================================');
    }
}
