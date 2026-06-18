<?php


namespace App\Validators;


use Illuminate\Http\Request;

interface ValidatorInterface
{
    function __construct(Request $request);
    function isValid();
    function validations();
}
