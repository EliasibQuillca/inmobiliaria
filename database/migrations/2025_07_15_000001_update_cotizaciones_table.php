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
            $table->decimal('descuento', 5, 2)->nullable()->after('monto');
            $table->date('fecha_validez')->after('fecha');
            $table->text('notas')->nullable()->after('estado');
            $table->text('condiciones')->nullable()->after('notas');
            $table->dropColumn('tipo');
            $table->dropColumn('mensaje');
            $table->dropColumn('telefono');
            $table->dropColumn('disponibilidad');
            $table->dropColumn('preferencia_contacto');

            // Modificar el enum para añadir 'vencida'
            $table->dropColumn('estado');
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
