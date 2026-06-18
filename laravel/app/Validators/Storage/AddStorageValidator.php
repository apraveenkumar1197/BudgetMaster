<?php

namespace App\Validators\Storage;

use App\Validators\Validator;
use App\Validators\ValidatorInterface;

class AddStorageValidator  extends Validator implements ValidatorInterface {

    function isValid()
    {
        $isValid = $this->validate(
            $this->request,
            $this->validations()
        );
        return $isValid;    }

    function validations()
    {
        return [
            'name' => 'required',
            'amount' => 'required',
        ];
    }
}

