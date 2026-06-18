<?php

namespace App\Services\Returns;

use App\Http\Resources\Ledger\Returns\ReturnsListCollection;
use App\Models\Sqlite\Ledger;
use App\Services\ServiceResponse;

class GetReturnsList {
    private $returnsMonth;
    function __construct($returnsMonth)
    {
        $this->returnsMonth = $returnsMonth;
    }

    function get()
    {
        $returns = Ledger::fromCurrentMonth()
            ->returns()
            ->get();
        return (new ServiceResponse())->setData(new ReturnsListCollection($returns));
    }
}
