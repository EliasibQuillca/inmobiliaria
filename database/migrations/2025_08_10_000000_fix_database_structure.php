<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // === VERIFICAR Y CORREGIR ESTRUCTURA DE RESERVAS ===
        if (Schema::hasTable('reservas')) {
            // Verificar que tenga todos los campos necesarios
            Schema::table('reservas', function (Blueprint $table) {
                if (!Schema::hasColumn('reservas', 'asesor_id')) {
                    $table->foreignId('asesor_id')->after('cotizacion_id')
                          ->constrained('asesores')->onUpdate('cascade')->onDelete('restrict');
                }
                if (!Schema::hasColumn('reservas', 'departamento_id')) {
                    $table->foreignId('departamento_id')->after('asesor_id')
                          ->constrained('departamentos')->onUpdate('cascade')->onDelete('restrict');
                }
                if (!Schema::hasColumn('reservas', 'cliente_id')) {
                    $table->foreignId('cliente_id')->after('departamento_id')
                          ->constrained('clientes')->onUpdate('cascade')->onDelete('restrict');
                }
                if (!Schema::hasColumn('reservas', 'fecha_inicio')) {
                    $table->date('fecha_inicio')->after('fecha_reserva');
                }
                if (!Schema::hasColumn('reservas', 'fecha_fin')) {
                    $table->date('fecha_fin')->after('fecha_inicio');
                }
                if (!Schema::hasColumn('reservas', 'monto_reserva')) {
                    $table->decimal('monto_reserva', 12, 2)->after('fecha_fin');
                }
                if (!Schema::hasColumn('reservas', 'monto_total')) {
                    $table->decimal('monto_total', 12, 2)->after('monto_reserva');
                }
                if (!Schema::hasColumn('reservas', 'estado')) {
                    $table->enum('estado', ['activa', 'confirmada', 'cancelada', 'completada'])->default('activa')->after('monto_total');
                }
                if (!Schema::hasColumn('reservas', 'notas')) {
                    $table->text('notas')->nullable()->after('estado');
                }
                if (!Schema::hasColumn('reservas', 'condiciones')) {
                    $table->text('condiciones')->nullable()->after('notas');
                }
            });
        }

        // === VERIFICAR Y CORREGIR ESTRUCTURA DE VENTAS ===
        if (Schema::hasTable('ventas')) {
            Schema::table('ventas', function (Blueprint $table) {
                if (!Schema::hasColumn('ventas', 'documentos_entregados')) {
                    $table->boolean('documentos_entregados')->default(false)->after('monto_final');
                }
                if (!Schema::hasColumn('ventas', 'observaciones')) {
                    $table->text('observaciones')->nullable()->after('documentos_entregados');
                }
            });
        }

        // === VERIFICAR ESTRUCTURA DE DEPARTAMENTOS ===
        if (Schema::hasTable('departamentos')) {
            Schema::table('departamentos', function (Blueprint $table) {
                if (!Schema::hasColumn('departamentos', 'disponible')) {
                    $table->boolean('disponible')->default(true)->after('estado');
                }
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // No hacer rollback automático para evitar pérdida de datos
        // Los campos agregados son opcionales y no deberían causar problemas
    }
};
