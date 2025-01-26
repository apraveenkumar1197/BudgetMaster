<?php

namespace App\Http\Resources\Investment;

use App\Models\Sqlite\Ledger;
use Illuminate\Http\Resources\Json\JsonResource;

class MyInvestmentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {

        $investmentReturnAmount = 0;
        $investmentReturn = Ledger::incomes()
            ->investmentReturns()
            ->reason($this->name)
            ->selectRaw("*,sum(credit) as amount")
            ->groupBy('name')
            ->first();
        if($investmentReturn != null){
            $investmentReturnAmount = $investmentReturn->amount;
        }

        return [
            'reason'=>$this->reasonData->reason,
            'category'=>$this->subCategory->sub_category,
            'amount'=>$this->amount - $investmentReturnAmount
        ];
    }
}
