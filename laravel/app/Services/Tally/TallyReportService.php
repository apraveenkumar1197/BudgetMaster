<?php

namespace App\Services\Tally;

use App\Models\Sqlite\CreditCard;
use App\Models\Sqlite\Ledger;
use App\Models\Sqlite\Master\PayMode;
use App\Models\Sqlite\Storage;
use App\Services\ServiceResponse;
use App\Services\Storage\StorageListService;
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
        $months = $this->getAllMonths($this->fromMonth, $this->toMonth);
        $cashFlow = $this->ledger($this->fromMonth, $this->toMonth)->keyBy('month');

        $tallyReport = [];
        $opening = $this->closingAsOf(
            Carbon::parse($this->fromMonth)->subMonthNoOverflow()->endOfMonth()->format('Y-m-d')
        );

        foreach ($months as $month) {
            $closing = $this->closingAsOf(Carbon::parse($month)->endOfMonth()->format('Y-m-d'));
            $monthLedger = $cashFlow->get($month);

            $tallyReport[] = [
                'month' => $this->formatMonth ? Carbon::parse($month)->format('M Y') : $month,
                'opening' => $opening,
                'expense' => $monthLedger->debit ?? 0,
                'income' => $monthLedger->credit ?? 0,
                'closing' => $closing,
            ];

            $opening = $closing;
        }

        return (new ServiceResponse())->setData(collect($tallyReport));
    }

    /**
     * Net worth as of a given date. Delegates to StorageListService — the
     * exact same calculation the Storage page's total uses — rather than
     * re-deriving it from raw ledger sums, so Tally/Chart and the Storage
     * page can never drift apart into disagreeing about "closing" again.
     */
    private function closingAsOf($asOfDate)
    {
        return (new StorageListService(null, $asOfDate))->get()->getData()['total'];
    }

    /**
     * Cash-flow figures (income/expense) shown alongside opening/closing —
     * these are informational only and no longer used to derive closing,
     * which now comes from actual storage balances via closingAsOf().
     */
    private function ledger($fromMonth, $toMonth)
    {
        $creditCardNames = CreditCard::pluck('name');
        $creditCardStorgeIds = Storage::whereIn('name', $creditCardNames)->pluck('id');
        $payModeIds = PayMode::whereIn('storage_id', $creditCardStorgeIds)->pluck('id');

        return Ledger::ledger()
            ->whereNotIn('pay_mode', $payModeIds)
            ->whereRaw("DATE_FORMAT(date, '%Y-%m') between ? and ?", [$fromMonth, $toMonth])
            ->selectRaw("DATE_FORMAT(date, '%Y-%m') as month, sum(credit) as credit, sum(debit) as debit")
            ->orderBy('month')
            ->groupBy(DB::raw('month'))
            ->get();
    }
}
