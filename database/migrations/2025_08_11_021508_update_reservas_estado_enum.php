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
        // Cambiar el enum para incluir los estados que realmente se usan
        Schema::table('reservas', function (Blueprint $table) {
            $table->enum('estado', ['pendiente', 'confirmada', 'cancelada', 'vencida'])->default('pendiente')->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('reservas', function (Blueprint $table) {
            $table->enum('estado', ['activa', 'cancelada', 'completada'])->default('activa')->change();
        });
    }
};
