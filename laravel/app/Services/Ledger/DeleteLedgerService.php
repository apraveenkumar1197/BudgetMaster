<?php
namespace App\Services\Ledger;

use App\Enum\HttpStatus;
use App\Models\Sqlite\Ledger;
use App\Services\ServiceResponse;
use Exception;

class DeleteLedgerService {
    private $id;
    function __construct($id)
    {
        $this->id = $id;
    }

    function delete()
    {
        try{
            $ledger = Ledger::find($this->id);
            if($ledger == null) return new ServiceResponse('Ledger not found', HttpStatus::ValidationError);
            $ledger->delete();
            return new ServiceResponse('Ledger deleted successfully');
        }
        catch(Exception $e){
            return new ServiceResponse('Error in deleting Ledger',HttpStatus::Error, $e);
        }
    }
}
