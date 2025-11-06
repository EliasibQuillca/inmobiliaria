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
        Schema::table('ventas', function (Blueprint $table) {
            // Agregar campos para seguimiento de entrega de documentos
            if (!Schema::hasColumn('ventas', 'observaciones')) {
                $table->text('observaciones')->nullable()->after('documentos_entregados');
            }

            if (!Schema::hasColumn('ventas', 'fecha_entrega_documentos')) {
                $table->timestamp('fecha_entrega_documentos')->nullable()->after('documentos_entregados');
            }

            if (!Schema::hasColumn('ventas', 'usuario_entrega_id')) {
                $table->foreignId('usuario_entrega_id')->nullable()->after('fecha_entrega_documentos')->constrained('users')->onDelete('set null');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ventas', function (Blueprint $table) {
            if (Schema::hasColumn('ventas', 'usuario_entrega_id')) {
                $table->dropForeign(['usuario_entrega_id']);
                $table->dropColumn('usuario_entrega_id');
            }

            if (Schema::hasColumn('ventas', 'fecha_entrega_documentos')) {
                $table->dropColumn('fecha_entrega_documentos');
            }

            // No eliminamos observaciones ya que puede existir de antes
        });
    }
};
