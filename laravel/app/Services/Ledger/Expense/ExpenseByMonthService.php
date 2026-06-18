<?php


namespace App\Services\Ledger\Expense;


use App\Models\Sqlite\Ledger;
use App\Services\ServiceResponse;

class ExpenseByMonthService
{
    private $month, $savingAndInvestment, $withoutCreditCardExpenses;
    public function __construct($month, $savingAndInvestment, $withoutCreditCardExpenses = false)
    {
        $this->month = $month;
        $this->savingAndInvestment = $savingAndInvestment;
        $this->withoutCreditCardExpenses = $withoutCreditCardExpenses;
    }
    public function get()
    {
        $expenses = Ledger::expenses()
            ->month($this->month)
            ->categoryGrouped()
            ->selectRaw("sum(debit) as amount, category");

        if(!$this->savingAndInvestment) $expenses->notInvestmentsAndSavings();
        if($this->withoutCreditCardExpenses) $expenses->withoutCreditCardPayModes();

        return (new ServiceResponse())->setData(collect($expenses->get()->map(function ($expense) {
            return [
                'category' => $expense->categoryData->category,
                'amount' => $expense->amount,
            ];
        })));
    }
}
