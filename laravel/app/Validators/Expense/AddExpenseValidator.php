<?php


namespace App\Validators\Expense;


use App\Validators\Validator;
use App\Validators\ValidatorInterface;
use Illuminate\Http\Request;

class AddExpenseValidator extends Validator implements ValidatorInterface
{
    function validations()
    {
        return [
            'date' => 'required',
            'reason' => 'required',
            'category' => 'required',
            'amount' => 'required',
            'payMode' => 'required',
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
