<?php


namespace App\Services\Ledger\Expense;


use App\Enum\Category;
use App\Enum\HttpStatus;
use App\Enum\LedgerType;
use App\Models\Sqlite\Ledger;
use App\Models\Sqlite\Master\PayMode;
use App\Models\Sqlite\Master\Reason;
use App\Models\Sqlite\Master\SubCategory;
use App\Services\Misc\CategoryService;
use App\Services\Misc\ReasonService;
use App\Services\Misc\SubCategoryService;
use App\Services\ServiceResponse;
use App\Traits\UtilTrait;
use Carbon\Carbon;
use Exception;

class AddExpenseService
{
    use UtilTrait;

    private $date, $reason, $category, $subCategory, $description, $amount, $payMode;

    public function __construct($date, $reason, $category, $subCategory, $description, $amount, $payMode)
    {
        $this->date = $date;
        $this->reason = $reason;
        $this->category = $category;
        $this->subCategory = $subCategory;
        $this->description = $description;
        $this->amount = $amount;
        $this->payMode = $payMode;
    }

    public function add()
    {
        try {
            $date = Carbon::parse($this->date)->format('Y-m-d');
            Ledger::create([
                'date' => $date,
                'name' => (new ReasonService($this->reason))->getId(),
                'category' => (new CategoryService($this->category))->getId(),
                'sub_category' => (new SubCategoryService($this->subCategory))->getId(),
                'description' => $this->description,
                'debit' => $this->amount,
                'pay_mode' => PayMode::payMode($this->payMode)->id,
                'type' => LedgerType::Expense,
            ]);

            if ($this->isCreditCard($this->payMode)) {
                Ledger::create([
                    'date' => $date,
                    'name' => (new ReasonService($this->payMode))->getId(),
                    'category' => (new CategoryService(Category::CreditCardExpense))->getId(),
                    'credit' => $this->amount,
                    'pay_mode' => PayMode::payMode($this->payMode)->id,
                    'type' => LedgerType::Income,
                ]);
            }

            return new ServiceResponse("$this->reason expense added");
        } catch (Exception $e) {
            return new ServiceResponse("Error in adding expense", HttpStatus::Error, $e);
        }
    }
}
