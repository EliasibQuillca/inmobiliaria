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
        Schema::create('cotizaciones', function (Blueprint $table) {
            $table->id();
            $table->foreignId('asesor_id')->constrained('asesores')->onUpdate('cascade')->onDelete('restrict');
            $table->foreignId('departamento_id')->constrained('departamentos')->onUpdate('cascade')->onDelete('restrict');
            $table->foreignId('cliente_id')->nullable()->constrained('clientes')->onUpdate('cascade')->onDelete('set null');
            $table->timestamp('fecha')->useCurrent();
            $table->decimal('monto', 12, 2);
            $table->enum('estado', ['pendiente', 'aceptada', 'rechazada'])->default('pendiente');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cotizaciones');
    }
};
