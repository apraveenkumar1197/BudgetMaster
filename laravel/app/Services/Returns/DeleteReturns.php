<?php

namespace App\Services\Returns;

use App\Enum\HttpStatus;
use App\Models\Sqlite\Ledger;
use App\Services\ServiceResponse;
use Exception;

class DeleteReturns
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
            return new ServiceResponse('Returns deleted');
        }
        catch (Exception $e){
            return new ServiceResponse('Error in deleting returns', HttpStatus::Error, $e);
        }
    }
}
