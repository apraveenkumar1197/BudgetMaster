<?php

namespace App\Services\Backup;

use GuzzleHttp\Client as HttpClient;
use Spatie\Dropbox\TokenProvider;

/**
 * spatie/dropbox-api ships no built-in OAuth refresh-token support — its own
 * README says to supply a TokenProvider that fetches a fresh access token as
 * needed. This exchanges the long-lived refresh token for a short-lived
 * access token via Dropbox's own OAuth endpoint, once per command run.
 */
class DropboxRefreshTokenProvider implements TokenProvider
{
    private ?string $cachedToken = null;

    public function __construct(
        private readonly string $clientId,
        private readonly string $clientSecret,
        private readonly string $refreshToken,
    ) {
    }

    public function getToken(): string
    {
        if ($this->cachedToken !== null) {
            return $this->cachedToken;
        }

        $response = (new HttpClient())->post('https://api.dropboxapi.com/oauth2/token', [
            'form_params' => [
                'grant_type' => 'refresh_token',
                'refresh_token' => $this->refreshToken,
                'client_id' => $this->clientId,
                'client_secret' => $this->clientSecret,
            ],
        ]);

        $data = json_decode($response->getBody()->getContents(), true);

        return $this->cachedToken = $data['access_token'];
    }
}
