<?php
namespace App\Traits;

use GuzzleHttp\Client as HTTPClient;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\DB;

trait AuthTrait {
    function login($emailID,$password){
        $data = [
            'grant_type' => 'password',
            'client_id' => env('OAUTH_CLIENT_ID'),
            'client_secret' => env('OAUTH_CLIENT_SECRET'),
            'username' => $emailID,
            'password' => $password,
            'scope' => '*',
        ];
        return $this->httpCall($data);
    }
    function refresh($refreshToken){
        $data = [
            'grant_type' => 'refresh_token',
            'refresh_token' => $refreshToken,
            'client_id' => env('OAUTH_CLIENT_ID'),
            'client_secret' => env('OAUTH_CLIENT_SECRET'),
            'scope' => '',
        ];
        return $this->httpCall($data);
    }


    function httpCall($data){
        $http = new HTTPClient(['verify' => App::environment('production')]);
        $response = $http->request("POST",env('ROOT_PATH').'oauth/token', ['form_params'=>$data,'defaults' => [ 'exceptions' => false ],'http_errors' => false]);
        return ($response);
    }
}
