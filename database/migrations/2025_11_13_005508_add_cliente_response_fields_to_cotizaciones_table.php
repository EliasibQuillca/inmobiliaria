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
            $table->timestamp('fecha_respuesta_cliente')->nullable()->after('fecha_validez');
            $table->text('motivo_rechazo_cliente')->nullable()->after('fecha_respuesta_cliente');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('cotizaciones', function (Blueprint $table) {
            $table->dropColumn(['fecha_respuesta_cliente', 'motivo_rechazo_cliente']);
        });
    }
};
