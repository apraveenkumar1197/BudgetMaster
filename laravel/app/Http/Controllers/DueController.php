<?php

namespace App\Http\Controllers;

use App\Services\Due\AddDueService;
use App\Services\Due\DeleteDue;
use App\Services\Due\GetDuesList;
use App\Services\Due\GetMonthDues;
use Illuminate\Http\Request;

class DueController extends Controller
{
    public function index(Request $request)
    {
        return $this->http_response((new GetDuesList($request->month))->get());
    }

    public function month(Request $request)
    {
        return $this->http_response((new GetMonthDues($request->month))->get());
    }

    public function store(Request $request)
    {
        return $this->http_response((new AddDueService(
            $request->date,
            $request->reason,
            $request->category,
            $request->subCategory,
            $request->amount,
            $request->isRecursive,
            $request->recursiveFrequency,
            $request->recursiveTill,
        ))->add());
    }

    public function destroy($id)
    {
        return $this->http_response((new DeleteDue($id))->delete());
    }
}
