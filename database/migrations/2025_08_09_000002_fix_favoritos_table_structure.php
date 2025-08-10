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
        // Verificar y crear la tabla favoritos si no existe
        if (!Schema::hasTable('favoritos')) {
            Schema::create('favoritos', function (Blueprint $table) {
                $table->id();
                $table->foreignId('cliente_id')->constrained('clientes')->onDelete('cascade');
                $table->foreignId('departamento_id')->constrained('departamentos')->onDelete('cascade');
                $table->timestamps();
                
                // Evitar duplicados
                $table->unique(['cliente_id', 'departamento_id']);
            });
        } else {
            // Si existe, verificar que tenga la estructura correcta
            Schema::table('favoritos', function (Blueprint $table) {
                if (!Schema::hasColumn('favoritos', 'id')) {
                    $table->id()->first();
                }
                
                if (!Schema::hasColumn('favoritos', 'created_at')) {
                    $table->timestamps();
                }
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('favoritos');
    }
};
