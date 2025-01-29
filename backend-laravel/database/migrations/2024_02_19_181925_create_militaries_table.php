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
        Schema::create('militaries', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->integer('number')->nullable();
            $table->unsignedBigInteger('subunit_id');
            $table->foreign('subunit_id')->references('id')->on('subunits');
            $table->unsignedBigInteger('rank_id');
            $table->foreign('rank_id')->references('id')->on('ranks');
            $table->unsignedBigInteger('workplace_id')->nullable();
            $table->foreign('workplace_id')->references('id')->on('workplaces');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('militaries');
    }
};
