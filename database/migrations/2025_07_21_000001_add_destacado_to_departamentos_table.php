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
        Schema::table('departamentos', function (Blueprint $table) {
            if (!Schema::hasColumn('departamentos', 'destacado')) {
                $table->boolean('destacado')->default(false)->after('estado');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('departamentos', function (Blueprint $table) {
            if (Schema::hasColumn('departamentos', 'destacado')) {
                $table->dropColumn('destacado');
            }
        });
    }
};
