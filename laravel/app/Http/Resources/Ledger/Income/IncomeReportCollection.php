<?php

namespace App\Http\Resources\Ledger\Income;

use Illuminate\Http\Resources\Json\ResourceCollection;

class IncomeReportCollection extends ResourceCollection
{
    /**
     * Transform the resource collection into an array.
     *
     * @param \Illuminate\Http\Request $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        return [
            'list' => $this->collection,
            'amount' => $this->collection->sum('credit')
        ];
    }
}
