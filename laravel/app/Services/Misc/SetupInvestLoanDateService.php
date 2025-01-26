<?php
namespace App\Services\Misc;

use DateTime;
use Illuminate\Support\Carbon;

class SetupInvestLoanDateService {
    private Carbon $dateTime;

    public function __construct($dateTime)
    {
        $this->dateTime = Carbon::parse($dateTime);
        $this->dateTime = $this->dateTime->subDay();
    }

    public function getDate(){
        return $this->dateTime;
    }

    public function getMysqlDate(){
        return $this->dateTime->format('Y-m-d');
    }
}
