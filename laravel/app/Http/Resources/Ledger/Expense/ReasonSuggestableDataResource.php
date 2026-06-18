<?php

namespace App\Http\Resources\Ledger\Expense;

use Illuminate\Http\Resources\Json\JsonResource;

class ReasonSuggestableDataResource extends JsonResource
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
            $this->reason->name => [
                'category' => $this->category->name,
                'sub_category' => $this->subCategory->name,
                'pay_mode' => $this->payMode->name,
            ]
        ];
    }
}
