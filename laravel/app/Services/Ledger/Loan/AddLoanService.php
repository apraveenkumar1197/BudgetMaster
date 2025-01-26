<?php
namespace App\Services\Ledger\Loan;

use App\Enum\LedgerSecondaryType;
use App\Enum\LedgerType;
use App\Models\Sqlite\Ledger;
use App\Services\Misc\CategoryService;
use App\Services\Misc\ReasonService;
use App\Services\Misc\SetupInvestLoanDateService;

class AddLoanService {
    private $reason, $category, $amount;

    public function __construct($reason, $category, $amount)
    {
        $this->reason = $reason;
        $this->category = $category;
        $this->amount = $amount;
    }

    public function add(){
        try {
            Ledger::create([
                'date' => (new SetupInvestLoanDateService(auth()->user()->created_at))->getMysqlDate(),
                'name' => (new ReasonService($this->reason))->getId(),
                'category' => (new CategoryService(LedgerSecondaryType::Loan))->getId(),
                'sub_category' => (new CategoryService($this->category))->getId(),
                'credit' => $this->amount,
                'type' => LedgerType::Income,
            ]);
            return [
                "data"=> [
                    "msg"=>"$this->reason loan added"
                ],
                "status"=>200
            ];
        }
        catch (\Exception $e){
            return [
                "data"=> [
                    "msg"=>"Error in adding investment"
                ],
                "status"=>400
            ];
        }
    }
}
