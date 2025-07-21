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
        // Crear tabla de comentarios de solicitudes
        Schema::create('comentarios_solicitud', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cotizacion_id')->constrained('cotizaciones')->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->text('mensaje');
            $table->enum('rol', ['cliente', 'asesor', 'sistema'])->default('cliente');
            $table->timestamps();
        });

        // Modificar tabla de cotizaciones para agregar campos adicionales
        Schema::table('cotizaciones', function (Blueprint $table) {
            // Estos campos podrían existir ya en la migración original, pero los agregamos aquí para asegurarnos
            if (!Schema::hasColumn('cotizaciones', 'tipo')) {
                $table->enum('tipo', ['informacion', 'visita', 'financiamiento', 'cotizacion'])->default('informacion');
            }

            if (!Schema::hasColumn('cotizaciones', 'mensaje')) {
                $table->text('mensaje');
            }

            if (!Schema::hasColumn('cotizaciones', 'telefono')) {
                $table->string('telefono')->nullable();
            }

            if (!Schema::hasColumn('cotizaciones', 'disponibilidad')) {
                $table->json('disponibilidad')->nullable();
            }

            if (!Schema::hasColumn('cotizaciones', 'preferencia_contacto')) {
                $table->enum('preferencia_contacto', ['email', 'telefono', 'whatsapp'])->default('email');
            }

            if (!Schema::hasColumn('cotizaciones', 'estado')) {
                $table->enum('estado', ['pendiente', 'en_proceso', 'completada', 'cancelada'])->default('pendiente');
            }
        });

        // Crear tabla de favoritos
        Schema::create('favoritos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cliente_id')->constrained()->onDelete('cascade');
            $table->foreignId('departamento_id')->constrained()->onDelete('cascade');
            $table->timestamps();

            // Índice único para evitar duplicados
            $table->unique(['cliente_id', 'departamento_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('comentarios_solicitud');

        Schema::table('cotizaciones', function (Blueprint $table) {
            // Eliminar solo las columnas que agregamos
            $columnas = ['tipo', 'mensaje', 'telefono', 'disponibilidad', 'preferencia_contacto', 'estado'];

            foreach ($columnas as $columna) {
                if (Schema::hasColumn('cotizaciones', $columna)) {
                    $table->dropColumn($columna);
                }
            }
        });

        Schema::dropIfExists('favoritos');
    }
};
