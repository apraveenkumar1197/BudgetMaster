<?php

namespace App\Services\Budget;

use App\Enum\HttpStatus;
use App\Models\Sqlite\Budget;
use App\Services\ServiceResponse;

class DeleteBudgetEntry {
    private $id;
    public function __construct($id)
    {
        $this->id = $id;
    }

    function delete()
    {
        try{
            Budget::find($this->id)->delete();
            return new ServiceResponse('Budget entry deleted', HttpStatus::Success);
        }
        catch (\Exception $e){
            return new ServiceResponse('Error in deleting Budget entry', HttpStatus::Error, $e);
        }
    }
}
