<?php

namespace App\Services\Ledger\Expense;


use App\Http\Resources\Ledger\Expense\ReasonSuggestableDataCollection;
use App\Models\Sqlite\Ledger;
use Illuminate\Support\Facades\DB;

class ReasonSuggestibleDataExpenseService {
    function get(){
        $ids = DB::select("select * from (select id from ledgers order by date) where type='expense' group by name")->pluck('id');
        $ledgers = Ledger::wheredIn('id',$ids)->get();
        return [
            "data" => new ReasonSuggestableDataCollection($ledgers),
            "status" => 200
        ];
    }
}
