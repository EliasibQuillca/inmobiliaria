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
        Schema::table('reservas', function (Blueprint $table) {
            // Eliminar restricción de unicidad y hacerla nullable
            $table->dropForeign(['cotizacion_id']);
            $table->dropColumn('cotizacion_id');

            // Añadir nuevamente cotizacion_id como nullable
            $table->foreignId('cotizacion_id')->nullable()->after('id')
                  ->constrained('cotizaciones')->onUpdate('cascade')->onDelete('set null');

            // Agregar nuevos campos
            $table->foreignId('cliente_id')->after('cotizacion_id')
                  ->constrained('clientes')->onUpdate('cascade')->onDelete('restrict');
            $table->foreignId('asesor_id')->after('cliente_id')
                  ->constrained('asesores')->onUpdate('cascade')->onDelete('restrict');
            $table->foreignId('departamento_id')->after('asesor_id')
                  ->constrained('departamentos')->onUpdate('cascade')->onDelete('restrict');
            $table->date('fecha_inicio')->after('fecha_reserva');
            $table->date('fecha_fin')->after('fecha_inicio');
            $table->decimal('monto_reserva', 12, 2)->after('fecha_fin');
            $table->decimal('monto_total', 12, 2)->after('monto_reserva');
            $table->enum('estado', ['activa', 'cancelada', 'completada'])->default('activa')->after('monto_total');
            $table->text('notas')->nullable()->after('estado');
            $table->text('condiciones')->nullable()->after('notas');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('reservas', function (Blueprint $table) {
            // Eliminar nuevos campos
            $table->dropForeign(['cliente_id']);
            $table->dropForeign(['asesor_id']);
            $table->dropForeign(['departamento_id']);
            $table->dropColumn([
                'cliente_id',
                'asesor_id',
                'departamento_id',
                'fecha_inicio',
                'fecha_fin',
                'monto_reserva',
                'monto_total',
                'estado',
                'notas',
                'condiciones'
            ]);

            // Eliminar cotizacion_id nullable
            $table->dropForeign(['cotizacion_id']);
            $table->dropColumn('cotizacion_id');

            // Restaurar cotizacion_id original
            $table->foreignId('cotizacion_id')->after('id')
                  ->unique()->constrained('cotizaciones')->onUpdate('cascade')->onDelete('restrict');
        });
    }
};
