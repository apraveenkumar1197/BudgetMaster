<?php

namespace App\Services\Misc;

use App\Models\Sqlite\Master\Category;
use App\Services\ServiceResponse;

class CategoryListService {

    private $ledgerType;
    private $fromDate, $toDate;

    function __construct($ledgerType = null, $fromDate = null, $toDate = null)
    {
        $this->ledgerType = $ledgerType;
        $this->fromDate = $fromDate;
        $this->toDate = $toDate;
    }

    function list()
    {
        $ledger = (new LedgerFilter($this->ledgerType, $this->fromDate, $this->toDate))->filter();
        return (new ServiceResponse())->setData(Category::ids($ledger->pluck('category'))->get());
    }
}
