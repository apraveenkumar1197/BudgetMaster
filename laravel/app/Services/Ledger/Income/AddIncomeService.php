<?php

namespace App\Services\Ledger\Income;

use App\Enum\HttpStatus;
use App\Enum\LedgerType;
use App\Models\Sqlite\Ledger;
use App\Models\Sqlite\Master\Category;
use App\Models\Sqlite\Master\PayMode;
use App\Models\Sqlite\Master\Reason;
use App\Models\Sqlite\Master\SubCategory;
use App\Services\Misc\CategoryService;
use App\Services\Misc\ReasonService;
use App\Services\Misc\SubCategoryService;
use App\Services\ServiceResponse;
use Carbon\Carbon;
use Exception;

class AddIncomeService
{
    private $date, $reason, $category, $subCategory, $description, $amount, $payMode;

    function __construct($date, $reason, $category, $subCategory, $description, $amount, $payMode)
    {
        $this->date = $date;
        $this->reason = $reason;
        $this->category = $category;
        $this->subCategory = $subCategory;
        $this->description = $description;
        $this->amount = $amount;
        $this->payMode = $payMode;
    }

    function add()
    {
        try {
            Ledger::create([
                'date' => Carbon::parse($this->date)->format('Y-m-d'),
                'name' => (new ReasonService($this->reason))->getId(),
                'category' => (new CategoryService($this->category))->getId(),
                'sub_category' => (new SubCategoryService($this->subCategory))->getId(),
                'description' => $this->description,
                'credit' => $this->amount,
                'pay_mode' => PayMode::payMode($this->payMode)->id,
                'type' => LedgerType::Income,
            ]);
            return new ServiceResponse("$this->reason income added");
        } catch (Exception $e) {
            return new ServiceResponse("Error in adding income", HttpStatus::Error);
        }
    }
}
