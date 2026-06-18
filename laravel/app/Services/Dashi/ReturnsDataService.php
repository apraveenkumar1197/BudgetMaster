<?php

namespace App\Services\Dashi;

use App\Models\Sqlite\Ledger;
use App\Services\ServiceResponse;
use Carbon\Carbon;

class ReturnsDataService {
    function get()
    {
        $month = Carbon::now()->format('Y-m');
        $nextMonth = Carbon::now()->addMonth()->format('Y-m');

        /*return (new ServiceResponse())->setData([
            ['month' => $month, 'count' => $this->getReturnsByMonth($month)],
            ['month' => $nextMonth, 'count' => $this->getReturnsByMonth($nextMonth)]
        ]);*/

        $returns = $this->getReturnsByMonth($month);
        $returnsCount = $returns->count();
        $returnsCountDisplay = $returnsCount - 1;
        return (new ServiceResponse())->setData($returnsCount > 0 ? [
            'reason' => $returns[0]->reasonData->reason,
            'count' => $returnsCount > 1 ? "and $returnsCountDisplay more" : '',
            'amount' => $returns->sum('credit')
        ] : null);
    }

    private function getReturnsByMonth($month){
        return Ledger::returns()
            ->month($month)
            ->get();
    }
}
