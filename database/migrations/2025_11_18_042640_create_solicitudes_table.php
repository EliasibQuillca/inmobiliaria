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
        Schema::create('solicitudes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cliente_id')->constrained('clientes')->onDelete('cascade');
            $table->foreignId('asesor_id')->nullable()->constrained('asesores')->onDelete('set null');
            $table->foreignId('departamento_id')->nullable()->constrained('departamentos')->onDelete('set null');

            // Información de la solicitud
            $table->string('tipo_consulta', 100)->default('informacion'); // informacion, visita, cotizacion
            $table->text('mensaje_solicitud')->nullable();
            $table->string('telefono', 20)->nullable();
            $table->string('email_contacto', 100)->nullable();

            // Estado del flujo
            $table->enum('estado', ['pendiente', 'aprobada', 'rechazada', 'finalizada'])->default('pendiente');

            // Notas del asesor
            $table->text('notas_asesor')->nullable();
            $table->text('motivo_rechazo')->nullable();

            // Timestamps
            $table->timestamp('fecha_aprobacion')->nullable();
            $table->timestamp('fecha_rechazo')->nullable();
            $table->timestamps();

            // Índices
            $table->index('estado');
            $table->index('cliente_id');
            $table->index('asesor_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('solicitudes');
    }
};
