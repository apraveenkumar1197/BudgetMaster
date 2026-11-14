<?php

namespace App\Services\Ledger\Income;

use App\Http\Resources\Ledger\Income\IncomeReportCollection;
use App\Models\Sqlite\Ledger;
use App\Services\ServiceResponse;

class IncomeListService
{
    function get(string $period, string $filter)
    {
        $query = Ledger::incomes();
        $incomes = ($filter === 'day' ? $query->date($period) : $query->month($period))
            ->orderByDesc('date')
            ->get();
        return (new ServiceResponse())
            ->setData(new IncomeReportCollection($incomes));
    }
}
