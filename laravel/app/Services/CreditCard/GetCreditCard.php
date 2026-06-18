<?php

namespace App\Services\CreditCard;

use App\Http\Resources\CreditCard\CreditCardListCollection;
use App\Models\Sqlite\CreditCard;
use App\Services\ServiceResponse;

class GetCreditCard
{
    function list()
    {
        $creditCards = CreditCard::all();
        return (new ServiceResponse())->setData(new CreditCardListCollection($creditCards));
    }
}
