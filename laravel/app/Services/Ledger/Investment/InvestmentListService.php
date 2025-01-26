<?php
namespace App\Services\Ledger\Investment;

use App\Http\Resources\Investment\InvestmentCollection;
use App\Models\Sqlite\Ledger;
use App\Services\ServiceResponse;

class InvestmentListService {
    public function get(){
        $myInvestments = new InvestmentCollection(Ledger::investmentsAndSavings()->get());
        return (new ServiceResponse())->setData($myInvestments);
    }
}
