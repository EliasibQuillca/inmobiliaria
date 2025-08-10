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
        // Solo crear la tabla si no existe
        if (!Schema::hasTable('imagenes')) {
            Schema::create('imagenes', function (Blueprint $table) {
                $table->id();
                $table->foreignId('departamento_id')->constrained('departamentos')->onUpdate('cascade')->onDelete('cascade');
                $table->string('ruta', 500); // Ruta de la imagen en storage
                $table->string('nombre', 255); // Nombre del archivo
                $table->string('titulo', 100)->nullable(); // Título opcional
                $table->text('descripcion')->nullable(); // Descripción opcional
                $table->enum('tipo', ['principal', 'galeria', 'plano', 'fachada'])->default('galeria');
                $table->integer('orden')->default(1);
                $table->boolean('activa')->default(true);
                $table->timestamps();

                // Índices
                $table->index(['departamento_id', 'tipo', 'orden']);
                $table->index(['departamento_id', 'activa']);
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('imagenes');
    }
};
