<?php


namespace App\Validators\Auth;


use App\Validators\Validator;
use App\Validators\ValidatorInterface;
use Illuminate\Http\Request;

class SendLoginOTPValidator extends Validator implements ValidatorInterface
{
    function validations()
    {
        return [
            'email' => 'required|email'
        ];
    }

    function isValid()
    {
        $isValid = $this->validate(
            $this->request,
            $this->validations()
        );
        return $isValid;
    }
}
