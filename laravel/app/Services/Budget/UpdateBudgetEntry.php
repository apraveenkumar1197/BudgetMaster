<?php

namespace App\Services\Budget;

use App\Enum\HttpStatus;
use App\Models\Sqlite\Budget;
use App\Services\Misc\CategoryService;
use App\Services\Misc\ReasonService;
use App\Services\Misc\SubCategoryService;
use App\Services\ServiceResponse;
use Exception;

class UpdateBudgetEntry
{
    private $id, $month, $reason, $category, $subCategory, $amount;

    function __construct($id, $month, $reason, $category, $subCategory, $amount)
    {
        $this->id = $id;
        $this->month = $month;
        $this->reason = $reason;
        $this->category = $category;
        $this->subCategory = $subCategory;
        $this->amount = $amount;
    }

    function update()
    {
        try {
            $budget = Budget::find($this->id);
            if($budget == null) return new ServiceResponse('Invalid Budget ID', HttpStatus::ValidationError);

            $budget->update([
                'month' => $this->month,
                'reason' => (new ReasonService($this->reason))->getId(),
                'category' => (new CategoryService($this->category))->getId(),
                'sub_category' => (new SubCategoryService($this->subCategory))->getId(),
                'amount' => $this->amount
            ]);
            return new ServiceResponse('Budget updated successfully');
        } catch (Exception $e) {
            return new ServiceResponse('Error in updating Budget', HttpStatus::Error, $e);
        }
    }
}
