<?php

namespace App\Http\Resources\Loan;

use Illuminate\Http\Resources\Json\JsonResource;

class LoanResource extends JsonResource
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
            'reason'=>$this->reason->reason,
            'category'=>$this->subCategory->category,
            'amount'=>$this->credit
        ];
    }
}
