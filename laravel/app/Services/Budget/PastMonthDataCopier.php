<?php

namespace App\Services\Budget;

use App\Models\Sqlite\Budget;
use App\Services\ServiceResponse;
use Carbon\Carbon;

class PastMonthDataCopier
{
    private $month;
    function __construct($month)
    {
        $this->month = $month;
    }

    function copy()
    {
        $pastMonth = Carbon::parse($this->month)->subMonth();
        $budgets = Budget::month($pastMonth->format('Y-m'))->get();

        foreach ($budgets as $budget) {
            $newOrder = $budget->replicate();
            $newOrder->month = $this->month;
            $newOrder->save();
        }

        $pastMonthFormatted = $pastMonth->format("M Y");
        return new ServiceResponse("Data copied from $pastMonthFormatted" );
    }
}
