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
        Schema::create('auditoria_admin', function (Blueprint $table) {
            $table->id();
            $table->foreignId('usuario_id')->constrained('users')->onDelete('cascade');
            $table->string('accion', 100)->comment('Tipo de acción: crear, editar, eliminar, etc.');
            $table->string('modelo', 100)->comment('Modelo afectado: Usuario, Departamento, Venta, etc.');
            $table->unsignedBigInteger('modelo_id')->nullable()->comment('ID del registro afectado');
            $table->text('descripcion')->comment('Descripción detallada de la acción');
            $table->json('datos_anteriores')->nullable()->comment('Estado anterior del registro (JSON)');
            $table->json('datos_nuevos')->nullable()->comment('Estado nuevo del registro (JSON)');
            $table->string('ip_address', 45)->nullable();
            $table->string('user_agent')->nullable();
            $table->timestamps();

            $table->index(['usuario_id', 'created_at']);
            $table->index(['modelo', 'modelo_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('auditoria_admin');
    }
};
