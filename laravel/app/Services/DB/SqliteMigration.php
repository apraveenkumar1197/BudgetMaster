<?php


namespace App\Services\DB;


use App\Models\Sqlite\Setting;
use Exception;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class SqliteMigration
{
    public function __construct($dbName)
    {
        new SetSqlite($dbName);

        $this->basic();
        $this->setting_table();
        $this->categories_table();
        $this->reasons_table();
        $this->budget_table();
        $this->hide_investments_table();
        $this->add_dates_to_credit_cards();
        $this->recurrences();
    }

    function basic()
    {
        try {
            Schema::connection('sqlite')->create('ledgers', function (Blueprint $table) {
                $table->id();
                $table->date('date')->nullable();
                $table->string('name')->nullable();
                $table->string('category')->nullable();
                $table->string('sub_category')->nullable();
                $table->string('description')->nullable();
                $table->decimal('credit')->default(0);
                $table->decimal('debit')->default(0);
                $table->decimal('pay_mode')->nullable();
                $table->string('type')->comment('Income / Expense / Storage')->nullable();
                $table->boolean('is_ledger')->comment('Indicates ledger / Storage transfers')->default(1);
                $table->timestamps();
            });

            Schema::connection('sqlite')->create('storages', function (Blueprint $table) {
                $table->id();
                $table->string('name')->unique();
            });

            Schema::connection('sqlite')->create('pay_modes', function (Blueprint $table) {
                $table->id();
                $table->integer('storage_id');
                $table->string('pay_mode')->unique();
            });

            Schema::connection('sqlite')->create('credit_cards', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->string('holder_name')->nullable();
                $table->string('card_number')->nullable();
                $table->date('expiry_date')->nullable();
                $table->string('issuer')->nullable();
                $table->string('card_type')->nullable();
                $table->timestamps();
            });

            Schema::connection('sqlite')->create('loans', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->string('category')->nullable();
                $table->float('amount')->default(0);
                $table->timestamps();
            });

            Schema::connection('sqlite')->create('investments', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->string('category')->nullable();
                $table->float('amount')->default(0);
                $table->timestamps();
            });
        } catch (Exception $e) {

        }
    }

    function setting_table()
    {
        try {
            Schema::connection('sqlite')->create('settings', function (Blueprint $table) {
                $table->string('key')->unique();
                $table->text('value');
            });

            Setting::create([
                'key' => 'IS_REGISTRATION_COMPLETED',
                'value' => '0'
            ]);
        } catch (Exception $e) {

        }

    }

    function categories_table()
    {
        try {
            Schema::connection('sqlite')->create('categories', function (Blueprint $table) {
                $table->id();
                $table->string('category')->unique();
                $table->timestamps();
            });

            Schema::connection('sqlite')->create('sub_categories', function (Blueprint $table) {
                $table->id();
                $table->string('sub_category')->unique();
                $table->timestamps();
            });
        } catch (Exception $e) {

        }

    }

    function reasons_table()
    {
        try {
            Schema::connection('sqlite')->create('reasons', function (Blueprint $table) {
                $table->id();
                $table->string('reason')->unique();
                $table->timestamps();
            });
        } catch (Exception $e) {

        }
    }

    function budget_table()
    {
        try {
            Schema::connection('sqlite')->create('budgets', function (Blueprint $table) {
                $table->id();
                $table->date('month');
                $table->integer('reason')->nullable();
                $table->integer('category');
                $table->integer('sub_category')->nullable();
                $table->decimal('amount');
                $table->timestamps();
            });
        } catch (Exception $e) {

        }
    }

    function hide_investments_table()
    {
        try {
            Schema::connection('sqlite')->create('investment_hides', function (Blueprint $table) {
                $table->id();
                $table->string('investment_reason');
                $table->timestamps();
            });
        }
        catch (Exception $e) {

        }
    }
    function add_dates_to_credit_cards()
    {
        try{
            Schema::connection('sqlite')->table('credit_cards', function (Blueprint $table) {
                $table->integer('bill_date')->nullable();
                $table->integer('due_date')->nullable();
            });
        }
        catch (Exception $e){

        }
    }

    function recurrences()
    {
        try{
            Schema::connection('sqlite')->table('ledgers', function (App\Services\DB\Illuminate\Database\Schema\Blueprint $table) {
                $table->boolean('is_recurring')->default(false);
                $table->integer('recurring_frequency')->nullable();
                $table->date('recurring_till')->nullable();
            });
        }
        catch (Exception $e){

        }
    }
}
