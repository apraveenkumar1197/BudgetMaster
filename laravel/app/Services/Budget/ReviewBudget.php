<?php

namespace App\Services\Budget;

use App\Enum\LedgerSecondaryType;
use App\Services\Ledger\Expense\ExpenseByMonthService;
use App\Services\ServiceResponse;

class ReviewBudget {
    private $month, $savingAndInvestment, $withoutCreditCardExpenses;
    function __construct($month, $savingAndInvestment, $withoutCreditCardExpenses =  'N')
    {
        $this->month = $month;
        $this->savingAndInvestment = $savingAndInvestment == 'Y';
        $this->withoutCreditCardExpenses = $withoutCreditCardExpenses == 'Y';
    }

    function review()
    {
        $expenses = (new ExpenseByMonthService($this->month, $this->savingAndInvestment, $this->withoutCreditCardExpenses))->get()->getData();
        $budgets = (new BudgetList($this->month))->list()->getData()['list'];

        $expenses = collect($expenses);
        $budgets = collect($budgets);

        $allCategories = $expenses->pluck('category')->merge($budgets->pluck('category'))->unique()->values();

        if(!$this->savingAndInvestment) $allCategories = collect($allCategories)->diff([LedgerSecondaryType::Investment->value, LedgerSecondaryType::Saving->value]);
        $responseData = $allCategories->sort()->map(function ($category) use ($expenses, $budgets) {

            $expense = $expenses->where('category', $category)->first();
            $budget = $budgets->where('category', $category)->first();

            $planned = $budget != null ? $budget['amount'] : 0;
            $actual = $expense != null ? $expense['amount'] : 0;
            return [
                'category' => $category,
                'planned' => $planned,
                'actual' => $actual,
                'ok' => $actual < $planned
            ];
        })->values();

        return (new ServiceResponse())->setData([
            'budget' => $responseData,
            'plannedTotal' => round($responseData->sum('planned'), 2),
            'actualTotal' => round($responseData->sum('actual'), 2),
        ]);
    }
}
