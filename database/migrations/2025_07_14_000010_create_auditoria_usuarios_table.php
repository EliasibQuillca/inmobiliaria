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
        Schema::create('auditoria_usuarios', function (Blueprint $table) {
            $table->id();
            $table->foreignId('usuario_id')->constrained('users')->onUpdate('cascade')->onDelete('cascade');
            $table->string('accion', 100);
            $table->json('detalles')->nullable();
            $table->timestamp('fecha_hora')->useCurrent();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('auditoria_usuarios');
    }
};
