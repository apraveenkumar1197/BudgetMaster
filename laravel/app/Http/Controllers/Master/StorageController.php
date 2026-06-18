<?php

namespace App\Http\Controllers\Master;

use App\Http\Controllers\Controller;
use App\Services\Storage\AddStorageService;
use App\Services\Storage\StorageListService;
use App\Services\Storage\StorageReport;
use App\Services\Storage\TransferStorageService;
use App\Validators\Storage\AddStorageValidator;
use Illuminate\Http\Request;

class StorageController extends Controller
{
    function index(){
        return $this->http_response((new StorageListService())->get());
    }

    function report(Request $request){
        return $this->http_response((new StorageReport($request->fromDate, $request->toDate, $request->fromStorageId, $request->toStorageId))->report());
    }

    function transfer(Request $request) {
        return $this->http_response((new TransferStorageService($request->date, $request->fromStorageId, $request->toStorageId, $request->amount))->transfer());
    }

    function store(Request $request){
        $validator = new AddStorageValidator($request);
        if($validator->isValid())
            return $this->http_response((new AddStorageService($request->name, $request->amount))->add());
        else
            return $validator->respondValidationError();
    }
}
