<?php

namespace App\Services\Storage;

use App\Enum\LedgerType;
use App\Models\Sqlite\Ledger;
use App\Models\Sqlite\Master\PayMode;
use App\Models\Sqlite\Storage;
use Illuminate\Support\Carbon;

class AddStorageService{
    private $name, $amount;

    public function __construct($name, $amount){
        $this->name = $name;
        $this->amount = $amount;
    }

    public function add(){
        try{

            $storage = Storage::firstOrCreate([
                'name' => $this->name,
            ]);
            $payMode = PayMode::firstOrCreate([
                'pay_mode' => $this->name,
                'storage_id' => $storage->id
            ]);
            Ledger::create([
                'date' => Carbon::now()->format('Y-m-d'),
                'credit' => $this->amount,
                'pay_mode' => $payMode->id,
                'type' => LedgerType::Storage,
            ]);

            return [
                "data"=>[
                    "msg"=>"$this->name storage added"
                ],
                "status"=>200
            ];
        }
        catch (\Exception $e){
            return [
                "data"=>[
                    "msg"=>'Error in updating status'
                ],
                "status"=>200
            ];
        }
    }
}
