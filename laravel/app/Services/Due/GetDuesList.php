<?php

namespace App\Services\Due;

use App\Http\Resources\Ledger\Dues\DueListCollection;
use App\Models\Sqlite\Ledger;
use App\Services\ServiceResponse;

class GetDuesList {
    private $dueMonth;
    function __construct($dueMonth)
    {
        $this->dueMonth = $dueMonth;
    }

    function get()
    {
        $dues = Ledger::fromCurrentMonth()
            ->dues()
            ->get();
        return (new ServiceResponse())->setData(new DueListCollection($dues));
    }
}
