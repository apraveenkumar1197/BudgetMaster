<?php


namespace App\Enum;

enum HttpStatus: int
{
    case Success = 200;
    case Error = 400;
    case ValidationError = 422;
}
