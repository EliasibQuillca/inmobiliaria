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

class SimulacionReportesSeeder extends Seeder
{
    public function run(): void
    {
        DB::beginTransaction();

        try {
            $this->command->info('Iniciando simulación de reportes...');

            // Obtener datos existentes o crearlos
            $asesores = $this->obtenerAsesores();
            $clientes = $this->obtenerClientes();
            $departamentos = $this->obtenerDepartamentos();

            if (count($asesores) === 0 || count($clientes) === 0 || count($departamentos) === 0) {
                $this->command->warn('No hay datos base suficientes. Ejecute primero otros seeders.');
                return;
            }

            // Crear simulación de transacciones de diferentes períodos
            $this->simularTransaccionesMes($asesores, $clientes, $departamentos);
            $this->simularTransaccionesTrimestre($asesores, $clientes, $departamentos);
            $this->simularTransaccionesAno($asesores, $clientes, $departamentos);

            DB::commit();
            $this->mostrarEstadisticas();

        } catch (\Exception $e) {
            DB::rollback();
            $this->command->error('Error en simulación: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * @return array<int, Asesor>
     */
    private function obtenerAsesores(): array
    {
        return Asesor::all()->toArray();
    }

    /**
     * @return array<int, Cliente>
     */
    private function obtenerClientes(): array
    {
        return Cliente::all()->toArray();
    }

    /**
     * @return array<int, Departamento>
     */
    private function obtenerDepartamentos(): array
    {
        return Departamento::all()->toArray();
    }

    /**
     * @param array<int, Asesor> $asesores
     * @param array<int, Cliente> $clientes
     * @param array<int, Departamento> $departamentos
     */
    private function simularTransaccionesMes(array $asesores, array $clientes, array $departamentos): void
    {
        $this->command->info('Simulando transacciones del último mes...');

        for ($i = 0; $i < 8; $i++) {
            $fechaBase = Carbon::now()->subDays(rand(1, 30));
            $this->crearTransaccionCompleta($asesores, $clientes, $departamentos, $fechaBase, 'mes');
        }
    }

    /**
     * @param array<int, Asesor> $asesores
     * @param array<int, Cliente> $clientes
     * @param array<int, Departamento> $departamentos
     */
    private function simularTransaccionesTrimestre(array $asesores, array $clientes, array $departamentos): void
    {
        $this->command->info('Simulando transacciones del trimestre...');

        for ($i = 0; $i < 12; $i++) {
            $fechaBase = Carbon::now()->subDays(rand(31, 90));
            $this->crearTransaccionCompleta($asesores, $clientes, $departamentos, $fechaBase, 'trimestre');
        }
    }

    /**
     * @param array<int, Asesor> $asesores
     * @param array<int, Cliente> $clientes
     * @param array<int, Departamento> $departamentos
     */
    private function simularTransaccionesAno(array $asesores, array $clientes, array $departamentos): void
    {
        $this->command->info('Simulando transacciones del año...');

        for ($i = 0; $i < 20; $i++) {
            $fechaBase = Carbon::now()->subDays(rand(91, 365));
            $this->crearTransaccionCompleta($asesores, $clientes, $departamentos, $fechaBase, 'año');
        }
    }

    /**
     * @param array<int, Asesor> $asesores
     * @param array<int, Cliente> $clientes
     * @param array<int, Departamento> $departamentos
     * @param Carbon $fechaBase
     * @param string $periodo
     */
    private function crearTransaccionCompleta(array $asesores, array $clientes, array $departamentos, Carbon $fechaBase, string $periodo): void
    {
        $asesor = $asesores[rand(0, count($asesores) - 1)];
        $cliente = $clientes[rand(0, count($clientes) - 1)];
        $departamento = $departamentos[rand(0, count($departamentos) - 1)];

        // Obtener instancias de Eloquent usando los IDs
        $asesorModel = Asesor::find($asesor['id']);
        $clienteModel = Cliente::find($cliente['id']);
        $departamentoModel = Departamento::find($departamento['id']);

        if (!$asesorModel || !$clienteModel || !$departamentoModel) {
            return;
        }

        $precioOriginal = (float) $departamentoModel->getAttribute('precio');
        $descuento = rand(10000, 30000);
        $precioFinal = $precioOriginal - $descuento;

        // Crear cotización
        $cotizacion = Cotizacion::create([
            'cliente_id' => $clienteModel->getKey(),
            'asesor_id' => $asesorModel->getKey(),
            'departamento_id' => $departamentoModel->getKey(),
            'fecha_cotizacion' => $fechaBase,
            'precio_cotizado' => $precioOriginal,
            'precio_final' => $precioFinal,
            'descuento' => $descuento,
            'condiciones' => "Simulación para reportes de {$periodo}",
            'estado' => 'aprobada',
            'valida_hasta' => $fechaBase->copy()->addDays(30),
            'notas' => "Cotización simulada - {$periodo}"
        ]);

        // 75% de probabilidad de reserva
        if (rand(1, 100) <= 75) {
            $fechaReserva = $fechaBase->copy()->addDays(rand(2, 7));

            $reserva = Reserva::create([
                'cotizacion_id' => $cotizacion->getKey(),
                'cliente_id' => $clienteModel->getKey(),
                'asesor_id' => $asesorModel->getKey(),
                'departamento_id' => $departamentoModel->getKey(),
                'fecha_reserva' => $fechaReserva,
                'fecha_inicio' => $fechaReserva->copy()->addDays(3),
                'fecha_fin' => $fechaReserva->copy()->addDays(45),
                'monto_reserva' => $precioFinal * 0.1,
                'monto_total' => $precioFinal,
                'estado' => 'confirmada',
                'notas' => "Reserva simulada - {$periodo}",
                'condiciones' => 'Simulación de reserva estándar'
            ]);

            // 60% de probabilidad de venta
            if (rand(1, 100) <= 60) {
                $fechaVenta = $fechaReserva->copy()->addDays(rand(15, 35));

                Venta::create([
                    'reserva_id' => $reserva->getKey(),
                    'fecha_venta' => $fechaVenta,
                    'monto_final' => $precioFinal,
                    'documentos_entregados' => rand(0, 1) === 1
                ]);

                // Actualizar estado del departamento
                $departamentoModel->update(['estado' => 'vendido']);
            }
        }
    }

    private function mostrarEstadisticas(): void
    {
        $this->command->info('=== ESTADÍSTICAS SIMULACIÓN ===');
        $this->command->info('Total Cotizaciones: ' . Cotizacion::count());
        $this->command->info('Total Reservas: ' . Reserva::count());
        $this->command->info('Total Ventas: ' . Venta::count());

        // Estadísticas por periodo
        $ventasMes = Venta::whereHas('reserva', function($q) {
            $q->where('fecha_venta', '>=', Carbon::now()->subDays(30));
        })->count();

        $ventasTrimestre = Venta::whereHas('reserva', function($q) {
            $q->where('fecha_venta', '>=', Carbon::now()->subDays(90));
        })->count();

        $this->command->info("Ventas último mes: {$ventasMes}");
        $this->command->info("Ventas último trimestre: {$ventasTrimestre}");
        $this->command->info('===============================');
    }
}
