<?php


namespace App\Services\DB;


use App\Models\User;
use Illuminate\Support\Facades\File;

class SqliteSetup
{
    private User $user;
    public function __construct(User $user)
    {
        $this->user = $user;
        if(!$user->isDbExists()) {
            $dbName = $this->generateDbName();
            File::copy(database_path('database.sqlite'), database_path($dbName));
            new SetSqlite($dbName);
            new SqliteMigration($dbName);
        }
        else{
            $dbName = $user->db_name;
            new SetSqlite($dbName);
        }
    }

    function generateDbName(){
        $this->user->db_name = md5($this->user->email).'.db';
        $this->user->save();
        return $this->user->db_name;
    }
}
