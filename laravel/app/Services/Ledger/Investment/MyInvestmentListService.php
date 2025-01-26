<?php

namespace App\Services\Ledger\Investment;

use App\Http\Resources\Investment\InvestmentCollection;
use App\Http\Resources\Investment\MyInvestmentCollection;
use App\Models\Sqlite\InvestmentHide;
use App\Models\Sqlite\Ledger;
use App\Services\ServiceResponse;

class MyInvestmentListService
{
    private $showHidden;
    public function __construct($showHidden)
    {
        $this->showHidden = $showHidden;
    }

    public function get()
    {

        $myInvestments = Ledger::expenses()
            ->investmentsAndSavings()
            ->selectRaw("*,sum(debit) as amount")
            ->groupBy('name')
            ->get();
        $investmentReturns = Ledger::incomes()
            ->investmentsAndSavingsReturns()
            ->selectRaw("*,sum(credit) as amount")
            ->groupBy('name')
            ->get();
        $investmentHideIds = InvestmentHide::all()->pluck('investment_reason');

        $myInvestmentsFormatted = [];
        foreach ($myInvestments as $investment){
            $investmentReturnAmount = 0;
            $returns = $investmentReturns->where('name', $investment->name)->first();
            if($returns != null){
                $investmentReturnAmount = $returns->amount;
            }

            $investedAmount = $investment->amount - $investmentReturnAmount;
            if(!$investmentHideIds->contains($investment->name) || $this->showHidden) {
                $myInvestmentsFormatted[] = [
                    'reason_id' => $investment->name,
                    'reason' => $investment->reasonData->reason,
                    'category' => $investment->subCategory->sub_category,
                    'amount' => $investedAmount
                ];
            }
        }

        $myInvestmentsFormatted = collect($myInvestmentsFormatted);
        return (new ServiceResponse())->setData([
            'list' => $myInvestmentsFormatted,
            'total' => $myInvestmentsFormatted->sum('amount'),
        ]);
    }
}
