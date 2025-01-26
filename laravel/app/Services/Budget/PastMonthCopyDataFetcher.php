<?php

namespace App\Services\Budget;

use App\Models\Sqlite\Budget;
use App\Services\ServiceResponse;

class PastMonthCopyDataFetcher
{
    function fetch()
    {
        $budgetEntries = Budget::where('month', $this->month())->get();
        return (new ServiceResponse())->setData([
            'budget_entries' => $budgetEntries
        ]);
    }

    function month()
    {
        return Budget::max('month');
    }
}
