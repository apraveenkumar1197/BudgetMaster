<?php


namespace App\Services\Ledger\Expense;


use App\Http\Resources\Ledger\Expense\ExpenseReportCollection;
use App\Models\Sqlite\Ledger;
use App\Services\ServiceResponse;

class ExpenseByDateService
{
    private $date;
    public function __construct($date)
    {
        $this->date = $date;
    }
    public function get()
    {
        $expenses = Ledger::expenses()->date($this->date)->get();
        return (new ServiceResponse())->setData(new ExpenseReportCollection($expenses));
    }
}
