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
        Schema::create('imagenes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('departamento_id')->constrained('departamentos')->onUpdate('cascade')->onDelete('cascade');
            $table->string('url', 500); // URL de la imagen
            $table->string('titulo', 100)->nullable(); // Título opcional de la imagen
            $table->string('descripcion', 255)->nullable(); // Descripción opcional
            $table->enum('tipo', ['principal', 'galeria', 'plano'])->default('galeria'); // Tipo de imagen
            $table->integer('orden')->default(1); // Orden de visualización
            $table->boolean('activa')->default(true); // Si la imagen está activa
            $table->timestamps();

            // Índices para mejorar performance
            $table->index(['departamento_id', 'tipo', 'orden']);
            $table->index(['departamento_id', 'activa']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('imagenes');
    }
};
