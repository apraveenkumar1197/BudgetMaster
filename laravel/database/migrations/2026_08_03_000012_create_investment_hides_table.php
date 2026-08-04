<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('investment_hides', function (Blueprint $table) {
            $table->id();
            $table->string('investment_reason');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('investment_hides');
    }
};
