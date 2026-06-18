<?php

namespace App\Services\Ledger\Investment;

use App\Http\Resources\Investment\InvestmentMonthlySubCategoryCollection;
use App\Models\Sqlite\Ledger;
use App\Services\ServiceResponse;

class GetInvestmentCategoryByMonth
{

    private $month;

    function __construct($month)
    {
        $this->month = $month;
    }

    function get()
    {
        $investments = Ledger::investments()
            ->month($this->month)
            ->groupBy('sub_category')
            ->selectRaw('sub_category, sum(debit) as amount')
            ->get();
        return (new ServiceResponse())->setData(new InvestmentMonthlySubCategoryCollection($investments));
    }
}
