<?php

use App\Models\Sqlite\Setting;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Setting::updateOrCreate(
            ['key' => 'IS_REGISTRATION_COMPLETED'],
            ['value' => 0]
        );
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Setting::where('key', 'IS_REGISTRATION_COMPLETED')->delete();
    }
};
