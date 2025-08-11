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
        DB::statement("ALTER TABLE cotizaciones MODIFY COLUMN estado ENUM('pendiente','aprobada','rechazada','vencida','aceptada','en_proceso','completada','cancelada','expirada') DEFAULT 'pendiente'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement("ALTER TABLE cotizaciones MODIFY COLUMN estado ENUM('pendiente','aprobada','rechazada','vencida','aceptada','en_proceso','completada','cancelada') DEFAULT 'pendiente'");
    }
};
