<?php

namespace App\Http\Resources\Ledger\Dues;

use App\Enum\ColorCode;
use Carbon\Carbon;
use Illuminate\Http\Resources\Json\JsonResource;

class DueListResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param \Illuminate\Http\Request $request
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
            'amount' => $this->debit,
            'colorFlag' => $this->colorFlag(),
            'isExpenseMade' => $this->isExpenseMadeForDue,
        ];
    }

    private function colorFlag()
    {

        if($this->isExpenseMadeForDue)
            return ColorCode::Green;

        $colorFlag = ColorCode::White;
        if(Carbon::parse($this->date)->format('Y-m') == Carbon::now()->format('Y-m')){
            $colorFlag = ColorCode::Cement;
        }
        if(Carbon::parse($this->date)->lt(Carbon::now())){
            $colorFlag = ColorCode::Red;
        }

        return $colorFlag;
    }
}
