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
        Schema::table('departamentos', function (Blueprint $table) {
            $table->text('imagen_principal')->nullable()->after('destacado');
            $table->text('imagen_galeria_1')->nullable()->after('imagen_principal');
            $table->text('imagen_galeria_2')->nullable()->after('imagen_galeria_1');
            $table->text('imagen_galeria_3')->nullable()->after('imagen_galeria_2');
            $table->text('imagen_galeria_4')->nullable()->after('imagen_galeria_3');
            $table->text('imagen_galeria_5')->nullable()->after('imagen_galeria_4');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('departamentos', function (Blueprint $table) {
            $table->dropColumn([
                'imagen_principal',
                'imagen_galeria_1',
                'imagen_galeria_2',
                'imagen_galeria_3',
                'imagen_galeria_4',
                'imagen_galeria_5'
            ]);
        });
    }
};
