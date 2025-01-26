<?php


namespace App\Services\Auth;


use App\Services\ServiceResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Lcobucci\JWT\Parser as JwtParser;

class LogoutService
{
    public function logout($bearerToken){

        $tokenId = (app(JwtParser::class)->parse($bearerToken)->claims()->get('jti'));
        DB::table('oauth_access_tokens')->where('id',$tokenId)->update(['revoked' => 1]);
        DB::table('oauth_refresh_tokens')->where('access_token_id',$tokenId)->update(['revoked'=>1]);

        return new ServiceResponse('Logged out');
    }
}
