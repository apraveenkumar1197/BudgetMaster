<?php

namespace App\Models\Sqlite\Master;

use App\Models\Sqlite\CreditCard;
use App\Models\Sqlite\Storage;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PayMode extends Model
{
    use HasFactory;

    protected $connection = 'sqlite';
    public $timestamps = false;
    protected $fillable = ['pay_mode', 'storage_id'];

    function scopePayMode($query, $payMode)
    {
        return $query->where('pay_mode', $payMode)->first();
    }

    function scopeIds($query, $ids)
    {
        return $query->whereIn('id', $ids);
    }

    function scopeCreditCards($query)
    {
        return $query->whereIn('storage_id', Storage::creditCards()->pluck('id'));
    }

    function storage()
    {
        return $this->belongsTo(Storage::class, 'storage_id', 'id');
    }
}
