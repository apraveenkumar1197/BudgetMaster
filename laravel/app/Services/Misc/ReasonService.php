<?php
namespace App\Services\Misc;

use App\Models\Sqlite\Master\Reason;

class ReasonService {
    private $reason;
    public function __construct($reason)
    {
        $this->reason = $reason;
    }

    public function getId(){
        if($this->reason == null) return null;
        $reason = Reason::updateOrCreate(['reason'=>$this->reason],[]);
        return $reason->id;
    }

}
