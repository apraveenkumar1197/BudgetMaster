<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('pay_modes', function (Blueprint $table) {
            $table->id();
            $table->integer('storage_id');
            $table->string('pay_mode')->collation('utf8mb4_bin')->unique();
        });
    }

    public function down()
    {
        Schema::dropIfExists('pay_modes');
    }
};
