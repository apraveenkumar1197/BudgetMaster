<?php

namespace App\Services\Budget;

use App\Enum\ColorCode;
use App\Models\Sqlite\Budget;
use App\Models\Sqlite\Ledger;
use App\Services\ServiceResponse;

class BudgetList
{
    private $month, $isIndividualFlag;

    function __construct($month, $isIndividualFlag = 'N')
    {
        $this->month = $month;
        $this->isIndividualFlag = $isIndividualFlag == 'Y';
    }

    function list()
    {
        if (!$this->isIndividualFlag) {
            $budgets = Budget::month($this->month)
                ->categoryWise()
                ->get();
            $responseFormatted = $budgets->map(function ($budget) {
                return [
                    'category' => $budget->categoryData->category,
                    'amount' => $budget->amount,
                ];
            });
        } else {
            $reasonsByName = $this->reasonsByName();
            $budgets = Budget::month($this->month)->get();
            $responseFormatted = $budgets->map(function ($budget) use ($reasonsByName) {
                return [
                    'reason' => $budget->reasonData == null ? null : [
                        'id' => $budget->reason,
                        'name' => $budget->reasonData->reason
                    ],
                    'category' => $budget->categoryData == null ? null : [
                        'id' => $budget->category,
                        'name' => $budget->categoryData->category,
                    ],
                    'subCategory' => $budget->subCategory == null ? null : [
                        'id' => $budget->sub_category,
                        'name' => $budget->subCategory->sub_category
                    ],
                    'amount' => $budget->amount,
                    'id' => $budget->id,
                    'is_expense_added' => isset($reasonsByName[$budget->reason]) or $budget->amount == 0,
                    'colorFlag' => $this->colorFlag($budget->amount, $reasonsByName[$budget->reason] ?? [])
                ];
            });
        }

        return (new ServiceResponse())->setData([
            'list' => $responseFormatted,
            'totalAmount' => $responseFormatted->sum('amount')
        ]);
    }

    function reasonsByName()
    {
        $reasons = Ledger::expenses()->month($this->month)->select('name', 'debit')->get();
        return $reasons->groupBy('name');
    }

    function colorFlag($amount, $expenseReasons)
    {
        $totalAmount = collect($expenseReasons)->sum('debit');
        if($amount < 0) return ColorCode::Blink;
        if(empty($expenseReasons) and $amount != 0) return ColorCode::White;
        if($amount <= $totalAmount or $amount == 0) return ColorCode::Green;
        return ColorCode::Yellow;
    }
}
