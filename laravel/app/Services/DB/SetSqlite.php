<?php
namespace App\Services\DB;

use Illuminate\Support\Facades\Config;

class SetSqlite {
    function __construct($dbName)
    {
        Config::set('database.connections.sqlite.database', database_path($dbName));
    }
}
