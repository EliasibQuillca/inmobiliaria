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
        Schema::table('clientes', function (Blueprint $table) {
            $table->foreignId('asesor_id')->nullable()->after('usuario_id')->constrained('asesores')->onUpdate('cascade')->onDelete('set null');
            $table->string('nombre')->nullable()->after('asesor_id');
            $table->string('telefono', 20)->nullable()->after('nombre');
            $table->string('email')->nullable()->after('telefono');
            $table->unsignedBigInteger('departamento_interes')->nullable()->after('email');
            $table->text('notas_contacto')->nullable()->after('departamento_interes');
            $table->enum('medio_contacto', ['whatsapp', 'telefono', 'presencial'])->nullable()->after('notas_contacto');
            $table->enum('estado', ['contactado', 'interesado', 'sin_interes', 'perdido', 'cita_agendada'])->default('contactado')->after('medio_contacto');
            $table->text('notas_seguimiento')->nullable()->after('estado');
            $table->datetime('fecha_cita')->nullable()->after('notas_seguimiento');
            $table->enum('tipo_cita', ['presencial', 'virtual', 'telefonica'])->nullable()->after('fecha_cita');
            $table->string('ubicacion_cita')->nullable()->after('tipo_cita');
            $table->text('notas_cita')->nullable()->after('ubicacion_cita');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('clientes', function (Blueprint $table) {
            $table->dropForeign(['asesor_id']);
            $table->dropColumn([
                'asesor_id',
                'nombre',
                'telefono',
                'email',
                'departamento_interes',
                'notas_contacto',
                'medio_contacto',
                'estado',
                'notas_seguimiento',
                'fecha_cita',
                'tipo_cita',
                'ubicacion_cita',
                'notas_cita'
            ]);
        });
    }
};
