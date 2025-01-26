<?php

namespace App\Models\Sqlite;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CreditCard extends Model
{
    use HasFactory;

    protected $connection = 'sqlite';
    protected $fillable = ['name', 'holder_name'];

    function scopeName($query, $name)
    {
        return $query->where('name', $name);
    }
}
