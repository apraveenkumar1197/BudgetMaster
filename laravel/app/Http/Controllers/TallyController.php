<?php

namespace App\Http\Controllers;

use App\Services\Tally\TallyReportService;
use Illuminate\Http\Request;

class TallyController extends Controller
{
    function report(Request $request)
    {
        return $this->http_response((new TallyReportService($request->fromMonth, $request->toMonth))->report());
    }
}
