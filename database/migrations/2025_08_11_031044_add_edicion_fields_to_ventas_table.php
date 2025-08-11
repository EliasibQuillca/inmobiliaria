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
            $table->integer('cantidad_ediciones')->default(0)->after('observaciones');
            $table->integer('max_ediciones')->default(3)->after('cantidad_ediciones'); // Máximo 3 ediciones
            $table->boolean('bloqueada_edicion')->default(false)->after('max_ediciones');
            $table->timestamp('fecha_primera_edicion')->nullable()->after('bloqueada_edicion');
            $table->timestamp('fecha_ultima_edicion')->nullable()->after('fecha_primera_edicion');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ventas', function (Blueprint $table) {
            $table->dropColumn([
                'cantidad_ediciones',
                'max_ediciones', 
                'bloqueada_edicion',
                'fecha_primera_edicion',
                'fecha_ultima_edicion'
            ]);
        });
    }
};
