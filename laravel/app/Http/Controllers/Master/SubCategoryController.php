<?php

namespace App\Http\Controllers\Master;

use App\Http\Controllers\Controller;
use App\Services\Misc\SubCategoryListService;
use Illuminate\Http\Request;

class SubCategoryController extends Controller
{
    function index(Request $request)
    {
        return $this->http_response((new SubCategoryListService($request->categoryId, $request->ledgerType, $request->fromDate, $request->toDate))->list());
    }
}
