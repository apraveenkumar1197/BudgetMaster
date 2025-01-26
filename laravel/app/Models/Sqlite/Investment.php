<?php

namespace App\Models\Sqlite;

use App\Models\Sqlite\Master\Category;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Investment extends Model
{
    use HasFactory;

    protected $connection = 'sqlite';
    protected $fillable = ['name', 'category', 'amount'];


    function category(){
        return $this->hasOne(Category::class);
    }

}
