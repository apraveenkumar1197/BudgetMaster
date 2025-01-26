<?php

namespace App\Services\Ledger\Expense;

use App\Enum\LedgerType;
use App\Http\Resources\Ledger\Expense\ExpenseReportCollection;
use App\Models\Sqlite\Ledger;
use App\Services\Misc\CategoryListService;
use App\Services\Misc\PayModeListService;
use App\Services\Misc\ReasonListService;
use App\Services\ServiceResponse;

class IndividualExpenseReport {

    private $searchTerm,$fromDate, $toDate, $reason, $category, $subCategory, $payMode;

    function __construct($searchTerm, $fromDate, $toDate, $reason, $category, $subCategory, $payMode)
    {
        $this->searchTerm = $searchTerm;
        $this->fromDate = $fromDate;
        $this->toDate = $toDate;
        $this->reason = $reason;
        $this->category = $category;
        $this->subCategory = $subCategory;
        $this->payMode = $payMode;
    }

    function report()
    {
        $ledgerType = LedgerType::Expense;
        $ledgers = Ledger::search($this->searchTerm)
            ->dateRange($this->fromDate, $this->toDate)
            ->reason($this->reason)
            ->category($this->category)
            ->subCategory($this->subCategory)
            ->payMode($this->payMode)
            ->selectRaw("*,ledgers.name,ledgers.category,ledgers.sub_category")
            ->expenses()
            ->orderByDesc('date')
            ->get();
        $expenseCollection =  new ExpenseReportCollection($ledgers);
        return (new ServiceResponse())->setData([
            'init' => [
                'reasons' => (new ReasonListService($ledgerType))->list()->getData(),
                'categories' => (new CategoryListService($ledgerType))->list()->getData(),
                'payModes' => (new PayModeListService($ledgerType))->list()->getData(),
            ],
            'list' => $expenseCollection,
            'total' => $ledgers->sum('debit')
        ]);
    }
}
