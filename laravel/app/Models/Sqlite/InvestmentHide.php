<?php

namespace App\Models\Sqlite;

use App\Models\Sqlite\Master\Category;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InvestmentHide extends Model
{
    use HasFactory;

    protected $connection = 'sqlite';
    protected $fillable = ['investment_reason'];

    function scopeReason($query, $reason)
    {
        return $this->where('investment_reason', $reason);
    }

}
