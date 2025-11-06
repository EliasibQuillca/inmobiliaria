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
        // Modificar el ENUM para agregar 'entrega_documentos'
        DB::statement("ALTER TABLE venta_historiales MODIFY accion ENUM('creacion', 'edicion', 'documentos', 'entrega_documentos')");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revertir al ENUM original
        DB::statement("ALTER TABLE venta_historiales MODIFY accion ENUM('creacion', 'edicion', 'documentos')");
    }
};
