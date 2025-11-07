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
            // Campos de perfil personal
            $table->date('fecha_nacimiento')->nullable()->after('direccion');
            $table->string('ciudad', 100)->nullable()->after('fecha_nacimiento');
            $table->string('ocupacion', 100)->nullable()->after('ciudad');
            $table->enum('estado_civil', ['soltero', 'casado', 'divorciado', 'viudo'])->nullable()->after('ocupacion');
            $table->decimal('ingresos_mensuales', 10, 2)->nullable()->after('estado_civil');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('clientes', function (Blueprint $table) {
            $table->dropColumn([
                'fecha_nacimiento',
                'ciudad',
                'ocupacion',
                'estado_civil',
                'ingresos_mensuales'
            ]);
        });
    }
};
