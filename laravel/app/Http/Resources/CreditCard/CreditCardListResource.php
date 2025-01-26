<?php

namespace App\Http\Resources\CreditCard;

use Illuminate\Http\Resources\Json\JsonResource;

class CreditCardListResource extends JsonResource
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
            'name' => $this->name,
            'holder' => $this->holder_name,
        ];
    }
}
