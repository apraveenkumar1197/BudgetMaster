<?php

namespace App\Services\Due;

use App\Http\Resources\Ledger\Dues\DueListCollection;
use App\Models\Sqlite\Ledger;
use App\Services\ServiceResponse;

class GetMonthDues
{
    private $month;

    function __construct($month)
    {
        $this->month = $month;
    }

    function get()
    {
        $dues = Ledger::month($this->month)
            ->dues()
            ->get();
        return (new ServiceResponse())->setData(new DueListCollection($dues));
    }
}
