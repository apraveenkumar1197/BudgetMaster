<?php

namespace App\Http\Resources\Ledger\Expense;

use Illuminate\Http\Resources\Json\ResourceCollection;

class ExpenseReportCollection extends ResourceCollection
{
    /**
     * Transform the resource collection into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        return [
            'list' => $this->collection,
            'total' => $this->collection->sum('debit'),
        ];
    }
}
