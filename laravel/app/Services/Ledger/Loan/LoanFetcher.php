<?php
namespace App\Services\Ledger\Loan;

use App\Models\Sqlite\Ledger;
use App\Services\ServiceResponse;

class LoanFetcher
{

    function fetch()
    {
        $loans = Ledger::loans()
            ->selectRaw("*,sum(credit) as amount")
            ->groupBy('name')
            ->get();
        $loansPaid = Ledger::loanPaid()
            ->selectRaw("*,sum(debit) as amount")
            ->groupBy('name')
            ->get();

        $loansFormatted = [];
        foreach ($loans as $loan) {
            $loanPaidAmount = 0;
            $loanPaid = $loansPaid->where('name', $loan->name)->first();

            if($loanPaid != null)
                $loanPaidAmount = $loanPaid->amount;

            $finalLoanAmount = $loan->amount - $loanPaidAmount;
            if($finalLoanAmount == 0)
                continue;

            $loansFormatted[] = [
                'reason_id' => $loan->name,
                'reason' => $loan->reasonData->reason,
                'category' => $loan->subCategory != null ? $loan->subCategory->sub_category : null,
                'amount' => $finalLoanAmount
            ];

        }

        $loansFormatted = collect($loansFormatted);
        return (new ServiceResponse())->setData([
            'list' => $loansFormatted,
            'total' => $loansFormatted->sum('amount'),
        ]);
    }
}
