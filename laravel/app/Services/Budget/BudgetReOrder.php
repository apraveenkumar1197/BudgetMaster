<?php

namespace App\Services\Budget;

use App\Enum\HttpStatus;
use App\Models\Sqlite\Budget;
use App\Services\ServiceResponse;

class BudgetReOrder
{
    private $month, $budgetEntries;
    function __construct($month, $budgetEntries)
    {
        $this->month = $month;
        $this->budgetEntries = collect($budgetEntries);
    }

    function reOrder()
    {
        $budgets = Budget::month($this->month)->get();
        if($budgets->count() != $this->budgetEntries->count()){
            return new ServiceResponse('Requested Entries and DB Entries does not match', HttpStatus::ValidationError);
        }

        Budget::month($this->month)->delete();
        Budget::insert($this->formatDbEntries());

        return (new ServiceResponse('Re order successful'));
    }

    function formatDbEntries(): array
    {
        return $this->budgetEntries->map(function($budgetEntry){
           return [
               'month' => $this->month,
               'reason' => $budgetEntry['reason'],
               'category' => $budgetEntry['category'],
               'sub_category' => $budgetEntry['subCategory'],
               'amount' => $budgetEntry['amount'],
           ];
        })->toArray();
    }
}
