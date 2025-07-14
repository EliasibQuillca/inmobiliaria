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
        Schema::create('departamento_atributo', function (Blueprint $table) {
            $table->foreignId('departamento_id')->constrained('departamentos')->onUpdate('cascade')->onDelete('cascade');
            $table->foreignId('atributo_id')->constrained('atributos')->onUpdate('cascade')->onDelete('restrict');
            $table->text('valor')->nullable();
            $table->primary(['departamento_id', 'atributo_id']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('departamento_atributo');
    }
};
