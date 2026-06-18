<?php

namespace App\Services\Ledger\Expense;

use App\Enum\HttpStatus;
use App\Models\Sqlite\Ledger;
use App\Services\Ledger\DeleteLedgerService;
use App\Services\ServiceResponse;
use Exception;

class DeleteExpenseService {

    private $id;

    function __construct($id)
    {
        $this->id = $id;
    }

    function delete()
    {
        return (new DeleteLedgerService($this->id))->delete();
    }
}
