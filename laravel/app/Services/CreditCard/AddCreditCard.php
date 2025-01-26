<?php

namespace App\Services\CreditCard;

use App\Enum\HttpStatus;
use App\Models\Sqlite\CreditCard;
use App\Models\Sqlite\Master\PayMode;
use App\Models\Sqlite\Storage;
use App\Services\ServiceResponse;
use Exception;

class AddCreditCard {
    private $name, $holderName;
    function __construct($name, $holderName)
    {
        $this->name = $name;
        $this->holderName = $holderName;
    }

    function add()
    {
        try{
            CreditCard::create([
                'name' => $this->name,
                'holder_name' => $this->holderName,
            ]);
            $storage = Storage::updateOrCreate([
                'name' => $this->name
            ]);
            PayMode::updateOrCreate([
                'pay_mode' => $this->name,
                'storage_id' => $storage->id,
            ]);

            return new ServiceResponse('Credit card added');
        }
        catch (Exception $e){
            return new ServiceResponse('Error in adding credit card', HttpStatus::Error, $e);
        }
    }
}
