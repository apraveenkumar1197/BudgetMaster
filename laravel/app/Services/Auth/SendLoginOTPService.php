<?php
namespace App\Services\Auth;


use App\Mail\SendLoginOTPMail;
use App\Models\User;
use App\Traits\AuthTrait;
use Exception;
use Illuminate\Support\Facades\Mail;

class SendLoginOTPService {
    use AuthTrait;
    private $user;
    private $email;
    public function __construct($email)
    {
        $this->email = $email;
        $this->user = User::email($email)->first();
    }

    public function send()
    {
        try{
            if($this->user == null)
                $this->user = User::create(["email"=>$this->email]);

            if($this->user->otp == null){
                $this->user->otp = rand(111111,999999);
                $this->user->save();
            }

            Mail::to($this->user->email)->send(new SendLoginOTPMail($this->user));
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
