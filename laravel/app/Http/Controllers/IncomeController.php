<?php

namespace App\Http\Controllers;

use App\Enum\LedgerType;
use App\Services\Ledger\Expense\UpdateExpenseService;
use App\Services\Ledger\GetFillableDataService;
use App\Services\Ledger\Income\AddIncomeService;
use App\Services\Ledger\Income\DeleteIncomeService;
use App\Services\Ledger\Income\GetAddIncomeInitDataService;
use App\Services\Ledger\Income\IncomeListService;
use App\Services\Ledger\Income\IndividualIncomeReport;
use App\Services\Ledger\Income\UpdateIncomeService;
use App\Validators\Expense\AddExpenseValidator;
use Illuminate\Http\Request;

class IncomeController extends Controller
{
    function initData()
    {
        return $this->http_response((new GetAddIncomeInitDataService())->get());
    }

    function fillable(Request $request)
    {
        return $this->http_response((new GetFillableDataService(LedgerType::Income, $request->reason))->get());
    }
    function add(Request $request)
    {
        $validator = new AddExpenseValidator($request);
        if (!$validator->isValid()) return $validator->respondValidationError();
        return $this->http_response((new AddIncomeService($request->date, $request->reason, $request->category, $request->subCategory, $request->description, $request->amount, $request->payMode))->add());
    }

    function update($id, Request $request)
    {
        $validator = new AddExpenseValidator($request);
        if (!$validator->isValid()) return $validator->respondValidationError();
        return $this->http_response((new UpdateIncomeService($id, $request->date, $request->reason, $request->category, $request->subCategory, $request->description, $request->amount, $request->payMode))->update());
    }

    function delete($id)
    {
        return $this->http_response((new DeleteIncomeService($id))->delete());
    }

    function list(Request $request, string $period)
    {
        $validated = validator([
            'filter' => $request->query('filter', 'month'),
            'period' => $period,
        ], [
            'filter' => 'required|in:day,month',
            'period' => $request->query('filter') === 'day' ? 'date_format:Y-m-d' : 'date_format:Y-m',
        ])->validate();

        return $this->http_response((new IncomeListService())->get($period, $validated['filter']));
    }

    function individualReport(Request $request)
    {
        return $this->http_response((new IndividualIncomeReport($request->searchTerm, $request->fromDate, $request->toDate, $request->reason, $request->category, $request->subCategory, $request->payMode))->report());
    }
}
