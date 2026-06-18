<?php

namespace App\Models\Sqlite;

use App\Models\Sqlite\Master\Category;
use App\Models\Sqlite\Master\Reason;
use App\Models\Sqlite\Master\SubCategory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Budget extends Model
{
    use HasFactory;

    protected $connection = 'sqlite';
    protected $fillable = ['month', 'reason', 'category', 'sub_category', 'amount'];

    function scopeMonth($query, $month)
    {
        return $query->where('month', $month);
    }

    function scopeCategoryWise($query)
    {
        return $query->groupBy('category')->selectRaw("category, sum(amount) as amount");
    }

    // Relations

    function reasonData()
    {
        return $this->belongsTo(Reason::class, 'reason', 'id');
    }

    function categoryData()
    {
        return $this->belongsTo(Category::class, 'category', 'id');
    }

    function subCategory()
    {
        return $this->belongsTo(SubCategory::class, 'sub_category', 'id');
    }
}
