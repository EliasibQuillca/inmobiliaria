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
        Schema::table('ventas', function (Blueprint $table) {
            $table->decimal('comision', 10, 2)->default(0)->after('monto_final')->comment('Comisión del asesor (calculada automáticamente)');
            $table->decimal('porcentaje_comision', 5, 2)->default(5.00)->after('comision')->comment('Porcentaje de comisión aplicado');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ventas', function (Blueprint $table) {
            $table->dropColumn(['comision', 'porcentaje_comision']);
        });
    }
};
