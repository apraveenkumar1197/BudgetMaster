<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('ledgers', function (Blueprint $table) {
            $table->id();
            $table->date('date')->nullable();
            $table->string('name')->nullable();
            $table->string('category')->nullable();
            $table->string('sub_category')->nullable();
            $table->string('description')->nullable();
            $table->decimal('credit', 12, 2)->default(0);
            $table->decimal('debit', 12, 2)->default(0);
            $table->decimal('pay_mode', 12, 2)->nullable();
            $table->string('type')->comment('Income / Expense / Storage')->nullable();
            $table->string('secondary_type')->nullable();
            $table->boolean('is_ledger')->comment('Indicates ledger / Storage transfers')->default(1);
            $table->timestamps();
            $table->boolean('is_recurring')->default(false);
            $table->integer('recurring_frequency')->nullable();
            $table->date('recurring_till')->nullable();
        });
    }

    public function down()
    {
        Schema::dropIfExists('ledgers');
    }
};
