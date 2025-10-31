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
            // Agregar campos necesarios para solicitudes de clientes
            $table->enum('tipo_solicitud', ['informacion', 'visita', 'financiamiento', 'cotizacion'])
                ->default('informacion')
                ->after('cliente_id');

            $table->text('mensaje_solicitud')
                ->nullable()
                ->after('tipo_solicitud');

            $table->string('telefono_contacto')
                ->nullable()
                ->after('mensaje_solicitud');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('cotizaciones', function (Blueprint $table) {
            // Verificar si las columnas existen antes de intentar eliminarlas
            if (Schema::hasColumn('cotizaciones', 'tipo_solicitud')) {
                $table->dropColumn('tipo_solicitud');
            }
            if (Schema::hasColumn('cotizaciones', 'mensaje_solicitud')) {
                $table->dropColumn('mensaje_solicitud');
            }
            if (Schema::hasColumn('cotizaciones', 'telefono_contacto')) {
                $table->dropColumn('telefono_contacto');
            }
        });
    }
};
