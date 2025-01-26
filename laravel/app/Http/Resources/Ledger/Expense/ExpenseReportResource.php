<?php

namespace App\Http\Resources\Ledger\Expense;

use Illuminate\Http\Resources\Json\JsonResource;

class ExpenseReportResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'date' => $this->date,
            'reason' => $this->name == null ? null : [
                'id' => $this->name,
                'name' => $this->reasonData->reason,
            ],
            'category' => $this->category == null ? null : [
                'id' => $this->category,
                'name' => $this->categoryData->category
            ],
            'subCategory' => $this->sub_category == null ? null : [
                'id' => $this->sub_category,
                'name' => $this->subCategory->sub_category
            ],
            'payMode' =>  $this->payMode == null ? null : [
                'id' => $this->pay_mode,
                'name' => $this->payMode->pay_mode
            ],
            'amount' => $this->debit,
            'description' => $this->description
        ];
    }
}
