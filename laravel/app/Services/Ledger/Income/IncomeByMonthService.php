<?php

namespace App\Services\Ledger\Income;

use App\Http\Resources\Ledger\Income\IncomeReportCollection;
use App\Models\Sqlite\Ledger;
use App\Services\ServiceResponse;

class IncomeByMonthService
{
    private $month;

    function __construct($month)
    {
        $this->month = $month;
    }

    function get()
    {
        $incomes = Ledger::incomes()
            ->month($this->month)
            ->orderByDesc('date')
            ->get();
        return (new ServiceResponse())
            ->setData(new IncomeReportCollection($incomes));
    }
}
