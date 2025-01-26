<?php
namespace App\Services\Ledger\Loan;

use App\Http\Resources\Loan\LoanCollection;
use App\Models\Sqlite\Ledger;

class LoanListService {

    public function get(){
        return [
            "data"=>new LoanCollection(Ledger::loans()->get()),
            "status"=>200
        ];
    }
}
