<?php

namespace App\Http\Controllers;

use App\Services\Due\DeleteDue;
use App\Services\Due\GetDuesList;
use App\Services\Returns\AddReturnsService;
use App\Services\Returns\DeleteReturns;
use App\Services\Returns\GetReturnsList;
use Illuminate\Http\Request;

class ReturnsController extends Controller
{
    public function index(Request $request)
    {
        return $this->http_response((new GetReturnsList($request->month))->get());
    }

    public function store(Request $request)
    {
        return $this->http_response((new AddReturnsService($request->date, $request->reason, $request->category, $request->subCategory, $request->amount))->add());
    }

    public function destroy($id)
    {
        return $this->http_response((new DeleteReturns($id))->delete());
    }
}
