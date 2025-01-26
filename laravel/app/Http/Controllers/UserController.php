<?php

namespace App\Http\Controllers;

use App\Http\Resources\User\UserResource;
use App\Services\Auth\SendLoginOTPService;
use App\Services\User\UpdateUserDetailsService;
use App\Validators\Auth\SendLoginOTPValidator;
use App\Validators\User\UpdateUserDetailsValidator;
use Illuminate\Http\Request;

class UserController extends Controller
{
    function getUserDetails(){
        return $this->http_response([
            "data"=> new UserResource(auth()->user()),
            "status"=> 200
        ]);

    }
    function updateDetails(Request $request)
    {
        $userID = auth()->id();
        $validator = new UpdateUserDetailsValidator($request);
        if($validator->isValid())
            return $this->http_response((new UpdateUserDetailsService($userID,$request->name,$request->mobileNo))->updateDetails());
        else
            return $validator->respondValidationError();
    }
}
