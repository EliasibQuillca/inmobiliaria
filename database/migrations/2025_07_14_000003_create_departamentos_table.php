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
        Schema::create('departamentos', function (Blueprint $table) {
            $table->id();
            $table->string('titulo', 150);
            $table->text('descripcion');
            $table->string('ubicacion', 200);
            $table->decimal('precio', 12, 2);
            $table->integer('habitaciones');
            $table->integer('banos');
            $table->decimal('area', 8, 2);
            $table->boolean('disponible')->default(true);
            $table->enum('estado', ['disponible', 'reservado', 'vendido', 'inactivo'])->default('disponible');
            $table->integer('piso');
            $table->boolean('garage')->default(false);
            $table->boolean('balcon')->default(false);
            $table->boolean('amueblado')->default(false);
            $table->boolean('mascotas_permitidas')->default(false);
            $table->decimal('gastos_comunes', 8, 2)->nullable();
            $table->integer('año_construccion');
            $table->boolean('destacado')->default(false);
            $table->foreignId('propietario_id')->constrained('propietarios')->onUpdate('cascade')->onDelete('restrict');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('departamentos');
    }
};
