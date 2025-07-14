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
            $table->string('codigo', 50)->unique();
            $table->string('direccion', 200);
            $table->decimal('precio', 12, 2);
            $table->enum('estado', ['disponible', 'reservado', 'vendido', 'inactivo'])->default('disponible');
            $table->foreignId('propietario_id')->constrained('propietarios')->onUpdate('cascade')->onDelete('restrict');
            $table->timestamp('creado_en')->useCurrent();
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
