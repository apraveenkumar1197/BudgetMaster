<?php

namespace App\Services\Storage;

use App\Models\Sqlite\Storage;
use App\Services\ServiceResponse;

class StorageListService
{

    private $fromDate, $toDate;

    function __construct($fromDate = null, $toDate = null)
    {
        $this->fromDate = $fromDate;
        $this->toDate = $toDate;
    }

    public function get()
    {
        $storages = Storage::all();
        $allStorages = collect($storages->map(function ($storage) {
            return [
                'id' => $storage->id,
                'name' => $storage->name,
                'amount' => $storage->getAmount($this->fromDate, $this->toDate),
                'credit_card' => $storage->isCreditCard($storage->name),
            ];
        }));
        $nonCreditCardStorages = $allStorages->filter(function ($storage) {
            return $storage['amount'] != 0 && !$storage['credit_card'] ;
        });
        $creditCardStorages = $allStorages->filter(function ($storage) {
            return $storage['credit_card'];
        });


        return (new ServiceResponse())->setData([
            'list' => $nonCreditCardStorages->merge($creditCardStorages),
            'total' => $nonCreditCardStorages->sum('amount') - $creditCardStorages->sum('amount'),
            'all' => $allStorages->except(['credit_card', 'amount'])->values()
        ]);
    }
}
