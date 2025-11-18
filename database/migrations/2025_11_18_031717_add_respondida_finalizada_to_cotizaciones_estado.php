<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Agregar 'respondida' y 'finalizada' al ENUM de estado en cotizaciones
        DB::statement("ALTER TABLE cotizaciones MODIFY COLUMN estado ENUM('pendiente','aprobada','rechazada','vencida','aceptada','en_proceso','completada','cancelada','expirada','respondida','finalizada') DEFAULT 'pendiente'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Remover 'respondida' y 'finalizada' del ENUM
        DB::statement("ALTER TABLE cotizaciones MODIFY COLUMN estado ENUM('pendiente','aprobada','rechazada','vencida','aceptada','en_proceso','completada','cancelada','expirada') DEFAULT 'pendiente'");
    }
};
