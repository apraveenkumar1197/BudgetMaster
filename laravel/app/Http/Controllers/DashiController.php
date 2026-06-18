<?php

namespace App\Http\Controllers;


use App\Services\Dashi\DashiDataService;

class DashiController extends Controller
{
    function index()
    {
        return $this->http_response((new DashiDataService())->get());
    }
}
