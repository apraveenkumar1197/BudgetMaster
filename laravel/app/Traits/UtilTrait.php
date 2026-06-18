<?php

namespace App\Traits;

use App\Models\Sqlite\CreditCard;
use App\Models\Sqlite\Master\PayMode;
use Carbon\Carbon;
use Carbon\CarbonPeriod;

trait UtilTrait
{
    function getAllMonths($start, $end)
    {
        $months = [];
        $start = Carbon::parse($start);
        $start->setDay(1);
        foreach (CarbonPeriod::create($start, '1 month', $end) as $month) {
            $months[] = $month->format('Y-m');
        }
        return collect($months);
    }

    function isCreditCard($payMode)
    {
        return CreditCard::name($payMode)->count() > 0;
    }
}
