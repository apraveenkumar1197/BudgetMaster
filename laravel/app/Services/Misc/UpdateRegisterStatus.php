<?php
namespace App\Services\Misc;

use App\Models\Sqlite\Setting;
use Carbon\Carbon;

class UpdateRegisterStatus {

    function update(){
        Setting::where('key','IS_REGISTRATION_COMPLETED')
            ->update([
                'value' => 1
            ]);
        Setting::create([
            'key' => 'REGISTERED_DATE',
            'value' => Carbon::now()->format('Y-m-d')
        ]);

        return [
            "data"=>[
                "msg"=>"Status updated successfully"
            ],
            "status"=>200
        ];
    }
}
