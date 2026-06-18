<?php
namespace App\Services\Auth;

use App\Models\Sqlite\Setting;
use App\Models\User;
use App\Services\DB\SqliteSetup;
use App\Traits\AuthTrait;

class ValidateLoginOTPService {
    use AuthTrait;
    private $email, $otp;

    public function __construct($email, $otp){
        $this->email = $email;
        $this->otp = $otp;
    }

    public function verify(){
        $user = User::email($this->email)->first();
        if($user->otp == null){
            return [
                "data" => ["msg"=>"OTP expired, Regenerate OTP"],
                "status" => 400
            ];
        }
        if($user->otp != $this->otp){
            return [
                "data" => ["msg"=>"Invalid OTP"],
                "status" => 400
            ];
        }

        $authResponseData = $this->login($this->email,$this->otp);
        $authResponseDataBody = json_decode($authResponseData->getBody()->getContents(),true);

        new SqliteSetup($user);

        $authResponseDataBody['is_registration_completed'] = Setting::isRegistered();

        User::email($this->email)->update(["otp"=>null]);
        return [
            "data"=> $authResponseDataBody,
            "status"=>$authResponseData->getStatusCode()
        ];
    }
}
