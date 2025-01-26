<?php


namespace App\Validators\User;


use App\Validators\Validator;
use App\Validators\ValidatorInterface;
use Illuminate\Http\Request;

class UpdateUserDetailsValidator extends Validator implements ValidatorInterface
{
    function isValid()
    {
        $isValid = $this->validate(
            $this->request,
            $this->validations()
        );
        return $isValid;
    }

    function validations()
    {
        return [
            'name' => 'required|max:50',
        ];
    }
}
