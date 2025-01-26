<?php

namespace App\Services\Misc;

use App\Enum\LedgerType;
use App\Models\Sqlite\Ledger;

class LedgerFilter
{

    private $ledgerType, $fromDate, $toDate;

    function __construct($ledgerType, $fromDate, $toDate)
    {
        $this->ledgerType = $ledgerType;
        $this->fromDate = $fromDate;
        $this->toDate = $toDate;
    }

    function filter()
    {
        $ledger = new Ledger;
        if($this->ledgerType == LedgerType::Expense)
            $ledger = $ledger->expenses();
        if($this->ledgerType ==LedgerType::Income)
            $ledger = $ledger->incomes();

        if($this->fromDate != null and $this->toDate != null)
            $ledger = $ledger->dateRange($this->fromDate, $this->toDate);

        return $ledger;
    }
}
