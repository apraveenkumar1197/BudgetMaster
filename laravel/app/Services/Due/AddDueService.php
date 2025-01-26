<?php

namespace App\Services\Due;

use App\Enum\HttpStatus;
use App\Enum\LedgerSecondaryType;
use App\Enum\LedgerType;
use App\Models\Sqlite\Ledger;
use App\Models\Sqlite\Master\SubCategory;
use App\Services\Misc\CategoryService;
use App\Services\Misc\ReasonService;
use App\Services\Misc\SubCategoryService;
use App\Services\ServiceResponse;
use Carbon\Carbon;
use Exception;

class AddDueService
{
    private $date, $reason, $category, $subCategory, $amount;
    function __construct($date, $reason, $category, $subCategory, $amount)
    {
        $this->date = $date;
        $this->reason = $reason;
        $this->category = $category;
        $this->subCategory = $subCategory;
        $this->amount = $amount;
    }

    function add()
    {
        try{
            $due = Ledger::create([
                'date' => Carbon::parse($this->date)->format('Y-m-d'),
                'name' => (new ReasonService($this->reason))->getId(),
                'category' => (new CategoryService($this->category))->getId(),
                'sub_category' => (new SubCategoryService($this->subCategory))->getId(),
                'debit' => $this->amount,
                'type' => LedgerType::Due,
            ]);
            return new ServiceResponse('Due added successfully');
        }
        catch (Exception $e){
            return new ServiceResponse('Error in adding Due', HttpStatus::Error);
        }
    }
}
