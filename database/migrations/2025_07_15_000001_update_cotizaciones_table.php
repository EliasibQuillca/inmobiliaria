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
        Schema::table('cotizaciones', function (Blueprint $table) {
            if (!Schema::hasColumn('cotizaciones', 'descuento')) {
                $table->decimal('descuento', 5, 2)->nullable()->after('monto');
            }
            if (!Schema::hasColumn('cotizaciones', 'fecha_validez')) {
                $table->date('fecha_validez')->after('fecha');
            }
            if (!Schema::hasColumn('cotizaciones', 'notas')) {
                $table->text('notas')->nullable()->after('estado');
            }
            if (!Schema::hasColumn('cotizaciones', 'condiciones')) {
                $table->text('condiciones')->nullable()->after('notas');
            }
            if (Schema::hasColumn('cotizaciones', 'tipo')) {
                $table->dropColumn('tipo');
            }
            if (Schema::hasColumn('cotizaciones', 'mensaje')) {
                $table->dropColumn('mensaje');
            }
            if (Schema::hasColumn('cotizaciones', 'telefono')) {
                $table->dropColumn('telefono');
            }
            if (Schema::hasColumn('cotizaciones', 'disponibilidad')) {
                $table->dropColumn('disponibilidad');
            }
            if (Schema::hasColumn('cotizaciones', 'preferencia_contacto')) {
                $table->dropColumn('preferencia_contacto');
            }
            // Modificar el enum para añadir 'vencida'
            if (Schema::hasColumn('cotizaciones', 'estado')) {
                $table->dropColumn('estado');
            }
            $table->enum('estado', ['pendiente', 'aprobada', 'rechazada', 'vencida'])->default('pendiente')->after('monto');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('cotizaciones', function (Blueprint $table) {
            $table->dropColumn(['descuento', 'fecha_validez', 'notas', 'condiciones']);

            // Restaurar columnas eliminadas
            $table->string('tipo')->nullable();
            $table->text('mensaje')->nullable();
            $table->string('telefono')->nullable();
            $table->json('disponibilidad')->nullable();
            $table->string('preferencia_contacto')->nullable();

            // Restaurar el enum original
            $table->dropColumn('estado');
            $table->enum('estado', ['pendiente', 'aceptada', 'rechazada'])->default('pendiente');
        });
    }
};
