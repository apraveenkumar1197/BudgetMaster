<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('category')->collation('utf8mb4_bin')->unique();
            $table->timestamps();
            $table->integer('order')->nullable();
        });
    }

    public function down()
    {
        Schema::dropIfExists('categories');
    }
};
