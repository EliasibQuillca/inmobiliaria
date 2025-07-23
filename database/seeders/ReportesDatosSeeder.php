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

class ReportesDatosSeeder extends Seeder
{
    public function run(): void
    {
        DB::beginTransaction();

        try {
            $this->command->info('Iniciando seeder con datos reales...');

            // Crear usuarios administradores
            $admin = $this->crearAdmin();

            // Crear usuarios asesores
            $asesores = $this->crearAsesores();

            // Crear usuarios clientes
            $clientes = $this->crearClientes();

            // Crear propietarios
            $propietarios = $this->crearPropietarios();

            // Crear departamentos
            $departamentos = $this->crearDepartamentos($propietarios);

            // Crear transacciones
            $this->crearTransacciones($asesores, $clientes, $departamentos);

            DB::commit();
            $this->mostrarEstadisticas();

        } catch (\Exception $e) {
            DB::rollback();
            $this->command->error('Error en el seeder: ' . $e->getMessage());
            throw $e;
        }
    }

    private function crearAdmin(): User
    {
        $admin = User::firstOrCreate(
            ['email' => 'admin@inmobiliaria.com'],
            [
                'name' => 'Administrador Principal',
                'password' => bcrypt('admin123'),
                'role' => 'administrador',
                'telefono' => '555-0001'
            ]
        );

        $this->command->info('Admin creado/encontrado');
        return $admin;
    }

    /**
     * @return array<int, Asesor>
     */
    private function crearAsesores(): array
    {
        $asesores = [];

        for ($i = 1; $i <= 3; $i++) {
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
                    'fecha_contrato' => Carbon::now()->subMonths(rand(1, 24)),
                    'nombre' => "Asesor {$i}",
                    'apellidos' => "Apellido {$i}",
                    'telefono' => "555-010{$i}",
                    'documento' => "7654321{$i}",
                    'direccion' => "Calle Asesor {$i}",
                    'fecha_nacimiento' => Carbon::now()->subYears(rand(25, 45)),
                    'especialidad' => ['residencial', 'comercial', 'lujo'][rand(0, 2)],
                    'experiencia' => rand(1, 10),
                    'biografia' => "Asesor especializado con {$i} años de experiencia",
                    'estado' => 'activo',
                    'comision_porcentaje' => 5.0
                ]
            );

            $asesores[] = $asesor;
        }

        $this->command->info('Asesores creados: ' . count($asesores));
        return $asesores;
    }

    /**
     * @return array<int, Cliente>
     */
    private function crearClientes(): array
    {
        $clientes = [];

        for ($i = 1; $i <= 10; $i++) {
            $user = User::firstOrCreate(
                ['email' => "cliente{$i}@gmail.com"],
                [
                    'name' => "Cliente {$i}",
                    'password' => bcrypt('cliente123'),
                    'role' => 'cliente',
                    'telefono' => "555-020{$i}"
                ]
            );

            $cliente = Cliente::firstOrCreate(
                ['usuario_id' => $user->getKey()],
                [
                    'dni' => "1234567{$i}",
                    'direccion' => "Calle Cliente {$i}",
                    'fecha_registro' => Carbon::now()->subDays(rand(1, 180))
                ]
            );

            $clientes[] = $cliente;
        }

        $this->command->info('Clientes creados: ' . count($clientes));
        return $clientes;
    }

    /**
     * @return array<int, Propietario>
     */
    private function crearPropietarios(): array
    {
        $propietarios = [];

        for ($i = 1; $i <= 5; $i++) {
            $propietario = Propietario::firstOrCreate(
                ['email' => "propietario{$i}@gmail.com"],
                [
                    'nombre' => "Propietario {$i}",
                    'apellidos' => "Apellido Prop {$i}",
                    'telefono' => "555-030{$i}",
                    'documento' => "9876543{$i}",
                    'direccion' => "Calle Propietario {$i}",
                    'fecha_nacimiento' => Carbon::now()->subYears(rand(35, 70)),
                    'estado' => 'activo'
                ]
            );

            $propietarios[] = $propietario;
        }

        $this->command->info('Propietarios creados: ' . count($propietarios));
        return $propietarios;
    }

    /**
     * @param array<int, Propietario> $propietarios
     * @return array<int, Departamento>
     */
    private function crearDepartamentos(array $propietarios): array
    {
        $departamentos = [];

        for ($i = 1; $i <= 15; $i++) {
            $precio = rand(200000, 800000);
            $estado = ['disponible', 'reservado', 'vendido'][rand(0, 2)];
            $propietario = $propietarios[rand(0, count($propietarios) - 1)];

            $departamento = Departamento::firstOrCreate(
                ['codigo' => "DEPT-" . str_pad($i, 3, '0', STR_PAD_LEFT)],
                [
                    'titulo' => "Departamento Moderno {$i}",
                    'descripcion' => "Hermoso departamento con vista panorámica y acabados de lujo {$i}",
                    'ubicacion' => "Zona Premium {$i}",
                    'direccion' => "Avenida Principal {$i}, Torre {$i}",
                    'precio' => $precio,
                    'precio_anterior' => $precio + rand(10000, 50000),
                    'dormitorios' => rand(1, 4),
                    'banos' => rand(1, 3),
                    'area_total' => rand(60, 200),
                    'estacionamientos' => rand(1, 2),
                    'estado' => $estado,
                    'disponible' => $estado === 'disponible',
                    'propietario_id' => $propietario->getKey(),
                    'destacado' => rand(0, 1) === 1,
                ]
            );

            $departamentos[] = $departamento;
        }

        $this->command->info('Departamentos creados: ' . count($departamentos));
        return $departamentos;
    }

    /**
     * @param array<int, Asesor> $asesores
     * @param array<int, Cliente> $clientes
     * @param array<int, Departamento> $departamentos
     */
    private function crearTransacciones(array $asesores, array $clientes, array $departamentos): void
    {
        if (count($asesores) === 0 || count($clientes) === 0 || count($departamentos) === 0) {
            $this->command->warn('No hay datos suficientes para crear transacciones');
            return;
        }

        $contadorCotizaciones = 0;
        $contadorReservas = 0;
        $contadorVentas = 0;

        for ($i = 0; $i < 20; $i++) {
            $fechaCotizacion = Carbon::now()->subDays(rand(0, 180));
            $asesor = $asesores[rand(0, count($asesores) - 1)];
            $cliente = $clientes[rand(0, count($clientes) - 1)];
            $departamento = $departamentos[rand(0, count($departamentos) - 1)];

            $precioOriginal = (float) $departamento->getAttribute('precio');
            $descuento = rand(5000, 20000);
            $precioFinal = $precioOriginal - $descuento;

            $cotizacion = Cotizacion::create([
                'cliente_id' => $cliente->getKey(),
                'asesor_id' => $asesor->getKey(),
                'departamento_id' => $departamento->getKey(),
                'fecha_cotizacion' => $fechaCotizacion,
                'precio_cotizado' => $precioOriginal,
                'precio_final' => $precioFinal,
                'descuento' => $descuento,
                'condiciones' => 'Condiciones estándar de venta',
                'estado' => 'aprobada',
                'valida_hasta' => $fechaCotizacion->copy()->addDays(30),
                'notas' => 'Cotización generada automáticamente'
            ]);

            $contadorCotizaciones++;

            // 70% de las cotizaciones se convierten en reservas
            if (rand(1, 100) <= 70) {
                $fechaReserva = $fechaCotizacion->copy()->addDays(rand(1, 10));

                $reserva = Reserva::create([
                    'cotizacion_id' => $cotizacion->getKey(),
                    'cliente_id' => $cliente->getKey(),
                    'asesor_id' => $asesor->getKey(),
                    'departamento_id' => $departamento->getKey(),
                    'fecha_reserva' => $fechaReserva,
                    'fecha_inicio' => $fechaReserva->copy()->addDays(5),
                    'fecha_fin' => $fechaReserva->copy()->addDays(45),
                    'monto_reserva' => $precioFinal * 0.1,
                    'monto_total' => $precioFinal,
                    'estado' => 'confirmada',
                    'notas' => 'Reserva confirmada',
                    'condiciones' => 'Condiciones estándar de reserva'
                ]);

                $contadorReservas++;

                // 60% de las reservas se convierten en ventas
                if (rand(1, 100) <= 60) {
                    $fechaVenta = $fechaReserva->copy()->addDays(rand(15, 40));

                    Venta::create([
                        'reserva_id' => $reserva->getKey(),
                        'fecha_venta' => $fechaVenta,
                        'monto_final' => $precioFinal,
                        'documentos_entregados' => rand(0, 1) === 1
                    ]);

                    $contadorVentas++;

                    // Marcar departamento como vendido
                    $departamento->update(['estado' => 'vendido']);
                }
            }
        }

        $this->command->info("Cotizaciones creadas: {$contadorCotizaciones}");
        $this->command->info("Reservas creadas: {$contadorReservas}");
        $this->command->info("Ventas creadas: {$contadorVentas}");
    }

    private function mostrarEstadisticas(): void
    {
        $this->command->info('=== ESTADÍSTICAS FINALES ===');
        $this->command->info('Usuarios: ' . User::count());
        $this->command->info('Asesores: ' . Asesor::count());
        $this->command->info('Clientes: ' . Cliente::count());
        $this->command->info('Departamentos: ' . Departamento::count());
        $this->command->info('Cotizaciones: ' . Cotizacion::count());
        $this->command->info('Reservas: ' . Reserva::count());
        $this->command->info('Ventas: ' . Venta::count());
        $this->command->info('===============================');
    }
}
