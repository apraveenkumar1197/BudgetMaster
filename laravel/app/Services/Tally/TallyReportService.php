<?php

namespace App\Services\Tally;

use App\Models\Sqlite\Ledger;
use App\Services\ServiceResponse;
use App\Traits\UtilTrait;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class TallyReportService
{
    use UtilTrait;

    private $fromMonth, $toMonth, $formatMonth;

    function __construct($fromMonth, $toMonth, $formatMonth = true)
    {
        $this->fromMonth = $fromMonth;
        $this->toMonth = $toMonth;
        $this->formatMonth = $formatMonth;
    }

    function report()
    {
        $tallyReport = [];
        $opening = $this->opening($this->fromMonth);
        foreach ($this->ledger($this->fromMonth, $this->toMonth) as $ledger) {
            $closing = $opening + $ledger->credit - $ledger->debit;
            $tallyReport[] = [
                'month' => $ledger->month,
                'opening' => $opening,
                'expense' => $ledger->debit,
                'income' => $ledger->credit,
                'closing' => $closing
            ];
            $opening = $closing;
        }
        return (new ServiceResponse())->setData(collect($this->fillTallyEntries($tallyReport)));
    }

    private function opening($fromMonth)
    {
        return Ledger::ledger()->whereRaw("strftime('%Y-%m', date) < ?", [$fromMonth])->selectRaw("IFNULL(sum(IFNULL(credit, 0)) - sum(IFNULL(debit, 0)), 0) as amount")->first()->amount;
    }

    private function ledger($fromMonth, $toMonth)
    {
        return Ledger::ledger()->whereRaw("month between ? and ?", [$fromMonth, $toMonth])
            ->selectRaw("strftime('%Y-%m', date) as month, sum(credit) as credit, sum(debit) as debit")
            ->orderBy('month')
            ->groupBy(DB::raw('month'))
            ->get();
    }

    private function fillTallyEntries($tallyEntries)
    {
        $tallyEntries = collect($tallyEntries);
        $entries = [];
        $months = $this->getAllMonths($this->fromMonth, $this->toMonth);
        $opening = $tallyEntries->first()['opening'];
        $closing = $opening;
        for ($i = 0; $i < count($months); $i++) {
            $entry = $tallyEntries->where('month', $months[$i])->first();
            $entryFormatted = $entry != null ? $entry : [
                'month' => $months[$i],
                'opening' => $opening,
                'expense' => 0,
                'income' => 0,
                'closing' => $closing
            ];

            if($this->formatMonth)
                $entryFormatted['month'] = Carbon::parse($months[$i])->format('M Y');

            $entries[] = $entryFormatted;

            $closing = $entry != null ? $entry['closing'] : $closing;
            $opening = $closing;
        }
        return $entries;
    }
}
