<?php


namespace App\Validators\Investment;


use App\Validators\Validator;
use App\Validators\ValidatorInterface;
use Illuminate\Http\Request;

class AddInvestmentValidator extends Validator implements ValidatorInterface
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
            'reason' => 'required',
            'category' => 'required',
            'amount' => 'required',
        ];
    }
}
