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
        Schema::create('comentarios_solicitud', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('cotizacion_id');
            $table->unsignedBigInteger('usuario_id'); // Quien escribe (cliente o asesor)
            $table->text('comentario');
            $table->enum('tipo', ['cliente', 'asesor'])->default('cliente');
            $table->boolean('leido')->default(false);
            $table->timestamps();
            
            // Índices y claves foráneas
            $table->foreign('cotizacion_id')->references('id')->on('cotizaciones')->onDelete('cascade');
            $table->foreign('usuario_id')->references('id')->on('users')->onDelete('cascade');
            
            // Índices para optimizar consultas
            $table->index(['cotizacion_id', 'created_at']);
            $table->index(['usuario_id', 'leido']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('comentarios_solicitud');
    }
};
