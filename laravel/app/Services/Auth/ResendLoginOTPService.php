<?php
namespace App\Services\Auth;


use App\Models\User;
use App\Traits\AuthTrait;
use Exception;

class ResendLoginOTPService {
    use AuthTrait;
    private $user;
    private $email;
    public function __construct($email)
    {
        $this->email = $email;
        $this->user = User::email($email)->first();
    }

    public function resend()
    {
        try{
            (new SendLoginOTPService($this->email))->send();
            return [
                "data"=> [
                    "msg"=>"OTP sent to your email $this->email"
                ],
                "status"=>200
            ];
        }
        catch (Exception $e){
            return [
                "data"=> [
                    "msg"=>"Error in sending OTP"
                ],
                "status"=>400
            ];
        }

    }
}
