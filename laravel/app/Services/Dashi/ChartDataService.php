<?php

namespace App\Services\Dashi;

use App\Models\Sqlite\Ledger;
use App\Models\Sqlite\Master\Category;
use App\Services\ServiceResponse;
use App\Services\Tally\TallyReportService;
use App\Traits\UtilTrait;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class ChartDataService
{
    use UtilTrait;
    function get()
    {
        $fromMonth = '2020-01';
        $toMonth = Carbon::now()->format('Y-m');
        $monthClosing = (new TallyReportService($fromMonth, $toMonth, false))->report()->getData();
        $monthClosing = $monthClosing->reverse()->slice(0, 12)->reverse();

        return (new ServiceResponse())->setData([
            'closing' => $this->fillReport($monthClosing->values())->pluck('closing'),
            'expenses' => $this->fillReport($this->expenses())->pluck('amount'),
            'incomes' => $this->fillReport($this->incomes())->pluck('amount'),
            'savings' => $this->fillReport($this->savings())->pluck('amount'),
            'months' => $this->months()
        ]);
    }

    private function savings()
    {
        $categoryIds = Category::whereIn('category', ['Investment', 'Saving'])->pluck('id');
        return Ledger::expenses()
            ->category($categoryIds)
            ->selectRaw('strftime("%Y-%m", date) as month, sum(debit) as amount')
            ->orderByDesc('month')
            ->groupBy(DB::raw('month'))
            ->limit(12)
            ->get();
    }

    private function incomes()
    {
        return Ledger::incomes()
            ->whereNotIn('category', [Category::investmentReturns()->first()->id])
            ->selectRaw('strftime("%Y-%m", date) as month, sum(credit) as amount')
            ->orderByDesc('month')
            ->groupBy(DB::raw('month'))
            ->limit(12)
            ->get();
    }
    private function expenses()
    {
        $categoryIds = Category::whereNotIn('category', ['Investment', 'Saving'])->pluck('id');
        return Ledger::expenses()
            ->category($categoryIds)
            ->selectRaw('strftime("%Y-%m", date) as month, sum(debit) as amount')
            ->orderByDesc('month')
            ->groupBy(DB::raw('month'))
            ->limit(12)
            ->get();
    }

    function fillReport($chartEntries)
    {
        $entries = [];
        $months = $this->months(false);
        for ($i = 0; $i < count($months); $i++) {
            $entry = $chartEntries->where('month', $months[$i])->first();

            if(isset($entry['amount']))
                $entry['amount'] = round($entry['amount']);
            if(isset($entry['closing']))
                $entry['closing'] = round($entry['closing']);

            $entries[] = $entry != null ? $entry : [
                'month' => $months[$i],
                'amount' => 0,
            ];
        }
        return collect($entries);
    }

    function months($format = true){
        $months = [];

        for ($month = 0; $month < 12; $month++) {
            $date = (new Carbon('first day of this month'))->subMonths($month);
            if($format)
                $months[] = $date->format('M y');
            else
                $months[] = $date->format('Y-m');
        }
        return array_reverse($months);
    }
}
