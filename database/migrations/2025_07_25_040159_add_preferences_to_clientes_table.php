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
        Schema::table('clientes', function (Blueprint $table) {
            $table->string('tipo_propiedad')->default('apartamento')->after('notas_cita');
            $table->integer('habitaciones_deseadas')->nullable()->after('tipo_propiedad');
            $table->decimal('presupuesto_min', 15, 2)->nullable()->after('habitaciones_deseadas');
            $table->decimal('presupuesto_max', 15, 2)->nullable()->after('presupuesto_min');
            $table->string('zona_preferida')->nullable()->after('presupuesto_max');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('clientes', function (Blueprint $table) {
            $table->dropColumn([
                'tipo_propiedad',
                'habitaciones_deseadas',
                'presupuesto_min',
                'presupuesto_max',
                'zona_preferida'
            ]);
        });
    }
};
