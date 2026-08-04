<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('credit_cards', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('holder_name')->nullable();
            $table->string('card_number')->nullable();
            $table->date('expiry_date')->nullable();
            $table->string('issuer')->nullable();
            $table->string('card_type')->nullable();
            $table->timestamps();
            $table->integer('bill_date')->nullable();
            $table->integer('due_date')->nullable();
        });
    }

    public function down()
    {
        Schema::dropIfExists('credit_cards');
    }
};
