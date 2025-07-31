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
            $table->dropColumn(['tipo_solicitud', 'mensaje_solicitud', 'telefono_contacto']);
        });
    }
};
