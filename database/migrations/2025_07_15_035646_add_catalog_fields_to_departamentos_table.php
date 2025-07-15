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
            $table->string('titulo', 200)->after('codigo');
            $table->text('descripcion')->nullable()->after('titulo');
            $table->string('ubicacion', 200)->after('descripcion');
            $table->decimal('precio_anterior', 12, 2)->nullable()->after('precio');
            $table->integer('dormitorios')->nullable()->after('precio_anterior');
            $table->integer('banos')->nullable()->after('dormitorios');
            $table->decimal('area_total', 8, 2)->nullable()->after('banos');
            $table->integer('estacionamientos')->default(0)->after('area_total');
            $table->boolean('disponible')->default(true)->after('estado');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('departamentos', function (Blueprint $table) {
            $table->dropColumn([
                'titulo',
                'descripcion',
                'ubicacion',
                'precio_anterior',
                'dormitorios',
                'banos',
                'area_total',
                'estacionamientos',
                'disponible'
            ]);
        });
    }
};
