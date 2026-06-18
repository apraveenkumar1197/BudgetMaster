<?php
namespace App\Singleton;

use App\Models\Sqlite\Setting;

class RegisteredDatetimeSingleton {

    private static $registeredDate;

    public static function date()
    {
        if (!self::$registeredDate) {
            self::$registeredDate = Setting::registeredDate();
        }

        return self::$registeredDate;
    }
}
