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
            // Cambiar descuento de decimal(5,2) a decimal(12,2) para permitir valores más grandes
            $table->decimal('descuento', 12, 2)->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('cotizaciones', function (Blueprint $table) {
            // Revertir a la definición original
            $table->decimal('descuento', 5, 2)->nullable()->change();
        });
    }
};
