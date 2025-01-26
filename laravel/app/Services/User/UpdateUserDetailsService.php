<?php
namespace App\Services\User;

use App\Models\User;

class UpdateUserDetailsService {
    private User $user;
    private String $name;
    private String $mobileNo;

    public function __construct($userID,$name,$mobileNo){
        $this->name = $name;
        $this->mobileNo = $mobileNo;
        $this->user = User::find($userID);
    }

    function updateDetails(){
        $this->user->name = $this->name;
        $this->user->mobile_no = $this->mobileNo;
        $this->user->save();
        return [
            "data"=>[
                "msg"=>"User details updated successfully"
            ],
            "status"=> 200
        ];
    }
}
