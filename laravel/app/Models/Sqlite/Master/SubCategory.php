<?php

namespace App\Models\Sqlite\Master;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SubCategory extends Model
{
    use HasFactory;

    protected $connection = 'sqlite';
    protected $fillable = ['sub_category'];

    function scopeIds($query, $ids){
        return $query->whereIn('id', $ids);
    }
}
