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
        Schema::table('asesores', function (Blueprint $table) {
            $table->string('nombre')->after('fecha_contrato');
            $table->string('apellidos')->after('nombre');
            $table->string('telefono')->after('apellidos');
            $table->string('documento')->unique()->after('telefono');
            $table->string('direccion')->after('documento');
            $table->date('fecha_nacimiento')->after('direccion');
            $table->string('especialidad')->nullable()->after('fecha_nacimiento');
            $table->integer('experiencia')->nullable()->after('especialidad');
            $table->text('biografia')->nullable()->after('experiencia');
            $table->enum('estado', ['activo', 'inactivo'])->default('activo')->after('biografia');
            $table->float('comision_porcentaje')->default(0)->after('estado');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('asesores', function (Blueprint $table) {
            $table->dropColumn([
                'nombre',
                'apellidos',
                'telefono',
                'documento',
                'direccion',
                'fecha_nacimiento',
                'especialidad',
                'experiencia',
                'biografia',
                'estado',
                'comision_porcentaje'
            ]);
        });
    }
};
