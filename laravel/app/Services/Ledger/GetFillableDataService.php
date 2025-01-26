<?php

namespace App\Services\Ledger;

use App\Enum\LedgerType;
use App\Http\Resources\Ledger\Expense\ExpenseReportResource;
use App\Models\Sqlite\Ledger;
use App\Services\Misc\ReasonService;
use App\Services\ServiceResponse;

class GetFillableDataService
{
    private $ledgerType, $reasonId;

    function __construct($ledgerType, $reason)
    {
        $this->ledgerType = $ledgerType;
        $this->reasonId = (new ReasonService($reason))->getId();
    }

    function get()
    {
        $ledger = Ledger::reason($this->reasonId);
        if($this->ledgerType == LedgerType::Expense)
            $ledger->expenses();
        elseif($this->ledgerType == LedgerType::Income)
            $ledger->incomes();

        $ledger = $ledger->latest()->first();

        return (new ServiceResponse())->setData(new ExpenseReportResource($ledger));
    }
}
