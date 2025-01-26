<?php

namespace App\Http\Resources\Ledger\Returns;

use Illuminate\Http\Resources\Json\JsonResource;

class ReturnsListResource extends JsonResource
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
            'amount' => $this->credit
        ];
    }
}
