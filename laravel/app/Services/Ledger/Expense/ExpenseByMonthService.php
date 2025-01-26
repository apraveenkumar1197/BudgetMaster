<?php


namespace App\Services\Ledger\Expense;


use App\Models\Sqlite\Ledger;
use App\Services\ServiceResponse;

class ExpenseByMonthService
{
    private $month, $savingAndInvestment;
    public function __construct($month, $savingAndInvestment)
    {
        $this->month = $month;
        $this->savingAndInvestment = $savingAndInvestment;
    }
    public function get()
    {
        $expenses = Ledger::expenses()
            ->month($this->month)
            ->categoryGrouped()
            ->selectRaw("sum(debit) as amount, category");

        if(!$this->savingAndInvestment) $expenses->notInvestmentsAndSavings();

        return (new ServiceResponse())->setData(collect($expenses->get()->map(function ($expense) {
            return [
                'category' => $expense->categoryData->category,
                'amount' => $expense->amount,
            ];
        })));
    }
}
