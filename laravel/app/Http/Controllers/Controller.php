<?php

namespace App\Http\Controllers;

use App\Services\ServiceResponse;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;

class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    function http_response($serviceResponse){
        if(gettype($serviceResponse) == 'array')
            return response()->json($serviceResponse["data"],$serviceResponse["status"]);

        $data = [];
        if($serviceResponse->getData() != null)
            $data['data'] = $serviceResponse->getData();
        if($serviceResponse->getMsg() != null)
            $data['msg'] = $serviceResponse->getMsg();

        return response()->json($data, $this->resCode($serviceResponse->getStatus()));
    }

    function resCode($val){
        if(is_int($val)) return $val;
        return  $val->value;
    }
}
