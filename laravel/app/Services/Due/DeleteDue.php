<?php

namespace App\Services\Due;

use App\Enum\HttpStatus;
use App\Models\Sqlite\Ledger;
use App\Services\ServiceResponse;
use Exception;

class DeleteDue
{
    private $id;
    function __construct($id)
    {
        $this->id = $id;
    }

    function delete()
    {
        try{
            Ledger::find($this->id)->delete();
            return new ServiceResponse('Due deleted');
        }
        catch (Exception $e){
            return new ServiceResponse('Error in deleting due', HttpStatus::Error, $e);
        }
    }
}
