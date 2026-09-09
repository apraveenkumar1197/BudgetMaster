<?php

namespace App\Providers;

use App\Services\Backup\DropboxRefreshTokenProvider;
use Illuminate\Filesystem\FilesystemAdapter;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\ServiceProvider;
use League\Flysystem\Filesystem;
use Spatie\Dropbox\Client as DropboxClient;
use Spatie\FlysystemDropbox\DropboxAdapter;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        Storage::extend('dropbox', function ($app, $config) {
            // spatie/dropbox-api has no built-in refresh-token support — its
            // own docs say to supply a TokenProvider that fetches a fresh
            // short-lived access token as needed, which is what this does
            // instead of a static token that would eventually stop working.
            $tokenProvider = new DropboxRefreshTokenProvider(
                $config['client_id'],
                $config['client_secret'],
                $config['refresh_token'],
            );

            $client = new DropboxClient($tokenProvider);

            $adapter = new DropboxAdapter($client);

            return new FilesystemAdapter(
                new Filesystem($adapter),
                $adapter,
                $config,
            );
        });
    }
}
