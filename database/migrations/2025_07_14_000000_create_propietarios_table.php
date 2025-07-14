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
        Schema::create('propietarios', function (Blueprint $table) {
            $table->id();
            $table->string('nombre', 150);
            $table->string('dni', 20)->unique();
            $table->enum('tipo', ['natural', 'juridico'])->default('natural');
            $table->string('contacto', 100)->nullable();
            $table->string('direccion', 200)->nullable();
            $table->boolean('registrado_sunarp')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('propietarios');
    }
};
