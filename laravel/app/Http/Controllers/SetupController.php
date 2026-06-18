<?php

namespace App\Http\Controllers;

use App\Services\Ledger\Loan\AddLoanService;
use App\Services\Ledger\Loan\LoanListService;
use App\Services\Misc\UpdateRegisterStatus;
use App\Validators\Investment\AddInvestmentValidator;
use Illuminate\Http\Request;

class SetupController extends Controller
{
    function loanList(){
        return $this->http_response((new LoanListService())->get());
    }
    function addLoan(Request $request){
        $validator = new AddInvestmentValidator($request);
        if($validator->isValid())
            return $this->http_response((new AddLoanService($request->reason, $request->category, $request->amount))->add());
        else
            return $validator->respondValidationError();
    }


    function updateRegisterStatus(){
        return $this->http_response((new UpdateRegisterStatus())->update());
    }
}
