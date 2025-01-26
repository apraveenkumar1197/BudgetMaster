<?php


namespace App\Validators\Auth;


use App\Validators\Validator;
use App\Validators\ValidatorInterface;
use Illuminate\Http\Request;

class ValidateLoginOTPValidator extends Validator implements ValidatorInterface
{
    function validations()
    {
        return [
            'email' => 'required|email',
            'otp' => 'required|int|min:6'
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
