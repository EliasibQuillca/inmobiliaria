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
        Schema::create('publicaciones', function (Blueprint $table) {
            $table->id();
            $table->foreignId('departamento_id')->constrained('departamentos')->onUpdate('cascade')->onDelete('cascade');
            $table->date('fecha_inicio');
            $table->date('fecha_fin')->nullable();
            $table->decimal('precio_oferta', 12, 2);
            $table->enum('estado', ['activa', 'pausada', 'expirada'])->default('activa');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('publicaciones');
    }
};
