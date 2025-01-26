<?php

namespace App\Services;

use App\Enum\HttpStatus;

class ServiceResponse
{

    const SUCCESS = 200;
    const ERROR = 400;

    private $status, $msg, $data, $exception;

    function __construct($msg = null, $status = HttpStatus::Success, $exception = null)
    {
        $this->status = $status;
        $this->msg = $msg;
        $this->exception = $exception;
        return $this;
    }

    function getMsg()
    {
        return $this->msg;
    }

    function getData()
    {
        return $this->data;
    }

    function setData($data = null)
    {
        $this->data = $data;
        return $this;
    }

    function getStatus()
    {
        return $this->status;
    }
}
