<?php

namespace App\Services\Dashi;

use App\Models\Sqlite\Ledger;
use App\Services\ServiceResponse;
use Carbon\Carbon;

class DueDataService {
    function get()
    {
        $month = Carbon::now()->format('Y-m');
        $nextMonth = Carbon::now()->addMonth()->format('Y-m');

       /* return (new ServiceResponse())->setData([
            ['month' => $month, 'count' => $this->getDuesByMonth($month)],
            ['month' => $nextMonth, 'count' => $this->getDuesByMonth($nextMonth)]
        ]);*/

        $dues = $this->getDuesByMonth($month);
        $dueCount = $dues->count();
        $dueCountDisplay = $dueCount - 1;
        return (new ServiceResponse())->setData($dueCount > 0 ? [
            'reason' => $dues[0]->reasonData->reason,
            'count' => $dueCount > 1 ? "and $dueCountDisplay more" : '',
            'amount' => $dues->sum('debit')
        ] : null);
    }

    private function getDuesByMonth($month){
        return Ledger::dues()
            ->month($month)
            ->get();
    }
}
