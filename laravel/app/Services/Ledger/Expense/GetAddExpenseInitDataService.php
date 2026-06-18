<?php

namespace App\Services\Ledger\Expense;

use App\Enum\LedgerType;
use App\Models\Sqlite\Ledger;
use App\Services\Misc\CategoryListService;
use App\Services\Misc\PayModeListService;
use App\Services\Misc\ReasonListService;
use App\Services\ServiceResponse;

class GetAddExpenseInitDataService
{
    function get()
    {
        $ledgerType = LedgerType::Expense;
        return (new ServiceResponse())->setData([
            'reasons' => (new ReasonListService($ledgerType))->list()->getData()->pluck('reason'),
            'categories' => (new CategoryListService($ledgerType))->list()->getData()->pluck('category'),
            'subCategories' => $this->subCategories(),
            'payModes' => (new PayModeListService($ledgerType))->list()->getData()->pluck('pay_mode'),
        ]);
    }

    private function subCategories(){
        $data = [];
        $expenseLedger = Ledger::expenses()->groupBy('category', 'sub_category')
            ->select('category', 'sub_category')
            ->get();
        foreach ($expenseLedger as $expLed){
            if($expLed->subCategory != null)
                $data[$expLed->categoryData->category][] = $expLed->subCategory->sub_category;
        }
        return $data;
    }
}
