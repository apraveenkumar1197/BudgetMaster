<?php

namespace App\Http\Resources\Investment;

use Illuminate\Http\Resources\Json\JsonResource;

class InvestmentMonthlySubCategoryResource extends JsonResource
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
            'name' => $this->subCategory->sub_category,
            'amount' => $this->amount
        ];
    }
}
