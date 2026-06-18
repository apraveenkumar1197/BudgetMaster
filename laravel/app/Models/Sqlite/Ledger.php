<?php

namespace App\Models\Sqlite;

use App\Enum\LedgerSecondaryType;
use App\Enum\LedgerType;
use App\Models\Sqlite\Master\Category;
use App\Models\Sqlite\Master\PayMode;
use App\Models\Sqlite\Master\Reason;
use App\Models\Sqlite\Master\SubCategory;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Collection;

class Ledger extends Model
{
    use HasFactory;

    protected $connection = 'sqlite';

    protected $casts = [
        'type' => LedgerType::class,
        'secondary_type' => LedgerSecondaryType::class,
    ];

    protected $fillable = [
        'date',
        'name',
        'category',
        'sub_category',
        'description',
        'credit',
        'debit',
        'pay_mode',
        'type',
        'secondary_type',
        'is_ledger',
        'is_recurring',
        'recurring_frequency',
        'recurring_till',
    ];

    // Scopes
    function scopeSearch($query, $term)
    {
        if ($term == null or $term == "") return $query;
        return $query->join('reasons', 'reasons.id', '=', 'ledgers.name')
            ->join('categories', 'categories.id', '=', 'ledgers.category')
            ->join('sub_categories', 'sub_categories.id', '=', 'ledgers.sub_category')
            ->orWhere('reasons.reason', 'like', "%$term%")
            ->orWhere('categories.category', 'like', "%$term%")
            ->orWhere('sub_categories.sub_category', 'like', "%$term%");
    }

    function scopeDate($query, $date)
    {
        return $query->where('date', $date);
    }

    function scopeFromCurrentMonth($query)
    {
        return $query->where('date', '>=', Carbon::now()->startOfMonth()->format('Y-m-d'))->orderBy('date');
    }

    function scopeMonth($query, $month = NULL)
    {
        if($month == NULL)
            $month = Carbon::now()->format('Y-m');

        return $query->whereRaw("STRFTIME('%Y-%m', date) = ?", $month);
    }

    function scopeDateRange($query, $fromDate, $toDate)
    {
        if ($fromDate == null or $toDate == null) return $query;
        return $query->whereBetween('date', [$fromDate, $toDate]);
    }

    function scopeReason($query, $reasonId)
    {
        if ($reasonId == null) return $query;
        return $query->where('name', $reasonId);
    }

    function scopeStorageTransfers($query)
    {
        return $query->whereNull('name')
            ->orderBy('created_at');
    }

    function scopeCategory($query, $categoryId)
    {
        if ($categoryId == null) return $query;
        if ($categoryId instanceof Collection) {
            return $query->whereIn('category', $categoryId);
        } else {
            return $query->where('category', $categoryId);
        }
    }

    function scopeSubCategory($query, $subCategoryId)
    {
        if ($subCategoryId == null) return $query;
        return $query->where('sub_category', $subCategoryId);
    }

    function scopePayMode($query, $payModeId)
    {
        if ($payModeId == null) return $query;
        if (!($payModeId instanceof Collection or is_array($payModeId))) $payModeId = [$payModeId];
        return $query->whereIn('pay_mode', $payModeId);
    }

    function scopeExpenses($query)
    {
        return $query->where('type', LedgerType::Expense);
    }

    function scopeIncomes($query)
    {
        return $query->where('type', LedgerType::Income);
    }

    function scopeOrderByDate($query)
    {
        return $this->orderByDesc('date');
    }

    function scopeLedger($query)
    {
        return $query->where(function ($q) {
            return $q->where('type', LedgerType::Expense)
                ->orWhere('type', LedgerType::Income);
        });
    }

    function scopeDues($query)
    {
        return $query->where('type', LedgerType::Due);
    }

    function scopeReturns($query)
    {
        return $query->where('type', LedgerType::Returns);
    }

    function scopeInvestments($query)
    {
        return $query->where('category', Category::investment()->first()->id);
    }

    function scopeInvestmentReturns($query)
    {
        return $query->where('category', Category::investmentReturns()->first()->id);
    }

    function scopeSaving($query)
    {
        return $query->where('category', Category::savings()->first()->id);
    }

    function scopeSavingReturns($query)
    {
        return $query->where('category', Category::savingReturns()->first()->id);
    }

    function scopeNotInvestmentsAndSavings($query)
    {
        return $query->where('category', '<>', Category::savings()->first()->id)
            ->where('category', '<>', Category::investment()->first()->id);
    }


    function scopeInvestmentsAndSavings($query)
    {
        return $query->where(function ($q) {
            return $q->where('category', Category::savings()->first()->id)
                ->orWhere('category', Category::investment()->first()->id);
        });
    }

    function scopeInvestmentsAndSavingsReturns($query)
    {
        return $query->where(function ($q) {
            return $q->where('category', Category::savingReturns()->first()->id)
                ->orWhere('category', Category::investmentReturns()->first()->id)
                ->orWhere('category', Category::investmentLoss()->first()->id);
        });
    }

    function scopeLoans($query)
    {
        return $query->where('category', Category::loan()->first()->id);
    }

    function scopeLoanPaid($query)
    {
        return $query->where('category', Category::loanPaid()->first()->id);
    }

    function scopeReasonGrouped($query)
    {
        return $query->groupBy('name')->orderBy('date', 'DESC');
    }

    function scopeCategoryGrouped($query)
    {
        return $query->groupBy('category');
    }

    function getIsExpenseMadeForDueAttribute()
    {
        return $this->expenses()
            ->reason($this->reason)
            ->category($this->category)
            ->subCategory($this->sub_category)
            ->month(Carbon::parse($this->date)->format('Y-m'))
            ->exists();
    }

    function scopeWithoutCreditCardPayModes($query)
    {
        return $query->whereNotIn('pay_mode', PayMode::creditCards()->pluck('id'));
    }

    function scopeRecurring($query)
    {
        return $query->where('is_recurring', true);
    }
    // Relations
    function reasonData()
    {
        return $this->belongsTo(Reason::class, 'name', 'id');
    }

    function categoryData()
    {
        return $this->belongsTo(Category::class, 'category', 'id');
    }

    function subCategory()
    {
        return $this->belongsTo(SubCategory::class, 'sub_category', 'id');
    }

    function payMode()
    {
        return $this->belongsTo(PayMode::class, 'pay_mode', 'id');
    }
}
