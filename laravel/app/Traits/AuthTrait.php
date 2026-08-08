<?php
namespace App\Traits;

use GuzzleHttp\Client as HTTPClient;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\DB;

trait AuthTrait {
    private function passwordGrantClient(){
        $client = DB::table('oauth_clients')
            ->where('password_client', true)
            ->where('revoked', false)
            ->first();

        if (!$client) {
            throw new \RuntimeException('No active OAuth password grant client found in oauth_clients table.');
        }

        return $client;
    }

    function login($emailID,$password){
        $client = $this->passwordGrantClient();
        $data = [
            'grant_type' => 'password',
            'client_id' => $client->id,
            'client_secret' => $client->secret,
            'username' => $emailID,
            'password' => $password,
            'scope' => '*',
        ];
        return $this->httpCall($data);
    }
    function refresh($refreshToken){
        $client = $this->passwordGrantClient();
        $data = [
            'grant_type' => 'refresh_token',
            'refresh_token' => $refreshToken,
            'client_id' => $client->id,
            'client_secret' => $client->secret,
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
