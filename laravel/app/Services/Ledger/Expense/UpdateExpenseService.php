<?php


namespace App\Services\Ledger\Expense;


use App\Enum\HttpStatus;
use App\Enum\LedgerType;
use App\Models\Sqlite\Ledger;
use App\Models\Sqlite\Master\PayMode;
use App\Services\Misc\CategoryService;
use App\Services\Misc\ReasonService;
use App\Services\Misc\SubCategoryService;
use App\Services\ServiceResponse;
use App\Traits\UtilTrait;
use Carbon\Carbon;
use Exception;

class UpdateExpenseService
{
    use UtilTrait;
    private $id, $date, $reason, $category, $subCategory, $description, $amount, $payMode;

    public function __construct($id, $date, $reason, $category, $subCategory, $description, $amount, $payMode)
    {
        $this->id = $id;
        $this->date = $date;
        $this->reason = $reason;
        $this->category = $category;
        $this->subCategory = $subCategory;
        $this->description = $description;
        $this->amount = $amount;
        $this->payMode = $payMode;
    }

    public function update()
    {
        try {
            $date = Carbon::parse($this->date)->format('Y-m-d');
            Ledger::find($this->id)->update([
                'date' => $date,
                'name' => (new ReasonService($this->reason))->getId(),
                'category' => (new CategoryService($this->category))->getId(),
                'sub_category' => (new SubCategoryService($this->subCategory))->getId(),
                'description' => $this->description,
                'debit' => $this->amount,
                'pay_mode' => PayMode::payMode($this->payMode)->id,
            ]);

            if ($this->isCreditCard($this->payMode)) {
                Ledger::updateOrCreate([
                    'date' => $date,
                    'name' => (new ReasonService($this->payMode))->getId(),
                    'type' => LedgerType::Income,
                ],[
                    'credit' => $this->amount,
                    'pay_mode' => PayMode::payMode($this->payMode)->id,
                ]);
            }

            return new ServiceResponse("$this->reason expense updated");
        } catch (Exception $e) {
            return new ServiceResponse("Error in updating expense", HttpStatus::Error, $e);
        }
    }
}
