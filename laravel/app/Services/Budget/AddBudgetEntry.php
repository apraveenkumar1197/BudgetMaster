<?php
namespace App\Services\Budget;

use App\Enum\HttpStatus;
use App\Models\Sqlite\Budget;
use App\Services\Misc\CategoryService;
use App\Services\Misc\ReasonService;
use App\Services\Misc\SubCategoryService;
use App\Services\ServiceResponse;
use Exception;

class AddBudgetEntry {
    private $month, $reason, $category, $subCategory, $amount;
    function __construct($month, $reason, $category, $subCategory, $amount)
    {
        $this->month = $month;
        $this->reason = $reason;
        $this->category = $category;
        $this->subCategory = $subCategory;
        $this->amount = $amount;
    }

    function add()
    {
        try{
            Budget::create([
                'month' => $this->month,
                'reason' => (new ReasonService($this->reason))->getId(),
                'category' => (new CategoryService($this->category))->getId(),
                'sub_category' => (new SubCategoryService($this->subCategory))->getId(),
                'amount' => $this->amount
            ]);
            return new ServiceResponse('Budget added successfully');
        }
        catch (Exception $e){
            return new ServiceResponse('Error in adding Budget', HttpStatus::Error, $e);
        }
    }
}
