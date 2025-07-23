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

class ReportesCompletosSeeder extends Seeder
{
    public function run(): void
    {
        DB::beginTransaction();

        try {
            $this->command->info('Iniciando seeder de reportes completos...');

            // Crear administrador
            $admin = $this->crearAdmin();

            // Crear asesores
            $asesores = $this->crearAsesores();

            // Crear clientes
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
     * @return array<Asesor>
     */
    private function crearAsesores(): array
    {
        $asesores = [];

        for ($i = 1; $i <= 5; $i++) {
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
     * @return array<Cliente>
     */
    private function crearClientes(): array
    {
        $clientes = [];

        for ($i = 1; $i <= 15; $i++) {
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
     * @return array<Propietario>
     */
    private function crearPropietarios(): array
    {
        $propietarios = [];

        for ($i = 1; $i <= 8; $i++) {
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
     * @param array<Propietario> $propietarios
     * @return array<Departamento>
     */
    private function crearDepartamentos(array $propietarios): array
    {
        $departamentosData = [
            [
                'codigo' => 'DEPT-001',
                'titulo' => 'Departamento Luxury Vista al Mar',
                'descripcion' => 'Hermoso departamento con vista panorámica al mar',
                'ubicacion' => 'Miraflores, Lima',
                'direccion' => 'Av. Malecón de la Reserva 123',
                'precio' => 450000,
                'dormitorios' => 3,
                'banos' => 2,
                'area_total' => 120,
                'estacionamientos' => 2,
                'estado' => 'disponible',
                'destacado' => true,
            ],
            [
                'codigo' => 'DEPT-002',
                'titulo' => 'Loft Moderno en San Isidro',
                'descripcion' => 'Loft moderno con acabados de primera',
                'ubicacion' => 'San Isidro, Lima',
                'direccion' => 'Av. Javier Prado Este 456',
                'precio' => 320000,
                'dormitorios' => 2,
                'banos' => 1,
                'area_total' => 80,
                'estacionamientos' => 1,
                'estado' => 'vendido',
                'destacado' => false,
            ],
            [
                'codigo' => 'DEPT-003',
                'titulo' => 'Penthouse Exclusivo',
                'descripcion' => 'Penthouse de lujo con terraza privada',
                'ubicacion' => 'La Molina, Lima',
                'direccion' => 'Calle Los Eucaliptos 789',
                'precio' => 750000,
                'dormitorios' => 4,
                'banos' => 3,
                'area_total' => 200,
                'estacionamientos' => 3,
                'estado' => 'vendido',
                'destacado' => true,
            ],
            [
                'codigo' => 'DEPT-004',
                'titulo' => 'Departamento Familiar',
                'descripcion' => 'Ideal para familias, cerca de colegios',
                'ubicacion' => 'Surco, Lima',
                'direccion' => 'Av. Primavera 234',
                'precio' => 280000,
                'dormitorios' => 3,
                'banos' => 2,
                'area_total' => 95,
                'estacionamientos' => 1,
                'estado' => 'reservado',
                'destacado' => false,
            ],
            [
                'codigo' => 'DEPT-005',
                'titulo' => 'Estudio Céntrico',
                'descripcion' => 'Estudio perfecto para profesionales',
                'ubicacion' => 'Lima Centro, Lima',
                'direccion' => 'Jr. de la Unión 567',
                'precio' => 180000,
                'dormitorios' => 1,
                'banos' => 1,
                'area_total' => 45,
                'estacionamientos' => 0,
                'estado' => 'vendido',
                'destacado' => false,
            ],
            [
                'codigo' => 'DEPT-006',
                'titulo' => 'Duplex Premium',
                'descripcion' => 'Duplex de dos niveles con jardín privado',
                'ubicacion' => 'San Borja, Lima',
                'direccion' => 'Av. San Luis 890',
                'precio' => 520000,
                'dormitorios' => 4,
                'banos' => 3,
                'area_total' => 160,
                'estacionamientos' => 2,
                'estado' => 'disponible',
                'destacado' => true,
            ]
        ];

        $departamentos = [];
        foreach ($departamentosData as $data) {
            $propietario = $propietarios[array_rand($propietarios)];
            $data['propietario_id'] = $propietario->getKey();

            $departamento = Departamento::firstOrCreate(
                ['codigo' => $data['codigo']],
                $data
            );

            $departamentos[] = $departamento;
        }

        $this->command->info('Departamentos creados: ' . count($departamentos));
        return $departamentos;
    }

    /**
     * @param array<Asesor> $asesores
     * @param array<Cliente> $clientes
     * @param array<Departamento> $departamentos
     */
    private function crearTransacciones(array $asesores, array $clientes, array $departamentos): void
    {
        $contadorVentas = 0;
        $contadorReservas = 0;

        foreach ($departamentos as $departamento) {
            // Solo crear transacciones para departamentos vendidos o reservados
            $estadoDep = $departamento->getAttribute('estado');
            if (!in_array($estadoDep, ['vendido', 'reservado'])) {
                continue;
            }

            $cliente = $clientes[array_rand($clientes)];
            $asesor = $asesores[array_rand($asesores)];
            $fechaCotizacion = Carbon::now()->subDays(rand(30, 180));
            $precioOriginal = (float) $departamento->getAttribute('precio');
            $descuento = rand(5000, 15000);
            $precioFinal = $precioOriginal - $descuento;

            // Crear cotización
            $cotizacion = Cotizacion::create([
                'cliente_id' => $cliente->getKey(),
                'asesor_id' => $asesor->getKey(),
                'departamento_id' => $departamento->getKey(),
                'fecha_cotizacion' => $fechaCotizacion,
                'precio_cotizado' => $precioOriginal,
                'precio_final' => $precioFinal,
                'descuento' => $descuento,
                'condiciones' => 'Financiamiento bancario disponible',
                'estado' => 'aprobada',
                'valida_hasta' => $fechaCotizacion->copy()->addDays(30),
                'notas' => 'Cotización aprobada por cliente'
            ]);

            // Crear reserva
            $fechaReserva = $fechaCotizacion->copy()->addDays(rand(3, 10));
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
                'condiciones' => 'Separación del 10%'
            ]);

            $contadorReservas++;

            // Si está vendido, crear venta
            if ($estadoDep === 'vendido') {
                $fechaVenta = $fechaReserva->copy()->addDays(rand(20, 40));
                Venta::create([
                    'reserva_id' => $reserva->getKey(),
                    'fecha_venta' => $fechaVenta,
                    'monto_final' => $precioFinal,
                    'documentos_entregados' => true
                ]);

                $contadorVentas++;
            }
        }

        $this->command->info("Reservas creadas: {$contadorReservas}");
        $this->command->info("Ventas creadas: {$contadorVentas}");
    }

    private function mostrarEstadisticas(): void
    {
        $this->command->info('=== ESTADÍSTICAS FINALES ===');
        $this->command->info('Usuarios: ' . User::count());
        $this->command->info('Asesores: ' . Asesor::count());
        $this->command->info('Clientes: ' . Cliente::count());
        $this->command->info('Propietarios: ' . Propietario::count());
        $this->command->info('Departamentos: ' . Departamento::count());
        $this->command->info('Cotizaciones: ' . Cotizacion::count());
        $this->command->info('Reservas: ' . Reserva::count());
        $this->command->info('Ventas: ' . Venta::count());
        $this->command->info('===============================');
    }
}
