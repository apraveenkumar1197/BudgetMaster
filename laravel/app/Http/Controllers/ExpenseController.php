<?php

namespace App\Http\Controllers;

use App\Enum\LedgerType;
use App\Services\Ledger\Expense\AddExpenseService;
use App\Services\Ledger\Expense\DeleteExpenseService;
use App\Services\Ledger\Expense\ExpenseByDateService;
use App\Services\Ledger\Expense\GetAddExpenseInitDataService;
use App\Services\Ledger\Expense\IndividualExpenseReport;
use App\Services\Ledger\Expense\ReasonSuggestibleDataExpenseService;
use App\Services\Ledger\Expense\UpdateExpenseService;
use App\Services\Ledger\GetFillableDataService;
use App\Validators\Expense\AddExpenseValidator;
use Illuminate\Http\Request;

class ExpenseController extends Controller
{
    function initData()
    {
        return $this->http_response((new GetAddExpenseInitDataService())->get());
    }

    function fillable(Request $request)
    {
        return $this->http_response((new GetFillableDataService(LedgerType::Expense, $request->reason))->get());
    }

    function show()
    {

    }

    function add(Request $request)
    {
        $validator = new AddExpenseValidator($request);
        if ($validator->isValid()) {
            return $this->http_response((new AddExpenseService($request->date, $request->reason, $request->category, $request->subCategory, $request->description, $request->amount, $request->payMode))->add());
        } else {
            return $validator->respondValidationError();
        }
    }

    function update($id, Request $request)
    {
        $validator = new AddExpenseValidator($request);
        if (!$validator->isValid()) return $validator->respondValidationError();
        return $this->http_response((new UpdateExpenseService($id, $request->date, $request->reason, $request->category, $request->subCategory, $request->description, $request->amount, $request->payMode))->update());
    }

    function delete($id)
    {
        return $this->http_response((new DeleteExpenseService($id))->delete());
    }

    function getByDate($date)
    {
        return $this->http_response((new ExpenseByDateService($date))->get());
    }

    function getSuggestibleDataByReason()
    {
        return $this->http_response((new ReasonSuggestibleDataExpenseService())->get());
    }

    function individualReport(Request $request)
    {
        return $this->http_response((new IndividualExpenseReport($request->searchTerm, $request->fromDate, $request->toDate, $request->reason, $request->category, $request->subCategory, $request->payMode))->report());
    }
}
