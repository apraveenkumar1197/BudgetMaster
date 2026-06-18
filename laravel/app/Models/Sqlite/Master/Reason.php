<?php

namespace App\Models\Sqlite\Master;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reason extends Model
{
    use HasFactory;

    protected $connection = 'sqlite';

    protected $fillable = ["reason"];

    function scopeIds($query, $ids){
        return $query->whereIn('id', $ids);
    }

}
