<?php

namespace App\Services\Dashi;

use App\Models\Sqlite\Ledger;
use App\Models\Sqlite\Master\Category;
use App\Services\ServiceResponse;
use App\Traits\UtilTrait;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class DashiDataService
{
    use UtilTrait;

    function get()
    {
        $chartData = new ChartDataService();
        $dues = new DueDataService();
        $returns = new ReturnsDataService();

        return (new ServiceResponse())->setData([
            'chart' => $chartData->get()->getData(),
            'dues' => $dues->get()->getData(),
            'returns' => $returns->get()->getData(),
            'expenses' => Ledger::month()
                ->expenses()
                ->join('categories', 'categories.id', '=', 'ledgers.category')
                ->selectRaw('categories.category as category, round(sum(ledgers.debit), 2) as amount')
                ->groupBy('ledgers.category')
                ->orderBy('categories.order')
                ->get(),
            'incomes' => Ledger::month()
                ->incomes()
                ->join('categories', 'categories.id', '=', 'ledgers.category')
                ->selectRaw('categories.category as category, round(sum(ledgers.credit), 2) as amount')
                ->groupBy('ledgers.category')
                ->orderBy('categories.order')
                ->get()
        ]);
    }
}
