<?php

namespace App\Http\Controllers;

use App\Services\Ledger\Investment\AddInvestmentService;
use App\Services\Ledger\Investment\GetInvestmentCategoryByMonth;
use App\Services\Ledger\Investment\HideOrUnHideInvestment;
use App\Services\Ledger\Investment\InvestmentListService;
use App\Services\Ledger\Investment\MyInvestmentListService;
use App\Validators\Investment\AddInvestmentValidator;
use Illuminate\Http\Request;

class InvestmentController extends Controller
{
    function index()
    {
        return $this->http_response((new InvestmentListService())->get());
    }

    function list(Request $request)
    {
        return $this->http_response((new MyInvestmentListService($request->showHidden == 'Y'))->get());
    }

    function hide(Request $request)
    {
        return $this->http_response((new HideOrUnHideInvestment($request->investmentReasonId, true))->update());
    }

    function unHide(Request $request)
    {
        return $this->http_response((new HideOrUnHideInvestment($request->investmentReasonId, false))->update());
    }
    function create(Request $request)
    {
        $validator = new AddInvestmentValidator($request);
        if ($validator->isValid())
            return $this->http_response((new AddInvestmentService($request->reason, $request->category, $request->amount))->add());
        else
            return $validator->respondValidationError();
    }

    function subCategoryMonthWise(Request $request)
    {
        return $this->http_response((new GetInvestmentCategoryByMonth($request->month))->get());

    }
}
