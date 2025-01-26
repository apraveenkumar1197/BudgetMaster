<?php

namespace App\Services\Storage;

use App\Enum\LedgerType;
use App\Models\Sqlite\Ledger;
use App\Models\Sqlite\Master\PayMode;
use App\Models\Sqlite\Storage;
use App\Services\ServiceResponse;
use Illuminate\Support\Carbon;

class TransferStorageService{
    private $date, $fromStorageId, $toStorageId, $amount;

    public function __construct($date, $fromStorageId, $toStorageId, $amount){;
        $this->date = $date;
        $this->fromStorageId = $fromStorageId;
        $this->toStorageId = $toStorageId;
        $this->amount = $amount;
    }

    public function transfer(){
        try {
            Ledger::create([
                'date' => $this->date,
                'debit' => $this->amount,
                'pay_mode' => Storage::find($this->fromStorageId)->payModes->first()->id ,
            ]);
            Ledger::create([
                'date' => $this->date,
                'credit' => $this->amount,
                'pay_mode' => Storage::find($this->toStorageId)->payModes->first()->id ,
            ]);

            return new ServiceResponse('Transfer Completed');
        }
        catch (\Exception $e) {
            return new ServiceResponse('Error in storage Transfer', ServiceResponse::ERROR, $e);
        }
    }
}
