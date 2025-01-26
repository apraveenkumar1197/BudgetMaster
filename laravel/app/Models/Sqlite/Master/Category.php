<?php

namespace App\Models\Sqlite\Master;

use App\Enum\LedgerSecondaryType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use \App\Enum\Category as CategoryEnum;

class Category extends Model
{
    use HasFactory;

    protected $connection = 'sqlite';
    protected $fillable = ['category'];

    function scopeIds($query, $ids){
        return $query->whereIn('id', $ids);
    }

    function scopeInvestment($query)
    {
        return $query->where('category', LedgerSecondaryType::Investment);
    }

    function scopeInvestmentReturns($query)
    {
        return $query->where('category', CategoryEnum::InvestmentReturns);
    }

    function scopeSavings($query)
    {
        return $query->where('category', LedgerSecondaryType::Saving);
    }


    function scopeSavingReturns($query)
    {
        return $query->where('category', CategoryEnum::SavingReturns);
    }
    function scopeLoan($query)
    {
        return $query->where('category', LedgerSecondaryType::Loan);
    }
    function scopeLoanPaid($query)
    {
        return $query->where('category', CategoryEnum::LoanPaid);
    }
}
