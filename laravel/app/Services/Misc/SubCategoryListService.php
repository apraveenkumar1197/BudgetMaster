<?php

namespace App\Services\Misc;

use App\Http\Resources\Misc\SubCategoryCollection;
use App\Models\Sqlite\Master\SubCategory;
use App\Services\ServiceResponse;

class SubCategoryListService {

    private $categoryId, $ledgerType, $fromDate, $toDate;

    function __construct($categoryId, $ledgerType = null, $fromDate = null, $toDate = null)
    {
        $this->categoryId = $categoryId;
        $this->ledgerType = $ledgerType;
        $this->fromDate = $fromDate;
        $this->toDate = $toDate;
    }

    function list()
    {
        $ledger = (new LedgerFilter($this->ledgerType, $this->fromDate, $this->toDate))->filter();
        $ledger = $ledger->category($this->categoryId);
        return (new ServiceResponse())->setData(new SubCategoryCollection(SubCategory::ids($ledger->pluck('sub_category'))->get()));
    }
}
