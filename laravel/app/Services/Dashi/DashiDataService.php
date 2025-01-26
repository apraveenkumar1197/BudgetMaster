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
        ]);
    }
}
