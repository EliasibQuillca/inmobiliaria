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
        // Esta migración consolida TODOS los campos finales de cotizaciones
        // resolviendo los conflictos históricos entre migraciones
        
        Schema::table('cotizaciones', function (Blueprint $table) {
            // Agregar campos de solicitud si no existen (de la migración 2025_07_30_040000)
            if (!Schema::hasColumn('cotizaciones', 'tipo_solicitud')) {
                $table->enum('tipo_solicitud', ['informacion', 'visita', 'financiamiento', 'cotizacion'])
                      ->default('informacion')
                      ->after('cliente_id');
            }
            
            if (!Schema::hasColumn('cotizaciones', 'mensaje_solicitud')) {
                $table->text('mensaje_solicitud')
                      ->nullable()
                      ->after('tipo_solicitud');
            }
            
            if (!Schema::hasColumn('cotizaciones', 'telefono_contacto')) {
                $table->string('telefono_contacto')
                      ->nullable()
                      ->after('mensaje_solicitud');
            }
            
            // Agregar campos adicionales que están en el modelo Cotizacion.php
            if (!Schema::hasColumn('cotizaciones', 'descuento')) {
                $table->decimal('descuento', 5, 2)->nullable()->after('monto');
            }
            
            if (!Schema::hasColumn('cotizaciones', 'fecha_validez')) {
                $table->date('fecha_validez')->nullable()->after('fecha');
            }
            
            if (!Schema::hasColumn('cotizaciones', 'notas')) {
                $table->text('notas')->nullable()->after('estado');
            }
            
            if (!Schema::hasColumn('cotizaciones', 'condiciones')) {
                $table->text('condiciones')->nullable()->after('notas');
            }
        });
        
        // Actualizar enum de estados para incluir todos los valores usados en el proyecto
        DB::statement("ALTER TABLE cotizaciones MODIFY estado ENUM('pendiente', 'aprobada', 'rechazada', 'vencida', 'aceptada', 'en_proceso', 'completada', 'cancelada') DEFAULT 'pendiente'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('cotizaciones', function (Blueprint $table) {
            $table->dropColumn([
                'tipo_solicitud',
                'mensaje_solicitud', 
                'telefono_contacto',
                'descuento',
                'fecha_validez',
                'notas',
                'condiciones'
            ]);
        });
        
        // Restaurar enum original
        DB::statement("ALTER TABLE cotizaciones MODIFY estado ENUM('pendiente', 'aceptada', 'rechazada') DEFAULT 'pendiente'");
    }
};
