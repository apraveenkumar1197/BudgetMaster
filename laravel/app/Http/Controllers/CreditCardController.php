<?php

namespace App\Http\Controllers;

use App\Services\CreditCard\AddCreditCard;
use App\Services\CreditCard\GetCreditCard;
use Illuminate\Http\Request;

class CreditCardController extends Controller
{
    function index()
    {
        return $this->http_response((new GetCreditCard())->list());
    }

    function store(Request $request)
    {
        return $this->http_response((new AddCreditCard($request->name, $request->holderName))->add());
    }
}
