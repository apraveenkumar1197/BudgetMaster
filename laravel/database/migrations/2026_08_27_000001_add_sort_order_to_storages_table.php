<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('storages', function (Blueprint $table) {
            $table->unsignedInteger('sort_order')->default(0)->after('name');
        });

        // Backfill using current id order so existing list order doesn't change
        // until a user explicitly reorders.
        DB::table('storages')->orderBy('id')->get(['id'])->each(function ($storage, $index) {
            DB::table('storages')->where('id', $storage->id)->update(['sort_order' => $index]);
        });
    }

    public function down()
    {
        Schema::table('storages', function (Blueprint $table) {
            $table->dropColumn('sort_order');
        });
    }
};
