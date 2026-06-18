<?php

namespace App\Services;

use App\Models\Sqlite\Ledger;
use Carbon\Carbon;

class RecursiveDuesReturnsProcessor
{
    function process()
    {
        $this->processDuesReturns();
    }

    private function processDuesReturns()
    {
        $this->processDues();
        $this->processReturns();
    }

    private function processDues(){
        Ledger::dues()->month()->recurring()->each(function ($ledger) {
            $this->processLedger($ledger);
        });
    }
    private function processReturns(){
        Ledger::returns()->month()->recurring()->each(function ($ledger) {
            $this->processLedger($ledger);
        });
    }

    private function processLedger($ledger){
        if((Carbon::parse($ledger->recurring_till)->toDateString()) < (Carbon::now()->toDateString()))
            return true;

        $nextLedgerDate = Carbon::parse($ledger->date)->addMonths($ledger->recurring_frequency);
        $this->replicateLedger($ledger, $nextLedgerDate);

        if($ledger->recurring_frequency <= 4){
            $nextLedgerDate = $nextLedgerDate->addMonths($ledger->recurring_frequency);
            $this->replicateLedger($ledger, $nextLedgerDate);

            $nextLedgerDate = $nextLedgerDate->addMonths($ledger->recurring_frequency);
            $this->replicateLedger($ledger, $nextLedgerDate);
        }
        return true;
    }

    private function replicateLedger($ledger, $nextLedgerDate){
        $duplicateLedger = Ledger::reason($ledger->name)
            ->category($ledger->category)
            ->subCategory($ledger->sub_category)
            ->date($nextLedgerDate->toDateString())
            ->first();

        if($duplicateLedger != NULL) return;

        $nextLedger = $ledger->replicate();
        $nextLedger->date = $nextLedgerDate->toDateString();
        $nextLedger->save();
    }
}
