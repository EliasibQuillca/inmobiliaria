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
        // Esta migración consolida TODOS los campos que deben estar en la tabla clientes
        // según el modelo Cliente.php actual
        
        Schema::table('clientes', function (Blueprint $table) {
            // Verificar y agregar campos de preferencias si no existen
            if (!Schema::hasColumn('clientes', 'tipo_propiedad')) {
                $table->string('tipo_propiedad')->default('apartamento')->after('notas_cita');
            }
            
            if (!Schema::hasColumn('clientes', 'habitaciones_deseadas')) {
                $table->integer('habitaciones_deseadas')->nullable()->after('tipo_propiedad');
            }
            
            if (!Schema::hasColumn('clientes', 'presupuesto_min')) {
                $table->decimal('presupuesto_min', 15, 2)->nullable()->after('habitaciones_deseadas');
            }
            
            if (!Schema::hasColumn('clientes', 'presupuesto_max')) {
                $table->decimal('presupuesto_max', 15, 2)->nullable()->after('presupuesto_min');
            }
            
            if (!Schema::hasColumn('clientes', 'zona_preferida')) {
                $table->string('zona_preferida')->nullable()->after('presupuesto_max');
            }
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
