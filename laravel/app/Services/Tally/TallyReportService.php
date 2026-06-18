<?php

namespace App\Services\Tally;

use App\Enum\LedgerType;
use App\Models\Sqlite\CreditCard;
use App\Models\Sqlite\Ledger;
use App\Models\Sqlite\Master\PayMode;
use App\Models\Sqlite\Storage;
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
        $creditCards = $this->getCreditCards($this->fromMonth, $this->toMonth);
        foreach ($this->ledger($this->fromMonth, $this->toMonth) as $ledger) {
            $creditCardCredit = 0;
            if(isset($creditCards[$ledger->month]))
                $creditCardCredit = $creditCards[$ledger->month];
            $credit = $ledger->credit;
            //$closing = $opening + ($credit - $creditCardCredit) - $ledger->debit;
            $closing = $opening + $credit - $ledger->debit;

            $tallyReport[] = [
                'month' => $ledger->month,
                'opening' => $opening,
                'expense' => $ledger->debit,
                'income' => $credit,
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
        $creditCardNames = CreditCard::pluck('name');
        $creditCardStorgeIds = Storage::whereIn('name', $creditCardNames)->pluck('id');
        $payModeIds = PayMode::whereIn('storage_id', $creditCardStorgeIds)->pluck('id');

        return Ledger::ledger()
            ->whereNotIn('pay_mode', $payModeIds)
            ->whereRaw("month between ? and ?", [$fromMonth, $toMonth])
            ->selectRaw("strftime('%Y-%m', date) as month, sum(credit) as credit, sum(debit) as debit")
            ->orderBy('month')
            ->groupBy(DB::raw('month'))
            ->get();
    }

    function getCreditCards($fromMonth, $toMonth)
    {
        $creditCardNames = CreditCard::pluck('name');
        $creditCardStorgeIds = Storage::whereIn('name', $creditCardNames)->pluck('id');
        $payModeIds = PayMode::whereIn('storage_id', $creditCardStorgeIds)->pluck('id');

        return Ledger::ledger()
            ->whereIn('pay_mode', $payModeIds)
            ->whereRaw("month between ? and ?", [$fromMonth, $toMonth])
            ->selectRaw("strftime('%Y-%m', date) as month, sum(debit) - sum(credit) as credit")
            ->orderBy('month')
            ->groupBy(DB::raw('month'))
            ->pluck('credit', 'month')
            ->toArray();
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

            if ($this->formatMonth)
                $entryFormatted['month'] = Carbon::parse($months[$i])->format('M Y');

            $entries[] = $entryFormatted;

            $closing = $entry != null ? $entry['closing'] : $closing;
            $opening = $closing;
        }
        return $entries;
    }
}
