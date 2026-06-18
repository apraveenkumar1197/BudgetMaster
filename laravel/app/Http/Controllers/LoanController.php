<?php

namespace App\Http\Controllers;

use App\Services\Ledger\Loan\LoanFetcher;

class LoanController extends Controller
{
    function index()
    {
        return $this->http_response((new LoanFetcher())->fetch());
    }
}
