<?php

use App\Models\MiscData;
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
        MiscData::updateOrCreate(
            ['key' => 'CATEGORIES'],
            ['data' => json_encode([
                "Housing",
                "Transportation",
                "Food",
                "Utilities",
                "Clothing",
                "Medical",
                "Insurance",
                "Groceries",
                "Personal",
                "Education",
                "Savings",
                "Gifts",
                "Donations",
                "Entertainment"
            ])]
        );

    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        MiscData::where('key', 'CATEGORIES')->delete();
    }
};
