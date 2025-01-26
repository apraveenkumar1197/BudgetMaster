<?php

namespace App\Http\Controllers;

use App\Services\Auth\LogoutService;
use App\Services\Auth\SendLoginOTPService;
use App\Services\Auth\ValidateLoginOTPService;
use App\Validators\Auth\SendLoginOTPValidator;
use App\Validators\Auth\ValidateLoginOTPValidator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    function getLoginOTP(Request $request){
        $validator = new SendLoginOTPValidator($request);
        if($validator->isValid())
            return $this->http_response((new SendLoginOTPService($request->email))->send());
        else
            return $validator->respondValidationError();
    }
    function resendLoginOTP(Request $request){
        $validator = new ValidateLoginOTPValidator($request);
        if($validator->isValid())
            return $this->http_response((new ValidateLoginOTPService($request->email,$request->otp))->verify());
        else
            return $validator->respondValidationError();
    }
    function validateLoginOTP(Request $request){
        $validator = new ValidateLoginOTPValidator($request);
        if($validator->isValid())
            return $this->http_response((new ValidateLoginOTPService($request->email,$request->otp))->verify());
        else
            return $validator->respondValidationError();
    }
    function checkToken(){
        return $this->http_response(['data'=>['status'=>Auth::guard('api')->check()],'status'=>200]);
    }
    function logout(Request $request){
       return $this->http_response((new LogoutService())->logout($request->bearerToken()));
    }
}
