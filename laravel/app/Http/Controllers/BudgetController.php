<?php

namespace App\Http\Controllers;

use App\Services\Budget\AddBudgetEntry;
use App\Services\Budget\BudgetList;
use App\Services\Budget\BudgetReOrder;
use App\Services\Budget\DeleteBudgetEntry;
use App\Services\Budget\PastMonthDataCopier;
use App\Services\Budget\ReviewBudget;
use App\Services\Budget\UpdateBudgetEntry;
use App\Services\Ledger\Expense\GetAddExpenseInitDataService;
use Illuminate\Http\Request;

class BudgetController extends Controller
{
    public function index(Request $request)
    {
        return $this->http_response((new ReviewBudget($request->month, $request->savingAndInvestment))->review());
    }

    public function create()
    {
        return $this->http_response((new GetAddExpenseInitDataService())->get());
    }

    public function store(Request $request)
    {
        return $this->http_response((new AddBudgetEntry($request->month, $request->reason, $request->category, $request->subCategory, $request->amount))->add());
    }

    public function reOrder(Request $request){
        return $this->http_response((new BudgetReOrder($request->month, $request->budgetEntries))->reOrder());
    }

    public function copyPreviousMonth(Request $request){
        return $this->http_response((new PastMonthDataCopier($request->month))->copy());
    }

    public function update($id, Request $request)
    {
        return $this->http_response((new UpdateBudgetEntry($id, $request->month, $request->reason, $request->category, $request->subCategory, $request->amount))->update());
    }

    public function show($month, Request $request)
    {
        return $this->http_response((new BudgetList($month, $request->isIndividualFlag))->list());
    }

    public function destroy($id)
    {
        return $this->http_response((new DeleteBudgetEntry($id))->delete());
    }
}
