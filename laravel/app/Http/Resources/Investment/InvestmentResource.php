<?php

namespace App\Http\Resources\Investment;

use Illuminate\Http\Resources\Json\JsonResource;

class InvestmentResource extends JsonResource
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
            'reason'=>$this->reasonData->reason,
            'category'=>$this->subCategory->sub_category,
            'amount'=>$this->debit
        ];
    }
}
