<?php

namespace App\Models\Sqlite;

use App\Enum\Category;
use App\Http\Resources\Ledger\Expense\ExpenseReportCollection;
use App\Http\Resources\Ledger\Expense\ExpenseReportResource;
use App\Models\Sqlite\Master\PayMode;
use App\Services\Misc\CategoryService;
use App\Services\Misc\ReasonService;
use App\Traits\UtilTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Storage extends Model
{
    use HasFactory, UtilTrait;

    protected $connection = 'sqlite';
    public $timestamps = false;

    protected $fillable = ['name', 'amount'];

    function getAmount($fromDate, $toDate){
        $payModes = $this->hasMany(PayMode::class)->pluck('id');
        if($this->isCreditCard($this->name)){
            $payMode = $this->hasMany(PayMode::class)->first();
            $reasonId = (new ReasonService($payMode->pay_mode))->getId();
            $categoryId = (new CategoryService(Category::CreditCardExpense))->getId();

            $creditCardExpenses = Ledger::expenses()
                ->dateRange('2010-01-01', $toDate)
                ->payMode($payMode->id)
                ->selectRaw("sum(credit - debit) as amount")
                ->get()
                ->sum('amount');
            $creditCardPayOffs = Ledger::expenses()
                ->dateRange('2010-01-01', $toDate)
                ->reason($reasonId)
                ->category($categoryId)
                ->get()
                ->sum('debit');
            $creditCardIncomes = Ledger::incomes()
                ->dateRange('2010-01-01', $toDate)
                ->payMode($payMode->id)
                ->selectRaw("sum(credit - debit) as amount")
                ->get()
                ->sum('amount');

            return abs(abs($creditCardExpenses) - ($creditCardPayOffs + $creditCardIncomes));
        }
        else {
            return Ledger::whereIn('pay_mode', $payModes)
                ->dateRange('2010-01-01', $toDate)
                ->selectRaw('(credit - debit) as amount')
                ->get()
                ->sum('amount');
        }
    }

    function payModes()
    {
        return $this->hasMany(PayMode::class, 'storage_id');
    }
}
