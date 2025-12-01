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
        Schema::table('auditoria_usuarios', function (Blueprint $table) {
            // Campos para el sistema de aprobaciones del cliente
            $table->foreignId('cliente_afectado_id')->nullable()->after('usuario_id')->constrained('clientes')->onDelete('cascade');
            $table->string('modelo_tipo')->nullable()->after('accion'); // 'App\Models\Cotizacion', etc.
            $table->unsignedBigInteger('modelo_id')->nullable()->after('modelo_tipo'); // ID del registro relacionado
            
            $table->string('titulo')->nullable()->after('modelo_id'); // "Cotización creada por asesor"
            $table->text('descripcion')->nullable()->after('detalles'); // Descripción detallada
            
            // Sistema de aprobación
            $table->enum('requiere_aprobacion', ['si', 'no'])->default('no')->after('descripcion');
            $table->enum('estado_aprobacion', ['pendiente', 'aprobada', 'rechazada', 'n/a'])->default('n/a')->after('requiere_aprobacion');
            $table->timestamp('fecha_respuesta')->nullable()->after('estado_aprobacion');
            $table->text('motivo_respuesta')->nullable()->after('fecha_respuesta');
            
            // Notificaciones
            $table->boolean('notificado')->default(false)->after('motivo_respuesta');
            $table->enum('prioridad', ['baja', 'media', 'alta', 'urgente'])->default('media')->after('notificado');
            
            // Índices
            $table->index(['cliente_afectado_id', 'estado_aprobacion']);
            $table->index(['modelo_tipo', 'modelo_id']);
            $table->index(['requiere_aprobacion', 'estado_aprobacion']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('auditoria_usuarios', function (Blueprint $table) {
            $table->dropForeign(['cliente_afectado_id']);
            $table->dropIndex(['cliente_afectado_id', 'estado_aprobacion']);
            $table->dropIndex(['modelo_tipo', 'modelo_id']);
            $table->dropIndex(['requiere_aprobacion', 'estado_aprobacion']);
            
            $table->dropColumn([
                'cliente_afectado_id',
                'modelo_tipo',
                'modelo_id',
                'titulo',
                'descripcion',
                'requiere_aprobacion',
                'estado_aprobacion',
                'fecha_respuesta',
                'motivo_respuesta',
                'notificado',
                'prioridad',
            ]);
        });
    }
};
