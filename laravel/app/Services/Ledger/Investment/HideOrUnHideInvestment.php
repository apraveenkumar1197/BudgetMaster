<?php

namespace App\Services\Ledger\Investment;

use App\Enum\HttpStatus;
use App\Models\Sqlite\InvestmentHide;
use App\Models\Sqlite\Ledger;
use App\Services\ServiceResponse;
use Exception;

class HideOrUnHideInvestment
{
    private $investmentReasonId, $toHide;

    function __construct($investmentReasonId, $toHide)
    {
        $this->investmentReasonId = $investmentReasonId;
        $this->toHide = $toHide;
    }

    function update()
    {
        try {
            if($this->toHide){
                InvestmentHide::create([
                   'investment_reason' => $this->investmentReasonId
                ]);
            }
            else{
                InvestmentHide::reason($this->investmentReasonId)->delete();
            }
            return new ServiceResponse("Investment " . ($this->toHide ? "hided" : "un hided"));
        }
        catch (Exception $e) {
            return new ServiceResponse('Error in updating investment', HttpStatus::Error, $e);
        }
    }
}
