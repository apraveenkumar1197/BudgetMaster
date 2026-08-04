<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('settings', function (Blueprint $table) {
            $table->string('key')->collation('utf8mb4_bin')->unique();
            $table->text('value');
        });
    }

    public function down()
    {
        Schema::dropIfExists('settings');
    }
};
