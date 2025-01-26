<?php

namespace App\Models\Sqlite;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    use HasFactory;

    protected $connection = 'sqlite';
    public $timestamps  = false;
    protected $fillable = [
        'key',
        'value'
    ];

    function scopeIsRegistered($q){
        $result = $q->where('key','IS_REGISTRATION_COMPLETED')->first();
        return $result->value == '1';
    }
    function scopeRegisteredDate($q){
        $result = $q->where('key','REGISTERED_DATE')->first();
        return $result->value;
    }

}
